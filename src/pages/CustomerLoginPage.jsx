import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { customerAuthApi } from '@/lib/api'
import { useEffect } from 'react'

export default function CustomerLoginPage() {

    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [showOtpScreen, setShowOtpScreen] = useState(false)
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/'
    const [otpTimer, setOtpTimer] = useState(600)
    const [canResendOtp, setCanResendOtp] = useState(false)


    // ================= FORM =================

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
            .min(1, 'Email is required')
            .email('Enter valid email'),

        password: z
            .string()
            .min(1, 'Password is required'),
    })

    const registerSchema = z.object({
        full_name: z
            .string()
            .min(1, 'Full name is required'),

        email: z
            .string()
            .min(1, 'Email is required')
            .email('Enter valid email'),

        password: z
            .string()
            .min(6, 'Password must be at least 6 characters'),
    })

    // ================= HANDLE CHANGE =================

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

    // ================= LOGIN / REGISTER =================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setErrors({})

        let result

        // ================= LOGIN =================

        if (isLogin) {

            result = loginSchema.safeParse({
                email: formData.email,
                password: formData.password,
            })

            if (!result.success) {

                const fieldErrors =
                    result.error.flatten().fieldErrors

                setErrors({
                    email: fieldErrors.email?.[0],
                    password: fieldErrors.password?.[0],
                })

                return
            }

            try {

                setLoading(true)

                const response =
                    await customerAuthApi.login({
                        email: formData.email,
                        password: formData.password,
                    })

                localStorage.setItem(
                    'customer_token',
                    response.access_token
                )

                localStorage.setItem(
                    'customerUser',
                    JSON.stringify(response.customer)
                )

                toast.success('Login successful')

                window.location.href = redirectTo;
            } catch (err) {

                toast.error(
                    err.response?.data?.detail ||
                    'Invalid email or password'
                )

            } finally {

                setLoading(false)
            }
        }

        // ================= REGISTER =================

        else {

            result = registerSchema.safeParse(formData)

            if (!result.success) {

                const fieldErrors =
                    result.error.flatten().fieldErrors

                setErrors({
                    full_name: fieldErrors.full_name?.[0],
                    email: fieldErrors.email?.[0],
                    password: fieldErrors.password?.[0],
                })

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

                toast.error(
                    err.response?.data?.detail ||
                    'Failed to send OTP'
                )

            } finally {

                setLoading(false)
            }
        }
    }

    // ================= VERIFY OTP =================

    const handleVerifyOtp = async (e) => {

        e.preventDefault()

        if (!otp) {
            toast.error('Enter OTP')
            return
        }

        try {

            setLoading(true)

            const response =
                await customerAuthApi.verifyOtp({
                    email: formData.email,
                    otp,
                })

            localStorage.setItem(
                'customer_token',
                response.access_token
            )

            localStorage.setItem(
                'customerUser',
                JSON.stringify(response.customer)
            )

            toast.success('Account created successfully')

            window.location.href = redirectTo;
            
        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                'Invalid OTP'
            )

        } finally {

            setLoading(false)
        }
    }

    const resetForm = () => {

        setFormData({
            full_name: '',
            email: '',
            password: '',
        })

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

    }, [showOtpScreen, otpTimer]);

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

            toast.error(
                err.response?.data?.detail ||
                'Failed to resend OTP'
            )

        } finally {

            setLoading(false)
        }
    }
    // ================= OTP SCREEN =================

    if (showOtpScreen) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

                    <div className="text-center mb-8">

                        <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
                            <Mail size={30} />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Verify OTP
                        </h1>

                        <p className="text-sm text-gray-400 mt-2">
                            OTP sent to {formData.email}
                        </p>
                    </div>

                    <form
                        onSubmit={handleVerifyOtp}
                        className="space-y-5"
                    >

                        <div>

                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                Enter OTP
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="flex justify-center gap-3">

                                {Array.from({ length: 6 }).map((_, index) => (

                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={otp[index] || ''}

                                        onChange={(e) => {

                                            const value = e.target.value.replace(/\D/g, '')

                                            if (!value) return

                                            const otpArray = otp.split('')

                                            otpArray[index] = value

                                            const newOtp = otpArray.join('')

                                            setOtp(newOtp)

                                            const next =
                                                document.getElementById(
                                                    `otp-${index + 1}`
                                                )

                                            if (next) {
                                                next.focus()
                                            }
                                        }}

                                        onKeyDown={(e) => {

                                            if (e.key === 'Backspace') {

                                                const otpArray = otp.split('')

                                                otpArray[index] = ''

                                                setOtp(otpArray.join(''))

                                                const prev =
                                                    document.getElementById(
                                                        `otp-${index - 1}`
                                                    )

                                                if (prev) {
                                                    prev.focus()
                                                }
                                            }
                                        }}

                                        id={`otp-${index}`}
                                        style={{ border: '1px solid #dfdee5' }}

                                        className="
                        w-12
                        h-14
                        text-center
                        text-2xl
                        font-bold
                        rounded-xl
                        outline-none
                        focus:border-pink-500
                        focus:ring-2
                        focus:ring-pink-200
                    "
                                    />
                                ))}
                            </div>
                        </div>

                        {/* OTP TIMER */}

                        <div className="text-center">

                            {!canResendOtp ? (

                                <p className="text-sm text-gray-500">

                                    Resend OTP in

                                    <span className="font-bold text-pink-600 ml-1">

                                        {Math.floor(otpTimer / 60)}:
                                        {(otpTimer % 60)
                                            .toString()
                                            .padStart(2, '0')}

                                    </span>

                                </p>

                            ) : (

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-sm font-bold text-pink-600 hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        {/* VERIFY BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60"
                        >
                            {loading
                                ? 'Verifying...'
                                : 'Verify OTP'}
                        </button>

                    </form>
                </div>

            </div>
        )
    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
                        <User size={30} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">

                        {isLogin
                            ? 'Customer Login'
                            : 'Create Account'}
                    </h1>

                    <p className="text-sm text-gray-400 mt-2">

                        {isLogin
                            ? 'Login to continue booking services'
                            : 'Create your customer account'}
                    </p>
                </div>

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Full Name */}

                    {!isLogin && (

                        <div>

                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                Full Name
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <User
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                />

                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    style={{ border: '1px solid #dfdee5' }}
                                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-pink-500"
                                />
                            </div>

                            {errors.full_name && (
                                <p className="text-red-500 text-xs mt-1 font-medium">
                                    {errors.full_name}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Email */}

                    <div>

                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Email Address
                            <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">

                            <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                style={{ border: '1px solid #dfdee5' }}
                                className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-pink-500"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}

                    <div>

                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Password
                            <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">

                            <Lock
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{ border: '1px solid #dfdee5' }}
                                className="w-full  rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-pink-500"
                            />
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60"
                    >

                        {loading
                            ? 'Please wait...'
                            : isLogin
                                ? 'Login'
                                : 'Create Account'}
                    </button>

                </form>

                {/* Toggle */}

                <div className="text-center mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">

                    {isLogin
                        ? "Don't have an account?"
                        : 'Already have an account?'}

                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            resetForm()
                        }}
                        className="ml-2 text-pink-600 font-bold hover:underline"
                    >

                        {isLogin
                            ? 'Register'
                            : 'Login'}
                    </button>
                </div>

            </div>

        </div>
    )
}