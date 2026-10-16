import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent, staffCreateZoomMeeting } from '../../services/api';
import { Calendar, Plus, Video, Users, Edit3, Trash2, RefreshCw, X, CheckCircle, AlertCircle } from 'lucide-react';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEv, setEditingEv] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '', category: 'Workshop', session_type: 'WORKSHOP',
    short_description: '', description: '', organizer: 'Struggle of Student (SS)',
    mode: 'Online', location: 'Online Zoom', meeting_provider: 'ZOOM',
    participant_capacity: 100, volunteer_capacity: 10, status: 'REGISTRATION_OPEN'
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAdminEvents({ page });
      if (res.data && res.data.success) {
        setEvents(res.data.events);
        setTotalCount(res.data.total_count);
      }
    } catch (err) {
      console.error('Fetch events error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const handleCreateZoom = async (id) => {
    try {
      const res = await staffCreateZoomMeeting(id);
      setMsg({ type: 'success', text: res.data.message || 'Zoom meeting created successfully.' });
      fetchEvents();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Zoom API not configured or failed.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMsg(null);
    try {
      if (editingEv) {
        await updateAdminEvent(editingEv.id, formData);
        setMsg({ type: 'success', text: 'Event updated.' });
      } else {
        await createAdminEvent(formData);
        setMsg({ type: 'success', text: 'Event created.' });
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save event.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel or delete this event?')) return;
    try {
      const res = await deleteAdminEvent(id);
      setMsg({ type: 'success', text: res.data.message });
      fetchEvents();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete event.' });
    }
  };

  return (
    <AdminLayout title="Event & Session Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Events & Online Masterclasses</h2>
            <p className="text-xs text-gray-500">Manage live technical workshops, webinars, Zoom links, and capacity tracking.</p>
          </div>

          <button
            onClick={() => { setEditingEv(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8]"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Create Event / Session</span>
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
              <p className="text-xs font-bold">Loading Events...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Type & Mode</th>
                    <th className="py-3 px-4">Capacity & Registrations</th>
                    <th className="py-3 px-4">Zoom / Meeting</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{ev.title}</p>
                        <p className="text-[10px] text-gray-500">{new Date(ev.start_datetime).toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#2563EB] font-bold text-[10px]">
                          {ev.session_type} ({ev.mode})
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">
                        {ev.registered_count} / {ev.participant_capacity} Registered
                      </td>
                      <td className="py-3 px-4">
                        {ev.zoom_meeting_id ? (
                          <span className="text-[10px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-md">
                            ID: {ev.zoom_meeting_id}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCreateZoom(ev.id)}
                            className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-[10px]"
                          >
                            Create Zoom
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#2563EB]/15 text-[#2563EB]">
                          {ev.effective_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminEventsPage;
