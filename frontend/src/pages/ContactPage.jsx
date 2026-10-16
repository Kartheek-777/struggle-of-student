import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, 
  HelpCircle, Settings, Users, AlertCircle, Share2, Globe 
} from 'lucide-react';
import { submitContactMessage } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await submitContactMessage(formData);
      if (res.data?.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(res.data?.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      setError(err.response?.data?.message || "An error occurred while sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-semibold mb-4">
            <Mail className="w-4 h-4 text-[#2563EB]" />
            Get In Touch
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight sm:text-5xl">
            We'd Love to Hear From You
          </h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            Have a question about SS, want to partner with us, or need help finding resources? Reach out to the SS team!
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* LEFT COL: CONTACT INFO & QUICK CTAS */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-6">Contact Information</h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block">Official Email</span>
                    <a href="mailto:chantidepavath@gmail.com" className="text-gray-800 font-bold hover:text-[#2563EB] block">
                      chantidepavath@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block">Student Helpline</span>
                    <a href="tel:+919849603265" className="text-gray-800 font-bold hover:text-[#2563EB] block">
                      +91 98496 03265
                    </a>
                    <span className="text-[11px] text-[#2563EB] font-semibold block">Chanti Nelatalli (Founder & CEO)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block">Location</span>
                    <span className="text-gray-800 font-medium">Hyderabad, Telangana & Campus Chapters India</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block">Community Network</span>
                    <span className="text-gray-800 font-medium">Built by Students, For Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-[#2563EB] text-white rounded-3xl p-8 shadow-lg">
              <h4 className="text-lg font-extrabold mb-2">Looking for Something Specific?</h4>
              <p className="text-xs text-gray-200 mb-6 leading-relaxed">
                Use our specialized portals for faster responses and dedicated assistance.
              </p>

              <div className="space-y-3">
                <Link
                  to="/support/new"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-white" />
                    Facing a Student Problem?
                  </span>
                  <span>&rarr;</span>
                </Link>

                <Link
                  to="/services"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-white" />
                    Explore SS Services
                  </span>
                  <span>&rarr;</span>
                </Link>

                <Link
                  to="/community"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white" />
                    Join Community
                  </span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLS: CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Send Us a Message</h2>
              <p className="text-sm text-gray-600 mb-6">
                Fill out the form below. Our team reviews all incoming inquiries and responds promptly.
              </p>

              {success ? (
                <div className="p-8 text-center bg-[#2563EB]/10 rounded-2xl border border-[#E2E8F0]">
                  <CheckCircle2 className="w-12 h-12 text-[#2563EB] mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-[#0F172A]">Message Sent!</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Thank you for contacting SS. We have received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl hover:bg-[#2563EB]/90 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-200 mb-4">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Kumar"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Inquiry / Feedback / Partnership"
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl shadow hover:bg-[#2563EB]/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
