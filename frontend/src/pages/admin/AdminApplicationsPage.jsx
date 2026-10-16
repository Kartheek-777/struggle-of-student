import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminApplications, updateAdminApplicationStatus } from '../../services/api';
import { FileText, Search, Filter, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAdminApplications({
        page, status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data && res.data.success) {
        setApplications(res.data.applications);
        setTotalCount(res.data.total_count);
      }
    } catch (err) {
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateAdminApplicationStatus(id, { status: newStatus });
      setMsg({ type: 'success', text: res.data.message });
      fetchApplications();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update application status.' });
    }
  };

  return (
    <AdminLayout title="Application Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Student Applications Tracker</h2>
            <p className="text-xs text-gray-500">Review student resumes, cover letters, and update application review statuses.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[#2563EB]"
            >
              <option value="all">All Application Statuses</option>
              <option value="APPLIED">APPLIED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
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
              <p className="text-xs font-bold">Loading Applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold">No student applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{app.applicant_name}</p>
                        <p className="text-[10px] text-gray-500">{app.applicant_email}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">
                        {app.opportunity?.title || 'Opportunity'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-medium">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                          app.status === 'SHORTLISTED' || app.status === 'ACCEPTED' ? 'bg-[#2563EB]/15 text-[#2563EB]' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[11px] text-[#2563EB]"
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
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

export default AdminApplicationsPage;
