import React, { useState, useEffect } from 'react';
import { 
  Building2, Award, Users, CheckCircle2, ShieldCheck, 
  Send, Sparkles, AlertCircle, Clock, Star, Calendar 
} from 'lucide-react';
import { applyCampusAmbassador, getCampusAmbassadorStatus } from '../services/api';

const CampusAmbassadorPage = () => {
  const [existingApp, setExistingApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    college: '',
    campus_location: '',
    why_ambassador: '',
    previous_experience: '',
    social_links: '',
    availability: '',
    expected_contribution: '',
  });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getCampusAmbassadorStatus();
      setExistingApp(res.data);
    } catch (err) {
      console.log("No active ambassador application");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await applyCampusAmbassador(formData);
      setExistingApp(res.data);
      setSuccessMsg("Application submitted successfully! Our team will review your profile.");
      setShowForm(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to submit application. Please check form fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <div className="bg-[#2563EB]/10 border border-[#E2E8F0] text-[#2563EB] p-6 rounded-2xl mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={32} className="text-[#2563EB] shrink-0" />
              <div>
                <h4 className="font-bold text-lg">Congratulations! You are an Official SS Campus Ambassador</h4>
                <p className="text-xs text-[#2563EB]">Representing your college in the Struggle of Student ecosystem.</p>
              </div>
            </div>
            <span className="bg-[#2563EB] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Active Ambassador</span>
          </div>
        );
      case 'SHORTLISTED':
        return (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-2xl mb-8 flex items-center gap-3">
            <Star size={28} className="text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-[#0F172A]">You've Been Shortlisted!</h4>
              <p className="text-xs text-blue-700">Our community team is processing your application for final onboarding.</p>
            </div>
          </div>
        );
      case 'UNDER_REVIEW':
      case 'APPLIED':
        return (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl mb-8 flex items-center gap-3">
            <Clock size={28} className="text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-[#0F172A]">Application Received & Under Review</h4>
              <p className="text-xs text-amber-700">Status: {existingApp?.status_display || 'Submitted'}. We will notify you once reviewed.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 size={14} /> SS Campus Leadership
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Become an SS Campus Ambassador
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Represent SS at your college and help students discover opportunities, events and community initiatives.
          </p>
        </div>

        {/* Existing application alert */}
        {existingApp && getStatusDisplay(existingApp.status)}

        {/* Program Benefits & Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-2">Community Building</h3>
            <p className="text-gray-600 text-sm">
              Connect students at your institution with real opportunities, hackathons, and skill workshops.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#1D4ED8]/10 text-[#2563EB] rounded-xl flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-2">Professional Exposure</h3>
            <p className="text-gray-600 text-sm">
              Gain practical leadership experience, event management skills, and verified SS Certificates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#0F172A] mb-2">Recognition & Network</h3>
            <p className="text-gray-600 text-sm">
              Build a public SS Ambassador Profile and build networks with student leads across India.
            </p>
          </div>
        </div>

        {/* What You Do vs Eligibility */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Program Responsibilities & Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[#2563EB] text-base mb-3">Key Responsibilities</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Promote SS opportunities and events across campus networks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Help onboard fellow students and creators into the SS community.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Organize or co-host online/offline SS workshops and meetups.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#2563EB] text-base mb-3">Eligibility & Commitment</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Currently enrolled student in any college, university, or degree program.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Strong communication skills and passion for student empowerment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Estimated commitment: 3-5 hours per week.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application CTA / Form */}
        {!existingApp ? (
          <div className="bg-gradient-to-br from-[#2563EB] to-[#0F172A] text-white rounded-3xl p-8 sm:p-10 shadow-lg">
            {!showForm ? (
              <div className="text-center max-w-2xl mx-auto">
                <Sparkles size={40} className="mx-auto text-[#2563EB] mb-4" />
                <h3 className="text-3xl font-extrabold mb-3">Ready to Lead Your Campus?</h3>
                <p className="text-gray-300 text-sm mb-8">
                  Apply now to become an official SS Campus Ambassador. Make a direct impact on your student community.
                </p>
                <button
                  onClick={() => {
                    const token = localStorage.getItem('access');
                    if (!token) {
                      window.location.href = '/login';
                      return;
                    }
                    setShowForm(true);
                  }}
                  className="bg-[#1D4ED8] hover:bg-[#b08422] text-gray-900 font-bold px-8 py-3.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Send size={18} /> Apply for Campus Ambassador
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-2">Campus Ambassador Application</h3>
                <p className="text-xs text-gray-300 mb-6">Complete your application using your SS profile data.</p>

                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl text-xs font-semibold mb-4">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4 text-gray-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">College / University Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. IIT Delhi / Delhi University"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Campus Location / City *</label>
                      <input
                        type="text"
                        required
                        value={formData.campus_location}
                        onChange={(e) => setFormData({ ...formData, campus_location: e.target.value })}
                        placeholder="e.g. New Delhi"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Why do you want to become an SS Ambassador? *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.why_ambassador}
                      onChange={(e) => setFormData({ ...formData, why_ambassador: e.target.value })}
                      placeholder="Share your enthusiasm for helping students and building community..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Previous Leadership / Event Experience</label>
                      <textarea
                        rows={2}
                        value={formData.previous_experience}
                        onChange={(e) => setFormData({ ...formData, previous_experience: e.target.value })}
                        placeholder="Clubs, societies, hackathons managed..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1">Expected Contribution & Weekly Hours</label>
                      <textarea
                        rows={2}
                        value={formData.expected_contribution}
                        onChange={(e) => setFormData({ ...formData, expected_contribution: e.target.value })}
                        placeholder="e.g. 4 hours/week, organizing workshops..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-7 py-2.5 bg-[#1D4ED8] text-gray-900 rounded-xl text-sm font-bold hover:bg-[#b08422]"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CampusAmbassadorPage;
