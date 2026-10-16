import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminEnquiries, updateAdminEnquiryStatus } from '../../services/api';
import { MessageSquare, Filter, RefreshCw } from 'lucide-react';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getAdminEnquiries({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data && res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatus = async (id, st) => {
    try {
      const res = await updateAdminEnquiryStatus(id, { status: st });
      setMsg({ type: 'success', text: res.data.message });
      fetchEnquiries();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update enquiry status.' });
    }
  };

  return (
    <AdminLayout title="Enquiry Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Service & Partnership Enquiries</h2>
            <p className="text-xs text-gray-500">Track and manage inbound student, college, and corporate service enquiries.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[#2563EB]"
            >
              <option value="all">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="COMPLETED">COMPLETED</option>
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
              <p className="text-xs font-bold">Loading Enquiries...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref & Contact</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Requirement</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{enq.reference_number}</p>
                        <p className="font-semibold text-gray-700">{enq.full_name} ({enq.email})</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">
                        {enq.service_title || enq.service_name || 'General Service'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-600">
                        {enq.requirement}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatus(enq.id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[11px] text-[#2563EB]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
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

export default AdminEnquiriesPage;
