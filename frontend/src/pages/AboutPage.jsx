import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Target, Compass, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Heart, Award, Briefcase, 
  BookOpen, Star, Building2, HelpCircle 
} from 'lucide-react';
import { getAboutSection, getImpactStatistics } from '../services/api';

const AboutPage = ({ onOpenJoinModal }) => {
  const [aboutData, setAboutData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [aboutRes, statsRes] = await Promise.all([
        getAboutSection(),
        getImpactStatistics()
      ]);
      setAboutData(aboutRes.data?.data || aboutRes.data);
      setStatsData(statsRes.data?.statistics || {});
    } catch (err) {
      console.error("Failed to load about data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO SECTION */}
      <section className="bg-[#FFFFFF] text-[#0F172A] py-16 lg:py-20 border-b-2 border-[#E2E8F0] relative overflow-hidden shadow-sm">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="Struggle of Student Official Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl shadow-lg bg-white p-1 border-2 border-[#E2E8F0]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Official Identity & Community Vision</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Built by Students, <br />
            <span className="text-[#2563EB] italic font-normal">for Students.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
            {aboutData?.subtitle || "Struggle of Student (SS) is a student-driven ecosystem designed to ensure no student faces career, skill, or life challenges alone."}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenJoinModal}
              className="px-8 py-3.5 rounded-xl bg-[#2563EB] text-white font-extrabold text-sm shadow-xl hover:bg-[#F59E0B] transition-all flex items-center gap-2"
            >
              <span>Join SS Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/leadership"
              className="px-8 py-3.5 rounded-xl border-2 border-[#E2E8F0]/40 text-[#F8FAFC] font-bold text-sm hover:bg-white/10 transition-all"
            >
              Meet Our Leadership
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN 11 SECTIONS */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* SECTION 1: WHO WE ARE */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">01 - Identity</span>
            <h2 className="text-3xl font-extrabold text-[#2563EB]">Who We Are</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {aboutData?.who_we_are || "Struggle of Student (SS) is a vibrant, supportive community founded by students to bridge the gap between academic education and real-world career opportunities."}
            </p>
          </div>
          <div className="lg:col-span-5 bg-[#FFFFFF] p-6 rounded-2xl border border-[#2563EB]/30 space-y-4">
            <h4 className="font-bold text-[#2563EB] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              <span>Authentic Student-Led Network</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> 100% Peer-driven initiatives</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Real practical project portfolios</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Direct mentorship from senior students</li>
            </ul>
          </div>
        </section>

        {/* SECTION 2: WHY SS EXISTS */}
        <section className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">02 - Purpose</span>
            <h2 className="text-3xl font-extrabold text-[#2563EB] mt-1">Why SS Exists</h2>
            <p className="text-gray-700 text-base leading-relaxed mt-3">
              {aboutData?.why_ss_exists || "Students often face isolation, lack of guidance, fragmented opportunity access, and insufficient practical mentorship during their college journey. SS was created to solve these exact problems."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <HelpCircle className="w-8 h-8 text-[#2563EB] mb-3" />
              <h4 className="font-bold text-[#2563EB] text-base mb-1">Career Isolation</h4>
              <p className="text-xs text-gray-600">Students navigating complex hiring pipelines alone without peer support.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <Briefcase className="w-8 h-8 text-[#2563EB] mb-3" />
              <h4 className="font-bold text-[#2563EB] text-base mb-1">Skill Gap</h4>
              <p className="text-xs text-gray-600">Textbook syllabi that don't match fast-paced software and industry tools.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <Users className="w-8 h-8 text-[#2563EB] mb-3" />
              <h4 className="font-bold text-[#2563EB] text-base mb-1">Fragmented Info</h4>
              <p className="text-xs text-gray-600">Scatter opportunity listings, fake internships, and unverified promises.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 & 4: MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#2563EB] text-[#F8FAFC] p-8 sm:p-10 rounded-3xl border-2 border-[#2563EB] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-extrabold">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">03 - Mission</span>
            <h3 className="text-2xl font-extrabold text-[#FFFFFF]">Our Mission</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              "{aboutData?.mission || "To create a supportive ecosystem where students can discover opportunities, build skills, solve problems and grow together."}"
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#E2E8F0] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-extrabold">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">04 - Vision</span>
            <h3 className="text-2xl font-extrabold text-[#2563EB]">Our Vision</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              "{aboutData?.vision || "To build a strong student-driven community where every student can find opportunities to learn, contribute and grow."}"
            </p>
          </div>
        </div>

        {/* SECTION 5 & 6: WHAT WE DO & HOW WE HELP */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E2E8F0] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">05 & 06 - Impact Engine</span>
            <h2 className="text-3xl font-extrabold text-[#2563EB]">What We Do & How We Help</h2>
            <p className="text-gray-600 text-sm">Empowering students through tangible platforms and transparent guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0]">
              <h4 className="font-bold text-[#2563EB] text-lg">What We Do</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {aboutData?.what_we_do || "We organize practical workshops, connect students with internships and jobs, foster collaborative student projects, showcase student talent, and provide peer mentorship."}
              </p>
            </div>
            <div className="space-y-3 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0]">
              <h4 className="font-bold text-[#2563EB] text-lg">How We Help Students</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {aboutData?.how_we_help || "Through verified opportunity listings, volunteer experience, campus leadership programs, technical guidance, and career support services."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7, 8, 9: COMMUNITY, OPPORTUNITIES & SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E2E8F0] space-y-3 hover:border-[#2563EB] transition-all">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">07 - Community</span>
            <h3 className="text-xl font-bold text-[#2563EB]">Our Community</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {aboutData?.our_community_desc || "A nationwide network of passionate college students, campus ambassadors, student developers, creators, and mentors."}
            </p>
            <Link to="/team" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
              <span>Meet SS Team & Community</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E2E8F0] space-y-3 hover:border-[#2563EB] transition-all">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">08 - Opportunities</span>
            <h3 className="text-xl font-bold text-[#2563EB]">Our Opportunities</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {aboutData?.our_opportunities_desc || "Curated internships, freelance projects, hackathons, and volunteer positions tailored for college growth."}
            </p>
            <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E2E8F0] space-y-3 hover:border-[#2563EB] transition-all">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">09 - Services</span>
            <h3 className="text-xl font-bold text-[#2563EB]">Our Services</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {aboutData?.our_services_desc || "End-to-end event management, IT solutions, student band, and career support services powered by student teams."}
            </p>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
              <span>View Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 10: OUR IMPACT STATS */}
        <section className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-8 sm:p-12 border-2 border-[#2563EB] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">10 - Real Metrics</span>
            <h2 className="text-3xl font-extrabold text-[#FFFFFF]">Our Impact</h2>
            <p className="text-gray-300 text-sm">Empirical, backend-driven statistics verified by the SS community.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#2563EB]/30">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                {statsData?.active_members || 0}
              </div>
              <div className="text-xs font-semibold text-gray-300 mt-1">Active Community Members</div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#2563EB]/30">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                {statsData?.students_placed || 0}
              </div>
              <div className="text-xs font-semibold text-gray-300 mt-1">Students Placed</div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#2563EB]/30">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                {statsData?.events || 0}
              </div>
              <div className="text-xs font-semibold text-gray-300 mt-1">Events & Workshops</div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#2563EB]/30">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                {statsData?.projects || 0}
              </div>
              <div className="text-xs font-semibold text-gray-300 mt-1">Student Projects</div>
            </div>
          </div>
        </section>

        {/* SECTION 11: JOIN SS CTA */}
        <section className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] text-center space-y-6">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">11 - Take Action</span>
          <h2 className="text-3xl font-extrabold text-[#2563EB]">Ready to Grow with SS?</h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Whether you want to discover opportunities, contribute as a volunteer, showcase your talent, or lead on your campus-SS is your home.
          </p>
          <div>
            <button
              onClick={onOpenJoinModal}
              className="px-8 py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm shadow-xl hover:bg-[#1D4ED8] transition-all inline-flex items-center gap-2 border border-[#2563EB]"
            >
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Join Struggle of Student</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
