import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { businessApi, bookingApi, serviceApi, reviewApi } from '@/lib/api'
import { Spinner } from '@/components/ui'
import { Star, Calendar, MapPin, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'
import { z } from 'zod'
import toast from 'react-hot-toast'

// ── Design tokens (matches the UniteOman HTML mock) ──
const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`
const AI_GRADIENT = `linear-gradient(135deg, ${BRAND_FROM} 0%, #4B6EF5 100%)`

const STATIC_SERVICES = [
  {
    id: 'ac-deep-cleaning',
    name: 'AC Deep Cleaning',
    description: '~45 mins · Materials included',
    price: 'OMR 15',
    icon: '❄️',
    bg: '#DBEAFE'
  },
  {
    id: 'ac-repair-diagnosis',
    name: 'AC Repair & Diagnosis',
    description: '~60 mins · Parts extra',
    price: 'OMR 25',
    icon: '🔩',
    bg: '#FEF3C7'
  },
  {
    id: 'annual-ac-contract',
    name: 'Annual AC Contract',
    description: '2 services/yr · Priority support',
    price: 'OMR 89/yr',
    icon: '📋',
    bg: '#D1FAE5'
  }
]

// ── Validation schema for the contact fields ──
const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
})

export default function ProfessionalProfilePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const navState = location.state || {}

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', slug],
    queryFn: () => businessApi.get(slug)
  })


  // Build a rolling 4-day strip starting today (mirrors the mock's Fri/Sat/Sun/Mon)
  const dates = useMemo(() => {
    const arr = []
    for (let i = 0; i < 4; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      arr.push({
        full: d.toISOString().split('T')[0],
        day: d.getDate(),
        weekday: d.toLocaleString('en-US', { weekday: 'short' })
      })
    }
    return arr
  }, [])

  const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM']

  const storedServices = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(`biz-services:${slug}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [slug])

  const preloadedServices =
    (navState.businessId && business?.id && navState.businessId === business.id && Array.isArray(navState.services))
      ? navState.services
      : (Array.isArray(storedServices) ? storedServices : null)

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: () => serviceApi.listByBusiness(business?.id),
    enabled: !!business?.id,
    initialData: preloadedServices || undefined,
    staleTime: 5 * 60 * 1000,
  })

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError
  } = useQuery({
    queryKey: ['reviews', business?.id],
    queryFn: () => reviewApi.list(business?.id),
    enabled: !!business?.id,
    // Handle empty response gracefully
    retry: false,
  })

  // const services = servicesData || []
  const services = STATIC_SERVICES

  const [selectedService, setSelectedService] = useState(STATIC_SERVICES[0])

  const [selectedDate, setSelectedDate] = useState(dates[1]?.full || dates[0]?.full)
  const [selectedTime, setSelectedTime] = useState(TIMES[1])

  // ── Contact form state for booking submission ──
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [isBooked, setIsBooked] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const submitBooking = useMutation({
    mutationFn: (data) => bookingApi.create(data),
    onSuccess: () => setIsBooked(true),
    onError: () => toast.error('Failed to submit booking request. Please try again.')
  })

  const handleConfirm = () => {
    setErrors({})

    if (!selectedDate) return toast.error('Please select a date')
    if (!selectedTime) return toast.error('Please select a time')

    const result = bookingSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
      })
      return
    }

    submitBooking.mutate({
      business_id: business.id,
      service: selectedService.name,
      date: selectedDate,
      ...formData,
      time: selectedTime,
    })
  }

  // ── PROCESS REVIEWS DATA ──
  // Check if reviewsData is an array, if not, default to empty array
  const reviews = Array.isArray(reviewsData) ? reviewsData : []
  const reviewCount = business?.review_count || reviews.length || 0

  // Calculate average rating from reviews
  const averageRating = useMemo(() => {
    if (!reviews.length) return business?.rating || 0
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews, business?.rating])

  const isFree = !selectedService.price || selectedService.price === 'FREE'
  const servicePrice = isFree ? 0 : Number(String(selectedService.price).replace(/[^\d.]/g, '')) || 0
  const PLATFORM_FEE = isFree ? 0 : 2
  const total = servicePrice + PLATFORM_FEE

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!business) return <div className="text-center py-20 px-4 text-gray-500">Professional not found.</div>

  const initial = (business.name_en || business.owner_name || 'P').charAt(0).toUpperCase()

  function formatRelativeTime(dateInput) {
    if (!dateInput) return 'Recently';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput;

    const now = new Date();

    // 1. Calculate precise differences in seconds
    const diffInSeconds = Math.floor((now - date) / 1000);

    // 2. Clear out hours to evaluate exact calendar day milestones
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfReviewDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffInDays = Math.round((startOfToday - startOfReviewDay) / (1000 * 60 * 60 * 24));

    // --- Same Day Calculation ---
    if (diffInDays === 0) {
      if (diffInSeconds < 60) return 'Just now';
      const diffInHours = Math.floor(diffInSeconds / 3600);
      if (diffInHours < 1) return `${Math.floor(diffInSeconds / 60)}m ago`;
      return `${diffInHours}h ago`;
    }

    // --- Past Days / Weeks / Months Calculation ---
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }

  /* ── SUCCESS STATE ── */
  if (isBooked) {
    return (
      <div className="min-h-screen bg-[#F8F8FA] flex items-center justify-center px-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <div className="max-w-lg w-full text-center py-16">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(214,28,168,.08)', border: '2px solid rgba(214,28,168,.2)' }}>
            <CheckCircle2 size={36} style={{ color: BRAND_FROM }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0F] mb-4 tracking-tight">
            Booking Request Sent!
          </h1>
          <p className="text-[#9090A0] text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
            Your request for{' '}
            <span className="font-bold text-[#0A0A0F]">{selectedService.name}</span> at{' '}
            <span className="font-bold text-[#0A0A0F]">{business.name_en}</span> has been sent.
            The vendor will contact you shortly at{' '}
            <span className="font-bold text-[#0A0A0F]">{formData.phone}</span> to confirm.
          </p>
          <button
            // onClick={() => navigate(`/business/${slug}/book`)}
            onClick={() => navigate(`/business/${slug}`)}
            className="px-8 py-3.5 text-white rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
            style={{ background: BRAND_GRADIENT, boxShadow: '0 6px 20px rgba(214,28,168,.35)' }}
          >
            Return to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── CONTENT ── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-9 flex flex-col lg:flex-row gap-9">

        {/* Left column */}
        <div className="flex-[1.4] flex flex-col gap-5">

          {/* Pro header card */}
          <div className="bg-white rounded-[22px] p-7 shadow-[0_2px_12px_rgba(0,0,0,.06)] flex gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-extrabold text-[36px] shrink-0"
              style={{ background: BRAND_GRADIENT }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <div className="text-[24px] font-bold text-[#0A0A0F] tracking-tight leading-tight">
                    {/* {business.name_en} */}
                    Mohammed Al-Balushi
                  </div>
                  <div className="text-[15px] font-medium text-[#6B7280] mt-1">
                    {business.category_name || business.specialty || 'Service Professional'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-lg text-[12px] font-bold bg-[#D1FAE5] text-[#059669]">
                    ✓ Verified
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg text-[12px] font-bold bg-[#FDF4FF]" style={{ color: BRAND_TO }}>
                    Gold Pro
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star size={16} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="text-[18px] font-extrabold text-[#0A0A0F]">{averageRating}</span>
                  <span className="text-[13px] text-[#9090A0]">({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#6B7280]">
                  <Calendar size={14} />
                  <span className="text-[13px] font-medium">{business.jobs_completed || 0} jobs completed</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#6B7280]">
                  <MapPin size={14} />
                  <span className="text-[13px] font-medium">{business.service_area || 'Serves all Muscat'}</span>
                </div>
              </div>

              {/* AI Match Score */}
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-5 flex-wrap"
                style={{
                  background: 'linear-gradient(135deg, rgba(214,28,168,.06), rgba(75,110,245,.06))',
                  border: '1.5px solid rgba(214,28,168,.2)'
                }}
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={14} />
                    <span className="text-[13px] font-bold" style={{ color: BRAND_FROM }}>AI Match Score for your area</span>
                  </div>
                  <div className="text-[12px] text-[#6B7280] leading-snug">
                    Nearby · Available soon · Great fit for your request
                  </div>
                </div>
                <div
                  className="text-[36px] font-extrabold shrink-0"
                  style={{ background: AI_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  94%
                </div>
              </div>
            </div>
          </div>

          {/* Services offered */}
          <div id="services-offered"
            className="bg-white rounded-[22px] p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,.06)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-[#0A0A0F]">
                Services Offered
              </h2>

              <button
                onClick={() =>
                  navigate(`/businesses?category=${business?.category_slug || business?.category_id || "spd"}`)
                }
                className="text-[13px] font-semibold flex items-center gap-1 hover:opacity-80 transition"
                style={{ color: BRAND_FROM }}
              >
                See All <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* General Enquiry — always shown first, free, not from API */}
              {/* <div
                className="flex items-center justify-between p-3 px-4 rounded-xl transition-all"
                style={selectedService.name === 'General Enquiry'
                  ? { background: 'rgba(214,28,168,.06)', border: '1.5px solid rgba(214,28,168,.3)' }
                  : { background: '#F8F8FA', border: '1.5px solid transparent' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-[38px] h-[38px] rounded-[10px] bg-[#DBEAFE] flex items-center justify-center text-[18px] shrink-0">
                    💬
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#0A0A0F] truncate">General Enquiry</div>
                    <div className="text-[12px] text-[#9090A0] mt-0.5 truncate">Discuss your requirements with {business.name_en}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-[16px] font-extrabold" style={{ color: BRAND_FROM }}>
                    FREE
                  </div>
                  <button
                    onClick={() => setSelectedService(GENERAL_ENQUIRY)}
                    className="px-4 py-[7px] rounded-[9px] text-[12px] font-bold"
                    style={selectedService.name === 'General Enquiry'
                      ? { background: BRAND_GRADIENT, color: 'white' }
                      : { background: '#fff', color: '#0A0A0F', border: '1.5px solid #EBEBEF' }}
                  >
                    {selectedService.name === 'General Enquiry' ? 'Selected' : 'Book'}
                  </button>
                </div>
              </div> */}

              {/* API service records */}
              {/* API service records -> NOW STATIC */}
              {services.map((s) => {
                const isActive = selectedService.name === s.name
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3.5 px-4 rounded-xl transition-all"
                    style={isActive
                      ? { background: 'rgba(214,28,168,.04)', border: '1.5px solid rgba(214,28,168,.15)' }
                      : { background: '#F8F8FA', border: '1.5px solid transparent' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Dynamic icon background matches image_e8d58d.png */}
                      <div
                        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[20px] shrink-0"
                        style={{ backgroundColor: s.bg }}
                      >
                        {s.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-bold text-[#0A0A0F] truncate">{s.name}</div>
                        <div className="text-[13px] text-[#9090A0] mt-0.5 truncate">{s.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Text color changes based on active selection */}
                      <div
                        className="text-[16px] font-black"
                        style={{ color: isActive ? BRAND_FROM : '#0A0A0F' }}
                      >
                        {s.price}
                      </div>
                      <button
                        onClick={() => setSelectedService(s)}
                        className="px-5 py-[8px] rounded-[10px] text-[13px] font-bold transition-all"
                        style={isActive
                          ? { background: BRAND_GRADIENT, color: 'white' }
                          : { background: '#fff', color: '#0A0A0F', border: '1.5px solid #EBEBEF' }}
                      >
                        {isActive ? 'Selected' : 'Book'}
                      </button>
                    </div>
                  </div>
                )
              })}

              {!services.length && (
                <div className="text-center text-[12px] text-[#9090A0] py-4">
                  No services available.
                </div>
              )}
            </div>
          </div>

          {/* ── REVIEWS SECTION ── CORRECTED WITH NO STATIC DATA ── */}
          <div className="bg-white rounded-[22px] p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[17px] font-bold text-[#0A0A0F]">Recent Reviews</div>
              <button className="text-[13px] font-semibold flex items-center gap-1" style={{ color: BRAND_FROM }}>
                See All {reviewCount} <ChevronRight size={14} />
              </button>
            </div>

            {/* ── DYNAMIC REVIEWS LIST ── */}
            <div className="flex flex-col gap-3.5">
              {reviewsLoading ? (
                // Loading state
                <div className="flex justify-center py-8">
                  <Spinner className="w-8 h-8" />
                </div>
              ) : reviewsError ? (
                // Error state - show error message
                <div className="text-center py-8">
                  <p className="text-[#9090A0] text-sm">Failed to load reviews</p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 text-sm font-semibold"
                    style={{ color: BRAND_FROM }}
                  >
                    Try again
                  </button>
                </div>
              ) : reviews.length > 0 ? (
                // ── RENDER REAL REVIEWS FROM API ──
                reviews.map((review, index) => (
                  <div key={review.id || index} className="p-3.5 px-4 bg-[#F8F8FA] rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex gap-0.5 text-[#F59E0B] text-[13px]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < (review.rating || 0) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <div className="text-[12px] text-[#9090A0]">
                        {review.reviewer_name || 'Anonymous'} ·
                        {formatRelativeTime(review.created_at)}
                      </div>
                    </div>
                    <div className="text-[13px] leading-relaxed text-[#555]">
                      {review.text || review.comment || review.content || review.review_text || 'Great service!'}
                    </div>
                  </div>
                ))
              ) : (
                // ── NO REVIEWS FOUND - DISPLAY MESSAGE ──
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-[#6B7280] font-medium text-base">No reviews yet</p>
                  <p className="text-[#9090A0] text-sm mt-1">
                    Be the first to review {business.name_en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — sticky booking card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div id="booking-card" className="bg-white rounded-[22px] p-6 shadow-[0_8px_32px_rgba(0,0,0,.1)] lg:sticky lg:top-5">
            <div className="text-[17px] font-bold text-[#0A0A0F] mb-1">
              Book {selectedService.name}
            </div>
            <div className="text-[13px] text-[#9090A0] mb-5">with {business.name_en}</div>

            {/* Date */}
            <div className="mb-4">
              <div className="text-[12px] font-semibold text-[#9090A0] tracking-wide uppercase mb-2">Select Date</div>
              <div className="flex gap-1.5">
                {dates.map(d => {
                  const active = selectedDate === d.full
                  return (
                    <div
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className="flex-1 py-2.5 px-1.5 rounded-[10px] text-center cursor-pointer transition-all"
                      style={active
                        ? { background: BRAND_GRADIENT, boxShadow: '0 4px 12px rgba(214,28,168,.3)' }
                        : { background: '#F8F8FA', border: '1.5px solid #EBEBEF' }}
                    >
                      <div className="text-[10px]" style={{ color: active ? 'rgba(255,255,255,.8)' : '#9090A0' }}>{d.weekday}</div>
                      <div className="text-[16px] font-bold mt-0.5" style={{ color: active ? '#fff' : '#6B7280' }}>{d.day}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time */}
            <div className="mb-4">
              <div className="text-[12px] font-semibold text-[#9090A0] tracking-wide uppercase mb-2">Select Time</div>
              <div className="grid grid-cols-2 gap-1.5">
                {TIMES.map(t => {
                  const active = selectedTime === t
                  return (
                    <div
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className="py-[9px] rounded-[9px] text-center text-[13px] cursor-pointer transition-all"
                      style={active
                        ? { background: BRAND_GRADIENT, color: '#fff', fontWeight: 700 }
                        : { background: '#F8F8FA', border: '1.5px solid #EBEBEF', color: '#6B7280', fontWeight: 500 }}
                    >
                      {t}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI tip */}
            <div className="rounded-[10px] px-3 py-2 flex items-center gap-1.5 mb-4" style={{ background: 'rgba(214,28,168,.05)' }}>
              <Sparkles size={12} />
              <span className="text-[11px] leading-snug text-[#6B7280]">
                <span style={{ color: BRAND_FROM, fontWeight: 600 }}>AI tip:</span> {selectedTime} on {dates.find(d => d.full === selectedDate)?.weekday} is best — low traffic nearby.
              </span>
            </div>

            {/* Contact details */}
            {/* <div className="mb-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  style={{ border: errors.name ? '1px solid #ef4444' : '1px solid #dfdee5' }}
                  className="w-full bg-[#F8F8FA] rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = BRAND_FROM; e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)' }}
                  onBlur={e => { e.target.style.borderColor = errors.name ? '#ef4444' : '#dfdee5'; e.target.style.boxShadow = 'none' }}
                />
                {errors.name && <p className="text-red-500 text-[11px] font-semibold mt-1 pl-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  style={{ border: errors.email ? '1px solid #ef4444' : '1px solid #dfdee5' }}
                  className="w-full bg-[#F8F8FA] rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = BRAND_FROM; e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)' }}
                  onBlur={e => { e.target.style.borderColor = errors.email ? '#ef4444' : '#dfdee5'; e.target.style.boxShadow = 'none' }}
                />
                {errors.email && <p className="text-red-500 text-[11px] font-semibold mt-1 pl-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+968 9XXX XXXX"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  style={{ border: errors.phone ? '1px solid #ef4444' : '1px solid #dfdee5' }}
                  className="w-full bg-[#F8F8FA] rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = BRAND_FROM; e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)' }}
                  onBlur={e => { e.target.style.borderColor = errors.phone ? '#ef4444' : '#dfdee5'; e.target.style.boxShadow = 'none' }}
                />
                {errors.phone && <p className="text-red-500 text-[11px] font-semibold mt-1 pl-1">{errors.phone}</p>}
              </div>
            </div> */}

            {/* Price */}
            <div className="bg-[#F8F8FA] rounded-xl p-3.5 mb-4">
              <div className="flex justify-between mb-1.5 text-[13px]">
                <span className="text-[#6B7280]">{selectedService.name}</span>
                <span className="font-semibold text-[#0A0A0F]">{isFree ? 'FREE' : `OMR ${servicePrice.toFixed(3)}`}</span>
              </div>
              {!isFree && (
                <div className="flex justify-between mb-2.5 text-[13px]">
                  <span className="text-[#6B7280]">Platform fee</span>
                  <span className="font-semibold text-[#0A0A0F]">OMR {PLATFORM_FEE.toFixed(3)}</span>
                </div>
              )}
              <div className="h-px bg-[#EBEBEF] mb-2.5" />
              <div className="flex justify-between">
                <span className="text-[14px] font-bold text-[#0A0A0F]">Total</span>
                <span className="text-[17px] font-extrabold" style={{ color: BRAND_FROM }}>
                  {isFree ? 'FREE' : `OMR ${total.toFixed(3)}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={submitBooking.isPending}
              className="w-full py-[15px] rounded-[14px] text-center text-[15px] font-bold text-white mb-2.5 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: BRAND_GRADIENT, boxShadow: '0 6px 20px rgba(214,28,168,.35)' }}
            >
              {submitBooking.isPending
                ? <Spinner className="w-4 h-4" />
                : 'Confirm & Proceed to Payment'
              }
            </button>
            <div className="text-center text-[12px] text-[#9090A0]">Free cancellation up to 2 hrs before</div>
          </div>
        </div>
      </div>
    </div>
  )
}