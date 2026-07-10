import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Comprehensive local static collection of your historical and upcoming bookings
const ALL_BOOKINGS = [
    { id: 1, type: 'AC Deep Cleaning', provider: 'Mohammed Al-Balushi', date: 'Wed 9 Jul', time: '10:00 AM', location: 'Qurum', cost: 'OMR 17.985', status: 'Upcoming', label: 'En Route', labelBg: '#DBEAFE', labelColor: '#2563EB', icon: '❄️', iconBg: '#DBEAFE' },
    { id: 2, type: 'Home Deep Cleaning', provider: 'Fatima Al-Zaabi', date: 'Fri 11 Jul', time: '3:00 PM', location: 'Al Khuwair', cost: 'OMR 52.000', status: 'Upcoming', label: 'Scheduled', labelBg: '#EDE9FE', labelColor: '#8B2EF5', icon: '🧹', iconBg: '#D1FAE5' },
    { id: 3, type: 'Electrical Repair', provider: 'Khalid Al-Farsi', date: 'Mon 7 Jul', time: '11:00 AM', location: 'Bowsher', cost: 'OMR 23.000', status: 'Completed', label: 'Completed', labelBg: '#D1FAE5', labelColor: '#059669', icon: '⚡', iconBg: '#FEF3C7' },
    { id: 4, type: 'Plumbing Repair', provider: 'Salim Al-Habsi', date: 'Sat 5 Jul', time: '2:00 PM', location: 'Qurum', cost: 'OMR 16.100', status: 'Completed', label: 'Completed', labelBg: '#D1FAE5', labelColor: '#059669', icon: '🔧', iconBg: '#CFFAFE' }
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function MyBookingsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Upcoming')

    // Group items by filter metrics to dynamically track tab item totals
    const totalCount = ALL_BOOKINGS.length + 46 // Replicating your explicit '50 total bookings' view logic
    const upcomingList = ALL_BOOKINGS.filter(b => b.status === 'Upcoming')
    const completedList = ALL_BOOKINGS.filter(b => b.status === 'Completed')
    const ongoingCount = 1
    const cancelledCount = 3

    // Determine what sublist needs display based on active configuration pointer
    const displayedBookings = activeTab === 'Upcoming' ? upcomingList : activeTab === 'Completed' ? completedList : []

    return (
        <div style={{ background: '#F8F8FA', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }} className="mb-page">
            <style>{`
                .mb-outer {
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 0 56px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .mb-card {
                    background: #F4F5F8;
                    padding: 28px 56px;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,.02);
                }
                .mb-booking-row {
                    background: white;
                    border-radius: 16px;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,.06);
                    border: 1.5px solid #EBEBEF;
                }

                @media (max-width: 992px) {
                    .mb-outer { padding: 0 24px !important; }
                    .mb-card { padding: 24px !important; }
                }

                @media (max-width: 768px) {
                    .mb-page { padding: 16px 0 !important; }
                    .mb-outer { padding: 0 12px !important; }
                    .mb-card { padding: 20px 14px !important; }
                    .mb-tabs { width: 100% !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none; }
                    .mb-tabs::-webkit-scrollbar { display: none; }
                    .mb-tabs > div { padding: 10px 16px !important; white-space: nowrap !important; flex: 1; text-align: center; }
                    
                    /* Force responsive stacking order */
                    .mb-booking-row { flex-direction: column; align-items: flex-start !important; gap: 14px !important; }
                    .mb-booking-content { min-width: 100% !important; }
                    
                    /* Restructure price block to match images exactly on mobile */
                    .mb-booking-price { 
                        width: 100% !important; 
                        flex-direction: column !important;
                        align-items: stretch !important;
                        text-align: left !important;
                    }
                    .mb-price-info {
                        display: flex !important;
                        flex-direction: row !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        width: 100% !important;
                    }
                    
                    /* Separator block styling */
                    .mb-booking-actions { 
                        justify-content: flex-start !important; 
                        flex-wrap: wrap !important; 
                        margin-top: 12px !important; 
                        width: 100% !important; 
                        border-top: 1.5px solid #F4F5F8;
                        padding-top: 12px;
                    }
                    .mb-booking-actions div, .mb-booking-actions button { 
                        flex: 1; 
                        text-align: center !important; 
                        white-space: nowrap; 
                    }
                }
            `}</style>

            {/* Outer Layout Alignment Framework preserving exact left and right spaces across application screens */}
            <div className="mb-outer">
                <div className="mb-card">

                    <div style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1px', marginBottom: '4px' }}>
                        My Bookings
                    </div>
                    <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '20px' }}>
                        {totalCount} total bookings
                    </div>

                    {/* Interactive Navigation Filter Tabs Bar */}
                    <div style={{ display: 'flex', gap: '0', background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 1px 5px rgba(0,0,0,.06)', width: 'fit-content' }} className="mb-tabs">
                        <div
                            onClick={() => setActiveTab('Upcoming')}
                            style={{ padding: '10px 22px', background: activeTab === 'Upcoming' ? BRAND_GRADIENT : 'transparent', font: '700 12px/1 "DM Sans", sans-serif', color: activeTab === 'Upcoming' ? 'white' : '#9090A0', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Upcoming ({upcomingList.length})
                        </div>
                        <div
                            onClick={() => setActiveTab('Ongoing')}
                            style={{ padding: '10px 22px', background: activeTab === 'Ongoing' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'Ongoing' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'Ongoing' ? 'white' : '#9090A0', cursor: 'pointer' }}
                        >
                            Ongoing ({ongoingCount})
                        </div>
                        <div
                            onClick={() => setActiveTab('Completed')}
                            style={{ padding: '10px 22px', background: activeTab === 'Completed' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'Completed' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'Completed' ? 'white' : '#9090A0', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Completed ({completedList.length + 45})
                        </div>
                        <div
                            onClick={() => setActiveTab('Cancelled')}
                            style={{ padding: '10px 22px', background: activeTab === 'Cancelled' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'Cancelled' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'Cancelled' ? 'white' : '#9090A0', cursor: 'pointer' }}
                        >
                            Cancelled ({cancelledCount})
                        </div>
                    </div>

                    {/* Render Dynamic Bookings Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {displayedBookings.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1.5px solid #EBEBEF', color: '#9090A0', font: '400 13px/1 "DM Sans", sans-serif' }}>
                                No active bookings found in this category section.
                            </div>
                        ) : (
                            displayedBookings.map((booking) => (
                                <div key={booking.id} className="mb-booking-row">
                                    
                                    {/* Category Box Icon Frame */}
                                    <div style={{ width: '52px', height: '52px', background: booking.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '24px', flexShrink: 0, justifyContent: 'center' }}>
                                        {booking.icon}
                                    </div>

                                    {/* Core Content Booking Metadata Details */}
                                    <div style={{ flex: 1 }} className="mb-booking-content">
                                        <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                                            {booking.type}
                                        </div>
                                        <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '4px' }}>
                                            {booking.provider} · {booking.date} · {booking.time}
                                        </div>
                                        <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                                            📍 {booking.location}
                                        </div>
                                    </div>

                                    {/* Pricing metrics and operational workflow action nodes */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }} className="mb-booking-price">
                                        <div style={{ textAlign: 'right' }} className="mb-price-info">
                                            <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                                                {booking.cost}
                                            </div>
                                            <div style={{ padding: '3px 10px', background: booking.labelBg, borderRadius: '6px', font: '700 9px/1 "DM Sans", sans-serif', color: booking.labelColor, display: 'inline-block' }}>
                                                {booking.label}
                                            </div>
                                        </div>

                                        {/* Contextual actions layout options split mapping configuration properties */}
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }} className="mb-booking-actions">
                                            {booking.label === 'En Route' && (
                                                <button
                                                    onClick={() => navigate('/Booking/LiveTracking')}
                                                    style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', border: 'none', cursor: 'pointer', outline: 'none' }}
                                                >
                                                    Track Live
                                                </button>
                                            )}
                                            {booking.label === 'Scheduled' && (
                                                <>
                                                    <div style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>Reschedule</div>
                                                    <div style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>Cancel</div>
                                                </>
                                            )}
                                            {booking.label === 'Completed' && (
                                                <>
                                                    <div onClick={() => navigate('/Booking/Rating')} style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>Rate</div>
                                                    <div style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}>Rebook</div>
                                                    <div
                                                        onClick={() => navigate('/Booking/Receipt')}
                                                        style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                                                    >
                                                        Receipt
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}