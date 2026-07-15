import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

// Helper function to match fallback backgrounds if API items don't have them
const getBgColor = (slug) => {
  const bgs = {
    'ac-service': '#DBEAFE',
    'home-cleaning': '#D1FAE5',
    'plumbing': '#CFFAFE',
    'electrical': '#FEF3C7',
    'beauty': '#FCE7F3',
    'carpentry': '#EFEBE9',
    'pest-control': '#EDE9FE',
    'painting': '#FFE4E6',
    'car-detailing': '#E0F2FE',
    'pool-service': '#ECFDF5'
  }
  return bgs[slug] || '#F1F5F9'
}

export default function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // URL parameters passed from Hero section
  const urlQuery = searchParams.get('q') || ''
  const urlLocation = searchParams.get('location') || '1' // Defaults to 1 as requested

  // States
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [sortBy, setSortBy] = useState('popular')

  // Fetch Services Data from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        let apiUrl = `http://127.0.0.1:8000/api/services/?location_id=${urlLocation}`
        
        // If a search phrase text query exists, append it (e.g., q=AC+Service)
        if (urlQuery) {
          apiUrl += `&q=${encodeURIComponent(urlQuery)}`
        }

        const response = await axios.get(apiUrl)
        if (response.data && response.data.status === 'success') {
          setServicesData(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching filtered services from API:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [urlQuery, urlLocation])

  // Handle front-end sorting and mapping of data source
  const processedCats = [...servicesData].sort((a, b) => {
    if (sortBy === 'alpha') {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Directs to the search list layout using existing routes or setups
      navigate(`/categories?location=${urlLocation}&q=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate(`/categories?location=${urlLocation}`)
    }
  }

  return (
    <div className="page-wrapper" style={{ background: 'white', minHeight: '100vh' }}>
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
        .skel-card {
          background: #F4F5F8;
          height: 80px;
          border-radius: 16px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
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
              {urlQuery ? `Search Results for "${urlQuery}"` : 'Household Services'}
            </div>
            <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '5px' }}>
              {loading ? '...' : processedCats.length} categories · Location ID: {urlLocation}
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
          {loading ? (
            // Shimmer skeletons while API loads
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={`skel-${idx}`} className="skel-card" />
            ))
          ) : processedCats.length > 0 ? (
            processedCats.map((cat) => {
              const currentSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link
                  key={cat.id}
                  to={`/businesses?category=${currentSlug}&location=${urlLocation}`}
                  style={{ textDecoration: 'none', background: '#F4F5F8', borderRadius: '16px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px', border: '1.5px solid #EBEBEF' }}
                >
                  {/* Box Icon Container - Tries rendering image URL icon from database first */}
                  <div style={{ width: '46px', height: '46px', background: getBgColor(currentSlug), borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                      <img src={cat.icon} alt={cat.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '22px' }}>{cat.icon || '🛠️'}</span>
                    )}
                  </div>

                  {/* Labels */}
                  <div>
                    <div style={{ font: '700 13px/1.2 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                      {cat.name}
                    </div>
                    <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>
                      From OMR {cat.starting_price}
                    </div>
                  </div>

                  {/* Arrow Element */}
                  <div style={{ marginLeft: 'auto', font: '700 16px/1 "DM Sans", sans-serif', color: '#D61CA8' }}>
                    ›
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', font: '400 14px "DM Sans"', color: '#9090A0' }}>
              No services found for your criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}