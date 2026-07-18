import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ShieldCheck,
  Zap,
  Globe,
  Star,
  Sparkles,
  Wrench,
  HeartPulse,
  Brush,
  Monitor,
  Package,
  PartyPopper,
  GraduationCap,
  Utensils,
  Briefcase,
  Stethoscope,
  Pill,
  Key,
  Store,
  Smartphone,
  Building2,
  Droplets,
  PaintBucket,
  Car,
  Waves,
  Ruler,
  Scissors,
  Truck,
  Droplet,
  Video,
  GlassWater,
  Dumbbell,
  Baby,
  PawPrint,
  Shirt,
  Hammer
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '@/config/api'

// Map category names to Lucide icons (fallback if API icon fails)
const CATEGORY_ICON_MAP = {
  'AC Service': Zap,
  'Home Cleaning': Brush,
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Beauty at Home': Sparkles,
  'Carpentry': Ruler,
  'Pest Control': ShieldCheck,
  'Painting': PaintBucket,
  'Car Detailing': Car,
  'Pool Service': Waves,
  'Appliance Repair': Wrench,
  'Landscaping': Scissors,
  'Moving & Packing': Truck,
  'Water Tank Clean': Droplet,
  'CCTV & Smart Home': Video,
  'Glazing & Windows': GlassWater,
  'Fitness & Wellness': Dumbbell,
  'Babysitting': Baby,
  'Pet Care': PawPrint,
  'Laundry & Ironing': Shirt,
  'Home Renovation': Hammer
}

// Fallback icon for categories not in the map
const FallbackIcon = Sparkles

