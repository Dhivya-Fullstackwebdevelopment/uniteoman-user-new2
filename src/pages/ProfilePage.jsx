import { useEffect, useState } from 'react'
import {
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Bell,
  CreditCard,
  ClipboardList,
  HelpCircle,
  LogOut,
  ChevronRight,
  Home,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { customerAuthApi } from '@/lib/api'
import toast from 'react-hot-toast'

// ---- Sidebar nav config -----------------------------------------------
const NAV_ITEMS = [
  { key: 'bookings', icon: ClipboardList, label: 'My Bookings', sub: (p) => `${p?.bookings_count ?? 0} total` },
  { key: 'addresses', icon: MapPin, label: 'Saved Addresses', sub: (p) => `${p?.addresses?.length ?? 0} addresses` },
  { key: 'payments', icon: CreditCard, label: 'Payment Methods', sub: (p) => `${p?.payment_methods_count ?? 0} cards` },
  { key: 'notifications', icon: Bell, label: 'Notifications', sub: () => 'Settings' },
  { key: 'language', icon: Globe, label: 'Language', sub: (p) => p?.language || 'English' },
  { key: 'help', icon: HelpCircle, label: 'Help & Support', sub: () => null },
  { key: 'logout', icon: LogOut, label: 'Logout', sub: () => null },
]

const ADDRESS_ICONS = {
  home: Home,
  work: Briefcase,
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await customerAuthApi.me()
      setProfile(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleNavClick = (key) => {
    if (key === 'logout') {
      // hook up real logout handler here
      toast('Logging out…')
      return
    }
    toast(`${key} coming soon`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
        <div className="w-10 h-10 rounded-full border-4 border-fuchsia-200 border-t-fuchsia-600 animate-spin" />
      </div>
    )
  }

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || '?'
  const addresses = profile?.addresses ?? []

  const stats = [
    { label: 'Bookings', value: profile?.bookings_count ?? 0, sub: 'Total services' },
    { label: 'Avg Rating', value: profile?.avg_rating ? `${profile.avg_rating}/5` : '—', sub: 'Your reviews' },
    { label: 'Total Spent', value: profile?.total_spent != null ? `OMR ${profile.total_spent}` : 'OMR 0', sub: 'All time' },
  ]

  const fields = [
    { label: 'Full Name', value: profile?.full_name },
    { label: 'Phone', value: profile?.phone },
    { label: 'Email', value: profile?.email },
    { label: 'Language', value: profile?.language || 'English' },
    { label: 'Preferred Area', value: profile?.preferred_area || '—' },
    { label: 'Notification', value: profile?.notification_prefs || 'SMS + Push + WhatsApp' },
  ]

  return (
    <div className="min-h-screen bg-[#F4F5F8] p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 max-w-6xl mx-auto">
        {/* ---------------- Sidebar ---------------- */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-[18px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-fuchsia-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3.5">
              {initial}
            </div>
            <div className="font-bold text-[16px] text-[#0A0A0F]">{profile?.full_name}</div>
            <div className="text-xs text-[#9090A0] mt-1">{profile?.phone}</div>
            <button className="mt-3 px-5 py-2 rounded-[9px] bg-gradient-to-br from-fuchsia-600 to-violet-500 text-white font-bold text-xs">
              Edit Profile
            </button>
          </div>

          {/* Nav list */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
            {NAV_ITEMS.map(({ key, icon: Icon, label, sub }, i) => {
              const subText = sub(profile)
              return (
                <button
                  key={key}
                  onClick={() => handleNavClick(key)}
                  className={`w-full flex items-center gap-3 px-4 py-[13px] text-left hover:bg-gray-50 transition-colors ${
                    i !== NAV_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Icon size={17} className="text-[#5b5b6b] shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-[13px] text-[#0A0A0F]">{label}</div>
                    {subText && <div className="text-[11px] text-[#9090A0] mt-0.5">{subText}</div>}
                  </div>
                  <ChevronRight size={14} className="text-[#9090A0]" />
                </button>
              )
            })}
          </div>
        </div>

        {/* ---------------- Main content ---------------- */}
        <div>
          <h1 className="font-extrabold text-[22px] tracking-tight text-[#0A0A0F] mb-4">Account Overview</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-[14px] p-4 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
                <div className="font-extrabold text-2xl text-[#0A0A0F] mb-1">{s.value}</div>
                <div className="font-bold text-xs text-[#0A0A0F]">{s.label}</div>
                <div className="text-[11px] text-[#9090A0] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Personal information */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] mb-4">
            <div className="font-bold text-sm text-[#0A0A0F] mb-3.5">Personal Information</div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.label}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9090A0] mb-1.5">
                    {f.label}
                  </div>
                  <div className="bg-[#F4F5F8] border border-[#EBEBEF] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0A0A0F]">
                    {f.value || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved addresses */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
            <div className="font-bold text-sm text-[#0A0A0F] mb-3.5">Saved Addresses</div>
            <div className="flex flex-col gap-2.5">
              {addresses.length === 0 && (
                <div className="text-[13px] text-[#9090A0]">No saved addresses yet.</div>
              )}

              {addresses.map((addr, idx) => {
                const AddrIcon = ADDRESS_ICONS[addr.type?.toLowerCase()] || MapPin
                return (
                  <div
                    key={addr.id ?? idx}
                    className="flex items-center gap-3 p-3 bg-[#F4F5F8] rounded-xl border border-[#EBEBEF]"
                  >
                    <AddrIcon size={18} className="text-[#5b5b6b] shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-xs text-[#0A0A0F]">{addr.label || addr.type}</div>
                      <div className="text-[11px] text-[#9090A0] mt-0.5">{addr.full_address}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#EBEBEF] rounded-lg text-[10px] font-semibold text-[#9090A0]">
                        <Pencil size={11} /> Edit
                      </button>
                      <button className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FFE4E6] rounded-lg text-[10px] font-semibold text-[#EF4444]">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                )
              })}

              <button className="p-3 bg-fuchsia-50/60 border border-dashed border-fuchsia-300 rounded-xl text-center font-bold text-xs text-fuchsia-600 flex items-center justify-center gap-1.5">
                <Plus size={14} /> Add New Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}