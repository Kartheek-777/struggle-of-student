import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Download, Calendar, Users, Briefcase, Award, CheckCircle2, TrendingUp, ShieldCheck, ArrowLeft, RefreshCw
} from 'lucide-react';
import { getAdminAnalytics, exportAdminAnalyticsCsv } from '../../services/api';

const AdminAnalyticsPage = () => {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAnalytics({ period });
      setData(res.data || res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load platform analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blobRes = await exportAdminAnalyticsCsv();
      const url = window.URL.createObjectURL(new Blob([blobRes.data || blobRes]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ss_analytics_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export CSV:", err);
      alert("CSV export failed. Ensure appropriate admin permissions.");
    } finally {
      setExporting(false);
    }
  };

  const kpis = data?.kpis || {};
  const timeline = data?.charts?.timeline || [];
  const maxTimelineRegs = Math.max(1, ...timeline.map(t => t.registrations || 0));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-6">
        
        {/* TOP NAV */}
        <div className="flex items-center justify-between">
          <Link 
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Control Panel
          </Link>

          <span className="px-3 py-1 rounded-full bg-[#2563EB] text-[#2563EB] text-xs font-extrabold border border-[#2563EB]/40 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Platform Intelligence Engine
          </span>
        </div>

        {/* HEADER & CONTROLS BANNER */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">Business & Community Analytics</h1>
              <p className="text-xs text-gray-600 mt-1">
                Real database aggregations for community growth, applications, placements, and engagement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto flex-wrap">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#E2E8F0] text-xs font-bold text-[#2563EB] focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>

            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-all flex items-center gap-2 border border-[#2563EB]/50 shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#2563EB]" />
              {exporting ? 'Exporting...' : 'Export Report (CSV)'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-white/50 rounded-3xl border border-[#E2E8F0]">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#2563EB]">Computing real database aggregations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 text-red-800 text-xs font-bold">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* KPI CARDS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Total Community</span>
                <p className="text-3xl font-extrabold text-[#2563EB]">{kpis.total_students || 0}</p>
                <p className="text-[11px] text-gray-500 font-semibold">+{kpis.new_registrations || 0} in selected period</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Total Applications</span>
                <p className="text-3xl font-extrabold text-[#2563EB]">{kpis.total_applications || 0}</p>
                <p className="text-[11px] text-[#2563EB] font-bold">{kpis.app_conversion_rate || 0}% Conversion Rate</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Event Registrations</span>
                <p className="text-3xl font-extrabold text-[#2563EB]">{kpis.event_registrations || 0}</p>
                <p className="text-[11px] text-gray-500 font-semibold">{kpis.attendance_rate || 0}% Attendance Rate</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Placed Students</span>
                <p className="text-3xl font-extrabold text-[#2563EB]">{kpis.placed_students || 0}</p>
                <p className="text-[11px] text-gray-500 font-semibold">Across {kpis.placement_companies || 0} Companies</p>
              </div>
            </div>

            {/* TIMELINE VISUAL CHART */}
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-base font-extrabold text-[#2563EB]">Community Activity & Registration Trend</h3>
                </div>
                <span className="text-xs text-gray-500 font-medium">Period: {data?.date_range?.start} to {data?.date_range?.end}</span>
              </div>

              {timeline.length === 0 ? (
                <p className="text-xs text-center text-gray-500 py-8">No registration data recorded for this timeframe.</p>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 px-2 bg-white/60 rounded-2xl border border-gray-200">
                    {timeline.map((item, idx) => {
                      const heightPercent = Math.min(100, Math.max(15, (item.registrations / maxTimelineRegs) * 100));
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.registrations}
                          </span>
                          <div 
                            className="w-full max-w-[36px] bg-[#2563EB] rounded-t-lg transition-all duration-300 group-hover:bg-[#1D4ED8]"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] font-semibold text-gray-500 truncate w-full text-center">
                            {item.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECONDARY METRICS BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CONTENT & VOLUNTEER PARTICIPATION */}
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3">
                  Engagement & Volunteer Participation
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Approved Student Projects</span>
                    <span className="font-extrabold text-gray-900">{kpis.approved_projects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Talent Showcases</span>
                    <span className="font-extrabold text-gray-900">{kpis.talent_submissions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Approved Volunteers</span>
                    <span className="font-extrabold text-gray-900">{kpis.approved_volunteers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Open Support Tickets</span>
                    <span className="font-extrabold text-amber-700">{kpis.open_support_requests || 0}</span>
                  </div>
                </div>
              </div>

              {/* PLACEMENT & SERVICE METRICS */}
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#2563EB] border-b border-[#E2E8F0] pb-3">
                  Placement Outcomes & Service Enquiries
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Verified Placed Students</span>
                    <span className="font-extrabold text-[#2563EB]">{kpis.placed_students || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Hiring Companies</span>
                    <span className="font-extrabold text-gray-900">{kpis.placement_companies || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Average Package (LPA)</span>
                    <span className="font-extrabold text-[#2563EB]">{kpis.avg_package_lpa || 0} LPA</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                    <span className="font-bold text-[#2563EB]">Total Service Enquiries</span>
                    <span className="font-extrabold text-gray-900">{kpis.service_enquiries || 0}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
