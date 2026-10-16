import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight, ShieldCheck, Mail, MapPin, Phone, Send } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TelegramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0011.944 0zm5.84 8.113l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.05 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.536-.197 1.006.12.83.953z"/>
  </svg>
);

const Footer = ({ onOpenJoinModal }) => {
  return (
    <footer className="bg-[#101A30] text-[#E2E8F0] pt-16 pb-12 border-t border-[#101A30]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP CALL-TO-ACTION BANNER MATCHING SCREENSHOT */}
        <div className="mb-16 p-8 sm:p-12 rounded-3xl bg-[#101A30] border border-[#101A30] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#2457E6]/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101A30] border border-[#173A9B] text-[#2457E6] text-xs font-mono font-bold uppercase tracking-wider">
              <span>🚀 100% Free Open Educational Platform</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Never Struggle Alone in Your Tech Journey.
            </h2>
            
            <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed max-w-2xl mx-auto">
              Join 1,200+ eng peers, find study accountability partners, get verified job alerts, and access mentor office hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2457E6] hover:bg-[#173A9B] text-white font-black text-sm shadow-lg shadow-[#2457E6]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Join 1200+ Student Network — Free</span>
                <Send className="w-4 h-4" />
              </button>

              <Link
                to="/opportunities"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#101A30] border border-[#101A30] text-white hover:border-[#2457E6] hover:bg-[#101A30] font-bold text-sm transition-all text-center"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>

        {/* 4 COLUMNS NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#101A30] text-sm">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#1E293B] flex items-center justify-center shadow-md p-1 overflow-hidden relative">
                <img
                  src="/logo.png"
                  alt="SS Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.classList.remove('hidden');
                      e.target.nextElementSibling.classList.add('flex');
                    }
                  }}
                />
                <span className="hidden font-black text-[#2457E6] text-base">SS</span>
              </div>
              <span className="font-black text-xl tracking-tight text-white uppercase">
                STRUGGLEOFSTUDENT
              </span>
            </div>
            <p className="text-[#E2E8F0] text-xs leading-relaxed max-w-sm">
              Dream - Learn - Grow - Together. Empowering engineering & technology students worldwide with community, mentor tips, open-source roadmaps, and transparent opportunities.
            </p>
            
            {/* SOCIAL MEDIA ICONS */}
            <div className="pt-2">
              <span className="block text-[11px] font-mono font-bold text-[#2457E6] uppercase tracking-wider mb-3">
                Official Social Channels
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://www.instagram.com/struggle.of.student?stkn=MWpjOXNmNG5kZmdmNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-[#2457E6] hover:bg-[#2457E6]/20 transition-all"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://whatsapp.com/channel/0029VbDGVdIJpe8hBlo7jK44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-emerald-500 hover:bg-emerald-600/20 transition-all"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://m.youtube.com/%40struggleofstudents-o30?si=hhQWZQV8CW3QmNvI&fbclid=PAb21jcAUpiaRleHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABpwoLuDDd43nbKDfUlg6kycar_AHeuw2Yf7uM5RwQ3BinQd7ERyZ1q5rBf88-_aem_X4BB4KehHVXYKoD0iURC9Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-red-500 hover:bg-red-600/20 transition-all"
                  title="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://x.com/Struggleofstdnt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-[#2457E6] hover:bg-[#2457E6]/20 transition-all"
                  title="Twitter / X"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://www.linkedin.com/company/struggleofstudent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-[#2457E6] hover:bg-[#2457E6]/20 transition-all"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://t.me/struggleofstudent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#101A30] border border-[#101A30] flex items-center justify-center text-[#E2E8F0] hover:text-white hover:border-[#2457E6] hover:bg-[#2457E6]/20 transition-all"
                  title="Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* COMMUNITY LINKS */}
          <div className="space-y-3">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-xs">COMMUNITY LINKS</h5>
            <ul className="space-y-2.5 text-xs text-[#E2E8F0]">
              <li><Link to="/opportunities" className="hover:text-[#2457E6] transition-colors">Student Internships & Jobs</Link></li>
              <li><Link to="/opportunities" className="hover:text-[#2457E6] transition-colors">Coding Challenges & Sprints</Link></li>
              <li><Link to="/campus-ambassador" className="hover:text-[#2457E6] transition-colors">Campus & Ambassador Wing</Link></li>
              <li><Link to="/sessions" className="hover:text-[#2457E6] transition-colors">Free 1:1 Mentorship Sessions</Link></li>
            </ul>
          </div>

          {/* DEV RESOURCES */}
          <div className="space-y-3">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-xs">DEV RESOURCES</h5>
            <ul className="space-y-2.5 text-xs text-[#E2E8F0]">
              <li><Link to="/support" className="hover:text-[#2457E6] transition-colors">Tech Resume Templates (LaTeX)</Link></li>
              <li><Link to="/support" className="hover:text-[#2457E6] transition-colors">DSA & System Design Roadmaps</Link></li>
              <li><Link to="/support" className="hover:text-[#2457E6] transition-colors">GATE & Core Engineering Notes</Link></li>
              <li><Link to="/about" className="hover:text-[#2457E6] transition-colors">Student Dev FAQs</Link></li>
            </ul>
          </div>

          {/* SUPPORT & ETHICS */}
          <div className="space-y-3">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-xs">SUPPORT & ETHICS</h5>
            <p className="text-xs text-[#E2E8F0] leading-relaxed">
              100% Student-led initiative. No paywalls for essential student growth and tech education.
            </p>
            <div className="p-3 rounded-xl bg-[#101A30] border border-[#101A30] text-[11px] font-mono text-[#E2E8F0]">
              <span className="text-[#2457E6] font-bold block">HELPLINE:</span> support@struggleofstudent.org
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E2E8F0]/70">
          <p>© 2026 Struggle of Student (SS) • Open Student Dev Network. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#E2E8F0] font-medium">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Community Guidelines</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
