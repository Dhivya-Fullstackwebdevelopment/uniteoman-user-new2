import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API_BASE_URL from '@/config/api'
import CancelBookingModal from '../components/Popups/CancelBookingModal'
import RescheduleBookingModal from '../components/Popups/RescheduleBookingModal'
import BookAgainModal from '../components/Popups/BookingAgainModal'


const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function MyBookingsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('upcoming')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [counts, setCounts] = useState({
        upcoming: 0,
        ongoing: 0,
        completed: 0,
        cancelled: 0
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null)
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
    const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null)
    const [isBookAgainModalOpen, setIsBookAgainModalOpen] = useState(false)
    const [selectedBookingForRebook, setSelectedBookingForRebook] = useState(null)
    const [bookAgainResult, setBookAgainResult] = useState(null)
    const [isBookAgainLoading, setIsBookAgainLoading] = useState(false)

    // Get token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('customer_token')
    }

    // Fetch bookings from API
    const fetchBookings = async (filter = 'upcoming') => {
        try {
            setLoading(true)
            const token = getAuthToken()

            if (!token) {
                setError('Please login to view bookings')
                toast.error('Please login to view bookings')
                navigate('/customer/login')
                return
            }

            const response = await fetch(`${API_BASE_URL}/services/bookings/?filter=${filter}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('customer_token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('customerUser')
                    toast.error('Session expired. Please login again.')
                    navigate('/customer/login')
                    return
                }
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch bookings')
            }

            const data = await response.json()

            if (data.status === 'success') {
                setBookings(data.data)
                // Update counts based on actual data
                updateCounts(data.data)
            } else {
                throw new Error(data.message || 'Failed to fetch bookings')
            }
        } catch (err) {
            setError(err.message)
            toast.error(err.message || 'Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    // Update counts based on bookings data
    const updateCounts = (bookingsData) => {
        const counts = {
            upcoming: 0,
            ongoing: 0,
            completed: 0,
            cancelled: 0,
        }

        bookingsData.forEach((booking) => {
            const status = (booking.status_code || booking.status || "").toUpperCase()

            if (
                status === "SCHEDULED" ||
                status === "PENDING" ||
                status === "CONFIRMED"
            ) {
                counts.upcoming++
            } else if (
                status === "EN_ROUTE" ||
                status === "ARRIVED" ||
                status === "IN_PROGRESS"
            ) {
                counts.ongoing++
            } else if (status === "COMPLETED") {
                counts.completed++
            } else if (status === "CANCELLED") {
                counts.cancelled++
            }
        })

        setCounts(counts)
    }

    const openCancelConfirmation = (booking) => {
        setSelectedBookingForCancel(booking)
        setIsModalOpen(true)
    }

    // Triggered directly when confirm action completes within the pop-up modal sandbox
    const handleConfirmCancelAPI = async () => {
        if (!selectedBookingForCancel) return;

        try {
            const token = getAuthToken();

            const response = await fetch(
                `${API_BASE_URL}/professionals/bookings/${selectedBookingForCancel.id}/cancel/`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel booking');
            }

            toast.success(data.message || 'Booking cancelled successfully');
            fetchBookings(activeTab);
        } catch (err) {
            toast.error(err.message);
            throw err; // Important
        }
    };

    const openBookAgainModal = (booking) => {
        setSelectedBookingForRebook(booking)
        setBookAgainResult(null)
        setIsBookAgainModalOpen(true)
    }

    const handleConfirmBookAgain = async () => {
        if (!selectedBookingForRebook) return

        try {
            setIsBookAgainLoading(true)
            const token = getAuthToken()
            const response = await fetch(
                `${API_BASE_URL}/professionals/bookings/${selectedBookingForRebook.id}/book-again/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to rebook')
            }

            const data = await response.json()
            setBookAgainResult(data)
            toast.success(data.message || 'Booking reactivated successfully')
            fetchBookings(activeTab)
        } catch (err) {
            toast.error(err.message || 'Failed to rebook')
        } finally {
            setIsBookAgainLoading(false)
        }
    }

    const closeBookAgainModal = () => {
        setIsBookAgainModalOpen(false)
        setSelectedBookingForRebook(null)
        setBookAgainResult(null)
    }

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab)
        fetchBookings(tab)
    }

    // Initial fetch
    useEffect(() => {
        fetchBookings('upcoming')
    }, [])

    // Get status badge color
    const getStatusBadgeStyle = (status) => {
        const statusMap = {
            'SCHEDULED': { bg: '#EDE9FE', color: '#8B2EF5', label: 'Scheduled' },
            'PENDING': { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
            'CONFIRMED': { bg: '#DBEAFE', color: '#2563EB', label: 'Confirmed' },
            'EN_ROUTE': { bg: '#DBEAFE', color: '#2563EB', label: 'En Route' },
            'ARRIVED': { bg: '#D1FAE5', color: '#059669', label: 'Arrived' },
            'IN_PROGRESS': { bg: '#FEF3C7', color: '#D97706', label: 'In Progress' },
            'COMPLETED': { bg: '#D1FAE5', color: '#059669', label: 'Completed' },
            'CANCELLED': { bg: '#FEE2E2', color: '#EF4444', label: 'Cancelled' },
        }
        return statusMap[status] || { bg: '#F4F5F8', color: '#9090A0', label: status }
    }

    // Get icon for service type
    const getServiceIcon = (serviceName) => {
        const iconMap = {
            'AC': '❄️',
            'Deep Cleaning': '🧹',
            'Cleaning': '🧹',
            'Electrical': '⚡',
            'Plumbing': '🔧',
            'Installation': '🔧',
            'Repair': '🔧',
            'Gas': '🔥',
            'Filling': '💨'
        }
        for (const [key, icon] of Object.entries(iconMap)) {
            if (serviceName?.includes(key)) {
                return icon
            }
        }
        return '🛠️'
    }

    // Get icon background color
    const getIconBg = (serviceName) => {
        if (serviceName?.includes('AC')) return '#DBEAFE'
        if (serviceName?.includes('Cleaning')) return '#D1FAE5'
        if (serviceName?.includes('Electrical')) return '#FEF3C7'
        if (serviceName?.includes('Plumbing')) return '#CFFAFE'
        return '#F4F5F8'
    }

    // Navigate to receipt
    const handleViewReceipt = (bookingId) => {
        navigate(`/Booking/Receipt?bookingId=${bookingId}`)
    }

    // Navigate to track live
    const handleTrackLive = (bookingId) => {
        navigate(`/Booking/Track?bookingId=${bookingId}`)
    }

    // Navigate to rate
    const handleRate = (bookingId, professionalName) => {
        navigate(`/Booking/Rating/?bookingId=${bookingId}`)
    }

    const openRescheduleModal = (booking) => {
        setSelectedBookingForReschedule(booking)
        setIsRescheduleModalOpen(true)
    }

    const handleConfirmReschedule = async (newDate, newTime) => {
        if (!selectedBookingForReschedule) return

        try {
            const token = getAuthToken()
            const response = await fetch(
                `${API_BASE_URL}/professionals/bookings/${selectedBookingForReschedule.id}/reschedule/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        booking_date: newDate,   // e.g. "2026-07-25"
                        booking_time: newTime,   // e.g. "18:00"
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to reschedule booking')
            }

            toast.success('Booking rescheduled successfully')
            setIsRescheduleModalOpen(false)
            fetchBookings(activeTab)
        } catch (err) {
            toast.error(err.message || 'Failed to reschedule booking')
        }
    }

    // Handle cancel booking
    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return
        }

        try {
            const token = getAuthToken()
            const response = await fetch(`${API_BASE_URL}/professionals/bookings/${bookingId}/cancel/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to cancel booking')
            }

            toast.success('Booking cancelled successfully')
            // Refresh the list
            fetchBookings(activeTab)
        } catch (err) {
            toast.error(err.message || 'Failed to cancel booking')
        }
    }

    // Loading state
    if (loading) {
        return (
            <div style={{ background: '#F8F8FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #EBEBEF',
                        borderTop: '4px solid #D61CA8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#9090A0', fontSize: '14px' }}>Loading your bookings...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        )
    }

    // Error state
    if (error && bookings.length === 0) {
        return (
            <div style={{ background: '#F8F8FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <h3 style={{ color: '#0A0A0F', marginBottom: '8px' }}>No Bookings Found</h3>
                    <p style={{ color: '#9090A0', marginBottom: '16px' }}>{error}</p>
                    <button
                        onClick={() => fetchBookings(activeTab)}
                        style={{
                            padding: '10px 24px',
                            background: BRAND_GRADIENT,
                            borderRadius: '9px',
                            border: 'none',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Total count
    const totalCount = bookings.length

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
                    
                    .mb-booking-row { flex-direction: column; align-items: flex-start !important; gap: 14px !important; }
                    .mb-booking-content { min-width: 100% !important; }
                    
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

            <div className="mb-outer">
                <div className="mb-card">
                    <div style={{ font: '600 26px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1px', marginBottom: '4px' }}>
                        My Bookings
                    </div>
                    <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '20px' }}>
                        {totalCount} total bookings
                    </div>

                    {/* Tabs */}
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0', background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 1px 5px rgba(0,0,0,.06)', width: 'fit-content' }} className="mb-tabs">
                        <div
                            onClick={() => handleTabChange('upcoming')}
                            style={{ padding: '10px 22px', background: activeTab === 'upcoming' ? BRAND_GRADIENT : 'transparent', font: '700 12px/1 "DM Sans", sans-serif', color: activeTab === 'upcoming' ? 'white' : '#9090A0', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Upcoming {activeTab === 'upcoming' && `(${counts.upcoming})`}
                        </div>

                        <div
                            onClick={() => handleTabChange('ongoing')}
                            style={{ padding: '10px 22px', background: activeTab === 'ongoing' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'ongoing' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'ongoing' ? 'white' : '#9090A0', cursor: 'pointer' }}
                        >
                            Ongoing {activeTab === 'ongoing' && `(${counts.ongoing})`}
                        </div>

                        <div
                            onClick={() => handleTabChange('completed')}
                            style={{ padding: '10px 22px', background: activeTab === 'completed' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'completed' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'completed' ? 'white' : '#9090A0', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Completed {activeTab === 'completed' && `(${counts.completed})`}
                        </div>

                        <div
                            onClick={() => handleTabChange('cancelled')}
                            style={{ padding: '10px 22px', background: activeTab === 'cancelled' ? BRAND_GRADIENT : 'transparent', font: activeTab === 'cancelled' ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif', color: activeTab === 'cancelled' ? 'white' : '#9090A0', cursor: 'pointer' }}
                        >
                            Cancelled {activeTab === 'cancelled' && `(${counts.cancelled})`}
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {bookings.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1.5px solid #EBEBEF', color: '#9090A0', font: '400 13px/1 "DM Sans", sans-serif' }}>
                                No bookings found in this category.
                            </div>
                        ) : (
                            bookings.map((booking) => {
                                const bookingStatus = (
                                    booking.status_code ||
                                    booking.status ||
                                    ''
                                ).toUpperCase()

                                const statusInfo = getStatusBadgeStyle(bookingStatus)

                                const icon = getServiceIcon(booking.service_name)
                                const iconBg = getIconBg(booking.service_name)

                                const isUpcoming =
                                    bookingStatus === 'SCHEDULED' ||
                                    bookingStatus === 'PENDING' ||
                                    bookingStatus === 'CONFIRMED'

                                const isOngoing =
                                    bookingStatus === 'EN_ROUTE' ||
                                    bookingStatus === 'ARRIVED' ||
                                    bookingStatus === 'IN_PROGRESS'

                                const isCompleted = bookingStatus === 'COMPLETED'

                                const isCancelled = bookingStatus === 'CANCELLED'

                                return (
                                    <div key={booking.id} className="mb-booking-row">
                                        {/* Icon */}
                                        <div style={{ width: '52px', height: '52px', background: iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                                            {icon}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }} className="mb-booking-content">
                                            <div style={{ font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>
                                                {booking.service_name}
                                            </div>
                                            <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '4px' }}>
                                                {booking.professional_name} · {booking.date_time}
                                            </div>
                                            <div style={{ font: '400 12px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                                                📍 {booking.location}
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }} className="mb-booking-price">
                                            <div style={{ textAlign: 'right' }} className="mb-price-info">
                                                <div style={{ font: '700 16px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '6px' }}>
                                                    OMR {booking.price}
                                                </div>
                                                <div style={{ padding: '3px 10px', background: statusInfo.bg, borderRadius: '6px', font: '700 9px/1 "DM Sans", sans-serif', color: statusInfo.color, display: 'inline-block' }}>
                                                    {statusInfo.label}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }} className="mb-booking-actions">
                                                {isOngoing && (
                                                    <button
                                                        onClick={() => handleTrackLive(booking.id)}
                                                        style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', border: 'none', cursor: 'pointer', outline: 'none' }}
                                                    >
                                                        Track Live
                                                    </button>
                                                )}
                                                {isUpcoming && (
                                                    <>
                                                        <div
                                                            onClick={() => openRescheduleModal(booking)}
                                                            style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                                                        >
                                                            Reschedule
                                                        </div>
                                                        <div onClick={() => openCancelConfirmation(booking)} style={{ padding: '6px 13px', background: '#FEE2E2', border: '1.5px solid #FECACA', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#EF4444', cursor: 'pointer' }}>
                                                            Cancel
                                                        </div>
                                                    </>
                                                )}
                                                {isCompleted && (
                                                    <>
                                                        <div
                                                            onClick={() => handleRate(booking.id, booking.professional_name)}
                                                            style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                                                        >
                                                            Rate
                                                        </div>
                                                        <div
                                                            onClick={() => navigate('/categories')}
                                                            style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                                                        >
                                                            Rebook
                                                        </div>
                                                        <div
                                                            onClick={() => handleViewReceipt(booking.id)}
                                                            style={{ padding: '6px 13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '8px', font: '600 11px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer' }}
                                                        >
                                                            Receipt
                                                        </div>
                                                    </>
                                                )}
                                                {isCancelled && (
                                                    <div
                                                        onClick={() => openBookAgainModal(booking)} rof
                                                        style={{ padding: '6px 13px', background: BRAND_GRADIENT, borderRadius: '8px', font: '700 11px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer' }}
                                                    >
                                                        Book Again
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
            <CancelBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancelAPI}
                bookingNumber={selectedBookingForCancel?.booking_number}
            />
            <RescheduleBookingModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onConfirm={handleConfirmReschedule}
                booking={selectedBookingForReschedule}
            />
            <BookAgainModal
                isOpen={isBookAgainModalOpen}
                onClose={closeBookAgainModal}
                onConfirm={handleConfirmBookAgain}
                booking={selectedBookingForRebook}
                result={bookAgainResult}
                isLoading={isBookAgainLoading}
            />
        </div>
    )
}