import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  // Interactive local states for tracking review completion configurations
  const [ratingScore, setSelectedRatingScore] = useState(5)
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Professional', 'Thorough', 'Friendly'])
  const [reviewText, setReviewText] = useState('Mohammed arrived on time and cleaned the AC unit thoroughly. My room is so much cooler now...')

  const toggleFeedbackTagAction = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleReviewSubmission = () => {
    // Action trigger route forward on submit complete
    navigate('/MyBookings')
  }

  // Text status label tied dynamically to the chosen star metric score
  const getRatingDescriptionLabel = (score) => {
    if (score === 5) return 'Excellent!'
    if (score === 4) return 'Good!'
    if (score === 3) return 'Average'
    if (score === 2) return 'Poor'
    return 'Very Bad'
  }

  return (
    <div style={{ background: '#F4F5F8', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px 0' }}>
      
      {/* Outer Content Base alignment frame mapping explicit horizontal side limits */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          
          {/* Professional Provider Profile Short Header Block */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,.07)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 24px "DM Sans", sans-serif', color: 'white', flexShrink: 0 }}>
              M
            </div>
            <div>
              <div style={{ font: '600 18px/1 "DM Sans", sans-serif', color: '#0A0A0F', marginBottom: '5px' }}>Rate Mohammed</div>
              <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0' }}>AC Deep Cleaning · Wed 9 Jul · Qurum</div>
            </div>
          </div>

          {/* Central Interactive Feedback Core Wrapper */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,.07)', marginBottom: '16px' }}>
            
            {/* Interactive Star Scale Module */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0', marginBottom: '16px' }}>How was the service?</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
            <div style={{ display: 'flex', gap: '9px', marginBottom: '20px' }}>
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}>📷</div>
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}></div>
              <div style={{ width: '72px', height: '72px', background: '#F4F5F8', border: '2px dashed #D0D0D8', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 22px "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer' }}></div>
            </div>

            {/* Form Routing Submission Action Triggers split row */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => navigate('/MyBookings')}
                style={{ flex: 1, padding: '13px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '12px', textAlign: 'center', font: '600 14px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer', outline: 'none' }}
              >
                Skip
              </button>
              <button 
                onClick={handleReviewSubmission}
                style={{ flex: 2, padding: '13px', background: BRAND_GRADIENT, borderRadius: '12px', textAlign: 'center', font: '700 14px/1 "DM Sans", sans-serif', color: 'white', cursor: 'pointer', border: 'none', outline: 'none', boxShadow: '0 4px 14px rgba(214,28,168,.35)' }}
              >
                Submit Review
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}