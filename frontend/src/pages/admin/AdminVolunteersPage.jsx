import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminVolunteers, updateAdminVolunteerStatus } from '../../services/api';
import { HandHeart, Filter, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const AdminVolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await getAdminVolunteers({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data && res.data.success) {
        setVolunteers(res.data.volunteers);
      }
    } catch (err) {
      console.error('Fetch volunteers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const handleStatus = async (id, statusVal) => {
    try {
      const res = await updateAdminVolunteerStatus(id, { status: statusVal });
      setMsg({ type: 'success', text: res.data.message });
      fetchVolunteers();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update volunteer status.' });
    }
  };

  return (
    <AdminLayout title="Volunteer Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Event Volunteer Applications</h2>
            <p className="text-xs text-gray-500">Approve, reject, waitlist, or mark completed for event volunteers.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[#2563EB]"
            >
              <option value="all">All Volunteer Statuses</option>
              <option value="APPLIED">APPLIED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="WITHDRAWN">WITHDRAWN</option>
            </select>
          </div>
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
              <p className="text-xs font-bold">Loading Volunteers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Event & Role</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {volunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-[#2563EB]">{vol.student_name}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#2563EB]">{vol.event_title}</p>
                        <p className="text-[10px] text-[#2563EB] font-semibold">{vol.role_title}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-medium">
                        {new Date(vol.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          vol.status === 'ACCEPTED' ? 'bg-[#2563EB]/15 text-[#2563EB]' :
                          vol.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatus(vol.id, 'ACCEPTED')}
                            className="px-2 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(vol.id, 'REJECTED')}
                            className="px-2 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px]"
                          >
                            Reject
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

export default AdminVolunteersPage;
