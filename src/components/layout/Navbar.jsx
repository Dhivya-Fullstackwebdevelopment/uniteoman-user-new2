import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

export default function Navbar() {
  const navigate = useNavigate();

  // Helper function to return active vs inactive menu item styles
  const getMenuLinkStyle = ({ isActive }) => ({
    font: isActive ? '700 15px/1 "DM Sans", sans-serif' : '500 15px/1 "DM Sans", sans-serif',
    color: isActive ? '#D61CA8' : '#9090A0',
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  });

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

        {/* Global Tab Navigation Links using NavLink for automatic active state management */}
        <nav style={{ display: 'flex', gap: '40px', flex: 1, justifyContent: 'center' }}>
          <NavLink to="/" style={getMenuLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/categories" style={getMenuLinkStyle}>
            Services
          </NavLink>
          <NavLink to="/MyBookings" style={getMenuLinkStyle}>
            My Bookings
          </NavLink>
          <NavLink to="/help" style={getMenuLinkStyle}>
            Help
          </NavLink>
        </nav>

        {/* Action Action Utility Items Frame */}
        <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
          <div 
            onClick={() => navigate('/Notifications')}
            style={{ width: '32px', height: '32px', background: '#F8F8FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', cursor: 'pointer' }}
          >
            🔔
          </div>
          <div 
            onClick={() => navigate('/customer/login')} 
            style={{ padding: '7px 16px', border: '1.5px solid #EBEBEF', borderRadius: '9px', font: '600 15px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
          >
            Login
          </div>
          <div   onClick={() => navigate('/categories')}  style={{ padding: '7px 18px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 15px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.25)' }}>
            Book Now
          </div>
        </div>

      </div>
    </div>
  );
}