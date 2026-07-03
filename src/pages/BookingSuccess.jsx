// src/pages/professional/BookingSuccess.tsx
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Design tokens
const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`

interface BookingSuccessProps {
  serviceName: string
  businessName: string
  phone: string
  slug: string
}

export default function BookingSuccess({ 
  serviceName, 
  businessName, 
  phone, 
  slug 
}: BookingSuccessProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex items-center justify-center px-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-lg w-full text-center py-16">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(214,28,168,.08)', border: '2px solid rgba(214,28,168,.2)' }}>
          <CheckCircle2 size={36} style={{ color: BRAND_FROM }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0F] mb-4 tracking-tight">
          Booking Request Sent!
        </h1>
        <p className="text-[#9090A0] text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Your request for{' '}
          <span className="font-bold text-[#0A0A0F]">{serviceName}</span> at{' '}
          <span className="font-bold text-[#0A0A0F]">{businessName}</span> has been sent.
          The vendor will contact you shortly at{' '}
          <span className="font-bold text-[#0A0A0F]">{phone}</span> to confirm.
        </p>
        <button
          onClick={() => navigate(`/business/${slug}/book`)}
          className="px-8 py-3.5 text-white rounded-full font-black text-sm transition-all hover:-translate-y-0.5"
          style={{ background: BRAND_GRADIENT, boxShadow: '0 6px 20px rgba(214,28,168,.35)' }}
        >
          Return to Profile
        </button>
      </div>
    </div>
  )
}