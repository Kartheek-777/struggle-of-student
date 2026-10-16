import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Video, CheckCircle2, XCircle, 
  ArrowRight, AlertCircle, Loader2, Sparkles, RefreshCw 
} from 'lucide-react';
import { apiService } from '../services/api';

const MyEventsPage = () => {
  const [data, setData] = useState({ upcoming: [], past: [], total_registrations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Cancel registration modal
  const [selectedReg, setSelectedReg] = useState(null);
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getStudentEvents();
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'Failed to load your registered events.');
      }
    } catch (err) {
      console.error('Error fetching student events:', err);
      setError('Unable to load your events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return 'TBA';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
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

  const handleCancelRegistration = async () => {
    if (!selectedReg) return;
    setSubmittingCancel(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await apiService.cancelEventRegistration(selectedReg.event.id);
      if (res.success) {
        setSelectedReg(null);
        setActionMessage({ type: 'success', text: 'Registration cancelled successfully.' });
        fetchMyEvents();
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to cancel.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel registration.' });
    } finally {
      setSubmittingCancel(false);
    }
  };

  const currentList = activeTab === 'upcoming' ? data.upcoming : data.past;

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#2563EB]">My Events</h1>
            <p className="text-xs text-[#0F172A]/70 mt-1 font-medium">
              Track your registered events and manage your upcoming schedule.
            </p>
          </div>

          <Link
            to="/events"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs shadow hover:bg-[#1D4ED8] border border-[#2563EB]"
          >
            Explore More Events
          </Link>
        </div>

        {/* FEEDBACK MESSAGES */}
        {actionMessage.text && (
          <div className={`p-4 rounded-2xl border-2 text-xs font-bold flex items-center justify-between ${
            actionMessage.type === 'success' ? 'bg-[#2563EB]/10 border-[#E2E8F0] text-[#2563EB]' : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage({ type: '', text: '' })}>X</button>
          </div>
        )}

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-3 border-b-2 border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-extrabold border-b-4 transition-all ${
              activeTab === 'upcoming' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-[#0F172A]/60 hover:text-[#2563EB]'
            }`}
          >
            Upcoming Registrations ({data.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 text-sm font-extrabold border-b-4 transition-all ${
              activeTab === 'past' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-[#0F172A]/60 hover:text-[#2563EB]'
            }`}
          >
            Past Events ({data.past.length})
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#2563EB]">Loading registrations...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-xs font-bold text-red-800">{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && currentList.length === 0 && (
          <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <Calendar className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-lg font-extrabold text-[#2563EB]">
              {activeTab === 'upcoming' ? "You haven't registered for any upcoming events yet." : "No past event registrations found."}
            </h3>
            <p className="text-xs text-[#0F172A]/70 font-medium">
              Discover student meetups, workshops, and hackathons organized by Struggle of Student.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold shadow hover:bg-[#1D4ED8] border border-[#2563EB]"
            >
              <span>Discover Events</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            </Link>
          </div>
        )}

        {/* LIST OF REGISTRATIONS */}
        {!loading && !error && currentList.length > 0 && (
          <div className="space-y-4">
            {currentList.map((reg) => {
              const evt = reg.event;
              const isCancelled = reg.status === 'CANCELLED';

              return (
                <div
                  key={reg.id}
                  className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#2563EB] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] uppercase">
                        {evt.category}
                      </span>
                      {isCancelled ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#2563EB]/15 text-[#2563EB]">
                          Registered
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-extrabold text-[#2563EB]">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#0F172A]/80">
                      <div className="flex items-center gap-1.5 text-[#2563EB]">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        <span>{formatDate(evt.start_datetime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#2563EB]" />
                        <span>{formatTime(evt.start_datetime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {evt.mode === 'Online' ? <Video className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-[#2563EB]" />}
                        <span>{evt.mode} ({evt.location})</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#0F172A]/60">
                      Registered on: {formatDate(reg.registered_at)}
                    </div>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3 pt-2 md:pt-0">
                    <Link
                      to={`/events/${evt.id}`}
                      className="px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#E2E8F0] text-[#2563EB] font-bold text-xs rounded-xl hover:bg-[#2563EB] hover:text-[#F8FAFC] transition-colors"
                    >
                      View Event
                    </Link>

                    {activeTab === 'upcoming' && !isCancelled && (
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100"
                      >
                        Cancel Reg
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* CANCEL REGISTRATION CONFIRMATION MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-red-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-red-900">Cancel Registration?</h3>
            <p className="text-xs text-[#0F172A]/80 font-medium">
              Are you sure you want to cancel your registration for <span className="font-bold">{selectedReg.event.title}</span>?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
              >
                Keep Seat
              </button>
              <button
                disabled={submittingCancel}
                onClick={handleCancelRegistration}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700 flex items-center gap-2"
              >
                {submittingCancel ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyEventsPage;
