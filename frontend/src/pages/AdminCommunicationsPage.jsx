import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, RefreshCw, AlertTriangle, CheckCircle2, Clock, Search, Filter, ArrowLeft, Send, ShieldCheck
} from 'lucide-react';
import { getAdminCommunications, getAdminEmailLogs, retryAdminEmail } from '../services/api';

const AdminCommunicationsPage = () => {
  const [stats, setStats] = useState({ total_emails: 0, sent_emails: 0, failed_emails: 0, queued_emails: 0 });
  const [recentFailures, setRecentFailures] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Retry Modal / Status
  const [retryingId, setRetryingId] = useState(null);
  const [retryModalLog, setRetryModalLog] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const commsRes = await getAdminCommunications();
      const resData = commsRes.data || commsRes;
      setStats(resData.stats || {});
      setRecentFailures(resData.recent_failures || []);

      const logsRes = await getAdminEmailLogs({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery
      });
      setEmailLogs(logsRes.data || logsRes);
    } catch (err) {
      console.error("Failed to load communication logs:", err);
      setAlertMsg({ type: 'error', text: 'Permission denied or error fetching communication logs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleTriggerRetry = async (id) => {
    setRetryingId(id);
    setAlertMsg({ type: '', text: '' });
    try {
      const res = await retryAdminEmail(id);
      const data = res.data || res;
      setAlertMsg({ type: 'success', text: data.message || 'Email re-sent successfully!' });
      setRetryModalLog(null);
      fetchDashboardData();
    } catch (err) {
      const errText = err.response?.data?.error || err.response?.data?.message || 'Failed to retry email delivery.';
      setAlertMsg({ type: 'error', text: errText });
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-6">
        
        {/* HEADER & NAV */}
        <div className="flex items-center justify-between">
          <Link 
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-[#2563EB] text-xs font-extrabold border border-[#2563EB]/40 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Admin Operations Panel
          </span>
        </div>

        {/* TITLE BANNER */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">Communication Logs & Email Dashboard</h1>
              <p className="text-xs text-gray-600 mt-1">
                Monitor system emails, inspect delivery status, track failures, and execute safe re-sending operations.
              </p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-xl bg-white border-2 border-[#2563EB]/20 text-[#2563EB] text-xs font-bold hover:border-[#2563EB] transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 text-[#2563EB] ${loading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>

        {/* ALERTS */}
        {alertMsg.text && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            alertMsg.type === 'success' ? 'bg-[#2563EB]/10 border-[#E2E8F0] text-[#2563EB]' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {alertMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
            {alertMsg.text}
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Emails</p>
            <p className="text-3xl font-extrabold text-[#2563EB] mt-1">{stats.total_emails || 0}</p>
          </div>
          <div className="p-5 rounded-3xl bg-[#2563EB]/10 border-2 border-[#E2E8F0] shadow-sm">
            <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Sent Successfully</p>
            <p className="text-3xl font-extrabold text-[#2563EB] mt-1">{stats.sent_emails || 0}</p>
          </div>
          <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-200 shadow-sm">
            <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Delivery Failures</p>
            <p className="text-3xl font-extrabold text-red-900 mt-1">{stats.failed_emails || 0}</p>
          </div>
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 shadow-sm">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Queued / Retrying</p>
            <p className="text-3xl font-extrabold text-amber-900 mt-1">{stats.queued_emails || 0}</p>
          </div>
        </div>

        {/* RECENT FAILURES ATTENTION SECTION */}
        {recentFailures.length > 0 && (
          <div className="p-6 rounded-3xl bg-red-50/60 border-2 border-red-200 space-y-4">
            <div className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider">Delivery Failures Needing Attention</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentFailures.slice(0, 4).map(fail => (
                <div key={fail.id} className="p-4 rounded-2xl bg-white border border-red-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-red-900 truncate">{fail.subject}</p>
                    <p className="text-[11px] text-gray-600 truncate">To: {fail.recipient_email}</p>
                    <p className="text-[10px] text-red-600 truncate">{fail.error_message}</p>
                  </div>
                  <button
                    onClick={() => setRetryModalLog(fail)}
                    className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-[11px] hover:bg-red-800 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-[#FFFFFF] rounded-3xl p-5 border-2 border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipient or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#2563EB] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="SENT">SENT</option>
              <option value="FAILED">FAILED</option>
              <option value="QUEUED">QUEUED</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#2563EB] focus:outline-none"
            >
              <option value="">All Email Types</option>
              <option value="WELCOME">WELCOME</option>
              <option value="APPLICATION_CONFIRMATION">APPLICATION CONFIRMATION</option>
              <option value="APPLICATION_STATUS">APPLICATION STATUS</option>
              <option value="EVENT_REGISTRATION">EVENT REGISTRATION</option>
              <option value="VOLUNTEER_APPROVAL">VOLUNTEER APPROVAL</option>
              <option value="SUPPORT_ACKNOWLEDGEMENT">SUPPORT ACKNOWLEDGEMENT</option>
              <option value="SESSION_CANCELLED">SESSION CANCELLED</option>
            </select>
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#2563EB]">Communication Execution Logs</h2>
            <span className="text-xs text-gray-500 font-semibold">Showing latest {emailLogs.length} logs</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-[#2563EB]">Loading communication logs...</p>
            </div>
          ) : emailLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No communication logs found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2563EB]/5 border-b border-[#E2E8F0] text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider">
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Email Subject</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Attempts</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/60 transition-colors">
                      <td className="p-4 font-bold text-[#2563EB]">{log.recipient_email}</td>
                      <td className="p-4 text-gray-700 max-w-xs truncate">{log.subject}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-800 font-extrabold text-[10px]">
                          {log.email_type}
                        </span>
                      </td>
                      <td className="p-4">
                        {log.status === 'SENT' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/15 text-[#2563EB] font-bold text-[11px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-[#2563EB]" /> SENT
                          </span>
                        ) : log.status === 'FAILED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-red-600" /> FAILED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-600" /> {log.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-gray-600">{log.attempt_count} / 5</td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {log.status === 'FAILED' && (
                          <button
                            onClick={() => setRetryModalLog(log)}
                            className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-[#F8FAFC] font-bold text-[11px] hover:bg-[#1D4ED8] transition-all border border-[#2563EB]/40"
                          >
                            Retry Re-send
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RETRY CONFIRMATION MODAL */}
        {retryModalLog && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#E2E8F0] shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2563EB]">Confirm Email Retry</h3>
                  <p className="text-xs text-gray-500">Attempt safe re-delivery of this failed communication.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-1 text-xs">
                <p className="font-bold text-[#2563EB]">Recipient: <span className="font-normal text-gray-700">{retryModalLog.recipient_email}</span></p>
                <p className="font-bold text-[#2563EB]">Subject: <span className="font-normal text-gray-700">{retryModalLog.subject}</span></p>
                <p className="font-bold text-[#2563EB]">Last Error: <span className="font-normal text-red-600">{retryModalLog.error_message || 'SMTP Exception'}</span></p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setRetryModalLog(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTriggerRetry(retryModalLog.id)}
                  disabled={retryingId === retryModalLog.id}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-all flex items-center gap-1.5 border border-[#2563EB]/50 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                  {retryingId === retryModalLog.id ? 'Re-sending...' : 'Confirm & Re-send'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCommunicationsPage;
