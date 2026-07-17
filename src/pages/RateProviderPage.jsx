import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API_BASE_URL from '@/config/api'

// Static options matching the metadata in your HTML code layout block
const STATIC_TAGS = [
  'Punctual',
  'Professional',
  'Thorough',
  'Friendly',
  'Fixed first time',
  'Clean workspace',
  'Good communication',
  'Fair pricing'
]

const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)'

export default function RateProviderPage() {
  const navigate = useNavigate()
  
  // Extracts the specific dynamic identifier from your path parameters (e.g. /bookings/:bookingId/rate)
  const { bookingId } = useParams()

  // Dynamic booking metadata state variables
  const [bookingDetails, setBookingDetails] = useState(null)
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true)

  // Interactive local states for tracking review completion configurations
  const [ratingScore, setSelectedRatingScore] = useState(5)
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Professional', 'Thorough', 'Friendly'])
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 1. Fetch live booking details on mount to populate profile metadata dynamically
  useEffect(() => {
    const fetchCurrentBookingMetadata = async () => {
      const activeBookingId = bookingId || '1'
      // Hits your endpoint list filtering by the target ID
      const targetUrl = `${API_BASE_URL}/services/bookings/?id=${activeBookingId}`
      const authToken = localStorage.getItem('customer_token') || localStorage.getItem('access_token') || localStorage.getItem('access')

      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Authorization': authToken ? `Bearer ${authToken}` : '',
            'Content-Type': 'application/json'
          }
        })
        const resData = await response.json()

        if (response.ok && resData.status === 'success') {
          // Finds the specific item match from your structured array data list
          const foundItem = resData.data.find(b => String(b.id) === String(activeBookingId)) || resData.data[0]
          if (foundItem) {
            setBookingDetails(foundItem)
            // Seeds optional default comment dynamically based on data values
            setReviewText(`${foundItem.professional_name || 'The professional'} arrived on time and resolved the ${foundItem.service_name || 'issue'} thoroughly. Great experience!`)
          }
        }
      } catch (err) {
        console.error('❌ Failed loading booking metadata context:', err)
      } finally {
        setIsLoadingMetadata(false)
      }
    }

    fetchCurrentBookingMetadata()
  }, [bookingId])

  const toggleFeedbackTagAction = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleReviewSubmission = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    const activeBookingId = bookingId || '1'
    const targetUrl = `${API_BASE_URL}/services/bookings/${activeBookingId}/rate/`
    const authToken = localStorage.getItem('customer_token') || localStorage.getItem('access_token') || localStorage.getItem('access')

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : ''
        },
        body: JSON.stringify({
          rating: ratingScore,
          review_text: reviewText,
          tags: selectedTags
        })
      })

      const responseData = await response.json()

      if (response.ok) {
        console.log('✅ Review saved:', responseData)
        navigate('/MyBookings')
      } else {
        setErrorMessage(responseData?.message || responseData?.error || 'Failed to submit review.')
      }
    } catch (err) {
      console.error('❌ Network Error:', err)
      setErrorMessage('Network connection failure. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingDescriptionLabel = (score) => {
    if (score === 5) return 'Excellent!'
    if (score === 4) return 'Good!'
    if (score === 3) return 'Average'
    if (score === 2) return 'Poor'
    return 'Very Bad'
  }

  // Derived fallbacks extracted from your unified API response schema fields 
  const professionalName = bookingDetails?.professional_name || 'Professional'
  const serviceName = bookingDetails?.service_name || 'Service'
  const locationName = bookingDetails?.location || 'Location'
  const avatarLetter = professionalName.charAt(0).toUpperCase()

  return (
    <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }} className="rp-page">
      <style>{`
        @media (max-width: 768px) {
          .rp-page { padding: 16px 0 !important; }
          .rp-outer { padding: 0 16px !important; }
          .rp-card { padding: 18px !important; border-radius: 16px !important; }
          .rp-header { padding: 16px !important; }
          .rp-stars span { font-size: 34px !important; }
          .rp-photos > div { width: 64px !important; height: 64px !important; }
        }
        @media (max-width: 420px) {
          .rp-stars { gap: 6px !important; }
          .rp-stars span { font-size: 28px !important; }
          .rp-actions { flex-direction: column !important; }
        }
      `}</style>
      
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} className="rp-outer">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          
          {/* Professional Provider Profile Header Block - Fully Dynamic */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,.07)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '16px' }} className="rp-header">
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 24px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
              {isLoadingMetadata ? '...' : avatarLetter}
            </div>
            <div>
              <div style={{ font: '600 18px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '5px' }}>
                {isLoadingMetadata ? 'Loading info...' : `Rate ${professionalName}`}
              </div>
              <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>
                {isLoadingMetadata ? 'Fetching booking details...' : `${serviceName} · ${locationName}`}
              </div>
            </div>
          </div>

          {/* Central Interactive Feedback Core Wrapper */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,.07)', marginBottom: '16px' }} className="rp-card">
            
            {errorMessage && (
              <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: '500' }}>
                {errorMessage}
              </div>
            )}

            {/* Interactive Star Scale Module */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '16px' }}>How was the service?</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }} className="rp-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setSelectedRatingScore(star)}
                    style={{
                      fontSize: '42px', cursor: 'pointer', userSelect: 'none', transition: 'all 0.1s ease',
                      color: star <= ratingScore ? '#F59E0B' : '#EBEBEF',
                      filter: star <= ratingScore ? 'drop-shadow(0 2px 4px rgba(245,158,11,.3))' : 'none'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div style={{ font: '700 18px/1 "DM Sans", sans-serif', color: '#F59E0B', marginTop: '10px' }}>
                {getRatingDescriptionLabel(ratingScore)}
              </div>
            </div>

            {/* Quick Feedback Feature Tag Grid */}
            <div style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '11px' }}>What went well?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {STATIC_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <div
                    key={tag}
                    onClick={() => toggleFeedbackTagAction(tag)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s ease',
                      background: isSelected ? 'rgba(214,28,168,.08)' : '#F8F8FA',
                      border: isSelected ? '1.5px solid rgba(214,28,168,.25)' : '1.5px solid #EBEBEF',
                      font: isSelected ? '700 12px/1 "DM Sans", sans-serif' : '500 12px/1 "DM Sans", sans-serif',
                      color: isSelected ? '#D61CA8' : '#0A0A0F'
                    }}
                  >
                    {tag}
                  </div>
                )
              })}
            </div>

            {/* Optional Description Textbox area */}
            <div style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '9px' }}>Write a review (optional)</div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '13px', padding: '14px', height: '90px', font: '400 13px/1.6 "DM Sans", sans-serif', color: '#0A0A0F', outline: 'none', resize: 'none' }}
            />

            {/* Optional Photo Attachment Slots */}
            <div style={{ font: '600 12px/1 "DM Sans", sans-serif', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '.6px', marginTop: '20px', marginBottom: '9px' }}>Add Photo (optional)</div>
            <div style={{ display: 'flex', gap: '9px', marginBottom: '20px' }} className="rp-photos">
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}>📷</div>
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}></div>
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}></div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '12px' }} className="rp-actions">
              <button 
                onClick={() => navigate('/MyBookings')}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '12px', textAlign: 'center', font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer', outline: 'none' }}
              >
                Skip
              </button>
              <button 
                onClick={handleReviewSubmission}
                disabled={isSubmitting}
                style={{ flex: 2, padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer', border: 'none', outline: 'none', boxShadow: '0 4px 14px rgba(214,28,168,.35)', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}