import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, CheckCheck, Filter, ArrowLeft, ExternalLink, ShieldAlert, Sparkles, CheckCircle2, Clock
} from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount } from '../services/api';

const NotificationCenterPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, unread, important
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications({ filter: activeTab });
      setNotifications(res.data || res);
      
      const countRes = await getUnreadNotificationCount();
      setUnreadCount(countRes.data?.unread_count ?? countRes.unread_count ?? 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ', is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, status: 'READ', is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-extrabold text-[10px]">URGENT</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px]">HIGH</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-extrabold text-[10px]">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-[#2563EB]/15 text-[#2563EB] font-bold text-[10px]">NORMAL</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER NAV */}
        <div className="flex items-center justify-between">
          <Link 
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <Link
            to="/settings/notifications"
            className="text-xs font-bold text-[#2563EB] hover:text-[#2563EB] underline"
          >
            Notification Preferences
          </Link>
        </div>

        {/* PAGE TITLE & ACTION BAR */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-md">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">Notification Center</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-xs animate-pulse">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Stay updated with your applications, session registrations, volunteer status, and platform alerts.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 border border-[#2563EB]/50 shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-[#2563EB]" />
              Mark all as read
            </button>
          )}
        </div>

        {/* TABS FILTER */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'unread', label: 'Unread' },
            { id: 'important', label: 'Important' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-[#F8FAFC] shadow-md border border-[#2563EB]/50'
                  : 'bg-white/60 text-[#2563EB] hover:bg-white hover:shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NOTIFICATION LIST CONTENT */}
        {loading ? (
          <div className="p-12 text-center bg-white/50 rounded-3xl border border-[#E2E8F0]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#2563EB]">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 text-red-800">
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] rounded-3xl border-2 border-dashed border-[#E2E8F0] space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#2563EB]">You're all caught up!</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No notifications found under the selected filter. Important platform updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  !n.is_read
                    ? 'bg-[#FFFFFF] border-[#2563EB]/30 shadow-md'
                    : 'bg-white/70 border-[#E2E8F0] opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-sm text-[#2563EB]">{n.title}</span>
                      {getPriorityBadge(n.priority)}
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold text-[10px] uppercase">
                        {n.related_module || 'SYSTEM'}
                      </span>
                      {!n.is_read && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-extrabold text-[9px]">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 pt-1">
                      <Clock className="w-3 h-3 text-[#2563EB]" />
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    {n.cta_link && (
                      <Link
                        to={n.cta_link}
                        className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-all flex items-center gap-1 border border-[#2563EB]/40"
                      >
                        <span>{n.cta_text || 'View'}</span>
                        <ExternalLink className="w-3 h-3 text-[#2563EB]" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationCenterPage;
