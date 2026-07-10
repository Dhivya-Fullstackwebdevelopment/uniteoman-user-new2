import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Static dataset for payment gateways mapping text definitions from your layout specification
const STATIC_METHODS = [
  { id: 'bom', name: 'Bank of Muscat Card', subtext: 'Maisarah · Visa · AMEX · OMR cards', icon: '🏦' },
  { id: 'apple', name: 'Apple Pay', subtext: 'Double-click to pay', icon: '📱' },
  { id: 'google', name: 'Google Pay', subtext: 'Touch to pay', icon: '🤳' },
  { id: 'thawani', name: 'Thawani', subtext: 'Oman local debit card', icon: '💳' },
  { id: 'cash', name: 'Cash on Completion', subtext: 'Pay after service is done', icon: '💵' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingPaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Interactive step controllers for selecting standard gateway methods
  const [paymentMethod, setPaymentMethod] = useState('bom')
  const [saveCard, setSaveCard] = useState(true)

  // Card attributes entry fields control state bounds
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4521')
  const [expiry, setExpiry] = useState('09 / 28')
  const [cvv, setCvv] = useState('•••')

  const handleProcessCheckoutPayment = () => {
    navigate('/BookingConfirmationPage')
  }

  return (
    <div className="page-root-wrapper" style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Optimized styling structure with correct fallback parameters for narrow viewports */}
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
        .card-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
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
          .card-inputs-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .card-inputs-grid > div:first-child {
            grid-column: span 1 !important;
          }
          .summary-sticky-panel {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
      
      <div className="outer-layout-box">
        <div className="inner-content-card">
          
          {/* LEFT AREA PANEL: PROGRESS TIMELINE & CHANNELS */}
          <div style={{ minWidth: 0 }}>
            
            {/* Horizontal Step-by-Step Checkout Flow Timeline Banner */}
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
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>✓</div>
                  <span className="stepper-label-text" style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#10B981', textTransform: 'uppercase', letterSpacing: '.5px' }}>Address</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#10B981', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>3</div>
                  <span className="stepper-label-text" style={{ font: '700 10px/1 "DM Sans", sans-serif', color: '#D61CA8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Payment</span>
                </div>
              </div>
            </div>

            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '16px' }}>Choose Payment Method</div>
            
            {/* Dynamic Payment Gateways Option List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
              {STATIC_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '13px', cursor: 'pointer', transition: 'all 0.2s ease',
                      background: isSelected ? 'rgba(214,28,168,.04)' : '#F4F5F8',
                      border: isSelected ? '1.5px solid rgba(214,28,168,.3)' : '1.5px solid #EBEBEF'
                    }}
                  >
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{method.name}</div>
                      <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '3px' }}>{method.subtext}</div>
                    </div>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      border: isSelected ? '2px solid #D61CA8' : '2px solid #D0D0D4',
                      background: isSelected ? '#D61CA8' : 'transparent'
                    }}>
                      {isSelected && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bank of Muscat Card Entry Panel View Block */}
            {paymentMethod === 'bom' && (
              <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '18px', border: '1.5px solid rgba(214,28,168,.2)', marginBottom: '16px', transition: 'all 0.2s ease' }}>
                <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Bank of Muscat Card Details</div>
                
                <div className="card-inputs-grid">
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Card Number</label>
                    <input 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px', font: '600 14px/1 "DM Mono", monospace', color: '#0A0A0F', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>Expiry</label>
                    <input 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.6px' }}>CVV</label>
                    <input 
                      value={cvv}
                      type="password"
                      maxLength={3}
                      onChange={(e) => setCvv(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px', font: '400 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div 
                  onClick={() => setSaveCard(!saveCard)}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', marginTop: '12px' }}
                >
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', flexShrink: 0,
                    background: saveCard ? '#D61CA8' : 'white',
                    border: saveCard ? '1.5px solid #D61CA8' : '1.5px solid #D0D0D4'
                  }}>
                    {saveCard && '✓'}
                  </div>
                  <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Save card for future bookings</span>
                </div>
              </div>
            )}

            {/* Core Legal / Cryptographic Security Badge Verification Text Block */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', flexShrink: 0 }}>🔒</span>
              <span style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0', textAlign: 'center' }}>
                Secured by Bank of Muscat · PCI DSS Level 1 · Your card is not charged until service is complete
              </span>
            </div>
          </div>

          {/* RIGHT FIXED SUMMARY CONTAINER COMPONENT PANEL */}
          <div style={{ minWidth: 0 }}>
            <div className="summary-sticky-panel" style={{ background: '#0A0A0F', borderRadius: '18px', padding: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '16px' }}>Order Summary</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Service</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>AC Deep Cleaning</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Pro</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>Mohammed Al-Balushi ★4.9</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Date</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>Wed 9 Jul · 10:00 AM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }}>Address</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>Villa 12, Qurum</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '12px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Service fee</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR 15.000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Platform fee (10%)</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR 1.500</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>VAT (9%)</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR 1.485</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '12px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ font: '700 14px/1 "DM Sans", sans-serif', color: 'white' }}>Total</span>
                <span style={{ font: '800 20px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR 17.985</span>
              </div>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.3)', marginBottom: '16px' }}>Charged after completion</div>
              
              <button
                onClick={handleProcessCheckoutPayment}
                style={{ width: '100%', border: 'none', outline: 'none', padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
              >
                Confirm & Pay OMR 17.985 →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}