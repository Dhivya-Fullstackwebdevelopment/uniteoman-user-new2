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

  const items = [
    {
      icon: ShieldCheck,
      text: "Background Verified Pros",
    },
    {
      icon: Lock,
      text: "Fully Insured",
    },
    {
      icon: Clock3,
      text: "On-Time Guarantee",
    },
    {
      icon: CreditCard,
      text: "Secure Payments",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-[#D61CA8] via-[#8B2EF5] to-[#4B6EF5] py-[18px]">
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Left Side */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start">

            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center"
                >
                  <div className="flex items-center gap-3 px-6">
                    <Icon
                      size={18}
                      className="text-white flex-shrink-0"
                      strokeWidth={2.2}
                    />

                    <span
                      style={{
                        font: '600 14px/1 "DM Sans", sans-serif',
                      }}
                      className="text-white whitespace-nowrap"
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
            className="flex items-center gap-2 bg-white text-[#D61CA8] rounded-xl px-7 py-3 font-bold text-[15px] hover:scale-105 transition-all shadow-lg whitespace-nowrap"
          >
            Register as Pro
            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </section>
  );
}