import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { businessApi } from '@/lib/api'
import { Spinner } from '@/components/ui'
import { Search, SlidersHorizontal, Star, Tag, X, ChevronLeft } from 'lucide-react'

// ── Debounce hook ──────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── Badge chip ─────────────────────────────────────────────
function Badge({ text }) {
  const isPercent = /\d+%/.test(text)
  return (
    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md ${isPercent ? 'bg-[#ff2d78]' : 'bg-[#ff7043]'
      }`}>
      {text}
    </span>
  )
}

// ── Business card ──────────────────────────────────────────
function BusinessCard({ business, navigate }) {
  const raw = business.cover_image_url || business.logo_url
  const img = raw
    ? raw.startsWith('/') ? import.meta.env.VITE_API_URL + raw : raw
    : null

  const dealMatch = business.deal_text?.match(/(\d+)%/)
  const badge = business.has_deal
    ? dealMatch ? `${dealMatch[1]}% off` : 'Special'
    : null

  const price = business.plan === 'enterprise' ? 40 : business.plan === 'professional' ? 20 : 12
  const oldPrice = Math.round(price * 1.4)
  const rating = parseFloat(business.rating_avg || 4.5).toFixed(1)
  const reviews = (business.rating_count || 0).toLocaleString()

  return (
    <div
      onClick={() => navigate(`/business/${business.slug}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={business.name_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
            <span className="text-3xl font-black text-[#ff2d78]/30">
              {business.name_en?.charAt(0)}
            </span>
          </div>
        )}
        {badge && <Badge text={badge} />}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-sm font-black text-gray-900 truncate leading-tight mb-1">
          {business.name_en}
        </h3>
        {business.has_deal && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm font-black text-gray-900">OMR {price}</span>
            <span className="text-xs text-gray-400 line-through">was {oldPrice}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
          <span className="font-bold text-gray-700">{rating}</span>
          <span className="text-gray-300">·</span>
          <span>{reviews}</span>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────
function EmptyState({ query, hasDeals }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-5">
        {hasDeals
          ? <Tag size={28} className="text-[#ff2d78]" />
          : <Search size={28} className="text-[#ff2d78]" />
        }
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">
        {hasDeals ? 'No deals right now' : query ? `No results for "${query}"` : 'Nothing here yet'}
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        {hasDeals
          ? 'Check back soon — vendors update their deals regularly.'
          : 'Try a different search term or browse all businesses.'}
      </p>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQ = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialDeals = searchParams.get('has_deal') === 'true'

  const [inputValue, setInputValue] = useState(initialQ)
  const [filterDeals, setFilterDeals] = useState(initialDeals)
  const [showFilters, setShowFilters] = useState(false)
  const [category, setCategory] = useState(initialCategory)
  const initialSort = searchParams.get('sort') || ''
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(inputValue);

  const pageTitle =
    filterDeals
      ? "Today's deals"
      : sort === 'featured'
        ? 'Trending this week'
        : sort === 'newest'
          ? 'Just added'
          : category === 'it-software'
            ? 'Tech & Software'
            : category === 'retail'
              ? 'Home Essentials'
              : category === 'grooming-for-men'
                ? 'Grooming for men'
                : category === 'spa'
                  ? 'Beauty & wellness for women'
                  : debouncedQ
                    ? `Results for "${debouncedQ}"`
                    : 'All businesses'

  // Sync state → URL
  useEffect(() => {
    const params = {}
    if (debouncedQ) params.q = debouncedQ
    if (category) params.category = category
    if (filterDeals) params.has_deal = 'true'
    if (sort) params.sort = sort
    setSearchParams(params, { replace: true })
  }, [debouncedQ, filterDeals, setSearchParams])

  // Sync URL → state on mount / back-nav
  useEffect(() => {
    setInputValue(searchParams.get('q') || '')
    setFilterDeals(searchParams.get('has_deal') === 'true')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const queryParams = {
    ...(debouncedQ && { search: debouncedQ }),
    ...(filterDeals && { has_deal: true }),
    ...(category && { category }),
    ...(sort && { sort }),
    page,
    per_page: 12,
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', queryParams],
    queryFn: () => businessApi.list(queryParams),
    keepPreviousData: true,
  })

  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / 12)
  const hasActive = !!debouncedQ || filterDeals

  const clearAll = useCallback(() => {
    setInputValue('')
    setFilterDeals(false)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7fb]">

      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1250px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3">

          {/* Back */}
          <Link to="/" className="text-gray-400 hover:text-[#ff2d78] transition-colors flex-shrink-0">
            <ChevronLeft size={20} />
          </Link>

          {/* Search bar */}
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search businesses, services…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff2d78] focus:ring-2 focus:ring-pink-100 transition-all"
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-black transition-all flex-shrink-0 ${filterDeals
              ? 'bg-[#ff2d78] border-[#ff2d78] text-white shadow-md shadow-pink-200'
              : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:text-[#ff2d78]'
              }`}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filters</span>
            {filterDeals && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
          </button>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className="max-w-[1250px] mx-auto px-4 md:px-6 pb-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterDeals(v => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-black transition-all ${filterDeals
                ? 'bg-[#ff2d78] border-[#ff2d78] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:text-[#ff2d78]'
                }`}
            >
              <Tag size={11} />
              Deals only
            </button>

            {hasActive && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Result count / heading */}
        <div className="flex items-center justify-between mb-5 md:mb-7">
          <div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-0.5">
              {pageTitle}
            </h1>

            {!isLoading && total > 0 && (
              <p className="text-sm text-gray-400 font-medium">
                {total.toLocaleString()} result{total !== 1 ? 's' : ''}
              </p>
            )}

          </div>
          {isFetching && !isLoading && (
            <Spinner className="w-4 h-4 text-[#ff2d78]" />
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner className="w-6 h-6 text-[#ff2d78]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {items.length === 0
              ? <EmptyState query={debouncedQ} hasDeals={filterDeals} />
              : items.map(b => (
                <BusinessCard key={b.id || b.slug} business={b} navigate={navigate} />
              ))
            }
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (

          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:opacity-40"
            >
              ← Prev
            </button>

            {/* Numbers */}
            {[...Array(totalPages)]
              .slice(
                Math.max(page - 3, 0),
                Math.min(page + 2, totalPages)
              )
              .map((_, i) => {

                const pageNumber = Math.max(page - 2, 1) + i

                return (

                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === pageNumber
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                  >
                    {pageNumber}
                  </button>

                )
              })}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:opacity-40"
            >
              Next →
            </button>

          </div>

        )}
      </div>
    </div>
  )
}