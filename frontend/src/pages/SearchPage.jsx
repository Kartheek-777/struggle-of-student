import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Briefcase, Calendar, Code, Star, Wrench, ArrowRight, ExternalLink, Sparkles
} from 'lucide-react';
import { globalSearch } from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const executeSearch = async (qText, cat) => {
    if (!qText.trim()) {
      setResults(null);
      setTotalCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await globalSearch({ q: qText, category: cat });
      const resData = res.data || res;
      setResults(resData.results || {});
      setTotalCount(resData.total_count || 0);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery, initialCat);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, category: activeCategory });
      executeSearch(query, activeCategory);
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (query.trim()) {
      setSearchParams({ q: query, category: cat });
      executeSearch(query, cat);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HERO SEARCH BANNER */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border-2 border-[#E2E8F0] shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB] text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            Unified SS Platform Search
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] tracking-tight">
            What are you looking for?
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Search across opportunities, events, webinars, student services, showcase projects, and community talent.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative pt-2">
            <Search className="w-5 h-5 text-[#2563EB] absolute left-4 top-1/2 -translate-y-1/2 pt-1" />
            <input
              type="text"
              placeholder="Search internships, events, speakers, tech stacks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border-2 border-[#2563EB]/30 text-sm font-semibold focus:outline-none focus:border-[#2563EB] shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 px-5 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-all border border-[#2563EB]/50"
            >
              Search
            </button>
          </form>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'opportunities', label: 'Opportunities' },
            { id: 'events', label: 'Events' },
            { id: 'sessions', label: 'Sessions & Webinars' },
            { id: 'services', label: 'SS Services' },
            { id: 'projects', label: 'Student Projects' },
            { id: 'talent', label: 'Talent Showcase' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2563EB] text-[#F8FAFC] shadow-md border border-[#2563EB]/40'
                  : 'bg-white/70 text-[#2563EB] hover:bg-white border border-[#E2E8F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* RESULTS SECTION */}
        {loading ? (
          <div className="p-12 text-center bg-white/50 rounded-3xl border border-[#E2E8F0]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#2563EB]">Searching SS database...</p>
          </div>
        ) : !results ? (
          <div className="p-12 text-center bg-[#FFFFFF] rounded-3xl border-2 border-dashed border-[#E2E8F0] text-gray-500 text-xs">
            Enter a search term above to explore opportunities, events, and community showcases.
          </div>
        ) : totalCount === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] rounded-3xl border-2 border-dashed border-[#E2E8F0] space-y-2">
            <h3 className="text-base font-bold text-[#2563EB]">No matching results found</h3>
            <p className="text-xs text-gray-500">Try adjusting your keywords or selecting "All Content".</p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs font-bold text-gray-600">Found {totalCount} matching results</p>

            {/* OPPORTUNITIES RESULTS */}
            {results.opportunities?.length > 0 && (
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2563EB]" />
                  Opportunities ({results.opportunities.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.opportunities.map(opp => (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] transition-all space-y-1 block"
                    >
                      <span className="font-extrabold text-sm text-[#2563EB] block">{opp.title}</span>
                      <p className="text-xs text-gray-600">{opp.organization_name} - {opp.location || 'Remote'}</p>
                      <span className="text-[10px] font-bold text-[#2563EB] inline-block pt-1">{opp.opportunity_type}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS & SESSIONS RESULTS */}
            {((results.events?.length > 0) || (results.sessions?.length > 0)) && (
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  Events & Sessions ({((results.events?.length || 0) + (results.sessions?.length || 0))})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...(results.events || []), ...(results.sessions || [])].map(ev => (
                    <Link
                      key={ev.id}
                      to={`/sessions/${ev.id}`}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] transition-all space-y-1 block"
                    >
                      <span className="font-extrabold text-sm text-[#2563EB] block">{ev.title}</span>
                      <p className="text-xs text-gray-600">{ev.event_type} - Speaker: {ev.speaker_name || 'SS Team'}</p>
                      <span className="text-[10px] text-gray-400 font-medium block pt-1">{new Date(ev.start_time).toLocaleDateString()}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES RESULTS */}
            {results.services?.length > 0 && (
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#2563EB]" />
                  SS Services ({results.services.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.services.map(srv => (
                    <Link
                      key={srv.id}
                      to={`/services/${srv.slug}`}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] transition-all space-y-1 block"
                    >
                      <span className="font-extrabold text-sm text-[#2563EB] block">{srv.title}</span>
                      <p className="text-xs text-gray-600 line-clamp-2">{srv.tagline}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS & TALENT RESULTS */}
            {((results.projects?.length > 0) || (results.talent?.length > 0)) && (
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#2563EB]" />
                  Community Projects & Talent Showcase
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(results.projects || []).map(p => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] transition-all space-y-1 block"
                    >
                      <span className="font-extrabold text-sm text-[#2563EB] block">Project: {p.title}</span>
                      <p className="text-xs text-gray-600 line-clamp-1">{p.tagline}</p>
                    </Link>
                  ))}
                  {(results.talent || []).map(t => (
                    <Link
                      key={t.id}
                      to={`/talent/${t.id}`}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] transition-all space-y-1 block"
                    >
                      <span className="font-extrabold text-sm text-[#2563EB] block">Talent: {t.headline}</span>
                      <p className="text-xs text-gray-600 line-clamp-1">{t.bio}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