export function CategoryGrid() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/services/`)

        if (response.data.status === 'success' && response.data.data) {
          setServices(response.data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err.response?.data?.message || err.message || 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Show only first 7 categories
  const visibleCategories = services.slice(0, 7)

  // Remaining categories count
  const remainingCount = Math.max(services.length - 7, 0)
  const remainingCategories = services.slice(7)

  // Get icon component for a category (fallback if API icon not available)
  const getIconComponent = (categoryName) => {
    const Icon = CATEGORY_ICON_MAP[categoryName] || FallbackIcon
    return Icon
  }

  // Check if icon URL is valid and from API
  const getIconUrl = (iconUrl) => {
    if (!iconUrl) return null
    // If it's a relative path, prepend API_BASE_URL
    if (iconUrl.startsWith('/media/')) {
      return `${API_BASE_URL}${iconUrl}`
    }
    return iconUrl
  }

  const CARD_GRADIENTS = [
    {
      top: "from-[#D61CA8] to-[#8B2EF5]",
      button: "from-[#D61CA8] to-[#8B2EF5]",
      iconBg: "bg-[#DBEAFE]",
    },
    {
      top: "from-[#10B981] to-[#4B6EF5]",
      button: "from-[#10B981] to-[#4B6EF5]",
      iconBg: "bg-[#D1FAE5]",
    },
    {
      top: "from-[#06B6D4] to-[#4B6EF5]",
      button: "from-[#06B6D4] to-[#4B6EF5]",
      iconBg: "bg-[#CFFAFE]",
    },
    {
      top: "from-[#F59E0B] to-[#EF4444]",
      button: "from-[#F59E0B] to-[#EF4444]",
      iconBg: "bg-[#FEF3C7]",
    },
    {
      top: "from-[#EC4899] to-[#D61CA8]",
      button: "from-[#EC4899] to-[#D61CA8]",
      iconBg: "bg-[#FCE7F3]",
    },
    {
      top: "from-[#7C3AED] to-[#8B2EF5]",
      button: "from-[#7C3AED] to-[#8B2EF5]",
      iconBg: "bg-[#EDE9FE]",
    },
    {
      top: "from-[#E11D48] to-[#F59E0B]",
      button: "from-[#E11D48] to-[#F59E0B]",
      iconBg: "bg-[#FFE4E6]",
    },
  ]

  // Loading state
  if (loading) {
    return (
      <section className="pt-10 pb-10 bg-[#F7F7FA]">
        <div className="max-w-[1300px] mx-auto px-5 lg:px-14">
          {/* Heading Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              <div className="w-32 h-6 bg-gray-200 rounded-md mb-4 animate-pulse" />
              <div className="w-64 h-14 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="h-[240px] rounded-[22px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,.05)] animate-pulse"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-200 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="flex items-center justify-between mt-4">
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </section>
    )
  }

  // Error state
  if (error) {
    console.error('CategoryGrid error:', error)
  }

  // If no services, don't render
  if (services.length === 0) {
    return null
  }

  return (
    <section className="pt-10 pb-10 bg-[#F7F7FA]">
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cat-card {
          opacity: 0;
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .cat-icon-image {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .cat-card:hover .cat-icon-image {
          transform: scale(1.15) rotate(-3deg);
          filter: brightness(1.1);
        }
      `}</style>
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-white">
                {services.length}+ Categories
              </span>
            </div>

            <h2
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                color: "#0A0A0F",
                letterSpacing: "-2px",
                maxWidth: "480px",
                lineHeight: 1.2,
                fontSize: "52px",
              }}
              className="text-[36px] lg:text-[52px]"
            >
              Everything your <br />
              home needs
            </h2>
          </div>

          <button
            onClick={() => navigate("/categories")}
            style={{
              border: "1.5px solid #E5E7EB",
              background: "#fff",
            }}
            className="self-start lg:self-auto px-6 py-3 rounded-xl text-[15px] font-semibold text-[#0A0A0F] hover:border-[#D61CA8] hover:text-[#D61CA8] transition-all"
          >
            View All Services
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {visibleCategories.map((service, index) => {
            const style = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
            // const linkTo = `/categories/${service.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
            const linkTo = `/categories`


            // Get icon URL from API
            const iconUrl = getIconUrl(service.icon)
            // Get fallback Lucide icon
            const IconComponent = getIconComponent(service.name)

            return (
              <div
                key={service.id}
                onClick={() => navigate(linkTo)}
                className="cat-card group relative h-[240px] w-full overflow-hidden rounded-[22px] bg-white p-6 cursor-pointer shadow-[0_2px_16px_rgba(0,0,0,.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Top Border */}
                <div
                  className={`absolute left-0 top-0 w-full h-[3px] bg-gradient-to-r ${style.top}`}
                />

                {/* Icon - Use API icon if available, otherwise fallback to Lucide */}
                <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center text-[#D61CA8] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden`}>
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={service.name}
                      className="cat-icon-image w-10 h-10 object-contain"
                      onError={(e) => {
                        // If image fails to load, show fallback icon
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<svg class="w-6 h-6" stroke-width="2.2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
                      }}
                    />
                  ) : (
                    <IconComponent size={24} strokeWidth={2.2} />
                  )}
                </div>

                {/* Name */}
                <h3 className="text-[18px] font-bold text-[#0A0A0F] h-[56px] overflow-hidden mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-[12px] leading-5 text-[#9090A0] h-[40px] overflow-hidden">
                  {service.description || `Professional ${service.name.toLowerCase()} services available.`}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-[#D61CA8] font-bold text-[15px]">
                    From OMR {service.starting_price}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${style.button} flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:translate-x-1`}
                  >
                    →
                  </div>
                </div>
              </div>
            )
          })}

          {/* More Services Card */}
          {remainingCount > 0 && (
            <div
              onClick={() => navigate("/categories")}
              className="cat-card rounded-[22px] bg-gradient-to-br from-[#0A0A0F] via-[#171228] to-[#20153F] p-7 cursor-pointer flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: `${visibleCategories.length * 0.08}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-[24px] font-bold mb-4">
                +{remainingCount}
              </div>

              <h3 className="text-[18px] font-extrabold text-white mb-2">
                More Services
              </h3>

              <p className="text-[12px] leading-5 text-white/60 flex-1">
                {remainingCategories
                  .slice(0, 4)
                  .map((service) => service.name)
                  .join(" • ")}
                {remainingCount > 4 && " • and more"}
              </p>

              <div className="mt-auto">
                <button className="w-full h-10 rounded-xl bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] text-white font-semibold text-[14px] shadow-md">
                  Browse All →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

// WhySection remains the same
export function WhySection() {
  const items = [
    { ico: ShieldCheck, t: 'Verified Pros', d: 'Every business is manually checked for quality and reliability.' },
    { ico: Zap, t: 'Instant Booking', d: 'Connect directly via WhatsApp and get quotes in minutes.' },
    { ico: Globe, t: 'Oman Wide', d: 'Services available across all governorates, from Muscat to Salalah.' },
    { ico: Star, t: 'Top Rated', d: 'Read genuine reviews from thousands of happy customers.' }
  ]

  return (
    <section className="why py-[48px] bg-[#F9F9F8] rv">
      <div className="c grid md:grid-cols-2 gap-[40px] md:gap-[100px] items-center">
        <div>
          <div className="why-label text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--brand)] mb-[16px]">Why choose UniteOman</div>
          <h2 className="why-h font-['Bricolage_Grotesque',sans-serif] text-[clamp(32px,4.5vw,52px)] font-bold text-[var(--ink)] leading-[1.0] tracking-[-0.04em] mb-[24px]">
            The smarter way <br />to <em className="not-italic text-[var(--brand)]">hire locally.</em>
          </h2>
          <p className="why-sub text-[16px] text-[var(--mid)] font-medium leading-[1.8] mb-[32px] max-w-[480px]">
            We bridge the gap between skilled professionals and homeowners across the Sultanate. No more searching through random, unverified directories.
          </p>
        </div>
        <div className="why-items grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          {items.map((item, i) => {
            const Icon = item.ico;
            return (
              <div key={i} className={`why-item p-[24px] bg-white rounded-[var(--r)] border border-[var(--line)] shadow-sm hover:shadow-md tr hover-lift rv d${(i + 1) * 2}`}>
                <div className="why-item-ico text-[var(--brand)] mb-[12px] tr group-hover:scale-110">
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <div className="why-item-t text-[15px] font-bold text-[var(--ink)] mb-[6px]">{item.t}</div>
                <div className="why-item-d text-[13px] text-[var(--mid)] leading-[1.7] font-medium">{item.d}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Testimonials with API integration
export function Testimonials() {
  const [latestReviews, setLatestReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/reviews/homepage-latest/`)
        if (response.data && response.data.data) {
          setLatestReviews(response.data.data)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const row1 = latestReviews.slice(0, 5)
  const row2 = latestReviews.slice(5, 10)

  const renderCard = (t, idx) => (
    <div key={idx} className="w-[320px] md:w-[400px] shrink-0 p-[28px] border border-[var(--line)] rounded-[var(--r)] bg-white text-left shadow-sm hover:border-[var(--brand)] transition-colors duration-300 mx-[10px]">
      <div className="text-[#F59E0B] text-[14px] tracking-[2px] mb-[12px]">
        {'★'.repeat(t.rating || 5)}
        <span className="text-gray-300">
          {'★'.repeat(5 - (t.rating || 5))}
        </span>
      </div>
      <p className="text-[14px] text-[var(--mid)] font-medium leading-[1.7] italic mb-[20px]">
        {t.comment || t.text || ''}
      </p>
      <div className="flex items-center gap-[12px]">
        <div className="w-[36px] h-[36px] rounded-full bg-[var(--grad)] flex items-center justify-center text-[13px] font-bold text-white shadow-sm">
          {(t.reviewer_name || t.name || 'A')[0].toUpperCase()}
        </div>
        <div>
          <div className="text-[13px] font-bold text-[var(--ink)]">{t.reviewer_name || t.name || 'Anonymous'}</div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <section className="testi py-[48px] bg-[#FDFDFD] overflow-hidden">
        <div className="text-center mb-[64px] px-4">
          <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="w-64 h-16 bg-gray-200 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="flex gap-4 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-[320px] h-[200px] bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="testi py-[48px] bg-[#FDFDFD] overflow-hidden">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left { animation: marquee-left 40s linear infinite; }
        .animate-scroll-right { animation: marquee-right 40s linear infinite; }
        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="text-center mb-[64px] px-4 flex flex-col items-center">
        <div className="inline-flex items-center justify-center gap-[8px] bg-pink/10 text-pink text-[12px] font-bold px-[16px] py-[8px] rounded-full tracking-widest uppercase mb-[20px]">
          <Star size={14} fill="currentColor" /> Highly Rated
        </div>
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-[clamp(36px,5vw,56px)] font-black text-[var(--ink)] tracking-[-0.04em] leading-[1.1]">
          Over <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8317A] to-[#8E2DE2]">1,000+</span>
          <br /> trusted customers
        </h2>
        <p className="text-[16px] text-[var(--mid)] font-medium mt-[16px] max-w-[450px]">
          See why thousands of homeowners and businesses across Oman love using our platform every day.
        </p>
      </div>

      <div className="marquee-container flex flex-col gap-[20px] relative w-full left-0">
        <div className="absolute inset-y-0 left-0 w-[100px] lg:w-[200px] bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-[100px] lg:w-[200px] bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>

        {row1.length > 0 && (
          <div className="flex w-max animate-scroll-left">
            {[...row1, ...row1].map((t, i) => renderCard(t, `r1-${i}`))}
          </div>
        )}

        {row2.length > 0 && (
          <div className="flex w-max animate-scroll-right">
            {[...row2, ...row2].map((t, i) => renderCard(t, `r2-${i}`))}
          </div>
        )}
      </div>
    </section>
  )
}

// CTABand remains the same
export function CTABand() {
  const navigate = useNavigate()
  return (
    <section className="cta bg-[var(--ink)] py-[48px] text-center border-t border-[rgba(255,255,255,0.05)] overflow-hidden">
      <div className="c rv">
        <div className="cta-label text-[12px] font-bold tracking-[0.3em] uppercase text-[rgba(255,255,255,0.35)] mb-[24px]">Grow your business</div>
        <h2 className="cta-h font-['Bricolage_Grotesque',sans-serif] text-[clamp(36px,5vw,64px)] font-bold text-white leading-[1.0] tracking-[-0.05em] mb-[20px]">
          Are you a professional <br />providing <em className="not-italic text-[var(--brand)]">expert services?</em>
        </h2>
        <p className="cta-sub text-[18px] text-[rgba(255,255,255,0.45)] font-medium mb-[48px] max-w-[640px] mx-auto leading-[1.6]">
          Join 10,000+ businesses and reach more customers in your governorate today.
        </p>
        <div className="cta-acts flex gap-[16px] justify-center flex-wrap">
          <button onClick={() => navigate('/vendor/login')} className="cta-btn-w bg-white text-[var(--ink)] py-[16px] px-[40px] rounded-full text-[15px] font-bold tr hover:scale-[1.05] active:scale-[0.98] shadow-xl hover:shadow-white/10 animate-[pulse-subtle_3s_infinite_ease-in-out]">Register as Professional</button>
          <button onClick={() => navigate('/AdvertisingPricing')} className="cta-btn-o bg-transparent text-white border-[1.5px] border-[rgba(255,255,255,0.15)] py-[16px] px-[40px] rounded-full text-[15px] font-bold tr hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.4)] active:scale-[0.98]">Advertising Pricing</button>
        </div>
      </div>
    </section>
  )
}