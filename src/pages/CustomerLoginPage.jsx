import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, Sparkles, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import API_BASE_URL from '@/config/api'

// ── Theme Design Tokens (Matching Admin Page) ────────────────
const BRAND_FROM = '#D61CA8'
const BRAND_TO = '#8B2EF5'
const BRAND_GRADIENT = 'linear-gradient(135deg, #D61CA8, #8B2EF5)';

export default function CustomerLoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [showOtpScreen, setShowOtpScreen] = useState(false)
    const [otp, setOtp] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // Get redirect URL from query params
    const redirectTo = searchParams.get('redirect') || '/'
    
    const [otpTimer, setOtpTimer] = useState(600)
    const [canResendOtp, setCanResendOtp] = useState(false)

    // ================= FORM STATE =================
    const [formData, setFormData] = useState({
        name: '',
        mobile_number: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({})

    // ================= SCHEMAS =================
    const loginSchema = z.object({
        mobile_number: z
            .string()
            .trim()
            .min(10, 'Mobile number must be 10 digits')
            .max(10, 'Mobile number must be 10 digits')
            .regex(/^[0-9]+$/, 'Enter a valid mobile number'),
        password: z
            .string()
            .min(1, 'Password is required'),
    })

    const registerSchema = z.object({
        name: z
            .string()
            .trim()
            .min(1, 'Full name is required'),
        mobile_number: z
            .string()
            .trim()
            .min(10, 'Mobile number must be 10 digits')
            .max(10, 'Mobile number must be 10 digits')
            .regex(/^[0-9]+$/, 'Enter a valid mobile number'),
        email: z
            .string()
            .trim()
            .email('Enter a valid email address')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number and special character'),
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

    // ================= API CALLS =================
    const apiCall = async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        
        const result = await response.json()
        
        if (!response.ok) {
            // Extract error message from different possible formats
            const errorMessage = result.detail || result.message || result.error || 'Something went wrong'
            throw new Error(errorMessage)
        }
        
        return result
    }

    // ================= SEND OTP FOR REGISTRATION =================
    const handleSendOtp = async () => {
        try {
            setLoading(true)
            
            // First, validate the form data
            const result = registerSchema.safeParse(formData)
            if (!result.success) {
                const fieldErrors = {}
                result.error.issues.forEach(err => {
                    fieldErrors[err.path[0]] = err.message
                })
                setErrors(fieldErrors)
                return
            }
            
            // Send OTP first
            const otpResponse = await apiCall('/auth/otp/send/', {
                mobile_number: formData.mobile_number
            })
            
            toast.success(otpResponse.message || 'OTP sent to your mobile number')
            
            // Store debug OTP if available (for testing)
            if (otpResponse.debug_otp) {
                console.log('Debug OTP:', otpResponse.debug_otp)
                // Auto-fill OTP for development
                // setOtp(otpResponse.debug_otp)
            }
            
            setOtpTimer(600)
            setCanResendOtp(false)
            setShowOtpScreen(true)
            
        } catch (err) {
            toast.error(err.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    // ================= LOGIN =================
    const handleLogin = async () => {
        try {
            setLoading(true)
            
            const response = await apiCall('/auth/login/', {
                mobile_number: formData.mobile_number,
                password: formData.password,
            })

            // Store auth data
            localStorage.setItem('customer_token', response.access)
            localStorage.setItem('refresh_token', response.refresh)
            localStorage.setItem('customerUser', JSON.stringify(response.user))
            
            toast.success(response.message || 'Login successful')
            setIsAuthenticated(true)
            navigate(redirectTo, { replace: true })
            
        } catch (err) {
            toast.error(err.message || 'Invalid mobile number or password')
        } finally {
            setLoading(false)
        }
    }

    // ================= VERIFY OTP & REGISTER =================
    const handleVerifyOtpAndRegister = async (e) => {
        e.preventDefault()
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }

        try {
            setLoading(true)
            
            // Step 1: Verify OTP
            const verifyResponse = await apiCall('/auth/otp/verify/', {
                mobile_number: formData.mobile_number,
                otp_code: otp,
            })
            
            toast.success(verifyResponse.message || 'OTP verified successfully!')
            
            // Step 2: After OTP verification, register the user
            const registerData = {
                mobile_number: formData.mobile_number,
                password: formData.password,
            }
            
            // Add optional fields if they exist
            if (formData.name) registerData.name = formData.name
            if (formData.email) registerData.email = formData.email
            
            const registerResponse = await apiCall('/auth/register/', registerData)
            toast.success(registerResponse.message || 'Account created successfully!')
            
            // Step 3: Auto login after registration
            const loginResponse = await apiCall('/auth/login/', {
                mobile_number: formData.mobile_number,
                password: formData.password,
            })

            // Store auth data
            localStorage.setItem('customer_token', loginResponse.access)
            localStorage.setItem('refresh_token', loginResponse.refresh)
            localStorage.setItem('customerUser', JSON.stringify(loginResponse.user))
            
            toast.success('Account created and verified successfully!')
            setIsAuthenticated(true)
            navigate(redirectTo, { replace: true })
            
        } catch (err) {
            toast.error(err.message || 'Invalid OTP or registration failed')
        } finally {
            setLoading(false)
        }
    }

    // ================= RESEND OTP =================
    const handleResendOtp = async () => {
        try {
            setLoading(true)
            const response = await apiCall('/auth/otp/send/', {
                mobile_number: formData.mobile_number
            })
            
            toast.success(response.message || 'OTP resent successfully')
            
            // Store debug OTP if available
            if (response.debug_otp) {
                console.log('New Debug OTP:', response.debug_otp)
            }
            
            setOtp('')
            setOtpTimer(600)
            setCanResendOtp(false)
        } catch (err) {
            toast.error(err.message || 'Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    // ================= MAIN SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        
        let result

        if (isLogin) {
            result = loginSchema.safeParse({
                mobile_number: formData.mobile_number,
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

            await handleLogin()
        } else {
            // For registration, send OTP first
            await handleSendOtp()
        }
    }

    // ================= TIMER EFFECT =================
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

    // ================= CHECK AUTH STATUS =================
    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        
        if (token) {
            try {
                setIsAuthenticated(true)
                // Add small delay to prevent blink
                setTimeout(() => {
                    navigate(redirectTo, { replace: true })
                }, 100)
            } catch (error) {
                localStorage.removeItem('customer_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('customerUser')
                setIsAuthenticated(false)
            }
        }
        
        setCheckingAuth(false)
    }, [navigate, redirectTo])

    // ================= RESET FORM =================
    const resetForm = () => {
        setFormData({ name: '', mobile_number: '', email: '', password: '' })
        setErrors({})
        setOtp('')
        setShowOtpScreen(false)
    }

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F8FA' }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto" 
                         style={{ borderColor: BRAND_FROM, borderTopColor: 'transparent' }} />
                    <p className="mt-4 text-sm text-[#9090A0]">Loading...</p>
                </div>
            </div>
        )
    }

    // If authenticated, don't render the login page
    if (isAuthenticated) {
        return null
    }

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
                                    <Phone size={24} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-black text-[#0A0A0F] tracking-tight">
                                Verify OTP
                            </h1>
                            <p className="text-sm text-[#9090A0] font-medium mt-1">
                                OTP sent to <span className="text-gray-700 font-semibold">{formData.mobile_number}</span>
                            </p>
                            {process.env.NODE_ENV === 'development' && (
                                <p className="text-xs text-[#9090A0] mt-2">
                                    💡 Check console for debug OTP
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6">
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
                                        disabled={loading}
                                        className="text-xs font-bold hover:underline transition-all disabled:opacity-50"
                                        style={{ color: BRAND_FROM }}
                                    >
                                        {loading ? 'Sending...' : 'Resend OTP Code'}
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
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Verify & Create Account →'
                                )}
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
                                    <User size={30} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-semibold text-[#0A0A0F] tracking-tight">
                                {isLogin ? 'Customer Login' : 'Create Account'}
                            </h1>
                            <p className="text-sm text-[#9090A0] font-medium mt-1">
                                {isLogin ? 'Login to continue booking services' : 'Create your customer account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name - Only for Registration */}
                            {!isLogin && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            placeholder="Enter your full name"
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            style={{
                                                border: errors.name ? '1px solid #ef4444' : '1px solid #dfdee5',
                                                background: '#F8F8FA'
                                            }}
                                            className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                                            <AlertCircle size={12} strokeWidth={2.5} />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Email - Only for Registration */}
                            {!isLogin && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                        Email Address <span className="text-gray-400 text-[8px]">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
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
                            )}

                            {/* Mobile Number */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C4CBD6] ml-0.5 block mb-1.5">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="mobile_number"
                                        value={formData.mobile_number}
                                        placeholder="9994078964"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        maxLength={10}
                                        style={{
                                            border: errors.mobile_number ? '1px solid #ef4444' : '1px solid #dfdee5',
                                            background: '#F8F8FA'
                                        }}
                                        className="w-full rounded-xl py-3 px-3.5 text-sm font-bold text-[#0A0A0F] placeholder-[#C4CBD6] focus:outline-none transition-all"
                                    />
                                </div>
                                {errors.mobile_number && (
                                    <p className="text-xs mt-1.5 flex items-center gap-1 font-medium text-red-500">
                                        <AlertCircle size={12} strokeWidth={2.5} />
                                        {errors.mobile_number}
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
                                {!isLogin && !errors.password && formData.password && (
                                    <p className="text-[10px] text-green-600 mt-1">
                                        ✓ Strong password
                                    </p>
                                )}
                                {!isLogin && !errors.password && !formData.password && (
                                    <p className="text-[10px] text-[#9090A0] mt-1">
                                        Must contain uppercase, lowercase, number & special character
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
                                        Sending OTP...
                                    </>
                                ) : isLogin ? (
                                    'Log In →'
                                ) : (
                                    'Send OTP →'
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