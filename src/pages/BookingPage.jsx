import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATIC_STATS = [
  { label: 'Rating', value: '★ 4.9' },
  { label: 'Jobs Done', value: '847' },
  { label: 'Completion', value: '98%' },
  { label: 'Distance', value: '0.8 km' },
  { label: 'Cancels', value: '0' }
]

const STATIC_SERVICES = [
  'AC Deep Cleaning — OMR 15',
  'AC Repair — OMR 25',
  'AC Gas Refill — OMR 20',
  'AC Installation — OMR 35',
  'Electrical Repair — OMR 18',
  'Appliance Repair — OMR 25'
]

const STATIC_REVIEWS = [
  { initial: 'A', name: 'Ahmed Al-Rashdi', period: 'Today', stars: '★★★★★', comment: '"Mohammed was punctual and professional. AC works perfectly now!"' },
  { initial: 'F', name: 'Fatima Al-Balushi', period: 'Yesterday', stars: '★★★★★', comment: '"Excellent service. Diagnosed the issue quickly and fixed it."' },
  { initial: 'K', name: 'Khalid Al-Farsi', period: '8 Jul', stars: '★★★★', comment: '"Good service, arrived on time. Slight delay getting parts."' }
]

const STATIC_DATES = [
  { day: 'Wed', num: '9', active: true },
  { day: 'Thu', num: '10', active: false },
  { day: 'Fri', num: '11', active: false },
  { day: 'Sat', num: '12', active: false }
]

