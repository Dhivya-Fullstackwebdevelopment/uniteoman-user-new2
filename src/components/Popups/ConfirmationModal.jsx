// components/Popups/ConfirmationModal.jsx
import React from 'react'

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10, 10, 15, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px', fontFamily: '"DM Sans", sans-serif'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '28px',
        maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📅</div>
        <h3 style={{ font: '700 18px/1.3 "DM Sans", sans-serif', color: '#0A0A0F', margin: '0 0 12px 0' }}>
          {title || 'Service Already Booked'}
        </h3>
        <p style={{ font: '400 14px/1.5 "DM Sans", sans-serif', color: '#6B7280', margin: '0 0 24px 0' }}>
          {message}
        </p>
        
        {/* Actions Row */}
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={onConfirm}
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #D61CA8, #8B2EF5)',
              border: 'none', borderRadius: '12px',
              font: '700 14px "DM Sans", sans-serif', color: 'white',
              cursor: 'pointer', outline: 'none'
            }}
          >
            Book Again Anyway →
          </button>
          
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '12px',
              background: '#F4F5F8', border: 'none', borderRadius: '12px',
              font: '600 14px "DM Sans", sans-serif', color: '#6B7280',
              cursor: 'pointer', outline: 'none'
            }}
          >
            Cancel & Change Slot
          </button>
        </div>
      </div>
    </div>
  )
}