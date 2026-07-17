import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import {
  selectSelectedServiceType,
  selectSelectedProfessional,
  selectSelectedDate,
  selectSelectedTime,
  selectSelectedDateObj,
  selectOrderSummary,
  selectServiceTypeId
} from '../store/slices/searchSlice'

const STATIC_METHODS = [
  { id: 'bank_of_muscat_card', name: 'Bank of Muscat Card', subtext: 'Maisarah · Visa · AMEX · OMR cards', icon: '🏦' },
  { id: 'apple_pay', name: 'Apple Pay', subtext: 'Double-click to pay', icon: '📱' },
  { id: 'google_pay', name: 'Google Pay', subtext: 'Touch to pay', icon: '🤳' },
  { id: 'thawani', name: 'Thawani', subtext: 'Oman local debit card', icon: '💳' },
  { id: 'cash_on_completion', name: 'Cash on Completion', subtext: 'Pay after service is done', icon: '💵' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingPaymentPage() {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  // Get data strictly from Redux Selectors
  const serviceType = useSelector(selectSelectedServiceType)
  const professional = useSelector(selectSelectedProfessional)
  const selectedDate = useSelector(selectSelectedDate) // e.g., '21'
  const selectedTime = useSelector(selectSelectedTime) // e.g., '10:00 AM'
  const selectedDateObj = useSelector(selectSelectedDateObj) // e.g., {day: 'Tue', num: '21', month: 'Jul', year: '2026', full: '...'}
  const orderSummary = useSelector(selectOrderSummary)
  const serviceTypeId = useSelector(selectServiceTypeId)

  const [paymentMethod, setPaymentMethod] = useState('bank_of_muscat_card')
  const [saveCard, setSaveCard] = useState(true)
  const [cardNumber, setCardNumber] = useState('4521 XXXX XXXX 4521')
  const [expiry, setExpiry] = useState('09 / 28')
  const [cvv, setCvv] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Format date cleanly for UI panel display (e.g., "Tue 21 Jul")
  const getUIDateDisplay = () => {
    if (selectedDateObj && selectedDateObj.day && selectedDateObj.num && selectedDateObj.month) {
      return `${selectedDateObj.day} ${selectedDateObj.num} ${selectedDateObj.month}`
    }
    return selectedDate || 'Wed 9 Jul'
  }

  // Safely extract YYYY-MM-DD from the state values
  const toApiDate = () => {
    // Strategy 1: Read directly from the serialized date timestamp object property if available
    if (selectedDateObj?.full) {
      try {
        const d = new Date(selectedDateObj.full)
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear()
          const mm = String(d.getMonth() + 1).padStart(2, '0')
          const dd = String(d.getDate()).padStart(2, '0')
          return `${yyyy}-${mm}-${dd}`
        }
      } catch (e) {
        console.error("Error formatting full timestamp field", e)
      }
    }

    // Strategy 2: Reconstruct it if fields are passed separately inside the object mapping
    if (selectedDateObj?.year && selectedDateObj?.month && selectedDateObj?.num) {
      try {
        const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
        const monthIndex = monthMap[selectedDateObj.month] ?? 0
        const d = new Date(Number(selectedDateObj.year), monthIndex, Number(selectedDateObj.num))
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear()
          const mm = String(d.getMonth() + 1).padStart(2, '0')
          const dd = String(d.getDate()).padStart(2, '0')
          return `${yyyy}-${mm}-${dd}`
        }
      } catch (e) {
        console.error("Error constructing parsed date object structure", e)
      }
    }

    return ''
  }

  // Convert incoming formats securely to 24h format (HH:MM)
  const toApiTime = (rawTime) => {
    if (!rawTime) return ''
    const cleanTime = rawTime.trim()
    if (/^\d{2}:\d{2}$/.test(cleanTime)) {
      return cleanTime
    }

    const match = cleanTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) {
      const parts = cleanTime.split(':')
      if (parts.length >= 2) {
        const hh = parts[0].padStart(2, '0')
        const mm = parts[1].slice(0, 2).padStart(2, '0')
        return `${hh}:${mm}`
      }
      return cleanTime
    }

    let [, h, m, period] = match
    h = parseInt(h, 10)
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12
    if (period.toUpperCase() === 'AM' && h === 12) h = 0

    return `${String(h).padStart(2, '0')}:${m.padStart(2, '0')}`
  }

  const handleProcessCheckoutPayment = async () => {
    setError('')

    const apiBookingDate = toApiDate(selectedDate)
    const apiBookingTime = toApiTime(selectedTime)

    console.log("Processed Payload date & time:", apiBookingDate, apiBookingTime)

    if (!apiBookingDate || !apiBookingTime) {
      setError('Invalid date or time structure selected. Please try reselecting.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        professional_id: Number(professional?.id || 0),
        service_type_id: Number(serviceTypeId || 0),
        booking_date: apiBookingDate,   // Outputs correctly: "2026-07-21"
        booking_time: apiBookingTime,   // Outputs correctly: "10:00"
        user_name: searchParams.get('user_name') || '',
        user_email: searchParams.get('user_email') || '',
        user_mobile: searchParams.get('user_mobile') || '',
        area: searchParams.get('area') || '',
        villa_apartment_no: searchParams.get('villa_apartment_no') || '',
        street_name: searchParams.get('street_name') || '',
        building_floor: searchParams.get('building_floor') || '',
        nearest_landmark: searchParams.get('nearest_landmark') || '',
        latitude: Number(searchParams.get('latitude')) || 23.5810,
        longitude: Number(searchParams.get('longitude')) || 58.3850,
        payment_method: paymentMethod,
        card_last4: paymentMethod === 'bank_of_muscat_card' ? cardNumber.slice(-4) : undefined,
        save_card: paymentMethod === 'bank_of_muscat_card' ? saveCard : undefined
      }

      const response = await axios.post(
        API_ENDPOINTS.CREATE_BOOKING,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('customer_token')}`
          }
        }
      )

      if (response.data && response.data.status === 'success') {
        navigate('/BookingConfirmationPage', { state: { booking: response.data.data } })
      } else {
        setError(response.data?.message || 'Booking failed. Please try again.')
      }
    } catch (err) {
      console.error('Booking creation error:', err)
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-root-wrapper" style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      <style>{`
        .outer-layout-box { max-width: 1240px; margin: 0 auto; padding: 0 56px; width: 100%; box-sizing: border-box; }
        .inner-content-card { background: white; padding: 28px 56px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,.04); display: grid; grid-template-columns: 1fr 360px; gap: 28px; }
        .card-inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media (max-width: 1024px) { .outer-layout-box { padding: 0 24px; } .inner-content-card { padding: 24px; grid-template-columns: 1fr 300px; gap: 20px; } }
        @media (max-width: 768px) { .page-root-wrapper { padding: 16px 0; } .outer-layout-box { padding: 0 12px; } .inner-content-card { padding: 20px 14px; grid-template-columns: 1fr; gap: 24px; } .stepper-label-text { display: none; } .card-inputs-grid { grid-template-columns: 1fr; gap: 12px; } .card-inputs-grid > div:first-child { grid-column: span 1 !important; } .summary-sticky-panel { position: relative !important; top: 0 !important; } }
      `}</style>

      <div className="outer-layout-box">
        <div className="inner-content-card">

          {/* LEFT AREA - Payment Form */}
          <div style={{ minWidth: 0 }}>
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

            {paymentMethod === 'bank_of_muscat_card' && (
              <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '18px', border: '1.5px solid rgba(214,28,168,.2)', marginBottom: '16px' }}>
                <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Bank of Muscat Card Details</div>
                <div className="card-inputs-grid">
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px' }}>Card Number</label>
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px', font: '600 14px/1 "DM Mono", monospace' }} />
                  </div>
                  <div>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px' }}>Expiry</label>
                    <input value={expiry} onChange={(e) => setExpiry(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px' }} />
                  </div>
                  <div>
                    <label style={{ font: '600 11px/1 "DM Sans", sans-serif', color: '#9090A0', display: 'block', marginBottom: '6px' }}>CVV</label>
                    <input value={cvv} type="password" maxLength={3} onChange={(e) => setCvv(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '11px', padding: '12px 14px' }} />
                  </div>
                </div>
                <div onClick={() => setSaveCard(!saveCard)} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', marginTop: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', background: saveCard ? '#D61CA8' : 'white', border: saveCard ? '1.5px solid #D61CA8' : '1.5px solid #D0D0D4' }}>{saveCard && '✓'}</div>
                  <span style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Save card for future bookings</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', marginBottom: '16px' }}>
              <span>🔒</span>
              <span style={{ font: '400 11px/1.4 "DM Sans", sans-serif', color: '#9090A0', textAlign: 'center' }}>
                Secured by Bank of Muscat · PCI DSS Level 1 · Your card is not charged until service is complete
              </span>
            </div>
          </div>

          {/* RIGHT AREA - Order Summary */}
          <div style={{ minWidth: 0 }}>
            <div className="summary-sticky-panel" style={{ background: '#0A0A0F', borderRadius: '18px', padding: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '16px' }}>Order Summary</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Service</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>{serviceType?.name || 'AC Deep Cleaning'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Pro</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>
                  {professional?.name || 'Mohammed Al-Balushi'} {professional?.rating && ` ★${professional.rating}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Date</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>
                  {getUIDateDisplay()} · {selectedTime || '10:00 AM'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Address</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', textAlign: 'right' }}>Villa 12, Qurum</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '12px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Service fee</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR {(orderSummary?.serviceFee || 0).toFixed(3)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Platform fee (10%)</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR {(orderSummary?.platformFee || 0).toFixed(3)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>VAT (9%)</span>
                <span style={{ font: '500 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.65)' }}>OMR {(orderSummary?.vat || 0).toFixed(3)}</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '12px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ font: '700 14px/1 "DM Sans", sans-serif', color: 'white' }}>Total</span>
                <span style={{ font: '800 20px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR {(orderSummary?.total || 0).toFixed(3)}</span>
              </div>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.3)', marginBottom: '16px' }}>Charged after completion</div>

              {error && (
                <div style={{ color: '#EF4444', font: '500 12px/1.4 "DM Sans", sans-serif', marginBottom: '10px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleProcessCheckoutPayment}
                disabled={submitting}
                style={{ width: '100%', border: 'none', outline: 'none', padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
              >
                {submitting ? 'Processing...' : `Confirm & Pay OMR ${(orderSummary?.total || 0).toFixed(3)} →`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}