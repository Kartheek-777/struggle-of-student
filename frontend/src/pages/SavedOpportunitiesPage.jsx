import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { BookmarkCheck, Trash2, ArrowRight, MapPin, DollarSign, Loader2, Sparkles } from 'lucide-react';

const SavedOpportunitiesPage = () => {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    setLoading(true);
    apiService.getSavedOpportunities()
      .then((res) => {
        setSavedList(res.saved_opportunities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (id) => {
    try {
      await apiService.unsaveOpportunity(id);
      fetchSaved();
    } catch (err) {
      console.error('Error unsaving:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-8 border-4 border-[#2563EB] shadow-xl flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] text-[#2563EB] text-xs font-bold uppercase">
              <BookmarkCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Saved Items</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
              Saved Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-gray-200">
              Opportunities you've bookmarked to review or apply to later.
            </p>
          </div>

          <div className="text-right font-extrabold text-2xl text-[#2563EB]">
            {savedList.length} <span className="text-xs font-semibold text-gray-300 block">Saved</span>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <p className="text-xs font-semibold text-[#64748B]">Loading saved opportunities...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && savedList.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4">
            <BookmarkCheck className="w-16 h-16 text-[#2563EB]/30 mx-auto" />
            <h3 className="text-xl font-bold text-[#2563EB]">You haven't saved any opportunities yet</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Explore the SS Opportunities directory and click the bookmark button to save items to your personal list.
            </p>
            <Link to="/opportunities" className="inline-block px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs">
              Explore Opportunities Directory
            </Link>
          </div>
        )}

        {/* SAVED CARDS GRID */}
        {!loading && savedList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((item) => {
              const opp = item.opportunity;
              if (!opp) return null;

              return (
                <div key={item.id} className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-extrabold uppercase">
                        {opp.category}
                      </span>
                      <button
                        onClick={() => handleUnsave(opp.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-[#2563EB] uppercase mb-1">{opp.organization_name}</div>
                    <h3 className="text-lg font-bold text-[#2563EB] mb-2">{opp.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-4 line-clamp-2">{opp.short_description || opp.description}</p>

                    <div className="space-y-1 text-xs text-[#0F172A] mb-4">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> {opp.location}</div>
                      <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#2563EB]" /> {opp.stipend}</div>
                    </div>
                  </div>

                  <Link
                    to={`/opportunities/${opp.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>View Opportunity</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedOpportunitiesPage;
