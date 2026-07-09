import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { customerAuthApi } from '@/lib/api'

// ── Theme Design Tokens (Matching Admin Page) ────────────────
const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

export default function CustomerLoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [showOtpScreen, setShowOtpScreen] = useState(false)
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // Get redirect URL from query params, default to a specific page if not provided
    const redirectTo = searchParams.get('redirect') || '/business/the-psychology-clinic/book'
    
    const [otpTimer, setOtpTimer] = useState(600)
    const [canResendOtp, setCanResendOtp] = useState(false)

    // ================= FORM STATE =================
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({})

    // ================= SCHEMAS =================
    const loginSchema = z.object({
        email: z
            .string()
            .trim()
            .min(1, 'Email is required')
            .email('Enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required'),
    })

    const registerSchema = z.object({
        full_name: z
            .string()
            .trim()
            .min(1, 'Full name is required'),
        email: z
            .string()
            .trim()
            .min(1, 'Email is required')
            .email('Enter a valid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters'),
    })

    // ================= INPUT UTILS =================
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        if (errors[e.target.name]) {
            setErrors((prev) => ({
                ...prev,
                [e.target.name]: '',
            }))
        }
    }

    // Interactive focus utilities mimicking admin fields
    const handleFocus = (e) => {
        if (!errors[e.target.name]) {
            e.target.style.borderColor = BRAND_FROM
            e.target.style.boxShadow = '0 0 0 3px rgba(214,28,168,.12)'
        }
    }

    const handleBlur = (e) => {
        e.target.style.borderColor = errors[e.target.name] ? '#ef4444' : '#dfdee5'
        e.target.style.boxShadow = 'none'
    }

    // ================= ACTIONS =================
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        let result

        if (isLogin) {
            result = loginSchema.safeParse({
                email: formData.email,
                password: formData.password,
            })

            if (!result.success) {
                const fieldErrors = {}
                result.error.issues.forEach(err => {
                    fieldErrors[err.path[0]] = err.message
                })
                setErrors(fieldErrors)
                return
            }

            try {
                setLoading(true)
                const response = await customerAuthApi.login({
                    email: formData.email,
                    password: formData.password,
                })

                // Store auth data
                localStorage.setItem('customer_token', response.access_token)
                localStorage.setItem('customerUser', JSON.stringify(response.customer))
                
                toast.success('Login successful')
                
                // Use navigate with replace to prevent going back to login page
                // This will redirect to the specified page
                navigate(redirectTo, { replace: true })
                
            } catch (err) {
                toast.error(err.response?.data?.detail || 'Invalid email or password')
            } finally {
                setLoading(false)
            }
        } else {
            result = registerSchema.safeParse(formData)

            if (!result.success) {
                const fieldErrors = {}
                result.error.issues.forEach(err => {
                    fieldErrors[err.path[0]] = err.message
                })
                setErrors(fieldErrors)
                return
            }

            try {
                setLoading(true)
                await customerAuthApi.sendOtp({
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password,
                })

                toast.success('OTP sent to your email')
                setOtpTimer(600)
                setCanResendOtp(false)
                setShowOtpScreen(true)
            } catch (err) {
                toast.error(err.response?.data?.detail || 'Failed to send OTP')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        if (!otp) {
            toast.error('Enter OTP')
            return
        }

        try {
            setLoading(true)
            const response = await customerAuthApi.verifyOtp({
                email: formData.email,
                otp,
            })

            localStorage.setItem('customer_token', response.access_token)
            localStorage.setItem('customerUser', JSON.stringify(response.customer))
            toast.success('Account created successfully')
            
            // Use navigate with replace to prevent going back to login page
            // This will redirect to the specified page
            navigate(redirectTo, { replace: true })
            
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ full_name: '', email: '', password: '' })
        setErrors({})
        setOtp('')
        setShowOtpScreen(false)
    }

    useEffect(() => {
        let interval
        if (showOtpScreen && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1)
            }, 1000)
        } else if (otpTimer === 0) {
            setCanResendOtp(true)
        }
        return () => clearInterval(interval)
    }, [showOtpScreen, otpTimer])

    const handleResendOtp = async () => {
        try {
            setLoading(true)
            await customerAuthApi.sendOtp({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
            })
            toast.success('OTP resent successfully')
            setOtp('')
            setOtpTimer(600)
            setCanResendOtp(false)
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    // ================= CHECK AUTH STATUS =================
    // Check if user is already authenticated and redirect them
    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        if (token) {
            // If already logged in, redirect to the intended page
            navigate(redirectTo, { replace: true })
        }
    }, [navigate, redirectTo])

    // ── Render View ───────────────────────────────────────────
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{
                fontFamily: '"DM Sans", sans-serif',
                background: '#F8F8FA'
            }}
        >
            <div
                className="bg-white rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,.08)] p-8 w-full max-w-md"
                style={{ border: '1px solid rgba(0,0,0,.04)' }}
            >
                {showOtpScreen ? (
                    /* ── OTP SCREEN ── */
                    <>
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                                    style={{ background: BRAND_GRADIENT }}
                                >
                                    <Mail size={24} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-black text-[#0A0A0F] tracking-tight">
                                Verify OTP
                            </h1>
                            <p className="text-sm text-[#9090A0] font-medium mt-1">
                                OTP sent to <span className="text-gray-700 font-semibold">{formData.email}</span>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-2 text-center">
                                    Enter 6-Digit OTP <span className="text-red-500">*</span>
                                </label>
                                <div className="flex justify-center gap-2">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={otp[index] || ''}
                                            style={{
                                                border: '1px solid #dfdee5',
                                                background: '#F8F8FA'
                                            }}
                                            className="w-11 h-13 text-center text-xl font-bold text-[#0A0A0F] rounded-xl focus:outline-none transition-all"
                                            onFocus={(e) => {
                                                e.target.style.borderColor = BRAND_FROM
                                                e.target.style.boxShadow = '0 0 0 2px rgba(214,28,168,.12)'
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#dfdee5'
                                                e.target.style.boxShadow = 'none'
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (!value) return
                                                const otpArray = otp.split('')
                                                otpArray[index] = value
                                                const newOtp = otpArray.join('')
                                                setOtp(newOtp)

                                                const next = document.getElementById(`otp-${index + 1}`)
                                                if (next) next.focus()
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace') {
                                                    const otpArray = otp.split('')
                                                    otpArray[index] = ''
                                                    setOtp(otpArray.join(''))

                                                    const prev = document.getElementById(`otp-${index - 1}`)
                                                    if (prev) prev.focus()
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                {!canResendOtp ? (
                                    <p className="text-xs text-[#9090A0] font-medium">
                                        Resend OTP in
                                        <span className="font-bold ml-1" style={{ color: BRAND_FROM }}>
                                            {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-xs font-bold hover:underline"
                                        style={{ color: BRAND_FROM }}
                                    >
                                        Resend OTP Code
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-[15px] rounded-[14px] text-center text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{
                                    background: BRAND_GRADIENT,
                                    boxShadow: '0 6px 20px rgba(214,28,168,.35)'
                                }}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP →'}
                            </button>
                        </form>
                    </>
                ) : (
                    /* ── LOGIN / ACC CREATION SCREEN ── */
                    <>
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                                    style={{ background: BRAND_GRADIENT }}
                                >
                                    <span className="text-2xl">{isLogin ?   <User size={30} /> : <User size={30} />}</span>
                                </div>
                            </div>
                            <h1 className="text-2xl font-black text-[#0A0A0F] tracking-tight">
                                {isLogin ? 'Customer Login' : 'Create Account'}
                            </h1>
                            <p className="text-sm text-[#9090A0] font-medium mt-1">
                                {isLogin ? 'Login to continue booking services' : 'Create your customer account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            {!isLogin && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            placeholder="Enter your full name"
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            style={{
                                                border: errors.full_name ? '1px solid #ef4444' : '1px solid #dfdee5',
                                                background: '#F8F8FA'
                                            }}
                                            className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                                        />
                                    </div>
                                    {errors.full_name && (
                                        <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                                            <AlertCircle size={12} strokeWidth={2.5} />
                                            {errors.full_name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Email Address */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        placeholder="example@gmail.com"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        style={{
                                            border: errors.email ? '1px solid #ef4444' : '1px solid #dfdee5',
                                            background: '#F8F8FA'
                                        }}
                                        className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                                        <AlertCircle size={12} strokeWidth={2.5} />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        style={{
                                            border: errors.password ? '1px solid #ef4444' : '1px solid #dfdee5',
                                            background: '#F8F8FA'
                                        }}
                                        className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                                        <AlertCircle size={12} strokeWidth={2.5} />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Secure Session Info Tip */}
                            <div
                                className="rounded-[10px] px-3 py-2 flex items-center gap-1.5 mt-1"
                                style={{ background: 'rgba(214,28,168,.05)' }}
                            >
                                <Sparkles size={12} style={{ color: BRAND_FROM }} />
                                <span className="text-[11px] leading-snug text-[#6B7280]">
                                    <span style={{ color: BRAND_FROM, fontWeight: 600 }}>Protected:</span> Verified customer portal session.
                                </span>
                            </div>

                            {/* Submit Button */}
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
                                        Please wait...
                                    </>
                                ) : isLogin ? (
                                    'Log In →'
                                ) : (
                                    'Create Account →'
                                )}
                            </button>

                            {/* Switch View Toggle Layout */}
                            <div className="text-center text-[12px] text-[#9090A0] font-semibold mt-4 pt-4 border-t border-gray-100">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        resetForm()
                                    }}
                                    className="ml-1.5 font-bold hover:underline transition-all"
                                    style={{ color: BRAND_FROM }}
                                >
                                    {isLogin ? 'Register Here' : 'Log In Instead'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}