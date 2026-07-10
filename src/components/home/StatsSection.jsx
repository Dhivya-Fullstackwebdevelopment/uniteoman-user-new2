import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      value: "10K+",
      title: "Bookings Completed",
      subtitle: "Across Oman monthly",
      top: "from-[#D61CA8] to-[#8B2EF5]",
      text: "from-[#D61CA8] to-[#8B2EF5]",
    },
    {
      value: "900+",
      title: "Verified Professionals",
      subtitle: "Background-checked & insured",
      top: "from-[#8B2EF5] to-[#4B6EF5]",
      text: "from-[#8B2EF5] to-[#4B6EF5]",
    },
    {
      value: "4.8★",
      title: "Average Rating",
      subtitle: "From 8,000+ reviews",
      top: "from-[#4B6EF5] to-[#06B6D4]",
      text: "from-[#4B6EF5] to-[#06B6D4]",
    },
    {
      value: "11",
      title: "Governorates",
      subtitle: "Nationwide coverage",
      top: "from-[#D61CA8] to-[#4B6EF5]",
      text: "from-[#D61CA8] to-[#4B6EF5]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-[linear-gradient(145deg,#0A0A0F_0%,#1a0830_40%,#0a1240_100%)]"
    >
      <style>{`
        @keyframes statsRevealUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes statsHeaderFade {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes statsNumberPop {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .stats-header { opacity: 0; }
        .stats-header.stats-visible {
          animation: statsHeaderFade 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .stats-card { opacity: 0; }
        .stats-card.stats-visible {
          animation: statsRevealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .stats-card.stats-visible .stats-number {
          animation: statsNumberPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        .stats-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stats-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0,0,0,.35);
        }
      `}</style>

      {/* Background Blur */}
      <div className="absolute -top-36 -right-36 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(214,28,168,.15),transparent_70%)]" />
      <div className="absolute -bottom-36 -left-24 w-[260px] h-[260px] sm:w-[450px] sm:h-[450px] rounded-full bg-[radial-gradient(circle,rgba(75,110,245,.12),transparent_70%)]" />

      <div className="relative max-w-[1300px] mx-auto px-5 lg:px-14">
        {/* Heading */}
        <div className={`stats-header text-center mb-12 sm:mb-16 ${inView ? "stats-visible" : ""}`}>
          <img
            src="/image 672.png"
            alt="UniteOman"
            className="h-8 sm:h-11 w-auto mx-auto mb-4 sm:mb-5 opacity-95"
          />

          <h2
            style={{
              font: '600 clamp(26px, 6vw, 52px)/1.15 "DM Sans", sans-serif',
              letterSpacing: "-1.5px",
            }}
            className="text-white"
          >
            Muscat's Most Trusted
            <br />
            Home Services Platform
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`stats-card relative overflow-hidden rounded-[18px] sm:rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-8 text-center ${inView ? "stats-visible" : ""}`}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Top Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.top}`} />

              {/* Number */}
              <div
                className={`stats-number mb-2 sm:mb-3 text-[28px] sm:text-[52px] font-extrabold leading-none bg-gradient-to-r ${item.text} bg-clip-text text-transparent`}
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                {item.value}
              </div>

              {/* Title */}
              <h3
                style={{ font: '700 clamp(13px, 2vw, 17px)/1.2 "DM Sans", sans-serif' }}
                className="text-white mb-1 sm:mb-2"
              >
                {item.title}
              </h3>

              {/* Subtitle */}
              <p
                style={{ font: '400 clamp(11px, 1.5vw, 13px)/1.4 "DM Sans", sans-serif' }}
                className="text-white/50"
              >
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}