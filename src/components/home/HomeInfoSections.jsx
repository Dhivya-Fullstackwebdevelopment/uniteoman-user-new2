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
  Building2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { categoryApi, reviewApi } from '@/lib/api'

const CATEGORY_ICONS = {
  restaurants: Utensils,
  cleaning: Brush,
  repairing: Wrench,
  health: HeartPulse,
  beauty: Sparkles,
  technical: Monitor,
  moving: Package,
  events: PartyPopper,
  education: GraduationCap,
  clinic: Stethoscope,
  pharmacy: Pill,
  'car-rental': Key,
  'car-repair': Wrench,
  supermarket: Store,
  electronic: Smartphone,
  'it-company': Briefcase
}

export function CategoryGrid() {
  const navigate = useNavigate()

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "top-level"],
    queryFn: () => categoryApi.list(null, 0, null),
  })

  // Show only first 7 categories
  const visibleCategories = categories.slice(0, 7)

  // Remaining categories count
  const remainingCount = Math.max(categories.length - 7, 0)
  const remainingCategories = categories.slice(7)

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

  return (
    <section className="pt-10 pb-10 bg-[#F7F7FA]">
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-white">
                {categories.length}+ Categories
              </span>
            </div>

            <h2
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                color: "#0A0A0F",
                letterSpacing: "-2px",
                maxWidth: "48TrustBanner.jsx0px",
                lineHeight: 1.2,
                fontSize: "52px",
              }}
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

          {visibleCategories.map((cat, index) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Briefcase
            const style = CARD_GRADIENTS[index % CARD_GRADIENTS.length]

            const linkTo = cat.has_children
              ? `/categories?parent_slug=${cat.slug}&name=${encodeURIComponent(
                cat.name_en
              )}`
              : `/businesses?category=${cat.slug}`

            return (
              <div
                key={cat.id}
                onClick={() => navigate(linkTo)}
                className="group relative h-[240px] w-full overflow-hidden rounded-[22px] bg-white p-6 cursor-pointer shadow-[0_2px_16px_rgba(0,0,0,.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Top Border */}
                <div
                  className={`absolute left-0 top-0 w-full h-[3px] bg-gradient-to-r ${style.top}`}
                />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-4 text-[#D61CA8]`}>
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                {/* Name */}
                <h3
                  className="
    text-[18px]
    font-extrabold
    text-[#0A0A0F]
    h-[56px]
    overflow-hidden
    mb-2
  "
                >
                  {cat.name_en}
                </h3>

                {/* Description */}
                <p
                  className="
    text-[12px]
    leading-5
    text-[#9090A0]
    h-[40px]
    overflow-hidden
  "
                >
                  {cat.has_children
                    ? "Browse all available services in this category."
                    : `${cat.business_count || 0} verified listings available.`}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[#D61CA8] font-bold text-[15px]">
                    {/* {cat.has_children
                      ? "Browse"
                      : `${cat.business_count || 0} Listings`} */}
                    From OMR 20
                  </span>

                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${style.button} flex items-center justify-center text-white shadow-md`}
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
              className="rounded-[22px] bg-gradient-to-br from-[#0A0A0F] via-[#171228] to-[#20153F] p-7 cursor-pointer flex flex-col justify-between"
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
                  .map((cat) => cat.name_en)
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

export function Testimonials() {
  const { data: latestReviews = [] } = useQuery({
    queryKey: ['homepage-latest-reviews'],
    queryFn: () => reviewApi.homepageLatest()
  })

  const row1 = latestReviews.slice(0, 5)
  const row2 = latestReviews.slice(5, 10)

  const renderCard = (t, idx) => (
    <div key={idx} className="w-[320px] md:w-[400px] shrink-0 p-[28px] border border-[var(--line)] rounded-[var(--r)] bg-white text-left shadow-sm hover:border-[var(--brand)] transition-colors duration-300 mx-[10px]">
      <div className="text-[#F59E0B] text-[14px] tracking-[2px] mb-[12px]">
        {'★'.repeat(t.rating)}
        <span className="text-gray-300">
          {'★'.repeat(5 - t.rating)}
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
          {/* <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-widest">{t.location || 'N/A'}</div> */}
        </div>
      </div>
    </div>
  )

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
        {/* Gradients for smooth fade-in / fade-out on the edges */}
        <div className="absolute inset-y-0 left-0 w-[100px] lg:w-[200px] bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-[100px] lg:w-[200px] bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>

        {/* Row 1 (Moving Left) */}
        <div className="flex w-max animate-scroll-left">
          {[...row1, ...row1].map((t, i) => renderCard(t, `r1-${i}`))}
        </div>

        {/* Row 2 (Moving Right) */}
        <div className="flex w-max animate-scroll-right">
          {[...row2, ...row2].map((t, i) => renderCard(t, `r2-${i}`))}
        </div>
      </div>
    </section>
  )
}

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
