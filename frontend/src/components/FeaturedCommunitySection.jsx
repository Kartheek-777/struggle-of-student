import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Code, BookOpen, Star, Users, 
  ArrowRight, ExternalLink, Calendar, User, Building2 
} from 'lucide-react';
import { getTalents, getProjects, getStories, getCommunityMembers } from '../services/api';

const FeaturedCommunitySection = () => {
  const [talents, setTalents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stories, setStories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      const [tRes, pRes, sRes, mRes] = await Promise.all([
        getTalents({ page_size: 3 }),
        getProjects({ page_size: 3 }),
        getStories({ page_size: 3 }),
        getCommunityMembers({ page_size: 4 }),
      ]);
      setTalents(tRes.data.results || tRes.data || []);
      setProjects(pRes.data.results || pRes.data || []);
      setStories(sRes.data.results || sRes.data || []);
      setMembers(mRes.data.results || mRes.data || []);
    } catch (err) {
      console.error("Failed to load featured community data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold uppercase tracking-wider mb-4 border border-[#E2E8F0]">
            <Sparkles size={14} className="text-[#2563EB]" /> Built By Students, For Future Engineers
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Discover Student Talent, Projects & Stories
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            SS is more than an opportunity portal — it's a living student dev ecosystem where creators, coders, and leaders showcase their work.
          </p>
        </div>

        {/* 1. TALENT SHOWCASE HIGHLIGHT */}
        {talents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Star className="text-[#2563EB]" size={22} /> Student Talent Showcase
                </h3>
                <p className="text-xs text-[#64748B]">System Design, Full-Stack Dev, AI, Open Source & More</p>
              </div>
              <Link
                to="/talent"
                className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
              >
                Explore Student Talent <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {talents.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-[#F8FAFC] rounded-2xl p-6 shadow-xs border border-[#E2E8F0] flex flex-col justify-between hover:shadow-md transition-shadow hover:border-[#2563EB]">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {t.profile_photo ? (
                        <img src={t.profile_photo} alt={t.student_name} className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-base shadow-xs">
                          {t.student_name?.charAt(0) || 'S'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-base">{t.student_name}</h4>
                        <span className="text-xs font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {t.category_name || 'Talent'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">
                      "{t.description}"
                    </p>
                  </div>
                  <Link
                    to={`/talent/${t.id}`}
                    className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                  >
                    View Profile <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. FEATURED PROJECTS */}
        {projects.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Code className="text-[#2563EB]" size={22} /> Featured Student Projects
                </h3>
                <p className="text-xs text-[#64748B]">Real apps, AI tools, and startups built by student innovators</p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
              >
                Explore All Projects <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="bg-[#F8FAFC] rounded-2xl p-6 shadow-xs border border-[#E2E8F0] flex flex-col justify-between hover:shadow-md transition-shadow hover:border-[#2563EB]">
                  <div>
                    <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      {proj.category_name || 'Project'}
                    </span>
                    <h4 className="font-extrabold text-[#0F172A] text-lg mt-3 mb-1">{proj.title}</h4>
                    <p className="text-xs text-[#64748B] mb-3">By {proj.owner_name}</p>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">{proj.short_description || proj.description}</p>
                  </div>
                  <Link
                    to={`/projects/${proj.id}`}
                    className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                  >
                    View Details <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. STUDENT STORIES & TESTIMONIALS */}
        {stories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-widest block mb-1">// VERIFIED TESTIMONIALS</span>
                <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <BookOpen className="text-[#2563EB]" size={22} /> Student Voices & Support
                </h3>
                <p className="text-xs text-[#64748B]">Hear directly from tech students who turned struggle into breakthroughs with community support.</p>
              </div>
              <Link
                to="/stories"
                className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
              >
                Read Student Stories <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.slice(0, 3).map((st) => (
                <div key={st.id} className="bg-[#F8FAFC] rounded-2xl p-6 shadow-xs border border-[#E2E8F0] flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                      {st.category_name || 'Experience'}
                    </span>
                    <h4 className="font-extrabold text-[#0F172A] text-base mt-3 mb-2 line-clamp-2">{st.title}</h4>
                    <p className="text-xs text-[#64748B] italic line-clamp-3 mb-4">"{st.excerpt || st.content}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F172A]">{st.author_name}</span>
                    <Link to={`/stories/${st.id}`} className="font-bold text-[#2563EB] hover:underline">
                      Read Story {'->'}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CAMPUS AMBASSADOR & COMMUNITY CALLOUT */}
        <div className="bg-[#EFF6FF] rounded-3xl p-8 sm:p-10 text-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-100">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-blue-200 shadow-2xs">
              <Building2 size={14} /> SS Campus Network
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 text-[#0F172A]">
              Become an SS Campus Ambassador
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Represent SS at your college, build leadership skills, connect with fellow student leads, and earn recognized community certificates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              to="/campus-ambassador"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold px-6 py-3 rounded-xl transition-colors text-sm text-center shadow-md w-full sm:w-auto"
            >
              Become a Campus Lead
            </Link>
            <Link
              to="/community"
              className="bg-white hover:bg-slate-50 text-[#0F172A] font-bold px-6 py-3 rounded-xl transition-colors text-sm text-center w-full sm:w-auto border border-slate-200 shadow-2xs"
            >
              Meet the Community
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCommunitySection;
