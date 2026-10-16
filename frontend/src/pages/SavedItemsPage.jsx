import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Calendar, Briefcase, ArrowLeft, ExternalLink, Trash2, CheckCircle2
} from 'lucide-react';
import { getSavedItems, unsaveOpportunity } from '../services/api';

const SavedItemsPage = () => {
  const [savedOpps, setSavedOpps] = useState([]);
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getSavedItems();
      const data = res.data || res;
      setSavedOpps(data.saved_opportunities || []);
      setRegisteredSessions(data.registered_sessions || []);
    } catch (err) {
      console.error("Failed to load saved items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemoveSavedOpp = async (oppId) => {
    try {
      await unsaveOpportunity(oppId);
      setSavedOpps(prev => prev.filter(item => item.opportunity.id !== oppId));
    } catch (err) {
      console.error("Failed to unsave:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link 
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* TITLE BANNER */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-md">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">Saved & Registered Items</h1>
            <p className="text-xs text-gray-600 mt-1">
              Quick access to your bookmarked opportunities and confirmed session registrations.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white/50 rounded-3xl border border-[#E2E8F0]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#2563EB]">Loading saved items...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* SAVED OPPORTUNITIES */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#2563EB] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                <Briefcase className="w-5 h-5 text-[#2563EB]" />
                Saved Opportunities ({savedOpps.length})
              </h2>

              {savedOpps.length === 0 ? (
                <div className="p-6 text-center bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] text-xs text-gray-500">
                  No saved opportunities yet. Click the bookmark icon on any opportunity card to save it.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedOpps.map(item => (
                    <div key={item.id} className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-extrabold text-sm text-[#2563EB] block">{item.opportunity?.title}</span>
                        <p className="text-xs text-gray-600">{item.opportunity?.organization_name} - {item.opportunity?.location || 'Remote'}</p>
                        <span className="text-[10px] font-bold text-[#2563EB] inline-block">{item.opportunity?.opportunity_type}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                        <button
                          onClick={() => handleRemoveSavedOpp(item.opportunity.id)}
                          className="text-xs text-red-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                        <Link
                          to={`/opportunities/${item.opportunity.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-all flex items-center gap-1"
                        >
                          View & Apply {'->'}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CONFIRMED SESSIONS */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#2563EB] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                <Calendar className="w-5 h-5 text-[#2563EB]" />
                Registered Sessions & Webinars ({registeredSessions.length})
              </h2>

              {registeredSessions.length === 0 ? (
                <div className="p-6 text-center bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] text-xs text-gray-500">
                  No active session registrations.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registeredSessions.map(reg => (
                    <div key={reg.id} className="p-5 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#2563EB]">{reg.event?.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/15 text-[#2563EB] font-bold text-[10px]">
                            REGISTERED
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Speaker: {reg.event?.speaker_name || 'SS Team'}</p>
                        <p className="text-[11px] font-semibold text-gray-400">
                          {new Date(reg.event?.start_time).toLocaleString()}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <Link
                          to={`/sessions/${reg.event?.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-all"
                        >
                          View Session Details {'->'}</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SavedItemsPage;
