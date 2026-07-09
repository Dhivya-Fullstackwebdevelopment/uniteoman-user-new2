import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { businessApi, governorateApi, categoryApi, reviewApi } from '@/lib/api'
import {
  Search, Building2, ChevronRight, X,
  ShieldCheck, Zap, Globe, Star, Sparkles,
  Wrench, HeartPulse, Brush, Monitor, Package,
  PartyPopper, GraduationCap, Utensils,
  Briefcase, Stethoscope, Pill, Key, Store,
  Smartphone
} from 'lucide-react'

// Category Icons Mapping
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

// Main HomeHero Component
export default function HomeHero() {
  const navigate = useNavigate()
  const [quickQuery, setQuickQuery] = useState('')
  const [quickLocation, setQuickLocation] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const formRef = useRef(null)
  const portalRef = useRef(null)
  const searchInputRef = useRef(null)

  const { data: governorates = [] } = useQuery({
    queryKey: ['governorates'],
    queryFn: governorateApi.list,
    staleTime: 10 * 60 * 1000,
  })

  const { data: featuredBusinesses } = useQuery({
    queryKey: ['featured', 6],
    queryFn: () => businessApi.featured(6),
    staleTime: 5 * 60 * 1000,
  })

  // Service categories from the HTML
  const serviceCategories = [
    { icon: "❄️", name: "AC Service", bg: "#DBEAFE" },
    { icon: "🧹", name: "Home Cleaning", bg: "#D1FAE5" },
    { icon: "🔧", name: "Plumbing", bg: "#CFFAFE" },
    { icon: "⚡", name: "Electrical", bg: "#FEF3C7" },
    { icon: "💅", name: "Beauty at Home", bg: "#FCE7F3" },
    { icon: "🪛", name: "Carpentry", bg: "#EFEBE9" },
    { icon: "🪲", name: "Pest Control", bg: "#EDE9FE" },
    { icon: "🎨", name: "Painting", bg: "#FFE4E6" },
    { icon: "🚗", name: "Car Detailing", bg: "#E0F2FE" },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inForm = formRef.current?.contains(e.target)
      const inPortal = portalRef.current?.contains(e.target)
      if (!inForm && !inPortal) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!showDropdown || !formRef.current) return
    const update = () => {
      const r = formRef.current?.getBoundingClientRect()
      if (!r) return
      const isMd = window.innerWidth >= 768
      const maxW = isMd ? 640 : Math.min(window.innerWidth - 32, 400)
      const cx = r.left + r.width / 2
      const left = Math.max(16, cx - maxW / 2)
      const width = Math.min(maxW, window.innerWidth - 32)
      setDropdownPos({ top: r.bottom + window.scrollY + 8, left, width })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [showDropdown])

  useEffect(() => {
    if (!showDropdown) return

    if (!quickQuery.trim()) {
      setIsSearching(false)
      if (featuredBusinesses) {
        const mapped = featuredBusinesses.map(b => ({
          id: b.id,
          name: b.name_en,
          type: 'business',
          slug: b.slug,
          rating: b.rating_avg,
          category: b.category?.name_en,
          governorate: b.governorate?.name_en,
          is_verified: b.is_verified,
          logo_url: b.logo_url
        }))
        setSuggestions(mapped)
      } else {
        setIsSearching(true)
        businessApi.featured(6).then(res => {
          const mapped = res.map(b => ({
            id: b.id,
            name: b.name_en,
            type: 'business',
            slug: b.slug,
            rating: b.rating_avg,
            category: b.category?.name_en,
            governorate: b.governorate?.name_en,
            is_verified: b.is_verified,
            logo_url: b.logo_url
          }))
          setSuggestions(mapped)
        }).catch(() => { }).finally(() => setIsSearching(false))
      }
      return
    }

    if (quickQuery.length < 2) return

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await businessApi.autocomplete(quickQuery)
        setSuggestions(results)
      } catch (err) {
        console.error('Autocomplete error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [quickQuery, showDropdown, featuredBusinesses])

  const handleQuickSearch = (e) => {
    e?.preventDefault()

    if (!quickQuery.trim() && !quickLocation) return

    const params = new URLSearchParams()
    if (quickQuery.trim()) params.set('q', quickQuery)
    if (quickLocation) params.set('governorate', quickLocation)

    navigate(`/businesses?${params.toString()}`)
    setShowDropdown(false)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuickQuery(value)
    if (value.trim()) {
      setShowDropdown(true)
    }
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams({ q: category })
    if (quickLocation) params.set('governorate', quickLocation)
    navigate(`/businesses?${params.toString()}`)
  }

  const handleSuggestionClick = (s) => {
    const params = new URLSearchParams()
    params.set('q', s.name)
    if (quickLocation) params.set('governorate', quickLocation)
    navigate(`/businesses?${params.toString()}`)
    setShowDropdown(false)
    setQuickQuery('')
    setSuggestions([])
  }

  return (
    <div className="w-full font-sans antialiased bg-[#F7F7FA]">
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: .25 } }
        @keyframes spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .skel { background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .tr { transition: all 0.25s ease; }
        .rv { opacity: 0; animation: revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rv.d2 { animation-delay: 0.05s; }
        .rv.d3 { animation-delay: 0.1s; }
        .rv.d4 { animation-delay: 0.15s; }
        .rv.d5 { animation-delay: 0.2s; }
        .rv.d6 { animation-delay: 0.25s; }
      `}</style>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* HERO SECTION - Set to dynamically scale to screen space without dead margins */}
        <section style={{
          background: 'linear-gradient(145deg,#0a0050,#200030,#0a0a1a)',
          width: '100%',
          minHeight: isMobile ? 'auto' : '75vh',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '40px 0 32px' : '60px 0',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Gradient Orbs */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: isMobile ? '300px' : '500px',
            height: isMobile ? '300px' : '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(214,28,168,.18),transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: isMobile ? '250px' : '400px',
            height: isMobile ? '250px' : '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(139,46,245,.08),transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          {/* Content Container */}
          <div style={{
            maxWidth: '1300px',
            width: '100%',
            margin: '0 auto',
            padding: isMobile ? '0 20px' : '0 56px',
            position: 'relative',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(214,28,168,.12)',
              border: '1px solid rgba(214,28,168,.25)',
              borderRadius: '20px',
              padding: isMobile ? '6px 12px' : '6px 14px',
              marginBottom: isMobile ? '16px' : '20px',
              alignSelf: 'flex-start'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></div>
              <span style={{
                font: isMobile ? '600 10px/1 "DM Sans",sans-serif' : '600 11px/1 "DM Sans",sans-serif',
                color: 'rgba(255,255,255,.75)'
              }}>
                Available in Muscat · 312 Professionals
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              font: isMobile ? '400 32px/1.1 "DM Sans",sans-serif' : '600 56px/1.1 "DM Sans",sans-serif',
              color: 'white',
              letterSpacing: isMobile ? '-0.5px' : '-2px',
              marginBottom: isMobile ? '12px' : '16px',
              textAlign: 'left'
            }}>
              Home services,<br />
              <span style={{
                background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                on demand.
              </span>
            </h1>

            {/* Description */}
            <p style={{
              font: isMobile ? '400 15px/1.6 "DM Sans",sans-serif' : '400 18px/1.6 "DM Sans",sans-serif',
              color: 'rgba(255,255,255,.6)',
              marginBottom: isMobile ? '24px' : '36px',
              textAlign: 'left',
              maxWidth: '650px'
            }}>
              Trusted professionals for AC, cleaning, plumbing, electrical and 17 more home services — booked in 60 seconds.
            </p>

            {/* Search Container */}
            <div 
              ref={formRef}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: isMobile ? '4px' : '6px 6px 6px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 40px rgba(0,0,0,.25)',
                maxWidth: isMobile ? '100%' : '620px',
                width: '100%',
                marginBottom: '24px',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="10.5" cy="10.5" r="7" stroke="#9090A0" strokeWidth="2" />
                <path d="M15.5 15.5L21 21" stroke="#9090A0" strokeWidth="2" strokeLinecap="round" />
              </svg>

              <input
                ref={searchInputRef}
                style={{
                  flex: '1',
                  border: 'none',
                  outline: 'none',
                  font: isMobile ? '400 14px/1 "DM Sans",sans-serif' : '400 15px/1 "DM Sans",sans-serif',
                  color: '#0A0A0F',
                  minWidth: isMobile ? '100%' : 'auto',
                  padding: isMobile ? '10px 0' : '0',
                  background: 'transparent'
                }}
                placeholder="What service do you need?"
                value={quickQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />

              <div style={{
                padding: '0 12px',
                font: isMobile ? '400 12px/1 "DM Sans",sans-serif' : '400 13px/1 "DM Sans",sans-serif',
                color: '#9090A0',
                borderLeft: isMobile ? 'none' : '1px solid #EBEBEF',
                borderTop: isMobile ? '1px solid #EBEBEF' : 'none',
                paddingTop: isMobile ? '10px' : '0',
                paddingBottom: isMobile ? '10px' : '0',
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <select
                  value={quickLocation}
                  onChange={(e) => setQuickLocation(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    font: isMobile ? '400 12px/1 "DM Sans",sans-serif' : '400 13px/1 "DM Sans",sans-serif',
                    color: '#9090A0',
                    cursor: 'pointer',
                    padding: '4px 0',
                    width: '100%'
                  }}
                >
                  <option value="">Qurum ▾</option>
                  {governorates.map(g => (
                    <option key={g.id} value={g.slug}>{g.name_en}</option>
                  ))}
                </select>
              </div>

              <div style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                borderRadius: '10px',
                font: '700 13px/1 "DM Sans",sans-serif',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ fontSize: '11px' }}>✨</span>
                AI Search
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              <span style={{
                font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 13px/1 "DM Sans",sans-serif',
                color: 'rgba(255,255,255,.5)'
              }}>✓ Verified & insured</span>
              <span style={{
                font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 13px/1 "DM Sans",sans-serif',
                color: 'rgba(255,255,255,.5)'
              }}>✓ Fixed pricing</span>
              <span style={{
                font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 13px/1 "DM Sans",sans-serif',
                color: 'rgba(255,255,255,.5)'
              }}>✓ 60-second booking</span>
            </div>
          </div>
        </section>
      </div>

      {/* Search Autocomplete Dropdown Portal */}
      {showDropdown && dropdownPos.width > 0 && createPortal(
        <div
          ref={portalRef}
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 99999,
            boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            background: 'white',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(0,0,0,.06)',
            overflow: 'hidden',
            maxHeight: isMobile ? '60vh' : 'auto'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '10px 16px' : '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,.06)',
            background: '#F8F9FA'
          }}>
            <span style={{ font: isMobile ? '600 10px "DM Sans"' : '700 11px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {quickQuery.trim()
                ? (isSearching ? 'Searching database…' : `${suggestions.length} choice${suggestions.length !== 1 ? 's' : ''}`)
                : 'Trending Business Listings'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isSearching && (
                <div style={{ width: '14px', height: '14px', border: '2px solid #D61CA8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              )}
              {quickQuery.trim() && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setQuickQuery(''); setSuggestions([]) }}
                  style={{ font: isMobile ? '500 10px "DM Sans"' : '500 11px "DM Sans"', color: '#9090A0', background: 'transparent', cursor: 'pointer', border: 'none' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight: isMobile ? '40vh' : '400px', overflowY: 'auto', padding: isMobile ? '4px 0' : '8px 0' }}>
            {isSearching && suggestions.length === 0 && (
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #EBEBEF', borderRadius: '12px' }}>
                    <div className="skel" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="skel" style={{ height: '12px', borderRadius: '4px', width: '70%' }} />
                      <div className="skel" style={{ height: '8px', borderRadius: '4px', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && suggestions.some(s => s.type === 'business') && (
              <div style={{ padding: isMobile ? '8px 16px' : '12px 20px' }}>
                <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Service Providers</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                  {suggestions.filter(s => s.type === 'business').map((s, idx) => (
                    <div
                      key={`biz-${idx}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: isMobile ? '8px' : '10px',
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-gray-50 hover:border-gray-100"
                    >
                      <div style={{ width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px', borderRadius: '10px', background: '#F8F9FA', border: '1px solid #EBEBEF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {s.logo_url ? <img src={s.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={isMobile ? 14 : 16} className="text-gray-400" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ font: isMobile ? '600 12px "DM Sans"' : '700 13px "DM Sans"', color: '#0A0A0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                        </div>
                        <div style={{ font: isMobile ? '400 10px "DM Sans"' : '400 11px "DM Sans"', color: '#6B7280', display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                          {s.category && <span>{s.category}</span>}
                          {s.governorate && <span>· {s.governorate}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && suggestions.length === 0 && quickQuery.trim() && (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>🔍</span>
                <div style={{ font: '600 13px "DM Sans"', color: '#0A0A0F', marginTop: '8px' }}>No matches found for "{quickQuery}"</div>
                <div style={{ font: '400 11px "DM Sans"', color: '#9090A0', marginTop: '2px' }}>Check terminology variants or switch filters.</div>
              </div>
            )}
          </div>

          <div
            onMouseDown={(e) => { e.preventDefault(); handleQuickSearch(e) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: isMobile ? '10px' : '12px',
              borderTop: '1px solid rgba(0,0,0,.06)',
              background: '#F8F9FA',
              cursor: 'pointer',
              font: isMobile ? '600 11px "DM Sans"' : '700 12px "DM Sans"',
              color: '#D61CA8'
            }}
          >
            {quickQuery.trim() ? `Search for "${quickQuery}"` : 'Browse Complete Platform Index'}
            <ChevronRight size={isMobile ? 12 : 14} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}