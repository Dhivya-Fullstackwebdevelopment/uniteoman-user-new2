import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

const scrollStyles = `
  .professionals-scroll {
    max-height: 620px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(128, 128, 128, 0.3) transparent;
  }
  .professionals-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .professionals-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  .professionals-scroll::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 10px;
    transition: background 0.3s ease;
  }
  .professionals-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.5);
  }
`

export default function BusinessSelection() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const professionalId = searchParams.get('professional_id') || ''
  const serviceTypeId = searchParams.get('service_type_id') || ''
  const proName = searchParams.get('pro') || ''
  const locationId = searchParams.get('location_id') || '1'
  const serviceId = searchParams.get('service_id') || '1'

  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilterTab, setActiveFilterTab] = useState('All')
  const [minRating, setMinRating] = useState('4')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [availableServices, setAvailableServices] = useState([])
  const [aiContext, setAiContext] = useState('')
  const [aiSummaryNote, setAiSummaryNote] = useState('')
  const [aiTopPicks, setAiTopPicks] = useState([])
  const [counts, setCounts] = useState({ all: 0, available_today: 0, top_rated: 0, nearest: 0 })
  const [displayCount, setDisplayCount] = useState(5)
  const [filters, setFilters] = useState({
    service_type_id: serviceTypeId || '',
    min_rating: '',
    price_min: '',
    price_max: '',
    sort: '',
    search: ''
  })

  // Fetch professionals conditionally based on query presence
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (filters.service_type_id) params.append('service_type_id', filters.service_type_id)
        if (filters.min_rating) params.append('min_rating', filters.min_rating)
        if (filters.price_min) params.append('price_min', filters.price_min)
        if (filters.price_max) params.append('price_max', filters.price_max)
        if (filters.sort) params.append('sort', filters.sort)
        if (filters.search) params.append('search', filters.search)

        params.append('location_id', locationId)
        params.append('service_id', serviceId)

        let url = ''

        if (professionalId) {
          const baseUrl = API_ENDPOINTS.PROFESSIONAL_DETAIL(professionalId)
          url = `${baseUrl}?${params.toString()}`
        } else {
          const baseUrl = API_ENDPOINTS.PROFESSIONALS_BY_LOCATION_AND_SERVICE(locationId, serviceId)
          url = `${baseUrl}&${params.toString()}`
        }

        const response = await axios.get(url)

        if (response.data && response.data.status === 'success') {
          const fetchedData = response.data.data;

          if (professionalId) {
            const individualPro = {
              id: fetchedData.id,
              name: fetchedData.name,
              specialty: fetchedData.specialty,
              area: fetchedData.area,
              rating: fetchedData.rating,
              jobs_done: fetchedData.jobs_done,
              price: fetchedData.services_offered?.[0]?.price || '0',
              distance_km: fetchedData.distance_km,
              ai_match_score: fetchedData.ai_match_score,
              initial: fetchedData.name?.charAt(0) || 'P'
            }

            setProfessionals([individualPro])
            setAiTopPicks(response.data.data.ai_top_picks || [])
            setAiSummaryNote(response.data.data.ai_summary_note || '')
          } else {
            setProfessionals(fetchedData || [])
            setAiTopPicks(response.data.ai_top_picks || [])
            setAiSummaryNote(response.data.ai_summary_note || '')
            setCounts(response.data.counts || { all: 0, available_today: 0, top_rated: 0, nearest: 0 })
          }

          if (response.data.search_label) {
            setAiContext(response.data.search_label)
          }
        }
      } catch (error) {
        console.error("Error managing professionals allocation stream:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessionals()
  }, [filters, locationId, serviceId, professionalId])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(5)
  }, [filters, professionals])

  // Fetch available services (service types) for filter
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.SERVICES}?service_id=${serviceId}`)
        if (response.data && response.data.status === 'success' && response.data.data.length > 0) {
          const service = response.data.data[0]
          if (service.service_types) {
            setAvailableServices(service.service_types)
            if (serviceTypeId) {
              setSelectedServices([parseInt(serviceTypeId)])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }
    fetchServices()
  }, [serviceTypeId, serviceId])

  const handleProfileNavigation = (id, name) => {
    navigate(`/business/${id}/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`)
  }

  const handleBook = (id, name) => {
    navigate(`/BookingPage?professional_id=${id}&name=${encodeURIComponent(name)}&service_id=${serviceId}&location_id=${locationId}`)
  }

  const handleFilterTab = (tab) => {
    setActiveFilterTab(tab)
    let sort = ''
    switch (tab) {
      case 'Available Today':
        sort = 'available_today'
        break
      case 'Top Rated':
        sort = 'top_rated'
        break
      case 'Nearest':
        sort = 'nearest'
        break
      case 'Lowest Price':
        sort = 'lowest_price'
        break
      default:
        sort = ''
    }
    setFilters(prev => ({ ...prev, sort }))
  }

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
    setFilters(prev => ({
      ...prev,
      service_type_id: selectedServices.length > 0 ? selectedServices.join(',') : ''
    }))
  }

  const handlePriceRange = (range) => {
    setSelectedPriceRange(range)
    let priceMin = '', priceMax = ''
    switch (range) {
      case '0-15':
        priceMin = '0'
        priceMax = '15'
        break
      case '15-30':
        priceMin = '15'
        priceMax = '30'
        break
      case '30+':
        priceMin = '30'
        priceMax = ''
        break
      default:
        priceMin = ''
        priceMax = ''
    }
    setFilters(prev => ({
      ...prev,
      price_min: priceMin,
      price_max: priceMax
    }))
  }

  const handleRatingFilter = (rating) => {
    setMinRating(rating)
    setFilters(prev => ({ ...prev, min_rating: rating }))
  }

  // Load more professionals (show 5 more)
  const loadMoreProfessionals = () => {
    setDisplayCount(prev => Math.min(prev + 5, allProfessionals.length))
  }

  // Get all professionals (combine filtered + AI picks)
  const getAllProfessionals = () => {
    let filtered = [...professionals]
    
    if (selectedServices.length > 0) {
      filtered = filtered.filter(p => selectedServices.includes(p.service_type_id))
    }
    
    // Combine with AI picks (avoid duplicates)
    const combined = [...filtered]
    aiTopPicks.forEach(pick => {
      if (!combined.some(p => p.id === pick.id)) {
        combined.push(pick)
      }
    })
    
    return combined
  }

  const allProfessionals = getAllProfessionals()
  const displayedProfessionals = allProfessionals.slice(0, displayCount)
  const hasMoreProfessionals = displayCount < allProfessionals.length

  // Get tab counts
  const getTabCount = (tab) => {
    switch (tab) {
      case 'All': return counts.all || allProfessionals.length
      case 'Available Today': return counts.available_today || 0
      case 'Top Rated': return counts.top_rated || 0
      case 'Nearest': return counts.nearest || 0
      default: return 0
    }
  }

  // Loading shimmer
  const renderShimmer = () => (
    <>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={`shimmer-${idx}`} style={{
          background: 'white',
          borderRadius: '14px',
          padding: '16px',
          border: '1.5px solid #EBEBEF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              flexShrink: 0
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                height: '18px',
                width: '60%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '8px'
              }} />
              <div style={{
                height: '14px',
                width: '40%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </div>
      ))}
    </>
  )

  return (
    <div className="workspace-container" style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        ${scrollStyles}
        .workspace-container {
          padding: 20px 56px;
        }
        .main-split-pane {
          display: flex;
          gap: 20px;
        }
        .sidebar-filters {
          width: 220px;
          flex-shrink: 0;
        }
        .business-card {
          background: white;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          border: 1.5px solid #EBEBEF;
          transition: all 0.2s ease;
          margin-bottom: 12px;
        }
        .business-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,.1);
          border-color: rgba(214,28,168,.2);
        }
        .business-card:last-child {
          margin-bottom: 0;
        }
        .ai-context-text {
          font: 400 13px/1.5 "DM Sans", sans-serif;
          color: #9090A0;
        }

        @media (max-width: 1024px) {
          .workspace-container {
            padding: 20px 24px;
          }
        }

        @media (max-width: 768px) {
          .workspace-container {
            padding: 16px;
          }
          .main-split-pane {
            flex-direction: column;
            gap: 16px;
          }
          .sidebar-filters {
            width: 100%;
          }
          .business-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .business-card .pricing-actions-panel {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1.5px solid #F4F5F8;
            padding-top: 12px;
            margin-top: 4px;
          }
          .business-card .pricing-actions-panel .price-meta {
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ padding: '8px 0 16px 0', font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
          <Link to="/" style={{ color: '#9090A0', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link to="/categories" style={{ color: '#9090A0', textDecoration: 'none' }}>Services</Link> ›{' '}
          <Link to="/business-list" style={{ color: '#9090A0', textDecoration: 'none' }}>AC Services</Link> ›{' '}
          <strong style={{ color: '#0A0A0F' }}>Professionals</strong>
        </div>

        {/* Search Context / AI Alert Prompt Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9090A0' }}>
            ✨ <span style={{ color: '#D61CA8', fontWeight: 700 }}>AI:</span>
          </div>
          <div className="ai-context-text">
            {aiContext || `Searching for "${proName || 'AC services'}" — ${allProfessionals.length} results`}
          </div>
        </div>

        {/* Action Layout Filter Quick Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All', 'Available Today', 'Top Rated', 'Nearest', 'Lowest Price'].map((tab) => {
            const isActive = activeFilterTab === tab
            const count = getTabCount(tab)
            return (
              <div
                key={tab}
                onClick={() => handleFilterTab(tab)}
                style={{
                  padding: '6px 14px',
                  background: isActive ? BRAND_GRADIENT : 'white',
                  border: isActive ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                  borderRadius: '20px',
                  font: isActive ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                  color: isActive ? 'white' : '#9090A0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab} {count > 0 && `(${count})`}
              </div>
            )
          })}
        </div>

        {/* Core Layout Split Pane */}
        <div className="main-split-pane">

          {/* SIDEBAR FILTERS CONTROL COMPONENT */}
          <div className="sidebar-filters">
            <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '16px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Filters</div>

              {/* Service Checkbox Filters Block */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Service
                </div>
                {availableServices.map((service) => {
                  const isChecked = selectedServices.includes(service.id)
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        marginBottom: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        background: isChecked ? '#D61CA8' : 'transparent',
                        border: isChecked ? '2px solid #D61CA8' : '2px solid #EBEBEF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isChecked && <span style={{ fontSize: '9px', color: 'white' }}>✓</span>}
                      </div>
                      <span style={{
                        font: isChecked ? '600 12px/1 "DM Sans", sans-serif' : '400 12px/1 "DM Sans", sans-serif',
                        color: isChecked ? '#0A0A0F' : '#9090A0'
                      }}>
                        {service.type_name}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Price Range Filter Segment */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Price Range
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['0-15', '15-30', '30+'].map((range) => {
                    const isSelected = selectedPriceRange === range
                    return (
                      <div
                        key={range}
                        onClick={() => handlePriceRange(range)}
                        style={{
                          padding: '4px 9px',
                          background: isSelected ? 'rgba(214,28,168,.08)' : 'white',
                          border: isSelected ? '1.5px solid rgba(214,28,168,.3)' : '1.5px solid #EBEBEF',
                          borderRadius: '8px',
                          font: isSelected ? '700 10px/1 "DM Sans", sans-serif' : '500 10px/1 "DM Sans", sans-serif',
                          color: isSelected ? '#D61CA8' : '#9090A0',
                          cursor: 'pointer'
                        }}
                      >
                        OMR {range.replace('-', '–')}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Min Rating Filter Action Chips */}
              <div>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Min Rating
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['4', '4.5', '5'].map((rate) => {
                    const isSelected = minRating === rate
                    return (
                      <div
                        key={rate}
                        onClick={() => handleRatingFilter(rate)}
                        style={{
                          padding: '4px 8px',
                          background: isSelected ? BRAND_GRADIENT : 'white',
                          borderRadius: '8px',
                          font: isSelected ? '700 10px/1 "DM Sans", sans-serif' : '500 10px/1 "DM Sans", sans-serif',
                          color: isSelected ? 'white' : '#9090A0',
                          border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                          cursor: 'pointer'
                        }}
                      >
                        {rate}★
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Clear Filters */}
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setFilters({ service_type_id: '', min_rating: '', price_min: '', price_max: '', sort: '', search: '' })
                    setSelectedServices([])
                    setSelectedPriceRange('')
                    setMinRating('4')
                    setActiveFilterTab('All')
                    setDisplayCount(5)
                  }}
                  style={{
                    padding: '6px 16px',
                    background: 'transparent',
                    border: '1px solid #EBEBEF',
                    borderRadius: '8px',
                    font: '500 11px/1 "DM Sans", sans-serif',
                    color: '#9090A0',
                    cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS CONTENT FEED PANEL - SCROLLABLE */}
          <div style={{ flex: 1 }}>
            {loading ? (
              renderShimmer()
            ) : displayedProfessionals.length > 0 ? (
              <>
                <div className="professionals-scroll">
                  {displayedProfessionals.map((pro) => {
                    const isAIPick = aiTopPicks.some(p => p.id === pro.id)
                    const aiMatch = aiTopPicks.find(p => p.id === pro.id) || pro

                    return (
                      <div key={pro.id} className="business-card">
                        {/* Initial Avatar circle */}
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: BRAND_GRADIENT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          font: '700 20px "DM Sans", sans-serif',
                          color: 'white',
                          flexShrink: 0
                        }}>
                          {pro.initial || pro.name?.charAt(0) || 'P'}
                        </div>

                        {/* Listing central details layout */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                              {pro.name}
                            </div>
                            {isAIPick && (
                              <div style={{ padding: '2px 8px', background: '#D1FAE5', borderRadius: '5px', font: '700 8px/1 "DM Sans", sans-serif', color: '#059669' }}>
                                ✨ AI Pick
                              </div>
                            )}
                            {aiMatch?.is_best && (
                              <div style={{ padding: '2px 8px', background: '#FEF3C7', borderRadius: '5px', font: '700 8px/1 "DM Sans", sans-serif', color: '#D97706' }}>
                                Best Match
                              </div>
                            )}
                          </div>
                          <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px' }}>
                            {pro.specialty || 'Professional'} · {pro.distance_km ? `${pro.distance_km} km away` : pro.area || 'Near you'}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                              ★ {pro.rating || '4.0'}
                            </div>
                            <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                              {pro.jobs_done || 0} jobs
                            </div>
                            <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                              Next: {pro.next_available || 'Today'}
                            </div>
                            {pro.ai_match_score && (
                              <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                                Match {pro.ai_match_score}%
                              </div>
                            )}
                          </div>
                          {aiMatch?.ai_match_note && (
                            <div style={{ font: '400 10px/1.4 "DM Sans", sans-serif', color: '#6B7280', marginTop: '4px' }}>
                              💡 {aiMatch.ai_match_note}
                            </div>
                          )}
                        </div>

                        {/* Right side pricing metric and actions layout panel */}
                        <div className="pricing-actions-panel" style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div className="price-meta" style={{ marginBottom: '10px' }}>
                            <div style={{ font: '600 18px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                              OMR {pro.price || '0'}
                            </div>
                            <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                              per visit
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '7px' }}>
                            <div
                              onClick={() => handleProfileNavigation(pro.id, pro.name)}
                              style={{
                                padding: '7px 12px',
                                background: '#F4F5F8',
                                border: '1.5px solid #EBEBEF',
                                borderRadius: '8px',
                                font: '600 12px/1 "DM Sans", sans-serif',
                                color: '#9090A0',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#EBEBEF'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#F4F5F8'
                              }}
                            >
                              Profile
                            </div>
                            <div
                              onClick={() => handleBook(pro.id, pro.name)}
                              style={{
                                padding: '7px 16px',
                                background: BRAND_GRADIENT,
                                borderRadius: '8px',
                                font: '700 12px/1 "DM Sans", sans-serif',
                                color: 'white',
                                cursor: 'pointer',
                                boxShadow: '0 3px 10px rgba(214,28,168,.25)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.02)'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)'
                              }}
                            >
                              Book →
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Load More Button - Outside scroll container */}
                {hasMoreProfessionals && (
                  <div style={{ textAlign: 'center', padding: '12px 0 4px 0' }}>
                    <button
                      onClick={loadMoreProfessionals}
                      style={{
                        padding: '10px 30px',
                        background: 'transparent',
                        border: '1.5px solid #D61CA8',
                        borderRadius: '10px',
                        font: '600 13px/1 "DM Sans", sans-serif',
                        color: '#D61CA8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(214,28,168,.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent'
                      }}
                    >
                      Show {Math.min(5, allProfessionals.length - displayCount)} More Professionals ↓
                    </button>
                    <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '6px' }}>
                      Showing {displayCount} of {allProfessionals.length} professionals
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#9090A0',
                font: '400 14px/1.5 "DM Sans", sans-serif'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                No professionals found matching your filters. Try adjusting your search criteria.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}