import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, Calendar, Clock, MapPin, AlertCircle, 
  CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles, RefreshCw 
} from 'lucide-react';
import { apiService } from '../services/api';

const MyVolunteerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Withdraw modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getStudentVolunteerApplications();
      if (res.success) {
        setApplications(res.applications || []);
      } else {
        setError(res.message || 'Failed to load volunteer applications.');
      }
    } catch (err) {
      console.error('Error fetching volunteer applications:', err);
      setError('Unable to load volunteer applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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

  const handleWithdraw = async () => {
    if (!selectedApp) return;
    setSubmittingWithdraw(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await apiService.withdrawVolunteerApplication(selectedApp.id);
      if (res.success) {
        setSelectedApp(null);
        setActionMessage({ type: 'success', text: 'Volunteer application withdrawn.' });
        fetchApplications();
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to withdraw application.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to withdraw application.' });
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'APPLIED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">Applied</span>;
      case 'UNDER_REVIEW':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">Under Review</span>;
      case 'ACCEPTED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/15 text-[#2563EB] border border-[#E2E8F0]">Accepted</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300">Rejected</span>;
      case 'WITHDRAWN':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gray-200 text-gray-700 border border-gray-300">Withdrawn</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gray-100 text-gray-800">{statusStr}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Volunteer Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#2563EB]">My Volunteer Applications</h1>
            <p className="text-xs text-[#0F172A]/70 mt-1 font-medium">
              View your volunteer roles, status updates, and contributions to SS events.
            </p>
          </div>

          <Link
            to="/events"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs shadow hover:bg-[#1D4ED8] border border-[#2563EB]"
          >
            Browse Volunteer Opportunities
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

        {/* LOADING STATE */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#2563EB]">Loading volunteer applications...</p>
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
        {!loading && !error && applications.length === 0 && (
          <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <HeartHandshake className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-lg font-extrabold text-[#2563EB]">
              You haven't applied for any volunteer opportunities yet.
            </h3>
            <p className="text-xs text-[#0F172A]/70 font-medium">
              Join SS event teams to lead registration desks, event media, technical setups, and mentor support.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold shadow hover:bg-[#1D4ED8] border border-[#2563EB]"
            >
              <span>Explore Events & Volunteer Roles</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            </Link>
          </div>
        )}

        {/* LIST OF VOLUNTEER APPLICATIONS */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#2563EB] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                    <span className="text-xs font-extrabold text-[#2563EB]">
                      {app.event?.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#2563EB]">
                    Role: {app.role_title}
                  </h3>

                  <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                    <span>Event: {app.event_title}</span>
                  </div>

                  {app.role?.description && (
                    <p className="text-xs text-[#0F172A]/70 max-w-2xl font-medium">
                      {app.role.description}
                    </p>
                  )}

                  <div className="text-[11px] text-[#0F172A]/60">
                    Applied on: {formatDate(app.applied_at)}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 pt-2 md:pt-0">
                  <Link
                    to={`/events/${app.event?.id}`}
                    className="px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#E2E8F0] text-[#2563EB] font-bold text-xs rounded-xl hover:bg-[#2563EB] hover:text-[#F8FAFC] transition-colors"
                  >
                    View Event
                  </Link>

                  {['APPLIED', 'UNDER_REVIEW', 'ACCEPTED'].includes(app.status) && (
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100"
                    >
                      Withdraw
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* WITHDRAW APPLICATION CONFIRMATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-red-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-red-900">Withdraw Volunteer Application?</h3>
            <p className="text-xs text-[#0F172A]/80 font-medium">
              Are you sure you want to withdraw your application for <span className="font-bold">{selectedApp.role_title}</span> at <span className="font-bold">{selectedApp.event_title}</span>?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
              >
                Keep Application
              </button>
              <button
                disabled={submittingWithdraw}
                onClick={handleWithdraw}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700 flex items-center gap-2"
              >
                {submittingWithdraw ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Confirm Withdraw</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyVolunteerApplicationsPage;
