import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  MapPin, DollarSign, Calendar, Clock, Bookmark, BookmarkCheck, 
  ArrowLeft, CheckCircle2, ShieldAlert, Loader2, Sparkles, Send, FileText, Upload, X 
} from 'lucide-react';

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  // Application Form State
  const [coverMessage, setCoverMessage] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState('');
  const [appSuccess, setAppSuccess] = useState(false);

  const fetchDetail = () => {
    setLoading(true);
    apiService.getOpportunityDetail(id)
      .then((res) => {
        setOpp(res.data);
        if (res.data && res.data.portfolio_url) {
          setPortfolioUrl(res.data.portfolio_url);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setError('Opportunity not found or API error.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (profile?.portfolio_url) {
      setPortfolioUrl(profile.portfolio_url);
    }
  }, [profile]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }

    try {
      if (opp.is_saved) {
        await apiService.unsaveOpportunity(opp.id);
      } else {
        await apiService.saveOpportunity(opp.id);
      }
      fetchDetail();
    } catch (err) {
      console.error('Save toggle error:', err);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setAuthPromptOpen(true);
      return;
    }
    setApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setAppError('');
    setSubmittingApp(true);

    try {
      // If user provided a new resume file, upload it first
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await apiService.uploadResume(formData);
      }

      const res = await apiService.applyToOpportunity(opp.id, {
        cover_message: coverMessage,
        portfolio_url: portfolioUrl,
      });

      if (res.success) {
        setAppSuccess(true);
        fetchDetail();
      }
    } catch (err) {
      setAppError(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#2563EB]">Opportunity Not Found</h2>
        <p className="text-xs text-[#64748B] max-w-md mx-auto">{error}</p>
        <Link to="/opportunities" className="inline-block px-6 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs">
          Back to Opportunities Directory
        </Link>
      </div>
    );
  }

  const isClosed = opp.effective_status === 'CLOSED';
  const isApplied = opp.is_applied;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* BACK BUTTON */}
        <Link to="/opportunities" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Opportunities</span>
        </Link>

        {/* TWO-COLUMN DESKTOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            
            {/* HEADER */}
            <div className="space-y-3 border-b border-[#E2E8F0] pb-6">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase">
                  {opp.category}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                  opp.effective_status === 'CLOSED' ? 'bg-red-500/10 text-red-800 border-red-200' :
                  opp.effective_status === 'CLOSING_SOON' ? 'bg-amber-500/10 text-amber-800 border-amber-200' :
                  'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]'
                }`}>
                  {opp.effective_status}
                </span>
              </div>

              <div className="text-xs font-bold text-[#2563EB] uppercase">
                {opp.organization_name}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] leading-tight">
                {opp.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#0F172A] pt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  {opp.location} ({opp.mode})
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#2563EB]" />
                  {opp.stipend}
                </span>
                {opp.application_deadline && (
                  <span className="flex items-center gap-1.5 text-[#2563EB]">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                    Deadline: {opp.application_deadline}
                  </span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#2563EB]">About The Opportunity</h3>
              <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line">
                {opp.description || opp.short_description}
              </p>
            </div>

            {/* RESPONSIBILITIES */}
            {opp.responsibilities && (
              <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
                <h3 className="text-lg font-bold text-[#2563EB]">Key Responsibilities</h3>
                <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                  {opp.responsibilities}
                </p>
              </div>
            )}

            {/* REQUIREMENTS & ELIGIBILITY */}
            <div className="space-y-4 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Requirements & Eligibility</h3>
              
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-3 text-xs text-[#0F172A]">
                <div>
                  <span className="font-bold text-[#2563EB] uppercase block mb-1">Eligible Students</span>
                  <span>{opp.eligibility}</span>
                </div>
                {opp.requirements && (
                  <div>
                    <span className="font-bold text-[#2563EB] uppercase block mb-1">Technical & Soft Requirements</span>
                    <span className="whitespace-pre-line">{opp.requirements}</span>
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS */}
            {opp.benefits && (
              <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
                <h3 className="text-lg font-bold text-[#2563EB]">Benefits & Perks</h3>
                <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                  {opp.benefits}
                </p>
              </div>
            )}

            {/* REQUIRED SKILLS */}
            <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opp.skills && opp.skills.length > 0 ? (
                  opp.skills.map((s) => (
                    <span key={s.id} className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold border border-[#2563EB]">
                      {s.name}
                    </span>
                  ))
                ) : (
                  opp.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold border border-[#2563EB]">
                      {tag.trim()}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: OPPORTUNITY SUMMARY & CTA CARD */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 sticky top-24">
            
            <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
              <h3 className="text-xl font-extrabold text-[#2563EB]">Opportunity Summary</h3>
              <p className="text-xs text-[#64748B]">Review deadline and submit your application.</p>
            </div>

            <div className="space-y-3 text-xs font-medium text-[#0F172A]">
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                <span className="text-gray-500 uppercase font-bold">Category</span>
                <span className="font-bold text-[#2563EB]">{opp.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                <span className="text-gray-500 uppercase font-bold">Mode</span>
                <span className="font-bold text-[#2563EB]">{opp.mode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                <span className="text-gray-500 uppercase font-bold">Location</span>
                <span className="font-bold text-[#2563EB]">{opp.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                <span className="text-gray-500 uppercase font-bold">Experience</span>
                <span className="font-bold text-[#2563EB]">{opp.experience_level}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                <span className="text-gray-500 uppercase font-bold">Stipend / Allowance</span>
                <span className="font-bold text-[#2563EB]">{opp.stipend}</span>
              </div>
              {opp.application_deadline && (
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]/60">
                  <span className="text-gray-500 uppercase font-bold">Deadline</span>
                  <span className="font-bold text-[#2563EB]">{opp.application_deadline}</span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {isApplied ? (
                <div className="w-full py-3.5 rounded-2xl bg-[#F8FAFC] text-white font-bold text-center text-xs shadow-md flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Submitted</span>
                </div>
              ) : isClosed ? (
                <div className="w-full py-3.5 rounded-2xl bg-gray-300 text-gray-700 font-bold text-center text-xs">
                  Applications Closed
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full py-4 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/50 shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#2563EB]" />
                  <span>APPLY NOW</span>
                </button>
              )}

              <button
                onClick={handleSaveToggle}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  opp.is_saved
                    ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                    : 'bg-[#F8FAFC] text-[#2563EB] border border-[#E2E8F0] hover:border-[#2563EB]'
                }`}
              >
                {opp.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{opp.is_saved ? 'Saved to My Profile ' : 'Save Opportunity'}</span>
              </button>
            </div>

            <div className="text-[11px] text-[#64748B] text-center pt-2">
              100% Free for verified student community members.
            </div>

          </div>

        </div>

      </div>

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => { setApplyModalOpen(false); setAppSuccess(false); }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#2563EB] hover:bg-[#2563EB]/10"
            >
              <X className="w-6 h-6" />
            </button>

            {appSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-[#2563EB] text-[#2563EB] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#2563EB]">Application Submitted!</h3>
                <p className="text-sm text-[#0F172A] leading-relaxed max-w-md mx-auto">
                  Your application for <span className="font-bold text-[#2563EB]">{opp.title}</span> at <span className="font-semibold">{opp.organization_name}</span> has been logged under status <span className="font-bold text-[#2563EB]">APPLIED</span>.
                </p>
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    to="/student/applications"
                    className="px-6 py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-sm text-center"
                  >
                    View My Applications
                  </Link>
                  <button
                    onClick={() => { setApplyModalOpen(false); setAppSuccess(false); }}
                    className="text-xs text-gray-500 font-semibold hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Apply for Opportunity</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#2563EB]">{opp.title}</h3>
                  <p className="text-xs text-[#64748B]">{opp.organization_name}</p>
                </div>

                {appError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-900 font-semibold">
                    {appError}
                  </div>
                )}

                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  
                  {/* APPLICANT PROFILE SUMMARY */}
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2 text-xs text-[#0F172A]">
                    <span className="font-bold text-[#2563EB] uppercase block">Applicant Profile Summary</span>
                    <div>Name: <span className="font-bold">{profile?.full_name}</span></div>
                    <div>College: <span className="font-semibold">{profile?.college}</span> ({profile?.course})</div>
                    <div>Email: {profile?.email}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                      Cover Message / Why are you a great fit?
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={coverMessage}
                      onChange={(e) => setCoverMessage(e.target.value)}
                      placeholder="Briefly introduce yourself and why you're interested in this role..."
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                      Portfolio / Work Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://myportfolio.com or GitHub link"
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                      Attach Resume (PDF / DOC)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                    />
                    <span className="text-[10px] text-gray-500 block mt-1">Optional: Attach a specific PDF resume for this application.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="w-full py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-sm shadow-md hover:bg-[#1D4ED8] flex items-center justify-center gap-2 border border-[#2563EB]/40"
                  >
                    {submittingApp ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#2563EB]" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* AUTH PROMPT MODAL FOR UNAUTHENTICATED USERS */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center mx-auto font-bold text-2xl">
              <Sparkles className="w-8 h-8 text-[#2563EB]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#2563EB]">Join SS to Apply & Save</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                You must be logged in to apply for opportunities and save them to your student profile.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-sm border border-[#2563EB]"
              >
                Join SS Community
              </Link>
              <Link
                to="/login"
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] font-bold text-xs"
              >
                Log In to Existing Account
              </Link>
            </div>

            <button
              onClick={() => setAuthPromptOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunityDetailPage;
