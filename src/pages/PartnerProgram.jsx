import {
  Handshake,
  Users,
  TrendingUp,
  BadgeCheck,
  Globe,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Wallet,
  Megaphone
} from 'lucide-react'

import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: TrendingUp,
    title: 'Grow Your Income',
    desc: 'Earn recurring commissions by referring businesses to UniteOman.'
  },

  {
    icon: Users,
    title: 'Expand Your Network',
    desc: 'Connect with businesses, agencies, freelancers, and service providers across Oman.'
  },

  {
    icon: BadgeCheck,
    title: 'Trusted Partnership',
    desc: 'Work with a growing platform trusted by businesses and customers.'
  },

  {
    icon: Globe,
    title: 'Oman Wide Reach',
    desc: 'Promote services across Muscat, Salalah, Sohar, Nizwa, and more.'
  }
]

const steps = [
  {
    no: '01',
    title: 'Join The Program',
    desc: 'Register as a UniteOman partner in just a few minutes.'
  },

  {
    no: '02',
    title: 'Refer Businesses',
    desc: 'Invite businesses and professionals to join UniteOman.'
  },

  {
    no: '03',
    title: 'Earn Rewards',
    desc: 'Receive commissions and exclusive benefits for successful referrals.'
  }
]

export default function PartnerProgram() {
  return (
    <div className="min-h-screen bg-[#07010F] overflow-hidden text-white">

      {/* HERO */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0">

          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-500/10 blur-[90px] rounded-full" />

          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 blur-[90px] rounded-full" />

        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Badge */}
          <div className="flex justify-center mb-6">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">

              <Handshake className="w-4 h-4 text-pink-400" />

              <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/70">
                UniteOman Partner Program
              </span>

            </div>

          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">

              Partner With{" "}

              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">
                UniteOman
              </span>

            </h1>

            <p className="text-base md:text-lg text-white/50 leading-8 max-w-3xl mx-auto">
              Help businesses grow, connect professionals across Oman,
              and earn rewards by becoming an official UniteOman partner.
            </p>

          </div>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-base hover:scale-105 transition-all shadow-[0_10px_30px_rgba(232,49,122,0.18)]"
            >
              Become A Partner
            </Link>

            <Link
              to="/AdvertisingPricing"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md font-semibold text-base hover:bg-white/[0.06] transition-all"
            >
              View Advertising Plans
            </Link>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-20">

            {[
              ['10K+', 'Businesses'],
              ['500K+', 'Monthly Reach'],
              ['50K+', 'Customer Leads'],
              ['24/7', 'Business Visibility']
            ].map((item, i) => (

              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 text-center"
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

      {/* BENEFITS */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join Our Partner Program?
            </h2>

            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
              Unlock business opportunities, recurring income, and networking benefits.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {benefits.map((item, i) => {

              const Icon = item.icon

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-md hover:border-pink-500/20 transition-all"
                >

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-5">

                    <Icon className="w-6 h-6 text-pink-400" />

                  </div>

                  <h3 className="text-lg font-bold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-white/50 leading-7 text-sm">
                    {item.desc}
                  </p>

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>

            <p className="text-white/50 text-base md:text-lg">
              Start earning in three simple steps.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {steps.map((step, i) => (

              <div
                key={i}
                className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 overflow-hidden"
              >

                <div className="absolute top-5 right-5 text-5xl font-bold text-white/[0.03]">
                  {step.no}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-6">

                  <Sparkles className="w-6 h-6 text-pink-400" />

                </div>

                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>

                <p className="text-white/50 leading-7 text-sm">
                  {step.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PARTNER TYPES */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/[0.04] via-purple-500/[0.04] to-orange-500/[0.04] backdrop-blur-md p-10 md:p-14">

            <div className="text-center mb-14">

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Who Can Become A Partner?
              </h2>

              <p className="text-white/50 text-base md:text-lg">
                Perfect for agencies, freelancers, marketers, and consultants.
              </p>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              {[
                ['Marketing Agencies', Megaphone],
                ['Business Consultants', ShieldCheck],
                ['Freelancers', Wallet],
                ['Digital Promoters', TrendingUp]
              ].map(([title, Icon], i) => (

                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center"
                >

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">

                    <Icon className="w-6 h-6 text-pink-400" />

                  </div>

                  <h3 className="text-base font-bold">
                    {title}
                  </h3>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-20">

        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/[0.04] via-purple-500/[0.04] to-orange-500/[0.04] backdrop-blur-md p-10 md:p-14 text-center">

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_40%)]" />

          <div className="relative z-10">

            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">
              Ready To Partner With UniteOman?
            </h2>

            <p className="text-white/50 text-base md:text-lg leading-8 max-w-2xl mx-auto mb-8">
              Join our growing network of partners and help businesses
              succeed across Oman with UniteOman.
            </p>

            <div className="flex justify-center">

              <Link
                to="/contact"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-base shadow-[0_10px_30px_rgba(232,49,122,0.18)] hover:scale-105 transition-all"
              >

                Become A Partner

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}