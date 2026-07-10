import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Clock3,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrustBanner() {
  const navigate = useNavigate();
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = [
    { icon: ShieldCheck, text: "Background Verified Pros" },
    { icon: Lock, text: "Fully Insured" },
    { icon: Clock3, text: "On-Time Guarantee" },
    { icon: CreditCard, text: "Secure Payments" },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-r from-[#D61CA8] via-[#8B2EF5] to-[#4B6EF5] py-[16px] sm:py-[18px] overflow-hidden"
    >
      <style>{`
        @keyframes tbRevealUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tbIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .tb-item {
          opacity: 0;
        }
        .tb-item.tb-visible {
          animation: tbRevealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .tb-item:hover .tb-icon {
          animation: tbIconPulse 0.5s ease;
        }
      `}</style>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-6">
          {/* Left Side */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-3">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`tb-item flex items-center ${inView ? "tb-visible" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
                    <Icon
                      size={16}
                      className="tb-icon text-white flex-shrink-0 sm:!w-[18px] sm:!h-[18px]"
                      strokeWidth={2.2}
                    />
                    <span
                      style={{ font: '600 12px/1 "DM Sans", sans-serif' }}
                      className="text-white whitespace-nowrap sm:text-[14px]"
                    >
                      {item.text}
                    </span>
                  </div>

                  {index !== items.length - 1 && (
                    <div className="hidden lg:block w-px h-5 bg-white/30" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side */}
          <button
            onClick={() => navigate("/vendor/login")}
            className={`tb-item flex items-center gap-2 bg-white text-[#D61CA8] rounded-xl px-5 sm:px-7 py-2.5 sm:py-3 font-bold text-[13px] sm:text-[15px] hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap ${inView ? "tb-visible" : ""}`}
            style={{ animationDelay: `${items.length * 0.1}s` }}
          >
            Register as Pro
            <ArrowRight size={16} className="sm:!w-[18px] sm:!h-[18px]" />
          </button>
        </div>
      </div>
    </section>
  );
}