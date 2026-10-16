import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Award, Briefcase, Calendar, Code, 
  ShieldCheck, ArrowRight, Sparkles, Star, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { getImpactData, getImpactStatistics, getPartnersList } from '../services/api';

const ImpactPage = ({ onOpenJoinModal }) => {
  const [stats, setStats] = useState(null);
  const [impactInfo, setImpactInfo] = useState({ metrics: [], milestones: [] });
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    setLoading(true);
    try {
      const [statsRes, impactRes, partnerRes] = await Promise.allSettled([
        getImpactStatistics(),
        getImpactData(),
        getPartnersList()
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data?.statistics || {});
      }
      if (impactRes.status === 'fulfilled') {
        setImpactInfo(impactRes.value.data || { metrics: [], milestones: [] });
      }
      if (partnerRes.status === 'fulfilled') {
        setPartners(partnerRes.value.data?.partners || partnerRes.value.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch impact data:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: 'CAREER', desc: 'Verified student placements, internships & job opportunities', icon: Briefcase },
    { title: 'LEARNING', desc: 'Practical hands-on workshops, sessions & hackathons', icon: Calendar },
    { title: 'COMMUNITY', desc: 'Nationwide network of student volunteers & ambassadors', icon: Users },
    { title: 'PROJECTS', desc: 'Collaborative student software & design project portfolio', icon: Code },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-16">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20">
            <TrendingUp size={14} className="text-[#2563EB]" /> Verified Impact Metrics
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Our Impact
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Measuring the difference our community is creating.
          </p>
        </div>

        {/* METRICS GRID */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2563EB]">
                {stats?.students_supported || 0}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Students Supported</div>
              <p className="text-[11px] text-gray-500">Guided through platforms & services</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2563EB]">
                {stats?.students_placed || 0}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Students Placed</div>
              <p className="text-[11px] text-gray-500">Verified placement records</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2563EB]">
                {stats?.events || 0}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Events Conducted</div>
              <p className="text-[11px] text-gray-500">Workshops & campus meets</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2563EB]">
                {stats?.projects || 0}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Student Projects</div>
              <p className="text-[11px] text-gray-500">Published student portfolios</p>
            </div>
          </div>
        )}

        {/* IMPACT CATEGORIES */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Categorized Growth</span>
            <h2 className="text-3xl font-extrabold text-[#2563EB]">Impact Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] space-y-3 shadow-sm hover:border-[#2563EB] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-md">
                    <Icon size={22} className="text-white stroke-[2]" />
                  </div>
                  <h4 className="font-extrabold text-[#2563EB] text-lg">{cat.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* IMPACT TIMELINE */}
        {impactInfo.milestones && impactInfo.milestones.length > 0 && (
          <section className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl font-extrabold text-[#2563EB]">Impact Timeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {impactInfo.milestones.map((m, idx) => (
                <div key={m.id || idx} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-3 shadow-sm relative">
                  <span className="inline-block px-3.5 py-1 bg-[#2563EB] text-white font-extrabold text-xs rounded-full shadow-sm">
                    {m.year}
                  </span>
                  <h4 className="font-bold text-[#2563EB] text-lg">{m.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PARTNERS & COLLABORATORS */}
        {partners.length > 0 && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] space-y-8 shadow-sm">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Credibility & Trust</span>
              <h2 className="text-3xl font-extrabold text-[#2563EB]">Partner Organizations</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {partners.map((p) => (
                <div key={p.id} className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] space-y-3 text-center">
                  <h4 className="font-bold text-[#2563EB] text-base">{p.name}</h4>
                  <span className="inline-block px-2.5 py-0.5 bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-bold rounded-full">
                    {p.partnership_type}
                  </span>
                  <p className="text-xs text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* JOIN CTA */}
        <div className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-8 sm:p-12 border-2 border-[#2563EB] text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-[#FFFFFF]">Be Part of Our Next Impact Milestone</h2>
          <p className="text-gray-200 text-sm max-w-xl mx-auto">
            Join thousands of college students discovering opportunities, building projects, and growing careers with SS.
          </p>
          <button
            onClick={onOpenJoinModal}
            className="px-8 py-3.5 rounded-xl bg-[#1D4ED8] text-white font-extrabold text-sm shadow-xl hover:bg-[#92400E] transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Join SS Community</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImpactPage;
