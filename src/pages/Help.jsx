import React, { useEffect, useState } from 'react';

const COMMON_ISSUES = [
  {
    icon: '❓',
    label: 'How to cancel a booking',
    answer: 'Go to "My Bookings", open the booking you want to cancel, and tap "Cancel Booking". Cancellations made more than 2 hours before the scheduled time are fully refunded.',
  },
  {
    icon: '💳',
    label: 'Payment not working',
    answer: 'Check that your card or wallet has sufficient balance and that your internet connection is stable. If the issue continues, try a different payment method or contact support.',
  },
  {
    icon: '🚗',
    label: "Pro hasn't arrived",
    answer: 'Open "My Bookings" and tap the live map to track your pro in real time. If they are more than 15 minutes late, you can contact them directly or reach out to support.',
  },
  {
    icon: '⭐',
    label: 'How to report a problem',
    answer: 'Go to the booking in question, tap "Report an Issue", and describe what happened. Our support team will follow up with you within 24 hours.',
  },
  {
    icon: '🧾',
    label: 'Get my invoice / receipt',
    answer: 'Open "My Bookings", select the completed service, and tap "Download Receipt" to get a PDF copy of your invoice sent to your email.',
  },
  {
    icon: '🔄',
    label: 'Reschedule a booking',
    answer: 'Go to "My Bookings", select the booking, and tap "Reschedule" to choose a new available date and time slot.',
  },
];

const CONTACT_METHODS = [
  { icon: '💬', title: 'WhatsApp Chat', subtitle: '+968 2XXX XXXX' },
  { icon: '📞', title: 'Call Support', subtitle: '24/7 available' },
  { icon: '📧', title: 'Email', subtitle: 'support@uniteoman.com' },
];

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export default function Help() {
  const bp = useBreakpoint();
  const isDesktop = bp === 'desktop';
  const isTablet = bp === 'tablet';
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIssue = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4F4F7',
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        padding: isDesktop ? '40px 32px 60px' : isTablet ? '28px 24px 48px' : '20px 16px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: isDesktop ? '960px' : '420px',
          margin: '0 auto',
          display: isDesktop ? 'grid' : 'block',
          gridTemplateColumns: isDesktop ? '1fr 340px' : undefined,
          gap: isDesktop ? '24px' : undefined,
          alignItems: 'start',
        }}
      >

        {/* Left / Main column */}
        <div>
          {/* AI Assistant Banner */}
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'linear-gradient(120deg, #D61CA8 0%, #8B2EF5 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: isDesktop ? '22px 26px' : '18px 18px',
              marginBottom: '24px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(139, 46, 245, 0.25)',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: isDesktop ? '54px' : '48px',
                height: isDesktop ? '54px' : '48px',
                minWidth: isDesktop ? '54px' : '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isDesktop ? '26px' : '22px',
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: `700 ${isDesktop ? '17px' : '15px'}/1.3 "DM Sans", sans-serif`, color: '#fff' }}>
                Chat with AI Assistant
              </div>
              <div style={{ font: `400 ${isDesktop ? '13px' : '12px'}/1.4 "DM Sans", sans-serif`, color: 'rgba(255,255,255,0.85)', marginTop: '3px' }}>
                Get instant answers in English or Arabic
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontWeight: 700 }}>›</span>
          </button>

          {/* Common Issues */}
          <div
            style={{
              font: '700 11px/1 "DM Sans", sans-serif',
              letterSpacing: '0.6px',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}
          >
            Common Issues
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: '18px',
              marginBottom: isDesktop ? '0' : '28px',
              boxShadow: '0 2px 10px rgba(16,16,40,0.05)',
              overflow: 'hidden',
            }}
          >
            {COMMON_ISSUES.map((issue, idx) => {
              const isOpen = openIndex === idx;
              const isLast = idx === COMMON_ISSUES.length - 1;
              return (
                <div
                  key={issue.label}
                  style={{
                    borderBottom: isLast && !isOpen ? 'none' : '1px solid #F1F1F5',
                  }}
                >
                  <div
                    role="button"
                    onClick={() => toggleIssue(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      background: isOpen ? '#FBF7FC' : '#fff',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '18px', width: '22px', textAlign: 'center' }}>
                      {issue.icon}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        font: '600 14px/1.3 "DM Sans", sans-serif',
                        color: isOpen ? '#D61CA8' : '#12121A',
                      }}
                    >
                      {issue.label}
                    </span>
                    <span
                      style={{
                        color: isOpen ? '#D61CA8' : '#C4C4CE',
                        fontSize: '13px',
                        fontWeight: 700,
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease',
                        display: 'inline-block',
                      }}
                    >
                      ›
                    </span>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 18px 18px 54px',
                        font: '400 13px/1.6 "DM Sans", sans-serif',
                        color: '#6B7280',
                        background: '#FBF7FC',
                      }}
                    >
                      {issue.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Contact column */}
        <div>
          <div
            style={{
              font: '700 11px/1 "DM Sans", sans-serif',
              letterSpacing: '0.6px',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}
          >
            Contact Us
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CONTACT_METHODS.map((method) => (
              <div
                key={method.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  boxShadow: '0 2px 10px rgba(16,16,40,0.05)',
                }}
              >
                <span style={{ fontSize: '20px', width: '26px', textAlign: 'center' }}>{method.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '700 14px/1.3 "DM Sans", sans-serif', color: '#12121A' }}>
                    {method.title}
                  </div>
                  <div
                    style={{
                      font: '400 12px/1.4 "DM Sans", sans-serif',
                      color: '#A3A3AF',
                      marginTop: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {method.subtitle}
                  </div>
                </div>
                <button
                  style={{
                    border: 'none',
                    outline: 'none',
                    padding: '9px 22px',
                    background: 'linear-gradient(120deg, #D61CA8 0%, #8B2EF5 100%)',
                    borderRadius: '999px',
                    font: '700 12px/1 "DM Sans", sans-serif',
                    color: '#fff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}