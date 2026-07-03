import {
  Check,
  Crown,
  Sparkles,
  TrendingUp,
  Megaphone,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Users,
  Globe
} from 'lucide-react'

import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Perfect for small businesses starting online.',
    features: [
      'Business Listing',
      'WhatsApp Contact',
      'Basic Visibility',
      '1 Photo Upload'
    ],
    btn: 'Start Free',
    glow: 'from-orange-500/10 to-pink-500/5'
  },

  {
    name: 'Growth',
    price: 'OMR 25',
    desc: 'Ideal for businesses looking for more visibility.',
    popular: true,
    features: [
      'Featured Listing',
      'Top Search Ranking',
      'Unlimited Photos',
      'Verified Badge',
      'Priority Leads',
      'Customer Reviews'
    ],
    btn: 'Upgrade Now',
    glow: 'from-pink-500/10 to-purple-500/5'
  },

  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Advanced advertising solutions for large brands.',
    features: [
      'Homepage Promotion',
      'Dedicated Support',
      'Custom Campaigns',
      'Advanced Analytics'
    ],
    btn: 'Contact Sales',
    glow: 'from-purple-500/10 to-indigo-500/5'
  }
]

export default function AdvertisingPricing() {
  return (
    <div className="min-h-screen bg-[#07010F] overflow-hidden text-white">

      {/* HERO */}
      <section className="relative pt-24 pb-20 px-6">

        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute top-[-20%] left-[-10%] w-[380px] h-[380px] bg-pink-500/10 blur-[90px] rounded-full" />

          <div className="absolute bottom-[-20%] right-[-10%] w-[380px] h-[380px] bg-purple-500/10 blur-[90px] rounded-full" />

        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Badge */}
          <div className="flex justify-center mb-6">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">

              <Megaphone className="w-4 h-4 text-pink-400" />

              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/70">
                Advertising Solutions
              </span>

            </div>

          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">

              Promote Your{" "}

              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">
                Business Across Oman
              </span>

            </h1>

            <p className="text-base md:text-lg text-white/50 leading-8 max-w-3xl mx-auto">
              Reach more customers, improve visibility,
              and grow your business with UniteOman advertising solutions.
            </p>

          </div>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <Link
              to="/vendor/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-base hover:scale-105 transition-all shadow-[0_10px_30px_rgba(232,49,122,0.18)]"
            >
              Start Advertising
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md font-semibold text-base hover:bg-white/[0.06] transition-all"
            >
              Contact Sales
            </Link>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">

            {[
              ['10K+', 'Businesses'],
              ['500K+', 'Monthly Visitors'],
              ['50K+', 'Leads Generated'],
              ['24/7', 'Customer Reach']
            ].map((item, i) => (

              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 text-center"
              >

                <div className="text-3xl font-bold text-white mb-2">
                  {item[0]}
                </div>

                <div className="text-sm text-white/50">
                  {item[1]}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Flexible Pricing Plans
            </h2>

            <p className="text-white/50 text-base md:text-lg">
              Choose the best advertising package for your business.
            </p>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

            {plans.map((plan, i) => (

              <div
                key={i}
                className={`relative rounded-3xl overflow-hidden border backdrop-blur-md transition-all ${
                  plan.popular
                    ? 'border-pink-500/20 bg-white/[0.03]'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >

                {/* Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.glow} opacity-40`}
                />

                {/* Popular */}
                {plan.popular && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-[10px] uppercase tracking-wider font-semibold">
                    Popular
                  </div>
                )}

                <div className="relative z-10 p-8">

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6">

                    {plan.popular ? (
                      <Sparkles className="w-6 h-6 text-pink-400" />
                    ) : plan.name === 'Enterprise' ? (
                      <Crown className="w-6 h-6 text-purple-400" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                    )}

                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3">
                    {plan.name}
                  </h3>

                  <p className="text-white/50 leading-7 text-sm mb-6">
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="mb-8">

                    <div className="flex items-end gap-2">

                      <span className="text-4xl font-bold">
                        {plan.price}
                      </span>

                      {plan.price !== 'Custom' && (
                        <span className="text-white/40 text-sm mb-1">
                          /month
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">

                    {plan.features.map((feature, idx) => (

                      <div
                        key={idx}
                        className="flex items-start gap-3"
                      >

                        <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">

                          <Check
                            className="w-3 h-3 text-pink-400"
                            strokeWidth={3}
                          />

                        </div>

                        <span className="text-white/70 text-sm">
                          {feature}
                        </span>

                      </div>

                    ))}

                  </div>

                  {/* Button */}
                  <Link
                    to="/vendor/login"
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_10px_30px_rgba(232,49,122,0.2)]'
                        : 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >

                    {plan.btn}

                    <ArrowRight className="w-4 h-4" />

                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WHY SECTION */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Advertise With Us?
            </h2>

            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
              UniteOman helps businesses connect directly with customers across Oman.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              {
                icon: Users,
                title: 'More Customers',
                desc: 'Reach thousands of customers searching daily.'
              },

              {
                icon: Globe,
                title: 'Oman Wide Reach',
                desc: 'Expand visibility across Oman.'
              },

              {
                icon: BarChart3,
                title: 'Better Analytics',
                desc: 'Track leads and profile performance.'
              },

              {
                icon: ShieldCheck,
                title: 'Trusted Branding',
                desc: 'Build trust with verified profiles.'
              }
            ].map((item, i) => {

              const Icon = item.icon

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-md"
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

      {/* FINAL CTA */}
      <section className="px-6 pb-20">

        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/[0.04] via-purple-500/[0.04] to-orange-500/[0.04] backdrop-blur-md p-10 md:p-14 text-center">

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_40%)]" />

          <div className="relative z-10">

            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">
              Ready To Grow Your Business?
            </h2>

            <p className="text-white/50 text-base md:text-lg leading-8 max-w-2xl mx-auto mb-8">
              Start promoting your business today and connect
              with more customers across Oman.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/vendor/login"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-base shadow-[0_10px_30px_rgba(232,49,122,0.18)] hover:scale-105 transition-all"
              >
                Start Advertising
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] font-semibold text-base hover:bg-white/[0.06] transition-all"
              >
                Talk To Sales
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}