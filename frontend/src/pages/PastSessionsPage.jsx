import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  Play, Calendar, Clock, Video, Award, CheckCircle2, 
  ArrowRight, Loader2, AlertCircle, Sparkles 
} from 'lucide-react';

const PastSessionsPage = () => {
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getSessions({ past: 'true' })
      .then((res) => {
        setPastSessions(res.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching past sessions:', err);
        setError('Failed to load past sessions.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-10">
        
        {/* HERO */}
        <div className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl p-8 sm:p-12 border-2 border-[#E2E8F0] shadow-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest border border-[#2563EB]/30">
            <Play className="w-4 h-4 text-[#2563EB]" />
            <span>SS Past Sessions Archive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Past Sessions & Session Recordings
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] max-w-3xl leading-relaxed">
            Missed a live session? Access completed workshops, technical webinars, and session recordings to learn at your own pace.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Loading past session recordings...</p>
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
        {!loading && pastSessions.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-[#2563EB]">No completed session recordings archived yet</h3>
            <p className="text-xs text-[#64748B]">Check out our upcoming live sessions and workshops.</p>
            <Link
              to="/sessions"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
            >
              Explore Upcoming Sessions
            </Link>
          </div>
        )}

        {/* CARDS GRID */}
        {!loading && pastSessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastSessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-2xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-[10px] font-extrabold uppercase">
                      Completed Session
                    </span>
                    
                    {sess.recording_url ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-extrabold uppercase border border-[#E2E8F0] flex items-center gap-1">
                        <Play className="w-3 h-3 text-[#2563EB]" />
                        Recording Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-semibold">Recording Processing</span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-[#2563EB] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {sess.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed mb-4 line-clamp-2">
                    {sess.short_description || sess.description}
                  </p>

                  <div className="space-y-1.5 text-xs font-medium text-gray-700 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>Held on: {new Date(sess.start_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {sess.speakers && sess.speakers.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                        <span>Speaker: {sess.speakers[0].name} ({sess.speakers[0].organization})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <Link
                    to={`/sessions/${sess.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#2563EB] hover:bg-[#2563EB]/10 border border-[#E2E8F0]"
                  >
                    View Details
                  </Link>

                  {sess.recording_url ? (
                    <a
                      href={sess.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] flex items-center gap-1.5 shadow-sm border border-[#2563EB]/40"
                    >
                      <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Watch Recording</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-semibold">No Recording</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PastSessionsPage;
