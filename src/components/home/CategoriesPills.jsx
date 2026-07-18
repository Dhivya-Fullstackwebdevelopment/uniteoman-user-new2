import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '@/config/api'

const CategoriesPills = ({ isMobile = false }) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories?category=${encodeURIComponent(categoryName)}`)
  }

  // Fetch categories from API using Axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/services/`)
        
        // Extract categories from API response
        if (response.data.status === 'success' && response.data.data) {
          setCategories(response.data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err.response?.data?.message || err.message || 'Failed to fetch categories')
        
        // Optional: Show toast notification
        // toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Get first 9 categories for display
  const topCategories = categories.slice(0, 9)

  // Loading state
  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderBottom: '1px solid #EBEBEF',
        padding: isMobile ? '16px 0' : '20px 0',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1300px',
          width: '100%',
          padding: isMobile ? '0 20px' : '0 56px',
          display: 'flex',
          gap: isMobile ? '12px' : '20px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0
              }}
            >
              <div style={{
                width: isMobile ? '44px' : '52px',
                height: isMobile ? '44px' : '52px',
                background: '#F0F0F0',
                borderRadius: '14px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <span style={{
                font: isMobile ? '500 10px/1.2 "DM Sans",sans-serif' : '500 11px/1.2 "DM Sans",sans-serif',
                color: '#F0F0F0',
                textAlign: 'center',
                maxWidth: isMobile ? '50px' : '60px'
              }}>
                Loading...
              </span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    )
  }

  // Error state - show empty state or fallback
  if (error) {
    console.error('Categories error:', error)
    // You can show a fallback UI or empty state
    // For now, we'll just show nothing or you can add a retry button
  }

  // Helper function to get icon
  const getCategoryIcon = (category) => {
    // If API provides icon URL, use it
    if (category.icon) {
      return (
        <img 
          src={category.icon} 
          alt={category.name}
          style={{
            width: isMobile ? '24px' : '28px',
            height: isMobile ? '24px' : '28px',
            objectFit: 'contain'
          }}
        />
      )
    }
    
    // Fallback emojis based on category name
    const emojiMap = {
      'AC Service': '❄️',
      'Home Cleaning': '🧹',
      'Plumbing': '🔧',
      'Electrical': '⚡',
      'Beauty at Home': '💅',
      'Carpentry': '🪛',
      'Pest Control': '🪲',
      'Painting': '🎨',
      'Car Detailing': '🚗',
      'Pool Service': '🏊',
      'Appliance Repair': '📺',
      'Landscaping': '🌿',
      'Moving & Packing': '📦',
      'Water Tank Clean': '💧',
      'CCTV & Smart Home': '📹',
      'Glazing & Windows': '🪟',
      'Fitness & Wellness': '🏃',
      'Babysitting': '👶',
      'Pet Care': '🐕',
      'Laundry & Ironing': '👔',
      'Home Renovation': '🏗️',
      'Restaurants': '🍔',
      'Repairing': '🔧',
      'Health': '❤️',
      'Technical': '💻',
      'Retail': '🏪',
      'Clinic': '🏥',
      'Pharmacy': '💊',
      'Car Rental': '🔑',
      'Car Repair': '🔧',
      'Supermarket': '🛒',
      'Electronic': '📱',
      'IT Company': '💼'
    }
    return emojiMap[category.name] || '📌'
  }

  // Generate a consistent background color based on category name
  const getCategoryColor = (categoryName) => {
    const colors = [
      '#DBEAFE', '#D1FAE5', '#CFFAFE', '#FEF3C7', '#FCE7F3',
      '#EFEBE9', '#EDE9FE', '#FFE4E6', '#E0F2FE', '#ECFDF5',
      '#F1F5F9', '#F0F0F4'
    ]
    
    // Simple hash function to get consistent color
    let hash = 0
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // If no categories, don't render
  if (categories.length === 0) {
    return null
  }

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #EBEBEF',
      padding: isMobile ? '16px 0' : '20px 0',
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }}>
      <style>{`
        @keyframes pillIn {
          from { opacity: 0; transform: translateY(14px) scale(.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pill-item {
          opacity: 0;
          animation: pillIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .pill-icon { 
          transition: transform 0.25s ease, box-shadow 0.25s ease; 
        }
        .pill-item:hover .pill-icon {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 10px 20px rgba(0,0,0,.08);
        }
        .pill-item:hover .pill-label { 
          color: #D61CA8; 
        }
        .pill-more:hover .pill-icon {
          transform: translateY(-4px) scale(1.06);
          background: #EFEBFF !important;
        }
        .pill-item .pill-image {
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .pill-item:hover .pill-image {
          transform: scale(1.1);
          filter: brightness(1.1);
        }
      `}</style>
      <div style={{
        maxWidth: '1300px',
        width: '100%',
        padding: isMobile ? '0 20px' : '0 56px',
        display: 'flex',
        gap: isMobile ? '12px' : '20px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        justifyContent: 'flex-start'
      }}>
        {topCategories.map((category, index) => (
          <div
            key={category.id || index}
            className="pill-item"
            onClick={() => handleCategoryClick(category.name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '7px',
              cursor: 'pointer',
              flexShrink: 0,
              animationDelay: `${index * 0.04}s`
            }}
          >
            <div className="pill-icon" style={{
              width: isMobile ? '44px' : '52px',
              height: isMobile ? '44px' : '52px',
              background: getCategoryColor(category.name),
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '20px' : '24px',
              overflow: 'hidden'
            }}>
              {typeof getCategoryIcon(category) === 'string' ? (
                <span>{getCategoryIcon(category)}</span>
              ) : (
                getCategoryIcon(category)
              )}
            </div>
            <span className="pill-label" style={{
              font: isMobile ? '500 10px/1.2 "DM Sans",sans-serif' : '500 11px/1.2 "DM Sans",sans-serif',
              color: '#0A0A0F',
              textAlign: 'center',
              maxWidth: isMobile ? '50px' : '60px',
              transition: 'color 0.2s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {category.name}
            </span>
          </div>
        ))}

        {/* More Button - Only show if there are more than 9 categories */}
        {categories.length > 9 && (
          <div
            className="pill-item pill-more"
            onClick={() => navigate('/businesses')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '7px',
              cursor: 'pointer',
              flexShrink: 0,
              animationDelay: `${topCategories.length * 0.04}s`
            }}
          >
            <div className="pill-icon" style={{
              width: isMobile ? '44px' : '52px',
              height: isMobile ? '44px' : '52px',
              background: '#F8F8FA',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: isMobile ? '700 12px "DM Sans",sans-serif' : '700 13px "DM Sans",sans-serif',
              color: '#9090A0'
            }}>
              +{categories.length - 9}
            </div>
            <span className="pill-label" style={{
              font: isMobile ? '500 10px/1.2 "DM Sans",sans-serif' : '500 11px/1.2 "DM Sans",sans-serif',
              color: '#9090A0',
              textAlign: 'center',
              transition: 'color 0.2s ease'
            }}>
              More
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPills