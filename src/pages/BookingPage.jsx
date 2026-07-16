import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useSelector } from "react-redux";
import { selectSelectedServiceType } from "../store/slices/searchSlice";

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get URL parameters
  const professionalId = searchParams.get('professional_id') || ''
  const serviceId = searchParams.get('service_id') || '1'
  const locationId = searchParams.get('location_id') || '1'
  const serviceTypeId = searchParams.get('service_type_id') || ''

  // States
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])
  const selectedServiceType = useSelector(selectSelectedServiceType);

  // Fetch professional data
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!professionalId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('location_id', locationId)
        params.append('service_id', serviceId)
        if (serviceTypeId) {
          params.append('service_type_id', serviceTypeId)
        }

        const response = await axios.get(
          `${API_ENDPOINTS.PROFESSIONAL_DETAIL(professionalId)}?${params.toString()}`
        )

        if (response.data && response.data.status === 'success') {
          const data = response.data.data
          setProfessional(data)

          // Set first service as selected
          if (data.services_offered && data.services_offered.length > 0) {
            setSelectedService(data.services_offered[0])
          }

          // Generate available dates (next 7 days)
          const dates = generateDates()
          setAvailableDates(dates)
          setSelectedDate(dates[0]?.num || '')

          // Generate available times
          const times = generateTimes()
          setAvailableTimes(times)
          setSelectedTime(times[0] || '')
        }
      } catch (error) {
        console.error("Error fetching professional:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessional()
  }, [professionalId, locationId, serviceId, serviceTypeId])

  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        day: dayNames[date.getDay()],
        num: date.getDate().toString(),
        month: monthNames[date.getMonth()],
        year: date.getFullYear().toString(),
        full: date,
        active: i === 0
      })
    }
    return dates
  }

  // Generate available times (9 AM - 8 PM)
  const generateTimes = () => {
    const times = []
    for (let hour = 9; hour <= 20; hour++) {
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour
      times.push(`${displayHour}:00 ${ampm}`)
      if (hour !== 20) {
        times.push(`${displayHour}:30 ${ampm}`)
      }
    }
    return times
  }

  // Get the selected date object
  const getSelectedDateObj = () => {
    return availableDates.find(d => d.num === selectedDate) || availableDates[0] || { day: '', num: '', month: '', year: '' }
  }

  const handleBookNow = () => {
    const dateObj = getSelectedDateObj()
    const serviceName = selectedServiceType.name || 'Service';
    const servicePrice = selectedServiceType.price || '0';
    const proName = professional?.name || 'Professional'

    // Send date as "Wed, 15 Jul 2026" format
    const dateStr = `${dateObj.day}, ${dateObj.num} ${dateObj.month} ${dateObj.year}`

    navigate(`/BookingDateTimePickerPage?professional_id=${professionalId}&service_id=${serviceId}&location_id=${locationId}&service_type_id=${serviceTypeId}&date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(selectedTime)}&service_name=${encodeURIComponent(serviceName)}&service_price=${encodeURIComponent(servicePrice)}&pro_name=${encodeURIComponent(proName)}`)
  }

  // Loading shimmer
  if (loading) {
    return (
      <div style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '20px 56px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            width: '100%',
            height: '120px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '16px',
            marginBottom: '24px'
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '0' }}>
            <div style={{ padding: '28px 40px 28px 56px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  height: '60px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '12px',
                  marginBottom: '12px'
                }} />
              ))}
            </div>
            <div style={{ padding: '24px', background: '#F4F5F8' }}>
              <div style={{
                height: '400px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '16px'
              }} />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    )
  }

  if (!professional) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9090A0' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <div style={{ font: '400 16px/1.5 "DM Sans", sans-serif' }}>Professional not found</div>
        <Link to="/business-list" style={{ color: '#D61CA8', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>
          ← Back to services
        </Link>
      </div>
    )
  }

  const initial = professional.name?.charAt(0) || 'P'
  const stats = [
    { label: 'Rating', value: `★ ${professional.rating || 'N/A'}` },
    { label: 'Jobs Done', value: professional.jobs_done || '0' },
    { label: 'Completion', value: `${professional.completion_rate || '0'}%` },
    { label: 'Distance', value: professional.distance_km ? `${professional.distance_km} km` : 'N/A' },
    { label: 'Cancels', value: professional.cancellations || '0' }
  ]

  const serviceName = selectedService?.type_name || 'Service'
  const servicePrice = selectedService?.price || '0'
  const dateObj = getSelectedDateObj()

  return (
    <div className="page-root" style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', position: 'relative' }}>

      <style>{`
        .hero-inner {
          max-width: 1100px; 
          margin: 0 auto; 
          display: flex; 
          gap: 28px; 
          align-items: flex-end;
        }
        .main-split-grid {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 0;
        }
        .left-content-panel {
          padding: 28px 40px 28px 56px; 
          border-right: 1px solid #EBEBEF;
        }
        .stats-wrapper {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        .right-sidebar-panel {
          padding: 24px; 
          background: #F4F5F8;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 1024px) {
          .hero-banner {
            padding: 32px 24px !important;
          }
          .left-content-panel {
            padding: 24px 24px;
          }
          .stats-wrapper {
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .hero-banner {
            padding: 24px 16px !important;
          }
          .hero-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
          .hero-actions-container {
            margin-left: 0 !important;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
          }
          .main-split-grid {
            grid-template-columns: 1fr;
          }
          .left-content-panel {
            padding: 20px 16px;
            border-right: none;
          }
          .stats-wrapper {
            flex-wrap: wrap;
            gap: 8px;
          }
          .stats-item {
            flex: unset !important;
            width: calc(33.33% - 6px);
          }
          .stats-item:nth-child(4), .stats-item:nth-child(5) {
            width: calc(50% - 4px);
          }
          .right-sidebar-panel {
            padding: 16px;
          }
          .sticky-booking-card {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>

      {/* Hero Profile Banner */}
      <div className="hero-banner" style={{ background: BRAND_GRADIENT, padding: '32px 56px' }}>
        <div className="hero-inner">
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '800 32px "DM Sans", sans-serif',
            color: '#D61CA8',
            border: '4px solid rgba(255,255,255,.5)',
            flexShrink: 0
          }}>
            {initial}
          </div>
          <div style={{ paddingBottom: '15px' }}>
            <div style={{ font: '600 28px/1 "DM Sans", sans-serif', color: 'white', letterSpacing: '-.8px', marginBottom: '5px' }}>
              {professional.name}
            </div>
            <div style={{ font: '400 14px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)' }}>
              {professional.specialty || 'Professional'} · {professional.area || 'Near you'}, {professional.governorate || ''}
            </div>
          </div>
          <div className="hero-actions-container" style={{ marginLeft: 'auto', display: 'flex', gap: '9px' }}>
            <div style={{
              padding: '9px 18px',
              background: 'rgba(255,255,255,.15)',
              border: '1.5px solid rgba(255,255,255,.3)',
              borderRadius: '10px',
              font: '700 13px/1 "DM Sans", sans-serif',
              color: 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              💬 Message
            </div>
            <div
              onClick={handleBookNow}
              style={{
                padding: '9px 22px',
                background: 'white',
                borderRadius: '10px',
                font: '700 13px/1 "DM Sans", sans-serif',
                color: '#D61CA8',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,.15)',
                whiteSpace: 'nowrap'
              }}
            >
              Book Now →
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="main-split-grid">

        {/* LEFT PANEL */}
        <div className="left-content-panel">

          {/* Stats */}
          <div className="stats-wrapper">
            {stats.map((stat) => (
              <div key={stat.label} className="stats-item" style={{ textAlign: 'center', background: '#F4F5F8', borderRadius: '12px', padding: '14px 18px', flex: 1 }}>
                <div style={{ font: '800 18px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{stat.value}</div>
                <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AI Match Score */}
          {professional.ai_match_score && (
            <div style={{
              background: 'rgba(214,28,168,.05)',
              border: '1px solid rgba(214,28,168,.15)',
              borderRadius: '12px',
              padding: '13px',
              marginBottom: '24px',
              display: 'flex',
              gap: '9px'
            }}>
              <span style={{ fontSize: '16px' }}>🤖</span>
              <div>
                <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#D61CA8', marginBottom: '4px' }}>
                  ✨ AI Match Score: {professional.ai_match_score}/100
                </div>
                <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                  {professional.ai_match_note || 'Best match based on specialisation and availability.'}
                </div>
              </div>
            </div>
          )}

          <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>
            Services Offered
          </div>

          {/* Services */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '22px' }}>
            {professional.services_offered?.map((service, index) => (
              <div
                key={index}
                style={{
                  padding: '6px 13px',
                  background: '#F4F5F8',
                  borderRadius: '9px',
                  font: '500 11px/1 "DM Sans", sans-serif',
                  color: '#0A0A0F',
                  border: '1.5px solid #EBEBEF',
                  cursor: 'default'
                }}
              >
                {service.type_name} — OMR {service.price}
              </div>
            ))}
          </div>

          {/* Reviews */}
          {professional.reviews && professional.reviews.length > 0 && (
            <>
              <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>
                Reviews ({professional.reviews_count || 0})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {professional.reviews.map((review, i) => (
                  <div key={i} style={{ background: '#F4F5F8', borderRadius: '12px', padding: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: BRAND_GRADIENT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          font: '700 12px "DM Sans", sans-serif',
                          color: 'white'
                        }}>
                          {review.user?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                            {review.user || 'Anonymous'}
                          </div>
                          <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>
                            {review.created_at || ''}
                          </div>
                        </div>
                      </div>
                      <span style={{ color: '#F59E0B', fontSize: '12px' }}>{'★'.repeat(Math.round(review.rating || 0))}</span>
                    </div>
                    <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#555' }}>
                      {review.comment || ''}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {(!professional.reviews || professional.reviews.length === 0) && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9090A0', font: '400 12px/1.5 "DM Sans", sans-serif' }}>
              No reviews yet
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Booking Card */}
        <div className="right-sidebar-panel">
          <div className="sticky-booking-card" style={{ background: '#0A0A0F', borderRadius: '16px', padding: '18px', position: 'sticky', top: '82px' }}>
            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '3px' }}>
              Book {professional.name?.split(' ')[0] || 'Pro'}
            </div>
            <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>
              {selectedServiceType.name || 'Service'} · OMR {selectedServiceType.price || '0'}
            </div>

            <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '8px' }}>
              Pick Date
            </div>

            {/* Date Select */}
            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px' }}>
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.num
                return (
                  <div
                    key={d.num}
                    onClick={() => setSelectedDate(d.num)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: '9px', textAlign: 'center', cursor: 'pointer',
                      background: isSelected ? BRAND_GRADIENT : 'rgba(255,255,255,.06)',
                      border: isSelected ? '1px solid transparent' : '1px solid rgba(255,255,255,.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ font: '500 9px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.4)', marginBottom: '3px' }}>
                      {d.day}
                    </div>
                    <div style={{ font: '800 14px/1 "DM Sans", sans-serif', color: isSelected ? 'white' : 'rgba(255,255,255,.7)' }}>
                      {d.num}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '8px' }}>
              Pick Time
            </div>

            {/* Time Select */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
              {availableTimes.slice(0, 12).map((t) => {
                const isSelected = selectedTime === t
                return (
                  <div
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      padding: '8px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                      background: isSelected ? BRAND_GRADIENT : 'rgba(255,255,255,.06)',
                      font: isSelected ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                      color: isSelected ? 'white' : 'rgba(255,255,255,.5)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t}
                  </div>
                )
              })}
            </div>

            {/* Summary of selected date/time */}
            <div style={{
              background: 'rgba(255,255,255,.06)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>
                {dateObj.day}, {dateObj.num} {dateObj.month} {dateObj.year} at {selectedTime}
              </div>
              <div style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'white', marginTop: '3px' }}>
                {selectedServiceType.name || 'Service'} · OMR {selectedServiceType.price || '0'}
              </div>
            </div>

            {/* Continue to Book */}
            <div
              onClick={handleBookNow}
              style={{
                padding: '12px',
                background: BRAND_GRADIENT,
                borderRadius: '12px',
                textAlign: 'center',
                font: '700 14px/1 "DM Sans", sans-serif',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(214,28,168,.35)'
              }}
            >
              Continue to Book →
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px' }}>🔒</span>
              <span style={{ font: '400 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.3)' }}>
                Pay only after service · PCI DSS
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}