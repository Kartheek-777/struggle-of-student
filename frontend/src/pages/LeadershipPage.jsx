import React, { useState, useEffect } from 'react';
import {
  Users, Award, Calendar, MapPin, Clock,
  ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Send, X, Globe
} from 'lucide-react';
import { getLeadershipList, getLeadershipOpportunities, applyLeadershipOpportunity } from '../services/api';

const LinkedinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
);

const LeadershipPage = () => {
  const [leadershipData, setLeadershipData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyData, setApplyData] = useState({ statement_of_purpose: '', relevant_experience: '' });
  const [applySuccess, setApplySuccess] = useState(null);
  const [applyError, setApplyError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultLeadershipRoles = [
    {
      id: 101,
      title: 'Campus Lead & Ambassador',
      description: 'Lead SS initiatives, student meetups, and workshops on your college campus.',
      time_commitment: '3-5 hrs/week',
      location: 'Your College Campus'
    },
    {
      id: 102,
      title: 'Technical Project Mentor',
      description: 'Mentor junior engineering students in Web Development, Python, and AI/ML.',
      time_commitment: '4-6 hrs/week',
      location: 'Remote / Online'
    },
    {
      id: 103,
      title: 'Event Operations Coordinator',
      description: 'Help manage and organize SS hackathons, tech bootcamps, and live Zoom webinars.',
      time_commitment: '2-4 hrs/week',
      location: 'Hybrid'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadRes, oppRes] = await Promise.allSettled([
        getLeadershipList(),
        getLeadershipOpportunities()
      ]);

      if (leadRes.status === 'fulfilled') {
        setLeadershipData(leadRes.value.data);
      }
      if (oppRes.status === 'fulfilled') {
        const val = oppRes.value.data;
        if (Array.isArray(val)) {
          setOpportunities(val);
        } else if (Array.isArray(val?.results)) {
          setOpportunities(val.results);
        } else if (Array.isArray(val?.opportunities)) {
          setOpportunities(val.opportunities);
        } else {
          setOpportunities([]);
        }
      }
    } catch (err) {
      setError("Failed to load leadership data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (opp) => {
    const token = localStorage.getItem('access') || localStorage.getItem('ss_access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setSelectedOpp(opp);
    setApplyData({ statement_of_purpose: '', relevant_experience: '' });
    setApplyError(null);
    setApplySuccess(null);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError(null);

    try {
      await applyLeadershipOpportunity(selectedOpp.id, applyData);
      setApplySuccess("Your leadership application has been submitted successfully!");
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(null);
      }, 2000);
    } catch (err) {
      setApplyError(err.response?.data?.detail || "Failed to submit application. You may have already applied.");
    } finally {
      setSubmitting(false);
    }
  };

  const defaultFounder = {
    name: 'Chanti Nelatalli',
    designation: 'Founder & CEO',
    email: 'chantidepavath@gmail.com',
    phone: '+91 98496 03265',
    linkedin_url: 'https://www.linkedin.com/in/chanti-nelatalli-6b592932a/',
    photo_display: '/assets/founder_chanti.jpg',
    bio: 'Founder and CEO of Struggle of Student (SS). Dedicated to building an empowered student community across India by offering authentic opportunities, career guidance, and skill development.',
    vision_statement: 'To bridge the gap between education and career growth for every passionate student across engineering and degree colleges.',
    quote: 'Empowering students to transform struggles into opportunities.'
  };

  const rawFounder = leadershipData?.founder;
  const founder = {
    name: 'Chanti Nelatalli',
    designation: 'Founder & CEO',
    email: 'chantidepavath@gmail.com',
    phone: '+91 98496 03265',
    linkedin_url: 'https://www.linkedin.com/in/chanti-nelatalli-6b592932a/',
    photo_display: '/assets/founder_chanti.jpg',
    bio: rawFounder?.bio || defaultFounder.bio,
    vision_statement: rawFounder?.vision_statement || defaultFounder.vision_statement,
    quote: rawFounder?.quote || defaultFounder.quote,
  };

  const directors = leadershipData?.directors || [];
  const coreLeadership = leadershipData?.core_leadership || [];
  const teamLeads = leadershipData?.team_leads || [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-16">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2563EB]/20">
            <Users size={14} className="text-[#2563EB]" /> SS Leadership Council
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Our Leadership
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Meet the people helping build and grow the SS community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* FOUNDER SECTION */}
            {founder && (
              <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border-2 border-[#2563EB] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-52 h-64 sm:w-60 sm:h-72 rounded-3xl overflow-hidden border-4 border-[#2563EB] shadow-xl bg-[#F8FAFC]">
                    <img 
                      src={founder.photo_display || "/assets/founder_chanti.jpg"} 
                      alt={founder.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-block px-3 py-1 bg-[#1D4ED8]/20 text-[#2563EB] font-bold text-xs rounded-md uppercase tracking-wider">
                    Meet Our Founder & CEO
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#2563EB]">{founder.name}</h2>
                  <p className="text-sm font-bold text-[#2563EB]">{founder.designation}</p>

                  {founder.bio && (
                    <p className="text-sm text-gray-700 leading-relaxed">{founder.bio}</p>
                  )}

                  {founder.vision_statement && (
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <h4 className="text-xs font-bold text-[#2563EB] uppercase">Vision for SS</h4>
                      <p className="text-xs text-gray-700 mt-1">{founder.vision_statement}</p>
                    </div>
                  )}

                  {founder.quote && (
                    <blockquote className="border-l-4 border-[#2563EB] pl-4 italic text-sm text-[#2563EB]">
                      "{founder.quote}"
                    </blockquote>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                    {founder.linkedin_url && (
                      <a href={founder.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white hover:bg-[#084e96] transition">
                        <LinkedinIcon className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    {founder.email && (
                      <a href={`mailto:${founder.email}`} className="text-[#2563EB] hover:underline font-bold">
                        {founder.email}
                      </a>
                    )}
                    {founder.phone && (
                      <a href={`tel:${founder.phone.replace(/\s+/g, '')}`} className="text-[#2563EB] hover:underline font-bold">
                        Phone: {founder.phone}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* DIRECTORS SECTION */}
            {directors.length > 0 && (
              <section className="space-y-6">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-2xl font-extrabold text-[#2563EB]">Directors</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {directors.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] flex flex-col sm:flex-row gap-6 items-start">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#2563EB] shrink-0">
                        <img src={member.photo_display || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-xl font-bold text-[#2563EB]">{member.name}</h4>
                        <p className="text-xs font-semibold text-[#2563EB]">{member.designation}</p>
                        <p className="text-xs text-gray-600 line-clamp-3">{member.bio}</p>
                        {member.area_of_responsibility && (
                          <div className="text-[11px] text-gray-500 font-medium">
                            <strong>Responsibility:</strong> {member.area_of_responsibility}
                          </div>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="inline-block text-[#2563EB] hover:text-[#2563EB] mt-2">
                            <LinkedinIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CORE LEADERSHIP SECTION */}
            {coreLeadership.length > 0 && (
              <section className="space-y-6">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-2xl font-extrabold text-[#2563EB]">Core Leadership</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coreLeadership.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] text-center space-y-3">
                      <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-[#2563EB]">
                        <img src={member.photo_display || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-lg font-bold text-[#2563EB]">{member.name}</h4>
                      <p className="text-xs font-semibold text-[#2563EB]">{member.designation}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TEAM LEADS SECTION */}
            {teamLeads.length > 0 && (
              <section className="space-y-6">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-2xl font-extrabold text-[#2563EB]">Team Leads</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {teamLeads.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] space-y-2">
                      <h4 className="text-base font-bold text-[#2563EB]">{member.name}</h4>
                      <p className="text-xs font-semibold text-[#2563EB]">{member.designation}</p>
                      <p className="text-xs text-gray-600">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* OPEN LEADERSHIP ROLES */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] space-y-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Join Leadership</span>
            <h2 className="text-3xl font-extrabold text-[#2563EB]">Student Leadership Opportunities</h2>
            <p className="text-gray-600 text-sm">Apply to lead SS campus chapters, tech initiatives, and student projects.</p>
          </div>

          {(() => {
            const oppList = Array.isArray(opportunities) && opportunities.length > 0 ? opportunities : defaultLeadershipRoles;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {oppList.map((opp) => (
                  <div key={opp.id} className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2E8F0] flex flex-col justify-between space-y-4 shadow-sm hover:border-[#2563EB] transition-all">
                    <div>
                      <h4 className="font-bold text-[#2563EB] text-lg">{opp.title}</h4>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-3">{opp.description}</p>
                      <div className="mt-4 space-y-1 text-xs text-gray-500">
                        <p><strong>Commitment:</strong> {opp.time_commitment || 'Part-time'}</p>
                        <p><strong>Location:</strong> {opp.location || 'Remote / Campus'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenApplyModal(opp)}
                      className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Apply for Role</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* APPLICATION MODAL */}
        {showApplyModal && selectedOpp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-xl">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">Apply for {selectedOpp.title}</h2>
              <p className="text-xs text-gray-500 mb-6">SS Leadership Application</p>

              {applySuccess ? (
                <div className="bg-[#2563EB]/10 border border-[#E2E8F0] text-[#2563EB] p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={24} className="shrink-0 text-[#2563EB]" />
                  <span className="text-sm font-semibold">{applySuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {applyError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold">
                      {applyError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Why do you want to lead this initiative? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={applyData.statement_of_purpose}
                      onChange={(e) => setApplyData({ ...applyData, statement_of_purpose: e.target.value })}
                      placeholder="Share your vision and motivation..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Relevant Leadership / Project Experience
                    </label>
                    <textarea
                      rows={3}
                      value={applyData.relevant_experience}
                      onChange={(e) => setApplyData({ ...applyData, relevant_experience: e.target.value })}
                      placeholder="Briefly highlight past roles or campus involvement..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none text-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] flex items-center gap-1.5"
                    >
                      <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeadershipPage;
