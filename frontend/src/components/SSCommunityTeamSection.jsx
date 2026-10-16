import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Building2, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

const SSCommunityTeamSection = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    apiService.getStats()
      .then((data) => {
        setStats(data.stats || []);
      })
      .catch(() => {});
  }, []);

  const members = [
    {
      name: 'Aditya Varma',
      role: 'Community Lead & Web Dev',
      campus: 'VNR VJIET / Hyderabad',
      badge: 'Team Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Sneha Reddy',
      role: 'Campus Ambassador Lead',
      campus: 'CBIT / Hyderabad',
      badge: 'Campus Lead',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Karthik Raja',
      role: 'Content & Event Co-host',
      campus: 'JNTUH / Hyderabad',
      badge: 'Event Volunteer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Pooja Nair',
      role: 'Design & Talent Showcase',
      campus: 'Osmania University',
      badge: 'Design Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STATS IMPACT STRIP */}
        <div className="mb-16 bg-[#101A30] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2457E6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-mono font-bold tracking-widest text-[#2457E6] uppercase bg-[#101A30] px-3.5 py-1 rounded-full border border-[#173A9B]">
                REAL-TIME COMMUNITY IMPACT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">Driven by Students Across Campuses</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.length > 0 ? (
                stats.map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#0B132B] border border-[#1E293B] hover:border-[#2457E6] transition-colors">
                    <div className="text-3xl sm:text-4xl font-black text-white">{st.value}</div>
                    <div className="text-xs font-mono font-bold text-[#2457E6] uppercase mt-1.5">{st.label}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">{st.description}</div>
                  </div>
                ))
              ) : (
                [
                  { label: 'Active Community Members', val: '1,200+', desc: 'Students connected across campuses' },
                  { label: 'Opportunities Shared', val: '150+', desc: 'Internships, projects & events' },
                  { label: 'Campus Representatives', val: '45+', desc: 'Colleges represented' },
                  { label: 'Events & Workshops Held', val: '30+', desc: 'Online & offline community sessions' }
                ].map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#0B132B] border border-[#1E293B] hover:border-[#2457E6] transition-colors">
                    <div className="text-3xl sm:text-4xl font-black text-white">{st.val}</div>
                    <div className="text-xs font-mono font-bold text-[#2457E6] uppercase mt-1.5">{st.label}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">{st.desc}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* TEAM HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#2457E6] text-xs font-extrabold uppercase tracking-wider mb-3 border border-[#E2E8F0]">
              <Users className="w-3.5 h-3.5 text-[#2457E6]" />
              <span>SS Community & Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Meet the SS Community
            </h2>
            <p className="mt-2 text-base text-[#64748B] max-w-2xl">
              Students leading initiatives, mentoring peers, and organizing events across engineering, arts, and management colleges.
            </p>
          </div>

          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2457E6] text-white font-bold text-sm hover:bg-[#173A9B] transition-colors shrink-0 shadow-md shadow-[#2457E6]/20"
          >
            <span>Meet Our Leadership Team</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* TEAM CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((mem, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center hover:border-[#2457E6] hover:shadow-xl transition-all group"
            >
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#2457E6] shadow-md shadow-[#2457E6]/20">
                <img
                  src={mem.avatar}
                  alt={mem.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2457E6] text-[10px] font-extrabold uppercase mb-2 border border-[#E2E8F0]">
                {mem.badge}
              </span>
              <h3 className="font-extrabold text-[#0F172A] text-base">{mem.name}</h3>
              <p className="text-xs font-bold text-[#2457E6] mt-0.5">{mem.role}</p>
              <p className="text-[11px] text-[#64748B] mt-1">{mem.campus}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SSCommunityTeamSection;
