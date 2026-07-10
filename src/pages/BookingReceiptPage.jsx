import { useNavigate } from 'react-router-dom'

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function BookingReceiptPage() {
    const navigate = useNavigate()

    const handleDownloadPdfAction = () => {
        window.print()
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
                            #UO-4601 — Receipt
                        </div>
                        <button
                            onClick={handleDownloadPdfAction}
                            style={{ padding: '7px 16px', background: BRAND_GRADIENT, borderRadius: '9px', font: '700 12px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                        >
                            Download PDF
                        </button>
                    </div>

                    {/* Central Receipt Sheet White Layout Box */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} className="rc-card">

                        {/* Brand Logo and Title Context Subheader */}
                        <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #EBEBEF', marginBottom: '24px' }}>
                            <img src="../../public/image 672.png" style={{ height: '24px', marginBottom: '12px' }} alt="UniteOman Logo" />
                            <div style={{ font: '600 22px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>Service Receipt</div>
                            <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Booking #UO-4601 · Wed 9 Jul 2026</div>
                        </div>

                        {/* Split Matrix Service Meta Parameters Info Blocks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }} className="rc-grid">
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Service</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>AC Deep Cleaning</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Professional</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Mohammed Al-Balushi</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Date</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Wednesday, 9 Jul 2026</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Time</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>10:00 AM – 10:47 AM</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Address</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Villa 12, Al Noor St, Qurum</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Duration</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>47 minutes</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Payment</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Bank of Muscat ****4521</div>
                            </div>
                            <div>
                                <div style={{ font: '500 10px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Status</div>
                                <div style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Completed ✓</div>
                            </div>
                        </div>

                        {/* Financial Ledger Item Breakdown Segment */}
                        <div style={{ background: '#F4F5F8', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                            <div style={{ font: '700 13px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '14px' }}>Price Breakdown</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Service fee</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR 15.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>Platform fee (10%)</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR 1.500</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EBEBEF' }}>
                                <span style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>VAT (9%)</span>
                                <span style={{ font: '600 13px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>OMR 1.485</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                                <span style={{ font: '700 15px/1 "DM Sans", sans-serif', color: '#0A0A0F' }}>Total Paid</span>
                                <span style={{ font: '800 20px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>OMR 17.985</span>
                            </div>
                        </div>

                        {/* Bottom Interactivity Workflow Routing Triggers */}
                        <div style={{ display: 'flex', gap: '12px' }} className="rc-actions">
                            <button
                                onClick={() => navigate(`/rate/provider?id=4601`)}
                                style={{ flex: 1, padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none' }}
                            >
                                ⭐ Rate Mohammed
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