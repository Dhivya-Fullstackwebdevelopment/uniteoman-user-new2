import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { adminApi, businessApi, reviewApi, categoryApi, contactApi, governorateApi, commonApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/utils'
import { Spinner, Pagination } from '@/components/ui'
import { Sparkles, Calendar , Bell , LayoutDashboard, Building2, Star, LogOut, CheckCircle, XCircle, Eye, Trash2, X, Users, FolderTree, Plus, Edit2, MessageSquare, Mail, Phone, Clock, Zap, Search, MapPin, Image as ImageIcon, Save, Upload, Globe, ShieldAlert, Download, AlertCircle } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import toast from 'react-hot-toast';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'
import { z } from 'zod';


const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
// ── Login Page ────────────────────────────────────────────────
function AdminLoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setLoading(true)
    const success = await login(form.email, form.password)
    if (success) navigate('/admin', { replace: true })
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: '"DM Sans", sans-serif',
        background: '#F8F8FA'
      }}
    >
      <div
        className="bg-white rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,.08)] p-8 w-full max-w-md"
        style={{ border: '1px solid rgba(0,0,0,.04)' }}
      >
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: BRAND_GRADIENT }}
            >
              <span className="text-2xl text-white">🔐</span>
            </div>
          </div>
          <h1
            className="text-2xl font-black text-[#0A0A0F] tracking-tight"
          >
            Admin Login
          </h1>
          <p className="text-sm text-[#9090A0] font-medium mt-1">
            UniteOman Control Panel
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.email}
              placeholder="admin@uniteoman.com"
              onChange={e => handleInputChange('email', e.target.value)}
              style={{
                border: errors.email ? '1px solid #ef4444' : '1px solid #dfdee5',
                background: '#F8F8FA'
              }}
              className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
              onFocus={e => {
                e.target.style.borderColor = BRAND_FROM
                e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)'
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.email ? '#ef4444' : '#dfdee5'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                <AlertCircle size={12} strokeWidth={2.5} />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={e => handleInputChange('password', e.target.value)}
              style={{
                border: errors.password ? '1px solid #ef4444' : '1px solid #dfdee5',
                background: '#F8F8FA'
              }}
              className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
              onFocus={e => {
                e.target.style.borderColor = BRAND_FROM
                e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)'
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.password ? '#ef4444' : '#dfdee5'
                e.target.style.boxShadow = 'none'
              }}
            />
            {errors.password && (
              <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                <AlertCircle size={12} strokeWidth={2.5} />
                {errors.password}
              </p>
            )}
          </div>

          {/* ── AI Tip ── */}
          <div
            className="rounded-[10px] px-3 py-2 flex items-center gap-1.5 mt-1"
            style={{ background: 'rgba(214,28,168,.05)' }}
          >
            <Sparkles size={12} style={{ color: BRAND_FROM }} />
            <span className="text-[11px] leading-snug text-[#6B7280]">
              <span style={{ color: BRAND_FROM, fontWeight: 600 }}>Secure:</span> Your session is encrypted and protected.
            </span>
          </div>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[15px] rounded-[14px] text-center text-[15px] font-bold text-white mt-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: BRAND_GRADIENT,
              boxShadow: '0 6px 20px rgba(214,28,168,.35)'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in…
              </>
            ) : (
              'Log In →'
            )}
          </button>

          <div className="text-center text-[11px] text-[#9090A0] font-medium mt-1">
            Authorized administrators only
          </div>
        </form>
      </div>
    </div>
  )
}
// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${color}`}>{icon}</div>
      <div className="font-display text-3xl font-normal text-ink mb-0.5 brand-text">{value ?? '–'}</div>
      <div className="text-sm font-bold text-ink">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-50 text-green-700 border border-green-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    suspended: 'bg-red-50 text-red-700 border border-red-200',
    rejected: 'bg-gray-100 text-gray-500 border border-gray-200',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${map[status] || map.rejected}`}>
      {status}
    </span>
  )
}

// ── Business Table (cards on mobile, table on desktop) ────────
function BusinessTable({ defaultStatus = '' }) {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState(defaultStatus)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const [deleteBusiness, setDeleteBusiness] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-businesses', page, statusFilter],
    queryFn: () => businessApi.adminAll({ page, per_page: 10, status: statusFilter || undefined })
  })

  const approveMutation = useMutation({
    mutationFn: (id) => businessApi.adminUpdate(id, { status: 'active' }),
    onSuccess: () => { toast.success('Business approved'); qc.invalidateQueries(['admin-businesses']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const rejectMutation = useMutation({
    mutationFn: (id) => businessApi.adminUpdate(id, { status: 'rejected' }),
    onSuccess: () => { toast.success('Business rejected'); qc.invalidateQueries(['admin-businesses']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const deleteMutation = useMutation({
    mutationFn: businessApi.adminDelete,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-businesses']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="font-bold text-ink text-lg">Businesses</h2>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 bg-white text-ink transition-all">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Business', 'Category', 'Governorate', 'Plan', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm text-ink">{b.name_en}</div>
                      <div className="text-xs text-gray-400">{b.name_ar}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.category?.name_en || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.governorate?.name_en || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-purple bg-purple-light px-2 py-0.5 rounded-full capitalize">{b.plan}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <BusinessActions b={b} approveMutation={approveMutation} rejectMutation={rejectMutation} deleteMutation={deleteMutation} setSelectedBusiness={setSelectedBusiness} setDeleteBusiness={setDeleteBusiness} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {data?.items?.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-sm text-ink">{b.name_en}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{b.name_ar}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Category</div>
                    <div className="text-xs font-semibold text-ink">{b.category?.name_en || '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Governorate</div>
                    <div className="text-xs font-semibold text-ink">{b.governorate?.name_en || '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Plan</div>
                    <div className="text-xs font-bold text-purple capitalize">{b.plan}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <BusinessActions b={b} approveMutation={approveMutation} rejectMutation={rejectMutation} deleteMutation={deleteMutation} setSelectedBusiness={setSelectedBusiness} setDeleteBusiness={setDeleteBusiness} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
          </div>
        </>
      )}

      {/* Business Details Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-ink">Business Details</h3>
              <button onClick={() => setSelectedBusiness(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-2xl shadow-sm">
                  {selectedBusiness.category?.icon || '🏢'}
                </div>
                <div>
                  <h4 className="font-display text-xl font-normal text-ink">{selectedBusiness.name_en}</h4>
                  <p className="text-gray-400 text-sm font-semibold">{selectedBusiness.category?.name_en} • {selectedBusiness.governorate?.name_en}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple uppercase tracking-widest mb-1">Plan Type</p>
                  <p className="font-bold text-ink capitalize">{selectedBusiness.plan || 'basic'}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${selectedBusiness.status === 'active' ? 'bg-green-50/30 border-green-100' : 'bg-amber-50/30 border-amber-100'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${selectedBusiness.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>Status</p>
                  <p className="font-bold text-ink capitalize">{selectedBusiness.status}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-pink-light text-pink flex items-center justify-center flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendor Email</p>
                    <p className="text-sm font-bold text-ink">{selectedBusiness.owner_email || 'Not available'}</p>
                  </div>
                </div>
                {selectedBusiness.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-ink">{selectedBusiness.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} className="text-amber-500" />
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Verification Documents</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'ID Proof', url: selectedBusiness.id_proof_url, required: true },
                    { label: 'Owner Photo', url: selectedBusiness.owner_photo_url, required: true },
                    { label: 'Trade License', url: selectedBusiness.trade_license_url, required: false },
                  ].map(({ label, url, required }) => (
                    <div key={label} className="flex flex-col gap-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {label} {required && <span className="text-red-400">*</span>}
                      </p>
                      {url ? (
                        url.match(/\.(pdf)$/i) ? (
                          <a href={url.startsWith('/') ? import.meta.env.VITE_API_URL + url : url}
                            target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                            <Download size={14} /> View PDF
                          </a>
                        ) : (
                          <button
                            onClick={() => setLightboxUrl(url.startsWith('/') ? import.meta.env.VITE_API_URL + url : url)}
                            className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-pink transition-colors cursor-pointer">
                            <img src={url.startsWith('/') ? import.meta.env.VITE_API_URL + url : url}
                              className="w-full h-full object-cover" alt={label}
                              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                            <div style={{ display: 'none' }} className="absolute inset-0 bg-gray-100 items-center justify-center text-gray-400 text-xs font-bold">Error</div>
                            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all flex items-center justify-center">
                              <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        )
                      ) : (
                        <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                          <span className="text-[9px] text-gray-400 font-bold uppercase">{required ? 'Not submitted' : 'Optional'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={`/business/${selectedBusiness.slug}`} target="_blank" rel="noreferrer"
                  className="flex-1 min-w-[120px] py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 text-center hover:bg-gray-50 transition-colors flex items-center justify-center">
                  View Public
                </a>
                {selectedBusiness.status === 'pending' ? (
                  <>
                    <button disabled={approveMutation.isPending}
                      onClick={() => approveMutation.mutate(selectedBusiness.id, { onSuccess: () => setSelectedBusiness(null) })}
                      className="flex-1 min-w-[120px] bg-green-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {approveMutation.isPending ? <Spinner className="w-4 h-4" /> : <CheckCircle size={16} />} Approve
                    </button>
                    <button disabled={rejectMutation.isPending}
                      onClick={() => rejectMutation.mutate(selectedBusiness.id, { onSuccess: () => setSelectedBusiness(null) })}
                      className="flex-1 min-w-[120px] bg-amber-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {rejectMutation.isPending ? <Spinner className="w-4 h-4" /> : <X size={16} />} Reject
                    </button>
                  </>
                ) : (
                  <button disabled={deleteMutation.isPending}
                    onClick={() => { if (confirm('Delete this business?')) deleteMutation.mutate(selectedBusiness.id, { onSuccess: () => setSelectedBusiness(null) }) }}
                    className="flex-1 min-w-[120px] bg-red-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleteMutation.isPending ? <Spinner className="w-4 h-4" /> : <Trash2 size={16} />} Delete Shop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div className="fixed inset-0 z-[2000] bg-ink/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxUrl(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxUrl(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <X size={20} />
            </button>
            <img src={lightboxUrl} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" alt="Document Preview" />
            <a href={lightboxUrl} download target="_blank" rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm font-bold transition-colors">
              <Download size={16} /> Download Document
            </a>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        open={!!deleteBusiness}
        loading={deleteMutation.isPending}
        title="Delete Business"
        description={`Are you sure you want to delete "${deleteBusiness?.name_en}" ?`}
        onClose={() => setDeleteBusiness(null)}
        onConfirm={() => {
          deleteMutation.mutate(deleteBusiness.id, {
            onSuccess: () => {
              setDeleteBusiness(null)
            }
          })
        }}
      />
    </div>
  )
}

function BusinessActions({
  b,
  approveMutation,
  rejectMutation,
  deleteMutation,
  setSelectedBusiness,
  setDeleteBusiness
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setSelectedBusiness(b)
        }}
        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors"
        title="View Details"
      >
        <Eye size={14} />
      </button>
      {/* Approve & Reject */}
      {b.status === 'pending' && (
        <>
          <button
            disabled={approveMutation.isPending}
            onClick={(e) => {
              e.stopPropagation()
              approveMutation.mutate(b.id)
            }}
            className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors disabled:opacity-50"
            title="Approve"
          >
            {approveMutation.isPending &&
              approveMutation.variables === b.id ? (
              <Spinner className="w-3 h-3" />
            ) : (
              <CheckCircle size={14} />
            )}
          </button>

          <button
            disabled={rejectMutation.isPending}
            onClick={(e) => {
              e.stopPropagation()
              rejectMutation.mutate(b.id)
            }}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
            title="Reject"
          >
            {rejectMutation.isPending &&
              rejectMutation.variables === b.id ? (
              <Spinner className="w-3 h-3" />
            ) : (
              <X size={14} />
            )}
          </button>
        </>
      )}
      <button
        disabled={deleteMutation.isPending}
        onClick={(e) => {
          e.stopPropagation()
          setDeleteBusiness(b)
        }}
        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors disabled:opacity-50"
        title="Delete"
      >
        {deleteMutation.isPending &&
          deleteMutation.variables === b.id ? (
          <Spinner className="w-3 h-3" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  )
}

// ── Messages Table ────────────────────────────────────────────
function MessagesTable() {
  const qc = useQueryClient()
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: contactApi.listMessages
  })

  const readMutation = useMutation({
    mutationFn: contactApi.markAsRead,
    onSuccess: () => { toast.success('Marked as read'); qc.invalidateQueries(['admin-messages']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const deleteMutation = useMutation({
    mutationFn: contactApi.deleteMessage,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-messages']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <h2 className="font-bold text-ink text-lg mb-4">Contact Messages</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    {['Date', 'From', 'Phone', 'Subject', 'Message', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages?.map(m => (
                    <tr key={m.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${!m.is_read ? 'bg-blue-50/20' : ''}`}>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-semibold text-ink">{m.name}</div>
                        <div className="text-xs text-gray-400">{m.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-ink whitespace-nowrap">{m.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm text-ink font-medium max-w-[180px] truncate">{m.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px] truncate">{m.message}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${m.is_read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                          {m.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedMessage(m); if (!m.is_read) readMutation.mutate(m.id) }}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition">
                            <Eye size={14} />
                          </button>
                          {!m.is_read && (
                            <button disabled={readMutation.isPending} onClick={() => readMutation.mutate(m.id)}
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition disabled:opacity-50">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button disabled={deleteMutation.isPending} onClick={() => setDeleteMessage(m)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-50">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {messages?.length === 0 && (
                <div className="p-12 text-center text-gray-400 text-sm font-semibold">No messages yet.</div>
              )}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {messages?.length === 0 && (
                <div className="p-12 text-center text-gray-400 text-sm font-semibold bg-white rounded-2xl border border-gray-200">No messages yet.</div>
              )}
              {messages?.map(m => (
                <div key={m.id} className={`bg-white rounded-2xl border border-gray-200 p-4 ${!m.is_read ? 'border-l-4 border-l-blue-400' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-sm text-ink">{m.name}</div>
                      <div className="text-xs text-gray-400">{m.email}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${m.is_read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                      {m.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ink mb-1 truncate">{m.subject}</div>
                  <div className="text-xs text-gray-500 mb-3 line-clamp-2">{m.message}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedMessage(m); if (!m.is_read) readMutation.mutate(m.id) }}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition">
                        <Eye size={14} />
                      </button>
                      {!m.is_read && (
                        <button disabled={readMutation.isPending} onClick={() => readMutation.mutate(m.id)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition disabled:opacity-50">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button disabled={deleteMutation.isPending} onClick={() => setDeleteMessage(m)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300">
            <div className="bg-ink p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-pink to-purple" />
              <div className="flex flex-col items-center gap-3">
                <Logo height={35} />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Administrator Portal</span>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-pink/5 text-pink text-[10px] font-black uppercase tracking-widest rounded-full border border-pink/10">
                  Contact Message Inquiry
                </div>
                <h2 className="font-display text-2xl font-normal text-ink leading-tight">{selectedMessage.subject}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sender Name</p>
                  <p className="font-display text-lg text-ink font-normal">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Received On</p>
                  <p className="font-display text-lg text-ink font-normal">{new Date(selectedMessage.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-pink flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-ink truncate">{selectedMessage.email}</p>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-purple flex-shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-bold text-ink">{selectedMessage.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-gray-400" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Body</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl text-gray-600 text-sm leading-relaxed whitespace-pre-wrap border border-gray-200 italic">
                  "{selectedMessage.message}"
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button disabled={deleteMutation.isPending}
                  //onClick={() => { if (confirm('Permanently delete?')) deleteMutation.mutate(selectedMessage.id, { onSuccess: () => setSelectedMessage(null) }) }}
                  onClick={() => setDeleteMessage(selectedMessage)}
                  className="flex-1 bg-red-50 text-red-600 border border-red-200 py-3.5 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
                <button onClick={() => setSelectedMessage(null)}
                  className="w-28 py-3.5 bg-ink text-white rounded-2xl text-sm font-bold hover:bg-ink/90 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        open={!!deleteMessage}
        loading={deleteMutation.isPending}
        title="Delete Message"
        description={`Delete message from "${deleteMessage?.name}" ?`}
        onClose={() => setDeleteMessage(null)}
        onConfirm={() => {
          deleteMutation.mutate(deleteMessage.id, {
            onSuccess: () => {
              setDeleteMessage(null)
              setSelectedMessage(null)
            }
          })
        }}
      />
    </>
  )
}

// ── Reviews Table ─────────────────────────────────────────────
// function ReviewsTable() {
//   return (
//     <div>
//       <h2 className="font-bold text-ink text-lg mb-4">Pending Reviews</h2>
//       <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
//         <div className="text-3xl mb-2">⭐</div>
//         <p className="text-gray-400 text-sm">Review moderation will appear here.</p>
//       </div>
//     </div>
//   )
// }


function ReviewsTable() {

  const qc = useQueryClient()

  const [selectedReview, setSelectedReview] =
    useState(null)

  const [deleteReview, setDeleteReview] =
    useState(null)

  const {
    data: reviews,
    isLoading
  } = useQuery({

    queryKey: ['admin-reviews'],

    queryFn: () =>
      reviewApi.homepageLatest()
  })

  const approveMutation = useMutation({

    mutationFn: (id) =>
      reviewApi.approve(id),

    onSuccess: () => {

      toast.success(
        'Review approved'
      )

      qc.invalidateQueries([
        'admin-reviews'
      ])
    },

    onError: (e) =>
      toast.error(
        getErrorMessage(e)
      )
  })

  const deleteMutation = useMutation({

    mutationFn: (id) =>
      reviewApi.delete(id),

    onSuccess: () => {

      toast.success(
        'Review deleted'
      )

      qc.invalidateQueries([
        'admin-reviews'
      ])
    },

    onError: (e) =>
      toast.error(
        getErrorMessage(e)
      )
  })

  return (

    <div>

      <h2 className="font-bold text-ink text-lg mb-4">
        Reviews
      </h2>

      {isLoading ? (

        <div className="flex justify-center py-12">
          <Spinner />
        </div>

      ) : (

        <div className="space-y-4">

          {reviews?.length > 0 ? (

            reviews.map((review) => (

              <div
                key={review.id}
                className="bg-white rounded-2xl border border-gray-200 p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                        {review.reviewer_name?.[0]}
                      </div>

                      <div>

                        <h3 className="font-bold text-ink">
                          {review.reviewer_name}
                        </h3>

                        <p className="text-xs text-gray-400">
                          {new Date(
                            review.created_at
                          ).toLocaleDateString(
                            'en-GB'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-yellow-500 text-sm mb-3">

                      {'★'.repeat(review.rating)}

                      <span className="text-gray-300">
                        {'★'.repeat(
                          5 - review.rating
                        )}
                      </span>

                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* <div className="mt-3">

                      {review.is_verified ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 uppercase">
                          Verified
                        </span>

                      ) : (

                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 uppercase">
                          Pending
                        </span>
                      )}
                    </div> */}
                  </div>

                  <div className="flex flex-col gap-2">

                    {/* {!review.is_verified && (

                      <button

                        onClick={() =>
                          approveMutation.mutate(
                            review.id
                          )
                        }

                        disabled={
                          approveMutation.isPending
                        }

                        className="w-9 h-9 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )} */}

                    {/* <button

                      onClick={() =>
                        setDeleteReview(review)
                      }

                      disabled={
                        deleteMutation.isPending
                      }

                      className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={16} />
                    </button> */}

                    <button

                      onClick={() =>
                        setSelectedReview(review)
                      }

                      className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors"
                    >
                      <Eye size={16} />
                    </button>

                  </div>

                </div>

              </div>
            ))

          ) : (

            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">

              <div className="text-5xl mb-3">
                ⭐
              </div>

              <h3 className="font-bold text-lg text-ink mb-1">
                No Reviews Found
              </h3>

              <p className="text-sm text-gray-400">
                No  reviews available.
              </p>

            </div>
          )}
        </div>
      )}

      <DeleteConfirmModal

        open={!!deleteReview}

        loading={deleteMutation.isPending}

        title="Delete Review"

        description={`Delete review from "${deleteReview?.reviewer_name}" ?`}

        onClose={() =>
          setDeleteReview(null)
        }

        onConfirm={() => {

          deleteMutation.mutate(
            deleteReview.id,
            {
              onSuccess: () =>
                setDeleteReview(null)
            }
          )
        }}
      />

      {selectedReview && (

        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/60">

          <div className="bg-white rounded-3xl max-w-lg w-full p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="font-bold text-lg">
                Review Details
              </h3>

              <button
                onClick={() =>
                  setSelectedReview(null)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">

              <div>

                <p className="text-xs text-gray-400 uppercase mb-1">
                  Reviewer
                </p>

                <p className="font-bold">
                  {selectedReview.reviewer_name}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-400 uppercase mb-1">
                  Rating
                </p>

                <div className="text-yellow-500">
                  {'★'.repeat(selectedReview.rating)}
                </div>

              </div>

              <div>

                <p className="text-xs text-gray-400 uppercase mb-1">
                  Comment
                </p>

                <p className="text-sm text-gray-600">
                  {selectedReview.comment}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}

// ── Categories Table ──────────────────────────────────────────
function CategoriesTable() {
  const qc = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [deleteCategory, setDeleteCategory] = useState(null)
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', icon: '', is_featured: false })

  const { data: cats, isLoading } = useQuery({ queryKey: ['admin-categories'], queryFn: () => categoryApi.list() })
  const [errors, setErrors] = useState({})
  const categorySchema = z.object({
    name_en: z.string().min(1, 'English name is required'),
    name_ar: z.string().min(1, 'Arabic name is required'),
    slug: z.string().min(1, 'Slug is required'),
  })

  const saveMutation = useMutation({
    mutationFn: (data) => editingCat ? adminApi.updateCategory(editingCat.id, data) : adminApi.createCategory(data),
    onSuccess: () => { toast.success(editingCat ? 'Category updated' : 'Category created'); qc.invalidateQueries(['admin-categories']); handleClose() },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => { toast.success('Category deleted'); qc.invalidateQueries(['admin-categories']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  const handleEdit = (cat) => {
    setEditingCat(cat)
    setForm({ name_en: cat.name_en, name_ar: cat.name_ar, slug: cat.slug, icon: cat.icon || '', is_featured: cat.is_featured })
    setIsModalOpen(true)
  }
  const handleClose = () => { setIsModalOpen(false); setEditingCat(null); setForm({ name_en: '', name_ar: '', slug: '', icon: '', is_featured: false }) }
  const handleSubmit = (e) => {
    e.preventDefault(); const result = categorySchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(err => { fieldErrors[err.path[0]] = err.message })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    saveMutation.mutate(form)
  }

  const handleInputChange = (
    field,
    value
  ) => {

    setForm(f => ({
      ...f,
      [field]: value
    }))

    // clear error while typing
    if (errors[field]) {

      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-ink text-lg">Categories</h2>
        <button onClick={() => setIsModalOpen(true)} className="brand-btn px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden text-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {['Icon', 'Name', 'Slug', 'Businesses', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left font-bold text-gray-400 uppercase tracking-wide px-4 py-3 text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cats?.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xl">{c.icon || '📁'}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{c.name_en}</div>
                      <div className="text-xs text-gray-400">{c.name_ar}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                    <td className="px-4 py-3 font-bold text-purple">{c.business_count}</td>
                    <td className="px-4 py-3">
                      {c.is_featured ? <span className="text-[10px] font-bold text-pink bg-pink/10 px-2 py-0.5 rounded-full uppercase border border-pink/20">Featured</span> : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(c)} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteCategory(c)} disabled={deleteMutation.isPending}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors">
                          {deleteMutation.isPending && deleteMutation.variables === c.id ? <Spinner className="w-3 h-3" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {cats?.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon || '📁'}</span>
                    <div>
                      <div className="font-bold text-sm text-ink">{c.name_en}</div>
                      <div className="text-xs text-gray-400">{c.name_ar}</div>
                    </div>
                  </div>
                  {c.is_featured && <span className="text-[10px] font-bold text-pink bg-pink/10 px-2 py-0.5 rounded-full uppercase border border-pink/20">Featured</span>}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Slug</div>
                    <div className="text-xs font-mono text-gray-600 truncate">{c.slug}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Businesses</div>
                    <div className="text-xs font-bold text-purple">{c.business_count}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => handleEdit(c)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 text-xs font-bold transition-colors">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteCategory(c)} disabled={deleteMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
          <DeleteConfirmModal
            open={!!deleteCategory}
            loading={deleteMutation.isPending}
            title="Delete Category"
            description={`Are you sure you want to delete "${deleteCategory?.name_en}" ?`}
            onClose={() => setDeleteCategory(null)}
            onConfirm={() => {
              deleteMutation.mutate(deleteCategory.id, {
                onSuccess: () => {
                  setDeleteCategory(null)
                }
              })
            }}
          />
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 p-8 space-y-4">
            <h3 className="font-bold text-ink text-xl mb-2">{editingCat ? 'Edit Category' : 'Add New Category'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Name (English)<span className="text-red-500">*</span></label>
                <input value={form.name_en}
                  onChange={e =>
                    handleInputChange(
                      'name_en',
                      e.target.value
                    )
                  }
                  style={{ border: '1px solid #dfdee5' }}
                  className="w-full  rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 bg-white text-ink transition-all" placeholder="Restaurants" />
                {errors.name_en && <p className="text-xs mt-1 font-medium text-red-500">{errors.name_en}</p>}
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Name (Arabic)<span className="text-red-500">*</span></label>
                <input value={form.name_ar}
                  onChange={e =>
                    handleInputChange(
                      'name_ar',
                      e.target.value
                    )
                  }
                  style={{ border: '1px solid #dfdee5' }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 bg-white text-ink text-right transition-all" placeholder="مطاعم" />
                {errors.name_ar && <p className="text-xs mt-1 font-medium text-red-500">{errors.name_ar}</p>}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Slug<span className="text-red-500">*</span></label>
              <input value={form.slug}
                onChange={e =>
                  handleInputChange(
                    'slug',
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                  )
                }
                style={{ border: '1px solid #dfdee5' }}
                className="w-full  rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 bg-white font-mono text-ink transition-all" placeholder="restaurants" />
              {errors.slug && <p className="text-xs mt-1 font-medium text-red-500">{errors.slug}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Icon (Emoji)</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                style={{ border: '1px solid #dfdee5' }}
                className="w-full  rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 bg-white text-ink transition-all" placeholder="🍔" maxLength={2} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer py-2 group">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} style={{ border: '1px solid #dfdee5' }} className="w-5 h-5 rounded  text-pink focus:ring-pink" />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-ink">Featured Category</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saveMutation.isPending} className="flex-1 brand-btn py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                {saveMutation.isPending ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ── Vendors Table ──────────────────────────────────────────────
function VendorsTable({ onViewDashboard }) {
  const qc = useQueryClient();
  const [deleteVendor, setDeleteVendor] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['admin-vendors'], queryFn: adminApi.listVendors });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteVendor,
    onSuccess: () => { toast.success('Vendor account deleted'); qc.invalidateQueries(['admin-vendors']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  return (
    <div>
      <h2 className="font-bold text-ink text-lg mb-4">Vendor Registrations</h2>
      {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {['Email', 'Registered At', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-ink">{v.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(v.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onViewDashboard(v)} className="w-8 h-8 rounded-lg bg-pink/10 text-pink hover:bg-pink hover:text-white flex items-center justify-center transition-colors"><LayoutDashboard size={14} /></button>
                        <button
                          disabled={deleteMutation.isPending}
                          onClick={() => setDeleteVendor(v)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === v.id ? <Spinner className="w-3 h-3" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.length === 0 && <div className="p-12 text-center text-gray-400 text-sm">No vendors found.</div>}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {data?.length === 0 && <div className="p-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No vendors found.</div>}
            {data?.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="font-bold text-sm text-ink mb-1 truncate">{v.email}</div>
                <div className="text-xs text-gray-400 mb-3">Registered {new Date(v.created_at).toLocaleDateString()}</div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => onViewDashboard(v)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-pink/10 text-pink hover:bg-pink hover:text-white text-xs font-bold transition-colors">
                    <LayoutDashboard size={13} /> Dashboard
                  </button>
                  <button
                    disabled={deleteMutation.isPending}
                    onClick={() => setDeleteVendor(v)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <DeleteConfirmModal
        open={!!deleteVendor}
        loading={deleteMutation.isPending}
        title="Delete Vendor"
        description={`Are you sure you want to delete "${deleteVendor?.email}" ?`}
        onClose={() => setDeleteVendor(null)}
        onConfirm={() => {
          deleteMutation.mutate(deleteVendor.id, {
            onSuccess: () => {
              setDeleteVendor(null)
            }
          })
        }}
      />
    </div>
  )
}

// ── Vendor Preview ────────────────────────────────────────────
function VendorPreview({ vendor, onBack }) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-vendor-stats', vendor.id],
    queryFn: () => adminApi.getVendorStats(vendor.id)
  })
  const { data: shops, isLoading: shopsLoading } = useQuery({
    queryKey: ['admin-vendor-shops', vendor.id],
    queryFn: () => adminApi.getVendorBusinesses(vendor.id)
  })

  if (statsLoading || shopsLoading) return <Spinner />

  const overviewStats = [
    { label: 'Total Views', value: stats?.total_views || 0, icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Avg Rating', value: stats?.avg_rating || 0, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Total Reviews', value: stats?.total_reviews || 0, icon: Star, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Services', value: stats?.total_services || 0, icon: LayoutDashboard, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-6">
        <button onClick={onBack} className="text-pink text-xs font-bold uppercase tracking-widest mb-2 hover:underline flex items-center gap-1">← Back to Vendors</button>
        <h1 className="font-display text-2xl md:text-3xl font-normal text-ink">Vendor: <span className="text-pink break-all">{vendor.email}</span></h1>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {overviewStats.map(stat => (
          <div key={stat.label} className="bg-white p-4 md:p-6 rounded-3xl border border-gray-200 flex flex-col gap-3">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon size={20} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-2xl font-black text-ink">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 md:p-8">
        <h2 className="text-lg font-bold text-ink mb-5">Shops ({shops?.length || 0})</h2>
        <div className="space-y-3">
          {shops?.map(shop => (
            <div key={shop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                  {shop.logo_url ? <img src={shop.logo_url?.startsWith('/') ? import.meta.env.VITE_API_URL + shop.logo_url : shop.logo_url} className="w-full h-full object-cover rounded-lg" /> : <Building2 className="text-gray-300" size={16} />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-ink truncate">{shop.name_en}</h3>
                  <p className="text-xs text-gray-400 font-semibold truncate">{shop.category?.name_en} • {shop.governorate?.name_en}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-ink">{shop.view_count} views</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{shop.rating_avg} ★</p>
                </div>
                <a href={`/business/${shop.slug}`} target="_blank" rel="noreferrer" className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-pink rounded-lg transition-colors"><Eye size={16} /></a>
              </div>
            </div>
          ))}
          {!shops?.length && <p className="text-center text-gray-400 py-8 font-semibold">No businesses found.</p>}
        </div>
      </div>
    </div>
  )
}

// ── Dashboard Main ────────────────────────────────────────────
// function AdminDashboard() {
//   const { logout } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const activeTab = new URLSearchParams(location.search).get('tab') || 'overview'
//   const [viewingVendor, setViewingVendor] = useState(null)
//   const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats })

//   const navItems = [
//     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//     { id: 'businesses', label: 'Shops List', icon: Building2 },
//     { id: 'requests', label: 'Requests', icon: CheckCircle },
//     { id: 'vendors', label: 'Vendors', icon: Users },
//     { id: 'vendor-control', label: 'Vendor Control', icon: Zap },
//     { id: 'categories', label: 'Categories', icon: FolderTree },
//     { id: 'messages', label: 'Messages', icon: MessageSquare },
//     { id: 'history', label: 'History', icon: Trash2 },
//     { id: 'reviews', label: 'Reviews', icon: Star },
//   ]

//   const renderTab = () => {
//     if (viewingVendor) return <VendorPreview vendor={viewingVendor} onBack={() => setViewingVendor(null)} />
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div>
//             <h1 className="font-display text-2xl md:text-3xl font-normal text-ink mb-6">Dashboard Overview</h1>
//             {!stats ? <div className="flex justify-center py-20"><Spinner /></div> : (
//               <>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                   <StatCard icon="🏢" label="Total Businesses" value={stats?.total_businesses} sub={`${stats?.active_businesses} active`} color="bg-purple-light" />
//                   <StatCard icon="⏳" label="Pending Review" value={stats?.pending_businesses} sub="Awaiting approval" color="bg-amber-50" />
//                   <StatCard icon="⭐" label="Total Reviews" value={stats?.total_reviews} sub="All time" color="bg-orange-light" />
//                   <StatCard icon="🏆" label="Featured" value={stats?.featured_businesses} sub="Sponsored listings" color="bg-pink-light" />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[['📁', 'Categories', stats?.total_categories], ['📍', 'Governorates', stats?.total_governorates], ['✅', 'Verified', stats?.active_businesses]].map(([icon, label, val]) => (
//                     <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
//                       <span className="text-3xl">{icon}</span>
//                       <div>
//                         <div className="font-display text-2xl brand-text font-normal">{val ?? '–'}</div>
//                         <div className="text-sm font-semibold text-gray-500">{label}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         )
//       case 'businesses': return <BusinessTable key="active" defaultStatus="active" />
//       case 'requests': return <BusinessTable key="pending" defaultStatus="pending" />
//       case 'history': return <BusinessTable key="history" defaultStatus="rejected" />
//       case 'vendors': return <VendorsTable onViewDashboard={setViewingVendor} />
//       case 'vendor-control': return <VendorControlTable />
//       case 'categories': return <CategoriesTable />
//       case 'messages': return <MessagesTable />
//       case 'reviews': return <ReviewsTable />
//       default: return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-8 flex overflow-x-hidden">
//       {/* Sidebar — desktop only */}
//       <aside className="hidden lg:flex w-56 bg-ink border-r border-white/8 flex-col fixed left-0 top-16 bottom-0 z-30">
//         <div className="px-4 py-5 border-b border-white/10">
//           <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Admin Panel</p>
//         </div>
//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {navItems.map(({ id, label, icon: Icon }) => (
//             <button key={id} onClick={() => { navigate(`/admin?tab=${id}`); setViewingVendor(null) }}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${activeTab === id ? 'text-white' : 'text-white/45 hover:text-white/70 hover:bg-white/5'}`}
//               style={activeTab === id ? { background: 'linear-gradient(90deg,rgba(232,49,122,.25),rgba(91,45,142,.25))' } : {}}>
//               <Icon size={16} />
//               {label}
//             </button>
//           ))}
//         </nav>
//         <div className="p-3 border-t border-white/10">
//           <button onClick={() => { logout(); navigate('/admin/login') }}
//             className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/40 hover:text-white/70 rounded-xl hover:bg-white/5 transition-all">
//             <LogOut size={16} /> Log Out
//           </button>
//         </div>
//       </aside>
//       {/* Main content */}
//       <main className="flex-1 lg:ml-56 p-4 md:p-8 min-w-0 w-full overflow-x-hidden">
//         {renderTab()}
//       </main>
//     </div>
//   )
// }

function DashboardStatCard({ icon, label, value, sub, progress, gradient, trend, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 bg-emerald-50 rounded-lg px-2 py-1">
            <span className="text-[10px] font-bold text-emerald-600">{trend}</span>
          </div>
        )}
      </div>

      <div className="text-2xl font-extrabold text-gray-900 mb-0.5">
        {value ?? '–'}
      </div>
      <div className="text-sm font-semibold text-gray-500">{label}</div>

      {sub && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">{sub}</span>
            <span className="text-[10px] font-bold text-pink">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = new URLSearchParams(location.search).get('tab') || 'overview'
  const [viewingVendor, setViewingVendor] = useState(null)
  const [dateRange, setDateRange] = useState('Last 7 days')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats })

  // Mock data for dashboard - replace with API calls
  const dashboardData = {
    todayBookings: 147,
    todayRevenue: '2,847',
    activePros: 234,
    totalPros: 312,
    avgRating: 4.8,
    totalReviews: 8247,
    bookingTrend: '↑ 12%',
    revenueTrend: '↑ 8.3%',
    ratingTrend: '↑ 0.1',
  }

  const revenueChart = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    values: [1847, 2341, 2029, 2800, 3367, 2564, 1283],
    peak: 4
  }

  const serviceBreakdown = {
    'AC Service': 38,
    'Cleaning': 24,
    'Plumbing': 15,
    'Beauty': 12,
    'Others': 11
  }

  const bookings = [
    { id: '#4521', service: 'AC Deep Clean', customer: 'Ahmed Al-Rashdi', pro: 'Mohammed A.', area: 'Qurum', amount: '17', status: 'completed' },
    { id: '#4520', service: 'Home Cleaning', customer: 'Khalid Al-Farsi', pro: 'Salim Al-Habsi', area: 'Al Khuwair', amount: '37', status: 'in-progress' },
    { id: '#4519', service: 'Beauty at Home', customer: 'Sara Al-Balushi', pro: 'Fatima Al-Z.', area: 'MSQ Hills', amount: '45', status: 'en-route' },
    { id: '#4518', service: 'Pest Control', customer: 'Omar Al-Jabri', pro: 'Khalid Al-H.', area: 'Ruwi', amount: '22', status: 'scheduled' },
    { id: '#4517', service: 'Plumbing Fix', customer: 'Nasser Al-Rawahi', pro: 'Ali Al-Maamari', area: 'Bowsher', amount: '15', status: 'completed' },
  ]

  const professionals = [
    { rank: 1, name: 'Mohammed A.', service: 'AC', rating: 4.9, jobs: 847, revenue: '3.2k', initial: 'M' },
    { rank: 2, name: 'Fatima Al-Z.', service: 'Beauty', rating: 5.0, jobs: 291, revenue: '2.8k', initial: 'F' },
    { rank: 3, name: 'Salim Al-Habsi', service: 'Plumbing', rating: 4.8, jobs: 524, revenue: '1.9k', initial: 'S' },
    { rank: 4, name: 'Khalid Al-Farsi', service: 'Electrical', rating: 4.7, jobs: 312, revenue: '1.6k', initial: 'K' },
    { rank: 5, name: 'Ali Al-Maamari', service: 'Cleaning', rating: 4.9, jobs: 445, revenue: '1.4k', initial: 'A' },
  ]

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'businesses', label: 'Shops List', icon: Building2, badge: null },
    { id: 'requests', label: 'Requests', icon: CheckCircle, badge: stats?.pending_businesses || null },
    { id: 'vendors', label: 'Vendors', icon: Users, badge: null },
    { id: 'vendor-control', label: 'Vendor Control', icon: Zap, badge: null },
    { id: 'categories', label: 'Categories', icon: FolderTree, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: null },
    { id: 'history', label: 'History', icon: Trash2, badge: null },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: null },
  ]

  const activeNavItem = navItems.find(n => n.id === activeTab)
  const pageTitle = viewingVendor ? 'Vendor Overview' : (activeNavItem?.label || 'Dashboard')

  const renderTab = () => {
    if (viewingVendor) return <VendorPreview vendor={viewingVendor} onBack={() => setViewingVendor(null)} />
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardStatCard
                icon={<Calendar size={18} className="text-pink" />}
                bg="bg-pink/10"
                label="Today's Bookings"
                value={dashboardData.todayBookings}
                sub="vs yesterday: 131"
                progress={72}
                gradient="from-pink to-purple"
                trend={dashboardData.bookingTrend}
              />

              <DashboardStatCard
                icon={<Building2 size={18} className="text-purple" />}
                bg="bg-purple/10"
                label="Revenue Today"
                value={`OMR ${dashboardData.todayRevenue}`}
                sub="vs yesterday: OMR 2,629"
                progress={83}
                gradient="from-purple to-blue"
                trend={dashboardData.revenueTrend}
              />

              <DashboardStatCard
                icon={<Users size={18} className="text-blue" />}
                bg="bg-blue/10"
                label="Active Professionals"
                value={`${dashboardData.activePros}`}
                sub={`${dashboardData.totalPros} total`}
                progress={75}
                gradient="from-blue to-cyan"
              />

              <DashboardStatCard
                icon={<Star size={18} className="text-amber" />}
                bg="bg-amber/10"
                label="Avg Customer Rating"
                value={`${dashboardData.avgRating} ★`}
                sub={`From ${dashboardData.totalReviews.toLocaleString()} reviews`}
                progress={96}
                gradient="from-amber to-emerald"
                trend={dashboardData.ratingTrend}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Revenue — Last 7 Days</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Total this week: OMR 14,231</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-pink border border-pink/20 bg-pink/5">
                      Revenue
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                      Orders
                    </button>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="relative h-44 pb-6 border-b border-gray-100">
                  <div className="absolute left-0 top-0 right-0 flex flex-col justify-between h-[148px] pointer-events-none">
                    <span className="text-[10px] text-gray-300">OMR 3,000</span>
                    <span className="text-[10px] text-gray-300">OMR 2,000</span>
                    <span className="text-[10px] text-gray-300">OMR 1,000</span>
                    <span className="text-[10px] text-gray-300">0</span>
                  </div>

                  <div className="flex items-end h-[148px] pl-12 gap-1.5">
                    {revenueChart.days.map((day, index) => {
                      const value = revenueChart.values[index]
                      const height = Math.max(20, (value / 3367) * 130)
                      const isPeak = index === revenueChart.peak
                      const isToday = index === revenueChart.days.length - 1
                      const isProjected = isToday

                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className={`w-full rounded-t-md transition-all relative min-h-[20px]
                              ${isPeak ? 'bg-gradient-to-t from-blue to-purple shadow-lg shadow-blue/30' :
                                isProjected ? 'bg-gradient-to-t from-pink/30 to-purple/30 border-2 border-dashed border-pink/40' :
                                'bg-gradient-to-t from-pink to-purple'}`}
                            style={{ height: `${height}px` }}
                          >
                            <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap
                              ${isPeak ? 'text-blue' : isProjected ? 'text-pink/60' : 'text-pink'}`}>
                              {value.toLocaleString()}
                            </span>
                          </div>
                          <span className={`text-[11px] font-medium ${isToday ? 'text-pink font-bold' : isPeak ? 'text-blue font-bold' : 'text-gray-400'}`}>
                            {day}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-pink to-purple" />
                    <span className="text-[11px] text-gray-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue to-purple" />
                    <span className="text-[11px] text-gray-400">Peak day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm border-2 border-dashed border-pink/50" />
                    <span className="text-[11px] text-gray-400">Projected</span>
                  </div>
                </div>
              </div>

              {/* Service Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <h3 className="font-bold text-gray-900 text-base">Services Breakdown</h3>
                <p className="text-xs text-gray-400 mt-0.5">Today's bookings by type</p>

                <div className="flex flex-col items-center mt-4">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32 md:w-36 md:h-36">
                    <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                      {(() => {
                        const colors = ['#D61CA8', '#8B2EF5', '#4B6EF5', '#06B6D4', '#E5E7EB']
                        const segments = Object.values(serviceBreakdown)
                        const total = segments.reduce((a, b) => a + b, 0)
                        let offset = 0

                        return segments.map((value, i) => {
                          const percentage = (value / total) * 100
                          const circumference = 2 * Math.PI * 52
                          const dasharray = (percentage / 100) * circumference
                          const dashoffset = -(offset / 100) * circumference
                          offset += percentage

                          return (
                            <circle
                              key={i}
                              cx="65"
                              cy="65"
                              r="52"
                              fill="none"
                              stroke={colors[i]}
                              strokeWidth="18"
                              strokeDasharray={`${dasharray} ${circumference - dasharray}`}
                              strokeDashoffset={dashoffset}
                              strokeLinecap="round"
                            />
                          )
                        })
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl md:text-2xl font-extrabold text-gray-900">147</span>
                      <span className="text-[10px] md:text-[11px] text-gray-400">total</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="w-full mt-4 space-y-2">
                    {Object.entries(serviceBreakdown).map(([name, value], index) => {
                      const colors = ['#D61CA8', '#8B2EF5', '#4B6EF5', '#06B6D4', '#E5E7EB']
                      return (
                        <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: colors[index] }} />
                            <span className="text-xs font-medium text-gray-600">{name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 md:w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${value}%`, background: colors[index] }} />
                            </div>
                            <span className="text-xs font-bold text-gray-900">{value}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 overflow-x-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="font-bold text-gray-900 text-base">Recent Bookings</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-pink bg-pink/5 px-2.5 py-1 rounded-full border border-pink/10 whitespace-nowrap">Live</span>
                    <button className="text-xs font-bold text-pink hover:underline whitespace-nowrap">View All →</button>
                  </div>
                </div>

                {/* Table */}
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-[70px_1.2fr_1fr_70px_70px_80px] gap-2 px-3 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>ID</span>
                    <span>Service · Customer</span>
                    <span>Professional</span>
                    <span>Area</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {bookings.map((booking, index) => {
                      const isAlt = index % 2 === 1
                      const proInitial = booking.pro.split(' ').map(w => w[0]).join('')

                      return (
                        <div
                          key={booking.id}
                          className={`grid grid-cols-[70px_1.2fr_1fr_70px_70px_80px] gap-2 px-3 py-2.5 rounded-xl items-center ${isAlt ? 'bg-gray-50/50' : ''}`}
                        >
                          <span className="text-xs font-semibold text-gray-400">{booking.id}</span>
                          <div>
                            <div className="text-xs font-semibold text-gray-900 truncate">{booking.service}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 truncate">{booking.customer}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                              style={{ background: BRAND_GRADIENT }}>
                              {proInitial}
                            </div>
                            <span className="text-[11px] font-medium text-gray-900 truncate">{booking.pro}</span>
                          </div>
                          <span className="text-[11px] text-gray-500">{booking.area}</span>
                          <span className="text-xs font-bold text-gray-900">OMR {booking.amount}</span>
                          <StatusBadge status={booking.status} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Top Professionals */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-base">Top Professionals</h3>
                  <button className="text-xs font-bold text-pink hover:underline whitespace-nowrap">View All →</button>
                </div>

                <div className="space-y-3">
                  {professionals.map((pro, index) => {
                    const rankColor = ['#D61CA8', '#8B2EF5', '#4B6EF5', '#06B6D4', '#10B981'][index]

                    return (
                      <div key={pro.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: rankColor }}>
                          #{pro.rank}
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: BRAND_GRADIENT }}>
                          {pro.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">{pro.name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                            {pro.service} · ⭐ {pro.rating} · {pro.jobs.toLocaleString()} jobs
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-pink">OMR {pro.revenue}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">this month</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      case 'businesses': return <BusinessTable key="active" defaultStatus="active" />
      case 'requests': return <BusinessTable key="pending" defaultStatus="pending" />
      case 'history': return <BusinessTable key="history" defaultStatus="rejected" />
      case 'vendors': return <VendorsTable onViewDashboard={setViewingVendor} />
      case 'vendor-control': return <VendorControlTable />
      case 'categories': return <CategoriesTable />
      case 'messages': return <MessagesTable />
      case 'reviews': return <ReviewsTable />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex w-56 bg-gray-900 border-r border-white/10 flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: BRAND_GRADIENT }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-black text-base leading-none truncate">UniteOman</div>
            <div className="text-white/35 text-[10px] font-semibold uppercase tracking-widest mt-1">Admin Console</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => { navigate(`/admin?tab=${id}`); setViewingVendor(null) }}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left border-l-[3px] ${
                  isActive ? 'text-white border-pink' : 'text-white/45 hover:text-white/70 hover:bg-white/5 border-transparent'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg,rgba(214,28,168,.2),rgba(75,110,245,.15))' } : {}}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge ? (
                  <span className="text-[10px] font-bold text-white bg-pink rounded-full px-2 py-0.5 flex-shrink-0">
                    {badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        {/* Admin footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: BRAND_GRADIENT }}>
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-bold truncate">Admin User</div>
              <div className="text-white/35 text-[10px] truncate">Super Admin</div>
            </div>
            <button
              onClick={() => { logout(); navigate('/admin/login') }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 lg:ml-56 min-w-0 w-full flex flex-col overflow-x-hidden">
        {/* Sticky Topbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-none">{pageTitle}</h1>
              <p className="text-xs text-gray-400 font-medium mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} · Muscat, Oman
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-full md:w-56 border border-gray-100">
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search bookings, pros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-sm text-gray-900 placeholder:text-gray-400 w-full outline-none"
                />
              </div>

              {/* Date Range */}
              <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer hover:border-pink/30 transition-colors">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{dateRange}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                  <path d="M3 4.5l3 3 3-3" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap"
                style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 16px rgba(214,28,168,.3)' }}>
                <Download size={14} />
                Export Report
              </button>

              {/* Notification Bell */}
              <div className="relative cursor-pointer flex-shrink-0">
                <Bell size={20} className="text-gray-500" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 p-3 md:p-4 min-w-0 w-full overflow-x-hidden">
          {renderTab()}
        </main>
      </div>
    </div>
  )
}

export function AdminLoginPage_() { return <AdminLoginPage /> }
export default function AdminPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAdmin && location.pathname === '/admin/login') navigate('/admin', { replace: true })
  }, [isAdmin, location.pathname, navigate])

  return isAdmin ? <AdminDashboard /> : <AdminLoginPage />
}

// ── Vendor Control ─────────────────────────────────────────────
function VendorControlTable() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedGov, setSelectedGov] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedApptBiz, setSelectedApptBiz] = useState(null)
  const [selectedServiceBiz, setSelectedServiceBiz] = useState(null)
  const [selectedEditBiz, setSelectedEditBiz] = useState(null)
  const [viewingVendor, setViewingVendor] = useState(null)
  const [deleteVendorPopup, setDeleteVendorPopup] = useState(null)
  const [deleteShopPopup, setDeleteShopPopup] = useState(null)


  const { data: shops, isLoading } = useQuery({ queryKey: ['admin-vendor-control'], queryFn: adminApi.vendorControl })
  const { data: allCategories } = useQuery({ queryKey: ['admin-categories-filter'], queryFn: categoryApi.list })
  const { data: allGovernorates } = useQuery({ queryKey: ['admin-govs-filter'], queryFn: governorateApi.list })
  const qc = useQueryClient();

  const deleteVendorMutation = useMutation({
    mutationFn: adminApi.deleteVendor,
    onSuccess: () => { toast.success('Vendor account purged'); qc.invalidateQueries(['admin-vendor-control']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const toggleVendorStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.toggleVendorStatus(id, isActive),
    onSuccess: () => { toast.success('Account status updated'); qc.invalidateQueries(['admin-vendor-control']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const deleteBusinessMutation = useMutation({
    mutationFn: businessApi.adminDelete,
    onSuccess: () => { toast.success('Shop deleted'); qc.invalidateQueries(['admin-vendor-control']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })
  const updateBusinessStatusMutation = useMutation({
    mutationFn: ({ id, status }) => businessApi.adminUpdate(id, { status }),
    onSuccess: () => { toast.success('Shop status updated'); qc.invalidateQueries(['admin-vendor-control']) },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  const filteredShops = shops?.filter(s => {
    const matchesSearch = !search || s.name_en.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || s.category?.id?.toString() === selectedCategory?.toString()
    const matchesGov = !selectedGov || s.governorate?.id?.toString() === selectedGov?.toString()
    const matchesStatus = !selectedStatus || s.status === selectedStatus
    return matchesSearch && matchesCategory && matchesGov && matchesStatus
  })

  const groupedVendors = filteredShops?.reduce((acc, shop) => {
    const ownerId = shop.owner?.id || 'ORPHAN_ACCOUNT'
    if (!acc[ownerId]) {
      acc[ownerId] = { owner: shop.owner, email: shop.owner_email || shop.owner?.email || 'ORPHAN', items: [], totalViews: 0, avgRating: 0 }
    }
    acc[ownerId].items.push(shop)
    acc[ownerId].totalViews += (shop.view_count || 0)
    acc[ownerId].avgRating += (Number(shop.rating_avg) || 0)
    return acc
  }, {})

  if (groupedVendors) {
    Object.keys(groupedVendors).forEach(id => {
      const v = groupedVendors[id]
      v.avgRating = (v.avgRating / v.items.length).toFixed(1)
    })
  }

  if (isLoading) return <Spinner />

  if (viewingVendor) return <VendorPreview vendor={viewingVendor} onBack={() => setViewingVendor(null)} />

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zap-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-normal text-ink">Vendor Control</h1>
            <p className="text-gray-400 text-sm font-semibold">Centralized Administrative Registry</p>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-pink transition-colors"><Search size={16} /></div>
            <input type="text" placeholder="Search shops or vendors..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-pink/10 focus:border-pink transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-pink font-black uppercase tracking-[0.2em] bg-pink/5 px-3 py-1 rounded-full border border-pink/10">Administrator Mode</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase">{filteredShops?.length || 0} Results</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedCategory(null)}
            className={`flex-none px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${!selectedCategory ? 'bg-pink text-white border-pink' : 'bg-white text-gray-400 border-gray-200 hover:border-pink/30 hover:text-pink'}`}>
            All
          </button>
          {allCategories?.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex-none flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${selectedCategory === cat.id ? 'bg-pink text-white border-pink' : 'bg-white text-gray-400 border-gray-200 hover:border-pink/30 hover:text-pink'}`}>
              <span>{cat.icon || '📁'}</span>{cat.name_en}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
            <MapPin size={13} className="text-gray-400" />
            <select value={selectedGov || ''} onChange={e => setSelectedGov(e.target.value || null)}
              className="bg-transparent border-none outline-none text-xs font-bold text-ink min-w-[130px]">
              <option value="">All Governorates</option>
              {allGovernorates?.map(g => <option key={g.id} value={g.id}>{g.name_en}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
            <CheckCircle size={13} className="text-gray-400" />
            <select value={selectedStatus || ''} onChange={e => setSelectedStatus(e.target.value || null)}
              className="bg-transparent border-none outline-none text-xs font-bold text-ink min-w-[130px]">
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
          </div>
          {(selectedCategory || selectedGov || selectedStatus || search) && (
            <button onClick={() => { setSelectedCategory(null); setSelectedGov(null); setSelectedStatus(null); setSearch('') }}
              className="text-pink text-xs font-black uppercase tracking-widest hover:underline">Reset</button>
          )}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-[10px] font-black text-emerald-500">{filteredShops?.filter(s => s.status === 'active').length} active</span>
              <span className="text-[10px] font-black text-amber-500">{filteredShops?.filter(s => s.status === 'pending').length} pending</span>
            </div>
            <button onClick={() => {
              const csv = [['Shop Name', 'Category', 'Vendor', 'Status', 'Views', 'Rating'].join(','), ...filteredShops?.map(s => [s.name_en, s.category?.name_en, s.owner_email, s.status, s.view_count, s.rating_avg].join(','))].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a'); a.setAttribute('hidden', ''); a.setAttribute('href', url); a.setAttribute('download', `export-${new Date().toISOString().split('T')[0]}.csv`); document.body.appendChild(a); a.click(); document.body.removeChild(a)
              toast.success('Exported to CSV')
            }} className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      {groupedVendors && Object.entries(groupedVendors).length > 0 ? Object.entries(groupedVendors).map(([id, data]) => (
        <div key={id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-pink/20 transition-all">
          {/* Vendor Header */}
          <div className="bg-gray-50 px-5 md:px-8 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Users size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-ink truncate">{data.email}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${data.owner?.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {data.owner?.is_active ? 'Active' : 'Suspended'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400">{data.items.length} shops</span>
                  {data.owner?.created_at && <span className="text-[9px] font-bold text-gray-300">Since {new Date(data.owner.created_at).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-gray-200">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Visits</p>
                  <p className="text-sm font-black text-ink">{data.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-px h-5 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Rating</p>
                  <p className="text-sm font-black text-ink">{data.avgRating} ★</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.items.some(s => s.status === 'pending') && (
                  <button disabled={updateBusinessStatusMutation.isPending}
                    onClick={() => { if (confirm(`Approve all pending shops for ${data.email}?`)) data.items.filter(s => s.status === 'pending').forEach(s => updateBusinessStatusMutation.mutate({ id: s.id, status: 'active' })) }}
                    className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all border border-emerald-100">
                    {updateBusinessStatusMutation.isPending ? <Spinner className="w-4 h-4" /> : <CheckCircle size={17} />}
                  </button>
                )}
                <button disabled={toggleVendorStatusMutation.isPending}
                  onClick={() => toggleVendorStatusMutation.mutate({ id: data.owner.id, isActive: !data.owner.is_active })}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${data.owner?.is_active ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-100'}`}>
                  {toggleVendorStatusMutation.isPending && toggleVendorStatusMutation.variables?.id === data.owner?.id ? <Spinner className="w-4 h-4" /> : <ShieldAlert size={17} />}
                </button>
                <button disabled={deleteVendorMutation.isPending}
                  onClick={() => setDeleteVendorPopup(data)}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-100">
                  {deleteVendorMutation.isPending && deleteVendorMutation.variables === data.owner?.id ? <Spinner className="w-4 h-4" /> : <Trash2 size={17} />}
                </button>
                <button onClick={() => setViewingVendor({ email: data.email })} className="brand-btn px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Overview
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.items.map(shop => (
              <div key={shop.id} className="group p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-white hover:border-pink/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${shop.status === 'active' ? 'bg-emerald-500' : shop.status === 'pending' ? 'bg-amber-500' : 'bg-red-400'}`} />
                <div className="flex items-start justify-between mb-4 mt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                      {shop.logo_url ? <img src={shop.logo_url?.startsWith('/') ? import.meta.env.VITE_API_URL + shop.logo_url : shop.logo_url} className="w-full h-full object-cover rounded-lg" /> : <span className="text-lg">{shop.category?.icon || '🏢'}</span>}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-ink group-hover:text-pink transition-colors line-clamp-1">{shop.name_en}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{shop.category?.name_en} • {shop.governorate?.name_en}</p>
                    </div>
                  </div>
                  <StatusBadge status={shop.status} />
                </div>

                {shop.status === 'pending' && (
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => updateBusinessStatusMutation.mutate({ id: shop.id, status: 'active' })}
                      className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => updateBusinessStatusMutation.mutate({ id: shop.id, status: 'rejected' })}
                      className="flex-1 bg-white text-gray-400 py-2 rounded-xl text-[10px] font-black uppercase border border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-1.5">
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { icon: Clock, label: 'Appts', color: 'hover:bg-blue-500', action: () => setSelectedApptBiz(shop) },
                    { icon: Zap, label: 'Serv', color: 'hover:bg-purple-500', action: () => setSelectedServiceBiz(shop) },
                    { icon: Edit2, label: 'Edit', color: 'hover:bg-amber-500', action: () => setSelectedEditBiz(shop) },
                  ].map(({ icon: Icon, label, color, action }) => (
                    <button key={label} onClick={action}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-gray-200 ${color} hover:text-white transition-all`}>
                      <Icon size={13} />
                      <span className="text-[8px] font-black uppercase">{label}</span>
                    </button>
                  ))}
                  <a href={`/business/${shop.slug}`} target="_blank" rel="noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-gray-200 hover:bg-pink hover:text-white transition-all">
                    <Eye size={13} />
                    <span className="text-[8px] font-black uppercase">View</span>
                  </a>
                  <button disabled={deleteBusinessMutation.isPending}
                    onClick={() => setDeleteShopPopup(shop)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all">
                    {deleteBusinessMutation.isPending && deleteBusinessMutation.variables === shop.id ? <Spinner className="w-3 h-3" /> : <Trash2 size={13} />}
                    <span className="text-[8px] font-black uppercase">Del</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )) : (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"><Search size={40} /></div>
          <h3 className="font-display text-2xl text-ink mb-2">No Matches Found</h3>
          <p className="text-gray-400 font-semibold">Try adjusting your search filters.</p>
          {search && <button onClick={() => setSearch('')} className="mt-6 text-pink font-bold border-b border-pink/30 hover:border-pink transition-all text-sm">Clear search</button>}
        </div>
      )}

      {selectedApptBiz && <AdminAppointmentModal business={selectedApptBiz} onClose={() => setSelectedApptBiz(null)} />}
      {selectedServiceBiz && <AdminServiceModal business={selectedServiceBiz} onClose={() => setSelectedServiceBiz(null)} />}
      {selectedEditBiz && <AdminEditShopModal business={selectedEditBiz} onClose={() => setSelectedEditBiz(null)} />}
      <DeleteConfirmModal
        open={!!deleteVendorPopup}
        loading={deleteVendorMutation.isPending}
        title="Delete Vendor"
        description={`Purge account "${deleteVendorPopup?.email}" ?`}
        onClose={() => setDeleteVendorPopup(null)}
        onConfirm={() => {
          deleteVendorMutation.mutate(deleteVendorPopup.owner.id, {
            onSuccess: () => {
              setDeleteVendorPopup(null)
            }
          })
        }}
      />

      <DeleteConfirmModal
        open={!!deleteShopPopup}
        loading={deleteBusinessMutation.isPending}
        title="Delete Shop"
        description={`Delete "${deleteShopPopup?.name_en}" ?`}
        onClose={() => setDeleteShopPopup(null)}
        onConfirm={() => {
          deleteBusinessMutation.mutate(deleteShopPopup.id, {
            onSuccess: () => {
              setDeleteShopPopup(null)
            }
          })
        }}
      />
    </div>
  )
}

// ── Shared input class ─────────────────────────────────────────
const inputCls = "w-full bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all text-ink placeholder:text-gray-300"
const selectCls = "w-full bg-white  rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all text-ink"

function AdminEditShopModal({ business, onClose }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    name_en: business.name_en || '', name_ar: business.name_ar || '',
    description: business.description || '', short_description: business.short_description || '',
    category_id: business.category?.id || '', governorate_id: business.governorate?.id || '',
    phone: business.phone || '', whatsapp: business.whatsapp || '',
    email: business.email || '', website: business.website || '',
    address: business.address || '', logo_url: business.logo_url || '',
    cover_image_url: business.cover_image_url || '', gallery_urls: business.gallery_urls || [],
    business_hours: business.business_hours || {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: true },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    }
  })

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.list() })
  const { data: governorates } = useQuery({ queryKey: ['governorates'], queryFn: () => governorateApi.list() })

  const mutation = useMutation({
    mutationFn: (data) => businessApi.update(business.id, data),
    onSuccess: () => { toast.success('Shop updated'); queryClient.invalidateQueries(['admin-vendor-control']); onClose() },
    onError: (e) => toast.error(getErrorMessage(e))
  })

  const handleFileUpload = async (file, type) => {
    try {
      const res = await commonApi.upload(file)
      if (type === 'logo') setForm(prev => ({ ...prev, logo_url: res.url }))
      else if (type === 'cover') setForm(prev => ({ ...prev, cover_image_url: res.url }))
      else if (type === 'gallery') setForm(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, res.url] }))
      toast.success('Asset uploaded')
    } catch (e) { toast.error(getErrorMessage(e)) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (form.category_id) payload.category_id = parseInt(form.category_id)
    if (form.governorate_id) payload.governorate_id = parseInt(form.governorate_id)
    mutation.mutate(payload)
  }

  const getImageUrl = (url) => url ? (url.startsWith('/') ? import.meta.env.VITE_API_URL + url : url) : ''

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 md:p-7 border-b border-gray-200 flex justify-between items-center bg-gray-50 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
              <Edit2 size={18} />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl text-ink">Edit Shop</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{business.name_en}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} disabled={mutation.isPending} className="brand-btn px-4 md:px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm">
              {mutation.isPending ? <Spinner className="w-4 h-4" /> : <Save size={16} />}
              <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-gray-400 border border-gray-200 transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-200">
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Building2 size={13} /> Core Info</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Name (EN)</label>
                  <input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                    className={inputCls} /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Name (AR)</label>
                  <input value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                    className={inputCls + " text-right"} dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                    className={selectCls}>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                  </select></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Governorate</label>
                  <select value={form.governorate_id} onChange={e => setForm({ ...form, governorate_id: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                    className={selectCls}>
                    {governorates?.map(g => <option key={g.id} value={g.id}>{g.name_en}</option>)}
                  </select></div>
              </div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Short Description</label>
                <textarea value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} rows={2} style={{ border: '1px solid #dfdee5' }}
                  className={inputCls + " resize-none"} /></div>
            </div>

            <div className="space-y-4 bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-200">
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={13} /> Media Assets</h4>
              <div className="flex gap-3">
                <div className="group relative w-20 h-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 transition-colors">
                  {form.logo_url ? <img src={getImageUrl(form.logo_url)} className="w-full h-full object-cover" /> : <Upload size={18} className="text-gray-300" />}
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><Edit2 size={12} className="text-white" /></div>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files[0], 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="group relative flex-1 h-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 transition-colors">
                  {form.cover_image_url ? <img src={getImageUrl(form.cover_image_url)} className="w-full h-full object-cover" /> : <Upload size={18} className="text-gray-300" />}
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><Edit2 size={12} className="text-white" /></div>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files[0], 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {form.gallery_urls.map((url, i) => (
                  <div key={i} className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={getImageUrl(url)} className="w-full h-full object-cover" />
                    <button onClick={() => setForm({ ...form, gallery_urls: form.gallery_urls.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><X size={10} /></button>
                  </div>
                ))}
                <div className="relative aspect-square bg-white rounded-lg border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors">
                  <Plus size={16} className="text-gray-300" />
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files[0], 'gallery')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-200">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-4"><Clock size={13} /> Schedule</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(form.business_hours).map(([day, h]) => (
                <div key={day} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-[11px] font-black uppercase text-gray-500 w-20 capitalize">{day}</span>
                  <div className="flex items-center gap-2">
                    {!h.closed ? (
                      <>
                        <input type="time" value={h.open} onChange={e => setForm({ ...form, business_hours: { ...form.business_hours, [day]: { ...h, open: e.target.value } } })}
                          style={{ border: '1px solid #dfdee5' }}
                          className="text-[10px] font-bold bg-gray-50   rounded-lg px-2 py-1.5 outline-none focus:border-pink focus:ring-1 focus:ring-pink/10" />
                        <span className="text-gray-300 text-xs">→</span>
                        <input type="time" value={h.close} onChange={e => setForm({ ...form, business_hours: { ...form.business_hours, [day]: { ...h, close: e.target.value } } })}
                          style={{ border: '1px solid #dfdee5' }}
                          className="text-[10px] font-bold bg-gray-50  rounded-lg px-2 py-1.5 outline-none focus:border-pink focus:ring-1 focus:ring-pink/10" />
                      </>
                    ) : <span className="text-[10px] font-black text-red-400/60 uppercase mr-2">Closed</span>}
                    <button onClick={() => setForm({ ...form, business_hours: { ...form.business_hours, [day]: { ...h, closed: !h.closed } } })}
                      className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${h.closed ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                      {h.closed ? 'Open' : 'Close'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminAppointmentModal({ business, onClose }) {
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['admin-shop-bookings', business.id],
    queryFn: () => adminApi.getShopBookings(business.id)
  })

  const updateStatus = async (id, status) => {
    try { await adminApi.updateShopBookingStatus(id, status); toast.success(`Booking ${status}`); refetch() }
    catch (e) { toast.error(getErrorMessage(e)) }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 md:p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100"><Clock size={16} /></div>
            <div>
              <h3 className="font-display text-xl md:text-2xl text-ink">Appointments</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{business.name_en}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 md:p-8">
          {isLoading ? <Spinner /> : !bookings?.length ? (
            <div className="text-center py-20 opacity-40">
              <Clock size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-display text-xl text-ink/40">No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 hover:border-blue-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">
                        {booking.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{booking.name}</p>
                        <p className="text-xs text-gray-400">{booking.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-ink">{booking.service || 'Standard'}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-xs font-bold text-ink">{booking.date}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-xs font-bold text-blue-500">{booking.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>{booking.status}</span>
                      {booking.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => updateStatus(booking.id, 'confirmed')} className="w-9 h-9 bg-green-50 text-green-500 rounded-xl border border-green-100 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"><CheckCircle size={16} /></button>
                          <button onClick={() => updateStatus(booking.id, 'cancelled')} className="w-9 h-9 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><XCircle size={16} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminServiceModal({ business, onClose }) {
  const [newS, setNewS] = useState({ name: '', description: '', price: '' })
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['admin-shop-services', business.id],
    queryFn: () => adminApi.getShopServices(business.id)
  })
  const [errors, setErrors] = useState({})
  const serviceSchema = z.object({
    name: z.string().min(1, 'Service title is required'),
  })

  const handleAdd = async (e) => {
    e.preventDefault()

    console.log('handleAdd fired, newS:', newS)

    const result = serviceSchema.safeParse(newS)
    console.log('validation result:', result)

    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach(err => { fieldErrors[err.path[0]] = err.message })
      console.log('fieldErrors:', fieldErrors)
      setErrors(fieldErrors)
      return
    }

    try {
      await adminApi.createShopService({
        ...newS,
        business_id: business.id
      })

      setNewS({
        name: '',
        description: '',
        price: ''
      })

      toast.success('Service added')
      refetch()
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try { await adminApi.deleteShopService(id); toast.success('Service deleted'); refetch() }
    catch (e) { toast.error(getErrorMessage(e)) }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 md:p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-purple-600" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100"><Zap size={16} /></div>
            <div>
              <h3 className="font-display text-xl md:text-2xl text-ink">Services</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{business.name_en}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 hover:text-purple-600 transition-all border border-gray-200"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8">
          <form onSubmit={handleAdd} className="mb-8 p-5 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-4">
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Add New Service</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Title<span className="text-red-500">*</span>
                </label>

                <input
                  value={newS.name}
                  onChange={(e) => {
                    setNewS({ ...newS, name: e.target.value })
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: '' }))
                    }
                  }}
                  placeholder="Enter service title"
                  style={{ border: errors.name ? '1px solid #ef4444' : '1px solid #dfdee5' }}
                  className={inputCls}
                />

                {errors.name && (
                  <p className="text-xs mt-1 font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Price</label>
                <input placeholder="Ex: 15 OMR" value={newS.price} onChange={e => setNewS({ ...newS, price: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                  className={inputCls} /></div>
            </div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
              <input placeholder="What does this service involve?" value={newS.description} onChange={e => setNewS({ ...newS, description: e.target.value })} style={{ border: '1px solid #dfdee5' }}
                className={inputCls} /></div>
            <button type="submit" className="w-full py-3 bg-ink text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 transition-all flex items-center justify-center gap-2">
              Add Service <Zap size={13} />
            </button>
          </form>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Active Services</p>
            {isLoading ? <Spinner /> : services?.length === 0 ? (
              <div className="text-center py-10 opacity-30"><Zap size={28} className="mx-auto mb-2" /><p className="text-xs font-bold uppercase">No services yet</p></div>
            ) : services?.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 transition-all group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 flex-shrink-0"><Zap size={14} /></div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-ink text-sm truncate">{s.name}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-pink font-bold">{s.price || 'P.O.A'}</p>
                      {s.description && <><span className="w-1 h-1 bg-gray-200 rounded-full" /><p className="text-[10px] text-gray-400 italic truncate">{s.description}</p></>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)} className="w-9 h-9 rounded-xl bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}