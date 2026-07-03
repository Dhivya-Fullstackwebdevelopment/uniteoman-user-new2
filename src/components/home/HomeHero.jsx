// import { useState, useRef, useEffect } from 'react'
// import { createPortal } from 'react-dom'
// import { useNavigate } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { businessApi, governorateApi } from '@/lib/api'
// import { Search, Building2, Utensils, Store, Smartphone, Briefcase, ChevronRight, Monitor, Star, BadgeCheck } from 'lucide-react'

// const SUGGESTION_ICONS = {
//   category: {
//     restaurants: Utensils,
//     retail: Store,
//     electronic: Smartphone,
//     'it-software': Monitor,
//     technical: Monitor,
//   },
//   business: Building2
// }


// function AnimatedText({ text, delayOffset = 0 }) {
//   return text.split('').map((char, i) => (
//     <span
//       key={i}
//       className="letter"
//       style={{ animationDelay: `${delayOffset + i * 0.03}s` }}
//     >
//       {char === ' ' ? '\u00A0' : char}
//     </span>
//   ))
// }

// function AiResultCard({ biz, index }) {
//   const navigate = useNavigate()
//   return (
//     <div
//       onClick={() => navigate(`/business/${biz.slug}/book`)}
//       className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg)] cursor-pointer transition-colors group"
//       style={{ animationDelay: `${index * 0.08}s` }}
//     >
//       <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center flex-shrink-0 overflow-hidden border border-[var(--line)]">
//         {biz.logo_url
//           ? <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
//           : <Building2 size={18} className="text-[var(--dim)]" />}
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-1.5 flex-wrap">
//           <span className="text-[13px] font-bold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors truncate">
//             {biz.name}
//           </span>
//           {biz.is_verified && <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" />}
//         </div>
//         <div className="flex items-center gap-2 mt-0.5">
//           {biz.category && (
//             <span className="text-[10px] font-bold text-[var(--dim)] uppercase tracking-wider">{biz.category}</span>
//           )}
//           {biz.governorate && (
//             <span className="text-[10px] text-[var(--dim)]">· {biz.governorate}</span>
//           )}
//           {biz.rating && (
//             <span className="text-[10px] text-[var(--dim)] flex items-center gap-0.5">
//               · <Star size={9} className="fill-amber-400 text-amber-400" /> {biz.rating.toFixed(1)}
//             </span>
//           )}
//         </div>
//         {biz.reason && (
//           <p className="text-[11px] text-[var(--mid)] mt-0.5 leading-tight">{biz.reason}</p>
//         )}
//       </div>
//       <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 flex-shrink-0 mt-1" />
//     </div>
//   )
// }

// export default function HomeHero() {
//   const navigate = useNavigate()
//   const [mode, setMode] = useState('cl') // 'cl' = Quick Search, 'ai' = AI Search
//   const [aiState, setAiState] = useState('idle')
//   const [thinkingTxt, setThinkingTxt] = useState('Understanding your request…')
//   const [aiResults, setAiResults] = useState(null)
//   const [query, setQuery] = useState('')
//   const [quickQuery, setQuickQuery] = useState('')
//   const [quickLocation, setQuickLocation] = useState('')
//   const [suggestions, setSuggestions] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

//   const resultRef = useRef(null)
//   const formRef = useRef(null)      // anchors the portal position
//   const portalRef = useRef(null)    // the portal div itself (for click-outside)

//   // Load governorates — cached 10 min by React Query
//   const { data: governorates = [] } = useQuery({
//     queryKey: ['governorates'],
//     queryFn: governorateApi.list,
//     staleTime: 10 * 60 * 1000,
//   })

//   // Pre-fetch featured businesses — cached 5 min
//   const { data: featuredBusinesses } = useQuery({
//     queryKey: ['featured', 6],
//     queryFn: () => businessApi.featured(6),
//     staleTime: 5 * 60 * 1000,
//   })
//   const tagIcons = {
//     "AC Service": "❄️",
//     "Cleaning": "🧹",
//     "Plumbing": "🔧",
//     "Beauty": "💅",
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const inForm = formRef.current?.contains(e.target)
//       const inPortal = portalRef.current?.contains(e.target)
//       if (!inForm && !inPortal) setShowDropdown(false)
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Recalculate portal position dynamically
//   useEffect(() => {
//     if (!showDropdown || !formRef.current) return
//     const update = () => {
//       const r = formRef.current?.getBoundingClientRect()
//       if (!r) return
//       const isMd = window.innerWidth >= 768
//       const maxW = isMd ? 640 : window.innerWidth - 32
//       const cx = r.left + r.width / 2
//       const left = Math.max(16, cx - maxW / 2)
//       const width = Math.min(maxW, window.innerWidth - 32)
//       setDropdownPos({ top: r.bottom + window.scrollY + 8, left, width })
//     }
//     update()
//     window.addEventListener('scroll', update, { passive: true })
//     window.addEventListener('resize', update, { passive: true })
//     return () => {
//       window.removeEventListener('scroll', update)
//       window.removeEventListener('resize', update)
//     }
//   }, [showDropdown])

//   // Autocomplete & Pre-fetched suggestions engine
//   useEffect(() => {
//     if (!showDropdown) return

//     if (!quickQuery.trim()) {
//       setIsSearching(false)
//       if (featuredBusinesses) {
//         const mapped = featuredBusinesses.map(b => ({
//           id: b.id,
//           name: b.name_en,
//           type: 'business',
//           slug: b.slug,
//           rating: b.rating_avg,
//           category: b.category?.name_en,
//           governorate: b.governorate?.name_en,
//           is_verified: b.is_verified,
//           logo_url: b.logo_url
//         }))
//         setSuggestions(mapped)
//       } else {
//         setIsSearching(true)
//         businessApi.featured(6).then(res => {
//           const mapped = res.map(b => ({
//             id: b.id,
//             name: b.name_en,
//             type: 'business',
//             slug: b.slug,
//             rating: b.rating_avg,
//             category: b.category?.name_en,
//             governorate: b.governorate?.name_en,
//             is_verified: b.is_verified,
//             logo_url: b.logo_url
//           }))
//           setSuggestions(mapped)
//         }).catch(() => { }).finally(() => setIsSearching(false))
//       }
//       return
//     }

//     if (quickQuery.length < 2) return

//     const timer = setTimeout(async () => {
//       setIsSearching(true)
//       try {
//         const results = await businessApi.autocomplete(quickQuery)
//         setSuggestions(results)
//       } catch (err) {
//         console.error('Autocomplete error:', err)
//       } finally {
//         setIsSearching(false)
//       }
//     }, 350)

//     return () => clearTimeout(timer)
//   }, [quickQuery, showDropdown, featuredBusinesses])

//   const handleRunAI = async () => {
//     if (!query.trim()) return
//     setAiState('thinking')
//     setAiResults(null)

//     const steps = [
//       'Understanding your request…',
//       'Scanning 10,000+ Omani businesses…',
//       'Matching with your needs…',
//     ]
//     steps.forEach((txt, i) => setTimeout(() => setThinkingTxt(txt), i * 700))

//     try {
//       const base = import.meta.env.VITE_API_URL || ''
//       const res = await fetch(`${base}/api/ai-search?q=${encodeURIComponent(query)}`)
//       if (!res.ok) throw new Error('Search failed')
//       const data = await res.json()
//       setAiResults(data)
//     } catch {
//       setAiResults({
//         message: 'Unable to complete AI search right now. Try Quick Search instead.',
//         businesses: [],
//         total_found: 0,
//         query,
//       })
//     } finally {
//       setAiState('result')
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
//     }
//   }

//   const handleQuickSearch = (e) => {
//     e?.preventDefault()
//     if (!quickQuery.trim() && !quickLocation) return
//     const params = new URLSearchParams()
//     if (quickQuery.trim()) params.set('q', quickQuery)
//     if (quickLocation) params.set('governorate', quickLocation)
//     navigate(`/businesses?${params.toString()}`)
//     setShowDropdown(false)
//   }

//   const handlePopularTag = (tag) => {
//     const params = new URLSearchParams({ q: tag })
//     if (quickLocation) params.set('governorate', quickLocation)
//     navigate(`/businesses?${params.toString()}`)
//   }

