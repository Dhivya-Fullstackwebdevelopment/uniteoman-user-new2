import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Static arrays mapping notifications dataset from your HTML specification rules
const STATIC_TODAY_NOTIFS = [
    {
        id: 1,
        icon: '📍',
        iconBg: '#D61CA815',
        title: 'Mohammed is on the way!',
        description: 'Your AC Deep Cleaning booking #UO-4601 — Mohammed is 1.2 km away. ETA: 12 min.',
        time: '2 min ago',
        unread: true
    },
    {
        id: 2,
        icon: '✅',
        iconBg: '#10B98115',
        title: 'Booking Confirmed — #UO-4601',
        description: 'AC Deep Cleaning booked with Mohammed Al-Balushi for Wed 9 Jul at 10:00 AM.',
        time: '9:41 AM',
        unread: true
    },
    {
        id: 3,
        icon: '💳',
        iconBg: '#4B6EF515',
        title: 'Payment Authorized',
        description: 'OMR 17.985 authorized via Bank of Muscat card ****4521. Charged after completion.',
        time: '9:42 AM',
        unread: false
    }
]

const STATIC_EARLIER_NOTIFS = [
    {
        id: 4,
        icon: '⭐',
        iconBg: '#F59E0B15',
        title: 'Rate your recent service',
        description: 'How was your Electrical Repair with Khalid Al-Farsi? Share your experience!',
        time: 'Yesterday'
    },
    {
        id: 5,
        icon: '🎁',
        iconBg: '#D61CA815',
        title: '☀️ Summer AC Deal — 20% Off',
        description: 'Use code SUMMER20 for 20% off any AC service this week. Valid until Jul 31.',
        time: '8 Jul'
    },
    {
        id: 6,
        icon: '✅',
        iconBg: '#10B98115',
        title: 'Service Completed — #UO-4598',
        description: 'Electrical Repair with Khalid Al-Farsi is complete. OMR 23.000 charged.',
        time: '7 Jul'
    }
]

export default function NotificationsPage() {
    const navigate = useNavigate()
    const [todayNotifications, setTodayNotifications] = useState(STATIC_TODAY_NOTIFS)

    const handleMarkAllRead = () => {
        setTodayNotifications(prev => prev.map(notif => ({ ...notif, unread: false })))
    }

    return (
        <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>

            {/* Outer Layout Frame Container preserving matching left and right spaces across views */}
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>

                    {/* Notifications Title Header Row Component */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ font: '600 24px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-.8px' }}>
                            Notifications
                        </div>

                        <div style={{ display: 'flex', gap: '9px' }}>
                            <button
                                onClick={handleMarkAllRead}
                                style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '9px', padding: '7px 16px', font: '600 12px/1 "DM Sans", sans-serif', color: '#D61CA8', cursor: 'pointer', outline: 'none' }}
                            >
                                Mark all read
                            </button>
                            <button onClick={() => navigate('/Settings')} style={{ background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '9px', padding: '7px 16px', font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer', outline: 'none' }}>
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* ── TODAY TIMELINE SECTION ── */}
                    <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
                        Today
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {todayNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                style={{
                                    background: notif.unread ? 'rgba(214,28,168,.02)' : 'white',
                                    border: notif.unread ? '1.5px solid rgba(214,28,168,.15)' : '1.5px solid #F0F0F0',
                                    borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '13px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {/* Circle Avatar Status Node wrapper */}
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: notif.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                                    {notif.icon}
                                </div>

                                {/* Main Content Notification Block */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                                        {notif.title}
                                    </div>
                                    <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                                        {notif.description}
                                    </div>
                                </div>

                                {/* Right Spacing Parameters & Read/Unread Dots indicator */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', whiteSpace: 'nowrap' }}>
                                        {notif.time}
                                    </span>
                                    {notif.unread && (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D61CA8' }}></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── EARLIER TIMELINE SECTION ── */}
                    <div style={{ font: '700 12px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
                        Earlier
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {STATIC_EARLIER_NOTIFS.map((notif) => (
                            <div
                                key={notif.id}
                                style={{ background: 'white', border: '1.5px solid #F0F0F0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '13px' }}
                            >
                                {/* Circle Avatar Node Frame */}
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: notif.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                                    {notif.icon}
                                </div>

                                {/* Content Block */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                                        {notif.title}
                                    </div>
                                    <div style={{ font: '400 12px/1.5 "DM Sans", sans-serif', color: '#6B7280' }}>
                                        {notif.description}
                                    </div>
                                </div>

                                <span style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    {notif.time}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}