import React, { useState } from 'react'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function CancelBookingModal({ isOpen, onClose, onConfirm, bookingNumber }) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleConfirmAction = async () => {
    setIsProcessing(true)
    await onConfirm()
    setIsProcessing(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10, 10, 15, 0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-box { animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1); max-width: 400px; width: 90%; }
      `}</style>

      <div className="modal-box" style={{
        background: 'white', borderRadius: '20px', padding: '32px 24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', textAlign: 'center',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        
        <h3 style={{ font: '700 20px/1.3 "DM Sans", sans-serif', color: '#0A0A0F', margin: '0 0 10px 0' }}>
          Cancel Booking?
        </h3>
        
        <p style={{ font: '400 14px/1.5 "DM Sans", sans-serif', color: '#9090A0', margin: '0 0 24px 0', padding: '0 10px' }}>
          Are you sure you want to cancel booking <strong style={{ color: '#0A0A0F' }}>{bookingNumber || 'this order'}</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              flex: 1, padding: '13px', background: '#F4F5F8',
              border: '1.5px solid #EBEBEF', borderRadius: '12px',
              font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0',
              cursor: 'pointer', outline: 'none', transition: 'all 0.15s'
            }}
          >
            Go Back
          </button>
          <button
            onClick={handleConfirmAction}
            disabled={isProcessing}
            style={{
              flex: 1, padding: '13px', background: isProcessing ? '#D0D0D4' : BRAND_GRADIENT,
              borderRadius: '12px', font: '700 14px/1 "DM Sans", sans-serif',
              color: 'white', cursor: isProcessing ? 'not-allowed' : 'pointer',
              border: 'none', outline: 'none', transition: 'all 0.15s',
              boxShadow: isProcessing ? 'none' : '0 4px 14px rgba(214,28,168,.35)'
            }}
          >
            {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}