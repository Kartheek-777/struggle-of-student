import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminReports } from '../../services/api';
import { BarChart3, TrendingUp, Users, Calendar, RefreshCw } from 'lucide-react';

const AdminReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAdminReports({ days });
      if (res.data && res.data.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [days]);

  return (
    <AdminLayout title="Platform Analytics & Reports">
      <div className="space-y-6">
        
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#2563EB]">Operational Metrics & Growth Reports</h2>
            <p className="text-xs text-gray-500">Real-time database statistics, user growth trends, and activity distribution.</p>
          </div>

          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
            <p className="text-xs font-bold">Generating Reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Opportunity Categories</h3>
              <div className="space-y-2 text-xs">
                {reportData?.opportunity_categories?.map((c) => (
                  <div key={c.category} className="flex justify-between items-center p-2 rounded-lg bg-[#FFFFFF]">
                    <span className="font-bold text-[#2563EB]">{c.category}</span>
                    <span className="font-black text-[#2563EB]">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Event Session Types</h3>
              <div className="space-y-2 text-xs">
                {reportData?.event_type_breakdown?.map((t) => (
                  <div key={t.session_type} className="flex justify-between items-center p-2 rounded-lg bg-[#FFFFFF]">
                    <span className="font-bold text-[#2563EB]">{t.session_type}</span>
                    <span className="font-black text-[#2563EB]">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Support Request Categories</h3>
              <div className="space-y-2 text-xs">
                {reportData?.support_category_breakdown?.map((s) => (
                  <div key={s.category} className="flex justify-between items-center p-2 rounded-lg bg-[#FFFFFF]">
                    <span className="font-bold text-[#2563EB]">{s.category}</span>
                    <span className="font-black text-[#2563EB]">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
