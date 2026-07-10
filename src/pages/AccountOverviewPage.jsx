import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Static arrays mapping sidebar links and data structures from your HTML design doc
const SIDEBAR_LINKS = [
  { id: 'bookings', label: 'My Bookings', subtext: '47 total', icon: '📋' },
  { id: 'addresses', label: 'Saved Addresses', subtext: '2 addresses', icon: '📍' },
  { id: 'payments', label: 'Payment Methods', subtext: '2 cards', icon: '💳' },
  { id: 'notifications', label: 'Notifications', subtext: 'Settings', icon: '🔔' },
  { id: 'language', label: 'Language', subtext: 'English / عربي', icon: '🌐' },
  { id: 'help', label: 'Help & Support', subtext: null, icon: '❓' },
  { id: 'logout', label: 'Logout', subtext: null, icon: '🚪' }
]

const STATIC_STATS = [
  { label: 'Bookings', subtext: 'Total services', value: '47' },
  { label: 'Avg Rating', subtext: 'Your reviews', value: '4.8/5' },
  { label: 'Total Spent', subtext: 'All time', value: 'OMR 847' }
]

const STATIC_ADDRESSES = [
  { id: 'home', title: 'Home', description: 'Villa 12, Al Noor Street, Qurum', icon: '🏠' },
  { id: 'work', title: 'Work', description: 'Office 4B, Business Bay Tower, Al Khuwair', icon: '💼' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function AccountOverviewPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')

  const handleSidebarClickAction = (id) => {
    setActiveTab(id)
    if (id === 'bookings') navigate('/MyBookings')
    if (id === 'logout') navigate('/logout')
  }

  return (
    <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Outer Alignment Framework Layer keeping exact side spacing constraints */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '22px' }}>
          
          {/* SIDEBAR NAVIGATION CARD PANELS */}
          <div>
            {/* Short Profile Card Summary Box */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '22px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.07)', marginBottom: '14px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 28px "DM Sans", sans-serif', color: 'white', margin: '0 auto 14px' }}>
                A
              </div>
              <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Ahmed Al-Rashdi</div>
              <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>+968 9234 5678</div>
              <div 
                onClick={() => navigate('/profile/edit')}
                style={{ marginTop: '12px', padding: '8px 20px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 12px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', display: 'inline-block' }}
              >
                Edit Profile
              </div>
            </div>

            {/* List Group Menu Actions block layout iteration */}
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.07)' }}>
              {SIDEBAR_LINKS.map((link) => (
                <div 
                  key={link.id}
                  onClick={() => handleSidebarClickAction(link.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: '1px solid #F5F5F5', cursor: 'pointer', background: activeTab === link.id ? '#FAFAFA' : 'white' }}
                >
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{link.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: activeTab === link.id ? '700 13px/1 "DM Sans", sans-serif' : '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                      {link.label}
                    </div>
                    {link.subtext && (
                      <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '2px' }}>
                        {link.subtext}
                      </div>
                    )}
                  </div>
                  <span style={{ font: '400 14px/1 "DM Sans", sans-serif', color: '#9090A0' }}>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN ACCOUNT DETAILS CONTENT FEED AREA */}
          <div>
            <div style={{ font: '600 22px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-.5px', marginBottom: '16px' }}>
              Account Overview
            </div>

            {/* Metrics Counters Card Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
              {STATIC_STATS.map((stat) => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
                  <div style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{stat.label}</div>
                  <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>{stat.subtext}</div>
                </div>
              ))}
            </div>

            {/* Personal Information Module form sheet */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,.06)', marginBottom: '14px' }}>
              <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Personal Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Full Name</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Ahmed Al-Rashdi</div>
                </div>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Phone</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>+968 9234 5678</div>
                </div>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Email</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>ahmed@gmail.com</div>
                </div>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Language</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>English</div>
                </div>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Preferred Area</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Qurum</div>
                </div>
                <div>
                  <div style={{ font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '5px' }}>Notification</div>
                  <div style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '10px 13px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>SMS + Push + WhatsApp</div>
                </div>
              </div>
            </div>

            {/* Saved Addresses Configuration Layer */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
              <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Saved Addresses</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {STATIC_ADDRESSES.map((addr) => (
                  <div 
                    key={addr.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F4F5F8', borderRadius: '12px', border: '1.5px solid #EBEBEF' }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{addr.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{addr.title}</div>
                      <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>{addr.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ padding: '5px 10px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '7px', font: '600 10px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}>Edit</div>
                      <div style={{ padding: '5px 10px', background: '#FFE4E6', borderRadius: '7px', font: '600 10px/1 "DM Sans", sans-serif', color: '#EF4444', cursor: 'pointer' }}>Delete</div>
                    </div>
                  </div>
                ))}
                
                {/* Dynamic add new trigger chip */}
                <div 
                  onClick={() => navigate('/booking/address?new=true')}
                  style={{ padding: '12px', background: 'rgba(214,28,168,.04)', border: '1.5px dashed rgba(214,28,168,.25)', borderRadius: '12px', textAlign: 'center', font: '700 12px/1 "DM Sans", sans-serif', color: '#D61CA8', cursor: 'pointer' }}
                >
                  + Add New Address
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}