export default function StatsSection() {
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
    <section className="relative overflow-hidden py-24 bg-[linear-gradient(145deg,#0A0A0F_0%,#1a0830_40%,#0a1240_100%)]">

      {/* Background Blur */}
      <div className="absolute -top-36 -right-36 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(214,28,168,.15),transparent_70%)]" />

      <div className="absolute -bottom-36 -left-24 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(75,110,245,.12),transparent_70%)]" />

      <div className="relative max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="text-center mb-16">

          <img
            src="/image 672.png"
            alt="UniteOman"
            className="h-11 w-auto mx-auto mb-5 opacity-95"
          />

          <h2
            style={{
              font: '600 52px/1.1 "DM Sans", sans-serif',
              letterSpacing: "-3px",
            }}
            className="text-white"
          >
            Muscat's Most Trusted
            <br />
            Home Services Platform
          </h2>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {stats.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center"
            >

              {/* Top Gradient */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.top}`}
              />

              {/* Number */}
              <div
                className={`mb-3 text-[52px] font-extrabold leading-none bg-gradient-to-r ${item.text} bg-clip-text text-transparent`}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {item.value}
              </div>

              {/* Title */}
              <h3
                style={{
                  font: '700 17px/1.2 "DM Sans", sans-serif',
                }}
                className="text-white mb-2"
              >
                {item.title}
              </h3>

              {/* Subtitle */}
              <p
                style={{
                  font: '400 13px/1.4 "DM Sans", sans-serif',
                }}
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