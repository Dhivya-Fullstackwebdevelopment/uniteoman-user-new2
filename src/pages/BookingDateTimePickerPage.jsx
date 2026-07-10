import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Static timeline datasets matching your HTML specification configuration rules
const STATIC_DATES = [
  { day: 'Wed', num: '9', month: 'Jul', year: '2026' },
  { day: 'Thu', num: '10', month: 'Jul', year: '2026' },
  { day: 'Fri', num: '11', month: 'Jul', year: '2026' },
  { day: 'Sat', num: '12', month: 'Jul', year: '2026' },
  { day: 'Sun', num: '13', month: 'Jul', year: '2026' },
  { day: 'Mon', num: '14', month: 'Jul', year: '2026' }
]

const STATIC_SLOTS = [
  { time: '8:00 AM', status: 'disabled' },
  { time: '9:00 AM', status: 'disabled' },
  { time: '10:00 AM', status: 'active' },
  { time: '11:00 AM', status: 'available' },
  { time: '12:00 PM', status: 'available' },
  { time: '1:00 PM', status: 'available' },
  { time: '2:00 PM', status: 'available' },
  { time: '3:00 PM', status: 'available' },
  { time: '4:00 PM', status: 'available' },
  { time: '5:00 PM', status: 'available' },
  { time: '6:00 PM', status: 'available' },
  { time: '7:00 PM', status: 'available' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingDateTimePickerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Track the interactive states for picked date and targeted hours
  const [selectedDateNum, setSelectedDateNum] = useState('9')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM')

  const activeDateObj = STATIC_DATES.find(d => d.num === selectedDateNum) || STATIC_DATES[0]

  const handleNextStepNavigation = () => {
    navigate(`/BookingAddressPage?date=${encodeURIComponent(activeDateObj.day)},${encodeURIComponent(activeDateObj.num)} ${encodeURIComponent(activeDateObj.month)} ${encodeURIComponent(activeDateObj.year)}&time=${encodeURIComponent(selectedTimeSlot)}`)
  }

  return (
    <div style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Outer Content Alignment Layer preserving explicit side spacing constraints */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
        <div style={{ background: 'white', padding: '28px 56px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,.04)', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px' }}>
          
          {/* LEFT INTERACTIVE DATE-TIME STEPPER SECTION */}
          <div>
            
            {/* Horizontal Checkout Step Timeline Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignTemplateItems: 'center', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', border_radius: '50%', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: 'white' }}>1</div>
                  <span style={{ font: '700 10px/1 "DM Sans", sans-serif', color: '#D61CA8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Date & Time</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E8E8EE', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: '#9090A0' }}>2</div>
                  <span style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#C0C0CC', textTransform: 'uppercase', letterSpacing: '.5px' }}>Address</span>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E8E8EE', marginBottom: '13px', marginLeft: '8px', marginRight: '8px' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8E8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px "DM Sans", sans-serif', color: '#9090A0' }}>3</div>
                  <span style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#C0C0CC', textTransform: 'uppercase', letterSpacing: '.5px' }}>Payment</span>
                </div>
              </div>
            </div>

            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Choose Date</div>
            
            {/* Dynamic Rendering Framework for Static Horizontal Date Strip Cards */}
            <div style={{ display: 'flex', gap: '9px', marginBottom: '22px' }}>
              {STATIC_DATES.map((date) => {
                const isSelected = selectedDateNum === date.num
                return (
                  <div
                    key={date.num}
                    onClick={() => setSelectedDateNum(date.num)}
                    style={{
                      flex: 1, padding: '12px 6px', borderRadius: '13px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease',
                      background: isSelected ? BRAND_GRADIENT : '#F8F8FA',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF'
                    }}
                  >
                    <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.7)' : '#9090A0', marginBottom: '5px' }}>{date.day}</div>
                    <div style={{ font: '800 16px/1 "DM Sans", sans-serif', color: isSelected ? 'white' : '#0A0A0F' }}>{date.num}</div>
                    <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: isSelected ? 'rgba(255,255,255,.6)' : '#9090A0', marginTop: '2px' }}>{date.month}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '12px' }}>Available Time Slots</div>
            
            {/* Time Slot Choice Quad Grid Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '9px', marginBottom: '18px' }}>
              {STATIC_SLOTS.map((slot) => {
                const isDisabled = slot.status === 'disabled'
                const isSelected = selectedTimeSlot === slot.time && !isDisabled

                return (
                  <div
                    key={slot.time}
                    onClick={() => !isDisabled && setSelectedTimeSlot(slot.time)}
                    style={{
                      padding: '11px 6px', borderRadius: '11px', textAlign: 'center', transition: 'all 0.15s ease',
                      background: isDisabled ? '#F0F0F0' : isSelected ? BRAND_GRADIENT : '#F8F8FA',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid #EBEBEF',
                      font: isSelected ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif',
                      color: isDisabled ? '#C0C0CC' : isSelected ? 'white' : '#0A0A0F',
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {slot.time} {isDisabled && '•'}
                  </div>
                )
              })}
            </div>

            {/* Explanatory AI Information Strip */}
            <div style={{ background: 'rgba(75,110,245,.05)', border: '1px solid rgba(75,110,245,.2)', borderRadius: '11px', padding: '11px 14px', display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>ℹ️</span>
              <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#4B6EF5' }}>
                AC Deep Cleaning takes ~45 mins. Mohammed will arrive at {selectedTimeSlot} on {activeDateObj.day} {activeDateObj.num} {activeDateObj.month}.
              </div>
            </div>
          </div>

          {/* RIGHT FIXED SUMMARY PANEL SECTION */}
          <div>
            <div style={{ background: '#0A0A0F', borderRadius: '18px', padding: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: 'white', marginBottom: '3px' }}>Booking Summary</div>
              <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Mohammed Al-Balushi</div>
              
              {/* Structured Attribute Line Items */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Service</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', maxWidth: '170px', textAlign: 'right' }}>AC Deep Cleaning</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Pro</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', maxWidth: '170px', textAlign: 'right' }}>Mohammed Al-Balushi ★4.9</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Date</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', maxWidth: '170px', textAlign: 'right' }}>
                  {activeDateObj.day}, {activeDateObj.num} {activeDateObj.month} {activeDateObj.year}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Time</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', maxWidth: '170px', textAlign: 'right' }}>{selectedTimeSlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.45)' }}>Duration</span>
                <span style={{ font: '600 11px/1 "DM Sans", sans-serif', color: 'white', maxWidth: '170px', textAlign: 'right' }}>~45 min</span>
              </div>
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '14px 0' }}></div>
              
              {/* Estimated totals layout metric */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: 'rgba(255,255,255,.4)' }}>Estimated Total</span>
                <span style={{ font: '800 18px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR 17.985</span>
              </div>

              {/* Action Stepper Checkout Event Trigger */}
              <button
                onClick={handleNextStepNavigation}
                style={{ width: '100%', border: 'none', outline: 'none', padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
              >
                Continue to Address →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}