const STATIC_TIMES = ['10:00 PM', '11:00 PM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingPage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('9')
  const [selectedTime, setSelectedTime] = useState('10:00 PM')

  return (
    <div className="page-root" style={{ background: 'white', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', position: 'relative' }}>
      
      {/* Structural layout rules handling breakpoints seamlessly */}
      <style>{`
        .hero-inner {
          max-width: 1100px; 
          margin: 0 auto; 
          display: flex; 
          gap: 28px; 
          align-items: flex-end;
        }
        .main-split-grid {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 0;
        }
        .left-content-panel {
          padding: 28px 40px 28px 56px; 
          border-right: 1px solid #EBEBEF;
        }
        .stats-wrapper {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        .right-sidebar-panel {
          padding: 24px; 
          background: #F4F5F8;
        }

        /* Tablet Breakpoint */
        @media (max-width: 1024px) {
          .hero-banner {
            padding: 32px 24px !important;
          }
          .left-content-panel {
            padding: 24px 24px;
          }
          .stats-wrapper {
            gap: 12px;
          }
        }

        /* Mobile Breakpoint */
        @media (max-width: 768px) {
          .hero-banner {
            padding: 24px 16px !important;
          }
          .hero-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
          .hero-inner style-div-actions {
            margin-left: 0 !important;
          }
          .hero-actions-container {
            margin-left: 0 !important;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .main-split-grid {
            grid-template-columns: 1fr;
          }
          .left-content-panel {
            padding: 20px 16px;
            border-right: none;
          }
          .stats-wrapper {
            flex-wrap: wrap;
            gap: 8px;
          }
          .stats-item {
            flex: unset !important;
            width: calc(33.33% - 6px);
          }
          .stats-item:nth-child(4), .stats-item:nth-child(5) {
            width: calc(50% - 4px);
          }
          .right-sidebar-panel {
            padding: 16px;
          }
          .sticky-booking-card {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>

      {/* Hero Profile Banner Component */}
      <div className="hero-banner" style={{ background: BRAND_GRADIENT, padding: '32px 56px' }}>
        <div className="hero-inner">
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 32px "DM Sans", sans-serif', color: '#D61CA8', border: '4px solid rgba(255,255,255,.5)', flexShrink: 0 }}>
            M
          </div>
          <div style={{ paddingBottom: '15px' }}>
            <div style={{ font: '600 28px/1 "DM Sans", sans-serif', color: 'white', letterSpacing: '-.8px', marginBottom: '5px' }}>
              Mohammed Al-Balushi
            </div>
            <div style={{ font: '400 14px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)' }}>
              AC & Electrical Specialist · Qurum, Muscat
            </div>
          </div>
          <div className="hero-actions-container" style={{ marginLeft: 'auto', display: 'flex', gap: '9px' }}>
            <div style={{ padding: '9px 18px', background: 'rgba(255,255,255,.15)', border: '1.5px solid rgba(255,255,255,.3)', borderRadius: '10px', font: '700 13px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', whiteSpace: 'nowrap' }}>💬 Message</div>
            <div onClick={() => navigate('/BookingDateTimePickerPage')} style={{ padding: '9px 22px', background: 'white', borderRadius: '10px', font: '700 13px/1 "DM Sans", sans-serif', color: '#D61CA8', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.15)', whiteSpace: 'nowrap' }}>Book Now →</div>
          </div>
        </div>
      </div>

      {/* Two-Column Context Space Split Grid Layout */}
      <div className="main-split-grid">

        {/* LEFT CONTAINER VIEW PANEL */}
        <div className="left-content-panel">

          {/* Badges and Statistics Counter Box */}
          <div className="stats-wrapper">
            {STATIC_STATS.map((stat) => (
              <div key={stat.label} className="stats-item" style={{ textAlign: 'center', background: '#F4F5F8', borderRadius: '12px', padding: '14px 18px', flex: 1 }}>
                <div style={{ font: '800 18px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{stat.value}</div>
                <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AI Match Score Context Bar */}
          <div style={{ background: 'rgba(214,28,168,.05)', border: '1px solid rgba(214,28,168,.15)', borderRadius: '12px', padding: '13px', marginBottom: '24px', display: 'flex', gap: '9px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <div>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#D61CA8', marginBottom: '4px' }}>✨ AI Match Score: 98/100</div>
              <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                Best match for AC in Qurum — highest specialisation score, 0 cancellations, available today. Historical avg arrival: 12 min.
              </div>
            </div>
          </div>

          <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Services Offered</div>

          {/* Services offered wrapper chips array */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '22px' }}>
            {STATIC_SERVICES.map((item) => (
              <div key={item} style={{ padding: '6px 13px', background: '#F4F5F8', borderRadius: '9px', font: '500 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', border: '1.5px solid #EBEBEF' }}>
                {item}
              </div>
            ))}
          </div>

          <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Reviews (847)</div>

          {/* Reviews list render loops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {STATIC_REVIEWS.map((rev, i) => (
              <div key={i} style={{ background: '#F4F5F8', borderRadius: '12px', padding: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 12px "DM Sans", sans-serif', color: 'white' }}>
                      {rev.initial}
                    </div>
                    <div>
                      <div style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{rev.name}</div>
                      <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>{rev.period}</div>
                    </div>
                  </div>
                  <span style={{ color: '#F59E0B', fontSize: '12px' }}>{rev.stars}</span>
                </div>
                <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#555' }}>{rev.comment}</div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT CONTAINER: Booking Setup Panel */}
        <div className="right-sidebar-panel">
          <div className="sticky-booking-card" style={{ background: '#0A0A0F', borderRadius: '16px', padding: '18px', position: 'sticky', top: '82px' }}>
            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '3px' }}>Book Mohammed</div>
            <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>AC Deep Cleaning · OMR 15</div>

            <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '8px' }}>Pick Date</div>

            {/* Interactive Date Select block matching custom styles layout */}
            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px' }}>
              {STATIC_DATES.map((d) => {
                const isSelected = selectedDate === d.num
                return (
                  <div
                    key={d.num}
                    onClick={() => setSelectedDate(d.num)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: '9px', textAlign: 'center', cursor: 'pointer',
                      background: isSelected ? BRAND_GRADIENT : 'rgba(255,255,255,.06)',
                      border: isSelected ? '1px solid transparent' : '1px solid rgba(255,255,255,.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ font: '500 9px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.4)', marginBottom: '3px' }}>{d.day}</div>
                    <div style={{ font: '800 14px/1 "DM Sans", sans-serif', color: isSelected ? 'white' : 'rgba(255,255,255,.7)' }}>{d.num}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '8px' }}>Pick Time</div>

            {/* Interactive Time Selection Grid matching the layout specification tokens */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
              {STATIC_TIMES.map((t) => {
                const isSelected = selectedTime === t
                return (
                  <div
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      padding: '8px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                      background: isSelected ? BRAND_GRADIENT : 'rgba(255,255,255,.06)',
                      font: isSelected ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                      color: isSelected ? 'white' : 'rgba(255,255,255,.5)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t}
                  </div>
                )
              })}
            </div>

            {/* Execution Checkout Event Trigger button */}
            <div
              onClick={() => navigate('/BookingDateTimePickerPage')}
              style={{ padding: '12px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
            >
              Continue to Book →
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px' }}>🔒</span>
              <span style={{ font: '400 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.3)' }}>
                Pay only after service · PCI DSS
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}