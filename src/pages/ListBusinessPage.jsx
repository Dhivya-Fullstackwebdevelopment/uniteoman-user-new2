import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { categoryApi, governorateApi, businessApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/utils'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'
import { Building2, MapPin, CheckCircle } from 'lucide-react'
import { z } from 'zod'

export default function ListBusinessPage() {
  const { isVendor } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name_en: '',
    name_ar: '',
    description: '',
    short_description: '',
    category_id: '',
    governorate_id: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState({})
  const businessSchema = z.object({
    name_en: z
      .string()
      .min(1, 'Shop name is required'),

    category_id: z
      .string()
      .min(1, 'Category is required'),

    governorate_id: z
      .string()
      .min(1, 'Governorate is required'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^[0-9]+$/, 'Phone number must contain only numbers')
      .min(10, 'Phone number must be at least 10 digits'),
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isVendor) {
      toast.error('Please log in or register to list a business')
      navigate('/vendor/login')
    }
  }, [isVendor, navigate])

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list()
  })

  const { data: governorates } = useQuery({
    queryKey: ['governorates'],
    queryFn: () => governorateApi.list()
  })

  const mutation = useMutation({
    mutationFn: (data) => businessApi.create(data),
    onSuccess: () => {
      setSuccess(true)
    },
    onError: (e) => {
      toast.error(getErrorMessage(e))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = businessSchema.safeParse(form)

    if (!result.success) {

      const fieldErrors = result.error.flatten().fieldErrors

      setErrors({
        name_en: fieldErrors.name_en?.[0],
        category_id: fieldErrors.category_id?.[0],
        governorate_id: fieldErrors.governorate_id?.[0],
        phone: fieldErrors.phone?.[0],
      })

      return
    }

    setErrors({})

    // Convert to integers and omit empty optionals to avoid 422 errors
    const payload = {
      ...form,
      category_id: parseInt(form.category_id),
      governorate_id: parseInt(form.governorate_id),
      email: form.email || undefined,
      phone: form.phone || undefined,
      whatsapp: form.phone || undefined,
    }

    mutation.mutate(payload)
  }

  const handleChange = (e) => {

    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }))
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  if (!isVendor) return null

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100">
          <CheckCircle size={48} />
        </div>
        <h1 className="font-display text-3xl font-normal text-ink mb-4">Shop Details Submitted!</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
          Your business has been sent for admin review. It will appear on the platform once verified and approved.
        </p>
        <button onClick={() => navigate('/')} className="brand-btn px-8 py-3 rounded-xl font-bold">
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6">

        <div className="mb-8 text-center text-ink mt-8">
          <div className="inline-flex w-14 h-14 bg-pink-light text-pink rounded-full items-center justify-center mb-4">
            <Building2 size={24} />
          </div>
          <h1 className="font-display text-3xl font-normal mb-2">List Your Business</h1>
          <p className="text-gray-500">Add your shop to Oman's largest digital directory.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Shop Name (English)<span className="text-red-500"> *</span></label>
              <input name="name_en" value={form.name_en} onChange={handleChange}
                style={{ border: '1px solid #dfdee5' }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors" />
              {errors.name_en && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.name_en}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Shop Name (Arabic)</label>
              <input name="name_ar" value={form.name_ar} onChange={handleChange}
                style={{ border: '1px solid #dfdee5' }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors text-right" dir="rtl" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Short Description</label>
            <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="A quick one-liner about your shop"
              style={{ border: '1px solid #dfdee5' }}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe what you sell or the services you offer..."
              style={{ border: '1px solid #dfdee5' }}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Category<span className='text-red-500'>*</span></label>
              <select name="category_id" value={form.category_id} onChange={handleChange}
                style={{ border: '1px solid #dfdee5' }}
                className="w-full  rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-purple transition-colors bg-white">
                <option value="">Select a category</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name_en}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.category_id}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1"><MapPin size={12} /> Governorate<span className='text-red-500'>*</span></label>
              <select name="governorate_id" value={form.governorate_id} onChange={handleChange}
                style={{ border: '1px solid #dfdee5' }}
                className="w-full  rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-purple transition-colors bg-white">
                <option value="">Select a location</option>
                {governorates?.map(g => (
                  <option key={g.id} value={g.id}>{g.emoji} {g.name_en}</option>
                ))}
              </select>
              {errors.governorate_id && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.governorate_id}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Phone Number
                <span className='text-red-500'>*</span>
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="98765432"
                style={{ border: '1px solid #dfdee5' }}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors"
              />

              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Business Email</label>
              <input name="email" value={form.email} onChange={handleChange} type="email"
                style={{ border: '1px solid #dfdee5' }}
                className="w-full  rounded-xl px-4 py-3 text-sm outline-none focus:border-purple transition-colors" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button type="submit" disabled={mutation.isPending} className="w-full brand-btn py-4 rounded-xl font-bold shadow-xl shadow-pink/20 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider">
              {mutation.isPending ? <Spinner className="w-5 h-5 border-2 mx-auto" borderTopColor="transparent" /> : 'Submit for Approval'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3 font-semibold">Your submission will be reviewed by an administrator before appearing publicly.</p>
          </div>
        </form>

      </div>
    </div>
  )
}
