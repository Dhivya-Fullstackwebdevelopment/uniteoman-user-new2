import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BusinessListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Get URL parameters
  const urlServiceId = searchParams.get('service_id') || '1'
  const urlLocation = searchParams.get('location_id') || '1'
  const urlCategory = searchParams.get('category') || ''

  // States
  const [serviceData, setServiceData] = useState(null)
  const [serviceTypes, setServiceTypes] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [aiTopPicks, setAiTopPicks] = useState([])
  const [aiSummaryNote, setAiSummaryNote] = useState('')
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serviceName, setServiceName] = useState('')
  const [serviceIcon, setServiceIcon] = useState('')
  const [locationName, setLocationName] = useState('')

  // Fetch Service Details and Professionals
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch service details
        const serviceResponse = await axios.get(`${API_ENDPOINTS.SERVICES}?service_id=${urlServiceId}`)
        if (serviceResponse.data && serviceResponse.data.status === 'success' && serviceResponse.data.data.length > 0) {
          const service = serviceResponse.data.data[0]
          setServiceData(service)
          setServiceName(service.name)
          setServiceIcon(service.icon || '❄️')

          // Set service types
          if (service.service_types && service.service_types.length > 0) {
            setServiceTypes(service.service_types)
            setSelectedServiceTypeId(service.service_types[0].id)
          }

          // Set location name
          if (service.location) {
            setLocationName(service.location.name || '')
          }
        }

        // Fetch professionals
        const proResponse = await axios.get(
          API_ENDPOINTS.PROFESSIONALS_BY_LOCATION_AND_SERVICE(urlLocation, urlServiceId)
        )
        if (proResponse.data && proResponse.data.status === 'success') {
          setProfessionals(proResponse.data.data || [])

          // Set AI top picks
          if (proResponse.data.ai_top_picks) {
            setAiTopPicks(proResponse.data.ai_top_picks)
          }

          // Set AI summary note
          if (proResponse.data.ai_summary_note) {
            setAiSummaryNote(proResponse.data.ai_summary_note)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [urlServiceId, urlLocation])

  const handleBookProfessional = (name, id) => {
    navigate(`/BusinessSelection?pro=${encodeURIComponent(name)}&professional_id=${id}`)
  }

  const handleServiceTypeSelect = (typeId) => {
    setSelectedServiceTypeId(typeId)
  }

  // Get icon based on service name
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

  // Get background color for service icon
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

  // Render service icon function
  const renderServiceIcon = (icon, name, size = '30px') => {
    if (icon && icon.startsWith('http')) {
      return <img src={icon} alt={name} style={{ width: size, height: size, objectFit: 'contain' }} />
    }
    return <span style={{ fontSize: size }}>{getServiceIcon(name)}</span>
  }

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
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
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .skel-card {
          background: #F4F5F8;
          height: 80px;
          border-radius: 16px;
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Breadcrumbs Navigation Strip */}
      <div style={{ padding: '12px 56px', borderBottom: '1px solid #EBEBEF', font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }} className="bl-breadcrumbs">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <Link to="/" style={{ color: '#9090A0', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link to="/categories" style={{ color: '#9090A0', textDecoration: 'none' }}>Services</Link> ›{' '}
          <strong style={{ color: '#0A0A0F' }}>{loading ? 'Loading...' : serviceName || 'Service'}</strong>
        </div>
      </div>

      {/* Grid Canvas Frame Workspace Container */}
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px' }} className="bl-grid">

          {/* LEFT SECTION CONTAINER */}
          <div style={{ padding: '26px 40px 26px 56px', borderRight: '1px solid #EBEBEF' }} className="bl-left">

            {/* Category Brand Heading Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
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
              <div>
                <h1 style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-.8px', margin: 0 }}>
                  {loading ? 'Loading...' : serviceName || 'Service'}
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
              </div>
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>
              Choose a Service
            </div>

            {/* Loop Interactive Local Item Data Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <div key={`skel-${idx}`} className="skel-card" />
                ))
              ) : serviceTypes.length > 0 ? (
                serviceTypes.map((service) => {
                  const isSelected = selectedServiceTypeId === service.id
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceTypeSelect(service.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '13px',
                        padding: '13px',
                        borderRadius: '13px',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid rgba(214,28,168,.3)' : '1.5px solid #EBEBEF',
                        background: isSelected ? 'rgba(214,28,168,.03)' : '#F4F5F8',
                        transition: 'all 0.2s ease'
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
                            navigate(`/BusinessSelection?pro=${encodeURIComponent(service.type_name)}&service_type_id=${service.id}`)
                          }}
                          style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                        >
                          Book →
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9090A0' }}>
                  No service types available
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL CONTAINER */}
          <div style={{ padding: '24px', background: '#F4F5F8' }} className="bl-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px' }}>✨</span>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                AI Top Picks Near You
              </div>
            </div>

            {/* AI Top Pick Cards iteration */}
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`ai-skel-${idx}`} style={{ background: 'white', borderRadius: '12px', padding: '12px', marginBottom: '9px' }}>
                  <div className="skel-card" style={{ height: '60px' }} />
                </div>
              ))
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
                    onClick={() => handleBookProfessional(pro.name, pro.id)}
                    style={{ width: '100%', padding: '7px', background: BRAND_GRADIENT, borderRadius: '8px', textAlign: 'center', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
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

            {/* AI Prompt Insight Label */}
            <div style={{ background: 'rgba(214,28,168,.04)', border: '1px solid rgba(214,28,168,.15)', borderRadius: '12px', padding: '11px', display: 'flex', gap: '7px' }}>
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