import { useEffect, useRef, useState } from "react";
import { UserRound, CalendarDays, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
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

  const steps = [
    {
      title: "Choose a Service",
      description:
        "Browse 20+ categories, read reviews and pick your preferred professional in Muscat.",
      icon: UserRound,
      gradient: "from-[#D61CA8] to-[#8B2EF5]",
      shadow: "shadow-[0_12px_32px_rgba(214,28,168,.35)]",
    },
    {
      title: "Schedule & Pay",
      description:
        "Pick a date, time and address. Pay securely online. No phone calls, no hassle.",
      icon: CalendarDays,
      gradient: "from-[#8B2EF5] to-[#4B6EF5]",
      shadow: "shadow-[0_12px_32px_rgba(139,46,245,.35)]",
    },
    {
      title: "Pro Arrives On Time",
      description:
        "Track your professional live on the map. Rate and review after the job is done.",
      icon: ShieldCheck,
      gradient: "from-[#4B6EF5] to-[#06B6D4]",
      shadow: "shadow-[0_12px_32px_rgba(75,110,245,.35)]",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      <style>{`
        @keyframes hiwRevealUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hiwIconPop {
          0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.08) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes hiwLineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hiw-step {
          opacity: 0;
        }
        .hiw-step.hiw-visible {
          animation: hiwRevealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hiw-step.hiw-visible .hiw-icon-box {
          animation: hiwIconPop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.15s;
        }
        .hiw-step:hover .hiw-icon-box {
          transform: translateY(-4px) scale(1.05);
        }
        .hiw-icon-box {
          opacity: 0;
          transition: transform 0.3s ease;
        }
        .hiw-line.hiw-visible {
          animation: hiwLineGrow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: left;
        }
      `}</style>

      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
            <span
              style={{ font: '700 10px/1 "DM Sans", sans-serif', letterSpacing: "2.5px" }}
              className="uppercase text-white"
            >
              Simple Process
            </span>
          </div>

          <h2
            style={{
              font: '600 clamp(28px, 6vw, 52px)/1.15 "DM Sans", sans-serif',
              letterSpacing: "-1.5px",
            }}
            className="text-[#0A0A0F]"
          >
            Book in 3 easy steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {/* Background Line */}
          <div
            className={`hidden md:block absolute left-[16%] right-[16%] top-[40px] h-[3px] rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 z-0 hiw-line ${inView ? "hiw-visible" : ""}`}
          />
          {/* Glow */}
          <div
            className={`hidden md:block absolute left-[16%] right-[16%] top-[38px] h-[8px] rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 blur-lg opacity-40 z-0 hiw-line ${inView ? "hiw-visible" : ""}`}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className={`hiw-step px-6 sm:px-8 lg:px-11 text-center ${inView ? "hiw-visible" : ""}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div
                  className={`hiw-icon-box relative z-20 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-7 rounded-3xl bg-gradient-to-r ${step.gradient} ${step.shadow} flex items-center justify-center`}
                >
                  <Icon size={30} strokeWidth={2.2} className="text-white sm:!w-[38px] sm:!h-[38px]" />
                </div>

                <h3
                  style={{ font: '600 clamp(18px, 3vw, 24px)/1.2 "DM Sans", sans-serif' }}
                  className="text-[#0A0A0F] mb-2 sm:mb-3"
                >
                  {step.title}
                </h3>

                <p
                  style={{ font: '400 clamp(13px, 2vw, 16px)/1.65 "DM Sans", sans-serif' }}
                  className="text-[#6B7280]"
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}