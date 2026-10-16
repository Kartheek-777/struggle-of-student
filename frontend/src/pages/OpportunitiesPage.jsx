import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  Search, Filter, MapPin, DollarSign, Calendar, Clock, 
  ArrowRight, Bookmark, BookmarkCheck, Sparkles, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';

const OpportunitiesPage = ({ onOpenJoinModal }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category');

  const [opportunities, setOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Sync category state whenever URL query string changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('All');
    }
  }, [urlCategory]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Unauth Prompt Modal
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('save');

  const fetchOpportunities = () => {
    setLoading(true);
    const params = {
      page,
      page_size: 9,
      search: search.trim(),
      category: selectedCategory,
      mode: selectedMode,
      experience: selectedExperience,
      status: selectedStatus,
    };

    apiService.getOpportunities(params)
      .then((res) => {
        setOpportunities(res.opportunities || []);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total_count || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities from Django API.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpportunities();
  }, [page, selectedCategory, selectedMode, selectedExperience, selectedStatus]);

  useEffect(() => {
    apiService.getOpportunityCategories()
      .then((res) => setCategories(res.categories || []))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedMode('All');
    setSelectedExperience('All');
    setSelectedStatus('All');
    setPage(1);
  };

  const handleSaveToggle = async (e, opp) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthPromptAction('save');
      setAuthPromptOpen(true);
      return;
    }

    try {
      if (opp.is_saved) {
        await apiService.unsaveOpportunity(opp.id);
      } else {
        await apiService.saveOpportunity(opp.id);
      }
      // Re-fetch to update local state
      fetchOpportunities();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <div className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] shadow-lg text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>SS Opportunity Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            What Opportunities Can You Get Through SS?
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] max-w-3xl mx-auto">
            Discover internships, jobs, campus ambassador leads, volunteering, workshops, and project collaborations designed for student growth.
          </p>
        </div>

        {/* SEARCH & FILTERS SECTION */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-lg space-y-6">
          
          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities by title, skill, organization, or location..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/40 shadow-md shrink-0"
            >
              Search
            </button>
          </form>

          {/* CATEGORY TABS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase">Categories:</span>
            <div className="flex flex-wrap items-center gap-2">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#2563EB] text-[#F8FAFC] shadow-md border border-[#2563EB]'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SECONDARY FILTER CONTROLS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <label className="block text-[11px] font-bold text-[#2563EB] uppercase mb-1">Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => { setSelectedMode(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Modes</option>
                <option value="Online">Online / Remote</option>
                <option value="Offline">Offline / On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2563EB] uppercase mb-1">Experience</label>
              <select
                value={selectedExperience}
                onChange={(e) => { setSelectedExperience(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2563EB] uppercase mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSING_SOON">Closing Soon</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full py-2 px-3 rounded-xl bg-[#F8FAFC] text-[#2563EB] font-bold text-xs border border-[#E2E8F0] hover:bg-[#2563EB]/10 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between text-xs font-bold text-[#64748B] px-1">
          <div>
            Showing <span className="text-[#2563EB]">{totalCount}</span> opportunities
          </div>
          <div>
            Page {page} of {totalPages}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Loading opportunities from Django MySQL...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-900 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && opportunities.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              
            </div>
            <h3 className="text-xl font-bold text-[#2563EB]">No opportunities match your current filters</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Try adjusting your search terms, selecting a different category, or clearing active filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* OPPORTUNITY CARDS GRID */}
        {!loading && opportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => {
              const statusClass = 
                opp.effective_status === 'CLOSED' ? 'bg-red-500/10 text-red-800 border-red-200' :
                opp.effective_status === 'CLOSING_SOON' ? 'bg-amber-500/10 text-amber-800 border-amber-200' :
                'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]';

              return (
                <div
                  key={opp.id}
                  className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-2xl transition-all group"
                >
                  <div>
                    {/* CARD TOP BADGES */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[11px] font-extrabold uppercase">
                        {opp.category}
                      </span>
                      
                      <button
                        onClick={(e) => handleSaveToggle(e, opp)}
                        className={`p-2 rounded-xl transition-colors ${
                          opp.is_saved 
                            ? 'bg-[#2563EB] text-white' 
                            : 'bg-[#F8FAFC] text-[#2563EB] hover:bg-[#2563EB]/10 border border-[#E2E8F0]'
                        }`}
                        title={opp.is_saved ? "Saved to profile" : "Save opportunity"}
                      >
                        {opp.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* ORG & TITLE */}
                    <div className="text-xs font-bold text-[#2563EB] uppercase mb-1">
                      {opp.organization_name}
                    </div>
                    <h3 className="text-xl font-extrabold text-[#2563EB] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {opp.title}
                    </h3>

                    {/* SHORT DESCRIPTION */}
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4 line-clamp-2">
                      {opp.short_description || opp.description}
                    </p>

                    {/* METADATA */}
                    <div className="space-y-2 text-xs font-medium text-[#0F172A] mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                        <span>{opp.location} ({opp.mode})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#2563EB]" />
                        <span className="font-bold text-[#2563EB]">{opp.stipend}</span>
                      </div>
                      {opp.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Deadline: {opp.application_deadline}</span>
                        </div>
                      )}
                    </div>

                    {/* SKILLS */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {opp.skills && opp.skills.length > 0 ? (
                        opp.skills.map((s) => (
                          <span key={s.id} className="px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#64748B] text-[11px] font-medium border border-[#E2E8F0]">
                            {s.name}
                          </span>
                        ))
                      ) : (
                        opp.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#64748B] text-[11px] font-medium border border-[#E2E8F0]">
                            {tag.trim()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${statusClass}`}>
                      {opp.effective_status}
                    </span>

                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 border border-[#2563EB]/30 shadow-sm"
                    >
                      <span>View Opportunity</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] disabled:opacity-40 text-[#2563EB] font-bold text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-bold text-[#2563EB]">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] disabled:opacity-40 text-[#2563EB] font-bold text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* AUTH PROMPT MODAL FOR UNAUTHENTICATED USERS */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              <Sparkles className="w-8 h-8 text-[#2563EB]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#2563EB]">Join SS to Access Features</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Log in or register your student account to save opportunities to your profile and submit applications.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm border border-[#2563EB]"
              >
                Join SS Community
              </Link>
              <Link
                to="/login"
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] font-bold text-xs"
              >
                Log In to Existing Account
              </Link>
            </div>

            <button
              onClick={() => setAuthPromptOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunitiesPage;
