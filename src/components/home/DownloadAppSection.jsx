import { useState, useEffect } from "react";
import { Apple, Play } from "lucide-react";

export default function DownloadAppSection() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-[#D61CA8] via-[#8B2EF5] to-[#4B6EF5]"
      style={{ padding: isMobile ? "56px 0" : "96px 0" }}
    >
      <style>{`
        @keyframes downloadFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--rot, 0deg)); }
        }
        @keyframes downloadReveal {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dl-rv {
          opacity: 0;
          animation: downloadReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .dl-rv.d2 { animation-delay: .1s; }
        .dl-rv.d3 { animation-delay: .2s; }
        .dl-rv.d4 { animation-delay: .3s; }
        .dl-phone-left { animation: downloadFloat 6.5s ease-in-out infinite; --rot: -6deg; }
        .dl-phone-main { animation: downloadFloat 7.5s ease-in-out infinite; animation-delay: .4s; --rot: 0deg; }
        .dl-store-btn { transition: transform .2s ease, box-shadow .2s ease; }
        .dl-store-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 14px 28px rgba(0,0,0,.2); }
        .dl-store-btn:active { transform: translateY(0) scale(.98); }
      `}</style>

      {/* Background Decorations */}
      <div
        className="absolute rounded-full bg-white/10"
        style={{
          top: isMobile ? "-90px" : "-112px",
          right: isMobile ? "-90px" : "-112px",
          width: isMobile ? "220px" : "400px",
          height: isMobile ? "220px" : "400px",
        }}
      />
      <div
        className="absolute rounded-full bg-black/10"
        style={{
          bottom: isMobile ? "-80px" : "-80px",
          left: isMobile ? "-60px" : "180px",
          width: isMobile ? "180px" : "300px",
          height: isMobile ? "180px" : "300px",
        }}
      />

      <div
        className="relative max-w-[1300px] mx-auto flex items-center"
        style={{
          padding: isMobile ? "0 20px" : "0 56px",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "48px" : "80px",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {/* Left Content */}
        <div className="dl-rv flex-[1.2]" style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start" }}>

          <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/30 bg-white/15 mb-6">
            <span
              style={{ font: '600 13px/1 "DM Sans", sans-serif' }}
              className="text-white"
            >
              Download the App
            </span>
          </div>

          <h2
            style={{
              font: isMobile
                ? '600 34px/1.15 "DM Sans", sans-serif'
                : '600 52px/1.1 "DM Sans", sans-serif',
              letterSpacing: "-2px",
            }}
            className="text-white mb-4"
          >
            Book on the go.
            <br />
            Track in real-time.
          </h2>

          <p
            style={{
              font: isMobile
                ? '400 15px/1.6 "DM Sans", sans-serif'
                : '400 18px/1.6 "DM Sans", sans-serif',
            }}
            className="text-white/80 max-w-[460px] mb-10"
          >
            Get the UniteOman app and book any home service in under 60
            seconds. Available on iOS & Android.
          </p>

          {/* Store Buttons */}
          <div
            className="flex flex-wrap gap-4"
            style={{ justifyContent: isMobile ? "center" : "flex-start" }}
          >
            {/* App Store */}
            <button className="dl-store-btn flex items-center gap-2 bg-white rounded-xl px-5 py-2 shadow-lg">
              <Apple size={22} className="text-[#0A0A0F]" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-gray-500 font-medium">
                  Download on the
                </div>
                <div className="text-[14px] font-extrabold text-[#0A0A0F]">
                  App Store
                </div>
              </div>
            </button>

            {/* Google Play */}
            <button className="dl-store-btn flex items-center gap-2 bg-white rounded-xl px-5 py-2 shadow-lg">
              <Play size={22} fill="#34A853" color="#34A853" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-gray-500 font-medium">
                  Get it on
                </div>
                <div className="text-[14px] font-extrabold text-[#0A0A0F]">
                  Google Play
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Phone Mockups */}
        <div
          className="dl-rv d2 flex-1 flex justify-center items-end"
          style={{ gap: isMobile ? "14px" : "20px" }}
        >
          {/* Left Phone */}
          {!isMobile && (
            <div className="dl-phone-left w-[160px] h-[280px] rounded-[28px] border-2 border-white/30 bg-white/10 p-5 flex flex-col items-center gap-3 translate-y-5">
              <div className="w-16 h-[5px] rounded-full bg-white/30" />
              <div className="flex-1 w-full rounded-2xl bg-white/10 flex items-center justify-center">
                <img
                  src="/image 672.png"
                  alt="UniteOman"
                  className="w-[100px] opacity-70"
                />
              </div>
            </div>
          )}

          {/* Main Phone */}
          <div
            className="dl-phone-main rounded-[32px] border-2 border-white/40 bg-white/20 shadow-[0_20px_60px_rgba(0,0,0,.3)] flex flex-col items-center gap-3"
            style={{
              width: isMobile ? "220px" : "180px",
              height: isMobile ? "380px" : "320px",
              padding: isMobile ? "24px" : "24px",
            }}
          >
            <div className="w-16 h-[5px] rounded-full bg-white/40" />
            <div className="flex-1 w-full rounded-[18px] bg-white/10 flex flex-col items-center justify-center gap-2 p-4">
              <span style={{ fontSize: isMobile ? "40px" : "34px" }}>❄️</span>
              <div className="text-white font-bold text-[13px] text-center">
                AC Deep Cleaning
              </div>
              <div className="text-white/70 text-[11px]">OMR 15 · ⭐ 4.9</div>
              <button className="mt-2 px-4 py-2 rounded-lg bg-white text-[#D61CA8] text-[12px] font-bold">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}