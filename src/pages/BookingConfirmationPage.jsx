import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'
const STATUS_GRADIENT = 'linear-gradient(135deg, #10B981, #4B6EF5)'

export default function BookingConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking

  // Fallback view when no booking data exists in history state
  if (!booking) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: '"DM Sans", sans-serif' }}>
        <p>No booking found.</p>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#D61CA8', 
            cursor: 'pointer', 
            fontSize: '16px', 
            textDecoration: 'underline' 
          }}
        >
          Go home
        </button>
      </div>
    )
  }

  // Helper function to format phone numbers cleanly
  const cleanPhone = (phone) => phone ? phone.replace(/[^0-9]/g, '') : ''

  return (
    <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '0 16px' }}>

        {/* Success Icon */}
        <div style={{ 
          width: '72px', 
          height: '72px', 
          background: STATUS_GRADIENT, 
          borderRadius: '22px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '34px', 
          margin: '0 auto 20px', 
          boxShadow: '0 12px 32px rgba(16,185,129,.35)', 
          color: 'white' 
        }}>
          ✓
        </div>

        {/* Title & Email Confirmation */}
        <h2 style={{ font: '600 36px/1.2 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1.5px', marginBottom: '10px' }}>
          Booking Confirmed!
        </h2>
        <div style={{ font: '400 16px/1.6 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '20px' }}>
          {/* {booking.professional?.name || 'Your professional'} is confirmed.  */}
          Confirmation sent to {booking.user?.email || 'your email'}.
        </div>

        {/* Notification Alert Banner */}
        <div style={{ 
          background: '#EFF6FF', 
          border: '1px solid #BFDBFE', 
          borderRadius: '12px', 
          padding: '12px 16px', 
          marginBottom: '24px', 
          color: '#1E40AF', 
          fontSize: '14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px' 
        }}>
          <span>🔔</span> You will receive a notification and a phone call once your service professional is assigned.
        </div>

        {/* Professional Details Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', marginBottom: '20px', textAlign: 'left' }}>
          
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #EBEBEF' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 20px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
              {booking.professional?.name?.charAt(0) || 'P'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                {booking.professional?.name || 'Assigned Professional'}
              </div>
              <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '5px' }}>
                {booking.professional?.specialty || 'Service Pro'} · ★ {booking.professional?.rating || '5.0'} · {booking.professional?.jobs_done || '0'} jobs
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => window.open(`https://wa.me/${cleanPhone(booking.professional?.phone)}`, '_blank')} 
                style={{ width: '40px', height: '40px', background: '#DBEAFE', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}
                title="Chat on WhatsApp"
              >
                💬
              </button>
              <button 
                onClick={() => window.open(`tel:+${cleanPhone(booking.professional?.phone)}`)} 
                style={{ width: '40px', height: '40px', background: '#D1FAE5', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}
                title="Call Professional"
              >
                📞
              </button>
            </div>
          </div> */}

          {/* Grid Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Booking ID</div>
              <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>#{booking.booking_code || 'N/A'}</div>
            </div>

            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Service</div>
              <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{booking.service?.type_name || 'N/A'}</div>
            </div>

            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
              <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{booking.date || 'N/A'}</div>
            </div>

            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Time</div>
              <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{booking.time || 'N/A'}</div>
            </div>

            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Address</div>
              <div style={{ font: '600 13px/1.4 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                {[booking.address?.villa_apartment_no, booking.address?.street_name, booking.address?.area].filter(Boolean).join(', ') || 'N/A'}
              </div>
            </div>

            <div style={{ background: '#F4F5F8', borderRadius: '10px', padding: '11px' }}>
              <div style={{ font: '400 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', marginBottom: '4px' }}>Amount</div>
              <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                OMR {booking.pricing?.total_amount || '0'} · {booking.payment?.method || 'Card'}
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* <button 
            onClick={() => navigate('/Booking/LiveTracking')} 
            style={{ 
              padding: '12px 24px', 
              background: BRAND_GRADIENT, 
              borderRadius: '12px', 
              border: 'none', 
              font: '700 14px/1 "DM Sans", sans-serif', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            📍 Track Live
          </button> */}
          
          <button 
            onClick={() => navigate('/MyBookings')} 
            style={{ 
              padding: '12px 24px', 
              background: 'white', 
              border: '1.5px solid #EBEBEF', 
              borderRadius: '12px', 
              font: '600 14px/1 "DM Sans", sans-serif', 
              color: '#0A0A0F', 
              cursor: 'pointer' 
            }}
          >
            📋 View Booking
          </button>
        </div>

      </div>
    </div>
  )
}