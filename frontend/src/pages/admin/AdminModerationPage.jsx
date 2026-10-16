import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminModerationQueue, updateAdminModerationAction } from '../../services/api';
import { ShieldCheck, Filter, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminModerationPage = () => {
  const [queue, setQueue] = useState({ talents: [], projects: [], stories: [], achievements: [], testimonials: [] });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [msg, setMsg] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await getAdminModerationQueue({ type: typeFilter, status: statusFilter });
      if (res.data && res.data.success) {
        setQueue(res.data.moderation_queue);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [typeFilter, statusFilter]);

  const handleAction = async (contentType, recordId, newStatus) => {
    setMsg(null);
    try {
      const res = await updateAdminModerationAction({
        content_type: contentType,
        record_id: recordId,
        status: newStatus
      });
      setMsg({ type: 'success', text: res.data.message });
      fetchQueue();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update moderation state.' });
    }
  };

  return (
    <AdminLayout title="Community Content Moderation">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Central Moderation Queue</h2>
            <p className="text-xs text-gray-500">Approve or reject student talent showcase, projects, hostel stories, achievements, and testimonials.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[#2563EB]"
            >
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="PUBLISHED">PUBLISHED / APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="all">ALL STATUSES</option>
            </select>
          </div>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* TALENT SHOWCASE QUEUE */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Talent Showcase Items ({queue.talents.length})</h3>
          </div>

          {queue.talents.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">No talent profiles pending review.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queue.talents.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#2563EB] uppercase">{item.category}</span>
                      <h4 className="font-extrabold text-[#2563EB] text-sm">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">By {item.student_name} ({item.college})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">{item.status}</span>
                  </div>

                  <p className="text-gray-700 line-clamp-2">{item.short_description || item.description}</p>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleAction('talent', item.id, 'PUBLISHED')}
                      className="px-3 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-[10px]"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleAction('talent', item.id, 'REJECTED')}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STUDENT PROJECTS QUEUE */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Student Projects ({queue.projects.length})</h3>
          </div>

          {queue.projects.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">No student projects pending review.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queue.projects.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#2563EB] uppercase">{item.category}</span>
                      <h4 className="font-extrabold text-[#2563EB] text-sm">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">By {item.author_name} ({item.author_college})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">{item.status}</span>
                  </div>

                  <p className="text-gray-700 line-clamp-2">{item.short_description}</p>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleAction('project', item.id, 'PUBLISHED')}
                      className="px-3 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-[10px]"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleAction('project', item.id, 'REJECTED')}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminModerationPage;
