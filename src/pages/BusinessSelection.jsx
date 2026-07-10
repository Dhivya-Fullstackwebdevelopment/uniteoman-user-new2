import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

// Static local mock data representing the search results matching your exact HTML text definitions
const SEARCH_RESULTS = [
  { id: 1, initial: 'M', name: 'Mohammed Al-Balushi', type: 'AC Deep Cleaning', distance: '0.8 km away', rating: '4.9', jobs: '847 jobs', nextAvailable: 'Today 2pm', price: 'OMR 15', badge: 'Best Match', badgeBg: '#D1FAE5', badgeColor: '#059669' },
  { id: 2, initial: 'K', name: 'Khalid Al-Farsi', type: 'AC Deep Cleaning', distance: '1.2 km away', rating: '4.8', jobs: '524 jobs', nextAvailable: 'Today 4pm', price: 'OMR 15', badge: null },
  { id: 3, initial: 'A', name: 'Ahmed Al-Rashdi', type: 'AC Deep Cleaning', distance: '1.5 km away', rating: '4.9', jobs: '312 jobs', nextAvailable: 'Tomorrow 10am', price: 'OMR 14', badge: 'Best Price', badgeBg: '#FEF3C7', badgeColor: '#D97706' },
  { id: 4, initial: 'S', name: 'Salim Al-Habsi', type: 'AC Deep Cleaning', distance: '2.1 km away', rating: '4.7', jobs: '215 jobs', nextAvailable: 'Tomorrow 2pm', price: 'OMR 15', badge: null }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BusinessSelection() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeFilterTab, setActiveFilterTab] = useState('All')
  const [minRating, setMinRating] = useState('4')

  const handleProfileNavigation = (name) => {
    navigate(`/business/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`)
  }

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Centered Outer Workspace Box mapping exact side spacing constraints */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 56px' }}>
        
        {/* Search Context / AI Alert Prompt Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9090A0' }}>
            ✨ <span style={{ color: '#D61CA8', fontWeight: 700 }}>AI:</span>
          </div>
          <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
            Searching for <strong style={{ color: '#0A0A0F' }}>"AC cleaning Qurum today"</strong> — 14 results
          </div>
        </div>

        {/* Action Layout Filter Quick Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All (14)', 'Available Today (9)', 'Top Rated (5)', 'Nearest (6)', 'Lowest Price'].map((tab) => {
            const isAll = tab.startsWith(activeFilterTab)
            return (
              <div
                key={tab}
                onClick={() => setActiveFilterTab(tab.split(' ')[0])}
                style={{
                  padding: '6px 14px',
                  background: isAll ? BRAND_GRADIENT : 'white',
                  border: isAll ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                  borderRadius: '20px',
                  font: isAll ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                  color: isAll ? 'white' : '#9090A0',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </div>
            )
          })}
        </div>

        {/* Core Layout Split Pane */}
        <div style={{ display: 'flex', gap: '20px' }}>
          
          {/* SIDEBAR FILTERS CONTROL COMPONENT */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Filters</div>
              
              {/* Service Checkbox Filters Block */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Service
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', cursor: 'pointer' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#D61CA8', border: '2px solid #D61CA8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'white' }}>✓</span>
                  </div>
                  <span style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>AC Deep Cleaning</span>
                </div>
                {['AC Repair', 'AC Installation', 'AC Gas Refill'].map((serv) => (
                  <div key={serv} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', cursor: 'pointer' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'transparent', border: '2px solid #EBEBEF' }} />
                    <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>{serv}</span>
                  </div>
                ))}
              </div>

              {/* Price Range Filter Segment */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Price Range
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ padding: '4px 9px', background: 'rgba(214,28,168,.08)', border: '1.5px solid rgba(214,28,168,.3)', borderRadius: '8px', font: '700 10px/1 "DM Sans", sans-serif', color: '#D61CA8', cursor: 'pointer' }}>OMR 0–15</div>
                  <div style={{ padding: '4px 9px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}>OMR 15–30</div>
                  <div style={{ padding: '4px 9px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}>OMR 30+</div>
                </div>
              </div>

              {/* Min Rating Filter Action Chips */}
              <div>
                <div style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Min Rating
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['4★', '4.5★', '5★'].map((rate) => {
                    const isSelected = minRating === rate.replace('★', '')
                    return (
                      <div
                        key={rate}
                        onClick={() => setMinRating(rate.replace('★', ''))}
                        style={{
                          padding: '4px 8px',
                          background: isSelected ? BRAND_GRADIENT : 'white',
                          borderRadius: '8px',
                          font: '700 10px/1 "DM Sans", sans-serif',
                          color: isSelected ? 'white' : '#9090A0',
                          border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                          cursor: 'pointer'
                        }}
                      >
                        {rate}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* RESULTS CONTENT FEED PANEL */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SEARCH_RESULTS.map((pro) => (
              <div
                key={pro.id}
                style={{ background: 'white', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1.5px solid #EBEBEF' }}
              >
                {/* Initial Avatar circle */}
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 20px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
                  {pro.initial}
                </div>

                {/* Listing central details layout */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                      {pro.name}
                    </div>
                    {pro.badge && (
                      <div style={{ padding: '2px 8px', background: pro.badgeBg, borderRadius: '5px', font: '700 8px/1 "DM Sans", sans-serif', color: pro.badgeColor }}>
                        {pro.badge}
                      </div>
                    )}
                  </div>
                  <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '8px' }}>
                    {pro.type} · {pro.distance}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>★ {pro.rating}</div>
                    <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>{pro.jobs}</div>
                    <div style={{ padding: '3px 9px', background: '#F4F5F8', borderRadius: '6px', font: '500 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Next: {pro.nextAvailable}</div>
                  </div>
                </div>

                {/* Right side pricing metric and actions layout panel */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ font: '600 18px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                    {pro.price}
                  </div>
                  <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '10px' }}>
                    per visit
                  </div>
                  <div style={{ display: 'flex', gap: '7px' }}>
                    <div 
                      onClick={() => handleProfileNavigation(pro.name)}
                      style={{ padding: '7px 12px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}
                    >
                      Profile
                    </div>
                    <div 
                      onClick={() => navigate(`/BookingPage`)}
                      style={{ padding: '7px 16px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 12px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.25)' }}
                    >
                      Book →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}