import { useState, useEffect } from 'react'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

const MONTHS = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
}

// Parses "Sat 25 Jul · 06:00 PM" -> { date: "2026-07-25", time: "18:00" }
function parseBookingDateTime(dateTimeStr) {
    if (!dateTimeStr) return { date: '', time: '' }

    try {
        const [datePart, timePart] = dateTimeStr.split('·').map(s => s.trim())
        // datePart: "Sat 25 Jul"
        const [, day, monthAbbr] = datePart.split(' ')
        const month = MONTHS[monthAbbr]

        // Year is not in the string — use current year,
        // roll to next year if that date has already passed this year
        const now = new Date()
        let year = now.getFullYear()
        const candidate = new Date(`${year}-${month}-${day.padStart(2, '0')}`)
        if (candidate < new Date(now.toDateString())) {
            year += 1
        }

        const date = `${year}-${month}-${day.padStart(2, '0')}`

        // timePart: "06:00 PM"
        const [time24h] = timePart ? [convertTo24h(timePart)] : ['']

        return { date, time: time24h }
    } catch {
        return { date: '', time: '' }
    }
}

function convertTo24h(timeStr) {
    // "06:00 PM" -> "18:00"
    const [time, modifier] = timeStr.split(' ')
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours, 10)

    if (modifier === 'PM' && hours !== 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    return `${String(hours).padStart(2, '0')}:${minutes}`
}

const SERVICE_ICONS = {
    'AC': '❄️', 'Cleaning': '🧹', 'Electrical': '⚡',
    'Plumbing': '🔧', 'Gas': '🔥', 'Filling': '💨'
}

function getServiceIcon(serviceName) {
    for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
        if (serviceName?.includes(key)) return icon
    }
    return '🛠️'
}

export default function RescheduleBookingModal({ isOpen, onClose, onConfirm, booking }) {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        if (booking?.date_time) {
            const parsed = parseBookingDateTime(booking.date_time)
            setDate(parsed.date)
            setTime(parsed.time)
        }
    }, [booking])

    if (!isOpen || !booking) return null

    const handleSubmit = () => {
        if (!date || !time) return
        onConfirm(date, time) // "YYYY-MM-DD", "HH:MM"
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,15,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: '"DM Sans", sans-serif' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
                {/* Header */}
                <div style={{ marginBottom: '4px', font: '700 18px/1.2 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                    Reschedule Booking
                </div>
                <div style={{ marginBottom: '18px', font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                    #{booking.booking_number}
                </div>

                {/* Service card */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F4F5F8',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: '#DBEAFE', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '20px', flexShrink: 0
                    }}>
                        {getServiceIcon(booking.service_name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ font: '700 14px/1.3 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                            {booking.service_name}
                        </div>
                        <div style={{ font: '400 12px/1.3 "DM Sans", sans-serif', color: '#9090A0' }}>
                            {booking.professional_name}
                        </div>
                        <div style={{ font: '600 11px/1.3 "DM Sans", sans-serif', color: '#D61CA8', marginTop: '2px' }}>
                            Current: {booking.date_time}
                        </div>
                    </div>
                </div>

                {/* Date */}
                <label style={{ display: 'block', font: '600 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                    New Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '11px', marginBottom: '14px', borderRadius: '10px', border: '1.5px solid #EBEBEF', font: '400 13px "DM Sans", sans-serif', boxSizing: 'border-box', color: '#0A0A0F' }}
                />

                {/* Time */}
                <label style={{ display: 'block', font: '600 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                    New Time
                </label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '11px', marginBottom: '22px', borderRadius: '10px', border: '1.5px solid #EBEBEF', font: '400 13px "DM Sans", sans-serif', boxSizing: 'border-box', color: '#0A0A0F' }}
                />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #EBEBEF', background: 'white', font: '600 13px "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!date || !time}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: (!date || !time) ? '#EBEBEF' : BRAND_GRADIENT, color: (!date || !time) ? '#9090A0' : 'white', font: '700 13px "DM Sans", sans-serif', cursor: (!date || !time) ? 'not-allowed' : 'pointer' }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}