import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  Video, Calendar, Clock, MapPin, CheckCircle2, Play, Star, 
  X, AlertCircle, Loader2, RefreshCw, MessageSquare, ArrowRight 
} from 'lucide-react';

const MySessionsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('upcoming');

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [whatLearned, setWhatLearned] = useState('');
  const [whatLiked, setWhatLiked] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const fetchMySessions = () => {
    setLoading(true);
    apiService.getStudentSessions()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching student sessions:', err);
        setError('Failed to load your registered sessions.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMySessions();
  }, []);

  const handleCancelRegistration = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this session registration?")) return;
    try {
      await apiService.cancelSessionRegistration(sessionId);
      fetchMySessions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
  };

  const handleOpenFeedback = (sessionObj) => {
    setFeedbackSession(sessionObj);
    setRating(5);
    setWhatLearned('');
    setWhatLiked('');
    setSuggestions('');
    setFeedbackSuccess('');
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackSession) return;

    setSubmittingFeedback(true);
    try {
      const res = await apiService.submitSessionFeedback(feedbackSession.id, {
        rating,
        what_did_you_learn: whatLearned,
        what_did_you_like: whatLiked,
        suggestions
      });
      setFeedbackSuccess(res.message || 'Feedback submitted!');
      setSubmittingFeedback(false);
      setTimeout(() => {
        setFeedbackModalOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading your registered sessions...</p>
      </div>
    );
  }

  const nextSession = data?.next_session;
  const upcomingList = data?.upcoming || [];
  const pastList = data?.past || [];
  const cancelledList = data?.cancelled || [];
  const waitlistList = data?.waitlist || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#2563EB] tracking-tight">My Sessions & Workshops</h1>
            <p className="text-xs font-semibold text-[#64748B]">Manage your registered live sessions, access meeting links, and submit feedback.</p>
          </div>

          <Link
            to="/sessions"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs shadow-md border border-[#2563EB] flex items-center gap-2"
          >
            <span>Discover More Sessions</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </Link>
        </div>

        {/* NEXT UPCOMING SESSION CARD (FEATURED) */}
        {nextSession && (
          <div className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-6 sm:p-8 border-4 border-[#2563EB] shadow-2xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-wider">
                NEXT UPCOMING SESSION
              </span>

              <span className="text-xs font-bold text-gray-300">
                {new Date(nextSession.event.start_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">{nextSession.event.title}</h2>
              <p className="text-xs text-gray-200 line-clamp-2">{nextSession.event.short_description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-200">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>{new Date(nextSession.event.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#2563EB]" />
                  <span>{nextSession.event.mode} ({nextSession.event.meeting_provider || 'Online'})</span>
                </div>
              </div>

              {nextSession.event.meeting_url_protected ? (
                <a
                  href={nextSession.event.meeting_url_protected}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-black text-xs hover:bg-[#2563EB] transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Session Now</span>
                </a>
              ) : (
                <span className="text-xs text-amber-300 font-bold bg-black/20 px-3 py-1.5 rounded-lg border border-amber-300/30">
                  Meeting link activates prior to start time
                </span>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#FFFFFF] text-gray-700 hover:bg-[#2563EB]/10'
            }`}
          >
            Registered Upcoming ({upcomingList.length})
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'waitlist' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#FFFFFF] text-gray-700 hover:bg-[#2563EB]/10'
            }`}
          >
            Waitlist ({waitlistList.length})
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'past' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#FFFFFF] text-gray-700 hover:bg-[#2563EB]/10'
            }`}
          >
            Completed ({pastList.length})
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cancelled' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#FFFFFF] text-gray-700 hover:bg-[#2563EB]/10'
            }`}
          >
            Cancelled ({cancelledList.length})
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingList.length === 0 ? (
              <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-3">
                <p className="text-sm font-bold text-[#2563EB]">No upcoming registered sessions</p>
                <Link to="/sessions" className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
                  Discover Live Sessions
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingList.map((item) => (
                  <div key={item.id} className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-extrabold uppercase">
                        Registered
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {new Date(item.event.start_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2563EB]">{item.event.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.event.short_description}</p>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <button
                        onClick={() => handleCancelRegistration(item.event.id)}
                        className="text-xs font-bold text-red-700 hover:underline"
                      >
                        Cancel Registration
                      </button>

                      {item.event.meeting_url_protected ? (
                        <a
                          href={item.event.meeting_url_protected}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Join Session</span>
                        </a>
                      ) : (
                        <Link
                          to={`/sessions/${item.event.id}`}
                          className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs"
                        >
                          View Session
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="space-y-4">
            {waitlistList.length === 0 ? (
              <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-2">
                <p className="text-sm font-bold text-[#2563EB]">You are not on any waitlist</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {waitlistList.map((wl) => (
                  <div key={wl.id} className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-extrabold uppercase">
                        Waitlist Position #{wl.position}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2563EB]">{wl.event.title}</h3>
                    <p className="text-xs text-gray-600">If a seat opens up, you will be promoted automatically.</p>

                    <Link to={`/sessions/${wl.event.id}`} className="inline-block text-xs font-bold text-[#2563EB] hover:underline">
                      View Session Details {'->'}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastList.length === 0 ? (
              <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center">
                <p className="text-sm font-bold text-[#2563EB]">No completed sessions yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastList.map((item) => (
                  <div key={item.id} className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-[10px] font-extrabold uppercase">
                        Completed
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2563EB]">{item.event.title}</h3>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <button
                        onClick={() => handleOpenFeedback(item.event)}
                        className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Submit Feedback</span>
                      </button>

                      <Link to={`/sessions/${item.event.id}`} className="text-xs font-bold text-[#2563EB] hover:underline">
                        View Details {'->'}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelledList.length === 0 ? (
              <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center">
                <p className="text-sm font-bold text-[#2563EB]">No cancelled registrations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cancelledList.map((item) => (
                  <div key={item.id} className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 space-y-2 opacity-60">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase">
                      Cancelled
                    </span>
                    <h3 className="text-lg font-bold text-[#2563EB]">{item.event.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SESSION FEEDBACK MODAL */}
      {feedbackModalOpen && feedbackSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-xl">
                <Star className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-black text-[#2563EB]">Submit Session Feedback</h3>
              <p className="text-xs text-[#64748B]">{feedbackSession.title}</p>
            </div>

            {feedbackSuccess ? (
              <div className="p-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-bold text-center">
                {feedbackSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Session Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-2 rounded-xl text-lg font-bold transition-all ${rating >= s ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-gray-400 border'}`}
                      >
                        * {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">What did you learn?</label>
                  <textarea
                    rows={2}
                    value={whatLearned}
                    onChange={(e) => setWhatLearned(e.target.value)}
                    placeholder="Key takeaways from this session..."
                    className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Suggestions for future workshops</label>
                  <textarea
                    rows={2}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="Any topics or speakers you'd like to see next?"
                    className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold shadow-md border border-[#2563EB] flex items-center justify-center gap-2"
                >
                  {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Feedback'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default MySessionsPage;
