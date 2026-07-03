import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, Utensils, Wrench, Sparkles, HeartPulse, Briefcase, Monitor, Package, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api'

const ICONS = { restaurants: Utensils, repairing: Wrench, beauty: Sparkles, health: HeartPulse, technical: Monitor, moving: Package }
const COLORS = ['#FCE8F1', '#DBEAFE', '#FEF3C7', '#D1FAE5', '#EDE5F7', '#CFFAFE', '#FEF0EA', '#E0E7FF']

const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [hoveredCat, setHoveredCat] = useState(null)
  const [hoveredSubCat, setHoveredSubCat] = useState(null)

  const navRef = useRef(null)
  const timerRef = useRef(null)
  const { user, isAdmin, isVendor, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [customerUser, setCustomerUser] = useState(() => {
    const stored = localStorage.getItem('customerUser')
    return stored ? JSON.parse(stored) : null
  })

  const handleCustomerLogout = () => {
    localStorage.removeItem('customerUser')
    localStorage.removeItem('customer_token')
    setCustomerUser(null)
    navigate('/customer/login')
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem('vendor_token')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    logout()
    window.location.reload()
    navigate('/vendor/login')
  }

  useEffect(() => {
    setCatOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  const { data: topCategories = [] } = useQuery({
    queryKey: ['categories', 'top-level'],
    queryFn: () => categoryApi.list(null, 0, null),
    staleTime: 1000 * 60 * 10
  })

  useEffect(() => {
    if (catOpen && !hoveredCat && topCategories.length > 0) {
      setHoveredCat(topCategories[0])
      setHoveredSubCat(null)
    }
  }, [catOpen, topCategories, hoveredCat])

  const { data: subCategories = [], isFetching: subsLoading } = useQuery({
    queryKey: ['categories', 'sub', hoveredCat?.id],
    queryFn: () => categoryApi.list(null, null, hoveredCat?.slug),
    enabled: !!hoveredCat,
    staleTime: 1000 * 60 * 10
  })

  const { data: childCategories = [], isFetching: childLoading } = useQuery({
    queryKey: ['categories', 'sub', hoveredSubCat?.id],
    queryFn: () => categoryApi.list(null, null, hoveredSubCat?.slug),
    enabled: !!hoveredSubCat,
    staleTime: 1000 * 60 * 10
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = () => { clearTimeout(timerRef.current); setCatOpen(true) }
  const closeMenu = () => { timerRef.current = setTimeout(() => setCatOpen(false), 200) }

  const isCategoriesActive = catOpen || location.pathname.startsWith('/businesses') || location.pathname.startsWith('/categories')

  return (
    <div onMouseLeave={closeMenu} style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <nav
        ref={navRef}
        className={`sticky top-0 z-[200] flex items-center transition-shadow duration-300 ${scrolled || catOpen ? 'shadow-sm' : ''
          }`}
        style={{
          height: '76px',
          background: 'rgba(255,255,255,.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,.06)',
        }}
      >
        <div className="w-full max-w-[1300px] mx-auto flex items-center gap-6 md:gap-12 px-4 md:px-14">
          {/* Logo */}
          <Link to="/" className="shrink-0 tr hover:opacity-80">
            <Logo theme="light" style={{ height: '32px' }} />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-9 flex-1">
            <Link
              to="/categories"
              className="text-[15px] font-medium pb-[2px] transition-colors"
              style={
                location.pathname.startsWith('/categories')
                  ? {
                    color: BRAND_FROM,
                    borderBottom: `2px solid ${BRAND_FROM}`
                  }
                  : {
                    color: '#555'
                  }
              }
            >
              Services
            </Link>

            <Link
              // to="/how-it-works"
              className="text-[15px] font-medium text-[#555] hover:text-[#0A0A0F] tr"
            >
              How It Works
            </Link>
            <Link
              to="/businesses"
              className="text-[15px] font-medium transition-colors"
              style={
                location.pathname.startsWith('/businesses')
                  ? {
                    color: BRAND_FROM,
                    borderBottom: `2px solid ${BRAND_FROM}`
                  }
                  : {
                    color: '#555'
                  }
              }
            >
              Businesses
            </Link>
            <Link
              to="/governorates"
              className="text-[15px] font-medium pb-[2px] transition-colors"
              style={
                location.pathname.startsWith('/governorates')
                  ? {
                    color: BRAND_FROM,
                    borderBottom: `2px solid ${BRAND_FROM}`
                  }
                  : {
                    color: '#555'
                  }
              }
            >
              For Professionals
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            <div className="hidden md:flex items-center gap-2.5">
              {user && isVendor ? (
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center gap-2 text-[14px] font-semibold text-[#0A0A0F] px-4 py-2.5 rounded-[10px] tr hover:bg-[#F8F8FA]"
                  style={{ border: '2px solid #EBEBEF' }}
                >
                  <User size={14} /> My Account
                </Link>
              ) : !customerUser && (
                <button
                  onClick={() => navigate('/customer/login')}
                  className="bg-transparent px-[18px] py-2.5 text-[14px] font-semibold text-[#555] rounded-[10px] tr hover:bg-[#F8F8FA]"
                >
                  Log In
                </button>
              )}

              {!user && (
                <Link
                  to="/vendor/login"
                  className="px-[18px] py-[9px] text-[14px] font-semibold text-[#0A0A0F] rounded-[10px] tr hover:bg-[#F8F8FA] whitespace-nowrap"
                  style={{ border: '2px solid #EBEBEF' }}
                >
                  Register as Pro
                </Link>
              )}

              {user && isVendor && (
                <Link
                  to="/list-business"
                  className="px-[22px] py-[11px] text-[14px] font-bold text-white rounded-[10px] whitespace-nowrap tr hover:-translate-y-[1px]"
                  style={{ background: BRAND_GRADIENT, boxShadow: `0 4px 16px rgba(214,28,168,.35)` }}
                >
                  List Business
                </Link>
              )}

              {!user && !customerUser && (
                <Link
                  to="/businesses"
                  className="px-[22px] py-[11px] text-[14px] font-bold text-white rounded-[10px] whitespace-nowrap tr hover:-translate-y-[1px]"
                  style={{ background: BRAND_GRADIENT, boxShadow: `0 4px 16px rgba(214,28,168,.35)` }}
                >
                  Book a Service
                </Link>
              )}

              {user && isVendor && (
                <button
                  onClick={handleLogout}
                  className="text-[14px] font-semibold text-[#555] tr hover:text-[var(--brand)] px-2"
                >
                  Logout
                </button>
              )}

              {customerUser && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/customer/profile"
                    className="text-[14px] font-semibold text-[#0A0A0F] flex items-center gap-2 hover:text-pink-600"
                  >
                    <User size={14} />
                    {customerUser.full_name}
                  </Link>
                  <button
                    onClick={handleCustomerLogout}
                    className="text-[13px] font-bold text-white bg-red-400 px-4 py-1.5 rounded-full tr hover:bg-red-500 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 tr text-gray-600"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mega menu dropdown */}
      <div
        className={`fixed top-[76px] left-0 right-0 z-[190] bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 origin-top flex overflow-hidden ${catOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        onMouseEnter={openMenu}
        style={{ height: '440px' }}
      >
        <div className="w-full max-w-[1300px] mx-auto px-14 py-6 flex h-full">
          {/* Left Sidebar */}
          <div className="w-[300px] border-r border-gray-100 pr-5 flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-3">Top Categories</h3>
            <div className="flex flex-col gap-1">
              {topCategories.map((cat, i) => {
                const Icon = ICONS[cat.slug] || Briefcase
                const isActive = hoveredCat?.id === cat.id
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => { setHoveredCat(cat); setHoveredSubCat(null); }}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors duration-200 ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLORS[i % COLORS.length] }}>
                        <Icon size={14} className="text-gray-700" />
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: isActive ? BRAND_FROM : '#374151' }}>
                        {cat.name_en}
                      </span>
                    </div>
                    {cat.has_children && <ChevronRight size={14} style={{ color: isActive ? BRAND_FROM : '#D1D5DB' }} />}
                  </div>
                )
              })}
            </div>
            <div className="mt-auto pt-4 pb-2 px-3">
              <Link
                to="/categories"
                onClick={() => setCatOpen(false)}
                className="text-[12px] font-bold hover:underline inline-flex items-center gap-1"
                style={{ color: BRAND_FROM }}
              >
                View all categories <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Middle & Right Panes */}
          {subsLoading ? (
            <div className="flex-1 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
          ) : subCategories.length > 0 ? (
            <>
              <div className="w-[340px] border-r border-gray-100 px-8 flex flex-col h-full relative shrink-0">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4 h-[15px]">
                  {hoveredCat ? `Explore ${hoveredCat.name_en}` : ' '}
                </h3>
                <div className="flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar -ml-2 -mr-2 px-2">
                  {subCategories.map(sub => {
                    const isSubActive = hoveredSubCat?.id === sub.id
                    return (
                      <div
                        key={sub.id}
                        onMouseEnter={() => setHoveredSubCat(sub)}
                        onClick={() => !sub.has_children && navigate(`/businesses?category=${sub.slug}`)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${isSubActive ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                          }`}
                      >
                        <div>
                          <h4 className="text-[13px] font-bold transition-colors mb-0.5" style={{ color: isSubActive ? BRAND_FROM : '#1F2937' }}>
                            {sub.name_en}
                          </h4>
                          <p className="text-[11px] text-gray-400">{sub.has_children ? 'Has categories' : `${sub.business_count || 0} businesses`}</p>
                        </div>
                        {sub.has_children && <ChevronRight size={14} style={{ color: isSubActive ? BRAND_FROM : '#D1D5DB' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 px-10 flex flex-col h-full relative">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4 h-[15px]">
                  {hoveredSubCat ? `Explore ${hoveredSubCat.name_en}` : ' '}
                </h3>

                {!hoveredSubCat ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Sparkles size={24} className="text-gray-400" />
                    </div>
                    <p className="text-[13px] font-bold text-gray-500">Hover a category to see more</p>
                  </div>
                ) : childLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                ) : childCategories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 overflow-y-auto pb-4 custom-scrollbar content-start">
                    {childCategories.map(child => (
                      <Link
                        key={child.id}
                        to={`/businesses?category=${child.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="group flex flex-col p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="text-[13px] font-bold text-gray-900 mb-0.5 transition-colors" style={{ '--tw': 1 }}>
                          {child.name_en}
                        </h4>
                        <p className="text-[11px] text-gray-400">{child.business_count || 0} businesses</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Utensils size={24} style={{ color: BRAND_FROM }} opacity={0.5} />
                    </div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-1">Explore {hoveredSubCat.name_en}</h4>
                    <p className="text-[12px] text-gray-400 max-w-[200px] mb-4">{hoveredSubCat.business_count || 0} businesses available</p>
                    <Link
                      to={`/businesses?category=${hoveredSubCat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="px-6 py-2 text-white rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity"
                      style={{ background: BRAND_GRADIENT }}
                    >
                      View all
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : hoveredCat ? (
            <div className="flex-1 px-10 py-5 flex flex-col h-full relative">
              <div className="w-full h-[320px] rounded-3xl overflow-hidden relative flex flex-col items-center justify-center bg-gray-50 border border-gray-100 shadow-sm ml-4 mt-2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FCE8F1] to-white opacity-60"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 bg-white shadow-xl shadow-black/5 rounded-[24px] flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Sparkles size={32} style={{ color: BRAND_FROM }} />
                  </div>
                  <h2 className="text-[28px] font-black text-gray-900 mb-3 tracking-tight">
                    Explore {hoveredCat.name_en}
                  </h2>
                  <p className="text-[15px] font-medium text-gray-500 max-w-[340px] mb-8 leading-relaxed">
                    Discover top-rated businesses, exclusive deals, and premium services in Oman.
                  </p>
                  <Link
                    to={`/businesses?category=${hoveredCat.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="px-8 py-3.5 text-white rounded-full text-[14px] font-bold hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 transition-all flex items-center gap-2"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    View all businesses <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 z-[190] max-h-[calc(100vh-76px)] overflow-y-auto">
          {[['Services', '/categories'], ['How It Works', ''], ['For Business', '/businesses'], ['For Professionals', '/governorates']].map(([label, to]) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl">
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-1 flex flex-col gap-2">
            <Link
              to="/vendor/login"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm font-bold text-center text-[#0A0A0F] rounded-xl"
              style={{ border: '2px solid #EBEBEF' }}
            >
              Register as Pro
            </Link>

            {customerUser ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <User size={18} className="text-pink-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-400 font-semibold">Logged in as</span>
                    <span className="text-[14px] font-bold text-gray-800">{customerUser.full_name}</span>
                  </div>
                </div>
                <button
                  onClick={handleCustomerLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/customer/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-bold text-center text-[#555] hover:bg-gray-50 rounded-xl"
              >
                Log In
              </Link>
            )}

            {user && isVendor ? (
              <>
                <Link
                  to="/list-business"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-bold text-center text-white rounded-xl"
                  style={{ background: BRAND_GRADIENT }}
                >
                  List Business
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 text-sm font-bold text-center text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              !customerUser && (
                <Link
                  to="/businesses"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-bold text-center text-white rounded-xl"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Book a Service
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}