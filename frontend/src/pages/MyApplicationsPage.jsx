import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { FileText, ArrowRight, CheckCircle2, Clock, Loader2, Sparkles } from 'lucide-react';

const MyApplicationsPage = () => {
  const [apps, setApps] = useState([]);
  const [counts, setCounts] = useState({ total: 0, under_review: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMyApplications()
      .then((res) => {
        setApps(res.applications || []);
        if (res.counts) setCounts(res.counts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-[#2563EB] text-[#F8FAFC] rounded-3xl p-8 border-4 border-[#2563EB] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] text-[#2563EB] text-xs font-bold uppercase">
              <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Application Tracker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">
              My Applications
            </h1>
            <p className="text-xs sm:text-sm text-gray-200">
              Track the status of your submitted internship and project applications.
            </p>
          </div>

          <div className="flex gap-4 text-center">
            <div className="bg-[#F8FAFC] px-4 py-2 rounded-2xl border border-[#2563EB]/30">
              <div className="text-xl font-extrabold text-[#FFFFFF]">{counts.total}</div>
              <div className="text-[10px] uppercase font-bold text-[#2563EB]">Total Submitted</div>
            </div>
            <div className="bg-[#F8FAFC] px-4 py-2 rounded-2xl border border-[#2563EB]/30">
              <div className="text-xl font-extrabold text-[#2563EB]">{counts.shortlisted}</div>
              <div className="text-[10px] uppercase font-bold text-[#2563EB]">Shortlisted</div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
            <p className="text-xs font-semibold text-[#64748B]">Loading applications list...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && apps.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4">
            <FileText className="w-16 h-16 text-[#2563EB]/30 mx-auto" />
            <h3 className="text-xl font-bold text-[#2563EB]">You haven't applied to any opportunities yet</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Find internships, campus ambassador leads, and projects in the SS Opportunities directory.
            </p>
            <Link to="/opportunities" className="inline-block px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs">
              Find Opportunities
            </Link>
          </div>
        )}

        {/* APPLICATIONS LIST */}
        {!loading && apps.length > 0 && (
          <div className="space-y-4">
            {apps.map((app) => {
              const opp = app.opportunity;
              if (!opp) return null;

              const statusBadge = 
                app.status === 'SHORTLISTED' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#E2E8F0]' :
                app.status === 'SELECTED' ? 'bg-[#2563EB] text-white border-[#1D4ED8]' :
                app.status === 'REJECTED' ? 'bg-red-500/10 text-red-800 border-red-200' :
                'bg-blue-500/10 text-blue-900 border-blue-200';

              return (
                <div
                  key={app.id}
                  className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#2563EB] transition-all"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#2563EB] uppercase">{opp.organization_name}</span>
                      <span className="text-xs text-gray-400">-</span>
                      <span className="text-xs font-semibold text-[#2563EB]">{opp.category}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#2563EB]">{opp.title}</h3>
                    <p className="text-xs text-[#64748B]">Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto shrink-0">
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Status</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${statusBadge}`}>
                        {app.status}
                      </span>
                    </div>

                    <Link
                      to={`/student/applications/${app.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 border border-[#2563EB]/40"
                    >
                      <span>View Application</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplicationsPage;
