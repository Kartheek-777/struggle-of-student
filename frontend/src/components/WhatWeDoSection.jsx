import React from 'react';
import { Briefcase, Users, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatWeDoSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-extrabold uppercase tracking-wider mb-4">
            Core Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            What Can You Find at SS?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Everything a student needs to transition from campus confusion to career confidence.
          </p>
        </div>

        {/* 4 NON-IDENTICAL QUADRANTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* QUADRANT 1: OPPORTUNITIES (CLEAN LIGHT FEATURE CARD) */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase">01 — OPPORTUNITIES</span>
                <Briefcase className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-4">
                Internships, Jobs & Projects
              </h3>
              <p className="text-sm sm:text-base text-[#64748B] mb-6 leading-relaxed">
                Discover curated opportunities tailored for college students and early-career grads. Gain real-world experience, build your portfolio, and earn stipend allowances.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {['Internships', 'Entry-Level Jobs', 'Campus Ambassador', 'Volunteering', 'Student Projects', 'Freelance'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#E2E8F0]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <span>Explore All Opportunities</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* QUADRANT 2: COMMUNITY */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border-2 border-[#2563EB] rounded-3xl p-8 shadow-xs flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase">02 — COMMUNITY</span>
                <Users className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-3">
                Peer Network & Stories
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Connect with like-minded students, share interview experiences, read authentic student failure-to-success stories, and find co-founders.
              </p>
            </div>

            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <span>Join Community Network</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* QUADRANT 3: GROWTH */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 shadow-xs flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase">03 — SKILLS & GROWTH</span>
                <TrendingUp className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-3">
                Workshops & Mentorship
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Learn modern tech stacks, AI tools, communication skills, and design systems through live interactive sessions and senior mentor reviews.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#2563EB] hover:text-[#2563EB] transition-colors"
            >
              <span>Explore Skill Bootcamps</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* QUADRANT 4: EXPERIENCE */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between hover:border-[#2563EB] transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase">04 — EXPERIENCE</span>
                <Sparkles className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3">
                Events, Zoom Sessions & Talent Showcase
              </h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6">
                Participate in campus hackathons, online masterclasses, talent showcases (music, photography, coding, design), and volunteer event organizing.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <span>View Upcoming Events</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhatWeDoSection;
