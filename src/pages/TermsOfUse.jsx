import {
  FileCheck,
  ShieldCheck,
  BadgeCheck,
  AlertTriangle,
  Lock,
  Globe,
  Scale,
  ChevronRight,
  Mail,
  CheckCircle2
} from 'lucide-react'

import { Link } from 'react-router-dom'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Safe Platform',
    desc: 'We maintain a secure and trusted environment for businesses and customers.'
  },
  {
    icon: BadgeCheck,
    title: 'Verified Usage',
    desc: 'Users must provide accurate information and comply with platform guidelines.'
  },
  {
    icon: Lock,
    title: 'Account Security',
    desc: 'Users are responsible for maintaining the confidentiality of their accounts.'
  },
  {
    icon: Globe,
    title: 'Fair Usage',
    desc: 'Our platform must not be used for illegal, harmful, or misleading activities.'
  }
]

const terms = [
  {
    title: 'Acceptance Of Terms',
    content:
      'By accessing or using UniteOman services, you agree to comply with these Terms of Use and all applicable laws and regulations.'
  },
  {
    title: 'User Responsibilities',
    content:
      'Users are responsible for providing accurate information, maintaining account security, and using the platform ethically.'
  },
  {
    title: 'Business Listings',
    content:
      'Businesses must ensure that all listing details, contact information, pricing, and descriptions are accurate and up to date.'
  },
  {
    title: 'Prohibited Activities',
    content:
      'Users must not engage in fraudulent, abusive, harmful, illegal, misleading, or unauthorized activities while using the platform.'
  },
  {
    title: 'Intellectual Property',
    content:
      'All platform content, branding, logos, graphics, and system elements are protected by intellectual property laws.'
  },
  {
    title: 'Limitation Of Liability',
    content:
      'UniteOman is not responsible for disputes, damages, or losses arising from interactions between users and businesses.'
  },
  {
    title: 'Account Suspension',
    content:
      'We reserve the right to suspend or terminate accounts that violate our policies, terms, or platform standards.'
  },
  {
    title: 'Changes To Terms',
    content:
      'These Terms of Use may be updated periodically. Continued use of the platform indicates acceptance of any revised terms.'
  }
]

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[#07010F] overflow-hidden text-white">

      {/* HERO */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">

        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-pink-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Badge */}
          <div className="flex justify-center mb-6">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">

              <Scale className="w-3.5 h-3.5 text-pink-400" />

              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/70">
                Terms & Conditions
              </span>

            </div>

          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-[-0.04em] mb-5">

              Terms{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">
                Of Use
              </span>

            </h1>

            <p className="text-sm md:text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
              Please review these Terms of Use carefully before using UniteOman services,
              business listings, advertising tools, and platform features.
            </p>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">

            {[
              ['Secure', 'Platform'],
              ['Verified', 'Businesses'],
              ['Protected', 'Users'],
              ['Trusted', 'Services']
            ].map((item, i) => (

              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 text-center"
              >

                <div className="text-xl md:text-2xl font-black text-white mb-1">
                  {item[0]}
                </div>

                <div className="text-xs text-white/50 font-medium">
                  {item[1]}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* HIGHLIGHTS */}
      <section className="px-4 pb-20">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Platform Standards
            </h2>

            <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
              UniteOman is committed to maintaining a trusted and professional marketplace.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {highlights.map((item, i) => {

              const Icon = item.icon

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-pink-500/30 transition-all"
                >

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-5">

                    <Icon className="w-6 h-6 text-pink-400" />

                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-white/50 leading-relaxed text-sm">
                    {item.desc}
                  </p>

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* TERMS */}
      <section className="px-4 pb-20">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Terms & Policies
            </h2>

            <p className="text-white/50 text-sm md:text-base">
              Important rules, responsibilities, and legal information.
            </p>

          </div>

          <div className="space-y-5">

            {terms.map((term, i) => (

              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-pink-500/30 transition-all"
              >

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">

                    <FileCheck className="w-5 h-5 text-pink-400" />

                  </div>

                  <div>

                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      {term.title}
                    </h3>

                    <p className="text-white/50 leading-relaxed text-sm md:text-base">
                      {term.content}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WARNING */}
      <section className="px-4 pb-20">

        <div className="max-w-5xl mx-auto">

          <div className="rounded-[32px] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-2xl p-8 md:p-12">

            <div className="flex flex-col md:flex-row gap-8 items-start">

              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">

                <AlertTriangle className="w-8 h-8 text-orange-400" />

              </div>

              <div>

                <h2 className="text-3xl font-black mb-4">
                  Important Notice
                </h2>

                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
                  UniteOman acts as a marketplace platform connecting businesses and customers.
                  Users are responsible for verifying services, pricing, and agreements directly
                  with service providers before making transactions.
                </p>

                <div className="space-y-3">

                  {[
                    'Always verify business information before transactions',
                    'Report suspicious or misleading activity immediately',
                    'Respect platform rules and community guidelines'
                  ].map((item, i) => (

                    <div
                      key={i}
                      className="flex items-center gap-3"
                    >

                      <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />

                      <span className="text-white/70 text-sm">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section className="px-4 pb-20">

        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 backdrop-blur-2xl p-10 md:p-14 text-center">

          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_40%)]" />

          <div className="relative z-10">

            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-5">
              Need Clarification?
            </h2>

            <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto mb-8">
              If you have questions regarding these Terms of Use,
              feel free to contact our support team.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/contact"
                className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-sm md:text-base shadow-[0_10px_40px_rgba(232,49,122,0.4)] hover:scale-105 transition-all"
              >

                Contact Support

                <ChevronRight className="w-4 h-4" />

              </Link>

              <a
                href="mailto:support@uniteoman.com"
                className="flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/10 bg-white/5 font-semibold text-sm md:text-base hover:bg-white/10 transition-all"
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