//   const handleSuggestionClick = (s) => {
//     if (s.type === 'category') {
//       navigate(`/businesses?category=${s.slug}`)
//     } else {
//       navigate(`/business/${s.slug}`)
//     }
//     setShowDropdown(false)
//     setQuickQuery('')
//     setSuggestions([])
//   }

//   return (
//     <div className="w-full bg-white text-[#0A0A0F] font-sans antialiased">
//       {/* CSS Vars & Custom Animations Setup */}
//       <style>{`
//         :root {
//           --brand: #D61CA8;
//           --ink: #0A0A0F;
//           --line: rgba(0,0,0,.06);
//           --bg: #F8F9FA;
//           --dim: #9090A0;
//           --mid: #6B7280;
//         }
//         @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: .25 } }
//         @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(214,28,168,.5) } 70% { box-shadow: 0 0 0 10px rgba(214,28,168,0) } }
//         @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-12px) rotate(-1deg) } }
//         @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(2deg) } 50% { transform: translateY(-8px) rotate(2deg) } }
//         @keyframes floatC { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
//         .skel { background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
//         @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
//         .radius {
//   display: inline-block;
//   width: 10px;      /* Reduce size */
//   height: 10px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, #D61CA8 0%, #8B2EF5 50%, #4B6EF5 100%);
//   vertical-align: middle;
//   margin-top: 40px
// }
//       `}</style>

//       {/* ══════════════════════════════════ HERO SECTION ══════════════════════════════════ */}
//       <section style={{ background: '#fff', minHeight: '680px', display: 'flex', alignItems: 'center', padding: '0px 0 40px', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(214,28,168,.1) 0%,rgba(75,110,245,.07) 50%,transparent 70%)', pointerEvents: 'none' }}></div>
//         <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(75,110,245,.08),transparent 70%)', pointerEvents: 'none' }}></div>

//         <div style={{ maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '0 56px', display: 'flex', gap: '80px', alignItems: 'center' }}>

//           {/* Left Content Column */}
//           <div style={{ flex: 1.1, maxWidth: '640px' }}>

//             {/* Live Indicator Badge */}
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,rgba(214,28,168,.08),rgba(75,110,245,.08))', border: '1px solid rgba(214,28,168,.2)', borderRadius: '24px', padding: '8px 16px', marginBottom: '28px' }}>
//               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D61CA8', animation: 'blink 1.8s infinite, pulse 2s infinite' }}></div>
//               <span style={{ font: '600 13px/1 "DM Sans",sans-serif', background: 'linear-gradient(135deg,#D61CA8,#4B6EF5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                 900+ professionals live in Muscat right now
//               </span>
//             </div>

//             {/* Dynamic Animated Headline */}
//             <h1 style={{ font: '600 74px/1.05 "DM Sans",sans-serif', color: '#0A0A0F', letterSpacing: '-3px', marginBottom: '22px' }}>
//               <AnimatedText text="Quality home" delayOffset={0.1} /><br />
//               <AnimatedText text="services," delayOffset={0.4} /><br />
//               <span style={{ position: 'relative', display: 'inline-block' }}>
//                 {/* <AnimatedText text="at your " delayOffset={0.7} />
//                 <span style={{ background: 'linear-gradient(135deg,#D61CA8 0%,#8B2EF5 50%,#4B6EF5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                   doorstep.
//                 </span> */}
//                 <span className="inline-flex items-center whitespace-nowrap">
//                   <AnimatedText text="at your " delayOffset={0.7} />
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       background: 'linear-gradient(135deg,#D61CA8 0%,#8B2EF5 50%,#4B6EF5 100%)',
//                       WebkitBackgroundClip: 'text',
//                       backgroundClip: 'text',
//                       WebkitTextFillColor: 'transparent',
//                       color: 'transparent',
//                     }}
//                   >
//                     doorstep<span className='radius'>.</span>
//                   </span>
//                 </span>
//                 <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} viewBox="0 0 320 12" fill="none">
//                   <path d="M4 8 C60 3, 120 10, 180 6 C240 2, 280 8, 316 5" stroke="url(#ul)" strokeWidth="3" strokeLinecap="round" />
//                   <defs>
//                     <linearGradient id="ul" x1="0" y1="0" x2="100%" y2="0">
//                       <stop offset="0%" stopColor="#D61CA8" /><stop offset="100%" stopColor="#4B6EF5" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//               </span>
//             </h1>

//             <p style={{ font: '400 19px/1.65 "DM Sans",sans-serif', color: '#6B7280', maxWidth: '520px', marginBottom: '38px' }}>
//               Book verified professionals for AC, cleaning, plumbing, beauty and 20+ services — instantly across Muscat &amp; all Oman.
//             </p>

//             {/* Search Container with Mode Toggle Options */}
//             <div style={{ background: 'white', border: '2px solid #E8E8EE', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,.08)', marginBottom: '28px', overflow: 'hidden' }}>
//               {/* Functional Search Engines Contexts */}
//               <div style={{ padding: '8px' }}>
//                 {mode === 'cl' ? (
//                   /* ── Quick Search Execution Form ── */
//                   <form ref={formRef} onSubmit={handleQuickSearch} style={{ display: 'flex', alignItems: 'center', height: '56px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0 16px', borderRight: '1.5px solid #EBEBEF', cursor: 'pointer', flexShrink: 0 }}>
//                       <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0C4.69 0 2 2.69 2 6c0 5.25 6 13 6 13s6-7.75 6-13c0-3.31-2.69-6-6-6z" fill="#D61CA8" /><circle cx="8" cy="6" r="2.5" fill="white" /></svg>
//                       <div>
//                         <div style={{ font: '500 9px "DM Sans",sans-serif', color: '#B0B0C0', letterSpacing: '.7px', textTransform: 'uppercase' }}>Region</div>
//                         <select
//                           style={{ font: '700 13px "DM Sans",sans-serif', color: '#0A0A0F', background: 'transparent', outline: 'none', border: 'none', cursor: 'pointer', paddingRight: '4px' }}
//                           value={quickLocation}
//                           onChange={(e) => setQuickLocation(e.target.value)}
//                         >
//                           <option value="">All Oman</option>
//                           {governorates.map(g => (
//                             <option key={g.id} value={g.slug}>{g.name_en}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px', position: 'relative' }}>
//                       {isSearching ? (
//                         <div style={{ width: '16px', height: '16px', border: '2px solid #D61CA8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '8px' }} />
//                       ) : (
//                         <Search size={18} className="text-gray-400 mr-2" />
//                       )}
//                       <input
//                         style={{ flex: 1, font: '400 15px "DM Sans",sans-serif', color: '#0A0A0F', background: 'transparent', width: '100%', outline: 'none' }}
//                         placeholder="Search AC, cleaning, plumbing, beauty…"
//                         value={quickQuery}
//                         onChange={(e) => setQuickQuery(e.target.value)}
//                         onFocus={() => setShowDropdown(true)}
//                       />
//                     </div>
//                     <button type="submit" style={{ background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', color: 'white', padding: '0 28px', height: '100%', font: '700 15px "DM Sans",sans-serif', cursor: 'pointer', borderRadius: '0 12px 12px 0', flexShrink: 0 }}>
//                       Search
//                     </button>
//                   </form>
//                 ) : (
//                   /* ── Artificial Intelligence Natural Language Formulation Box ── */
//                   <div style={{ padding: '4px' }}>


//                     {/* Operational State Monitors */}
//                     {aiState === 'thinking' && (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', paddingLeft: '8px' }}>
//                         <div style={{ display: 'flex', gap: '4px' }}>
//                           <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D61CA8', animation: 'blink 1s infinite' }}></span>
//                           <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B2EF5', animation: 'blink 1s infinite 0.2s' }}></span>
//                           <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4B6EF5', animation: 'blink 1s infinite 0.4s' }}></span>
//                         </div>
//                         <span style={{ font: '500 12px "DM Sans",sans-serif', color: '#6B7280' }}>{thinkingTxt}</span>
//                       </div>
//                     )}

