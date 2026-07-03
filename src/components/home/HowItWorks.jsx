import {
  UserRound,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

export default function HowItWorks() {
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
    <section className="py-24  bg-white">
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
            <span
              style={{
                font: '700 10px/1 "DM Sans", sans-serif',
                letterSpacing: "2.5px",
              }}
              className="uppercase text-white"
            >
              Simple Process
            </span>
          </div>

          <h2
            style={{
              font: '600 52px/1.1 "DM Sans", sans-serif',
              letterSpacing: "-2px",
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
            className="
    hidden
    md:block
    absolute
    left-[16%]
    right-[16%]
    top-[40px]
    h-[3px]
    rounded-full
    bg-gradient-to-r
    from-pink-300
    via-purple-300
    to-cyan-300
    z-0
  "
          />

          {/* Glow */}
          <div
            className="
    hidden
    md:block
    absolute
    left-[16%]
    right-[16%]
    top-[38px]
    h-[8px]
    rounded-full
    bg-gradient-to-r
    from-pink-300
    via-purple-300
    to-cyan-300
    blur-lg
    opacity-40
    z-0
  "
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="px-8 lg:px-11 text-center"
              >
                <div
                  className={`
    relative
    z-20
    w-20
    h-20
    mx-auto
    mb-7
    rounded-3xl
    bg-gradient-to-r
    ${step.gradient}
    ${step.shadow}
    flex
    items-center
    justify-center
   
  `}
                >
                  <Icon
                    size={38}
                    strokeWidth={2.2}
                    className="text-white"
                  />
                </div>

                <h3
                  style={{
                    font: '600 24px/1.2 "DM Sans", sans-serif',
                  }}
                  className="text-[#0A0A0F] mb-3"
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    font: '400 16px/1.65 "DM Sans", sans-serif',
                  }}
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