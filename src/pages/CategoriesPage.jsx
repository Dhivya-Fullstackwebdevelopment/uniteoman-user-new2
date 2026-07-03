import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api'
import { Spinner } from '@/components/ui'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Utensils, Wrench, Sparkles, HeartPulse, Briefcase,
  Monitor, Package, ChevronRight, Store, Stethoscope, Pill,
  Key, Smartphone, Search
} from 'lucide-react'

// Map slug names to icons/emojis or styles if dynamic fallback is needed
const ICONS = {
  restaurants: '🍔', repairing: '🔧', beauty: '💅',
  health: '❤️', technical: '💻', moving: '📦', retail: '🏪',
  clinic: '🏥', pharmacy: '💊', 'car-rental': '🔑', 'car-repair': '🔧',
  supermarket: '🛒', electronic: '📱', 'it-company': '💼',
  'ac-service': '❄️', 'home-cleaning': '🧹', plumbing: '🔧',
  electrical: '⚡', carpentry: '🪛', 'pest-control': '🪲',
  painting: '🎨', 'car-detailing': '🚗', 'pool-service': '🏊',
  'appliance-repair': '📺', landscaping: '🌿'
}

// Tailored soft background map matching your design rows
const BG_SOFT_MAP = [
  'bg-blue-50', 'bg-emerald-50', 'bg-cyan-50', 'bg-amber-50',
  'bg-pink-50', 'bg-stone-100', 'bg-purple-50', 'bg-rose-50',
  'bg-sky-50', 'bg-teal-50', 'bg-slate-100', 'bg-emerald-50'
]

export default function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const parentId = searchParams.get('parent_id') || 0
  const parentSlug = searchParams.get('parent_slug')
  const parentName = searchParams.get('name')
  const isSubView = (parentId !== 0 && parentId !== '0') || !!parentSlug
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const { data: cats = [], isLoading } = useQuery({
    queryKey: ['categories', parentId, parentSlug],
    queryFn: () => categoryApi.list(null, isSubView ? null : 0, parentSlug || null)
  })

  // Removed the ': React.FormEvent' TypeScript type annotation here
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen  bg-[#F8F8FA]">

      {/* Page Hero - Implements your deep brand gradient mesh */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#D61CA8] via-[#8B2EF5] to-[#4B6EF5] px-6 py-12 md:py-16">
        {/* Decorative canvas blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pink-400 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-400 blur-2xl" />
        </div>

        <div className="relative max-w-[1240px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="text-left max-w-2xl">
            {isSubView && (
              <button
                onClick={() => navigate('/categories')}
                className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all bg-white/5 backdrop-blur-sm"
              >
                <ArrowLeft size={12} /> Back to all categories
              </button>
            )}
            <h1 className="text-white font-sans text-3xl md:text-3xl font-bold tracking-tight leading-tight">
              {isSubView ? `Explore ${parentName || 'Services'}` : 'All Home Services in Muscat'}
            </h1>
            <p className="mt-2 text-white/80 text-sm md:text-base">
              {isSubView
                ? 'Choose a subcategory to find verified professionals nearby'
                : `${cats.length || '18'} categories · 900+ verified professionals · All Muscat governorates`}
            </p>
          </div>

          {/* New Live Header Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-xl overflow-hidden w-full md:w-[440px] shadow-lg h-12 flex-shrink-0">
            <div className="flex items-center pl-4 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none px-3 text-sm font-normal text-gray-900 placeholder-gray-400 bg-transparent"
              placeholder="Search AC, cleaning, plumbing..."
            />
            <button type="submit" className="bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] hover:opacity-95 text-white font-bold text-sm px-6 transition-opacity">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Interactive Workspace Area */}
      <div className="max-w-[1240px] mx-auto px-6 py-10">

        {/* Controls Bar: Heading & Sorting Layout Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            {isSubView ? (parentName || 'Subcategories') : 'All Categories'}
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${sortBy === 'popular'
                ? 'bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] text-white'
                : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-700'
                }`}
            >
              Most Popular
            </button>

            <button
              onClick={() => setSortBy('alpha')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${sortBy === 'alpha'
                ? 'bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] text-white'
                : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-700'
                }`}
            >
              A–Z
            </button>

            <button
              className="px-4 py-1.5 border border-gray-100 rounded-full text-xs font-semibold whitespace-nowrap transition-all bg-white text-gray-500 hover:text-gray-700"
            >
              Price ↑
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner className="w-10 h-10 text-[#8B2EF5]" /></div>
        ) : (
          /* High-fidelity clean component layout grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cats.map((cat, i) => {
              const iconEmoji = ICONS[cat.slug] || '📦'
              const bgSoftClass = BG_SOFT_MAP[i % BG_SOFT_MAP.length]
              const link = cat.has_children
                ? `/categories?parent_slug=${cat.slug}&name=${encodeURIComponent(cat.name_en)}`
                : `/businesses?category=${cat.slug}`
              const isActive = hoveredCategory === cat.id  // ← purely hover-driven

              return (
                <Link
                  key={cat.id}
                  to={link}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="group relative bg-white rounded-2xl p-4 pt-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Dynamic Ribbon highlight bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] transition-opacity duration-200" />
                  )}

                  <div>
                    {/* Centered Decorative Icon Box */}
                    <div className={`w-12 h-12 mx-auto rounded-2xl ${bgSoftClass} flex items-center justify-center mb-3 text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      {iconEmoji}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#D61CA8] transition-colors">
                      {cat.name_en}
                    </h3>

                    <p className="text-[11px] text-gray-400 font-medium">
                      {cat.services_count || cat.business_count || 6} services
                    </p>
                  </div>

                  {/* Pricing Badge Info from UI Specs */}
                  <div
                    className="mt-3 text-[11px] font-bold transition-colors duration-200"
                    style={{ color: isActive ? '#D61CA8' : '#0A0A0F' }}
                  >
                    {cat.starting_price ? `From OMR ${cat.starting_price}` : 'From OMR 10'}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Dynamic Fallback Container */}
        {!isLoading && cats.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-4xl inline-block mb-3">🔍</span>
            <p className="text-gray-400 text-sm font-medium">No matching categories found right now.</p>
            <Link to="/categories" className="mt-3 inline-block text-xs font-bold text-[#D61CA8] hover:underline">
              ← Reset view and browse all options
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}