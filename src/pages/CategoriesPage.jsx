import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

const STATIC_CATEGORIES = [
  { id: 1, slug: 'ac-service', name_en: 'AC Service', starting_price: 'OMR 15', icon: '❄️', bg: '#DBEAFE' },
  { id: 2, slug: 'home-cleaning', name_en: 'Home Cleaning', starting_price: 'OMR 25', icon: '🧹', bg: '#D1FAE5' },
  { id: 3, slug: 'plumbing', name_en: 'Plumbing', starting_price: 'OMR 12', icon: '🔧', bg: '#CFFAFE' },
  { id: 4, slug: 'electrical', name_en: 'Electrical', starting_price: 'OMR 8', icon: '⚡', bg: '#FEF3C7' },
  { id: 5, slug: 'beauty', name_en: 'Beauty at Home', starting_price: 'OMR 12', icon: '💅', bg: '#FCE7F3' },
  { id: 6, slug: 'carpentry', name_en: 'Carpentry', starting_price: 'OMR 15', icon: '🪛', bg: '#EFEBE9' },
  { id: 7, slug: 'pest-control', name_en: 'Pest Control', starting_price: 'OMR 18', icon: '🪲', bg: '#EDE9FE' },
  { id: 8, slug: 'painting', name_en: 'Painting', starting_price: 'OMR 25', icon: '🎨', bg: '#FFE4E6' },
  { id: 9, slug: 'car-detailing', name_en: 'Car Detailing', starting_price: 'OMR 5', icon: '🚗', bg: '#E0F2FE' },
  { id: 10, slug: 'pool-service', name_en: 'Pool Service', starting_price: 'OMR 25', icon: '🏊', bg: '#ECFDF5' },
  { id: 11, slug: 'appliance-repair', name_en: 'Appliance Repair', starting_price: 'OMR 12', icon: '📺', bg: '#F1F5F9' },
  { id: 12, slug: 'landscaping', name_en: 'Landscaping', starting_price: 'OMR 15', icon: '🌿', bg: '#ECFDF5' },
  { id: 13, slug: 'moving', name_en: 'Moving & Packing', starting_price: 'OMR 25', icon: '📦', bg: '#FEF3C7' },
  { id: 14, slug: 'water-tank', name_en: 'Water Tank Clean', starting_price: 'OMR 35', icon: '💧', bg: '#DBEAFE' },
  { id: 15, slug: 'cctv-smart', name_en: 'CCTV & Smart Home', starting_price: 'OMR 30', icon: '📹', bg: '#EDE9FE' },
  { id: 16, slug: 'glazing-windows', name_en: 'Glazing & Windows', starting_price: 'OMR 18', icon: '🪟', bg: '#F1F5F9' },
  { id: 17, slug: 'fitness-wellness', name_en: 'Fitness & Wellness', starting_price: 'OMR 20', icon: '🏃', bg: '#D1FAE5' },
  { id: 18, slug: 'babysitting', name_en: 'Babysitting', starting_price: 'OMR 5/hr', icon: '👶', bg: '#FCE7F3' },
  { id: 19, slug: 'pet-care', name_en: 'Pet Care', starting_price: 'OMR 8', icon: '🐕', bg: '#FEF3C7' },
  { id: 20, slug: 'laundry-ironing', name_en: 'Laundry & Ironing', starting_price: 'OMR 5', icon: '👔', bg: '#F0F0F4' },
  { id: 21, slug: 'home-renovation', name_en: 'Home Renovation', starting_price: 'OMR 40', icon: '🏗️', bg: '#EFEBE9' }
]

export default function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const processedCats = [...STATIC_CATEGORIES].sort((a, b) => {
    if (sortBy === 'alpha') {
      return a.name_en.localeCompare(b.name_en)
    }
    return 0
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="page-wrapper" style={{ background: 'white', minHeight: '100vh' }}>
      {/* Dynamic styles to handle responsive media queries seamlessly alongside your inline styles */}
      <style>{`
        .page-wrapper {
          padding: 28px 56px;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          gap: 16px;
        }
        .actions-wrapper {
          display: flex;
          gap: 8px;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        /* Tablet Breakpoint */
        @media (max-width: 1024px) {
          .page-wrapper {
            padding: 24px 32px;
          }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile Breakpoint */
        @media (max-width: 640px) {
          .page-wrapper {
            padding: 16px 16px;
          }
          .header-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .actions-wrapper {
            width: 100%;
          }
          .actions-wrapper form {
            flex: 1;
            width: auto !important;
          }
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Container Area */}
        <div className="header-container">
          <div>
            <div style={{ font: '600 28px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1px' }}>
              Household Services
            </div>
            <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '5px' }}>
              {STATIC_CATEGORIES.length} categories · Muscat, Oman
            </div>
          </div>

          {/* Filter and Search Actions layout */}
          <div className="actions-wrapper">
            <form 
              onSubmit={handleSearchSubmit}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', padding: '8px 14px', width: '220px' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="7" stroke="#9090A0" strokeWidth="2"/>
                <path d="M15.5 15.5L21 21" stroke="#9090A0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                style={{ background: 'none', border: 'none', outline: 'none', font: '400 12px/1 "DM Sans", sans-serif', color: '#0A0A0F', width: '100%' }} 
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 14px', background: '#F4F5F8', border: '1.5px solid #EBEBEF', borderRadius: '10px', font: '500 12px/1 "DM Sans", sans-serif', color: '#9090A0', cursor: 'pointer', outline: 'none' }}
            >
              <option value="popular">Popularity ▾</option>
              <option value="alpha">A–Z</option>
            </select>
          </div>
        </div>

        {/* Grid Content Layout */}
        <div className="categories-grid">
          {processedCats.map((cat) => (
            <Link
              key={cat.id}
              to={`/businesses?category=${cat.slug}`}
              style={{ textDecoration: 'none', background: '#F4F5F8', borderRadius: '16px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px', border: '1.5px solid #EBEBEF' }}
            >
              {/* Box Icon Container */}
              <div style={{ width: '46px', height: '46px', background: cat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {cat.icon}
              </div>

              {/* Labels */}
              <div>
                <div style={{ font: '700 13px/1.2 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                  {cat.name_en}
                </div>
                <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>
                  From {cat.starting_price}
                </div>
              </div>

              {/* Arrow Element */}
              <div style={{ marginLeft: 'auto', font: '700 16px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>
                ›
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}