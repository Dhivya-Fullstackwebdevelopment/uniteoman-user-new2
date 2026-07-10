import { useNavigate } from 'react-router-dom'

const CategoriesPills = ({ isMobile = false }) => {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryName) => {
    navigate(`/businesses?category=${encodeURIComponent(categoryName)}`)
  }

  const serviceCategories = [
    { name: 'AC Service', icon: '❄️', bg: '#DBEAFE' },
    { name: 'Home Cleaning', icon: '🧹', bg: '#D1FAE5' },
    { name: 'Plumbing', icon: '🔧', bg: '#CFFAFE' },
    { name: 'Electrical', icon: '⚡', bg: '#FEF3C7' },
    { name: 'Beauty at Home', icon: '💅', bg: '#FCE7F3' },
    { name: 'Carpentry', icon: '🪛', bg: '#EFEBE9' },
    { name: 'Pest Control', icon: '🪲', bg: '#EDE9FE' },
    { name: 'Painting', icon: '🎨', bg: '#FFE4E6' },
    { name: 'Car Detailing', icon: '🚗', bg: '#E0F2FE' },
    { name: 'Pool Service', icon: '🏊', bg: '#ECFDF5' },
    { name: 'Appliance Repair', icon: '📺', bg: '#F1F5F9' },
    { name: 'Landscaping', icon: '🌿', bg: '#ECFDF5' },
    { name: 'Moving & Packing', icon: '📦', bg: '#FEF3C7' },
    { name: 'Water Tank Clean', icon: '💧', bg: '#DBEAFE' },
    { name: 'CCTV & Smart Home', icon: '📹', bg: '#EDE9FE' },
    { name: 'Glazing & Windows', icon: '🪟', bg: '#F1F5F9' },
    { name: 'Fitness & Wellness', icon: '🏃', bg: '#D1FAE5' },
    { name: 'Babysitting', icon: '👶', bg: '#FCE7F3' },
    { name: 'Pet Care', icon: '🐕', bg: '#FEF3C7' },
    { name: 'Laundry & Ironing', icon: '👔', bg: '#F0F0F4' },
    { name: 'Home Renovation', icon: '🏗️', bg: '#EFEBE9' },
    { name: 'Restaurants', icon: '🍔', bg: '#FEF3C7' },
    { name: 'Repairing', icon: '🔧', bg: '#CFFAFE' },
    { name: 'Health', icon: '❤️', bg: '#FFE4E6' },
    { name: 'Technical', icon: '💻', bg: '#E0F2FE' },
    { name: 'Retail', icon: '🏪', bg: '#D1FAE5' },
    { name: 'Clinic', icon: '🏥', bg: '#FCE7F3' },
    { name: 'Pharmacy', icon: '💊', bg: '#EDE9FE' },
    { name: 'Car Rental', icon: '🔑', bg: '#FEF3C7' },
    { name: 'Car Repair', icon: '🔧', bg: '#CFFAFE' },
    { name: 'Supermarket', icon: '🛒', bg: '#D1FAE5' },
    { name: 'Electronic', icon: '📱', bg: '#E0F2FE' },
    { name: 'IT Company', icon: '💼', bg: '#F0F0F4' },
  ]

  // Get first 9 categories for display
  const topCategories = serviceCategories.slice(0, 9)

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
        .pill-icon { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .pill-item:hover .pill-icon {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 10px 20px rgba(0,0,0,.08);
        }
        .pill-item:hover .pill-label { color: #D61CA8; }
        .pill-more:hover .pill-icon {
          transform: translateY(-4px) scale(1.06);
          background: #EFEBFF !important;
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
            key={index}
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
              background: category.bg,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '20px' : '24px'
            }}>
              {category.icon}
            </div>
            <span className="pill-label" style={{
              font: isMobile ? '500 10px/1.2 "DM Sans",sans-serif' : '500 11px/1.2 "DM Sans",sans-serif',
              color: '#0A0A0F',
              textAlign: 'center',
              maxWidth: isMobile ? '50px' : '60px',
              transition: 'color 0.2s ease'
            }}>
              {category.name}
            </span>
          </div>
        ))}

        {/* More Button */}
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
            +{serviceCategories.length - 9}
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
      </div>
    </div>
  )
}

export default CategoriesPills