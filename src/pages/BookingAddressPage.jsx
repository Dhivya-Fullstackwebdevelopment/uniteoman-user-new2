import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const STATIC_AREAS = [
  { name: 'Qurum', slug: 'Qurum' },
  { name: 'Al Khuwair', slug: 'Al Khuwair' },
  { name: 'Bowsher', slug: 'Bowsher' },
  { name: 'MSQ Hills', slug: 'MSQ Hills' },
  { name: 'Al Ghubrah', slug: 'Al Ghubrah' },
  { name: 'Seeb', slug: 'Seeb' },
  { name: 'Ruwi', slug: 'Ruwi' },
  { name: 'Mutrah', slug: 'Mutrah' },
  { name: 'Al Amerat', slug: 'Al Amerat' },
  { name: 'Azaibah', slug: 'Azaibah' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingAddressPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Passed through from previous steps
  const professionalId = searchParams.get('professional_id') || ''
  const serviceTypeId = searchParams.get('service_type_id') || ''
  const date = searchParams.get('date') || '' // "Wed,9 Jul 2026"
  const time = searchParams.get('time') || '' // "10:00 AM"

  const [userName, setUserName] = useState('Mohammed Al-Balushi')
  const [userEmail, setUserEmail] = useState('mohammed@email.com')
  const [userMobile, setUserMobile] = useState('92345678')

  const [selectedArea, setSelectedArea] = useState('Qurum')
  const [villaApartment, setVillaApartment] = useState('Villa 12')
  const [streetName, setStreetName] = useState('Al Noor Street')
  const [buildingFloor, setBuildingFloor] = useState('Ground Floor')
  const [landmark, setLandmark] = useState('Near Al Qurum Park')
  const [coords, setCoords] = useState({ latitude: 23.5810, longitude: 58.3850 })

  const handleUseSavedAddress = (type) => {
    if (type === 'home') {
      setSelectedArea('Qurum')
      setVillaApartment('Villa 12')
      setStreetName('Al Noor Street')
      setBuildingFloor('Ground Floor')
      setLandmark('Near Al Qurum Park')
      setCoords({ latitude: 23.5810, longitude: 58.3850 })
    } else if (type === 'work') {
      setSelectedArea('Al Khuwair')
      setVillaApartment('Office 4B')
      setStreetName('Business Bay')
      setBuildingFloor('4th Floor')
      setLandmark('')
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => handleUseSavedAddress('home')
      )
    } else {
      handleUseSavedAddress('home')
    }
  }

  const isValid = userName && userEmail && userMobile && villaApartment && streetName

  const handleNextStepNavigation = () => {
    if (!isValid) return
    const params = new URLSearchParams({
      professional_id: professionalId,
      service_type_id: serviceTypeId,
      date,
      time,
      user_name: userName,
      user_email: userEmail,
      user_mobile: userMobile,
      area: selectedArea,
      villa_apartment_no: villaApartment,
      street_name: streetName,
      building_floor: buildingFloor,
      nearest_landmark: landmark,
      latitude: String(coords.latitude),
      longitude: String(coords.longitude)
    })
    navigate(`/BookingPaymentPage?${params.toString()}`)
  }

  return (
    <div className="page-root-wrapper" style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Structural layout rules handling breakpoints seamlessly */}
      <style>{`
        .outer-layout-box {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 56px;
          width: 100%;
          box-sizing: border-box;
        }
        .inner-content-card {
          background: white;
          padding: 28px 56px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,.04);
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
        }
        .address-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .contact-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        /* Tablet Breakpoint Adjustments */
        @media (max-width: 1024px) {
          .outer-layout-box {
            padding: 0 24px;
          }
          .inner-content-card {
            padding: 24px;
            grid-template-columns: 1fr 300px;
            gap: 20px;
          }
        }

        /* Mobile Breakpoint Stack Overhaul */
        @media (max-width: 768px) {
          .page-root-wrapper {
            padding: 16px 0;
          }
          .outer-layout-box {
            padding: 0 12px;
          }
          .inner-content-card {
            padding: 20px 14px;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .stepper-label-text {
            display: none;
          }
          .address-inputs-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .contact-inputs-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .saved-addresses-row {
            flex-direction: column;
            gap: 8px !important;
          }
          .summary-sticky-panel {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
      
      <div className="outer-layout-box">
        <div className="inner-content-card">
          
          {/* LEFT CONTAINER VIEW PANEL: ADDRESS BUILDER FORMS */}
          <div style={{ minWidth: 0 }}>
            
            {/* Horizontal Checkout Progress Tracker Timeline Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>✓</div>
                  <span className="stepper-label-text" style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#10B981', textTransform: 'uppercase', letterSpacing: '.5px' }}>Date & Time</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#10B981', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>2</div>
                  <span className="stepper-label-text" style={{ font: '700 10px/1 "DM Sans", sans-serif', color: '#D61CA8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Address</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E8E8EE', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: '#9090A0' }}>3</div>
                  <span className="stepper-label-text" style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#C0C0CC', textTransform: 'uppercase', letterSpacing: '.5px' }}>Payment</span>
                </div>
              </div>
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Your Details</div>

            {/* Contact info inputs */}
            <div className="contact-inputs-grid">
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Full Name *</label>
                <input 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Email *</label>
                <input 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Mobile *</label>
                <input 
                  value={userMobile} 
                  onChange={(e) => setUserMobile(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
            </div>

            {/* Simulated Interactive Map Display Sandbox Wrapper Block */}
            <div style={{ height: '160px', background: '#E8EDF2', borderRadius: '14px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '80px', height: '14px', background: '#F0F2F4' }}></div>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '140px', width: '14px', background: '#F0F2F4' }}></div>
              <div style={{ position: 'absolute', top: '55px', left: '126px', width: '20px', height: '20px', background: '#D61CA8', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 10px rgba(214,28,168,.5)' }}></div>
              <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,.55)', borderRadius: '7px', padding: '5px 10px', font: '500 10px/1 "DM Sans", sans-serif', color: 'white' }}>
                {selectedArea}, Muscat
              </div>
              <div 
                onClick={handleUseCurrentLocation}
                style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'white', borderRadius: '8px', padding: '6px 11px', font: '600 11px/1 "DM Sans", sans-serif', color: '#4B6EF5', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,.1)' }}
              >
                📍 Use Current Location
              </div>
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Select Area</div>
            
            {/* Interactive Chip Grid Array iteration */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '20px' }}>
              {STATIC_AREAS.map((area) => {
                const isSelected = selectedArea === area.slug
                return (
                  <div
                    key={area.slug}
                    onClick={() => setSelectedArea(area.slug)}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s ease',
                      background: isSelected ? BRAND_GRADIENT : 'white',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                      font: isSelected ? '700 11px/1 "DM Sans", sans-serif' : '500 11px/1 "DM Sans", sans-serif',
                      color: isSelected ? 'white' : '#9090A0'
                    }}
                  >
                    {area.name}
                  </div>
                )
              })}
            </div>

            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Address Details</div>
            
            {/* Input fields explicit double split grid panel schema */}
            <div className="address-inputs-grid">
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Villa / Apartment No. *</label>
                <input 
                  value={villaApartment} 
                  onChange={(e) => setVillaApartment(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid rgba(214,28,168,.3)', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Street Name *</label>
                <input 
                  value={streetName} 
                  onChange={(e) => setStreetName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid rgba(214,28,168,.3)', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Building / Floor</label>
                <input 
                  value={buildingFloor} 
                  onChange={(e) => setBuildingFloor(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Nearest Landmark</label>
                <input 
                  value={landmark} 
                  onChange={(e) => setLandmark(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '11px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                />
              </div>
            </div>

            {/* Quick Access Address Selector Profiles */}
            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '10px' }}>Or Use Saved Address</div>
            <div className="saved-addresses-row" style={{ display: 'flex', gap: '10px' }}>
              <div 
                onClick={() => handleUseSavedAddress('home')}
                style={{ flex: 1, padding: '11px', background: 'rgba(214,28,168,.04)', border: '1.5px solid rgba(214,28,168,.25)', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>🏠 Home</div>
                <div style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0' }}>Villa 12, Al Noor St, Qurum</div>
              </div>
              <div 
                onClick={() => handleUseSavedAddress('work')}
                style={{ flex: 1, padding: '11px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '12px', cursor: 'pointer' }}
              >
                <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>💼 Work</div>
                <div style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0' }}>Office 4B, Business Bay, Al Khuwair</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FIXED BILLING RECEIPT CONTAINER PANEL */}
          <div style={{ minWidth: 0 }}>
            <div className="summary-sticky-panel" style={{ background: '#0A0A0F', borderRadius: '18px', padding: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '16px' }}>Order Summary</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Service</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>AC Deep Cleaning</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Pro</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>Mohammed ★4.9</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Date</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>{date || 'Wed 9 Jul'} · {time || '10:00 AM'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Area</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>
                  {selectedArea}
                </span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '14px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Total</span>
                <span style={{ font: '800 18px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR 17.985</span>
              </div>

              <button 
                onClick={handleNextStepNavigation}
                disabled={!isValid}
                style={{ width: '100%', border: 'none', outline: 'none', padding: '13px', background: isValid ? BRAND_GRADIENT : '#D0D0D4', borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: isValid ? 'pointer' : 'not-allowed', boxShadow: isValid ? '0 4px 14px rgba(214,28,168,.35)' : 'none' }}
              >
                Continue to Payment →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}