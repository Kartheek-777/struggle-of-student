import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  Calendar, Clock, MapPin, Video, Users, CheckCircle2, ArrowLeft, 
  Sparkles, Loader2, AlertCircle, Share2, ExternalLink, Bookmark, Play, Award
} from 'lucide-react';

const LinkedinIcon = (props) => (
  <svg className={props.className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.49 1.49 0 1 0 0 2.97 1.49 1.49 0 0 0 0-2.97Z"/>
  </svg>
);

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [registering, setRegistering] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const fetchSessionDetail = () => {
    setLoading(true);
    apiService.getSessionDetail(id)
      .then((res) => {
        setSession(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching session detail:', err);
        setError('Failed to load session details.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSessionDetail();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }

    setRegistering(true);
    setActionMessage('');

    try {
      if (session.is_full) {
        const res = await apiService.joinSessionWaitlist(session.id);
        setActionMessage(res.message || "You're on the waitlist!");
      } else {
        const res = await apiService.registerSession(session.id);
        setActionMessage(res.message || "Registered successfully!");
      }
      setRegistering(false);
      fetchSessionDetail();
    } catch (err) {
      console.error('Error registering:', err);
      setActionMessage(err.response?.data?.message || 'Failed to complete registration.');
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;
    try {
      await apiService.cancelSessionRegistration(session.id);
      fetchSessionDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading session details...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 max-w-4xl mx-auto space-y-6">
        <Link to="/sessions" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sessions</span>
        </Link>
        <div className="p-8 bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-700 mx-auto" />
          <h3 className="text-xl font-bold text-amber-900">{error || 'Session not found'}</h3>
          <p className="text-xs text-amber-800">The session you are looking for may have been removed or rescheduled.</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(session.start_datetime);
  const endDate = new Date(session.end_datetime);

  const formattedDate = startDate.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const startTimeStr = startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const endTimeStr = endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const isRegistered = session.is_registered;
  const isWaitlisted = session.is_waitlisted;
  const isFull = session.is_full;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* BREADCRUMB */}
        <Link
          to="/sessions"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2563EB] hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sessions</span>
        </Link>

        {/* HERO BANNER CARD */}
        <div className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-8 sm:p-12 border-4 border-[#2563EB] shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#F8FAFC] text-[#2563EB] text-xs font-extrabold uppercase tracking-widest border border-[#2563EB]/40">
              {session.session_type?.replace('_', ' ') || session.category}
            </span>

            <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
              {session.mode === 'Online' ? 'Online Session' : session.mode === 'Offline' ? `Venue: ${session.location}` : 'Hybrid Session'}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {session.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl">
              {session.short_description || session.description}
            </p>
          </div>

          {/* QUICK METADATA ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-xs font-semibold text-gray-200">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Date</span>
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Time & Timezone</span>
                <span>{startTimeStr} - {endTimeStr} ({session.timezone_str || 'IST'})</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Seat Capacity</span>
                <span>{session.registered_count} / {session.participant_capacity} Registered ({session.available_seats} available)</span>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: SESSION DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* OVERVIEW / DESCRIPTION */}
            <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-8 shadow-md space-y-4">
              <h3 className="text-xl font-black text-[#2563EB]">About This Session</h3>
              <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                {session.description}
              </p>
            </div>

            {/* WHAT YOU WILL LEARN */}
            {session.what_you_will_learn && (
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-8 shadow-md space-y-4">
                <h3 className="text-xl font-black text-[#2563EB]">What Students Will Learn</h3>
                <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                  {session.what_you_will_learn}
                </p>
              </div>
            )}

            {/* TOPICS & PREREQUISITES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {session.topics && (
                <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-md space-y-3">
                  <h4 className="text-sm font-extrabold text-[#2563EB] uppercase tracking-wider">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.split(',').map((topic, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-[#F8FAFC] text-[#2563EB] text-xs font-bold border border-[#E2E8F0]">
                        {topic.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {session.who_should_attend && (
                <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-md space-y-2">
                  <h4 className="text-sm font-extrabold text-[#2563EB] uppercase tracking-wider">Who Should Attend</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{session.who_should_attend}</p>
                </div>
              )}
            </div>

            {/* SPEAKERS SECTION */}
            {session.speakers && session.speakers.length > 0 && (
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-8 shadow-md space-y-6">
                <h3 className="text-xl font-black text-[#2563EB]">Session Speakers & Hosts</h3>
                
                <div className="space-y-6">
                  {session.speakers.map((sp) => (
                    <div key={sp.id} className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="w-16 h-16 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-black text-2xl shrink-0 uppercase border border-[#2563EB]">
                        {sp.name.charAt(0)}
                      </div>
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-extrabold text-[#2563EB]">{sp.name}</h4>
                          {sp.linkedin_url && (
                            <a href={sp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:text-[#2563EB]">
                              <LinkedinIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#2563EB]">{sp.designation} - {sp.organization}</p>
                        <p className="text-xs text-gray-600 leading-relaxed pt-1">{sp.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AGENDA */}
            {session.agenda && (
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-8 shadow-md space-y-4">
                <h3 className="text-xl font-black text-[#2563EB]">Session Agenda</h3>
                <pre className="text-xs text-[#0F172A] font-sans leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0]">
                  {session.agenda}
                </pre>
              </div>
            )}

          </div>

          {/* RIGHT 1 COLUMN: REGISTRATION & ACCESS SIDEBAR */}
          <div className="space-y-6">
            
            {/* REGISTRATION ACTION CARD */}
            <div className="bg-[#FFFFFF] border-4 border-[#2563EB] rounded-3xl p-6 shadow-2xl space-y-6 sticky top-24">
              
              <div className="space-y-2 text-center pb-4 border-b border-[#E2E8F0]">
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest block">Participant Capacity</span>
                <div className="text-3xl font-black text-[#2563EB]">
                  {session.registered_count} <span className="text-sm font-semibold text-gray-500">/ {session.participant_capacity} filled</span>
                </div>
                
                <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${isFull ? 'bg-red-600' : 'bg-[#2563EB]'}`}
                    style={{ width: `${Math.min(100, (session.registered_count / session.participant_capacity) * 100)}%` }}
                  />
                </div>

                <p className="text-xs font-bold text-[#2563EB]">
                  {isFull ? 'Capacity Reached (Waitlist Open)' : `${session.available_seats} seats remaining`}
                </p>
              </div>

              {actionMessage && (
                <div className="p-3.5 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-bold text-center">
                  {actionMessage}
                </div>
              )}

              {/* DYNAMIC ACTION BUTTON */}
              {isRegistered ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#2563EB] mx-auto" />
                    <p className="text-xs font-black text-[#2563EB]">You are Registered!</p>
                    <p className="text-[11px] text-[#2563EB]">Your seat is confirmed for this live session.</p>
                  </div>

                  {session.meeting_url_protected ? (
                    <a
                      href={session.meeting_url_protected}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-xs shadow-lg hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 border border-[#2563EB]"
                    >
                      <Video className="w-4 h-4 text-[#2563EB]" />
                      <span>Join Online Session</span>
                    </a>
                  ) : (
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-[11px] text-gray-600 font-semibold">
                       Meeting access link will activate when session begins.
                    </div>
                  )}

                  <button
                    onClick={handleCancelRegistration}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 text-center"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isWaitlisted ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                  <p className="text-xs font-extrabold text-amber-900">You are on the Waitlist</p>
                  <p className="text-[11px] text-amber-800">If a seat opens up, you will be automatically promoted.</p>
                </div>
              ) : isFull ? (
                <button
                  disabled={registering}
                  onClick={handleRegister}
                  className="w-full py-3.5 rounded-2xl bg-amber-600 text-white font-extrabold text-xs shadow-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Session Waitlist'}
                </button>
              ) : (
                <button
                  disabled={registering}
                  onClick={handleRegister}
                  className="w-full py-4 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm shadow-xl hover:bg-[#1D4ED8] transition-colors border border-[#2563EB] flex items-center justify-center gap-2"
                >
                  {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register for Session'}
                </button>
              )}

              {/* SESSION METADATA LIST */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-3 text-xs text-[#0F172A]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold">Organizer:</span>
                  <span className="font-extrabold text-[#2563EB]">{session.organizer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold">Provider:</span>
                  <span className="font-extrabold text-[#2563EB]">{session.meeting_provider || 'Online Link'}</span>
                </div>
                {session.registration_deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">Deadline:</span>
                    <span className="font-extrabold text-red-700">{new Date(session.registration_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* AUTH PROMPT MODAL */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              <Sparkles className="w-8 h-8 text-[#2563EB]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#2563EB]">Join SS to Access Session</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Please log in or register your student account to sign up for this session and view meeting access links.
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

export default SessionDetailPage;
