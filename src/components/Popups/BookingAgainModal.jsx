import { useState } from 'react'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

const SERVICE_ICONS = {
    'AC': '❄️', 'Cleaning': '🧹', 'Electrical': '⚡',
    'Plumbing': '🔧', 'Gas': '🔥', 'Filling': '💨'
}

function getServiceIcon(name) {
    for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
        if (name?.includes(key)) return icon
    }
    return '🛠️'
}

export default function BookAgainModal({ isOpen, onClose, onConfirm, booking, result, isLoading }) {
    if (!isOpen || !booking) return null

    // result is null until the API call succeeds — then we show the success view
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,15,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: '"DM Sans", sans-serif' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '380px', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>

                {!result ? (
                    <>
                        {/* Confirmation view */}
                        <div style={{ font: '700 18px/1.2 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                            Book Again?
                        </div>
                        <div style={{ font: '400 12px/1.4 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '18px' }}>
                            We'll rebook this service with the same professional and address.
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F4F5F8', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                {getServiceIcon(booking.service_name)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ font: '700 14px/1.3 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                                    {booking.service_name}
                                </div>
                                <div style={{ font: '400 12px/1.3 "DM Sans", sans-serif', color: '#9090A0' }}>
                                    {booking.professional_name}
                                </div>
                                <div style={{ font: '700 13px/1.3 "DM Sans", sans-serif', color: '#0A0A0F', marginTop: '2px' }}>
                                    OMR {booking.price}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #EBEBEF', background: 'white', font: '600 13px "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: BRAND_GRADIENT, color: 'white', font: '700 13px "DM Sans", sans-serif', cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
                            >
                                {isLoading ? 'Booking...' : 'Confirm & Rebook'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Success view — populated from API response */}
                        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%', background: '#D1FAE5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '26px', margin: '0 auto 12px'
                            }}>
                                ✅
                            </div>
                            <div style={{ font: '700 17px/1.2 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                                Booking Confirmed!
                            </div>
                            <div style={{ font: '400 12px/1.4 "DM Sans", sans-serif', color: '#9090A0' }}>
                                {result.message}
                            </div>
                        </div>

                        <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Row label="Booking ID" value={result.data.booking_code} />
                            <Row label="Service" value={result.data.service.type_name} />
                            <Row label="Professional" value={result.data.professional.name} />
                            <Row label="Date & Time" value={`${result.data.date} · ${result.data.time}`} />
                            <Row label="Address" value={`${result.data.address.villa_apartment_no}, ${result.data.address.street_name}, ${result.data.address.area}`} />
                            <div style={{ borderTop: '1.5px solid #EBEBEF', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ font: '600 12px "DM Sans", sans-serif', color: '#9090A0' }}>Total</span>
                                <span style={{ font: '700 15px "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR {result.data.pricing.total_amount}</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: BRAND_GRADIENT, color: 'white', font: '700 13px "DM Sans", sans-serif', cursor: 'pointer' }}
                        >
                            Done
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

function Row({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ font: '400 12px/1.4 "DM Sans", sans-serif', color: '#9090A0', flexShrink: 0 }}>{label}</span>
            <span style={{ font: '600 12px/1.4 "DM Sans", sans-serif', color: '#0A0A0F', textAlign: 'right' }}>{value}</span>
        </div>
    )
}