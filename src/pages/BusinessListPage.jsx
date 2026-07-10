import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

// Static dataset for structural service options map
const STATIC_SERVICES = [
  { id: 1, name: 'AC Deep Cleaning', description: 'Filter clean, coil wash, drain flush, disinfect, reassemble.', duration: '45 min', price: 'OMR 15', icon: '❄️', popular: true },
  { id: 2, name: 'AC Repair & Diagnosis', description: 'Gas refill, PCB repair, compressor check, cooling issue fix.', duration: '60 min', price: 'OMR 25', icon: '🔩', popular: false },
  { id: 3, name: 'AC Installation', description: 'New unit install, pipe laying, copper line, testing.', duration: '2 hrs', price: 'OMR 35', icon: '🔧', popular: false },
  { id: 4, name: 'AC Gas Refill', description: 'Refrigerant top-up, leak check, pressure test.', duration: '30 min', price: 'OMR 20', icon: '🌬️', popular: false },
  { id: 5, name: 'AC Annual Contract', description: '2 full services/yr + priority response + 24/7 hotline.', duration: '2×/yr', price: 'OMR 89/yr', icon: '🏠', popular: false },
  { id: 6, name: 'Duct Cleaning', description: 'Central AC duct sanitization and airflow check.', duration: '90 min', price: 'OMR 45', icon: '💨', popular: false },
  { id: 7, name: 'Remote / PCB Repair', description: 'Control board diagnostics and component repair.', duration: '45 min', price: 'OMR 18', icon: '🖥️', popular: false }
]

// Static dataset for right-sidebar localized professional choices
const AI_TOP_PICKS = [
  { id: 'M', name: 'Mohammed Al-Balushi', initial: 'M', distance: '0.8 km', nextAvailable: 'Today 2pm', rating: '4.9', jobs: '847 jobs', best: true },
  { id: 'K', name: 'Khalid Al-Farsi', initial: 'K', distance: '1.2 km', nextAvailable: 'Today 4pm', rating: '4.8', jobs: '524 jobs', best: false },
  { id: 'A', name: 'Ahmed Al-Rashdi', initial: 'A', distance: '1.5 km', nextAvailable: 'Tomorrow 10am', rating: '4.9', jobs: '312 jobs', best: false }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BusinessListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedServiceId, setSelectedServiceId] = useState(1) // Controls active clicked left-hand layout item state

  const handleBookProfessional = (name) => {
    navigate(`/BusinessSelection?pro=${encodeURIComponent(name)}`)
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
      `}</style>
      
      {/* Breadcrumbs Navigation Strip */}
      <div style={{ padding: '12px 56px', borderBottom: '1px solid #EBEBEF', font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }} className="bl-breadcrumbs">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <Link to="/" style={{ color: '#9090A0', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link to="/categories" style={{ color: '#9090A0', textDecoration: 'none' }}>Services</Link> ›{' '}
          <strong style={{ color: '#0A0A0F' }}>AC Service</strong>
        </div>
      </div>

      {/* Grid Canvas Frame Workspace Container */}
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px' }} className="bl-grid">
          
          {/* LEFT SECTION CONTAINER */}
          <div style={{ padding: '26px 40px 26px 56px', borderRight: '1px solid #EBEBEF' }} className="bl-left">
            
            {/* Category Brand Heading Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
              <div style={{ width: '62px', height: '62px', background: '#DBEAFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0 }}>
                ❄️
              </div>
              <div>
                <h1 style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-.8px', margin: 0 }}>
                  AC Service
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '5px', flexWrap: 'wrap' }}>
                  <span style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#F59E0B' }}>★ 4.9</span>
                  <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>(2,347 reviews)</span>
                  <span style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#10B981' }}>312 pros available</span>
                </div>
              </div>
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>
              Choose a Service
            </div>

            {/* Loop Interactive Local Item Data Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {STATIC_SERVICES.map((service) => {
                const isSelected = selectedServiceId === service.id
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
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
                    <div style={{ width: '42px', height: '42px', background: '#DBEAFE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {service.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                        <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                          {service.name}
                        </div>
                        {service.popular && (
                          <div style={{ padding: '2px 7px', background: 'rgba(214,28,168,.1)', borderRadius: '4px', font: '700 8px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>
                            POPULAR
                          </div>
                        )}
                      </div>
                      <div style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>
                        {service.description}
                      </div>
                      <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>
                        ⏱ {service.duration}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }} className="bl-service-price">
                      <div style={{ font: '600 15px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                        {service.price}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/BusinessSelection?pro=${encodeURIComponent(service.name)}`)
                        }}
                        style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                      >
                        Book →
                      </button>
                    </div>
                  </div>
                )
              })}
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
            {AI_TOP_PICKS.map((pro) => (
              <div 
                key={pro.id} 
                style={{ background: 'white', borderRadius: '12px', padding: '12px', marginBottom: '9px', boxShadow: '0 1px 5px rgba(0,0,0,.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 14px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
                    {pro.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                      {pro.name}
                    </div>
                    <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>
                      {pro.distance} · Next: {pro.nextAvailable}
                    </div>
                  </div>
                  {pro.best && (
                    <div style={{ padding: '2px 7px', background: '#D1FAE5', borderRadius: '5px', font: '700 8px/1 "DM Sans", sans-serif', color: '#059669' }}>
                      ✨ Best
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ padding: '3px 8px', background: '#F4F5F8', borderRadius: '6px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                    ★ {pro.rating}
                  </div>
                  <div style={{ padding: '3px 8px', background: '#F4F5F8', borderRadius: '6px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                    {pro.jobs}
                  </div>
                </div>

                <button 
                  onClick={() => handleBookProfessional(pro.name)}
                  style={{ width: '100%', padding: '7px', background: BRAND_GRADIENT, borderRadius: '8px', textAlign: 'center', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                >
                  Book {pro.name.split(' ')[0]}
                </button>
              </div>
            ))}

            {/* AI Prompt Insight Label */}
            <div style={{ background: 'rgba(214,28,168,.04)', border: '1px solid rgba(214,28,168,.15)', borderRadius: '12px', padding: '11px', display: 'flex', gap: '7px' }}>
              <span style={{ fontSize: '12px' }}>🤖</span>
              <div style={{ font: '400 10px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                <strong style={{ color: '#D61CA8' }}>AI:</strong> Mohammed is ideal — highest AC score, 0 cancellations, available today. Avg wait: 22 min.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}