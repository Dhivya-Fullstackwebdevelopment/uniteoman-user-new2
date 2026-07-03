import { useEffect, useState } from 'react'
import { User, Mail, Calendar } from 'lucide-react'
import { customerAuthApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {

    const [profile, setProfile] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        fetchProfile()

    }, [])

    const fetchProfile = async () => {

        try {

            const data =
                await customerAuthApi.me()

            setProfile(data)

        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                'Failed to load profile'
            )

        } finally {

            setLoading(false)
        }
    }

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        )
    }

    return (

        // <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="min-h-screen bg-gray-50 px-4 flex items-center justify-center py-10">

            <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Top */}

                <div className="bg-pink-600 px-8 py-10 text-white">

                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-5">

                        <User size={42} />
                    </div>

                    <h1 className="text-3xl font-bold">
                        {profile?.full_name}
                    </h1>

                    <p className="text-pink-100 mt-2">
                        Customer Profile
                    </p>
                </div>

                {/* Details */}

                <div className="p-8 space-y-6">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Mail
                                size={20}
                                className="text-pink-600"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-400">
                                Email Address
                            </p>

                            <p className="font-bold text-gray-800">
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Calendar
                                size={20}
                                className="text-pink-600"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-400">
                                Joined Date
                            </p>

                            <p className="font-bold text-gray-800">
                                {new Date(
                                    profile?.created_at
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className={`
                            px-4 py-2 rounded-full text-sm font-bold
                            ${profile?.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                        `}>
                            {profile?.is_active
                                ? 'Active'
                                : 'Inactive'}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}