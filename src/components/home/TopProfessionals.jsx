import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopProfessionals() {
  const navigate = useNavigate();

  const professionals = [
    {
      name: "Mohammed Al-Balushi",
      role: "AC & Appliance Specialist",
      rating: "4.9",
      reviews: "847",
      price: "OMR 15",
      initial: "M",
      badge: "⭐ Top Rated",
      topGradient: "from-[#D61CA8] to-[#8B2EF5]",
      avatarGradient: "from-[#D61CA8] to-[#8B2EF5]",
      badgeGradient: "from-[#D61CA8] to-[#8B2EF5]",
      skills: ["AC Service", "Appliance", "Electrical"],
    },
    {
      name: "Fatima Al-Zaabi",
      role: "Beauty & Wellness Expert",
      rating: "5.0",
      reviews: "291",
      price: "OMR 25",
      initial: "F",
      badge: "✓ Verified",
      topGradient: "from-[#4B6EF5] to-[#8B2EF5]",
      avatarGradient: "from-[#4B6EF5] to-[#8B2EF5]",
      badgeGradient: "from-[#4B6EF5] to-[#8B2EF5]",
      skills: ["Facial", "Waxing", "Massage"],
    },
    {
      name: "Salim Al-Habsi",
      role: "Plumbing & Electrical",
      rating: "4.8",
      reviews: "524",
      price: "OMR 8",
      initial: "S",
      badge: "🔥 Popular",
      topGradient: "from-[#10B981] to-[#4B6EF5]",
      avatarGradient: "from-[#10B981] to-[#4B6EF5]",
      badgeGradient: "from-[#F59E0B] to-[#EF4444]",
      skills: ["Plumbing", "Electrical", "Carpentry"],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

          <div>
            <div className="inline-flex bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] rounded-md px-3 py-1 mb-4">
              <span
                style={{
                  font: '700 10px/1 "DM Sans", sans-serif',
                  letterSpacing: "2.5px",
                }}
                className="uppercase text-white"
              >
                Top Talent
              </span>
            </div>

            <h2
              style={{
                font: '600 52px/1.0 "DM Sans", sans-serif',
                letterSpacing: "-2px",
              }}
              className="text-[#0A0A0F]"
            >
              Meet Our Top-Rated Pros
            </h2>
          </div>

          <button
            onClick={() => navigate("/professionals")}
            className="px-7 py-3 rounded-xl border-2 border-[#EBEBEF] bg-white text-[#0A0A0F] font-semibold text-[15px] hover:border-[#D61CA8] hover:text-[#D61CA8] transition-all"
          >
            View All Professionals →
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

          {professionals.map((pro, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[24px] bg-[#F7F7FA] p-8"
            >

              {/* Top Border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pro.topGradient}`}
              />

              {/* Badge */}
              <div
                className={`absolute top-3 right-5 px-2  rounded-full bg-gradient-to-r ${pro.badgeGradient}`}
              >
                <span
                  style={{
                    font: '600 11px/1 "DM Sans", sans-serif',
                  }}
                  className="text-white"
                >
                  {pro.badge}
                </span>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">

                <div
                  className={`w-[68px] h-[68px] rounded-full bg-gradient-to-r ${pro.avatarGradient} flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    style={{
                      font: '800 26px "DM Sans", sans-serif',
                    }}
                    className="text-white"
                  >
                    {pro.initial}
                  </span>
                </div>

                <div>

                  <h3
                    style={{
                      font: '600 19px/1.2 "DM Sans", sans-serif',
                    }}
                    className="text-[#0A0A0F]"
                  >
                    {pro.name}
                  </h3>

                  <p
                    style={{
                      font: '500 14px/1 "DM Sans", sans-serif',
                    }}
                    className="text-[#6B7280] mt-1.5"
                  >
                    {pro.role}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">

                    <Star
                      size={14}
                      fill="#F59E0B"
                      color="#F59E0B"
                    />

                    <span className="font-bold text-[14px]">
                      {pro.rating}
                    </span>

                    <span className="text-[#9090A0] text-[12px]">
                      ({pro.reviews} reviews)
                    </span>

                  </div>

                </div>

              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">

                {pro.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8EE] text-[#6B7280] text-[12px] font-medium"
                  >
                    {skill}
                  </span>
                ))}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">

                <div>

                  <div className="text-[#9090A0] text-[11px] mb-1">
                    Starting from
                  </div>

                  <div className="text-[#D61CA8] font-extrabold text-[22px]">
                    {pro.price}
                  </div>

                </div>

                <button
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D61CA8] to-[#8B2EF5] text-white font-bold text-[14px] shadow-[0_6px_20px_rgba(214,28,168,.35)] hover:scale-105 transition"
                >
                  Book Now
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}