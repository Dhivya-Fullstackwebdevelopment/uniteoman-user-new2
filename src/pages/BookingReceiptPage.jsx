import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'
const API_BASE_URL = 'http://127.0.0.1:8000/api'

export default function BookingReceiptPage() {
    const navigate = useNavigate()
    const { bookingId } = useParams()

    // Default to booking id = 1 if none is passed via route params
    const activeBookingId = bookingId || 1

    const [receipt, setReceipt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [downloading, setDownloading] = useState(false)

    // Fetch receipt data on mount
    useEffect(() => {
        const fetchReceipt = async () => {
            setLoading(true)
            setError('')
            try {
                const token = localStorage.getItem('customer_token')
                const response = await axios.get(
                    `${API_BASE_URL}/services/bookings/${activeBookingId}/receipt/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.data && response.data.status === 'success') {
                    setReceipt(response.data.data)
                } else {
                    setError(response.data?.message || 'Failed to load receipt.')
                }
            } catch (err) {
                console.error('Receipt fetch error:', err)
                setError(err.response?.data?.message || 'Something went wrong loading the receipt.')
            } finally {
                setLoading(false)
            }
        }

        fetchReceipt()
    }, [activeBookingId])

    // Download the PDF with the auth token, instead of window.print()
    const handleDownloadPdfAction = async () => {
        setDownloading(true)
        setError('')
        try {
            const token = localStorage.getItem('customer_token')
            const response = await axios.get(
                `${API_BASE_URL}/services/bookings/${activeBookingId}/receipt/pdf/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'blob' // critical for binary PDF data
                }
            )

            // Create a temporary link to trigger the browser's download dialog
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Invoice_${receipt?.booking_number || activeBookingId}.pdf`
            )
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('PDF download error:', err)
            setError('Failed to download PDF receipt. Please try again.')
        } finally {
            setDownloading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ background: '#F4F5F8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
                <div style={{ font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Loading receipt...</div>
            </div>
        )
    }

    if (error && !receipt) {
        return (
            <div style={{ background: '#F4F5F8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif', gap: '12px' }}>
                <div style={{ font: '600 14px/1 "DM Sans", sans-serif', color: '#EF4444' }}>{error}</div>
                <div
                    onClick={() => navigate(-1)}
                    style={{ padding: '8px 16px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '9px', font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}
                >
                    ← Back to Bookings
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }} className="rc-page">
            <style>{`
                @media (max-width: 768px) {
                    .rc-page { padding: 16px 0 !important; }
                    .rc-outer { padding: 0 16px !important; }
                    .rc-card { padding: 18px !important; border-radius: 16px !important; }
                    .rc-header { flex-wrap: wrap !important; gap: 8px !important; }
                    .rc-header-title { flex-basis: 100% !important; order: 3 !important; }
                    .rc-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
                    .rc-actions { flex-direction: column !important; }
                }
            `}</style>

            {/* Outer Layout Alignment Container preserving maximum wide desktop side padding bounds */}
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', boxSizing: 'border-box' }} className="rc-outer">
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>

                    {/* Action Navigation Header Panel */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }} className="rc-header">
                        <div
                            onClick={() => navigate(-1)}
                            style={{ padding: '6px 14px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '9px', font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer', userSelect: 'none' }}
                        >
                            ← Back to Bookings
                        </div>
                        <div style={{ flex: 1, font: '700 18px/1 "DM Sans", sans-serif', color: '#0A0A0F' }} className="rc-header-title">
                            #{receipt?.booking_number} — Receipt
                        </div>
                        <button
                            onClick={handleDownloadPdfAction}
                            disabled={downloading}
                            style={{ padding: '7px 16px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 12px/1 "DM Sans", sans-serif', color: 'white', cursor: downloading ? 'not-allowed' : 'pointer', border: 'none', outline: 'none', opacity: downloading ? 0.7 : 1 }}
                        >
                            {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>

                    {error && (
                        <div style={{ color: '#EF4444', font: '500 12px/1.4 "DM Sans", sans-serif', marginBottom: '12px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* Central Receipt Sheet White Layout Box */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} className="rc-card">

                        {/* Brand Logo and Title Context Subheader */}
                        <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #EBEBEF', marginBottom: '24px' }}>
                            <img src="../../public/image 672.png" style={{ height: '24px', marginBottom: '12px' }} alt="UniteOman Logo" />
                            <div style={{ font: '600 22px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>Service Receipt</div>
                            <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                                Booking #{receipt?.booking_number} · {receipt?.booking_date}
                            </div>
                        </div>

                        {/* Split Matrix Service Meta Parameters Info Blocks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }} className="rc-grid">
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Service</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.service_name}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Professional</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.professional}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Scheduled</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.scheduled_at}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Duration</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.duration_minutes} minutes</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Location</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.location}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Address</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.address}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Payment</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.payment_method}</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Status</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>{receipt?.status}</div>
                            </div>
                        </div>

                        {/* Financial Ledger Item Breakdown Segment */}
                        <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Price Breakdown</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Service fee</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR {receipt?.service_fee}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Platform fee</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR {receipt?.platform_fee}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>VAT</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR {receipt?.vat}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                                <span style={{ font: '700 15px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Total Paid</span>
                                <span style={{ font: '800 20px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR {receipt?.total_paid}</span>
                            </div>
                        </div>

                        {/* Bottom Interactivity Workflow Routing Triggers */}
                        <div style={{ display: 'flex', gap: '12px' }} className="rc-actions">
                            <button
                                onClick={() => navigate(`/rate/provider?id=${activeBookingId}`)}
                                style={{ flex: 1, padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                            >
                                ⭐ Rate {receipt?.professional?.split(' ')[0] || 'Provider'}
                            </button>
                            <button
                                onClick={() => navigate('/businesses?category=ac-service')}
                                style={{ flex: 1, padding: '13px', background: 'white', border: '1.5px solid #EBEBEF', borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: '#0A0A0F', cursor: 'pointer', outline: 'none' }}
                            >
                                🔁 Book Again
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}