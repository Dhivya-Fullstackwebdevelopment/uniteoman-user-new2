import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('customer_token');
      const userData = localStorage.getItem('customerUser');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (in case of logout/login in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('customer_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('customerUser');
    setIsAuthenticated(false);
    setUser(null);
    setShowDropdown(false);
    closeMenu();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Services' },
    { to: '/MyBookings', label: 'My Bookings' },
    { to: '/help', label: 'Help' },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '';
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user.mobile_number) {
      return user.mobile_number.substring(0, 2);
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return '';
    return user.name || user.mobile_number || 'User';
  };

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200); // 200ms delay to allow moving to dropdown
  };

  // Handle dropdown mouse enter (cancel close)
  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

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
            
            {isAuthenticated && user ? (
              // Show user profile dropdown with ref
              <div 
                ref={dropdownRef}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 4px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    background: showDropdown ? '#F3F4F6' : '#F8F8FA',
                    border: showDropdown ? '1.5px solid #D61CA8' : '1.5px solid #EBEBEF',
                    transition: 'all 0.15s ease',
                    boxShadow: showDropdown ? '0 2px 12px rgba(214,28,168,.15)' : 'none'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: BRAND_GRADIENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    {getUserInitials()}
                  </div>
                  
                  {/* Name */}
                  <span style={{
                    font: '600 13px/1 "DM Sans", sans-serif',
                    color: '#0A0A0F',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {getDisplayName()}
                  </span>
                  
                  {/* Dropdown arrow */}
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    style={{ 
                      marginLeft: '2px',
                      transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <path d="M6 8L1 3L11 3L6 8Z" fill="#9090A0" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '180px',
                      background: 'white',
                      border: '1px solid #EBEBEF',
                      borderRadius: '12px',
                      padding: '6px 0',
                      boxShadow: '0 8px 32px rgba(0,0,0,.12)',
                      zIndex: 100,
                      animation: 'slideDown 0.2s ease'
                    }}
                  >
                    {/* Profile Option */}
                    <div
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        font: '500 14px/1 "DM Sans", sans-serif',
                        color: '#0A0A0F',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8F8FA'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.933 8 11.5 6.433 11.5 4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5C4.5 6.433 6.067 8 8 8Z" stroke="#0A0A0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 15C1 11.686 4.134 9 8 9C11.866 9 15 11.686 15 15" stroke="#0A0A0F" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      My Profile
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#EBEBEF', margin: '4px 12px' }} />

                    {/* Logout Option */}
                    <div
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        font: '500 14px/1 "DM Sans", sans-serif',
                        color: '#EF4444',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V4C1 3.46957 1.21071 2.96086 1.58579 2.58579C1.96086 2.21071 2.46957 2 3 2H6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 11L15 8L11 5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8H6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Show Login button when not authenticated
              <>
                <div
                  onClick={() => navigate('/customer/login')}
                  style={{ padding: '7px 16px', border: '1.5px solid #EBEBEF', borderRadius: '9px', font: '600 15px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                >
                  Login
                </div>
                <div onClick={() => navigate('/categories')} style={{ padding: '7px 18px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 15px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.25)' }}>
                  Book Now
                </div>
              </>
            )}
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
            {isAuthenticated && user ? (
              // Show user info in mobile menu
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    background: '#F8F8FA',
                    borderRadius: '10px',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: BRAND_GRADIENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: '"DM Sans", sans-serif',
                      flexShrink: 0
                    }}
                  >
                    {getUserInitials()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      font: '600 15px/1.2 "DM Sans", sans-serif',
                      color: '#0A0A0F',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {getDisplayName()}
                    </div>
                    {user.mobile_number && (
                      <div style={{
                        font: '400 12px/1.2 "DM Sans", sans-serif',
                        color: '#9090A0'
                      }}>
                        {user.mobile_number}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => {
                    go('/profile');
                  }}
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
                  My Profile
                </div>

                <div
                  onClick={handleLogout}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    border: '1.5px solid #FEE2E2',
                    borderRadius: '8px',
                    font: '600 15px/1 "DM Sans", sans-serif',
                    color: '#EF4444',
                    cursor: 'pointer',
                    background: '#FEF2F2'
                  }}
                >
                  Logout
                </div>
              </>
            ) : (
              // Show login/register in mobile menu
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}