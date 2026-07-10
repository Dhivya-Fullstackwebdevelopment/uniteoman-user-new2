import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingLiveTrackingPage() {
  const navigate = useNavigate()
  const [zoomLevel, setZoomLevel] = useState(10)

  const handleCancelBookingAction = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      navigate('/MyBookings')
    }
  }

  return (
    <div style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Outer Layout Frame Container preserving matching left and right spaces across views */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', height: '650px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.08)', border: '1px solid #EBEBEF', background: 'white' }}>
          
          {/* LEFT CONTAINER VIEW PANEL: SIMULATED MAP INTERACTIVE CANVAS */}
          <div style={{ background: '#E8EDF2', position: 'relative', overflow: 'hidden' }}>
            {/* Map Simulated Road Grid Overlays */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: '180px', height: '20px', background: '#F0F2F4' }}></div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '320px', height: '16px', background: '#F0F2F4' }}></div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '200px', width: '18px', background: '#F0F2F4' }}></div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '430px', width: '16px', background: '#F0F2F4' }}></div>
            
            {/* Map Destination Pinpoint Vector Ring Node */}
            <div style={{ position: 'absolute', top: '240px', left: '400px', width: '24px', height: '24px', background: '#D61CA8', borderRadius: '50%', border: '3px solid white', boxShadow: '0 3px 12px rgba(214,28,168,.6)', zIndex: 10 }}></div>
            <div style={{ position: 'absolute', top: '224px', left: '384px', width: '56px', height: '56px', borderRadius: '50%', border: '2px solid rgba(214,28,168,.3)' }}></div>
            
            {/* Live Professional Moving Avatar Marker Bubble */}
            <div style={{ position: 'absolute', top: '320px', left: '210px', background: BRAND_GRADIENT, borderRadius: '50%', width: '38px', height: '38px', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 15px "DM Sans", sans-serif', color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,.25)', zIndex: 10 }}>
              M
            </div>
            
            {/* Dotted Tracking Route Line Vector SVG Path Overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <polyline points="229,336 229,280 405,280 405,255" fill="none" stroke="#D61CA8" strokeWidth="3" strokeDasharray="9 5" opacity=".8"/>
            </svg>
            
            {/* Floating Overlay Layer Map Control Knobs */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20 }}>
              <div onClick={() => setZoomLevel(prev => prev + 1)} style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 16px "DM Sans", sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,.12)', cursor: 'pointer', userSelect: 'none' }}>+</div>
              <div onClick={() => setZoomLevel(prev => Math.max(1, prev - 1))} style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 16px "DM Sans", sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,.12)', cursor: 'pointer', userSelect: 'none' }}>−</div>
            </div>
            
            {/* Geo Location Header Tag Context */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,.6)', borderRadius: '8px', padding: '6px 12px', font: '500 11px/1 "DM Sans", sans-serif', color: 'white', zIndex: 20 }}>
              Qurum, Muscat · Live
            </div>
          </div>

          {/* RIGHT CONTAINER VIEW PANEL: LIVE STEPS STATUS TIMELINE */}
          <div style={{ background: 'white', borderLeft: '1px solid #EBEBEF', display: 'flex', flexDirection: 'column' }}>
            
            {/* Active Status Brand Header Header Panel */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #EBEBEF', background: BRAND_GRADIENT }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)', marginBottom: '4px' }}>Booking #UO-4601</div>
              <div style={{ font: '600 22px/1 "DM Sans", sans-serif', color: 'white' }}>Mohammed is on the way</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <div style={{ font: '600 32px/1 "DM Sans", sans-serif', color: 'white' }}>12</div>
                <div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)' }}>minutes</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)' }}>ETA</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)' }}>1.2 km away</div>
                  <div style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.7)', marginTop: '2px' }}>Arriving ~10:12 AM</div>
                </div>
              </div>
            </div>

            {/* Provider Short Communication Context Node Profile card */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #EBEBEF', display: 'flex', alignItems: 'center', gap: '13px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 20px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
                M
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: '700 15px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Mohammed Al-Balushi</div>
                <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>AC Specialist · ★ 4.9 · 847 jobs</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ padding: '9px 16px', background: '#F4F5F8', borderRadius: '9px', font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>💬 Chat</div>
                <div style={{ padding: '9px 16px', background: '#F4F5F8', borderRadius: '9px', font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>📞 Call</div>
              </div>
            </div>

            {/* Step-by-Step Milestones Timeline Tracker */}
            <div style={{ padding: '18px 24px', flex: 1 }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Live Status</div>
              
              {/* Step 1: Confirmed */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10B981', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'white' }} />
                  </div>
                  <div style={{ width: '2px', height: '22px', background: '#10B981', margin: '2px 0' }}></div>
                </div>
                <div>
                  <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Booking Confirmed</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>9:41 AM</div>
                </div>
              </div>

              {/* Step 2: En Route */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#D61CA8', border: '2px solid #D61CA8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'white' }} />
                  </div>
                  <div style={{ width: '2px', height: '22px', background: '#E8E8EE', margin: '2px 0' }}></div>
                </div>
                <div>
                  <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>En Route</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>Mohammed is 1.2 km away</div>
                </div>
              </div>

              {/* Step 3: Arrived */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E8E8EE', border: '2px solid #E0E0E4' }}></div>
                  <div style={{ width: '2px', height: '22px', background: '#E8E8EE', margin: '2px 0' }}></div>
                </div>
                <div>
                  <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#C0C0CC' }}>Arrived</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>Expected 10:12 AM</div>
                </div>
              </div>

              {/* Step 4: In Progress */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E8E8EE', border: '2px solid #E0E0E4' }}></div>
                  <div style={{ width: '2px', height: '22px', background: '#E8E8EE', margin: '2px 0' }}></div>
                </div>
                <div>
                  <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#C0C0CC' }}>In Progress</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>Service begins on arrival</div>
                </div>
              </div>

              {/* Step 5: Completed */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E8E8EE', border: '2px solid #E0E0E4' }}></div>
                </div>
                <div>
                  <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#C0C0CC' }}>Completed</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>Payment captured after</div>
                </div>
              </div>
            </div>

            {/* Cancel Action Trigger Block */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #EBEBEF' }}>
              <button 
                onClick={handleCancelBookingAction}
                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #FCA5A5', outline: 'none', padding: '11px', background: '#FFF1F3', borderRadius: '10px', textAlign: 'center', font: '700 13px/1 "DM Sans", sans-serif', color: '#EF4444', cursor: 'pointer' }}
              >
                Cancel Booking
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}