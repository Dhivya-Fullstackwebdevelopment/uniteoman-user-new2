import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useSelector, useDispatch } from 'react-redux'
import {
  setSelectedServiceType,
  selectSelectedServiceType,
  setSelectedService,
  setSelectedLocation
} from '../store/slices/searchSlice'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

const ShimmerCard = ({ height = '80px', width = '100%', borderRadius = '16px' }) => (
  <div style={{
    height,
    width,
    borderRadius,
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    marginBottom: '10px'
  }} />
)

const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .service-scroll {
    max-height: 560px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(128, 128, 128, 0.3) transparent;
  }
  .service-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .service-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  .service-scroll::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 10px;
    transition: background 0.3s ease;
  }
  .service-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.5);
  }
`

export default function BusinessListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get URL parameters
  const urlServiceId = searchParams.get('service_id') || '1'
  const urlLocation = searchParams.get('location_id') || '1'
  const urlCategory = searchParams.get('category') || ''

  const [serviceData, setServiceData] = useState(null)
  const [serviceTypes, setServiceTypes] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [aiTopPicks, setAiTopPicks] = useState([])
  const [aiSummaryNote, setAiSummaryNote] = useState('')
  // const [selectedServiceTypeId, setSelectedServiceTypeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serviceName, setServiceName] = useState('')
  const [serviceIcon, setServiceIcon] = useState('')
  const [locationName, setLocationName] = useState('')
  const [displayCount, setDisplayCount] = useState(10) 
  const serviceScrollRef = useRef(null)
  const selectedServiceType = useSelector(selectSelectedServiceType)
  const selectedServiceTypeId = selectedServiceType.id
  console.log("selectedServiceType","selectedServiceTypeId",selectedServiceType, selectedServiceTypeId, )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const serviceResponse = await axios.get(`${API_ENDPOINTS.SERVICES}?service_id=${urlServiceId}`)
        if (serviceResponse.data && serviceResponse.data.status === 'success' && serviceResponse.data.data.length > 0) {
          const service = serviceResponse.data.data[0]
          setServiceData(service)
          setServiceName(service.name)
          setServiceIcon(service.icon || '❄️')

          // Store selected service (top-level) in Redux
          dispatch(setSelectedService({ id: service.id, name: service.name }))

          if (service.location) {
            setLocationName(service.location.name || '')
            dispatch(setSelectedLocation({ id: urlLocation, name: service.location.name || '' }))
          }

          if (service.service_types && service.service_types.length > 0) {
            setServiceTypes(service.service_types)

            // Only auto-select first type if nothing already chosen for this service
            if (!selectedServiceType.id || selectedServiceType.id !== service.service_types[0].id) {
              const first = service.service_types[0]
              dispatch(setSelectedServiceType({
                id: first.id,
                name: first.type_name,
                price: first.price,
                duration: first.duration
              }))
            }
          }
        }

        const proResponse = await axios.get(
          API_ENDPOINTS.PROFESSIONALS_BY_LOCATION_AND_SERVICE(urlLocation, urlServiceId)
        )
        if (proResponse.data && proResponse.data.status === 'success') {
          setProfessionals(proResponse.data.data || [])
          if (proResponse.data.ai_top_picks) setAiTopPicks(proResponse.data.ai_top_picks)
          if (proResponse.data.ai_summary_note) setAiSummaryNote(proResponse.data.ai_summary_note)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlServiceId, urlLocation])

  useEffect(() => {
    setDisplayCount(10) // Changed to 10
  }, [serviceTypes])

  const handleBookProfessional = (professionalId) => {
    const finalServiceTypeId = selectedServiceTypeId || serviceTypes[0]?.id
    navigate(`/BusinessSelection?professional_id=${professionalId}&service_type_id=${finalServiceTypeId}&service_id=${urlServiceId}&location_id=${urlLocation}`)
  }

  const handleServiceTypeSelect = (service) => {
    dispatch(setSelectedServiceType({
      id: service.id,
      name: service.type_name,
      price: service.price,
      duration: service.duration
    }))
  }

  const loadMoreServices = () => {
    setDisplayCount(prev => Math.min(prev + 10, serviceTypes.length)) // Changed to 10
  }

  const getServiceIcon = (name) => {
    if (!name) return '🛠️'
    const iconMap = {
      'ac': '❄️',
      'cleaning': '🧹',
      'plumbing': '🔧',
      'electrical': '⚡',
      'beauty': '💅',
      'carpentry': '🪚',
      'pest': '🐜',
      'painting': '🎨',
      'car': '🚗',
      'pool': '🏊',
      'renovation': '🏗️',
      'landscaping': '🌿',
      'moving': '📦',
      'water': '💧',
      'cctv': '📹',
      'fitness': '💪',
      'laundry': '👕',
      'pet': '🐾',
      'window': '🪟',
      'appliance': '🔌',
      'babysitting': '👶'
    }
    const lowerName = name.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon
      }
    }
    return '🛠️'
  }

  const getIconBg = (name) => {
    if (!name) return '#F1F5F9'
    const bgMap = {
      'ac': '#DBEAFE',
      'cleaning': '#D1FAE5',
      'plumbing': '#CFFAFE',
      'electrical': '#FEF3C7',
      'beauty': '#FCE7F3',
      'carpentry': '#EFEBE9',
      'pest': '#EDE9FE',
      'painting': '#FFE4E6',
      'car': '#E0F2FE',
      'pool': '#ECFDF5',
      'renovation': '#FEF3C7',
      'landscaping': '#D1FAE5',
      'moving': '#CFFAFE',
      'water': '#DBEAFE',
      'cctv': '#EDE9FE',
      'fitness': '#FCE7F3',
      'laundry': '#E0F2FE',
      'pet': '#FFE4E6',
      'window': '#CFFAFE',
      'appliance': '#FEF3C7',
      'babysitting': '#FCE7F3'
    }
    const lowerName = name.toLowerCase()
    for (const [key, color] of Object.entries(bgMap)) {
      if (lowerName.includes(key)) {
        return color
      }
    }
    return '#F1F5F9'
  }

  const renderServiceIcon = (icon, name, size = '30px') => {
    if (icon && icon.startsWith('http')) {
      return <img src={icon} alt={name} style={{ width: size, height: size, objectFit: 'contain' }} />
    }
    return <span style={{ fontSize: size }}>{getServiceIcon(name)}</span>
  }

  const displayedServices = serviceTypes.slice(0, displayCount)
  const hasMoreServices = displayCount < serviceTypes.length

  const renderShimmerServices = () => (
    <>
      {Array.from({ length: 8 }).map((_, idx) => (
        <ShimmerCard key={`shimmer-${idx}`} height="80px" borderRadius="13px" />
      ))}
    </>
  )

  const renderShimmerAIPicks = () => (
    <>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={`ai-shimmer-${idx}`} style={{ background: 'white', borderRadius: '12px', padding: '12px', marginBottom: '9px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
            <ShimmerCard height="36px" width="36px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
              <ShimmerCard height="16px" width="80%" borderRadius="4px" />
              <ShimmerCard height="12px" width="60%" borderRadius="4px" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <ShimmerCard height="20px" width="50px" borderRadius="6px" />
            <ShimmerCard height="20px" width="50px" borderRadius="6px" />
            <ShimmerCard height="20px" width="50px" borderRadius="6px" />
          </div>
          <ShimmerCard height="32px" width="100%" borderRadius="8px" />
        </div>
      ))}
    </>
  )

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        ${shimmerStyles}
        @media (max-width: 900px) {
          .bl-grid { grid-template-columns: 1fr !important; }
          .bl-left { border-right: none !important; border-bottom: 1px solid #EBEBEF !important; padding: 20px 20px !important; }
          .bl-right { padding: 20px !important; }
          .bl-breadcrumbs { padding: 12px 20px !important; }
        }
        @media (max-width: 560px) {
          .bl-service-row { flex-wrap: wrap !important; }
          .bl-service-price { width: 100% !important; display: flex !important; align-items: center !important; justify-content: space-between !important; margin-top: 8px !important; text-align: left !important; }
        }
      `}</style>

      <div style={{ padding: '12px 56px', borderBottom: '1px solid #EBEBEF', font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }} className="bl-breadcrumbs">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <Link to="/" style={{ color: '#9090A0', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link to="/categories" style={{ color: '#9090A0', textDecoration: 'none' }}>Services</Link> ›{' '}
          <strong style={{ color: '#0A0A0F' }}>{loading ? 'Loading...' : serviceName || 'Service'}</strong>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px' }} className="bl-grid">

          <div style={{ padding: '26px 40px 26px 56px', borderRight: '1px solid #EBEBEF' }} className="bl-left">

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
              {loading ? (
                <ShimmerCard height="62px" width="62px" borderRadius="18px" />
              ) : (
                <div style={{
                  width: '62px',
                  height: '62px',
                  background: getIconBg(serviceName),
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                  flexShrink: 0
                }}>
                  {renderServiceIcon(serviceIcon, serviceName, '30px')}
                </div>
              )}
              <div>
                {loading ? (
                  <>
                    <ShimmerCard height="28px" width="180px" borderRadius="4px" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '5px' }}>
                      <ShimmerCard height="14px" width="60px" borderRadius="4px" />
                      <ShimmerCard height="14px" width="80px" borderRadius="4px" />
                      <ShimmerCard height="14px" width="120px" borderRadius="4px" />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-.8px', margin: 0 }}>
                      {serviceName || 'Service'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '5px', flexWrap: 'wrap' }}>
                      <span style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#F59E0B' }}>★ {professionals.length > 0 ? professionals[0]?.rating || '4.8' : '4.8'}</span>
                      <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                        ({professionals.reduce((acc, p) => acc + (p.jobs_done || 0), 0) || 0} jobs)
                      </span>
                      <span style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#10B981' }}>
                        {professionals.filter(p => p.is_available_today).length || 0} pros available today
                      </span>
                      {locationName && (
                        <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                          · {locationName}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>
              Choose a Service {serviceTypes.length > 0 && <span style={{ fontWeight: '400', color: '#9090A0', fontSize: '12px' }}>({serviceTypes.length} available)</span>}
            </div>

            <div className="service-scroll" ref={serviceScrollRef}>
              {loading ? (
                renderShimmerServices()
              ) : serviceTypes.length > 0 ? (
                <>
                  {displayedServices.map((service) => {
                    const isSelected = selectedServiceTypeId === service.id
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleServiceTypeSelect(service)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '13px',
                          padding: '13px',
                          borderRadius: '13px',
                          cursor: 'pointer',
                          border: isSelected ? '1.5px solid rgba(214,28,168,.3)' : '1.5px solid #EBEBEF',
                          background: isSelected ? 'rgba(214,28,168,.03)' : '#F4F5F8',
                          transition: 'all 0.2s ease',
                          marginBottom: '9px'
                        }}
                        className="bl-service-row"
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          background: '#DBEAFE',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {renderServiceIcon(service.icon, service.type_name, '24px')}
                        </div>

                        <div style={{ flex: 1, minWidth: '150px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                              {service.type_name}
                            </div>
                            {service.id === serviceTypes[0]?.id && (
                              <div style={{ padding: '2px 7px', background: 'rgba(214,28,168,.1)', borderRadius: '4px', font: '700 8px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>
                                POPULAR
                              </div>
                            )}
                          </div>
                          <div style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>
                            {service.description || 'Professional service'}
                          </div>
                          <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>
                            ⏱ {service.duration || '1 Hour'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }} className="bl-service-price">
                          <div style={{ font: '600 15px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                            OMR {service.price || serviceData?.starting_price || '0'}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/BusinessSelection?service_type_id=${service.id}&service_id=${urlServiceId}&location_id=${urlLocation}`)
                            }}
                            style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                          >
                            Book →
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {hasMoreServices && (
                    <div style={{ textAlign: 'center', padding: '8px 0 4px 0' }}>
                      <button
                        onClick={loadMoreServices}
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
                        Show {Math.min(10, serviceTypes.length - displayCount)} More Services ↓
                      </button>
                      <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '6px' }}>
                        Showing {displayCount} of {serviceTypes.length} services
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9090A0' }}>
                  No service types available
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '24px', background: '#F4F5F8' }} className="bl-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px' }}>✨</span>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                AI Top Picks Near You
              </div>
            </div>

            {loading ? (
              renderShimmerAIPicks()
            ) : aiTopPicks.length > 0 ? (
              aiTopPicks.map((pro) => (
                <div
                  key={pro.id}
                  style={{ background: 'white', borderRadius: '12px', padding: '12px', marginBottom: '9px', boxShadow: '0 1px 5px rgba(0,0,0,.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: BRAND_GRADIENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: '700 14px "DM Sans", sans-serif',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {pro.initial || pro.name?.charAt(0) || 'P'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                        {pro.name}
                      </div>
                      <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>
                        {pro.distance_km ? `${pro.distance_km} km` : pro.area || ''} · Next: {pro.next_available || 'Today'}
                      </div>
                    </div>
                    {pro.is_best && (
                      <div style={{ padding: '2px 7px', background: '#D1FAE5', borderRadius: '5px', font: '700 8px/1 "DM Sans", sans-serif', color: '#059669' }}>
                        ✨ Best
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '3px 8px', background: '#F4F5F8', borderRadius: '6px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                      ★ {pro.rating || '4.8'}
                    </div>
                    <div style={{ padding: '3px 8px', background: '#F4F5F8', borderRadius: '6px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                      {pro.jobs_done || 0} jobs
                    </div>
                    <div style={{ padding: '3px 8px', background: '#F4F5F8', borderRadius: '6px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                      Match {pro.ai_match_score || 0}%
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(setSelectedServiceType({
                        id: service.id,
                        name: service.type_name,
                        price: service.price,
                        duration: service.duration
                      }))
                      navigate(`/BusinessSelection?service_type_id=${service.id}&service_id=${urlServiceId}&location_id=${urlLocation}`)
                    }} style={{ width: '100%', padding: '7px', background: BRAND_GRADIENT, borderRadius: '8px', textAlign: 'center', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                  >
                    Book {pro.name?.split(' ')[0] || 'Pro'}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#9090A0', fontSize: '12px' }}>
                No AI picks available
              </div>
            )}

            <div style={{ background: 'rgba(214,28,168,.04)', border: '1px solid rgba(214,28,168,.15)', borderRadius: '12px', padding: '11px', display: 'flex', gap: '7px', marginTop: '9px' }}>
              <span style={{ fontSize: '12px' }}>🤖</span>
              <div style={{ font: '400 10px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                <strong style={{ color: '#D61CA8' }}>AI:</strong> {aiSummaryNote || 'Top professionals matched to your needs based on location and service requirements.'}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}