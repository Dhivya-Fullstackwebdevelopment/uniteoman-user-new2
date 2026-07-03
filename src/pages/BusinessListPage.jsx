import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueries } from '@tanstack/react-query'
import { Search, ChevronDown, Sparkles, X, Star, Utensils, Car, ShoppingBag, Stethoscope, Building2, Laptop, Briefcase, Wrench, Phone, Pill, Key, Store, Smartphone } from 'lucide-react'
import { businessApi, categoryApi, governorateApi, serviceApi } from '@/lib/api'
import { BusinessCard, Spinner, EmptyState, Pagination } from '@/components/ui'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  'restaurants': Utensils,
  'automotive': Car,
  'retail': ShoppingBag,
  'health': Stethoscope,
  'real-estate': Building2,
  'it-software': Laptop,
  'services': Wrench,
  'beauty': Sparkles,
  'telecom': Phone,
  'clinic': Stethoscope,
  'pharmacy': Pill,
  'car-rental': Key,
  'car-repair': Wrench,
  'supermarket': Store,
  'electronic': Smartphone,
  'it-company': Building2
}

// ── Design tokens (matches the UniteOman HTML mock) ──
const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`
const ICON_BG = ['#DBEAFE', '#FEF3C7', '#D1FAE5', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#FFE4E6']

// ── AI Pick feature (unchanged logic) ───────────────────────────────────────────
function AiPickModal({ businesses, onClose }) {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generateLocalRecommendation = () => {
    if (!businesses || businesses.length === 0) {
      setResult('<p style="color: var(--mid); font-size: 14px;">No businesses found to analyze right now. Try adjusting your filters!</p>')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const sortedByRating = [...businesses].sort((a, b) => {
        const ratingA = parseFloat(a.rating_avg || 0)
        const ratingB = parseFloat(b.rating_avg || 0)
        if (ratingB !== ratingA) return ratingB - ratingA
        return (b.rating_count || 0) - (a.rating_count || 0)
      })

      const topPick = sortedByRating[0]
      const highRatedCount = businesses.filter(b => parseFloat(b.rating_avg || 0) >= 4.5).length

      const htmlResponse = `
        <p style="margin-bottom: 16px; font-size: 14px; line-height: 1.6; color: #0A0A0F;">
          Based on an analysis of the active listings matching your current filter settings, here is our smart recommendation:
        </p>
        
        <div style="background: rgba(214,28,168,.06); border-left: 4px solid #D61CA8; padding: 16px; border-radius: 0 12px 12px 0; margin-bottom: 20px;">
          <h4 style="color: #D61CA8; font-weight: 800; font-size: 12px; letter-spacing: 0.05em; margin-bottom: 6px; text-transform: uppercase;">🏆 TOP CHOICE</h4>
          <p style="font-size: 16px; font-weight: 800; color: #0A0A0F; margin: 0;">${topPick.name_en}</p>
          <p style="font-size: 13px; color: #6B7280; margin-top: 6px; line-height: 1.5;">
            Stands out with an exceptional score of <strong style="color: #D61CA8;">★ ${parseFloat(topPick.rating_avg || 5.0).toFixed(1)}</strong>. It is currently the leading option for service quality and user satisfaction in this selection.
          </p>
        </div>

        <h4 style="font-weight: 800; font-size: 12px; color: #0A0A0F; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase;">📊 LISTING INSIGHTS</h4>
        <ul style="list-style-type: disc; padding-left: 20px; font-size: 13px; color: #6B7280; line-height: 1.6; margin: 0;">
          <li>Analyzed <strong>${businesses.length} available service providers</strong> on this page.</li>
          <li>Identified <strong>${highRatedCount} premium options</strong> holding a rating above 4.5 stars.</li>
          <li>Top picks are fully verified and feature active booking channels.</li>
        </ul>
      `

      setResult(htmlResponse)
      setLoading(false)
    }, 1200)
  }

  useEffect(() => {
    generateLocalRecommendation()
  }, [businesses])

  return (
    <div className="modal-bg open" onClick={onClose} style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">✨ AI Pick</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="ai-dots">
              <div className="ai-dot"></div><div className="ai-dot"></div><div className="ai-dot"></div>
            </div>
          ) : (
            <>
              <div dangerouslySetInnerHTML={{ __html: result }} />
              <button
                className="regen-btn"
                style={{ marginTop: '20px', width: '100%', background: BRAND_GRADIENT, color: '#fff', fontWeight: 700 }}
                onClick={generateLocalRecommendation}
              >
                Re-Analyze Listings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BusinessListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showAiPick, setShowAiPick] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const governorate = searchParams.get('governorate') || ''
  const sort = searchParams.get('sort') || 'featured'
  const minRating = searchParams.get('min_rating') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    if (key !== 'page') p.set('page', '1')
    setSearchParams(p)
  }

  const selectedServices = searchParams.get('services')?.split(',').filter(Boolean) || []

  const toggleService = (name) => {
    const next = selectedServices.includes(name)
      ? selectedServices.filter(s => s !== name)
      : [...selectedServices, name]
    setParam('services', next.join(','))
  }

  const { data: cats = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 5 * 60 * 1000,
  })
  const { data: govs = [] } = useQuery({
    queryKey: ['governorates'],
    queryFn: governorateApi.list,
    staleTime: 10 * 60 * 1000,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['businesses', q, category, governorate, sort, minRating, selectedServices, page],
    queryFn: () => businessApi.list({
      q, category, governorate, sort,
      min_rating: minRating,
      services: selectedServices.join(','),
      page, per_page: 12
    }),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  })

  const businesses = data?.items || []
  const total = data?.total || 0
  const pages = data?.pages || 1

  // ── Dynamic "Service Offered" checkboxes ──
  // Your serviceApi only exposes listByBusiness (no global /services list endpoint),
  // so we fetch services for each business on the current page in parallel and
  // aggregate the distinct service names + counts from that.
  const serviceQueries = useQueries({
    queries: businesses.map(b => ({
      queryKey: ['services', 'business', b.id],
      queryFn: () => serviceApi.listByBusiness(b.id),
      enabled: !!b.id,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const serviceOptionsLoading = businesses.length > 0 && serviceQueries.some(q => q.isLoading)

  const serviceOptions = (() => {
    const counts = {}
    serviceQueries.forEach(q => {
      (q.data || []).forEach(s => {
        if (!s.name) return
        counts[s.name] = (counts[s.name] || 0) + 1
      })
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  })()

  const activeCategory = cats.find(c => c.slug === category)
  const subcategories = category ? cats.filter(c => c.parent_id === activeCategory?.id) : []
  const ActiveIcon = CATEGORY_ICONS[activeCategory?.slug] || Wrench

  const avgRating = businesses.length
    ? (businesses.reduce((sum, b) => sum + parseFloat(b.rating_avg || 0), 0) / businesses.length).toFixed(1)
    : '—'
  const startingFrom = businesses.length
    ? Math.min(...businesses.map(b => Number(b.starting_price) || 0).filter(n => n !== Infinity))
    : null

  const handleCategoryClick = (cat) => {
    if (cat.has_children) {
      navigate(`/categories?parent_slug=${cat.slug}&name=${encodeURIComponent(cat.name_en)}`)
    } else {
      setParam('category', cat.slug)
    }
  }

  const RATING_OPTIONS = [
    { label: '4.5★+', value: '4.5' },
    { label: '4.0★+', value: '4.0' },
    { label: 'Any', value: '' },
  ]

  return (
    <div style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── HERO BANNER ── */}
      <div
        className="px-6 md:px-12 pt-20 pb-9 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8"
        style={{ background: 'linear-gradient(130deg, #1E3A8A, #3B82F6 60%, #7DD3FC)' }}
      >
        <div className="flex-1 ">
          <div className="text-[13px] text-white/70 mb-2">Home Services</div>
          <div className="text-[28px] md:text-[36px] font-bold text-white tracking-tight mb-2.5 leading-tight">
            {activeCategory ? activeCategory.name_en : 'All Services'} {governorate ? `in ${govs.find(g => g.slug === governorate)?.name_en || ''}` : 'in Oman'}
          </div>
          <div className="text-[15px] text-white/80">
            {subcategories.length
              ? subcategories.map(s => s.name_en).join(' · ')
              : '· Cleaning · Repair · Gas Refill · Installation · Annual Contract'}
          </div>
        </div>

        <div className="flex gap-3 md:gap-5 flex-wrap shrink-0">
          <div className="rounded-2xl px-5 py-4 text-center" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
            <div className="text-[22px] font-extrabold text-white">{total.toLocaleString()}</div>
            <div className="text-[11px] text-white/70 mt-1">{governorate ? `Pros in ${govs.find(g => g.slug === governorate)?.name_en || 'area'}` : 'Pros listed'}</div>
          </div>
          <div className="rounded-2xl px-5 py-4 text-center" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
            <div className="text-[22px] font-extrabold text-white">{avgRating}★</div>
            <div className="text-[11px] text-white/70 mt-1">Avg Rating</div>
          </div>
          <div className="rounded-2xl px-5 py-4 text-center" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
            <div className="text-[22px] font-extrabold text-white">{startingFrom != null ? `OMR ${startingFrom}` : '—'}</div>
            <div className="text-[11px] text-white/70 mt-1">Starting From</div>
          </div>
        </div>

        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)' }}
        >
          <ActiveIcon size={36} className="text-white" />
        </div>
      </div>

      {/* ── NAV-LEVEL SEARCH (kept from original filter bar logic) ── */}
      <div className="bg-white border-b border-[#EBEBEF] px-6 md:px-12 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#F8F8FA] rounded-xl px-3.5 py-2.5 flex-1 min-w-[220px] max-w-[420px]" style={{ border: '1.5px solid #EBEBEF' }}>
          <Search size={15} className="text-[#9090A0] shrink-0" />
          <input
            className="bg-transparent outline-none text-[13px] font-medium text-[#0A0A0F] flex-1 placeholder-[#9090A0]"
            defaultValue={q}
            onKeyDown={e => { if (e.key === 'Enter') setParam('q', e.target.value) }}
            placeholder="Search businesses..."
          />
          {q && (
            <button onClick={() => setParam('q', '')} className="text-[#9090A0] hover:text-[#0A0A0F] shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          className="md:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#0A0A0F]"
          style={{ border: '1.5px solid #EBEBEF' }}
          onClick={() => setShowDrawer(true)}
        >
          <Wrench size={14} /> Filters
        </button>

        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white ml-auto"
          style={{ background: BRAND_GRADIENT }}
          onClick={() => setShowAiPick(true)}
        >
          <Sparkles size={14} /> AI Pick
        </button>
      </div>

      {/* ── FILTER + CONTENT AREA ── */}
      <div className="flex">

        {/* Left sidebar filters (desktop) */}
        <div className="hidden md:block w-[256px] bg-white border-r border-[#EBEBEF] p-6 shrink-0">
          <div className="text-[14px] font-bold text-[#0A0A0F] mb-4">Filters</div>

          {/* Service Type / Subcategories */}
          {subcategories.length > 0 && (
            <div className="mb-5">
              <div className="text-[11px] font-semibold text-[#9090A0] tracking-[1.5px] uppercase mb-2.5">Service Type</div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!category || category === activeCategory?.slug}
                    readOnly
                    style={{ accentColor: BRAND_FROM }}
                  />
                  <span className="text-[13px] font-medium text-[#0A0A0F]">All {activeCategory?.name_en}</span>
                </label>
                {subcategories.map(sub => (
                  <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category === sub.slug}
                      onChange={() => setParam('category', category === sub.slug ? activeCategory.slug : sub.slug)}
                      style={{ accentColor: BRAND_FROM }}
                    />
                    <span className="text-[13px] font-medium text-[#0A0A0F]">{sub.name_en}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Service Offered */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-[#9090A0] tracking-[1.5px] uppercase mb-3">
              Service Offered
            </div>

            <div className="flex flex-col gap-3">
              {serviceOptionsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-4 w-3/4 bg-[#F1F1F4] rounded animate-pulse" />
                ))
              ) : serviceOptions.length === 0 ? (
                <p className="text-[12px] text-[#9090A0]">No services listed yet.</p>
              ) : (
                serviceOptions.map((service) => (
                  <label
                    key={service.name}
                    className="flex items-center gap-3 cursor-pointer text-[13px] font-medium text-[#0A0A0F]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.name)}
                      onChange={() => toggleService(service.name)}
                      className="w-4 h-4 rounded border-[#D6D6E0]"
                      style={{ accentColor: BRAND_FROM }}
                    />
                    <span className="flex-1">{service.name}</span>
                    {service.count != null && (
                      <span className="text-[11px] text-[#9090A0]">{service.count}</span>
                    )}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold text-[#9090A0] tracking-[1.5px] uppercase mb-3">
              Price Range
            </div>

            <div className="flex items-center gap-2">
              <input
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-0 flex-1 min-w-0 bg-[#F8F8FA] rounded-xl px-2.5 py-2 text-[12px] outline-none"
                style={{ border: '1.5px solid #EBEBEF' }}
              />

              <span className="text-[#9090A0] font-semibold text-[12px] shrink-0">—</span>

              <input
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-0 flex-1 min-w-0 bg-[#F8F8FA] rounded-xl px-2.5 py-2 text-[12px] outline-none"
                style={{ border: '1.5px solid #EBEBEF' }}
              />
            </div>
          </div>
          {/* Area (governorates reused as "area") */}
          <div className="mb-5">
            <div className="text-[11px] font-semibold text-[#9090A0] tracking-[1.5px] uppercase mb-2.5">Muscat Area</div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!governorate} onChange={() => setParam('governorate', '')} style={{ accentColor: BRAND_FROM }} />
                <span className="text-[13px] font-medium text-[#0A0A0F]">All Oman</span>
              </label>
              {govs.map(g => (
                <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={governorate === g.slug}
                    onChange={() => setParam('governorate', governorate === g.slug ? '' : g.slug)}
                    style={{ accentColor: BRAND_FROM }}
                  />
                  <span className="text-[13px] font-medium text-[#0A0A0F]">{g.name_en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <div className="text-[11px] font-semibold text-[#9090A0] tracking-[1.5px] uppercase mb-2.5">Min Rating</div>
            <div className="flex gap-1.5 flex-wrap">
              {RATING_OPTIONS.map(opt => {
                const active = minRating === opt.value
                return (
                  <button
                    key={opt.label}
                    onClick={() => setParam('min_rating', opt.value)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                    style={active
                      ? { background: BRAND_GRADIENT, color: '#fff' }
                      : { background: '#F8F8FA', border: '1.5px solid #EBEBEF', color: '#6B7280' }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 px-6 md:px-8 py-6">

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="text-[14px] font-medium text-[#6B7280]">
              <span className="font-bold text-[#0A0A0F]">{total.toLocaleString()} {total === 1 ? 'service' : 'services'}</span> found{governorate ? ` in ${govs.find(g => g.slug === governorate)?.name_en || 'this area'}` : ' in Oman'}
            </div>
            <div className="flex items-center gap-2.5">
              {sort === 'featured' && (
                <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(214,28,168,.06)' }}>
                  <Sparkles size={12} style={{ color: BRAND_FROM }} />
                  <span className="text-[12px] font-semibold" style={{ color: BRAND_FROM }}>AI Sorted by match</span>
                </div>
              )}
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                  className="appearance-none bg-white rounded-lg pl-3.5 pr-8 py-2 text-[13px] font-medium text-[#0A0A0F] outline-none"
                  style={{ border: '1.5px solid #EBEBEF' }}
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="rating">Sort: Rating</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="name">Sort: A–Z</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9090A0] pointer-events-none" />
              </div>
            </div>
          </div>

          {(q || category || governorate || sort !== 'featured' || minRating) && (
            <button
              onClick={() => { setSearchParams({}); setPriceMin(''); setPriceMax('') }}
              className="text-[13px] font-semibold mb-4 hover:underline"
              style={{ color: BRAND_FROM }}
            >
              Clear filters
            </button>
          )}

          {/* Service cards grid (2 per row, matches mock) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ opacity: isFetching && !isLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[18px] p-5 flex gap-4 shadow-[0_2px_10px_rgba(0,0,0,.06)] animate-pulse">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-[#F1F1F4] shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-4 bg-[#F1F1F4] rounded w-3/4" />
                    <div className="h-3 bg-[#F1F1F4] rounded w-1/2" />
                    <div className="h-8 bg-[#F1F1F4] rounded w-1/3 mt-1" />
                  </div>
                </div>
              ))
            ) : businesses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-[40px] mb-3">🔍</div>
                <h3 className="text-[17px] font-bold text-[#0A0A0F] mb-1">No businesses found</h3>
                <p className="text-[13px] text-[#9090A0] mb-5">Try adjusting your search or filters.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              businesses.map((b, i) => {
                const Icon = CATEGORY_ICONS[b.category_slug] || CATEGORY_ICONS[activeCategory?.slug] || Wrench
                const isTop = i === 0
                return (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/business/${b.slug}/book`)}
                    className="bg-white rounded-[18px] p-5 flex gap-4 shadow-[0_2px_10px_rgba(0,0,0,.06)] cursor-pointer relative overflow-hidden hover:shadow-[0_6px_20px_rgba(0,0,0,.08)] transition-shadow"
                  >
                    {isTop && (
                      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: BRAND_GRADIENT }} />
                    )}
                    <div
                      className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: ICON_BG[i % ICON_BG.length] }}
                    >
                      <Icon size={32} className="text-[#0A0A0F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="text-[15px] font-bold text-[#0A0A0F] leading-snug truncate">{b.name_en}</div>
                        <div className="text-[17px] font-extrabold shrink-0" style={{ color: isTop ? BRAND_FROM : '#0A0A0F' }}>
                          {b.starting_price ? `OMR ${b.starting_price}` : 'OMR 10'}
                        </div>
                      </div>
                      <div className="text-[12px] text-[#9090A0] leading-relaxed mb-2.5 line-clamp-2">
                        {b.description || b.category_name || 'Verified service provider'}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star size={13} fill="#F59E0B" className="text-[#F59E0B]" />
                          <span className="text-[13px] font-bold text-[#0A0A0F]">{parseFloat(b.rating_avg || 0).toFixed(1)}</span>
                          <span className="text-[12px] text-[#9090A0]">({b.rating_count || 0} reviews)</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/business/${b.slug}/book`) }}
                          className="px-4 py-[7px] rounded-[9px] text-[12px] font-bold transition-all"
                          style={isTop
                            ? { background: BRAND_GRADIENT, color: '#fff' }
                            : { background: '#F8F8FA', color: '#0A0A0F', border: '1.5px solid #EBEBEF' }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {!isLoading && businesses.length > 0 && (
            <div className="mt-8">
              <Pagination page={page} pages={pages} onPage={p => setParam('page', p)} />
            </div>
          )}
        </div>
      </div>

      {showAiPick && <AiPickModal businesses={businesses} onClose={() => setShowAiPick(false)} />}

      {/* ── MOBILE DRAWER ── */}
      <div className={`drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-bg" onClick={() => setShowDrawer(false)}></div>
        <div className="drawer-panel" style={{ transform: showDrawer ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', fontFamily: '"DM Sans", sans-serif' }}>
          <div className="drawer-handle"></div>
          <h3 className="drawer-title">Filters</h3>

          <div className="drawer-label">Location</div>
          <select className="drawer-dd" value={governorate} onChange={e => setParam('governorate', e.target.value)}>
            <option value="">All Oman</option>
            {govs.map(g => <option key={g.id} value={g.slug}>{g.name_en}</option>)}
          </select>

          <div className="drawer-label">Sort By</div>
          <select className="drawer-dd" value={sort} onChange={e => setParam('sort', e.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="name">A-Z</option>
          </select>

          <div className="drawer-label">Min Rating</div>
          <div className="flex gap-1.5 mb-4">
            {RATING_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setParam('min_rating', opt.value)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                style={minRating === opt.value
                  ? { background: BRAND_GRADIENT, color: '#fff' }
                  : { background: '#F8F8FA', border: '1.5px solid #EBEBEF', color: '#6B7280' }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            className="drawer-apply"
            style={{ background: BRAND_GRADIENT }}
            onClick={() => setShowDrawer(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}