//                     {aiState === 'result' && aiResults && (
//                       <div ref={resultRef} style={{ marginTop: '12px', border: '1px solid rgba(0,0,0,.06)', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', background: '#fff' }}>
//                         <div style={{ padding: '16px', background: 'linear-gradient(90deg, rgba(214,28,168,.03), rgba(75,110,245,.03))', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
//                             <span style={{ color: '#D61CA8' }}>✦</span>
//                             <span style={{ font: '700 11px "DM Sans",sans-serif', textTransform: 'uppercase', tracking: '1px', color: '#6B7280' }}>AI Assessment Engine</span>
//                             {aiResults.total_found > 0 && (
//                               <span style={{ marginLeft: 'auto', font: '400 11px "DM Sans",sans-serif', color: '#9090A0' }}>{aiResults.total_found} providers screened</span>
//                             )}
//                           </div>
//                           <p style={{ font: '400 14px/1.5 "DM Sans",sans-serif', color: '#0A0A0F' }}>{aiResults.message}</p>
//                         </div>

//                         {aiResults.businesses.length > 0 ? (
//                           <div style={{ display: 'flex', flexDirection: 'column' }}>
//                             {aiResults.businesses.map((biz, idx) => (
//                               <AiResultCard key={biz.id} biz={biz} index={idx} />
//                             ))}
//                           </div>
//                         ) : (
//                           <div style={{ padding: '24px', textAlign: 'center', font: '400 13px "DM Sans"', color: '#9090A0' }}>
//                             No matching providers located. Refine your system constraints.
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Context Action Tags */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
//               <span style={{ font: '500 13px/1 "DM Sans",sans-serif', color: '#B0B0C0' }}>
//                 Popular:
//               </span>

//               {["AC Service", "Cleaning", "Plumbing", "Beauty"].map((tag) => (
//                 <div
//                   key={tag}
//                   onClick={() => handlePopularTag(tag)}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '6px',
//                     padding: '7px 15px',
//                     background: '#F8F8FA',
//                     border: '1px solid #E8E8EE',
//                     borderRadius: '20px',
//                     font: '600 13px/1 "DM Sans",sans-serif',
//                     color: '#555',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = '#D61CA8';
//                     e.currentTarget.style.color = '#D61CA8';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = '#E8E8EE';
//                     e.currentTarget.style.color = '#555';
//                   }}
//                 >
//                   <span>{tagIcons[tag]}</span>
//                   <span>{tag}</span>
//                 </div>
//               ))}
//             </div>
//           </div>


//           {/* <div style={{ flex: 1, position: 'relative', minHeight: '520px' }}>
//             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% ,-50%)', width: '420px', height: '420px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(214,28,168,.07),rgba(75,110,245,.07))', border: '1px solid rgba(214,28,168,.1)' }}></div>


//             <div style={{ position: 'absolute', top: '20px', right: '20px', width: '250px', background: 'white', borderRadius: '22px', padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,.13)', animation: 'floatA 5s ease-in-out infinite' }}>
//               <div style={{ background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
//                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
//                     <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5l2.5 2.5L7.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
//                   </div>
//                   <span style={{ font: '700 11px "DM Sans",sans-serif', color: 'rgba(255,255,255,.9)', letterSpacing: '.3px' }}>BOOKING CONFIRMED</span>
//                 </div>
//                 <div style={{ font: '800 16px/1.3 "DM Sans",sans-serif', color: 'white' }}>AC Deep Cleaning</div>
//                 <div style={{ font: '400 12px "DM Sans",sans-serif', color: 'rgba(255,255,255,.7)', marginTop: '5px' }}>Sat 28 Jun · 10:00 AM</div>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 16px "DM Sans"', color: 'white', flexShrink: 0 }}>M</div>
//                 <div>
//                   <div style={{ font: '700 13px/1.2 "DM Sans",sans-serif', color: '#0A0A0F' }}>Mohammed Al-Balushi</div>
//                   <div style={{ font: '400 11px "DM Sans",sans-serif', color: '#9090A0', marginTop: '3px' }}>On the way · ⬤ 12 min</div>
//                 </div>
//               </div>
//             </div>


//             <div style={{ position: 'absolute', top: '200px', left: 0, width: '190px', background: 'white', borderRadius: '20px', padding: '18px', boxShadow: '0 14px 44px rgba(0,0,0,.11)', animation: 'floatB 6s ease-in-out infinite .7s' }}>
//               <div style={{ width: '52px', height: '52px', background: '#DBEAFE', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' }}>❄️</div>
//               <div style={{ font: '700 14px/1.2 "DM Sans",sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>AC Deep Cleaning</div>
//               <div style={{ font: '400 12px "DM Sans",sans-serif', color: '#9090A0', marginBottom: '10px' }}>From OMR 15</div>
//               <div style={{ display: 'flex', gap: '1px' }}><span style={{ color: '#F59E0B', fontSize: '13px' }}>★★★★★</span></div>
//             </div>


//             <div style={{ position: 'absolute', bottom: '80px', right: '10px', background: 'white', borderRadius: '18px', padding: '14px 18px', boxShadow: '0 10px 32px rgba(0,0,0,.1)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'floatC 4.5s ease-in-out infinite 1.4s' }}>
//               <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#4B6EF5,#8B2EF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 15px "DM Sans"', color: 'white', flexShrink: 0 }}>K</div>
//               <div>
//                 <div style={{ font: '400 11px "DM Sans",sans-serif', color: '#9090A0', marginBottom: '4px' }}>Khalid just rated</div>
//                 <div style={{ font: '700 14px "DM Sans",sans-serif', color: '#0A0A0F' }}>★★★★★ Excellent!</div>
//               </div>
//             </div>


//             <div style={{ position: 'absolute', bottom: '170px', left: '40px', background: '#0A0A0F', borderRadius: '14px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 28px rgba(0,0,0,.25)' }}>
//               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', animation: 'blink 1.8s infinite', flexShrink: 0 }}></div>
//               <div>
//                 <div style={{ font: '700 14px "DM Sans",sans-serif', color: 'white' }}>312 pros near you</div>
//                 <div style={{ font: '400 11px "DM Sans",sans-serif', color: 'rgba(255,255,255,.5)', marginTop: '3px' }}>Muscat · Available now</div>
//               </div>
//             </div>

//           </div> */}
//           {/* ================= RIGHT HERO ================= */}

//           {/* ================= RIGHT HERO - COMPLETELY REDESIGNED ================= */}
//         {/* ================= RIGHT HERO - ELITE MARKETPLACE FEED REDESIGN ================= */}
// <div
//   style={{
//     flex: 1,
//     position: "relative",
//     minHeight: "640px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   }}
// >
//   {/* Injecting New Custom CSS Keyframes dynamically for the redesigned section */}
//   <style>{`
//     @keyframes corePulse {
//       0%, 100% { transform: scale(1); opacity: 0.2; }
//       50% { transform: scale(1.08); opacity: 0.35; }
//     }
//     @keyframes cardFloatX {
//       0%, 100% { transform: translateY(0px) translateX(0px); }
//       50% { transform: translateY(-10px) translateX(6px); }
//     }
//     @keyframes cardFloatY {
//       0%, 100% { transform: translateY(0px) translateX(0px); }
//       50% { transform: translateY(-15px) translateX(-4px); }
//     }
//     @keyframes shimmerBar {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
//   `}</style>

//   {/* Ambient Mesh Glow Effects */}
//   <div
//     style={{
//       position: "absolute",
//       width: "450px",
//       height: "450px",
//       borderRadius: "50%",
//       background: "radial-gradient(circle, rgba(214,28,168,0.15) 0%, rgba(139,46,245,0.08) 50%, transparent 70%)",
//       filter: "blur(50px)",
//       animation: "corePulse 7s ease-in-out infinite",
//     }}
//   />
//   <div
//     style={{
//       position: "absolute",
//       width: "350px",
//       height: "350px",
//       borderRadius: "50%",
//       background: "radial-gradient(circle, rgba(75,110,245,0.12) 0%, transparent 70%)",
//       filter: "blur(40px)",
//       bottom: "5%",
//       right: "5%",
//     }}
//   />

