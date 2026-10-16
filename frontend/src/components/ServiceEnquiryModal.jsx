import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, FileText, Upload, AlertCircle } from 'lucide-react';
import { submitServiceEnquiry, getMe } from '../services/api';

const ServiceEnquiryModal = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    enquiry_type: 'STUDENT',
    requirement: '',
    preferred_contact: 'Email',
    expected_timeline: '',
    service_name: service ? service.title : 'General Enquiry'
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);
      setFormData(prev => ({
        ...prev,
        service_name: service ? service.title : 'General Enquiry'
      }));

      // Pre-fill user data if logged in
      const token = localStorage.getItem('access_token');
      if (token) {
        getMe()
          .then(res => {
            if (res.data?.success && res.data.user) {
              const u = res.data.user;
              const profile = u.profile || {};
              setFormData(prev => ({
                ...prev,
                full_name: profile.full_name || `${u.first_name || ''} ${u.last_name || ''}`.strip() || '',
                email: u.email || '',
                phone: profile.phone_number || '',
                organization: profile.college || ''
              }));
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

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

      const slug = service ? service.slug : null;
      const res = await submitServiceEnquiry(slug, payload, isMultipart);

      if (res.data?.success) {
        setSuccessData(res.data);
      } else {
        setError(res.data?.message || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "An error occurred while submitting your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#2563EB]/15 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">Enquiry Received!</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Thank you for reaching out to Struggle of Student. Our team will review your requirement and contact you soon.
            </p>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 inline-block">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                Your Reference Number
              </span>
              <span className="text-2xl font-black text-[#2563EB] font-mono">
                {successData.reference_number || 'SS-ENQ-SUCCESS'}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Save this reference number to track your enquiry in your student dashboard.
            </p>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                Service Enquiry
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] mt-1">
                {service ? service.title : 'Submit a Service Enquiry'}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Fill out your requirement below. We'll connect you with practical solutions.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Rahul Kumar"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">College / Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="IIT Delhi / Tech Club"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">I Am Enquiring As</label>
                  <select
                    name="enquiry_type"
                    value={formData.enquiry_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  >
                    <option value="STUDENT">Student / Individual</option>
                    <option value="COLLEGE">College / University</option>
                    <option value="ORGANIZATION">Organization / Startup</option>
                    <option value="COMMUNITY">Community / Fest Group</option>
                    <option value="PARTNERSHIP">Partnership Request</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Contact</label>
                  <select
                    name="preferred_contact"
                    value={formData.preferred_contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Requirement Details *</label>
                <textarea
                  name="requirement"
                  required
                  rows="3"
                  value={formData.requirement}
                  onChange={handleChange}
                  placeholder="Describe what solution or service you are looking for..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Expected Timeline</label>
                <input
                  type="text"
                  name="expected_timeline"
                  value={formData.expected_timeline}
                  onChange={handleChange}
                  placeholder="e.g. Immediate, Within 2 weeks, Next month"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attachment (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">
                    <Upload className="w-4 h-4 text-[#2563EB]" />
                    Choose File
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  {attachment && (
                    <span className="text-xs text-gray-600 truncate max-w-xs">
                      {attachment.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow hover:bg-[#2563EB]/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#2563EB]" />
                      Submit Service Enquiry
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

export default ServiceEnquiryModal;
