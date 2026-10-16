import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Bell, Mail, ShieldAlert, ArrowLeft, CheckCircle2, Lock
} from 'lucide-react';
import { getNotificationPreferences, updateNotificationPreferences } from '../services/api';

const NotificationPreferencesPage = () => {
  const [prefs, setPrefs] = useState({
    opportunity_alerts: true,
    event_updates: true,
    session_updates: true,
    community_updates: true,
    application_updates: true,
    email_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await getNotificationPreferences();
      setPrefs(res.data || res);
    } catch (err) {
      console.error("Failed to load preferences:", err);
      setErrorMsg("Failed to load notification settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateNotificationPreferences(prefs);
      setSuccessMsg("Notification preferences updated successfully!");
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setErrorMsg("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* TOP NAV */}
        <div className="flex items-center justify-between">
          <Link 
            to="/notifications"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notification Center
          </Link>
        </div>

        {/* HEADER */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-md">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">Notification Settings</h1>
            <p className="text-xs text-gray-600 mt-1">
              Control which optional updates you receive via in-app alerts and email.
            </p>
          </div>
        </div>

        {/* MESSAGES */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-[#2563EB]/10 border border-[#E2E8F0] text-[#2563EB] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* MANDATORY ALERT INFO BOX */}
        <div className="p-5 rounded-2xl bg-[#2563EB]/5 border-2 border-[#2563EB]/20 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="text-xs text-[#2563EB]">
            <span className="font-extrabold">Mandatory Transactional Communications:</span>
            <p className="mt-1 text-gray-700">
              Critical transactional notifications (such as password resets, application status changes, event cancellations, and session schedule updates) remain active to ensure critical operations function smoothly.
            </p>
          </div>
        </div>

        {/* PREFERENCE TOGGLES FORM */}
        {loading ? (
          <div className="p-12 text-center bg-white/50 rounded-3xl border border-[#E2E8F0]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#2563EB]">Loading preferences...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm space-y-6">
            
            <h2 className="text-lg font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2563EB]" />
              Communication Channels
            </h2>

            {/* EMAIL ENABLED TOGGLE */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-[#E2E8F0]">
              <div>
                <p className="text-sm font-extrabold text-[#2563EB]">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive optional updates directly in your email inbox.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.email_enabled}
                  onChange={() => handleToggle('email_enabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]" />
              </label>
            </div>

            <h2 className="text-lg font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3 pt-2 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2563EB]" />
              Optional Topic Preferences
            </h2>

            {/* TOPIC TOGGLES */}
            {[
              { key: 'opportunity_alerts', title: 'Opportunity Alerts', desc: 'Get notified when new internships and job listings are published.' },
              { key: 'event_updates', title: 'Event & Community Updates', desc: 'Receive announcements for upcoming events and workshops.' },
              { key: 'session_updates', title: 'Session & Webinar Reminders', desc: 'Get pre-session notifications and schedule reminders.' },
              { key: 'application_updates', title: 'Application Tracking Notifications', desc: 'Alerts regarding your internship and job submission milestones.' },
              { key: 'community_updates', title: 'Community Showcase Alerts', desc: 'Updates on talent showcases, projects, and ambassador programs.' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-[#E2E8F0]">
                <div>
                  <p className="text-sm font-extrabold text-[#2563EB]">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={() => handleToggle(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]" />
                </label>
              </div>
            ))}

            {/* SAVE BUTTON */}
            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-all border border-[#2563EB]/50 shadow-md disabled:opacity-50"
              >
                {saving ? 'Saving Preferences...' : 'Save Notification Preferences'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
