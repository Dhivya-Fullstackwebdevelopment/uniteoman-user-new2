import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Desktop menu item style
  const getMenuLinkStyle = ({ isActive }) => ({
    font: isActive ? '700 17px/1 "DM Sans", sans-serif' : '500 17px/1 "DM Sans", sans-serif',
    color: isActive ? '#D61CA8' : '#9090A0',
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  });

  // Mobile menu item style — SCALE REDUCED
  const getMobileLinkStyle = ({ isActive }) => ({
    font: isActive ? '700 15px/1 "DM Sans", sans-serif' : '600 15px/1 "DM Sans", sans-serif',
    color: isActive ? '#D61CA8' : '#0A0A0F',
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  });

  const closeMenu = () => setMenuOpen(false);

  const go = (path) => {
    closeMenu();
    navigate(path);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Services' },
    { to: '/MyBookings', label: 'My Bookings' },
    { to: '/help', label: 'Help' },
  ];

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #EBEBEF', height: '62px', display: 'flex', alignItems: 'center', padding: isMobile ? '0 20px' : '0 52px', gap: '24px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img
            src="../../../public/image 672.png"
            style={{ height: '26px', flexShrink: 0 }}
            alt="UniteOman Logo"
          />
        </div>

        {/* Desktop nav links */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '40px', flex: 1, justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} style={getMenuLinkStyle}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Desktop right-side actions */}
        {!isMobile && (
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
            <div onClick={() => navigate('/categories')} style={{ padding: '7px 18px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 15px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.25)' }}>
              Book Now
            </div>
          </div>
        )}

        {/* Mobile: bell + hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              onClick={() => navigate('/Notifications')}
              style={{ width: '32px', height: '32px', background: '#F8F8FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', cursor: 'pointer' }}
            >
              🔔
            </div>
            <div
              onClick={() => setMenuOpen(true)}
              style={{ display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer', padding: '6px' }}
              aria-label="Open menu"
            >
              <span style={{ width: '22px', height: '2px', background: '#0A0A0F', borderRadius: '2px' }} />
              <span style={{ width: '22px', height: '2px', background: '#0A0A0F', borderRadius: '2px' }} />
              <span style={{ width: '22px', height: '2px', background: '#0A0A0F', borderRadius: '2px' }} />
            </div>
          </div>
        )}

      </div>

      {/* Mobile full-screen menu overlay — SCALE REDUCED */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'white',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}
        >
          {/* Top bar: logo + close */}
          <div style={{ height: '54px', minHeight: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #EBEBEF' }}>
            <img
              src="../../../public/image 672.png"
              style={{ height: '22px', flexShrink: 0 }}
              alt="UniteOman Logo"
            />
            <div
              onClick={closeMenu}
              style={{ fontSize: '18px', color: '#0A0A0F', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
              aria-label="Close menu"
            >
              ✕
            </div>
          </div>

          {/* Nav links block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px 20px 0' }}>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} style={getMobileLinkStyle} onClick={closeMenu}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #EBEBEF', margin: '22px 20px 0' }} />

          {/* Primary CTA panel block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '22px 20px 24px' }}>
            <div
              onClick={() => go('/customer/login')}
              style={{
                textAlign: 'center',
                padding: '10px',
                border: '1.5px solid #EBEBEF',
                borderRadius: '8px',
                font: '600 15px/1 "DM Sans", sans-serif',
                color: '#0A0A0F',
                cursor: 'pointer'
              }}
            >
              Login
            </div>
            <div
              onClick={() => go('/categories')}
              style={{
                textAlign: 'center',
                padding: '11px',
                background: BRAND_GRADIENT,
                borderRadius: '8px',
                font: '700 15px/1 "DM Sans", sans-serif',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(214,28,168,.18)'
              }}
            >
              Book Now
            </div>
          </div>
        </div>
      )}
    </div>
  );
}