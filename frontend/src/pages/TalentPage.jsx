import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Search, Filter, Camera, Music, Code, Palette, 
  Video, Mic, Feather, Trophy, ArrowRight, ExternalLink, RefreshCw, AlertCircle, Plus 
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TalentPage = () => {
  const { isAuthenticated } = useAuth();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    'All', 'Photography', 'Design', 'Coding', 'Music', 'Singing', 'Dance', 
    'Videography', 'Writing', 'Poetry', 'Art', 'Public Speaking', 
    'Content Creation', 'Entrepreneurship', 'Sports', 'Other'
  ];

  const fetchTalents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: 12 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await apiService.getTalents(params);
      if (res.success) {
        setTalents(res.talents || []);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total_count || 0);
      } else {
        setError(res.message || 'Failed to load talent profiles.');
      }
    } catch (err) {
      console.error('Error fetching talents:', err);
      setError('Unable to load talent profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [search, selectedCategory, page]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* HERO HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/40 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>SS Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2563EB] tracking-tight">
            Student Talent
          </h1>
          <p className="text-base sm:text-lg text-[#0F172A]/80 font-medium">
            Discover the creativity, skills and talent of students in the SS community.
          </p>
          {isAuthenticated && (
            <div className="pt-2">
              <Link
                to="/student/talent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-xs shadow-md hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]"
              >
                <Plus className="w-4 h-4 text-[#2563EB]" />
                <span>Showcase Your Talent</span>
              </Link>
            </div>
          )}
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2563EB]/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search talent profiles by skill, student name, or title..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] placeholder-[#0F172A]/50 focus:outline-none focus:border-[#2563EB] text-sm font-medium transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-[#F8FAFC] shadow'
                    : 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] pt-2 border-t border-[#E2E8F0]">
            <span>Showing {totalCount} talent profiles</span>
            {(search || selectedCategory !== 'All') && (
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All'); setPage(1); }}
                className="text-[#2563EB] hover:underline font-extrabold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white border-2 border-[#E2E8F0] rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-800">{error}</h3>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && talents.length === 0 && (
          <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <Sparkles className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-xl font-extrabold text-[#2563EB]">No talent profiles found</h3>
            <p className="text-sm text-[#0F172A]/70 font-medium">Be the first to showcase your skill to the SS student community!</p>
            {isAuthenticated && (
              <Link
                to="/student/talent"
                className="inline-block px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold border border-[#2563EB]"
              >
                Add Your Talent
              </Link>
            )}
          </div>
        )}

        {/* TALENT CARDS GRID */}
        {!loading && !error && talents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map((talent) => (
              <div
                key={talent.id}
                className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#2563EB] transition-all group"
              >
                <div className="space-y-4">
                  {/* STUDENT INFO HEADER */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-bold text-base uppercase overflow-hidden border-2 border-[#2563EB]/50">
                      {talent.student_photo ? (
                        <img src={talent.student_photo} alt={talent.student_name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{talent.student_name?.charAt(0) || 'S'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2563EB] group-hover:text-[#2563EB] transition-colors leading-tight">
                        {talent.student_name}
                      </h3>
                      <p className="text-xs text-[#0F172A]/70 font-medium">{talent.college || 'Student'}</p>
                    </div>
                  </div>

                  {/* TALENT TITLE & BADGE */}
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] uppercase">
                      {talent.category}
                    </span>
                    <h4 className="text-lg font-extrabold text-[#2563EB] mt-2 leading-snug">
                      {talent.title}
                    </h4>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="text-xs text-[#0F172A]/80 leading-relaxed font-medium line-clamp-3">
                    {talent.short_description}
                  </p>

                  {/* SKILL TAGS */}
                  {talent.skills && talent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {talent.skills.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFFFFF] border border-[#E2E8F0] text-[#2563EB]">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CARD FOOTER CTA */}
                <div className="pt-6">
                  <Link
                    to={`/talent/${talent.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs shadow hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/50"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB]" />
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

export default TalentPage;
