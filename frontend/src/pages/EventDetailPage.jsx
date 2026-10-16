import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Video, Users, UserCheck, ShieldCheck, 
  Sparkles, AlertCircle, ArrowLeft, CheckCircle2, HeartHandshake, 
  HelpCircle, X, Check, Loader2 
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedVolunteerRole, setSelectedVolunteerRole] = useState(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  // Submitting states
  const [submittingRegister, setSubmittingRegister] = useState(false);
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [submittingVolunteer, setSubmittingVolunteer] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchEventDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getEventDetail(id);
      if (res.success) {
        setEvent(res.data);
        document.title = `${res.data.title} | Struggle of Student`;
      } else {
        setError(res.message || 'Event not found.');
      }
    } catch (err) {
      console.error('Error fetching event detail:', err);
      setError('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const formatDate = (isoString) => {
    if (!isoString) return 'TBA';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // EVENT REGISTRATION HANDLER
  const handleRegisterSubmit = async () => {
    setSubmittingRegister(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await apiService.registerForEvent(id);
      if (res.success) {
        setShowRegisterModal(false);
        setActionMessage({ type: 'success', text: res.message || "You're registered!" });
        fetchEventDetail();
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Registration failed.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingRegister(false);
    }
  };

  // CANCEL REGISTRATION HANDLER
  const handleCancelSubmit = async () => {
    setSubmittingCancel(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await apiService.cancelEventRegistration(id);
      if (res.success) {
        setShowCancelModal(false);
        setActionMessage({ type: 'success', text: 'Registration cancelled successfully.' });
        fetchEventDetail();
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to cancel registration.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel registration.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingCancel(false);
    }
  };

  // VOLUNTEER APPLICATION HANDLER
  const handleVolunteerSubmit = async () => {
    if (!selectedVolunteerRole) return;
    setSubmittingVolunteer(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await apiService.applyForVolunteerRole(id, selectedVolunteerRole.id);
      if (res.success) {
        setShowVolunteerModal(false);
        setActionMessage({ type: 'success', text: res.message || 'Volunteer application submitted.' });
        fetchEventDetail();
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Application failed.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Volunteer slots are full or application failed.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingVolunteer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#2563EB]">Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16 px-4 flex items-center justify-center">
        <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-2xl font-extrabold text-[#2563EB]">Event Not Found</h2>
          <p className="text-sm text-[#0F172A]/70">{error || "The requested event does not exist or has been removed."}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold shadow hover:bg-[#1D4ED8]"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const remainingParticipants = Math.max(0, event.participant_capacity - event.registered_count);
  const isParticipantFull = event.registered_count >= event.participant_capacity;
  
  const remainingVolunteerSlots = Math.max(0, event.volunteer_capacity - event.volunteer_filled_count);
  const isVolunteerFull = event.volunteer_filled_count >= event.volunteer_capacity;

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* TOP BACK NAVIGATION */}
        <div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>Back to Upcoming Events</span>
          </Link>
        </div>

        {/* FEEDBACK MESSAGES */}
        {actionMessage.text && (
          <div className={`p-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-between animate-fadeIn ${
            actionMessage.type === 'success' 
              ? 'bg-[#2563EB]/10 border-[#E2E8F0] text-[#2563EB]' 
              : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#2563EB]" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage({ type: '', text: '' })} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: EVENT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HERO HEADER CARD */}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#0F172A] text-[#F8FAFC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-[#2563EB]/30 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#1D4ED8]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB] text-white uppercase tracking-wider">
                  {event.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  {event.mode}
                </span>
                {event.effective_status === 'CLOSING_SOON' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-black">
                    Closing Soon
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-[#F8FAFC] pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <span>{formatDate(event.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  {event.mode === 'Online' ? <Video className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-[#2563EB]" />}
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-[#2563EB] pt-1">
                Organized by: <span className="text-white font-bold">{event.organizer}</span>
              </div>
            </div>

            {/* EVENT DESCRIPTION */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3">
                About the Event
              </h2>
              <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line font-medium">
                {event.description || event.short_description}
              </p>
            </div>

            {/* AGENDA */}
            {event.agenda && (
              <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3">
                  Event Agenda
                </h2>
                <div className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0] font-mono">
                  {event.agenda}
                </div>
              </div>
            )}

            {/* VOLUNTEER OPPORTUNITIES SECTION */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#2563EB] flex items-center gap-2">
                    <HeartHandshake className="w-6 h-6 text-[#2563EB]" />
                    <span>Volunteer Opportunities</span>
                  </h2>
                  <p className="text-xs text-[#0F172A]/70 mt-0.5">
                    Become an SS Volunteer for this event and gain leadership experience.
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    isVolunteerFull 
                      ? 'bg-rose-100 text-rose-800 border-rose-300' 
                      : 'bg-[#2563EB]/15 text-[#2563EB] border-[#E2E8F0]'
                  }`}>
                    {event.volunteer_filled_count} / {event.volunteer_capacity} Volunteer Slots Filled
                  </span>
                </div>
              </div>

              {/* VOLUNTEER SLOTS FULL WARNING */}
              {isVolunteerFull && (
                <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <div>
                    <div className="font-extrabold text-sm uppercase">Volunteer Slots Full</div>
                    <div>All volunteer positions for this event have been filled. You can still register as an attendee!</div>
                  </div>
                </div>
              )}

              {/* VOLUNTEER ROLES LIST */}
              {(!event.volunteer_roles || event.volunteer_roles.length === 0) ? (
                <p className="text-xs font-bold text-[#0F172A]/60 italic">No specific volunteer roles listed for this event.</p>
              ) : (
                <div className="space-y-4">
                  {event.volunteer_roles.map((role) => {
                    const isRoleFull = role.is_full || isVolunteerFull;
                    const isMyApplication = event.user_volunteer_application && event.user_volunteer_application.role === role.id;
                    const myAppStatus = isMyApplication ? event.user_volunteer_application.status : null;

                    return (
                      <div
                        key={role.id}
                        className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-xl p-5 space-y-3 hover:border-[#2563EB] transition-colors"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-extrabold text-[#2563EB]">{role.title}</h3>
                            <p className="text-xs text-[#0F172A]/80 mt-1">{role.description}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white border border-[#E2E8F0] text-[#2563EB]">
                            Capacity: {role.filled_slots} / {role.capacity}
                          </span>
                        </div>

                        {role.requirements && (
                          <div className="text-xs text-[#0F172A]/70 bg-white p-2.5 rounded-lg border border-[#E2E8F0]/70">
                            <span className="font-bold text-[#2563EB]">Requirements:</span> {role.requirements}
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-end">
                          {isMyApplication && myAppStatus !== 'WITHDRAWN' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB]/15 text-[#2563EB] text-xs font-extrabold border border-[#E2E8F0]">
                              <Check className="w-4 h-4" />
                              <span>Application Submitted ({myAppStatus})</span>
                            </span>
                          ) : isRoleFull ? (
                            <button
                              disabled
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-not-allowed border border-gray-300"
                            >
                              VOLUNTEER SLOTS FULL
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isAuthenticated) {
                                  navigate('/login');
                                  return;
                                }
                                setSelectedVolunteerRole(role);
                                setShowVolunteerModal(true);
                              }}
                              className="px-4 py-2 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold border border-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-sm"
                            >
                              Apply as Volunteer
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* RIGHT 1 COLUMN: STICKY EVENT SUMMARY CARD */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-xl space-y-6 sticky top-24">
              
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-extrabold text-[#2563EB] tracking-widest uppercase">Event Details</span>
                <h3 className="text-lg font-extrabold text-[#2563EB] mt-1">{event.title}</h3>
              </div>

              <div className="space-y-4 text-xs font-bold text-[#0F172A]">
                <div>
                  <span className="text-[#0F172A]/60 text-[10px] uppercase tracking-wider block">DATE</span>
                  <span className="text-sm text-[#2563EB]">{formatDate(event.start_datetime)}</span>
                </div>

                <div>
                  <span className="text-[#0F172A]/60 text-[10px] uppercase tracking-wider block">TIME</span>
                  <span className="text-sm text-[#2563EB]">{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</span>
                </div>

                <div>
                  <span className="text-[#0F172A]/60 text-[10px] uppercase tracking-wider block">MODE & LOCATION</span>
                  <span className="text-sm text-[#2563EB]">{event.mode} ({event.location})</span>
                </div>

                {/* PARTICIPANTS CAPACITY GAUGE */}
                <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex justify-between text-xs font-extrabold text-[#2563EB]">
                    <span>PARTICIPANTS</span>
                    <span>{event.registered_count} / {event.participant_capacity}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isParticipantFull ? 'bg-rose-600' : 'bg-[#2563EB]'}`}
                      style={{ width: `${Math.min(100, (event.registered_count / event.participant_capacity) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-bold text-[#0F172A]/70 text-right">
                    {isParticipantFull ? 'Registration Full' : `${remainingParticipants} spots remaining`}
                  </div>
                </div>

                {/* REGISTRATION STATUS */}
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#0F172A]/60 text-[10px] uppercase tracking-wider block">REGISTRATION</span>
                  <span className="text-sm font-extrabold text-[#2563EB]">{event.effective_status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* DYNAMIC ACTION BUTTONS */}
              <div className="pt-4 space-y-3 border-t border-[#E2E8F0]">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-4 bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm rounded-xl shadow-md hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]"
                  >
                    Login to Register
                  </button>
                ) : event.is_registered ? (
                  <div className="space-y-2">
                    <div className="w-full py-3 px-4 bg-[#2563EB]/15 border border-[#E2E8F0] text-[#2563EB] rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      <span>You're registered!</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/student/events"
                        className="py-2.5 px-2 bg-[#FFFFFF] border border-[#E2E8F0] text-[#2563EB] font-bold text-xs rounded-xl text-center hover:bg-[#2563EB]/10"
                      >
                        My Events
                      </Link>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="py-2.5 px-2 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl text-center hover:bg-red-100"
                      >
                        Cancel Reg
                      </button>
                    </div>
                  </div>
                ) : isParticipantFull ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 bg-gray-200 text-gray-700 font-extrabold text-sm rounded-xl cursor-not-allowed border border-gray-300"
                  >
                    Registration Full
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full py-3.5 px-4 bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm rounded-xl shadow-lg hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]"
                  >
                    Register for Event
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* EVENT REGISTRATION CONFIRMATION MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 p-2 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
              <span className="text-xs font-extrabold text-[#2563EB] tracking-widest uppercase">Registration Confirmation</span>
              <h3 className="text-2xl font-extrabold text-[#2563EB]">{event.title}</h3>
            </div>

            <div className="space-y-3 text-xs font-medium text-[#0F172A] bg-white p-4 rounded-2xl border border-[#E2E8F0]">
              <div className="font-bold text-[#2563EB] text-sm mb-2">Student Information</div>
              <div><span className="font-bold">Name:</span> {profile?.full_name || 'Student'}</div>
              <div><span className="font-bold">Email:</span> {profile?.email}</div>
              <div><span className="font-bold">College:</span> {profile?.college || 'Not specified'}</div>
              <div><span className="font-bold">Event Date:</span> {formatDate(event.start_datetime)}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#2563EB] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={submittingRegister}
                onClick={handleRegisterSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-extrabold border border-[#2563EB] shadow hover:bg-[#1D4ED8] flex items-center gap-2"
              >
                {submittingRegister ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                <span>Confirm Registration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL REGISTRATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-red-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="space-y-2 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-red-900">Cancel Registration?</h3>
              <p className="text-xs text-[#0F172A]/80 font-medium">
                Are you sure you want to cancel your registration for <span className="font-bold">{event.title}</span>? Your slot will be freed for other students.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
              >
                Keep My Seat
              </button>
              <button
                disabled={submittingCancel}
                onClick={handleCancelSubmit}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700 flex items-center gap-2"
              >
                {submittingCancel ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Yes, Cancel Registration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOLUNTEER APPLICATION MODAL */}
      {showVolunteerModal && selectedVolunteerRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowVolunteerModal(false)}
              className="absolute top-4 right-4 p-2 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
              <span className="text-xs font-extrabold text-[#2563EB] tracking-widest uppercase">Volunteer Application</span>
              <h3 className="text-2xl font-extrabold text-[#2563EB]">{selectedVolunteerRole.title}</h3>
              <p className="text-xs text-[#0F172A]/80">{event.title}</p>
            </div>

            <div className="space-y-3 text-xs font-medium text-[#0F172A] bg-white p-4 rounded-2xl border border-[#E2E8F0]">
              <div><span className="font-bold">Role Description:</span> {selectedVolunteerRole.description}</div>
              <div><span className="font-bold">Applicant Name:</span> {profile?.full_name}</div>
              <div><span className="font-bold">Email:</span> {profile?.email}</div>
              <div><span className="font-bold">College:</span> {profile?.college}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowVolunteerModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
              >
                Cancel
              </button>
              <button
                disabled={submittingVolunteer}
                onClick={handleVolunteerSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-extrabold border border-[#2563EB] shadow hover:bg-[#1D4ED8] flex items-center gap-2"
              >
                {submittingVolunteer ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-4 h-4 text-[#2563EB]" />}
                <span>Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetailPage;
