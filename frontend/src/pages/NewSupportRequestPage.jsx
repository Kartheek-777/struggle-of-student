import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  HelpCircle, Send, Upload, CheckCircle2, ArrowLeft, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { createSupportRequest } from '../services/api';

const categoriesList = [
  'Career', 'Education', 'Internship', 'Job Search', 'Skills', 
  'Projects', 'College Life', 'Events', 'Technology', 'Community', 
  'Financial Guidance', 'General', 'Other'
];

const NewSupportRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'General';

  const [formData, setFormData] = useState({
    category: initialCategory,
    subject: '',
    description: '',
    preferred_contact: 'Email',
    priority: 'NORMAL'
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login?redirect=/support/new');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload;
      let isMultipart = false;

      if (attachment) {
        isMultipart = true;
        payload = new FormData();
        Object.keys(formData).forEach(key => {
          payload.append(key, formData[key]);
        });
        payload.append('attachment', attachment);
      } else {
        payload = formData;
      }

      const res = await createSupportRequest(payload, isMultipart);

      if (res.data?.success) {
        setSuccessData(res.data);
      } else {
        setError(res.data?.message || "Failed to submit support request.");
      }
    } catch (err) {
      console.error("Support submission error:", err);
      setError(err.response?.data?.message || "An error occurred while submitting your support request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/support"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support Overview
        </Link>

        {successData ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-[#2563EB]/15 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Support Request Created!</h2>
            <p className="text-gray-600 mt-2 text-sm">
              Your support ticket has been submitted to the SS Guidance Team.
            </p>

            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                Ticket Reference Number
              </span>
              <span className="text-2xl font-black text-[#2563EB] font-mono">
                {successData.reference_number || 'SS-SUP-SUCCESS'}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              You can track responses and add updates to this request at any time.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/student/support/${successData.data?.id || successData.reference_number}`}
                className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition"
              >
                View Ticket Details
              </Link>
              <Link
                to="/student/support"
                className="px-6 py-3 bg-gray-100 text-[#0F172A] font-bold rounded-xl hover:bg-gray-200 transition"
              >
                My Support Requests
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider mb-1">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                Student Support Ticket
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Request Student Guidance</h1>
              <p className="text-xs text-gray-600 mt-1">
                Describe the problem you are facing. All requests are confidential and visible only to you and authorized staff.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Problem Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Need help preparing resume for software internship"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what challenges you are facing, what steps you have already tried, and what guidance or resource you are looking for..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Contact Method</label>
                  <select
                    name="preferred_contact"
                    value={formData.preferred_contact}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Dashboard">Platform Dashboard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Urgency Level</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attachment (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">
                    <Upload className="w-4 h-4 text-[#2563EB]" />
                    Upload File / Document
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  {attachment && (
                    <span className="text-xs text-gray-600 truncate max-w-xs font-mono">
                      {attachment.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#2563EB] text-white font-bold rounded-xl shadow-md hover:bg-[#2563EB]/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Creating Ticket...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#2563EB]" />
                      Request Support
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSupportRequestPage;
