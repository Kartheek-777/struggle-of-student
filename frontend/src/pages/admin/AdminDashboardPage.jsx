import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getAdminDashboardOverview, createAdminEvent, createAdminOpportunity } from '../../services/api';
import {
  Users, Briefcase, Calendar, Video, FileText, HandHeart, HelpCircle,
  MessageSquare, Award, Code, ShieldAlert, ArrowRight, RefreshCw,
  Clock, CheckCircle, AlertCircle, Sparkles, TrendingUp, Plus, X,
  Megaphone, Building2, MapPin, DollarSign, Send, CheckCircle2
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Event Form Data
  const [eventFormData, setEventFormData] = useState({
    title: '',
    session_type: 'WORKSHOP',
    mode: 'Online',
    location: 'Online Zoom Platform',
    start_datetime: '',
    participant_capacity: 100,
    short_description: '',
    description: '',
    organizer: 'Struggle of Student (SS)'
  });

  // Opportunity Form Data
  const [oppFormData, setOppFormData] = useState({
    title: '',
    organization_name: 'SS Community & Corporate Partners',
    category: 'Internships',
    mode: 'Online',
    location: 'Remote / Online',
    work_type: 'Remote',
    stipend: 'Rs. 10,000 / month',
    short_description: '',
    description: '',
    eligibility: 'All Engineering & Degree Students',
    tags: 'React, Python, Web Development'
  });

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminDashboardOverview();
      if (res.data && res.data.success) {
        setData(res.data);
      } else {
        setError('Failed to load administration overview statistics.');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Unable to connect to administration server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setActionMsg(null);
    try {
      const startIso = eventFormData.start_datetime ? new Date(eventFormData.start_datetime).toISOString() : new Date(Date.now() + 86400000 * 3).toISOString();
      const endIso = new Date(new Date(startIso).getTime() + 7200000).toISOString();
      const formattedData = {
        ...eventFormData,
        category: eventFormData.session_type === 'WORKSHOP' ? 'Workshop' : 'Webinar',
        meeting_provider: 'ZOOM',
        status: 'REGISTRATION_OPEN',
        is_published: true,
        start_datetime: startIso,
        end_datetime: endIso
      };
      await createAdminEvent(formattedData);
      setActionMsg({ type: 'success', text: `Event "${eventFormData.title}" published! Students can now view and register for it on their dashboard.` });
      setEventModalOpen(false);
      setEventFormData({
        title: '', session_type: 'WORKSHOP', mode: 'Online', location: 'Online Zoom Platform',
        start_datetime: '', participant_capacity: 100, short_description: '', description: '',
        organizer: 'Struggle of Student (SS)'
      });
      fetchDashboard();
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = errData?.message || 'Failed to publish event.';
      if (errData?.errors) {
        const details = Object.entries(errData.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        errorMsg += ` (${details})`;
      }
      setActionMsg({ type: 'error', text: errorMsg });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setActionMsg(null);
    try {
      const formattedData = {
        ...oppFormData,
        tags: oppFormData.tags || 'Internship, Student Opportunity',
        experience_level: 'Beginner',
        status: 'OPEN'
      };
      await createAdminOpportunity(formattedData);
      setActionMsg({ type: 'success', text: `Opportunity "${oppFormData.title}" posted successfully! It is now live on all Student Dashboards.` });
      setOpportunityModalOpen(false);
      setOppFormData({
        title: '', organization_name: 'SS Community & Corporate Partners', category: 'Internships',
        mode: 'Online', location: 'Remote / Online', work_type: 'Remote', stipend: 'Rs. 10,000 / month',
        short_description: '', description: '', eligibility: 'All Engineering & Degree Students',
        tags: 'React, Python, Web Development'
      });
      fetchDashboard();
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = errData?.message || 'Failed to post opportunity.';
      if (errData?.errors) {
        const details = Object.entries(errData.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        errorMsg += ` (${details})`;
      }
      setActionMsg({ type: 'error', text: errorMsg });
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="SS Administration">
        <div className="flex flex-col items-center justify-center py-20 text-[#2563EB]">
          <RefreshCw className="w-10 h-10 animate-spin text-[#2563EB] mb-3" />
          <p className="font-extrabold text-sm tracking-wide">Loading SS Operational Control Center...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="SS Administration">
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 text-center my-8">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-600" />
          <p className="font-bold text-base mb-2">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {};
  const pending = data?.pending_actions || {};
  const activity = data?.recent_activity || [];

  const statCards = [
    { title: 'Total Students', value: stats.total_students, desc: 'Registered student profiles', icon: Users, color: 'border-l-4 border-blue-600', link: '/admin/users' },
    { title: 'Active Members', value: stats.active_members, desc: 'Active platform user accounts', icon: TrendingUp, color: 'border-l-4 border-[#2563EB]', link: '/admin/users' },
    { title: 'Active Opportunities', value: stats.active_opportunities, desc: 'Open internships & jobs', icon: Briefcase, color: 'border-l-4 border-[#2563EB]', link: '/admin/opportunities' },
    { title: 'Upcoming Events', value: stats.upcoming_events, desc: 'Scheduled campus & live events', icon: Calendar, color: 'border-l-4 border-purple-600', link: '/admin/events' },
    { title: 'Upcoming Sessions', value: stats.upcoming_sessions, desc: 'Live webinars & workshops', icon: Video, color: 'border-l-4 border-indigo-600', link: '/admin/events' },
    { title: 'Pending Applications', value: stats.pending_applications, desc: 'Applications awaiting review', icon: FileText, color: 'border-l-4 border-amber-500', link: '/admin/applications' },
    { title: 'Volunteer Registrations', value: stats.volunteer_registrations, desc: 'Event volunteer applications', icon: HandHeart, color: 'border-l-4 border-teal-600', link: '/admin/volunteers' },
    { title: 'Open Support Requests', value: stats.open_support_requests, desc: 'Student support tickets', icon: HelpCircle, color: 'border-l-4 border-rose-600', link: '/admin/support' },
    { title: 'New Enquiries', value: stats.new_enquiries, desc: 'Service & partnership requests', icon: MessageSquare, color: 'border-l-4 border-sky-600', link: '/admin/enquiries' },
    { title: 'Students Placements', value: stats.students_placed, desc: 'Verified career placements', icon: Award, color: 'border-l-4 border-[#2563EB]', link: '/admin/placements' },
    { title: 'Published Projects', value: stats.published_projects, desc: 'Student showcase projects', icon: Code, color: 'border-l-4 border-violet-600', link: '/admin/moderation' },
    { title: 'Pending Moderation', value: stats.pending_moderation, desc: 'User content awaiting approval', icon: ShieldAlert, color: 'border-l-4 border-orange-600', link: '/admin/moderation' },
  ];

  return (
    <AdminLayout title="SS Administrative Control Center">
      <div className="space-y-8">
        
        {/* WELCOME HERO & QUICK PUBLISH BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181830] via-[#1E1B4B] to-[#0F172A] text-white shadow-xl relative overflow-hidden border border-indigo-900/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#93B4FF] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#93B4FF]" />
                <span>SS OPERATIONS CONTROL HUB</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Admin Publishing Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Deploy announcements, stipend internships, and student masterclasses in real time. Items published here immediately sync with student portal feeds, mobile banners, and email dispatchers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setEventModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs hover:bg-[#1D4ED8] transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Upcoming Event</span>
              </button>

              <button
                onClick={() => setOpportunityModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 border border-white/15 backdrop-blur-xs"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span>Post Job / Internship</span>
              </button>

              <button
                onClick={fetchDashboard}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
                title="Refresh Operational Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK ALERT MESSAGE */}
        {actionMsg && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
            actionMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {actionMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            <span className="flex-1">{actionMsg.text}</span>
            <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ITEMS REQUIRING IMMEDIATE ACTION BAR */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm tracking-wider uppercase">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>ITEMS REQUIRING IMMEDIATE ACTION</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live sync 12s ago</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            <Link to="/admin/applications" className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pending Applications</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-slate-900">{pending.pending_applications || 0}</span>
                <span className="text-[10px] font-extrabold text-emerald-600">All Clear</span>
              </div>
            </Link>

            <Link to="/admin/moderation" className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pending Moderation</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-slate-900">{pending.pending_moderation || 0}</span>
                <span className="text-[10px] font-extrabold text-emerald-600">Clean</span>
              </div>
            </Link>

            <Link to="/admin/support" className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 hover:border-amber-300 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Open Support Requests</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-amber-900">{pending.open_support_requests || 0}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">Action Needed</span>
              </div>
            </Link>

            <Link to="/admin/enquiries" className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 hover:border-indigo-200 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">New Enquiries</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-indigo-950">{pending.new_enquiries || 0}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black">Unread</span>
              </div>
            </Link>

            <Link to="/admin/placements" className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pending Verification</span>
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-slate-900">{pending.pending_placement_verification || 0}</span>
                <span className="text-[10px] font-extrabold text-slate-500">Synced</span>
              </div>
            </Link>

          </div>
        </div>

        {/* ADMIN QUICK ACTION PUBLISHING CARDS GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin Publishing & Quick Controls</h2>
              <p className="text-xs font-medium text-slate-500">Post new content directly to student dashboards, mobile alerts, and public discovery hubs.</p>
            </div>
            <Link to="/admin/communications" className="text-xs font-extrabold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>Manage All Channels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* CARD 1: POST UPCOMING EVENT */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#2563EB] flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#2563EB] border border-indigo-100 text-[10px] font-extrabold">
                    12 Published Live
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900">Post Upcoming Event</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Publish webinars, technical bootcamps, or AI masterclasses. Immediately surfaces in the student portal agenda.
                </p>
              </div>

              <button
                onClick={() => setEventModalOpen(true)}
                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-extrabold text-xs hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event</span>
              </button>
            </div>

            {/* CARD 2: POST JOB / INTERNSHIP */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold">
                    34 Active Openings
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900">Post Job / Internship</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Publish stipended internships, non-IT roles, and junior engineering jobs for verified students to apply immediately.
                </p>
              </div>

              <button
                onClick={() => setOpportunityModalOpen(true)}
                className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-extrabold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            </div>

            {/* CARD 3: BROADCAST ANNOUNCEMENT */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Megaphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-extrabold">
                    Push & Banner
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900">Broadcast Announcement</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Dispatch platform flash updates, placement drive alerts, and emergency notifications to all registered students.
                </p>
              </div>

              <Link
                to="/admin/communications"
                className="w-full py-3 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-extrabold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-600" />
                <span>Communications Hub</span>
              </Link>
            </div>

            {/* CARD 4: MANAGE APPLICATIONS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-extrabold">
                    Zero Backlog
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900">Student Applications</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Review submitted student resumes, trigger interview rounds, accept/reject candidates, and export ATS shortlists.
                </p>
              </div>

              <Link
                to="/admin/applications"
                className="w-full py-3 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-extrabold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <span>Review Submissions ({pending.pending_applications || 0})</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>

          </div>
        </div>

        {/* DASHBOARD STATISTICS CARDS GRID */}
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">
            Platform Overview Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                        <Icon className="w-4 h-4 text-slate-700" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight my-1">
                      {card.value !== undefined ? card.value : '-'}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{card.desc}</p>
                  </div>

                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline transition-colors mt-4 pt-3 border-t border-slate-100 group"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#2563EB]" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY & AUDIT TRAIL */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Recent Publishing & System Activity</h2>
              <p className="text-xs text-slate-500 font-medium">Live operational ledger of newly dispatched events, opportunities, and user updates</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
                Filter by Type
              </button>
              <Link
                to="/admin/audit-logs"
                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-[#2563EB] border border-indigo-100 font-bold text-xs hover:bg-indigo-100"
              >
                View Audit Log
              </Link>
            </div>
          </div>

          {activity.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No recent administrative activity logged yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {activity.map((act) => (
                <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {act.admin_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2563EB]">
                        {act.action}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        By <span className="font-semibold">{act.admin_name}</span> ({act.admin_role}) - Target: {act.record_repr || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px] uppercase">
                      {act.module}
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE EVENT MODAL */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-[#2563EB]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Post New Upcoming Event / Workshop</h3>
              </div>
              <button onClick={() => setEventModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event / Workshop Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Full Stack Web Development & AI Bootcamp 2026"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Type</label>
                  <select
                    value={eventFormData.session_type}
                    onChange={(e) => setEventFormData({ ...eventFormData, session_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="WORKSHOP">Technical Workshop</option>
                    <option value="WEBINAR">Live Webinar / Masterclass</option>
                    <option value="BOOTCAMP">Career Bootcamp</option>
                    <option value="SEMINAR">Campus Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mode</label>
                  <select
                    value={eventFormData.mode}
                    onChange={(e) => setEventFormData({ ...eventFormData, mode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="Online">Online / Remote (Zoom)</option>
                    <option value="Offline">Offline / Campus Location</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Meeting Link</label>
                  <input
                    type="text"
                    placeholder="e.g., Online Zoom Platform or College Auditorium"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Participant Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={eventFormData.participant_capacity}
                    onChange={(e) => setEventFormData({ ...eventFormData, participant_capacity: parseInt(e.target.value) || 100 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hands-on 2-day live workshop with industry mentors."
                  value={eventFormData.short_description}
                  onChange={(e) => setEventFormData({ ...eventFormData, short_description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Agenda & Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed schedule, prerequisites, and learning outcomes..."
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs hover:bg-[#1D4ED8] transition flex items-center gap-2 shadow-md shadow-indigo-500/25"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Publish Event to Dashboard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE OPPORTUNITY MODAL */}
      {opportunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Post New Job / Internship / Student Work</h3>
              </div>
              <button onClick={() => setOpportunityModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Junior Frontend Developer Intern / AI Research Assistant"
                  value={oppFormData.title}
                  onChange={(e) => setOppFormData({ ...oppFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Hiring Company</label>
                  <input
                    type="text"
                    required
                    value={oppFormData.organization_name}
                    onChange={(e) => setOppFormData({ ...oppFormData, organization_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={oppFormData.category}
                    onChange={(e) => setOppFormData({ ...oppFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="Internships">Internships (Stipended)</option>
                    <option value="IT Jobs">IT / Software Jobs</option>
                    <option value="Non-IT Jobs">Non-IT / Management Roles</option>
                    <option value="Freelance Work">Student Work Projects</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Type & Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Remote / Hyderabad / Hybrid"
                    value={oppFormData.location}
                    onChange={(e) => setOppFormData({ ...oppFormData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stipend / Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g., Rs. 15,000 / month or Rs. 4.5 LPA"
                    value={oppFormData.stipend}
                    onChange={(e) => setOppFormData({ ...oppFormData, stipend: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Highlight *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 3-month remote internship with certificate & pre-placement offer."
                  value={oppFormData.short_description}
                  onChange={(e) => setOppFormData({ ...oppFormData, short_description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Requirements & Description</label>
                <textarea
                  rows="3"
                  placeholder="Key responsibilities, required technical skills, and application instructions..."
                  value={oppFormData.description}
                  onChange={(e) => setOppFormData({ ...oppFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpportunityModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white font-extrabold text-xs hover:bg-slate-800 transition flex items-center gap-2 shadow-md"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Post Opportunity to Dashboard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminDashboardPage;
