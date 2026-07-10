import React, { useState } from 'react';

const FAQS = [
  {
    category: 'Bookings & Cancellations',
    items: [
      { q: 'How do I track my active booking?', a: 'Go to "My Bookings" in the top navigation panel. For live coordinates, select your ongoing service to open the interactive map view showing your service provider\'s real-time position.' },
      { q: 'What is the cancellation policy?', a: 'You can cancel any service up to 2 hours before the scheduled time slot for a full refund. Cancellations made within 2 hours may incur a minimal standard dispatch fee.' },
      { q: 'Can I reschedule an upcoming booking?', a: 'Yes. Navigate to "My Bookings", select the specific slot details card, and choose an alternative time/day from the dynamic date matrix tool.' }
    ]
  },
  {
    category: 'Payments & Fees',
    items: [
      { q: 'What payment methods do you support?', a: 'We accept all primary localized credit/debit options alongside direct Bank of Muscat automated payment portal transfers.' },
      { q: 'When am I charged for a booked service?', a: 'Payments are securely held upon initiating your checkout slot configuration and are only settled to the vendor post-successful job completion verification.' }
    ]
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#F8F8FA', padding: '40px 0', overflowY: 'auto', fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>
      
      {/* Outer Layout Frame Container matching left/right layout bounds */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
        
        {/* Page Title Header block */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <div style={{ font: '600 22px/1 sans-serif', color: '#0A0A0F' }}>Help &amp; Support</div>
            <div style={{ font: '400 14px/1 sans-serif', color: '#9090A0', marginTop: '6px' }}>
              Find answers, track resolutions, or contact our support team
            </div>
          </div>
        </div>

        {/* Interactive Search Spotlight Bar */}
        <div style={{ background: 'white', border: '1px solid #EBEBEF', borderRadius: '16px', padding: '20px', marginBottom: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for topics, features, or keywords..."
              style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', background: '#F8F8FA', border: '1.5px solid #EBEBEF', borderRadius: '10px', fontSize: '13px', color: '#0A0A0F', outline: 'none' }}
            />
          </div>
        </div>

        {/* Grid Content Split Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>
          
          {/* Left Column: FAQ Accordion Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((cat, catIdx) => (
              <div key={catIdx} style={{ background: 'white', border: '1px solid #EBEBEF', borderRadius: '16px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ font: '700 12px/1 sans-serif', color: '#0A0A0F', marginBottom: '14px', textTransform: 'uppercase', tracking: '0.5px' }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.items.map((item, itemIdx) => {
                    const uniqueId = `${catIdx}-${itemIdx}`;
                    const isOpen = openIndex === uniqueId;
                    return (
                      <div key={itemIdx} style={{ border: '1.5px solid #F0F0F4', borderRadius: '10px', overflow: 'hidden' }}>
                        <div
                          onClick={() => toggleFAQ(uniqueId)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: isOpen ? '#F8F8FA' : 'white', cursor: 'pointer', transition: 'background 0.15s' }}
                        >
                          <span style={{ font: '600 13px/1.2 sans-serif', color: isOpen ? '#D61CA8' : '#0A0A0F' }}>{item.q}</span>
                          <span style={{ font: '700 11px/1 "DM Sans", sans-serif', color: '#9090A0' }}>{isOpen ? '▲' : '▼'}</span>
                        </div>
                        {isOpen && (
                          <div style={{ padding: '14px', font: '400 12px/1.5 sans-serif', color: '#6B7280', borderTop: '1.5px solid #F0F0F4', background: 'white' }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Contact Context Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Direct Support Touchpoints Card */}
            <div style={{ background: 'white', border: '1px solid #EBEBEF', borderRadius: '16px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ font: '700 13px/1 sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Contact Support</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F8F8FA', borderRadius: '10px' }}>
                  <span style={{ fontSize: '16px' }}>💬</span>
                  <div>
                    <div style={{ font: '600 11px/1 sans-serif', color: '#0A0A0F' }}>Live Chat Support</div>
                    <div style={{ font: '400 9px/1 sans-serif', color: '#9090A0', marginTop: '2px' }}>Average response: 2 mins</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F8F8FA', borderRadius: '10px' }}>
                  <span style={{ fontSize: '16px' }}>✉️</span>
                  <div>
                    <div style={{ font: '600 11px/1 sans-serif', color: '#0A0A0F' }}>Email Helpdesk</div>
                    <div style={{ font: '400 9px/1 sans-serif', color: '#9090A0', marginTop: '2px' }}>support@uniteoman.om</div>
                  </div>
                </div>
              </div>
              <button style={{ width: '100%', boxSizing: 'border-box', border: 'none', outline: 'none', marginTop: '12px', padding: '11px', background: 'linear-gradient(135deg, #D61CA8, #8B2EF5)', borderRadius: '10px', font: '700 13px/1 sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 3px 10px rgba(214,28,168,.2)' }}>
                Start Live Chat
              </button>
            </div>

            {/* Quick Platform Metrics Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0A0A0F, #0a1240)', borderRadius: '16px', padding: '18px', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,.05)' }}>
              <div style={{ font: '700 11px/1 sans-serif', color: '#D61CA8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operating Hours</div>
              <div style={{ font: '600 15px/1.2 sans-serif', color: 'white' }}>7:00 AM – 11:00 PM</div>
              <div style={{ font: '400 10px/1 sans-serif', color: 'white', opacity: 0.4, marginTop: '5px' }}>Muscat, Oman Time · Saturday to Friday</div>
            </div>

          </div>

        </div>
        
      </div>
    </div>
  );
}