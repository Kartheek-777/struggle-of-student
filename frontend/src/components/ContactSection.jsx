import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Query', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Have a Question or an Idea?
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Whether you want to partner with SS, bring us to your campus, or ask a question- we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT CONTACT INFO */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 shadow-xs space-y-6">
            <h3 className="text-2xl font-black text-[#0F172A]">Reach Out to SS</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              We welcome student ideas, campus event inquiries, project collaborations, and mentorship requests.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2563EB]/20">
                  <Mail className="w-5 h-5 text-white stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#2563EB] uppercase">OFFICIAL EMAIL</div>
                  <a href="mailto:chantidepavath@gmail.com" className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB] hover:underline block">chantidepavath@gmail.com</a>
                  <div className="text-[11px] text-[#64748B] font-semibold">Founder & CEO Desk</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2563EB]/20">
                  <Phone className="w-5 h-5 text-white stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#2563EB] uppercase">STUDENT HELPLINE</div>
                  <a href="tel:+919849603265" className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB] hover:underline block">+91 98496 03265</a>
                  <div className="text-[11px] text-[#64748B] font-semibold">Direct Support (Chanti Nelatalli)</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#2563EB]/20">
                  <MapPin className="w-5 h-5 text-white stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#2563EB] uppercase">LOCATION</div>
                  <div className="text-sm font-bold text-[#0F172A]">Hyderabad, Telangana, India</div>
                  <div className="text-[11px] text-[#64748B]">Connecting colleges pan-India</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
              <span className="font-bold text-[#2563EB]">Campus Representatives:</span> To invite SS to your college fest, email us with your college details.
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#2563EB] mx-auto" />
                <h3 className="text-2xl font-black text-[#0F172A]">Message Received!</h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto">
                  Thank you for connecting with Struggle of Student. Our team will review your message and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-[#2563EB]/20 hover:bg-[#1D4ED8]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-[#0F172A] mb-2">Send an Inquiry</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Aditya"
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. vikram@college.edu.in"
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Campus Ambassador Request">Campus Ambassador Request</option>
                    <option value="SS Services Inquiry">SS Services Inquiry (Band / IT / Events)</option>
                    <option value="Mentorship & Guidance">Mentorship & Guidance</option>
                    <option value="Startup Partnership">Startup Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Message</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your query or proposal..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#2563EB] text-white font-extrabold text-sm shadow-md shadow-[#2563EB]/20 hover:bg-[#1D4ED8] border border-[#2563EB] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
