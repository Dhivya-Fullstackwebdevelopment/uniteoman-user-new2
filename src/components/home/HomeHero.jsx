import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Search, Building2, ChevronRight, X,
  ShieldCheck, Zap, Globe, Star, Sparkles,
  Wrench, HeartPulse, Brush, Monitor, Package,
  PartyPopper, GraduationCap, Utensils,
  Briefcase, Stethoscope, Pill, Key, Store,
  Smartphone, MapPin, Clock, CheckCircle2, Phone
} from 'lucide-react'
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api'


export default function HomeHero() {
  const navigate = useNavigate()
  const [quickQuery, setQuickQuery] = useState('')
  const [quickLocation, setQuickLocation] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1100)
  const [locationError, setLocationError] = useState('')

  // API State
  const [locations, setLocations] = useState([])
  const [featuredBusinesses, setFeaturedBusinesses] = useState([])

  const formRef = useRef(null)
  const portalRef = useRef(null)
  const searchInputRef = useRef(null)

  // Service categories display - made this list of objects with names matching the image
  const serviceCategories = [
    { icon: "❄️", name: "AC Service", bg: "#DBEAFE" },
    { icon: "🔧", name: "Appliance Repair", bg: "#D1FAE5" },
    { icon: "👶", name: "Babysitting", bg: "#CFFAFE" },
    { icon: "💅", name: "Beauty at Home", bg: "#FCE7F3" },
    { icon: "🏠", name: "CCTV & Smart Home", bg: "#FEF3C7" },
    { icon: "🚗", name: "Car Detailing", bg: "#E0F2FE" },
    { icon: "🧹", name: "Home Cleaning", bg: "#D1FAE5" },
    { icon: "🔌", name: "Electrical", bg: "#FEF3C7" },
    { icon: "🔧", name: "Plumbing", bg: "#CFFAFE" },
    { icon: "🪛", name: "Carpentry", bg: "#EFEBE9" },
    { icon: "🪲", name: "Pest Control", bg: "#EDE9FE" },
    { icon: "🎨", name: "Painting", bg: "#FFE4E6" },
  ]

  // Fetch Locations (Governorates) and Services (Featured Listings) on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [locationsRes, servicesRes] = await Promise.all([
          axios.get(API_ENDPOINTS.LOCATIONS),
          axios.get(API_ENDPOINTS.SERVICES)
        ])

        if (locationsRes.data && locationsRes.data.status === 'success') {
          setLocations(locationsRes.data.data)
        }
        if (servicesRes.data && servicesRes.data.status === 'success') {
          setFeaturedBusinesses(servicesRes.data.data)
        }
      } catch (error) {
        console.error("Error fetching initial API data via axios:", error)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsDesktop(window.innerWidth >= 1100)
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

  // Autocomplete functionality utilizing the new endpoint configuration
  useEffect(() => {
    if (!showDropdown) return

    // If query is empty, show service categories
    if (!quickQuery.trim()) {
      setIsSearching(false)
      // Map service categories to suggestion format
      const mapped = serviceCategories.map((cat, index) => ({
        id: `cat-${index}`,
        name: cat.name,
        type: 'category',
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        rating: null,
        category: 'Service Category',
        governorate: '',
        is_verified: false,
        logo_url: null,
        icon: cat.icon,
        bg: cat.bg
      }))
      setSuggestions(mapped)
      return
    }

    if (quickQuery.length < 2) return

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await axios.get(API_ENDPOINTS.SEARCH_SERVICES(quickQuery))
        if (response.data && response.data.status === 'success') {
          const mappedResults = response.data.data.map(item => ({
            id: item.id,
            name: item.name,
            type: 'business',
            slug: item.name.toLowerCase().replace(/\s+/g, '-'),
            rating: 4.7,
            category: item.description,
            governorate: item.location?.[0]?.name || 'Muscat',
            is_verified: true,
            logo_url: item.icon
          }))
          setSuggestions(mappedResults)
        }
      } catch (err) {
        console.error('Autocomplete error via axios filtering:', err)
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [quickQuery, showDropdown, featuredBusinesses])

  // Updated handleQuickSearch - now both service and location are required
  const handleQuickSearch = (e) => {
    e?.preventDefault()
    
    // Clear previous errors
    setLocationError('')
    
    // Validate both fields are filled
    if (!quickQuery.trim()) {
      // Focus on service input if empty
      searchInputRef.current?.focus()
      return
    }
    
    if (!quickLocation) {
      setLocationError('Please select a location before searching')
      // Highlight location select
      const locationSelect = document.querySelector('select')
      if (locationSelect) {
        locationSelect.style.border = '2px solid #EF4444'
        locationSelect.style.borderRadius = '4px'
        setTimeout(() => {
          locationSelect.style.border = 'none'
        }, 3000)
      }
      return
    }

    // Both fields are filled, proceed with search
    const params = new URLSearchParams()
    if (quickQuery.trim()) params.set('q', quickQuery)
    if (quickLocation) params.set('location', quickLocation)

    navigate(`/categories?${params.toString()}`)
    setShowDropdown(false)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuickQuery(value)
    if (value.trim()) {
      setShowDropdown(true)
    } else {
      setShowDropdown(true)
    }
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleSuggestionClick = (s) => {
    // Check if location is selected before navigating from suggestion
    if (!quickLocation) {
      setLocationError('Please select a location first')
      const locationSelect = document.querySelector('select')
      if (locationSelect) {
        locationSelect.style.border = '2px solid #EF4444'
        locationSelect.style.borderRadius = '4px'
        setTimeout(() => {
          locationSelect.style.border = 'none'
        }, 3000)
      }
      return
    }
    
    // If it's a category, use the name for search
    const searchQuery = s.name
    const params = new URLSearchParams()
    params.set('q', searchQuery)
    if (quickLocation) params.set('location', quickLocation)
    navigate(`/categories?${params.toString()}`)
    setShowDropdown(false)
    setQuickQuery('')
    setSuggestions([])
  }

  const handleLocationChange = (e) => {
    setQuickLocation(e.target.value)
    setLocationError('') // Clear error when location is selected
  }

  // Filter categories based on search query
  const getFilteredCategories = () => {
    if (!quickQuery.trim()) return serviceCategories
    const query = quickQuery.toLowerCase()
    return serviceCategories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    )
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -20; }
        }
        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(74,222,128,.5); }
          70% { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
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
        .search-cta { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .search-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(214,28,168,.35); }
        .search-cta:active { transform: translateY(0); }
        
        /* Custom scrollbar for dropdown */
        .dropdown-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .dropdown-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb {
          background: #D61CA8;
          border-radius: 10px;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: #8B2EF5;
        }
      `}</style>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* HERO SECTION */}
        <section style={{
          background: 'linear-gradient(145deg,#0a0050,#200030,#0a0a1a)',
          width: '100%',
          minHeight: isMobile ? 'auto' : '95vh',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '40px 0 32px' : '0px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Gradient Orbs */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: isMobile ? '300px' : '600px',
            height: isMobile ? '300px' : '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(214,28,168,.15),transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: isMobile ? '250px' : '500px',
            height: isMobile ? '250px' : '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(139,46,245,.1),transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          {/* Content Container */}
          <div style={{
            maxWidth: '1300px',
            width: '100%',
            margin: '0 auto',
            padding: isMobile ? '0 20px' : '0 56px',
            position: 'relative',
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: isDesktop ? 'center' : 'flex-start',
            justifyContent: isDesktop ? 'space-between' : 'center',
            gap: isDesktop ? '40px' : '0px'
          }}>

            {/* LEFT: Copy + Search */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              textAlign: 'left',
              maxWidth: isDesktop ? '620px' : '100%',
              flexShrink: 0,
              width: isDesktop ? 'auto' : '100%'
            }}>
              {/* Status Badge */}
              <div className="rv" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(214,28,168,.12)',
                border: '1px solid rgba(214,28,168,.25)',
                borderRadius: '20px',
                padding: isMobile ? '6px 12px' : '6px 14px',
                marginBottom: isMobile ? '16px' : '24px',
                alignSelf: 'flex-start'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'ringPulse 1.8s infinite' }}></div>
                <span style={{
                  font: isMobile ? '600 10px/1 "DM Sans",sans-serif' : '600 12px/1 "DM Sans",sans-serif',
                  color: 'rgba(255,255,255,.75)'
                }}>
                  Available in Oman · 21 Service Packages
                </span>
              </div>

              {/* Headline */}
              <h1 className="rv d2" style={{
                font: isMobile ? '400 32px/1.1 "DM Sans",sans-serif' : '600 68px/1.1 "DM Sans",sans-serif',
                color: 'white',
                letterSpacing: isMobile ? '-0.5px' : '-2px',
                marginBottom: isMobile ? '16px' : '20px',
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
              <p className="rv d3" style={{
                font: isMobile ? '400 15px/1.6 "DM Sans",sans-serif' : '400 19px/1.6 "DM Sans",sans-serif',
                color: 'rgba(255,255,255,.6)',
                marginBottom: isMobile ? '30px' : '48px',
                textAlign: 'left',
                maxWidth: '700px'
              }}>
                Trusted professionals for AC, cleaning, plumbing, electrical and more home services — booked in 60 seconds.
              </p>

              {/* Search Container */}
              <div
                ref={formRef}
                className="rv d4"
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: isMobile ? '4px' : '6px 6px 6px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 12px 40px rgba(0,0,0,.25)',
                  maxWidth: isMobile ? '100%' : '660px',
                  width: '100%',
                  marginBottom: '28px',
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
                  placeholder="What service do you need? *"
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
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <select
                    value={quickLocation}
                    onChange={handleLocationChange}
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
                    <option value="">Select Region *</option>
                    {locations.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  {locationError && (
                    <span style={{
                      color: '#EF4444',
                      fontSize: '10px',
                      font: '500 10px "DM Sans",sans-serif',
                      textAlign: 'center'
                    }}>
                      {locationError}
                    </span>
                  )}
                </div>

                <div
                  className="search-cta"
                  onClick={handleQuickSearch}
                  style={{
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
              <div className="rv d5" style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start'
              }}>
                <span style={{
                  font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 14px/1 "DM Sans",sans-serif',
                  color: 'rgba(255,255,255,.5)'
                }}>✓ Verified & insured</span>
                <span style={{
                  font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 14px/1 "DM Sans",sans-serif',
                  color: 'rgba(255,255,255,.5)'
                }}>✓ Fixed pricing</span>
                <span style={{
                  font: isMobile ? '400 11px/1 "DM Sans",sans-serif' : '400 14px/1 "DM Sans",sans-serif',
                  color: 'rgba(255,255,255,.5)'
                }}>✓ 60-second booking</span>
              </div>
            </div>

            {/* RIGHT: Live booking visual (Desktop only) */}
            {isDesktop && (
              <div className="rv d3" style={{
                position: 'relative',
                width: '420px',
                height: '480px',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '420px',
                  height: '420px',
                  background: 'radial-gradient(circle, rgba(214,28,168,.18), transparent 65%)',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '10px',
                  width: '360px',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 24px 60px rgba(0,0,0,.35)',
                  animation: 'float 6s ease-in-out infinite'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        font: '700 14px "DM Sans",sans-serif', color: '#fff'
                      }}>M</div>
                      <div>
                        <div style={{ font: '700 13px "DM Sans",sans-serif', color: '#fff' }}>Mohammed Al-Balushi</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', font: '400 11px "DM Sans",sans-serif', color: 'rgba(255,255,255,.55)' }}>
                          <Star size={10} fill="#facc15" stroke="none" /> 4.9 · AC Deep Cleaning
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)',
                      borderRadius: '20px', padding: '4px 10px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                      <span style={{ font: '600 10px "DM Sans",sans-serif', color: '#4ade80' }}>On the way</span>
                    </div>
                  </div>

                  <div style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '14px',
                    background: 'linear-gradient(160deg,#151022,#0e0a1a)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    marginBottom: '14px'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 340 140" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <path d="M20,110 C 90,90 120,40 180,50 S 300,30 320,20" stroke="url(#routeGrad)" strokeWidth="3" fill="none" strokeDasharray="6 6" style={{ animation: 'dashMove 1.2s linear infinite' }} />
                      <defs>
                        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#D61CA8" />
                          <stop offset="100%" stopColor="#8B2EF5" />
                        </linearGradient>
                      </defs>
                      <circle cx="20" cy="110" r="6" fill="#8B2EF5" stroke="#fff" strokeWidth="2" />
                      <circle cx="320" cy="20" r="6" fill="#D61CA8" stroke="#fff" strokeWidth="2" />
                    </svg>
                    <div style={{
                      position: 'absolute', bottom: '10px', left: '10px',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(0,0,0,.45)', borderRadius: '8px', padding: '4px 8px'
                    }}>
                      <MapPin size={11} color="#D61CA8" />
                      <span style={{ font: '500 10px "DM Sans",sans-serif', color: 'rgba(255,255,255,.8)' }}>0.8 km away</span>
                    </div>
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(0,0,0,.45)', borderRadius: '8px', padding: '4px 8px'
                    }}>
                      <Clock size={11} color="#4ade80" />
                      <span style={{ font: '500 10px "DM Sans",sans-serif', color: 'rgba(255,255,255,.8)' }}>Arriving in 12 min</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ font: '400 10px "DM Sans",sans-serif', color: 'rgba(255,255,255,.5)' }}>Total</div>
                      <div style={{ font: '700 16px "DM Sans",sans-serif', color: '#fff' }}>OMR 15.000</div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                      borderRadius: '10px', padding: '9px 16px',
                      font: '700 11px "DM Sans",sans-serif', color: '#fff'
                    }}>
                      <Phone size={11} /> Call Pro
                    </div>
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '0px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'floatSlow 7s ease-in-out infinite'
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Star size={14} fill="#fff" stroke="none" />
                  </div>
                  <div>
                    <div style={{ font: '700 13px "DM Sans",sans-serif', color: '#0A0A0F' }}>4.8/5</div>
                    <div style={{ font: '400 9px "DM Sans",sans-serif', color: '#9090A0' }}>Top Rated Providers</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Dropdown Portal with scrollable content */}
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
            maxHeight: isMobile ? '60vh' : '350px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '10px 16px' : '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,.06)',
            background: '#F8F9FA',
            flexShrink: 0
          }}>
            <span style={{ font: isMobile ? '600 10px "DM Sans"' : '700 11px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {quickQuery.trim()
                ? (isSearching ? 'Searching database…' : `${suggestions.length} choice${suggestions.length !== 1 ? 's' : ''}`)
                : 'TRENDING HOME SERVICES'}
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

          {/* Scrollable content area */}
          <div 
            className="dropdown-scroll"
            style={{ 
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '4px 0' : '8px 0',
              minHeight: '100px',
              maxHeight: isMobile ? '40vh' : '380px'
            }}
          >
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

            {!isSearching && suggestions.length > 0 && (
              <div style={{ padding: '12px 20px' }}>
                <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {quickQuery.trim() ? 'AVAILABLE SERVICES' : 'AVAILABLE SERVICES'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                  {suggestions.map((s, idx) => (
                    <div
                      key={`sug-${idx}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1px solid #EBEBEF',
                        cursor: 'pointer',
                        background: '#FFF',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D61CA8'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(214,28,168,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#EBEBEF'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '10px', 
                        background: s.bg || '#F8F9FA', 
                        border: '1px solid #EBEBEF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        overflow: 'hidden', 
                        flexShrink: 0,
                        fontSize: '20px'
                      }}>
                        {s.icon || (s.logo_url ? <img src={s.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={16} className="text-gray-400" />)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ font: '700 13px "DM Sans"', color: '#0A0A0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ font: '400 11px "DM Sans"', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.type === 'category' ? 'Service Category' : s.category || 'Available'}
                        </div>
                      </div>
                      {s.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                          <Star size={12} fill="#facc15" stroke="none" />
                          <span style={{ font: '600 10px "DM Sans"', color: '#0A0A0F' }}>{s.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && suggestions.length === 0 && quickQuery.trim() && (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>🔍</span>
                <div style={{ font: '600 13px "DM Sans"', color: '#0A0A0F', marginTop: '8px' }}>No matches found for "{quickQuery}"</div>
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
              padding: '12px',
              borderTop: '1px solid rgba(0,0,0,.06)',
              background: '#F8F9FA',
              cursor: 'pointer',
              font: '700 12px "DM Sans"',
              color: '#D61CA8',
              flexShrink: 0,
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F0EFF4'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#F8F9FA'}
          >
            {quickQuery.trim() ? `Search for "${quickQuery}"` : 'Browse Services Index >'}
            <ChevronRight size={14} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}