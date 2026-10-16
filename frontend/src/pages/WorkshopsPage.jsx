import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  BookOpen, Calendar, Clock, Video, CheckCircle2, ArrowRight, 
  Sparkles, Loader2, AlertCircle, Code, Award, Users, Layers
} from 'lucide-react';

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Technology', 'Career', 'Communication', 'Leadership', 
    'Design', 'AI/ML', 'Web Development', 'Interview Preparation'
  ];

  useEffect(() => {
    setLoading(true);
    const params = {
      session_type: 'WORKSHOP',
      past: 'false'
    };

    apiService.getSessions(params)
      .then((res) => {
        setWorkshops(res.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workshops:', err);
        setError('Failed to load workshops.');
        setLoading(false);
      });
  }, []);

  const filteredWorkshops = selectedCategory === 'All' 
    ? workshops 
    : workshops.filter(w => 
        w.topics?.toLowerCase().includes(selectedCategory.toLowerCase()) || 
        w.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-10">
        
        {/* HERO SECTION */}
        <div className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] shadow-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest border border-[#2563EB]/30">
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>SS Workshop Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Hands-on Technical & Career Workshops
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] max-w-3xl leading-relaxed">
            Level up your technical stack and career readiness with practical masterclasses led by industry engineers and SS mentors.
          </p>
        </div>

        {/* WORKSHOP CATEGORIES */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-md space-y-3">
          <span className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider block">Workshop Categories:</span>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Loading upcoming workshops...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-900 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* WORKSHOP CARDS GRID */}
        {!loading && filteredWorkshops.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-[#2563EB]">No workshops found for category "{selectedCategory}"</h3>
            <p className="text-xs text-[#64748B]">New workshops are announced weekly. Reset filters to see all available workshops.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && filteredWorkshops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((w) => (
              <div
                key={w.id}
                className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-2xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-extrabold uppercase">
                      {w.category}
                    </span>
                    <span className="text-[11px] font-bold text-[#2563EB]">
                      {w.registered_count} / {w.participant_capacity} Registered
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#2563EB] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {w.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed mb-4 line-clamp-2">
                    {w.short_description || w.description}
                  </p>

                  {/* WHAT YOU WILL LEARN */}
                  {w.what_you_will_learn && (
                    <div className="mb-4 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold text-[#2563EB] uppercase block">What You'll Learn:</span>
                      <p className="text-[11px] text-[#0F172A] line-clamp-2 leading-tight">{w.what_you_will_learn}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs font-medium text-gray-700 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{new Date(w.start_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>{new Date(w.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    to={`/sessions/${w.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs text-center hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 shadow-sm border border-[#2563EB]/30"
                  >
                    <span>View Workshop & Register</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WorkshopsPage;
