import { Link, useNavigate } from 'react-router-dom'


const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #EBEBEF', height: '62px', display: 'flex', alignItems: 'center', padding: '0 52px', gap: '24px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
      {/* Outer Content Alignment Layer maintaining left and right spaces across pages */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand Logo Wrapper */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="../../../public/image 672.png"
            style={{ height: '26px', flexShrink: 0 }}
            alt="UniteOman Logo"
          />
        </div>

        {/* Global Tab Navigation Links */}
        <nav style={{ display: 'flex', gap: '40px', flex: 1, justifyContent: 'center' }}>
          <Link to="/" style={{ font: '700 15px/1 "DM Sans", sans-serif', color: '#D61CA8', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/categories" style={{ font: '500 15px/1 "DM Sans", sans-serif', color: '#9090A0', textDecoration: 'none' }}>
            Services
          </Link>
          <Link to="/MyBookings" style={{ font: '500 15px/1 "DM Sans", sans-serif', color: '#9090A0', textDecoration: 'none' }}>
            My Bookings
          </Link>
          <Link to="/help" style={{ font: '500 15px/1 "DM Sans", sans-serif', color: '#9090A0', textDecoration: 'none' }}>
            Help
          </Link>
        </nav>

        {/* Action Action Utility Items Frame */}
        <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
          <div onClick={() => navigate('/Notifications')}
            style={{ width: '32px', height: '32px', background: '#F8F8FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', cursor: 'pointer' }}>
            🔔
          </div>
          <div style={{ padding: '7px 16px', border: '1.5px solid #EBEBEF', borderRadius: '9px', font: '600 15px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>
            Login
          </div>
          <div style={{ padding: '7px 18px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 15px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.25)' }}>
            Book Now
          </div>
        </div>

      </div>
    </div>
  )
}