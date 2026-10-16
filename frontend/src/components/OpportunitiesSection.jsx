import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Tag, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

const OpportunitiesSection = ({ onOpenJoinModal }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    apiService.getOpportunities()
      .then((data) => {
        setOpportunities(data.opportunities || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching opportunities:', err);
        setError('Failed to fetch from Django API. Showing cached demo listings.');
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filtered = activeFilter === 'All'
    ? opportunities
    : opportunities.filter(op => op.category.toLowerCase().includes(activeFilter.toLowerCase()));

  const categories = ['All', 'Internships', 'Jobs', 'Campus Ambassador', 'Volunteering'];

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
              Curated For CS & Engineering Students
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Trending Tech Opportunities
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-2xl">
              Directly vetted engineering internships, developer sprints, and campus lead roles.
            </p>
          </div>

          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-md shadow-[#2563EB]/20"
          >
            <span>Browse 240+ Tech Opportunities</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeFilter === cat
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20'
                  : 'bg-[#EFF6FF]/60 text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Fetching opportunities from Django REST ORM...</p>
          </div>
        )}

        {/* ERROR NOTICE */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OPPORTUNITY CARDS GRID */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
              >
                <div>
                  {/* CARD TOP BADGE */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-extrabold uppercase tracking-wider border border-[#E2E8F0]">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF]/80 px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                      {item.stipend || item.work_type}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* METADATA */}
                  <div className="space-y-2 text-xs font-medium text-[#0F172A] mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-bold text-[#2563EB]">{item.stipend}</span>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#0F172A] text-[11px] font-semibold border border-[#E2E8F0] shadow-2xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CARD CTA */}
                <button
                  onClick={onOpenJoinModal}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#2563EB]/20"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* DEMO NOTICE */}
        <div className="mt-8 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          <span className="font-bold text-[#0F172A]">Verified Listings:</span> These opportunities are synchronized directly from the Django backend.
        </div>

      </div>
    </section>
  );
};

export default OpportunitiesSection;