//   {/* ================= MAIN HERO GLASS PLATFORM ================= */}
//   <div
//     style={{
//       position: "relative",
//       width: "360px",
//       background: "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.7) 100%)",
//       backdropFilter: "blur(24px)",
//       WebkitBackdropFilter: "blur(24px)",
//       borderRadius: "32px",
//       padding: "24px",
//       border: "1px solid rgba(255,255,255,0.7)",
//       boxShadow: "0 24px 64px rgba(10,10,15,0.06), inset 0 2px 4px rgba(255,255,255,0.4)",
//       zIndex: 2,
//     }}
//   >
//     {/* Platform Header Status */}
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//         <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#12A150", animation: "blink 1.5s infinite" }} />
//         <span style={{ font: "700 11px 'DM Sans', sans-serif", color: "#12A150", letterSpacing: "1px", textTransform: "uppercase" }}>Live Activity</span>
//       </div>
//       <div style={{ font: "500 11px 'DM Sans', sans-serif", color: "#9090A0", background: "rgba(0,0,0,0.04)", padding: "3px 10px", borderRadius: "12px" }}>
//         Muscat Hub
//       </div>
//     </div>

//     {/* Centerpiece: Active Desired Node */}
//     <div style={{ marginBottom: "20px" }}>
//       <div style={{ font: "500 12px 'DM Sans', sans-serif", color: "#6B7280", marginBottom: "4px" }}>Currently dispatching</div>
//       <div style={{ font: "800 24px 'DM Sans', sans-serif", color: "#0A0A0F", letterSpacing: "-0.5px" }}>Premium Home Care</div>
//     </div>

//     {/* Dynamic Live Matching Feed List */}
//     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//       {/* Feed Row 1 - AC Specialist */}
//       <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
//         <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(214,28,168,0.1), rgba(139,46,245,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
//           ❄️
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <span style={{ font: "700 13px 'DM Sans', sans-serif", color: "#0A0A0F" }}>Al-Balushi AC Systems</span>
//             <span style={{ font: "600 11px 'DM Sans', sans-serif", color: "#D61CA8" }}>Top Match</span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "6px", font: "400 11px 'DM Sans', sans-serif", color: "#6B7280", marginTop: "2px" }}>
//             <span>Verified Pro</span>
//             <span>·</span>
//             <span style={{ display: "flex", alignItems: "center", gap: "2px", color: "#F59E0B" }}>★ 4.9</span>
//           </div>
//         </div>
//       </div>

//       {/* Feed Row 2 - Cleaning Specialist */}
//       <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 4px 12px rgba(0,0,0,0.01)", opacity: 0.85 }}>
//         <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(75,110,245,0.1), rgba(139,46,245,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
//           🧹
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <span style={{ font: "700 13px 'DM Sans', sans-serif", color: "#0A0A0F" }}>EcoClean Oman</span>
//             <span style={{ font: "500 11px 'DM Sans', sans-serif", color: "#9090A0" }}>10 min ago</span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "6px", font: "400 11px 'DM Sans', sans-serif", color: "#6B7280", marginTop: "2px" }}>
//             <span>2.4k Jobs Done</span>
//             <span>·</span>
//             <span style={{ display: "flex", alignItems: "center", gap: "2px", color: "#F59E0B" }}>★ 5.0</span>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Micro Metric Footer */}
//     <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "18px", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//       <div>
//         <div style={{ font: "800 16px 'DM Sans', sans-serif", color: "#0A0A0F" }}>15,000+</div>
//         <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "#9090A0", textTransform: "uppercase" }}>Orders Completed</div>
//       </div>
//       <div style={{ textAlign: "right" }}>
//         <div style={{ font: "800 16px 'DM Sans', sans-serif", color: "#12A150", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
//           <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#12A150", display: "inline-block" }} />
//           312
//         </div>
//         <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "#9090A0", textTransform: "uppercase" }}>Available Pros Now</div>
//       </div>
//     </div>
//   </div>

//   {/* ================= FLOATING CONTEXT-AWARE BADGES ================= */}

//   {/* Badge 1 - Instant Booking Progress Flag (Top Right Overhang) */}
//   <div
//     style={{
//       position: "absolute",
//       top: "10px",
//       right: "-15px",
//       background: "#0A0A0F",
//       borderRadius: "20px",
//       padding: "12px 16px",
//       boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
//       zIndex: 3,
//       animation: "cardFloatX 5.5s ease-in-out infinite",
//       display: "flex",
//       flexDirection: "column",
//       gap: "6px",
//       width: "160px",
//     }}
//   >
//     <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//       <span style={{ fontSize: "12px" }}>⚡</span>
//       <span style={{ font: "700 11px 'DM Sans', sans-serif", color: "#FFF", letterSpacing: "0.5px" }}>Instant Booking</span>
//     </div>
//     {/* Micro Simulated Progress Slider */}
//     <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden", position: "relative" }}>
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100%",
//           width: "75%",
//           background: "linear-gradient(90deg, #D61CA8, #4B6EF5)",
//           borderRadius: "2px",
//         }}
//       />
//       <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmerBar 1.5s infinite" }} />
//     </div>
//     <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)" }}>Matching local experts...</div>
//   </div>

//   {/* Badge 2 - Performance Rating Accent (Bottom Left Overlay) */}
//   <div
//     style={{
//       position: "absolute",
//       bottom: "20px",
//       left: "-20px",
//       background: "#FFF",
//       borderRadius: "18px",
//       padding: "10px 14px",
//       boxShadow: "0 16px 36px rgba(10,10,15,0.08)",
//       zIndex: 3,
//       animation: "cardFloatY 4.8s ease-in-out infinite reverse",
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       border: "1px solid rgba(0,0,0,0.04)",
//     }}
//   >
//     <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", display: "flex", alignItems: "center", justifyCenter: "center", color: "#fff", fontWeight: "bold", fontSize: "12px" }}>
//       ✓
//     </div>
//     <div>
//       <div style={{ font: "800 12px 'DM Sans', sans-serif", color: "#0A0A0F" }}>Trustscore 4.9/5</div>
//       <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "#9090A0" }}>Based on client reviews</div>
//     </div>
//   </div>
// </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════ SEARCH AUTOCOMPLETE DROPDOWN PORTAL ══════════════════════════════════ */}
//       {showDropdown && dropdownPos.width > 0 && createPortal(
//         <div
//           ref={portalRef}
//           style={{
//             position: 'absolute',
//             top: dropdownPos.top,
//             left: dropdownPos.left,
//             width: dropdownPos.width,
//             zIndex: 99999,
//             boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
//             background: 'white',
//             borderRadius: '16px',
//             border: '1px solid rgba(0,0,0,.06)',
//             overflow: 'hidden'
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,.06)', background: '#F8F9FA' }}>
//             <span style={{ font: '700 11px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', tracking: '1px' }}>
//               {quickQuery.trim()
//                 ? (isSearching ? 'Searching database…' : `${suggestions.length} choice${suggestions.length !== 1 ? 's' : ''}`)
//                 : 'Trending Business Listings'}
//             </span>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
//               {isSearching && (
//                 <div style={{ width: '14px', height: '14px', border: '2px solid #D61CA8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//               )}
//               {quickQuery.trim() && (
//                 <button
//                   onMouseDown={(e) => { e.preventDefault(); setQuickQuery(''); setSuggestions([]) }}
//                   style={{ font: '500 11px "DM Sans"', color: '#9090A0', background: 'transparent', cursor: 'pointer' }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>

