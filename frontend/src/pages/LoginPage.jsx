import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, ShieldAlert, Loader2, Zap, Rocket } from 'lucide-react';

const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const LoginPage = () => {
  const { login, socialLogin, isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && profile) {
      if (profile.role && profile.role !== 'STUDENT') {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [isAuthenticated, profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const userRole = res?.data?.profile?.role || profile?.role;
      if (userRole && userRole !== 'STUDENT') {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setLoading(true);
    try {
      const res = await socialLogin(provider);
      const userRole = res?.data?.profile?.role || profile?.role;
      if (userRole && userRole !== 'STUDENT') {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || `Failed to authenticate with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px] flex flex-col justify-between items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* MAIN CENTERED MODAL CARD */}
      <div className="my-auto w-full max-w-[920px] bg-white border border-slate-200/80 rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* LEFT COLUMN: DARK NAVY VISUAL PANEL */}
        <div className="lg:col-span-5 relative overflow-hidden p-8 sm:p-10 flex flex-col justify-between text-white bg-[#0F172A]">
          
          {/* Background Image with Dark Mood Overlay */}
          <img 
            src="/assets/hero_tech_students.jpg" 
            alt="Struggle of Student Tech Ecosystem" 
            className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-35 hover:scale-105 transition-transform duration-700 pointer-events-none" 
          />

          {/* Dark Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/85 to-[#0F172A]/95 z-10 pointer-events-none" />

          {/* TOP HEADER LOGO & BADGE WITH COMMUNITY LOGO */}
          <div className="space-y-5 relative z-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-white/30 text-[#2563EB] font-mono font-black flex items-center justify-center p-1 shadow-md shrink-0 overflow-hidden relative">
                <img
                  src="/logo.png"
                  alt="Struggle of Student Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.classList.remove('hidden');
                  }}
                />
                <span className="hidden font-black text-[#2563EB] text-xs">&lt;SS/&gt;</span>
              </div>
              <div>
                <h1 className="font-black text-sm tracking-wide text-white uppercase leading-none">
                  STRUGGLE OF STUDENT
                </h1>
                <span className="text-[10px] text-[#94A3B8] font-bold tracking-wider uppercase mt-1 block">
                  Campus Tech Ecosystem
                </span>
              </div>
            </Link>

            {/* PILL TAGLINE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>DREAM - LEARN - GROW - TOGETHER</span>
            </div>

            {/* HEADLINE */}
            <div className="pt-1 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-normal">
                Continue your journey with SS. Access verified engineering opportunities, structured mentorship, and peer student projects.
              </p>
            </div>
          </div>

          {/* BOTTOM COMMUNITY NOTE BOX */}
          <div className="relative z-20 mt-6 p-4 rounded-2xl bg-[#0B132B]/90 border border-white/10 text-xs text-[#CBD5E1] space-y-2.5 shadow-xl">
            <div className="flex items-center gap-1.5 font-extrabold text-[11px] text-[#38BDF8] uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>COMMUNITY NOTE</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed font-medium">
              Over <strong className="text-white">1,200+ students</strong> across <strong className="text-white">45+ engineering campuses</strong> build and prepare for tech careers with SS daily.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold border-t border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hub status: All systems operational</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIGHT FORM PANEL */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          
          <div className="space-y-6">
            
            {/* TITLE & SUBTITLE */}
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Sign In to Account
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                Enter your credentials to access your student profile & dashboard.
              </p>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700 font-bold animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* EMAIL */}
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-semibold text-sm">@</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your student email"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-[#2563EB] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>
              </div>

              {/* REMEMBER CHECKBOX */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <label htmlFor="remember" className="text-xs text-[#64748B] font-medium cursor-pointer">
                  Remember on this campus device
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#2563EB]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to SS</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">
                OR SIGN IN WITH
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* SOCIAL SIGN IN BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('GitHub')}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <GitHubIcon className="w-4 h-4 text-slate-900" />
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google</span>
              </button>
            </div>

          </div>

          {/* FOOTER LINK INSIDE FORM */}
          <div className="pt-4 text-center text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#2563EB] hover:underline">
              Join SS Student Network
            </Link>
          </div>

        </div>

      </div>

      {/* BOTTOM PAGE FOOTER */}
      <div className="w-full max-w-[920px] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-2">
        <p>© 2026 Struggle of Student (SS) Dev Hub. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-slate-600 transition-colors">Campus Guidelines</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <a href="https://t.me/struggleofstudent" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Discord Community</a>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
