import {
    ShieldCheck,
    Lock,
    Database,
    Eye,
    Globe,
    BadgeCheck,
    ChevronRight,
    Mail,
    FileText
} from 'lucide-react'

import { Link } from 'react-router-dom'

const sections = [
    {
        icon: ShieldCheck,
        title: 'Information Protection',
        desc: 'We use industry-standard security measures to protect your personal information and business data.'
    },

    {
        icon: Lock,
        title: 'Secure Transactions',
        desc: 'All communication and transactions are encrypted and securely processed.'
    },

    {
        icon: Database,
        title: 'Data Collection',
        desc: 'We only collect necessary information required to improve our services and user experience.'
    },

    {
        icon: Eye,
        title: 'Privacy Transparency',
        desc: 'We never sell your personal information to third parties without your consent.'
    }
]

const policies = [
    {
        title: 'Information We Collect',
        content:
            'We may collect personal details such as name, email address, phone number, business information, profile details, and usage analytics when using UniteOman services.'
    },

    {
        title: 'How We Use Information',
        content:
            'Your information is used to provide services, improve platform performance, process enquiries, enhance business visibility, and communicate important updates.'
    },

    {
        title: 'Data Security',
        content:
            'We implement technical and organizational security measures to protect user information from unauthorized access, misuse, or disclosure.'
    },

    {
        title: 'Third-Party Services',
        content:
            'Certain services such as analytics, payment gateways, or communication tools may involve trusted third-party providers.'
    },

    {
        title: 'Cookies & Analytics',
        content:
            'We use cookies and analytics technologies to improve functionality, monitor platform performance, and personalize user experience.'
    },

    {
        title: 'User Rights',
        content:
            'Users may request updates, corrections, or deletion of their personal information subject to applicable legal requirements.'
    }
]

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#07010F] overflow-hidden text-white">

            {/* HERO */}
            <section className="relative pt-28 pb-24 px-6 overflow-hidden">

                {/* Background Glow */}
                <div className="absolute inset-0">

                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[100px] rounded-full" />

                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />

                </div>

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Badge */}
                    <div className="flex justify-center mb-8">

                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">

                            <ShieldCheck className="w-4 h-4 text-pink-400" />

                            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/70">
                                Privacy & Data Protection
                            </span>

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center max-w-5xl mx-auto">

                        <h1 className="text-3xl md:text-4xl font-bold leading-[1.0] tracking-[-0.05em] mb-8">

                            Privacy {" "}

                            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">
                                Policy
                            </span>

                        </h1>

                        <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-3xl mx-auto">
                            Your privacy matters to us. Learn how UniteOman collects,
                            uses, protects, and manages your information across our platform.
                        </p>

                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">

                        {[
                            ['100%', 'Secure Platform'],
                            ['24/7', 'Monitoring'],
                            ['Encrypted', 'User Data'],
                            ['Trusted', 'Protection']
                        ].map((item, i) => (

                            <div
                                key={i}
                                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 text-center"
                            >

                                <div className="text-3xl font-bold text-white mb-2">
                                    {item[0]}
                                </div>

                                <div className="text-sm text-white/50 font-medium">
                                    {item[1]}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* FEATURE SECTION */}
            <section className="px-6 pb-28">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-20">

                        <h2 className="text-3xl md:text-4xl font-bold mb-5">
                            Your Data Is Protected
                        </h2>

                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            We are committed to maintaining transparency, trust, and secure data practices.
                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {sections.map((item, i) => {

                            const Icon = item.icon

                            return (
                                <div
                                    key={i}
                                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-pink-500/30 transition-all hover:-translate-y-2"
                                >

                                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6">

                                        <Icon className="w-8 h-8 text-pink-400" />

                                    </div>

                                    <h3 className="text-xl font-bold mb-3">
                                        {item.title}
                                    </h3>

                                    <p className="text-white/50 leading-relaxed">
                                        {item.desc}
                                    </p>

                                </div>
                            )
                        })}

                    </div>

                </div>

            </section>

            {/* POLICY CONTENT */}
            <section className="px-6 pb-28">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-20">

                        <h2 className="text-3xl md:text-4xl font-bold mb-5">
                            Privacy Information
                        </h2>

                        <p className="text-white/50 text-lg">
                            Important information regarding data usage and protection.
                        </p>

                    </div>

                    <div className="space-y-6">

                        {policies.map((policy, i) => (

                            <div
                                key={i}
                                className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 hover:border-pink-500/30 transition-all"
                            >

                                <div className="flex items-start gap-5">

                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">

                                        <FileText className="w-7 h-7 text-pink-400" />

                                    </div>

                                    <div>

                                        <h3 className="text-2xl font-bold mb-4">
                                            {policy.title}
                                        </h3>

                                        <p className="text-white/50 leading-relaxed text-lg">
                                            {policy.content}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* CONTACT SECTION */}
            <section className="px-6 pb-24">
                <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5 backdrop-blur-xl p-10 md:p-14 text-center">
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_40%)]" />

                    <div className="relative z-10">

                        {/* Heading */}
                        <h4 className="text-2xl md:text-4xl font-bold leading-tight mb-5">
                            Need More Information?
                        </h4>

                        {/* Description */}
                        <p className="text-white/50 text-base md:text-lg leading-8 max-w-2xl mx-auto mb-8">
                            If you have any questions regarding this Privacy Policy,
                            your personal information, or data protection practices,
                            feel free to contact our support team anytime.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {/* Contact Button */}
                            <Link
                                to="/contact"
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-base shadow-[0_10px_40px_rgba(232,49,122,0.25)] hover:scale-105 transition-all"
                            >
                                Contact Support
                                <ChevronRight className="w-4 h-4" />

                            </Link>

                            {/* Email Button */}
                            <a
                                href="mailto:support@uniteoman.com"
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] font-semibold text-base hover:bg-white/[0.08] transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                support@uniteoman.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}