//           <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px 0' }}>
//             {/* Loading Grid Skeletons */}
//             {isSearching && suggestions.length === 0 && (
//               <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
//                 {[1, 2, 3].map(i => (
//                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #EBEBEF', borderRadius: '12px' }}>
//                     <div className="skel" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }} />
//                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                       <div className="skel" style={{ height: '12px', borderRadius: '4px', width: '70%' }} />
//                       <div className="skel" style={{ height: '8px', borderRadius: '4px', width: '40%' }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Category Node Set */}
//             {!isSearching && suggestions.some(s => s.type === 'category') && (
//               <div style={{ padding: '12px 20px' }}>
//                 <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>Categories</p>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                   {suggestions.filter(s => s.type === 'category').map((s, idx) => {
//                     const Icon = SUGGESTION_ICONS.category[s.slug] || Briefcase
//                     return (
//                       <button
//                         key={`cat-${idx}`}
//                         onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
//                         style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: '#F8F9FA', border: '1px solid #EBEBEF', cursor: 'pointer' }}
//                       >
//                         <Icon size={13} className="text-[#D61CA8]" />
//                         <span style={{ font: '600 12px "DM Sans"', color: '#0A0A0F' }}>{s.name}</span>
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Vendor List Entries */}
//             {!isSearching && suggestions.some(s => s.type === 'business') && (
//               <div style={{ padding: '12px 20px' }}>
//                 <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Service Providers</p>
//                 <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr', gap: '8px' }}>
//                   {suggestions.filter(s => s.type === 'business').map((s, idx) => (
//                     <div
//                       key={`biz-${idx}`}
//                       onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
//                       style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
//                       className="hover:bg-gray-50 hover:border-gray-100"
//                     >
//                       <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F8F9FA', border: '1px solid #EBEBEF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
//                         {s.logo_url ? <img src={s.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={16} className="text-gray-400" />}
//                       </div>
//                       <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                           <span style={{ font: '700 13px "DM Sans"', color: '#0A0A0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
//                           {s.is_verified && <BadgeCheck size={12} className="text-blue-500 flex-shrink-0" />}
//                         </div>
//                         <div style={{ font: '400 11px "DM Sans"', color: '#6B7280', display: 'flex', gap: '4px', marginTop: '2px' }}>
//                           {s.category && <span>{s.category}</span>}
//                           {s.governorate && <span>· {s.governorate}</span>}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Zero State Alert */}
//             {!isSearching && suggestions.length === 0 && quickQuery.trim() && (
//               <div style={{ padding: '32px 16px', textAlign: 'center' }}>
//                 <span style={{ fontSize: '24px' }}>🔍</span>
//                 <div style={{ font: '600 13px "DM Sans"', color: '#0A0A0F', marginTop: '8px' }}>No matches found for "{quickQuery}"</div>
//                 <div style={{ font: '400 11px "DM Sans"', color: '#9090A0', marginTop: '2px' }}>Check terminology variants or switch filters.</div>
//               </div>
//             )}
//           </div>

//           {/* Action Footer */}
//           <div
//             onMouseDown={(e) => { e.preventDefault(); handleQuickSearch() }}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '12px', borderTop: '1px solid rgba(0,0,0,.06)', background: '#F8F9FA', cursor: 'pointer', font: '700 12px "DM Sans"', color: '#D61CA8' }}
//           >
//             {quickQuery.trim() ? `Execute Query for "${quickQuery}"` : 'Browse Complete Platform Index'}
//             <ChevronRight size={14} />
//           </div>
//         </div>,
//         document.body
//       )}
//     </div>
//   )
// }

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { businessApi, governorateApi } from '@/lib/api'
import { Search, Building2, Utensils, Store, Smartphone, Briefcase, ChevronRight, Monitor, Star, BadgeCheck, X } from 'lucide-react'

const SUGGESTION_ICONS = {
  category: {
    restaurants: Utensils,
    retail: Store,
    electronic: Smartphone,
    'it-software': Monitor,
    technical: Monitor,
  },
  business: Building2
}

