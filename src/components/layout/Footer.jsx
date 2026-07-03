// import { Link } from 'react-router-dom'
// import Logo from '@/components/ui/Logo'

// export default function Footer() {
//   return (
//     <footer className="footer bg-[var(--ink)] py-[64px] px-0 pb-[32px] border-t border-[rgba(255,255,255,0.07)] text-white">
//       <div className="c">
//         <div className="footer-grid grid md:grid-cols-[2.5fr_1fr_1fr_1fr] gap-[48px] mb-[48px]">
//           <div className="fl-logo">
//             <Link to="/"><Logo theme="dark" style={{ height: '32px', marginBottom: '16px' }} /></Link>
//             <div className="fl-tag text-[10px] text-[rgba(255,255,255,0.25)] tracking-[0.1em] uppercase font-bold mb-[12px]">Oman's Premier Business Directory</div>
//             <p className="fl-desc text-[13px] text-[rgba(255,255,255,0.4)] leading-[1.8] max-w-[280px]">
//               The Sultanate's most trusted platform for connecting verified local businesses with customers across all 11 governorates.
//             </p>
//           </div>
          
//           <div className="fc">
//             <h4 className="fc-h text-[11px] font-bold tracking-[0.12em] uppercase text-[rgba(255,255,255,0.3)] mb-[20px]">Explore</h4>
//             <ul className="fc-links list-none flex flex-col gap-[10px]">
//               <li><Link to="/businesses" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Find Services</Link></li>
//               <li><Link to="/categories" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Browse Categories</Link></li>
//               <li><Link to="/governorates" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">By Governorate</Link></li>
//               <li><Link to="/pricing" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Business Pricing</Link></li>
//             </ul>
//           </div>

//           <div className="fc">
//             <h4 className="fc-h text-[11px] font-bold tracking-[0.12em] uppercase text-[rgba(255,255,255,0.3)] mb-[20px]">For Businesses</h4>
//             <ul className="fc-links list-none flex flex-col gap-[10px]">
//               <li><Link to="/vendor/login" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Vendor Portal</Link></li>
//               <li><Link to="/list-business" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Add Your Shop</Link></li>
//               <li><Link to="/AdvertisingPricing" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Advertising</Link></li>
//               <li><Link to="/partner" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Partner Program</Link></li>
//             </ul>
//           </div>

//           <div className="fc">
//             <h4 className="fc-h text-[11px] font-bold tracking-[0.12em] uppercase text-[rgba(255,255,255,0.3)] mb-[20px]">Legal & Support</h4>
//             <ul className="fc-links list-none flex flex-col gap-[10px]">
//               <li><Link to="/AboutUs" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">About Us</Link></li>
//               <li><Link to="/contact" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Help Center</Link></li>
//               <li><Link to="/privacypolicy" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Privacy Policy</Link></li>
//               <li><Link to="/TermsOfUse" className="text-[13px] text-[rgba(255,255,255,0.45)] transition-colors hover:text-white">Terms of Use</Link></li>
//             </ul>
//           </div>
//         </div>

//         <div className="footer-bot flex flex-col md:flex-row items-center justify-between pt-[24px] border-t border-[rgba(255,255,255,0.07)] gap-[16px]">
//           <div className="footer-copy text-[12px] text-[rgba(255,255,255,0.25)]">
//             © {new Date().getFullYear()} UniteOman. Connecting the Sultanate, one business at a time.
//           </div>
//           <div className="footer-social flex gap-[20px]">
//             <a href="#" className="text-[12px] text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">Instagram</a>
//             <a href="#" className="text-[12px] text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">LinkedIn</a>
//             <a href="#" className="text-[12px] text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">Twitter</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }


import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] pt-16 pb-8">
      <div className="max-w-[1300px] mx-auto px-5 lg:px-14">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16 mb-14">

          {/* Logo */}
          <div>
            <img
              src="/image 672.png"
              alt="UniteOman"
              className="h-[38px] w-auto mb-5"
            />

            <p
              style={{
                font: '400 15px/1.7 "DM Sans", sans-serif',
              }}
              className="text-white/45 max-w-[300px] mb-6"
            >
              Oman's #1 platform for verified home services.
              Serving all 11 governorates with quality,
              trust and speed.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">

              <a
                href="#"
                className="w-[38px] h-[38px] rounded-[10px] border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <Facebook
                  size={18}
                  className="text-white/60"
                />
              </a>

              <a
                href="#"
                className="w-[38px] h-[38px] rounded-[10px] border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <Instagram
                  size={18}
                  className="text-white/60"
                />
              </a>

              <a
                href="#"
                className="w-[38px] h-[38px] rounded-[10px] border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <Twitter
                  size={18}
                  className="text-white/60"
                />
              </a>

            </div>
          </div>

          {/* Services */}
          <div>

            <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.5px] mb-5">
              Services
            </h4>

            <div className="flex flex-col gap-3">

              <Link to="/businesses?category=ac-service" className="text-white/50 hover:text-white text-[14px]">
                AC Service
              </Link>

              <Link to="/businesses?category=cleaning" className="text-white/50 hover:text-white text-[14px]">
                Home Cleaning
              </Link>

              <Link to="/businesses?category=plumbing" className="text-white/50 hover:text-white text-[14px]">
                Plumbing
              </Link>

              <Link to="/businesses?category=electrical" className="text-white/50 hover:text-white text-[14px]">
                Electrical
              </Link>

              <Link to="/businesses?category=beauty" className="text-white/50 hover:text-white text-[14px]">
                Beauty at Home
              </Link>

              <Link to="/categories" className="text-white/50 hover:text-[#D61CA8] text-[14px] font-medium">
                View All →
              </Link>

            </div>

          </div>

          {/* Company */}
          <div>

            <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.5px] mb-5">
              Company
            </h4>

            <div className="flex flex-col gap-3">

              <Link to="/AboutUs" className="text-white/50 hover:text-white text-[14px]">
                About Us
              </Link>

              <Link to="/how-it-works" className="text-white/50 hover:text-white text-[14px]">
                How It Works
              </Link>

              <Link to="/vendor/login" className="text-white/50 hover:text-white text-[14px]">
                Become a Pro
              </Link>

              <Link to="/businesses" className="text-white/50 hover:text-white text-[14px]">
                For Business
              </Link>

              <Link to="/blog" className="text-white/50 hover:text-white text-[14px]">
                Blog
              </Link>

              <Link to="/careers" className="text-white/50 hover:text-white text-[14px]">
                Careers
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.5px] mb-5">
              Contact
            </h4>

            <div className="flex flex-col gap-3 text-white/50 text-[14px]">

              <div>+968 2400 0000</div>

              <div>support@uniteoman.com</div>

              <div>
                Muscat,
                <br />
                Sultanate of Oman
              </div>

              <div className="flex items-center gap-2 mt-2">

                <span className="w-2 h-2 rounded-full bg-[#D61CA8] animate-pulse"></span>

                <span className="text-white/70 font-semibold text-[13px]">
                  24/7 Support
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-7"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <div className="text-white/30 text-[13px]">
            © {new Date().getFullYear()} UniteOman. All rights reserved.
            Muscat, Sultanate of Oman.
          </div>

          <div className="flex gap-6">

            <Link
              to="/privacypolicy"
              className="text-white/35 hover:text-white text-[13px]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/TermsOfUse"
              className="text-white/35 hover:text-white text-[13px]"
            >
              Terms of Service
            </Link>

            <Link
              to="/cookie-policy"
              className="text-white/35 hover:text-white text-[13px]"
            >
              Cookie Policy
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}