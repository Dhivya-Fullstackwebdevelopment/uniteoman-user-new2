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

const CATEGORY_ICONS = {
  'ac-service': Zap,
  'home-cleaning': Brush,
  'plumbing': Wrench,
  'electrical': Zap,
  'beauty-at-home': Sparkles,
  'carpentry': Ruler,
  'pest-control': ShieldCheck,
  'painting': PaintBucket,
  'car-detailing': Car,
  'pool-service': Waves,
  'appliance-repair': Wrench,
  'landscaping': Scissors,
  'moving-packing': Truck,
  'water-tank-clean': Droplet,
  'cctv-smart-home': Video,
  'glazing-windows': GlassWater,
  'fitness-wellness': Dumbbell,
  'babysitting': Baby,
  'pet-care': PawPrint,
  'laundry-ironing': Shirt,
  'home-renovation': Hammer
}

const SERVICES = [
  { id: 1, name_en: 'AC Service', slug: 'ac-service', price: '15', icon: Zap },
  { id: 2, name_en: 'Home Cleaning', slug: 'home-cleaning', price: '25', icon: Brush },
  { id: 3, name_en: 'Plumbing', slug: 'plumbing', price: '12', icon: Wrench },
  { id: 4, name_en: 'Electrical', slug: 'electrical', price: '8', icon: Zap },
  { id: 5, name_en: 'Beauty at Home', slug: 'beauty-at-home', price: '12', icon: Sparkles },
  { id: 6, name_en: 'Carpentry', slug: 'carpentry', price: '15', icon: Ruler },
  { id: 7, name_en: 'Pest Control', slug: 'pest-control', price: '18', icon: ShieldCheck },
  { id: 8, name_en: 'Painting', slug: 'painting', price: '25', icon: PaintBucket },
  { id: 9, name_en: 'Car Detailing', slug: 'car-detailing', price: '5', icon: Car },
  { id: 10, name_en: 'Pool Service', slug: 'pool-service', price: '25', icon: Waves },
  { id: 11, name_en: 'Appliance Repair', slug: 'appliance-repair', price: '12', icon: Wrench },
  { id: 12, name_en: 'Landscaping', slug: 'landscaping', price: '15', icon: Scissors },
  { id: 13, name_en: 'Moving & Packing', slug: 'moving-packing', price: '25', icon: Truck },
  { id: 14, name_en: 'Water Tank Clean', slug: 'water-tank-clean', price: '35', icon: Droplet },
  { id: 15, name_en: 'CCTV & Smart Home', slug: 'cctv-smart-home', price: '30', icon: Video },
  { id: 16, name_en: 'Glazing & Windows', slug: 'glazing-windows', price: '18', icon: GlassWater },
  { id: 17, name_en: 'Fitness & Wellness', slug: 'fitness-wellness', price: '20', icon: Dumbbell },
  { id: 18, name_en: 'Babysitting', slug: 'babysitting', price: '5/hr', icon: Baby },
  { id: 19, name_en: 'Pet Care', slug: 'pet-care', price: '8', icon: PawPrint },
  { id: 20, name_en: 'Laundry & Ironing', slug: 'laundry-ironing', price: '5', icon: Shirt },
  { id: 21, name_en: 'Home Renovation', slug: 'home-renovation', price: '40', icon: Hammer }
]

export function CategoryGrid() {
  const navigate = useNavigate()

  // Show only first 7 categories
  const visibleCategories = SERVICES.slice(0, 7)

  // Remaining categories count
  const remainingCount = Math.max(SERVICES.length - 7, 0)
  const remainingCategories = SERVICES.slice(7)

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
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cat-card {
          opacity: 0;
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-white">
                {SERVICES.length}+ Categories
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
            const Icon = service.icon
            const style = CARD_GRADIENTS[index % CARD_GRADIENTS.length]

            const linkTo = `/services/${service.slug}`

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

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-4 text-[#D61CA8] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                {/* Name */}
                <h3 className="text-[18px] font-bold text-[#0A0A0F] h-[56px] overflow-hidden mb-2">
                  {service.name_en}
                </h3>

                {/* Description */}
                <p className="text-[12px] leading-5 text-[#9090A0] h-[40px] overflow-hidden">
                  Professional {service.name_en.toLowerCase()} services available.
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[#D61CA8] font-bold text-[15px]">
                    From OMR {service.price}
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
                  .map((service) => service.name_en)
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
        <div className="absolute inset-y-0 left-0 w-[100px] lg:w-[200px] bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-[100px] lg:w-[200px] bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-scroll-left">
          {[...row1, ...row1].map((t, i) => renderCard(t, `r1-${i}`))}
        </div>

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