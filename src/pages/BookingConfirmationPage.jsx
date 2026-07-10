import { useNavigate } from 'react-router-dom'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'
const STATUS_GRADIENT = 'linear-gradient(135deg, #10B981, #4B6EF5)'

export default function BookingConfirmationPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Outer Content Base alignment framework ensuring side margin parity */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '680px', width: '100%', textAlign: 'center' }}>
          
          {/* Main Success Check Circle Badge Icon */}
          <div style={{ width: '72px', height: '72px', background: STATUS_GRADIENT, borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', margin: '0 auto 20px', boxShadow: '0 12px 32px rgba(16,185,129,.35)' }}>
            ✓
          </div>
          
          <h2 style={{ font: '600 36px/1.2 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1.5px', marginBottom: '10px', marginTop: 0 }}>
            Booking Confirmed!
          </h2>
          <div style={{ font: '400 16px/1.6 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '30px' }}>
            Mohammed is confirmed. SMS + WhatsApp sent to +968 9234 5678.
          </div>

          {/* Centralized Overview Card Sheet */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', marginBottom: '20px', textAlign: 'left' }}>
            
            {/* Professional Provider Profile Header Area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', padding: 'bottom: 18px', paddingBottom: '18px', borderBottom: '1px solid #EBEBEF' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 20px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
                M
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                  Mohammed Al-Balushi
                </div>
                <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>
                  AC Specialist · ★ 4.9 · 847 jobs
                </div>
              </div>
              
              {/* Quick Communication Access Nodes */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div 
                  onClick={() => window.open('https://wa.me/96892345678', '_blank')}
                  style={{ width: '40px', height: '40px', background: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}
                >
                  💬
                </div>
                <div 
                  onClick={() => window.open('tel:+96892345678')}
                  style={{ width: '40px', height: '40px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}
                >
                  📞
                </div>
              </div>
            </div>

            {/* Receipt Summary Grid Layout Spec */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Booking ID</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>#UO-4601</div>
              </div>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Service</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>AC Deep Cleaning</div>
              </div>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Date</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Wed 9 Jul 2026</div>
              </div>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Time</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>10:00 AM</div>
              </div>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Address</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Villa 12, Al Noor St, Qurum</div>
              </div>
              <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
                <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>Amount</div>
                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR 17.985 · Bank of Muscat</div>
              </div>
            </div>

          </div>

          {/* Action Navigation Controls Segment */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <div 
              onClick={() => navigate('/Booking/LiveTracking')}
              style={{ padding: '12px 24px', background: BRAND_GRADIENT, borderRadius: '12px', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.3)' }}
            >
              📍 Track Live
            </div>
            <div 
              onClick={() => navigate('/MyBookings')}
              style={{ padding: '12px 24px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '12px', font: '600 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
            >
              📋 View Booking
            </div>
            <div 
              onClick={() => navigator.clipboard.writeText('Booking #UO-4601 confirmed with Mohammed Al-Balushi')}
              style={{ padding: '12px 24px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '12px', font: '600 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
            >
              📤 Share
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}