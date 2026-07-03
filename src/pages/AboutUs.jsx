import {
  Building2,
  Users,
  Target,
  Eye,
  Globe,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Mail
} from "lucide-react";

import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Growing Community",
    desc: "Connecting businesses, professionals, and customers through a powerful digital platform."
  },
  {
    icon: Globe,
    title: "Wide Reach",
    desc: "Helping organizations expand visibility and connect with their target audience."
  },
  {
    icon: BadgeCheck,
    title: "Trusted Platform",
    desc: "Built with transparency, reliability, and long-term business growth in mind."
  },
  {
    icon: Sparkles,
    title: "Innovation Driven",
    desc: "Continuously improving our services with modern technology and user-focused solutions."
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#07010F] text-white overflow-hidden">

      {/* HERO */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">

        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
              <Building2 className="w-4 h-4 text-pink-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/70">
                About Our Company
              </span>
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto">

            <h1 className="text-3xl md:text-5xl font-bold mb-8">
              About{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">
                UniteOman
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-3xl mx-auto">
              UniteOman is a business discovery and networking platform
              designed to connect businesses, professionals, service providers,
              and customers across Oman through innovative digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">

            {[
              ["10K+", "Businesses"],
              ["500K+", "Monthly Reach"],
              ["50K+", "Leads Generated"],
              ["24/7", "Platform Access"]
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 text-center"
              >
                <div className="text-3xl font-bold mb-2">{item[0]}</div>
                <div className="text-sm text-white/50">{item[1]}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us
            </h2>

            <p className="text-white/50 text-lg">
              Empowering business growth through technology and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-pink-500/30 transition-all"
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
              );
            })}
          </div>

        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="px-6 pb-24">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-pink-400" />
            </div>

            <h3 className="text-3xl font-bold mb-4">
              Our Mission
            </h3>

            <p className="text-white/50 leading-8">
              To create a trusted digital ecosystem that connects businesses,
              professionals, and customers while enabling growth, visibility,
              and meaningful opportunities.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-pink-400" />
            </div>

            <h3 className="text-3xl font-bold mb-4">
              Our Vision
            </h3>

            <p className="text-white/50 leading-8">
              To become the leading business networking and discovery platform
              in Oman by empowering organizations through innovation,
              technology, and collaboration.
            </p>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">

        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5 backdrop-blur-xl p-10 md:p-14 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Let's Build The Future Together
          </h2>

          <p className="text-white/50 text-lg leading-8 max-w-2xl mx-auto mb-8">
            Join thousands of businesses and professionals already growing
            with UniteOman. Discover new opportunities and expand your reach.
          </p>

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              to="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold hover:scale-105 transition-all"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="mailto:support@uniteoman.com"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
            >
              <Mail className="w-4 h-4" />
              support@uniteoman.com
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}