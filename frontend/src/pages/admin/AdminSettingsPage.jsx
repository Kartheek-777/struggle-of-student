import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminSiteSettings, updateAdminSiteSettings } from '../../services/api';
import { Settings, Save, RefreshCw, CheckCircle, Shield } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    organization_name: '', tagline: '', contact_email: '', contact_phone: '',
    address: '', linkedin_url: '', instagram_url: '', youtube_url: '',
    default_session_capacity: 100, default_event_capacity: 200,
    enable_community_moderation: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getAdminSiteSettings().then((res) => {
      if (res.data && res.data.success) {
        setSettings(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await updateAdminSiteSettings(settings);
      setMsg({ type: 'success', text: res.data.message });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Platform Settings">
      <div className="space-y-6 max-w-4xl">
        
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <h2 className="text-xl font-black text-[#2563EB]">Platform & Organization Defaults</h2>
          <p className="text-xs text-gray-500">Configure global SS identity info, contact details, social links, and capacity defaults.</p>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
            <p className="text-xs font-bold">Loading Settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6 text-xs">
            
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider pb-2 border-b border-gray-100">Organization Identity</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={settings.organization_name}
                    onChange={(e) => setSettings({ ...settings, organization_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider pb-2 border-b border-gray-100">Contact Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider pb-2 border-b border-gray-100">Event & Moderation Defaults</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Default Session Capacity</label>
                  <input
                    type="number"
                    value={settings.default_session_capacity}
                    onChange={(e) => setSettings({ ...settings, default_session_capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Default Event Capacity</label>
                  <input
                    type="number"
                    value={settings.default_event_capacity}
                    onChange={(e) => setSettings({ ...settings, default_event_capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2563EB]">
                <input
                  type="checkbox"
                  checked={settings.enable_community_moderation}
                  onChange={(e) => setSettings({ ...settings, enable_community_moderation: e.target.checked })}
                  className="rounded text-[#2563EB]"
                />
                <span>Enable Community Moderation Queue (Requires staff approval before user projects/talent go public)</span>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] inline-flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4 text-[#2563EB]" />
                <span>{saving ? 'Saving Settings...' : 'Save Site Settings'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
