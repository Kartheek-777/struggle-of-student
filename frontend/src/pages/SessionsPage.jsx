import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  Video, Calendar, Clock, MapPin, Users, Sparkles, Search, Filter, 
  ArrowRight, CheckCircle2, AlertCircle, Loader2, RefreshCw, Star, Play, X
} from 'lucide-react';

const SessionsPage = ({ onOpenJoinModal }) => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = searchParams.get('type') || 'All';
  const urlCategory = searchParams.get('category') || 'All';

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(urlType);
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Registration Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const fetchSessions = () => {
    setLoading(true);
    const params = {
      search: search.trim(),
      session_type: selectedType === 'All' ? '' : selectedType,
      category: urlCategory === 'All' ? '' : urlCategory,
      mode: selectedMode === 'All' ? '' : selectedMode,
      availability: selectedAvailability === 'All' ? '' : selectedAvailability,
      past: 'false'
    };

    apiService.getSessions(params)
      .then((res) => {
        setSessions(res.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sessions:', err);
        setError('Failed to load online sessions.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedType, selectedMode, selectedAvailability, urlCategory]);

  useEffect(() => {
    if (urlType) setSelectedType(urlType);
  }, [urlType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions();
  };

  const handleRegisterClick = (session) => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    setSelectedSession(session);
    setConfirmModalOpen(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedSession) return;
    setSubmitting(true);
    setActionSuccessMessage('');

    try {
      if (selectedSession.is_full) {
        // Join Waitlist
        const res = await apiService.joinSessionWaitlist(selectedSession.id);
        setActionSuccessMessage(res.message || "You're on the waitlist!");
      } else {
        // Regular Register
        const res = await apiService.registerSession(selectedSession.id);
        setActionSuccessMessage(res.message || "You're registered!");
      }
      setSubmitting(false);
      setTimeout(() => {
        setConfirmModalOpen(false);
        fetchSessions();
      }, 1800);
    } catch (err) {
      console.error('Error registering:', err);
      setError(err.response?.data?.message || 'Failed to complete registration.');
      setSubmitting(false);
    }
  };

  const handleCancelRegistration = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;
    try {
      await apiService.cancelSessionRegistration(sessionId);
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
  };

  const sessionTypes = [
    { label: 'All Sessions', value: 'All' },
    { label: 'Workshops', value: 'WORKSHOP' },
    { label: 'Webinars', value: 'WEBINAR' },
    { label: 'Technical Sessions', value: 'TECHNICAL_SESSION' },
    { label: 'Career Sessions', value: 'CAREER_SESSION' },
    { label: 'Community Sessions', value: 'COMMUNITY_SESSION' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-10">
        
        {/* PAGE HERO HEADER */}
        <div className="bg-[#FFFFFF] text-[#0F172A] rounded-3xl p-8 sm:p-14 border-2 border-[#E2E8F0] shadow-lg relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest border border-[#2563EB]/30">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>SS Online Sessions & Workshops</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">
            Learn. Connect. Grow.
          </h1>

          <p className="text-base sm:text-xl text-[#64748B] max-w-3xl leading-relaxed">
            Join workshops, online live sessions, and interactive masterclasses designed to help students learn practical skills and build real careers.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/workshops"
              className="px-6 py-3 rounded-2xl bg-[#2563EB] text-white font-extrabold text-xs sm:text-sm hover:bg-[#1D4ED8] transition-colors shadow-md flex items-center gap-2"
            >
              <span>Explore Workshops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sessions/past"
              className="px-6 py-3 rounded-2xl bg-[#F8FAFC] text-[#0F172A] font-bold text-xs sm:text-sm hover:bg-[#E2E8F0]/50 transition-colors border border-[#E2E8F0] flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-[#2563EB]" />
              <span>Watch Past Recordings</span>
            </Link>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-lg space-y-6">
          
          {/* SEARCH FIELD */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions by topic, speaker, tech stack, or keyword..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/40 shadow-md shrink-0"
            >
              Search Sessions
            </button>
          </form>

          {/* TYPE FILTER TABS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase">Session Type:</span>
            <div className="flex flex-wrap items-center gap-2">
              {sessionTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedType === type.value
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#2563EB]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECONDARY MODE & SEAT AVAILABILITY CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <label className="block text-[11px] font-bold text-[#2563EB] uppercase mb-1">Session Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Modes (Online, Offline, Hybrid)</option>
                <option value="Online">Online Sessions / Zoom</option>
                <option value="Offline">Offline / Venue</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2563EB] uppercase mb-1">Seat Availability</label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Availability</option>
                <option value="available">Seats Available</option>
                <option value="full">Session Full / Waitlist Open</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedType('All');
                  setSelectedMode('All');
                  setSelectedAvailability('All');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] text-[#2563EB] font-bold text-xs border border-[#E2E8F0] hover:bg-[#2563EB]/10 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>

        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Fetching upcoming sessions & workshops...</p>
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
        {!loading && sessions.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              
            </div>
            <h3 className="text-xl font-bold text-[#2563EB]">No upcoming sessions found</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              No sessions match your search criteria. Check past recordings or reset filters.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedType('All'); setSelectedMode('All'); }}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs"
            >
              View All Sessions
            </button>
          </div>
        )}

        {/* SESSION CARDS GRID */}
        {!loading && sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((sess) => {
              const startDate = new Date(sess.start_datetime);
              const formattedDate = startDate.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              });
              const formattedTime = startDate.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit', hour12: true
              });

              const isRegistered = sess.is_registered;
              const isWaitlisted = sess.is_waitlisted;
              const isFull = sess.is_full;

              const modeBadgeClass = 
                sess.mode === 'Online' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' :
                sess.mode === 'Offline' ? 'bg-blue-500/10 text-blue-800 border-blue-200' :
                'bg-purple-500/10 text-purple-800 border-purple-200';

              return (
                <div
                  key={sess.id}
                  className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  {/* TOP BADGES */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#2563EB] text-[#F8FAFC] text-[10px] font-extrabold uppercase tracking-wider">
                        {sess.session_type?.replace('_', ' ') || sess.category}
                      </span>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${modeBadgeClass}`}>
                        {sess.mode === 'Online' ? 'Online Session' : sess.mode === 'Offline' ? `Venue: ${sess.location}` : 'Hybrid'}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-extrabold text-[#2563EB] mb-3 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {sess.title}
                    </h3>

                    {/* SHORT DESCRIPTION */}
                    <p className="text-xs text-[#64748B] leading-relaxed mb-6 line-clamp-2">
                      {sess.short_description || sess.description}
                    </p>

                    {/* SPEAKERS / HOST */}
                    {sess.speakers && sess.speakers.length > 0 && (
                      <div className="mb-6 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-[#2563EB]">
                          {sess.speakers[0].name.charAt(0)}
                        </div>
                        <div className="text-xs">
                          <p className="font-extrabold text-[#2563EB] line-clamp-1">{sess.speakers[0].name}</p>
                          <p className="text-[10px] font-semibold text-gray-500 line-clamp-1">{sess.speakers[0].designation} - {sess.speakers[0].organization}</p>
                        </div>
                      </div>
                    )}

                    {/* METADATA */}
                    <div className="space-y-2 text-xs font-medium text-[#0F172A] mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#2563EB]" />
                        <span>{formattedTime} IST</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#2563EB]" />
                        <span>{sess.meeting_provider || 'Online Link'}</span>
                      </div>
                    </div>

                    {/* SEAT CAPACITY BAR */}
                    <div className="space-y-1.5 mb-6">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-[#2563EB]">
                        <span>Seats Capacity:</span>
                        <span className={isFull ? 'text-red-700' : 'text-[#2563EB]'}>
                          {sess.registered_count} / {sess.participant_capacity} registered
                        </span>
                      </div>
                      
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${isFull ? 'bg-red-600' : 'bg-[#2563EB]'}`}
                          style={{ width: `${Math.min(100, (sess.registered_count / sess.participant_capacity) * 100)}%` }}
                        />
                      </div>
                      
                      <p className="text-[10px] text-gray-500 font-semibold text-right">
                        {isFull ? 'Session Full' : `${sess.available_seats} available seats`}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM CTAS */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                    <Link
                      to={`/sessions/${sess.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#2563EB] hover:bg-[#2563EB]/10 border border-[#E2E8F0]"
                    >
                      View Details
                    </Link>

                    {isRegistered ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-xl bg-[#F8FAFC] text-white font-extrabold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                          Registered
                        </span>
                        <button
                          onClick={() => handleCancelRegistration(sess.id)}
                          className="text-[10px] font-bold text-red-700 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : isWaitlisted ? (
                      <span className="px-3 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs">
                        On Waitlist
                      </span>
                    ) : isFull ? (
                      <button
                        onClick={() => handleRegisterClick(sess)}
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 shadow-md"
                      >
                        Join Waitlist
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(sess)}
                        className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-xs hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/40 shadow-md"
                      >
                        Register Now
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* REGISTRATION CONFIRMATION MODAL */}
      {confirmModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-xl">
                <Video className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-black text-[#2563EB]">
                {selectedSession.is_full ? 'Join Session Waitlist' : 'Confirm Session Registration'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {selectedSession.is_full 
                  ? 'This session is currently full. You can join the waitlist to get promoted if a seat opens.' 
                  : 'You are registering for the following Struggle of Student online session:'}
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 text-xs text-[#0F172A]">
              <h4 className="font-extrabold text-sm text-[#2563EB]">{selectedSession.title}</h4>
              <p className="text-gray-600 leading-relaxed">{selectedSession.short_description}</p>
              
              <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 font-semibold">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Date & Time</span>
                  {new Date(selectedSession.start_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(selectedSession.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Mode</span>
                  {selectedSession.mode} ({selectedSession.meeting_provider || 'Online'})
                </div>
              </div>
            </div>

            {actionSuccessMessage ? (
              <div className="p-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                <span>{actionSuccessMessage}</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  disabled={submitting}
                  onClick={handleConfirmRegister}
                  className="w-full py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-xs shadow-md border border-[#2563EB] flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (selectedSession.is_full ? 'Confirm Join Waitlist' : 'Confirm Registration')}
                </button>
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH PROMPT MODAL */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              <Sparkles className="w-8 h-8 text-[#2563EB]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#2563EB]">Log In to Register</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Log in or join Struggle of Student to register for online workshops, access Zoom meeting links, and get certificates.
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

export default SessionsPage;
