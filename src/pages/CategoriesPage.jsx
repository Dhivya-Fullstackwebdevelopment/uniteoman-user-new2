import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

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
    'pool-service': '#ECFDF5',
    'home-renovation': '#FEF3C7',
    'landscaping': '#D1FAE5',
    'moving-packing': '#CFFAFE',
    'water-tank-clean': '#DBEAFE',
    'cctv-smart-home': '#EDE9FE',
    'fitness-wellness': '#FCE7F3',
    'laundry-ironing': '#E0F2FE',
    'pet-care': '#FFE4E6',
    'glazing-windows': '#CFFAFE',
    'appliance-repair': '#FEF3C7',
    'babysitting': '#FCE7F3',
    'pool-service': '#ECFDF5'
  }
  return bgs[slug] || '#F1F5F9'
}

export default function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // URL parameters passed from Hero section
  const urlQuery = searchParams.get('q') || ''
  const urlServiceId = searchParams.get('service_id') || ''
  const urlLocation = searchParams.get('location_id') || '1'

  // States
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [sortBy, setSortBy] = useState('popular')
  const [selectedServiceName, setSelectedServiceName] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locations, setLocations] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [serviceNameFromId, setServiceNameFromId] = useState('')
  
  // Refs for debounce
  const searchTimeoutRef = useRef(null)

  // Fetch Locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.LOCATIONS)
        if (response.data && response.data.status === 'success') {
          setLocations(response.data.data)
          // Set location name immediately after fetching locations
          const locName = getLocationNameFromList(response.data.data, urlLocation)
          setLocationName(locName)
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }
    fetchLocations()
  }, [])

  // Get location name from list (no dependency on locations state)
  const getLocationNameFromList = (locationList, id) => {
    const location = locationList.find(loc => loc.id === parseInt(id))
    return location ? location.name : `Location ${id}`
  }

  // Get location name from state
  const getLocationName = (id) => {
    const location = locations.find(loc => loc.id === parseInt(id))
    return location ? location.name : `Location ${id}`
  }

  // Fetch a single service by ID (to get the name even if not available in the location)
  const fetchServiceById = async (serviceId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.SERVICES}?service_id=${serviceId}`)
      if (response.data && response.data.status === 'success' && response.data.data.length > 0) {
        setServiceNameFromId(response.data.data[0].name)
        return response.data.data[0].name
      }
    } catch (error) {
      console.error("Error fetching service by ID:", error)
    }
    return null
  }

  // Fetch Services Data from API
  const fetchServices = async (locationId, query, serviceId) => {
    setLoading(true)
    setIsSearching(true)
    try {
      let apiUrl = `${API_ENDPOINTS.SERVICES}?location_id=${locationId}`
      
      // If we have a service_id, use it directly
      if (serviceId) {
        apiUrl += `&service_id=${serviceId}`
      }
      // Otherwise if we have a search query, use it
      else if (query) {
        apiUrl += `&search=${encodeURIComponent(query)}`
      }

      const response = await axios.get(apiUrl)
      if (response.data && response.data.status === 'success') {
        setServicesData(response.data.data)
        
        // Update location name from API response or from locations list
        if (response.data.data.length > 0 && response.data.data[0].location) {
          const locationData = response.data.data[0].location
          if (Array.isArray(locationData) && locationData.length > 0) {
            const locName = locationData[0].name
            setLocationName(locName)
          } else if (locationData.name) {
            setLocationName(locationData.name)
          } else {
            // Fallback to locations list
            const locName = getLocationName(locationId)
            setLocationName(locName)
          }
        } else {
          // Fallback to locations list
          const locName = getLocationName(locationId)
          setLocationName(locName)
        }
        
        // Set service name if service_id is present
        if (serviceId) {
          if (response.data.data.length > 0) {
            setSelectedServiceName(response.data.data[0].name)
            setServiceNameFromId(response.data.data[0].name)
          } else {
            // If service not found in this location, fetch it by ID
            const serviceName = await fetchServiceById(serviceId)
            if (serviceName) {
              setSelectedServiceName(serviceName)
              setServiceNameFromId(serviceName)
            }
          }
        }
      } else {
        // If API returns no data but we have a service_id, fetch the service by ID
        if (serviceId) {
          const serviceName = await fetchServiceById(serviceId)
          if (serviceName) {
            setSelectedServiceName(serviceName)
            setServiceNameFromId(serviceName)
          }
        }
        // Fallback to locations list
        const locName = getLocationName(locationId)
        setLocationName(locName)
      }
    } catch (error) {
      console.error("Error fetching filtered services from API:", error)
      const locName = getLocationName(locationId)
      setLocationName(locName)
      
      // If error but we have a service_id, try to fetch it separately
      if (serviceId) {
        const serviceName = await fetchServiceById(serviceId)
        if (serviceName) {
          setSelectedServiceName(serviceName)
          setServiceNameFromId(serviceName)
        }
      }
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  // Initial fetch on URL param changes
  useEffect(() => {
    if (locations.length > 0) {
      fetchServices(urlLocation, urlQuery, urlServiceId)
    }
  }, [urlQuery, urlServiceId, urlLocation, locations])

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for debounce (500ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        // Navigate with search query using 'q' parameter
        navigate(`/categories?location_id=${urlLocation}&q=${encodeURIComponent(value.trim())}`)
      } else {
        // If empty, go to categories without search
        navigate(`/categories?location_id=${urlLocation}`)
      }
    }, 500)
  }

  // Handle form submit (for enter key)
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    if (searchQuery.trim()) {
      navigate(`/categories?location_id=${urlLocation}&q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate(`/categories?location_id=${urlLocation}`)
    }
  }

  // Handle location change
  const handleLocationChange = (e) => {
    const newLocation = e.target.value
    // Update location name immediately when location changes
    const newLocationName = getLocationName(newLocation)
    setLocationName(newLocationName)
    
    if (urlQuery) {
      navigate(`/categories?location_id=${newLocation}&q=${encodeURIComponent(urlQuery)}`)
    } else if (urlServiceId) {
      navigate(`/categories?location_id=${newLocation}&service_id=${urlServiceId}`)
    } else {
      navigate(`/categories?location_id=${newLocation}`)
    }
  }

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('')
    navigate(`/categories?location_id=${urlLocation}`)
  }

  // Get header title based on what was searched
  const getHeaderTitle = () => {
    // Priority: service name from URL service_id
    if (urlServiceId && (selectedServiceName || serviceNameFromId)) {
      return selectedServiceName || serviceNameFromId
    }
    if (urlQuery) {
      return `Search Results for "${urlQuery}"`
    }
    return 'Household Services'
  }

  // Get subtitle text
  const getSubtitle = () => {
    const count = loading ? '...' : processedCats.length
    const categoryText = processedCats.length === 1 ? 'category' : 'categories'
    
    let subtitle = `${count} ${categoryText}`
    
    // Show location name if available
    if (locationName) {
      subtitle += ` · ${locationName}`
    } else if (urlLocation) {
      const fallbackName = getLocationName(urlLocation)
      subtitle += ` · ${fallbackName}`
    }
    
    // Show service name if available
    if (urlServiceId && (selectedServiceName || serviceNameFromId)) {
      subtitle += ` · ${selectedServiceName || serviceNameFromId}`
    }
    
    // Show searching indicator
    if (isSearching) {
      subtitle += ' · Searching...'
    }
    
    return subtitle
  }

  // Handle front-end sorting
  const processedCats = [...servicesData].sort((a, b) => {
    if (sortBy === 'alpha') {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

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
          flex-wrap: wrap;
        }
        .header-left {
          flex: 1;
          min-width: 200px;
        }
        .actions-wrapper {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .location-select {
          padding: 8px 14px;
          background: #F4F5F8;
          border: 1.5px solid #EBEBEF;
          border-radius: 10px;
          font: 500 12px/1 "DM Sans", sans-serif;
          color: #0A0A0F;
          cursor: pointer;
          outline: none;
          min-width: 150px;
          transition: border-color 0.2s ease;
        }
        .location-select:focus {
          border-color: #D61CA8;
        }
        .search-form {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #F4F5F8;
          border: 1.5px solid #EBEBEF;
          border-radius: 10px;
          padding: 8px 14px;
          width: 220px;
          transition: border-color 0.2s ease;
        }
        .search-form:focus-within {
          border-color: #D61CA8;
          box-shadow: 0 0 0 3px rgba(214, 28, 168, 0.1);
        }
        .search-input {
          background: none;
          border: none;
          outline: none;
          font: 400 12px/1 "DM Sans", sans-serif;
          color: #0A0A0F;
          width: 100%;
        }
        .search-input::placeholder {
          color: #9090A0;
        }
        .clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9090A0;
          padding: 0 4px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        .clear-btn:hover {
          color: #D61CA8;
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
        .category-card {
          text-decoration: none;
          background: #F4F5F8;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1.5px solid #EBEBEF;
          transition: all 0.2s ease;
        }
        .category-card:hover {
          border-color: #D61CA8;
          box-shadow: 0 4px 12px rgba(214, 28, 168, 0.1);
          transform: translateY(-2px);
        }
        .category-card:active {
          transform: translateY(0);
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
          .header-left {
            width: 100%;
          }
          .actions-wrapper {
            width: 100%;
            flex-direction: column;
          }
          .actions-wrapper form {
            width: 100% !important;
          }
          .location-select {
            width: 100%;
          }
          .search-form {
            width: 100% !important;
          }
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Container Area */}
        <div className="header-container">
          <div className="header-left">
            <div style={{ font: '600 28px/1 "DM Sans", sans-serif', color: '#0A0A0F', letterSpacing: '-1px' }}>
              {getHeaderTitle()}
            </div>
            <div style={{ font: '400 13px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '5px' }}>
              {getSubtitle()}
            </div>
          </div>

          {/* Filter and Search Actions layout */}
          <div className="actions-wrapper">
            {/* Location Selector */}
            <select 
              value={urlLocation}
              onChange={handleLocationChange}
              className="location-select"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>

            <form 
              onSubmit={handleSearchSubmit}
              className="search-form"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="7" stroke="#9090A0" strokeWidth="2"/>
                <path d="M15.5 15.5L21 21" stroke="#9090A0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                className="search-input"
                placeholder="Search services..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="clear-btn"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              {isSearching && (
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #D61CA8',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  flexShrink: 0
                }} />
              )}
            </form>
            
            <select 
              value={sortBy}
              onChange={handleSortChange}
              style={{ 
                padding: '8px 14px', 
                background: '#F4F5F8', 
                border: '1.5px solid #EBEBEF', 
                borderRadius: '10px', 
                font: '500 12px/1 "DM Sans", sans-serif', 
                color: '#9090A0', 
                cursor: 'pointer', 
                outline: 'none',
                minWidth: '120px',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D61CA8'}
              onBlur={(e) => e.target.style.borderColor = '#EBEBEF'}
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
                  to={`/businesses?service_id=${cat.id}&location_id=${urlLocation}`}
                  className="category-card"
                >
                  {/* Box Icon Container */}
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    background: getBgColor(currentSlug), 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0, 
                    overflow: 'hidden' 
                  }}>
                    {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                      <img src={cat.icon} alt={cat.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '22px' }}>🛠️</span>
                    )}
                  </div>

                  {/* Labels */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '700 13px/1.2 "DM Sans", sans-serif', color: '#0A0A0F' }}>
                      {cat.name}
                    </div>
                    <div style={{ font: '400 11px/1 "DM Sans", sans-serif', color: '#9090A0', marginTop: '4px' }}>
                      From OMR {cat.starting_price}
                    </div>
                  </div>

                  {/* Arrow Element */}
                  <div style={{ 
                    font: '700 16px/1 "DM Sans", sans-serif', 
                    color: '#D61CA8',
                    flexShrink: 0
                  }}>
                    ›
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', font: '400 14px "DM Sans"', color: '#9090A0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#0A0A0F', marginBottom: '8px' }}>
                No services found
              </div>
              <div>
                {urlQuery ? `No results for "${urlQuery}" in ${locationName || getLocationName(urlLocation)}` : `No services available in ${locationName || getLocationName(urlLocation)}`}
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  navigate(`/categories?location_id=${urlLocation}`)
                }}
                style={{ 
                  marginTop: '16px', 
                  padding: '8px 24px', 
                  background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  font: '600 13px "DM Sans"',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(214,28,168,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                View All Services
              </button>
            </div>
          )}
        </div>

        {/* Add spin animation for loader */}
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