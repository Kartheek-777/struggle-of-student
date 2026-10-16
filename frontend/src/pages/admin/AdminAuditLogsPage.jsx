import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminAuditLogs } from '../../services/api';
import { History, Search, Filter, Clock, RefreshCw, Shield } from 'lucide-react';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAdminAuditLogs({
        page, module: moduleFilter !== 'all' ? moduleFilter : undefined
      });
      if (res.data && res.data.success) {
        setLogs(res.data.logs);
        setTotalCount(res.data.total_count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, moduleFilter]);

  return (
    <AdminLayout title="Audit Trail & System Logs">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">System Audit Log</h2>
            <p className="text-xs text-gray-500">Append-only security log recording administrative publications, suspensions, and state changes.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <select
              value={moduleFilter}
              onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] font-bold text-[#2563EB]"
            >
              <option value="all">All Modules</option>
              <option value="USERS">USERS</option>
              <option value="OPPORTUNITIES">OPPORTUNITIES</option>
              <option value="EVENTS">EVENTS</option>
              <option value="MODERATION">MODERATION</option>
              <option value="SUPPORT">SUPPORT</option>
              <option value="SETTINGS">SETTINGS</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
              <p className="text-xs font-bold">Loading Audit Trail...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin & Role</th>
                    <th className="py-3 px-4">Action Performed</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Record Target</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4 text-gray-500 font-medium">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{log.admin_name}</p>
                        <p className="text-[10px] text-[#2563EB] font-semibold">{log.admin_role}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">{log.action}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px]">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{log.record_repr || log.record_id || '-'}</td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[10px]">{log.ip_address || 'Internal'}</td>
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

export default AdminAuditLogsPage;
