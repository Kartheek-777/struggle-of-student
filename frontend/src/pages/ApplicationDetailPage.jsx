import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, MapPin, DollarSign, Loader2, Sparkles, ExternalLink 
} from 'lucide-react';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService.getApplicationDetail(id)
      .then((res) => {
        setAppData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Application record not found.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <p className="text-xs font-semibold text-[#64748B]">Loading application record...</p>
      </div>
    );
  }

  if (error || !appData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#2563EB]">Application Record Not Found</h2>
        <p className="text-xs text-[#64748B] max-w-md mx-auto">{error}</p>
        <Link to="/student/applications" className="inline-block px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs">
          Back to My Applications
        </Link>
      </div>
    );
  }

  const opp = appData.opportunity;
  const statusSteps = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED'];
  const currentStepIndex = statusSteps.indexOf(appData.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/student/applications" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </Link>

        {/* HEADER */}
        <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase">{opp?.organization_name}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{opp?.title}</h1>
            </div>

            <div className="px-4 py-2 rounded-full bg-[#2563EB] text-[#2563EB] font-extrabold text-xs tracking-wider uppercase border border-[#2563EB]/40">
              Status: {appData.status}
            </div>
          </div>

          {/* TIMELINE */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#2563EB] uppercase">Application Timeline</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {statusSteps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                return (
                  <div key={step} className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    isPassed 
                      ? 'bg-[#2563EB] text-[#F8FAFC] border-[#2563EB]' 
                      : 'bg-[#F8FAFC] text-gray-400 border-[#E2E8F0]'
                  }`}>
                    <div>{step.replace('_', ' ')}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{isPassed ? ' Active' : 'Pending'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETAILS CONTAINER */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <h3 className="text-lg font-bold text-[#2563EB] border-b border-[#E2E8F0] pb-2">
            Submitted Application Information
          </h3>

          <div className="space-y-4 text-xs text-[#0F172A]">
            <div>
              <span className="font-bold text-[#2563EB] uppercase block mb-1">Applicant Name</span>
              <span className="text-sm font-semibold">{appData.applicant_name} ({appData.college})</span>
            </div>

            <div>
              <span className="font-bold text-[#2563EB] uppercase block mb-1">Applied Date</span>
              <span>{new Date(appData.applied_at).toLocaleString()}</span>
            </div>

            <div>
              <span className="font-bold text-[#2563EB] uppercase block mb-1">Cover Message</span>
              <p className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] leading-relaxed whitespace-pre-line">
                {appData.cover_message || 'No cover message attached.'}
              </p>
            </div>

            {appData.portfolio_url && (
              <div>
                <span className="font-bold text-[#2563EB] uppercase block mb-1">Portfolio Link</span>
                <a href={appData.portfolio_url} target="_blank" rel="noreferrer" className="text-[#2563EB] font-bold underline inline-flex items-center gap-1">
                  <span>{appData.portfolio_url}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicationDetailPage;
