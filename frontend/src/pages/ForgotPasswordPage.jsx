import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiService.forgotPassword(email);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 justify-center mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              SS
            </div>
          </Link>
          <h2 className="text-2xl font-black text-[#0F172A]">Reset Password</h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your registered student email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-lg font-black text-[#0F172A]">Reset Request Initiated</h3>
            <p className="text-xs text-slate-600 font-medium">
              If an account with <span className="font-extrabold text-[#0F172A]">{email}</span> exists, password reset instructions have been set.
            </p>
            <div className="pt-2">
              <Link to="/login" className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs inline-block shadow-md hover:bg-[#1D4ED8] transition-all">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@college.edu.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm shadow-md hover:bg-[#1D4ED8] flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <>
                  <span>Send Reset Request</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <Link to="/login" className="font-extrabold text-[#2563EB] hover:underline">
            Remember your password? Log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