function AnimatedText({ text, delayOffset = 0 }) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      className="letter"
      style={{ animationDelay: `${delayOffset + i * 0.03}s` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

function AiResultCard({ biz, index }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/business/${biz.slug}/book`)}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg)] cursor-pointer transition-colors group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center flex-shrink-0 overflow-hidden border border-[var(--line)]">
        {biz.logo_url
          ? <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
          : <Building2 size={18} className="text-[var(--dim)]" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors truncate">
            {biz.name}
          </span>
          {biz.is_verified && <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {biz.category && (
            <span className="text-[10px] font-bold text-[var(--dim)] uppercase tracking-wider">{biz.category}</span>
          )}
          {biz.governorate && (
            <span className="text-[10px] text-[var(--dim)]">· {biz.governorate}</span>
          )}
          {biz.rating && (
            <span className="text-[10px] text-[var(--dim)] flex items-center gap-0.5">
              · <Star size={9} className="fill-amber-400 text-amber-400" /> {biz.rating.toFixed(1)}
            </span>
          )}
        </div>
        {biz.reason && (
          <p className="text-[11px] text-[var(--mid)] mt-0.5 leading-tight">{biz.reason}</p>
        )}
      </div>
      <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 flex-shrink-0 mt-1" />
    </div>
  )
}

export default function HomeHero() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('cl')
  const [aiState, setAiState] = useState('idle')
  const [thinkingTxt, setThinkingTxt] = useState('Understanding your request…')
  const [aiResults, setAiResults] = useState(null)
  const [query, setQuery] = useState('')
  const [quickQuery, setQuickQuery] = useState('')
  const [quickLocation, setQuickLocation] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const resultRef = useRef(null)
  const formRef = useRef(null)
  const portalRef = useRef(null)
  const searchInputRef = useRef(null)

  const { data: governorates = [] } = useQuery({
    queryKey: ['governorates'],
    queryFn: governorateApi.list,
    staleTime: 10 * 60 * 1000,
  })

  const { data: featuredBusinesses } = useQuery({
    queryKey: ['featured', 6],
    queryFn: () => businessApi.featured(6),
    staleTime: 5 * 60 * 1000,
  })

  const tagIcons = {
    "AC Service": "❄️",
    "Cleaning": "🧹",
    "Plumbing": "🔧",
    "Beauty": "💅",
  }

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inForm = formRef.current?.contains(e.target)
      const inPortal = portalRef.current?.contains(e.target)
      if (!inForm && !inPortal) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recalculate portal position dynamically
  useEffect(() => {
    if (!showDropdown || !formRef.current) return
    const update = () => {
      const r = formRef.current?.getBoundingClientRect()
      if (!r) return
      const isMd = window.innerWidth >= 768
      const maxW = isMd ? 640 : Math.min(window.innerWidth - 32, 400)
      const cx = r.left + r.width / 2
      const left = Math.max(16, cx - maxW / 2)
      const width = Math.min(maxW, window.innerWidth - 32)
      setDropdownPos({ top: r.bottom + window.scrollY + 8, left, width })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [showDropdown])

  // Autocomplete & Pre-fetched suggestions engine
  useEffect(() => {
    if (!showDropdown) return

    if (!quickQuery.trim()) {
      setIsSearching(false)
      if (featuredBusinesses) {
        const mapped = featuredBusinesses.map(b => ({
          id: b.id,
          name: b.name_en,
          type: 'business',
          slug: b.slug,
          rating: b.rating_avg,
          category: b.category?.name_en,
          governorate: b.governorate?.name_en,
          is_verified: b.is_verified,
          logo_url: b.logo_url
        }))
        setSuggestions(mapped)
      } else {
        setIsSearching(true)
        businessApi.featured(6).then(res => {
          const mapped = res.map(b => ({
            id: b.id,
            name: b.name_en,
            type: 'business',
            slug: b.slug,
            rating: b.rating_avg,
            category: b.category?.name_en,
            governorate: b.governorate?.name_en,
            is_verified: b.is_verified,
            logo_url: b.logo_url
          }))
          setSuggestions(mapped)
        }).catch(() => { }).finally(() => setIsSearching(false))
      }
      return
    }

    if (quickQuery.length < 2) return

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await businessApi.autocomplete(quickQuery)
        setSuggestions(results)
      } catch (err) {
        console.error('Autocomplete error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [quickQuery, showDropdown, featuredBusinesses])

  const handleRunAI = async () => {
    if (!query.trim()) return
    setAiState('thinking')
    setAiResults(null)

    const steps = [
      'Understanding your request…',
      'Scanning 10,000+ Omani businesses…',
      'Matching with your needs…',
    ]
    steps.forEach((txt, i) => setTimeout(() => setThinkingTxt(txt), i * 700))

    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/ai-search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setAiResults(data)
    } catch {
      setAiResults({
        message: 'Unable to complete AI search right now. Try Quick Search instead.',
        businesses: [],
        total_found: 0,
        query,
      })
    } finally {
      setAiState('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
    }
  }

   const [selectedSuggestion, setSelectedSuggestion] = useState(null)

  const handleQuickSearch = (e) => {
    e?.preventDefault()

    if (selectedSuggestion) {
      // If a specific business is selected from autocomplete dropdown, go to booking directly
      if (selectedSuggestion.type === 'business') {
        navigate(`/business/${selectedSuggestion.slug}/book`)
      } else {
        // If a category suggestion is selected
        const params = new URLSearchParams()
        params.set('category', selectedSuggestion.slug)
        if (quickLocation) params.set('governorate', quickLocation)
        navigate(`/businesses?${params.toString()}`)
      }
      setShowDropdown(false)
      setQuickQuery('')
      setSelectedSuggestion(null)
      return
    }

    if (!quickQuery.trim() && !quickLocation) return
    
    const params = new URLSearchParams()
    if (quickQuery.trim()) params.set('q', quickQuery)
    if (quickLocation) params.set('governorate', quickLocation)
    
    navigate(`/businesses?${params.toString()}`)
    setShowDropdown(false)
  }

  const handlePopularTag = (tag) => {
    const params = new URLSearchParams({ q: tag })
    if (quickLocation) params.set('governorate', quickLocation)
    navigate(`/businesses?${params.toString()}`)
  }

  const handleSuggestionClick = (s) => {
    const params = new URLSearchParams()
    
    if (s.type === 'category') {
      params.set('category', s.slug)
    } else {
      // If it's an alternate business node click layout path inside autocomplete
      params.set('q', s.name)
    }
    
    // Crucial: capture the current dropdown location state too!
    if (quickLocation) params.set('governorate', quickLocation)
    
    navigate(`/businesses?${params.toString()}`)
    setShowDropdown(false)
    setQuickQuery('')
    setSuggestions([])
    setSelectedSuggestion(null)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuickQuery(value)
    setSelectedSuggestion(null)
    if (value.trim()) {
      setShowDropdown(true)
    }
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  return (
    <div className="w-full bg-white text-[#0A0A0F] font-sans antialiased">
      <style>{`
        :root {
          --brand: #D61CA8;
          --ink: #0A0A0F;
          --line: rgba(0,0,0,.06);
          --bg: #F8F9FA;
          --dim: #9090A0;
          --mid: #6B7280;
        }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: .25 } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(214,28,168,.5) } 70% { box-shadow: 0 0 0 10px rgba(214,28,168,0) } }
        @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-12px) rotate(-1deg) } }
        @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(2deg) } 50% { transform: translateY(-8px) rotate(2deg) } }
        @keyframes floatC { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        .skel { background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .radius {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D61CA8 0%, #8B2EF5 50%, #4B6EF5 100%);
          vertical-align: middle;
          margin-top: 40px
        }
        @keyframes cardFloatX {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes cardFloatY {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-4px); }
        }
        @keyframes shimmerBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.08); opacity: 0.35; }
        }
        @media (max-width: 768px) {
          .radius { margin-top: 20px; width: 8px; height: 8px; }
        }
          
      `}</style>

      {/* HERO SECTION */}
      <section style={{
        background: '#fff',
        minHeight: isMobile ? 'auto' : '680px',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '20px 0 40px' : '0px 0 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: isMobile ? '400px' : '700px',
          height: isMobile ? '400px' : '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(214,28,168,.1) 0%,rgba(75,110,245,.07) 50%,transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: isMobile ? '250px' : '400px',
          height: isMobile ? '250px' : '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(75,110,245,.08),transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1300px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 56px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '40px' : '80px',
          alignItems: 'center'
        }}>

          {/* Left Content Column */}
          <div style={{ flex: 1.1, maxWidth: isMobile ? '100%' : '640px', width: '100%' }}>

            {/* Live Indicator Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg,rgba(214,28,168,.08),rgba(75,110,245,.08))',
              border: '1px solid rgba(214,28,168,.2)',
              borderRadius: '24px',
              padding: isMobile ? '6px 12px' : '8px 16px',
              marginBottom: isMobile ? '20px' : '28px',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D61CA8', animation: 'blink 1.8s infinite, pulse 2s infinite' }}></div>
              <span style={{
                font: isMobile ? '600 10px/1 "DM Sans",sans-serif' : '600 13px/1 "DM Sans",sans-serif',
                background: 'linear-gradient(135deg,#D61CA8,#4B6EF5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                900+ professionals live in Muscat right now
              </span>
            </div>

            {/* Dynamic Animated Headline */}
            <h1 style={{
              font: isMobile ? '600 32px/1.1 "DM Sans",sans-serif' : '600 74px/1.05 "DM Sans",sans-serif',
              color: '#0A0A0F',
              letterSpacing: isMobile ? '-1px' : '-3px',
              marginBottom: isMobile ? '16px' : '22px'
            }}>
              <AnimatedText text="Quality home" delayOffset={0.1} /><br />
              <AnimatedText text="services," delayOffset={0.4} /><br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span className="inline-flex items-center whitespace-nowrap flex-wrap">
                  <AnimatedText text="at your " delayOffset={0.7} />
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg,#D61CA8 0%,#8B2EF5 50%,#4B6EF5 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}
                  >
                    doorstep<span className='radius'>.</span>
                  </span>
                </span>
                {!isMobile && (
                  <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} viewBox="0 0 320 12" fill="none">
                    <path d="M4 8 C60 3, 120 10, 180 6 C240 2, 280 8, 316 5" stroke="url(#ul)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="ul" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stopColor="#D61CA8" /><stop offset="100%" stopColor="#4B6EF5" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </span>
            </h1>

            <p style={{
              font: isMobile ? '400 15px/1.6 "DM Sans",sans-serif' : '400 19px/1.65 "DM Sans",sans-serif',
              color: '#6B7280',
              maxWidth: isMobile ? '100%' : '520px',
              marginBottom: isMobile ? '24px' : '38px'
            }}>
              Book verified professionals for AC, cleaning, plumbing, beauty and 20+ services — instantly across Muscat &amp; all Oman.
            </p>

            {/* Search Container */}
            {/* Search Container */}
            <div style={{
              background: 'white',
              border: '2px solid #E8E8EE',
              borderRadius: isMobile ? '14px' : '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,.08)',
              marginBottom: '28px',
              overflow: 'hidden',
              width: '100%'
            }}>
              <div style={{ padding: isMobile ? '4px' : '0px' }}>
                {mode === 'cl' ? (
                  <form
                    ref={formRef}
                    onSubmit={handleQuickSearch}
                    style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'stretch' : 'center',
                      height: isMobile ? 'auto' : '64px',
                      background: 'white',
                      width: '100%'
                    }}
                  >
                    {/* Area Dropdown Selector */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: isMobile ? '12px 16px' : '0 22px',
                      borderRight: isMobile ? 'none' : '1.5px solid #EBEBEF',
                      borderBottom: isMobile ? '1.5px solid #EBEBEF' : 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M8 0C4.69 0 2 2.69 2 6c0 5.25 6 13 6 13s6-7.75 6-13c0-3.31-2.69-6-6-6z" fill="#D61CA8" />
                        <circle cx="8" cy="6" r="2.5" fill="white" />
                      </svg>

                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ font: "500 10px/1 'DM Sans',sans-serif", color: '#B0B0C0', letterSpacing: '.7px', textTransform: 'uppercase' }}>
                          Area
                        </div>

                        {/* Functional Select dropdown masked exactly to your static styling layout */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', position: 'relative' }}>
                          <select
                            value={quickLocation}
                            onChange={(e) => setQuickLocation(e.target.value)}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              cursor: 'pointer',
                              zIndex: 2
                            }}
                          >
                            <option value="">All Oman</option>
                            {governorates.map(g => (
                              <option key={g.id} value={g.slug}>{g.name_en}</option>
                            ))}
                          </select>

                          <span style={{ font: "700 14px/1.3 'DM Sans',sans-serif", color: '#0A0A0F', whiteSpace: 'nowrap' }}>
                            {governorates.find(g => g.slug === quickLocation)?.name_en || 'All Oman'}
                          </span>
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M3 4.5l3 3 3-3" stroke="#0A0A0F" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Input Text Area Section */}
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative', padding: isMobile ? '10px 16px' : '0 22px' }}>
                      {isSearching && (
                        <div style={{ width: '16px', height: '16px', border: '2px solid #D61CA8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '10px', flexShrink: 0 }} />
                      )}
                      <input
                        ref={searchInputRef}
                        style={{
                          flex: 1,
                          font: "400 16px/1 'DM Sans',sans-serif",
                          color: '#0A0A0F',
                          background: 'transparent',
                          width: '100%',
                          outline: 'none',
                          border: 'none'
                        }}
                        placeholder="Search AC, cleaning, plumbing, beauty…"
                        value={quickQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                      {quickQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickQuery('')
                            setSuggestions([])
                            setSelectedSuggestion(null)
                            searchInputRef.current?.focus()
                          }}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: '#9090A0', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Submit Execution Button */}
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)',
                        color: 'white',
                        padding: isMobile ? '12px' : '0 40px',
                        height: isMobile ? '48px' : '100%',
                        font: "700 16px/1 'DM Sans',sans-serif",
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        borderRadius: isMobile ? '12px' : '0 14px 14px 0',
                        flexShrink: 0,
                        border: 'none',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      Search
                    </button>
                  </form>
                ) : (
                  /* AI Search Block Execution Path */
                  <div style={{ padding: '4px' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? '8px' : '0',
                      alignItems: isMobile ? 'stretch' : 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        padding: isMobile ? '10px 14px' : '0 16px',
                        border: isMobile ? '1px solid #E8E8EE' : 'none',
                        borderRadius: isMobile ? '10px' : '0'
                      }}>
                        <Search size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                        <input
                          style={{
                            flex: 1,
                            font: isMobile ? '400 14px "DM Sans",sans-serif' : '400 15px "DM Sans",sans-serif',
                            color: '#0A0A0F',
                            background: 'transparent',
                            width: '100%',
                            outline: 'none',
                            minHeight: isMobile ? '36px' : 'auto',
                            border: 'none'
                          }}
                          placeholder="Describe what you need..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRunAI()}
                        />
                      </div>
                      <button
                        onClick={handleRunAI}
                        style={{
                          background: 'linear-gradient(135deg,#8B2EF5,#4B6EF5)',
                          color: 'white',
                          padding: isMobile ? '12px' : '0 28px',
                          height: isMobile ? '56px' : '56px',
                          font: isMobile ? '700 14px "DM Sans",sans-serif' : '700 15px "DM Sans",sans-serif',
                          cursor: 'pointer',
                          borderRadius: isMobile ? '10px' : '0 12px 12px 0',
                          flexShrink: 0,
                          border: 'none',
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >
                        AI Search
                      </button>
                    </div>

                    {/* AI Processing and Feedback UI Elements */}
                    {aiState === 'thinking' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', paddingLeft: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D61CA8', animation: 'blink 1s infinite' }}></span>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B2EF5', animation: 'blink 1s infinite 0.2s' }}></span>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4B6EF5', animation: 'blink 1s infinite 0.4s' }}></span>
                        </div>
                        <span style={{ font: isMobile ? '400 11px "DM Sans",sans-serif' : '500 12px "DM Sans",sans-serif', color: '#6B7280' }}>{thinkingTxt}</span>
                      </div>
                    )}

                    {aiState === 'result' && aiResults && (
                      <div ref={resultRef} style={{ marginTop: '12px', border: '1px solid rgba(0,0,0,.06)', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', background: '#fff' }}>
                        <div style={{ padding: '16px', background: 'linear-gradient(90deg, rgba(214,28,168,.03), rgba(75,110,245,.03))', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#D61CA8' }}>✦</span>
                            <span style={{ font: '700 11px "DM Sans",sans-serif', textTransform: 'uppercase', letterSpacing: '1px', color: '#6B7280' }}>AI Assessment Engine</span>
                            {aiResults.total_found > 0 && (
                              <span style={{ marginLeft: 'auto', font: '400 11px "DM Sans",sans-serif', color: '#9090A0' }}>{aiResults.total_found} providers screened</span>
                            )}
                          </div>
                          <p style={{ font: isMobile ? '400 13px/1.5 "DM Sans",sans-serif' : '400 14px/1.5 "DM Sans",sans-serif', color: '#0A0A0F' }}>{aiResults.message}</p>
                        </div>

                        {aiResults.businesses.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {aiResults.businesses.map((biz, idx) => (
                              <AiResultCard key={biz.id} biz={biz} index={idx} />
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '24px', textAlign: 'center', font: '400 13px "DM Sans"', color: '#9090A0' }}>
                            No matching providers located. Refine your system constraints.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Context Action Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ font: isMobile ? '500 11px/1 "DM Sans",sans-serif' : '500 13px/1 "DM Sans",sans-serif', color: '#B0B0C0' }}>
                Popular:
              </span>

              {["AC Service", "Cleaning", "Plumbing", "Beauty"].map((tag) => (
                <div
                  key={tag}
                  onClick={() => handlePopularTag(tag)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isMobile ? '5px 12px' : '7px 15px',
                    background: '#F8F8FA',
                    border: '1px solid #E8E8EE',
                    borderRadius: '20px',
                    font: isMobile ? '600 11px/1 "DM Sans",sans-serif' : '600 13px/1 "DM Sans",sans-serif',
                    color: '#555',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D61CA8';
                    e.currentTarget.style.color = '#D61CA8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E8EE';
                    e.currentTarget.style.color = '#555';
                  }}
                >
                  <span>{tagIcons[tag]}</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero - Hide on mobile */}
          {!isMobile && (
            <div
              style={{
                flex: 1,
                position: "relative",
                minHeight: "640px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Ambient Mesh Glow Effects */}
              <div
                style={{
                  position: "absolute",
                  width: "450px",
                  height: "450px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(214,28,168,0.15) 0%, rgba(139,46,245,0.08) 50%, transparent 70%)",
                  filter: "blur(50px)",
                  animation: "corePulse 7s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "350px",
                  height: "350px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(75,110,245,0.12) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  bottom: "5%",
                  right: "5%",
                }}
              />

              {/* Main Hero Glass Platform */}
              <div style={{ flex: 1, position: 'relative', minHeight: '520px' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% ,-50%)', width: '420px', height: '420px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(214,28,168,.07),rgba(75,110,245,.07))', border: '1px solid rgba(214,28,168,.1)' }}></div>


                <div style={{ position: 'absolute', top: '20px', right: '20px', width: '250px', background: 'white', borderRadius: '22px', padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,.13)', animation: 'floatA 5s ease-in-out infinite' }}>
                  <div style={{ background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                        <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5l2.5 2.5L7.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                      </div>
                      <span style={{ font: '700 11px "DM Sans",sans-serif', color: 'rgba(255,255,255,.9)', letterSpacing: '.3px' }}>BOOKING CONFIRMED</span>
                    </div>
                    <div style={{ font: '800 16px/1.3 "DM Sans",sans-serif', color: 'white' }}>AC Deep Cleaning</div>
                    <div style={{ font: '400 12px "DM Sans",sans-serif', color: 'rgba(255,255,255,.7)', marginTop: '5px' }}>Sat 28 Jun · 10:00 AM</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#D61CA8,#8B2EF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 16px "DM Sans"', color: 'white', flexShrink: 0 }}>M</div>
                    <div>
                      <div style={{ font: '700 13px/1.2 "DM Sans",sans-serif', color: '#0A0A0F' }}>Mohammed Al-Balushi</div>
                      <div style={{ font: '400 11px "DM Sans",sans-serif', color: '#9090A0', marginTop: '3px' }}>On the way · ⬤ 12 min</div>
                    </div>
                  </div>
                </div>


                <div style={{ position: 'absolute', top: '200px', left: 0, width: '190px', background: 'white', borderRadius: '20px', padding: '18px', boxShadow: '0 14px 44px rgba(0,0,0,.11)', animation: 'floatB 6s ease-in-out infinite .7s' }}>
                  <div style={{ width: '52px', height: '52px', background: '#DBEAFE', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' }}>❄️</div>
                  <div style={{ font: '700 14px/1.2 "DM Sans",sans-serif', color: '#0A0A0F', marginBottom: '4px' }}>AC Deep Cleaning</div>
                  <div style={{ font: '400 12px "DM Sans",sans-serif', color: '#9090A0', marginBottom: '10px' }}>From OMR 15</div>
                  <div style={{ display: 'flex', gap: '1px' }}><span style={{ color: '#F59E0B', fontSize: '13px' }}>★★★★★</span></div>
                </div>


                <div style={{ position: 'absolute', bottom: '80px', right: '10px', background: 'white', borderRadius: '18px', padding: '14px 18px', boxShadow: '0 10px 32px rgba(0,0,0,.1)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'floatC 4.5s ease-in-out infinite 1.4s' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#4B6EF5,#8B2EF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 15px "DM Sans"', color: 'white', flexShrink: 0 }}>K</div>
                  <div>
                    <div style={{ font: '400 11px "DM Sans",sans-serif', color: '#9090A0', marginBottom: '4px' }}>Khalid just rated</div>
                    <div style={{ font: '700 14px "DM Sans",sans-serif', color: '#0A0A0F' }}>★★★★★ Excellent!</div>
                  </div>
                </div>


                <div style={{ position: 'absolute', bottom: '170px', left: '180px', background: '#0A0A0F', borderRadius: '14px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 28px rgba(0,0,0,.25)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', animation: 'blink 1.8s infinite', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ font: '700 14px "DM Sans",sans-serif', color: 'white' }}>312 pros near you</div>
                    <div style={{ font: '400 11px "DM Sans",sans-serif', color: 'rgba(255,255,255,.5)', marginTop: '3px' }}>Muscat · Available now</div>
                  </div>
                </div>

              </div>

              {/* Floating Badges */}
              {/* <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "-15px",
                  background: "#0A0A0F",
                  borderRadius: "20px",
                  padding: "12px 16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  zIndex: 3,
                  animation: "cardFloatX 5.5s ease-in-out infinite",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "160px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px" }}>⚡</span>
                  <span style={{ font: "700 11px 'DM Sans', sans-serif", color: "#FFF", letterSpacing: "0.5px" }}>Instant Booking</span>
                </div>
                <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "75%",
                      background: "linear-gradient(90deg, #D61CA8, #4B6EF5)",
                      borderRadius: "2px",
                    }}
                  />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmerBar 1.5s infinite" }} />
                </div>
                <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)" }}>Matching local experts...</div>
              </div> */}

              {/* <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "-20px",
                  background: "#FFF",
                  borderRadius: "18px",
                  padding: "10px 14px",
                  boxShadow: "0 16px 36px rgba(10,10,15,0.08)",
                  zIndex: 3,
                  animation: "cardFloatY 4.8s ease-in-out infinite reverse",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "12px" }}>
                  ✓
                </div>
                <div>
                  <div style={{ font: "800 12px 'DM Sans', sans-serif", color: "#0A0A0F" }}>Trustscore 4.9/5</div>
                  <div style={{ font: "500 10px 'DM Sans', sans-serif", color: "#9090A0" }}>Based on client reviews</div>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </section>

      {/* Search Autocomplete Dropdown Portal */}
      {showDropdown && dropdownPos.width > 0 && createPortal(
        <div
          ref={portalRef}
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 99999,
            boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            background: 'white',
            borderRadius: isMobile ? '12px' : '16px',
            border: '1px solid rgba(0,0,0,.06)',
            overflow: 'hidden',
            maxHeight: isMobile ? '60vh' : 'auto'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '10px 16px' : '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,.06)',
            background: '#F8F9FA'
          }}>
            <span style={{ font: isMobile ? '600 10px "DM Sans"' : '700 11px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {quickQuery.trim()
                ? (isSearching ? 'Searching database…' : `${suggestions.length} choice${suggestions.length !== 1 ? 's' : ''}`)
                : 'Trending Business Listings'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isSearching && (
                <div style={{ width: '14px', height: '14px', border: '2px solid #D61CA8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              )}
              {quickQuery.trim() && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setQuickQuery(''); setSuggestions([]); setSelectedSuggestion(null) }}
                  style={{ font: isMobile ? '500 10px "DM Sans"' : '500 11px "DM Sans"', color: '#9090A0', background: 'transparent', cursor: 'pointer', border: 'none' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight: isMobile ? '40vh' : '400px', overflowY: 'auto', padding: isMobile ? '4px 0' : '8px 0' }}>
            {/* Loading Grid Skeletons */}
            {isSearching && suggestions.length === 0 && (
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #EBEBEF', borderRadius: '12px' }}>
                    <div className="skel" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="skel" style={{ height: '12px', borderRadius: '4px', width: '70%' }} />
                      <div className="skel" style={{ height: '8px', borderRadius: '4px', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category Node Set */}
            {!isSearching && suggestions.some(s => s.type === 'category') && (
              <div style={{ padding: isMobile ? '8px 16px' : '12px 20px' }}>
                <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>Categories</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {suggestions.filter(s => s.type === 'category').map((s, idx) => {
                    const Icon = SUGGESTION_ICONS.category[s.slug] || Briefcase
                    return (
                      <button
                        key={`cat-${idx}`}
                        onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '6px 10px' : '8px 12px', borderRadius: '10px', background: '#F8F9FA', border: '1px solid #EBEBEF', cursor: 'pointer' }}
                      >
                        <Icon size={isMobile ? 12 : 13} className="text-[#D61CA8]" />
                        <span style={{ font: isMobile ? '500 11px "DM Sans"' : '600 12px "DM Sans"', color: '#0A0A0F' }}>{s.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Vendor List Entries */}
            {!isSearching && suggestions.some(s => s.type === 'business') && (
              <div style={{ padding: isMobile ? '8px 16px' : '12px 20px' }}>
                <p style={{ font: '700 9px "DM Sans"', color: '#9090A0', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Service Providers</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                  {suggestions.filter(s => s.type === 'business').map((s, idx) => (
                    <div
                      key={`biz-${idx}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: isMobile ? '8px' : '10px',
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: selectedSuggestion?.id === s.id ? '#f3f4f6' : 'transparent'
                      }}
                      className="hover:bg-gray-50 hover:border-gray-100"
                      onMouseEnter={() => setSelectedSuggestion(s)}
                      onMouseLeave={() => setSelectedSuggestion(null)}
                    >
                      <div style={{ width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px', borderRadius: '10px', background: '#F8F9FA', border: '1px solid #EBEBEF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {s.logo_url ? <img src={s.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={isMobile ? 14 : 16} className="text-gray-400" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ font: isMobile ? '600 12px "DM Sans"' : '700 13px "DM Sans"', color: '#0A0A0F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                          {s.is_verified && <BadgeCheck size={isMobile ? 10 : 12} className="text-blue-500 flex-shrink-0" />}
                        </div>
                        <div style={{ font: isMobile ? '400 10px "DM Sans"' : '400 11px "DM Sans"', color: '#6B7280', display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                          {s.category && <span>{s.category}</span>}
                          {s.governorate && <span>· {s.governorate}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zero State Alert */}
            {!isSearching && suggestions.length === 0 && quickQuery.trim() && (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <span style={{ fontSize: '24px' }}>🔍</span>
                <div style={{ font: '600 13px "DM Sans"', color: '#0A0A0F', marginTop: '8px' }}>No matches found for "{quickQuery}"</div>
                <div style={{ font: '400 11px "DM Sans"', color: '#9090A0', marginTop: '2px' }}>Check terminology variants or switch filters.</div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div
            onMouseDown={(e) => { e.preventDefault(); handleQuickSearch(e) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: isMobile ? '10px' : '12px',
              borderTop: '1px solid rgba(0,0,0,.06)',
              background: '#F8F9FA',
              cursor: 'pointer',
              font: isMobile ? '600 11px "DM Sans"' : '700 12px "DM Sans"',
              color: '#D61CA8'
            }}
          >
            {quickQuery.trim() ? `Search for "${quickQuery}"` : 'Browse Complete Platform Index'}
            <ChevronRight size={isMobile ? 12 : 14} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

