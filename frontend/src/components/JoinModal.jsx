import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

const JoinModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState('Student Member');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            setSubmitted(false);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#2563EB] text-[#2563EB] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#2563EB]">Welcome to the SS Family!</h3>
            <p className="text-sm text-[#0F172A] leading-relaxed max-w-md mx-auto">
              Thank you, <span className="font-bold">{name || 'Student'}</span>! Your community interest as a <span className="text-[#2563EB] font-semibold">{role}</span> has been logged. Phase 2 user onboarding and verified profile logins will launch soon!
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Back to Website
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Struggle of Student Logo"
                  className="w-10 h-10 object-contain rounded-xl shadow-md border border-[#2563EB]/40 bg-[#F8FAFC]/5"
                />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Phase 1 Community Portal</span>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">
                Join Struggle of Student
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Be part of an ambitious student community. Discover internships, build skills, and showcase your talent together.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@college.edu.in"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">
                  I want to join as
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-sm focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Student Member">Student Member</option>
                  <option value="Campus Ambassador">Campus Ambassador</option>
                  <option value="Event Volunteer">Event Volunteer</option>
                  <option value="Talent Showcase Contributor">Talent Showcase Contributor</option>
                  <option value="Mentor / Industry Lead">Mentor / Industry Lead</option>
                </select>
              </div>

              <div className="bg-[#2563EB]/5 p-3 rounded-xl border border-[#2563EB]/10 flex items-start gap-2 text-xs text-[#64748B]">
                <ShieldAlert className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>
                  Phase 1 provides public preview & community sign-up. Full JWT authentication & personal dashboard will unlock in Phase 2.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-extrabold text-base shadow-lg hover:bg-[#1D4ED8] border border-[#2563EB]/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Community Interest</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default JoinModal;
