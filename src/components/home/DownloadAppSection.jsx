import { Apple, Play } from "lucide-react";

export default function DownloadAppSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-gradient-to-r from-[#D61CA8] via-[#8B2EF5] to-[#4B6EF5]">

            {/* Background Decorations */}
            <div className="absolute -top-28 -right-28 w-[400px] h-[400px] rounded-full bg-white/10" />
            <div className="absolute -bottom-20 left-[180px] w-[300px] h-[300px] rounded-full bg-black/10 " />

            <div className="relative max-w-[1300px] mx-auto px-5 lg:px-14 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

                {/* Left Content */}
                <div className="flex-[1.2]">

                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/30 bg-white/15 mb-6">
                        <span
                            style={{
                                font: '600 13px/1 "DM Sans", sans-serif',
                            }}
                            className="text-white"
                        >
                            Download the App
                        </span>
                    </div>

                    <h2
                        style={{
                            font: '600 52px/1.1 "DM Sans", sans-serif',
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
                            font: '400 18px/1.6 "DM Sans", sans-serif',
                        }}
                        className="text-white/80 max-w-[460px] mb-10"
                    >
                        Get the UniteOman app and book any home service in under 60
                        seconds. Available on iOS & Android.
                    </p>

                    {/* Store Buttons */}
                    <div className="flex flex-wrap gap-4">

                       {/* App Store */}
<button className="flex items-center gap-2 bg-white rounded-xl px-5 py-2 shadow-lg hover:scale-105 transition">
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
<button className="flex items-center gap-2 bg-white rounded-xl px-5 py-2 shadow-lg hover:scale-105 transition">
  <Play
    size={22}
    fill="#34A853"
    color="#34A853"
  />

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
                <div className="flex-1 flex justify-center items-end gap-5">

                    {/* Left Phone */}
                    <div className="w-[160px] h-[280px] rounded-[28px] border-2 border-white/30 bg-white/10 p-5 flex flex-col items-center gap-3 rotate-[-6deg] translate-y-5">

                        <div className="w-16 h-[5px] rounded-full bg-white/30" />

                        <div className="flex-1 w-full rounded-2xl bg-white/10 flex items-center justify-center">

                            <img
                                src="/image 672.png"
                                alt="UniteOman"
                                className="w-[100px] opacity-70"
                            />

                        </div>

                    </div>

                    {/* Main Phone */}
                    <div className="w-[180px] h-[320px] rounded-[32px] border-2 border-white/40 bg-white/20 shadow-[0_20px_60px_rgba(0,0,0,.3)] p-6 flex flex-col items-center gap-3">

                        <div className="w-16 h-[5px] rounded-full bg-white/40" />

                        <div className="flex-1 w-full rounded-[18px] bg-white/10 flex flex-col items-center justify-center gap-2 p-4">

                            <span className="text-[34px]">
                                ❄️
                            </span>

                            <div className="text-white font-bold text-[13px] text-center">
                                AC Deep Cleaning
                            </div>

                            <div className="text-white/70 text-[11px]">
                                OMR 15 · ⭐ 4.9
                            </div>

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