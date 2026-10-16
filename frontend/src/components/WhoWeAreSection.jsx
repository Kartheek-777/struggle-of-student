import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, GraduationCap, Lightbulb, Target, Network, ArrowRight } from 'lucide-react';
import { getImpactStatistics } from '../services/api';

const WhoWeAreSection = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getImpactStatistics();
      setStats(res.data?.statistics || {});
    } catch (err) {
      console.error("Failed to load impact stats:", err);
    }
  };

  const pillars = [
    {
      icon: Users,
      title: 'Student Community',
      description: 'A vibrant, supportive network where students connect across colleges to share experiences, guidance, and opportunities.'
    },
    {
      icon: GraduationCap,
      title: 'Career Opportunities',
      description: 'Direct access to verified internships, entry-level jobs, freelance gigs, and project collaborations designed for students.'
    },
    {
      icon: Lightbulb,
      title: 'Practical Skill Building',
      description: 'Beyond theoretical college exams-hands-on workshops, coding challenges, design bootcamps, and career preparation.'
    },
    {
      icon: Compass,
      title: 'Mentorship & Guidance',
      description: 'Empathetic counseling, career direction, and major project guidance so you never have to navigate challenges alone.'
    },
    {
      icon: Target,
      title: 'Campus Leadership',
      description: 'Become the voice of SS on your campus, lead campaigns, build management experience, and expand your professional network.'
    },
    {
      icon: Network,
      title: 'Talent Showcase',
      description: 'A dedicated platform to display your coding, design, photography, writing, music, or video creation to potential recruiters.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              About The Movement
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Who We Are
            </h2>
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              Struggle of Student is a student-focused community created to understand the real challenges students face during college life and connect them with opportunities, people, practical knowledge, and genuine support.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-xs font-black shadow-md shadow-[#2563EB]/20 hover:bg-[#1D4ED8] transition-all"
              >
                <span>Learn More About SS</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* QUICK MISSION & REAL STATS BADGE */}
          <div className="lg:col-span-5 bg-[#F8FAFC] p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-widest block">OUR CORE MISSION</span>
              <p className="text-sm font-semibold text-[#64748B] mt-1 italic leading-relaxed">
                "To create a supportive ecosystem where students can discover opportunities, build skills, solve problems and grow together."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-4">
              <div>
                <div className="text-2xl font-black text-[#0F172A]">
                  {stats?.active_members || 0}
                </div>
                <div className="text-[11px] font-bold text-[#64748B]">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#2563EB]">
                  {stats?.students_placed || 0}
                </div>
                <div className="text-[11px] font-bold text-[#64748B]">Students Placed</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={index}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center mb-5 group-hover:scale-110 shadow-md shadow-[#2563EB]/20 transition-transform">
                  <IconComponent className="w-6 h-6 text-white stroke-[2]" />
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhoWeAreSection;
