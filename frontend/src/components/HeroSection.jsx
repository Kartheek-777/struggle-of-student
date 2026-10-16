import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle, Code2, Terminal } from 'lucide-react';

const HeroSection = ({ onOpenJoinModal }) => {

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E2E8F0]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* TAGLINE BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-extrabold uppercase tracking-widest backdrop-blur-xs shadow-xs">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>⚡ EMPOWERING TECH & ENGINEERING STUDENTS</span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.1]">
              Built by Students, <br />
              <span className="text-[#2563EB] font-extrabold">
                For Future Engineers.
              </span>
            </h1>

            {/* SUPPORTING COPY */}
            <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed max-w-2xl font-normal">
              Struggle of Student is a community-driven IT & engineering platform helping tech students master system design, crack coding interviews, discover paid internships, and build open-source projects together.
            </p>

            {/* BRAND PHILOSOPHY MANIFESTO CARD */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC]/90 backdrop-blur-md border border-[#E2E8F0] border-l-4 border-l-[#2563EB] text-xs sm:text-sm text-[#0F172A] font-mono shadow-xs">
              <span className="text-[#2563EB] font-bold">// SS Manifest:</span> "More than just a platform... It's an open-source student community. No student should struggle alone in engineering."
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="px-8 py-4 rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-lg shadow-[#2563EB]/25 hover:bg-[#1D4ED8] hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
              >
                <span>Join Student Dev Network</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/opportunities"
                className="px-8 py-4 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] text-[#0F172A] font-bold text-base hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-center shadow-xs"
              >
                Explore Tech Opportunities
              </Link>
            </div>

            {/* MICROCOPY */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-bold text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                Verified Tech Portfolios
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                100% Free For Students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                45+ Engineering Campuses
              </span>
            </div>

          </div>

          {/* RIGHT EDITORIAL DEV HUB CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* BACKDROP ACCENT CARD GLOW */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-[#2457E6]/20 border border-[#2457E6]/30 -z-10 blur-xs" />

              {/* MAIN DARK DEV HUB CONTAINER */}
              <div className="bg-[#101A30] border border-[#1E293B] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-white">
                
                {/* HEADER OF DEV HUB */}
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#2457E6]" />
                    <span className="text-xs font-mono font-bold text-[#2457E6] uppercase tracking-wider bg-[#101A30] px-2.5 py-1 rounded-md border border-[#173A9B]">
                      DEV & ENGINEERING HUB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SYSTEM ONLINE
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                </div>

                {/* ENGINEERING STUDENT DEV LAB PREVIEW CARD */}
                <div className="relative rounded-2xl overflow-hidden border border-[#1E293B] shadow-inner group bg-[#0B132B] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#94A3B8] font-semibold">repo: ss-open-lab</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2457E6] text-white text-[10px] font-bold uppercase border border-[#2457E6]">
                      ACTIVE SPRINT
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">Engineering Student Dev Lab</h3>
                  <p className="text-xs font-mono text-[#94A3B8] mb-3 font-medium">Rust • Python • Distributed Systems • Open Source</p>
                  <div className="relative h-28 rounded-xl overflow-hidden border border-[#1E293B]">
                    <img
                      src="/assets/engineering_students.jpg"
                      alt="Engineering Students Tech & Coding Lab"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* FEATURE HIGHLIGHT TRACKS */}
                <div className="space-y-3">
                  
                  <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-[#1E293B] flex items-start justify-between gap-3.5 hover:border-[#2457E6] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2457E6] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-sm">
                        01
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">Verified Tech Internships & SDE Roles</h4>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">Direct referrals for frontend, backend, AI, & cloud engineering roles.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded shrink-0 border border-emerald-500/20 font-bold">171 New</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-[#1E293B] flex items-start justify-between gap-3.5 hover:border-[#2457E6] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2457E6] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-sm">
                        02
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">Student Campus Ambassador Chapters</h4>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">Host university hackathons, developer meetups, and open-source pods.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#2457E6] bg-[#2457E6]/10 px-2 py-1 rounded shrink-0 border border-[#2457E6]/30 font-bold">Apply Now</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-[#1E293B] flex items-start justify-between gap-3.5 hover:border-[#2457E6] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2457E6] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-sm">
                        03
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">Peer Code Reviews & Resume Critiques</h4>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">Get PR reviews and resume feedback from FAANG & top startup alumni.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#2457E6] bg-[#2457E6]/10 px-2 py-1 rounded shrink-0 border border-[#2457E6]/30 font-bold">Peer Support</span>
                  </div>

                </div>

                {/* QUICK STAT STRIP */}
                <div className="pt-3 border-t border-[#1E293B] grid grid-cols-2 gap-4 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#1E293B]">
                    <div className="text-xl font-black text-white">1,200+</div>
                    <div className="text-[10px] font-mono uppercase font-bold text-[#94A3B8]">ACTIVE DEV MEMBERS</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#1E293B]">
                    <div className="text-xl font-black text-[#2457E6]">45+</div>
                    <div className="text-[10px] font-mono uppercase font-bold text-[#94A3B8]">UNIV CAMPUSES</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;

