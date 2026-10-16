import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Loader2, User, Mail, Lock, Phone, GraduationCap, BookOpen, MapPin, Globe } from 'lucide-react';

const DEFAULT_INTERESTS = [
  'Web Development', 'Mobile Apps', 'Artificial Intelligence / ML', 
  'Cybersecurity', 'UI/UX Design', 'Data Science', 'Cloud Computing', 
  'DevOps', 'Blockchain', 'Robotics & IoT', 'Event Management', 'Public Speaking'
];

const DEFAULT_SKILLS = [
  'React.js', 'Python', 'Django', 'JavaScript', 'Java', 'C++', 
  'Node.js', 'HTML & CSS', 'Tailwind CSS', 'MySQL', 'Git & GitHub', 
  'Figma', 'Video Editing', 'Content Writing'
];

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    college: '',
    course: '',
    graduation_year: '2026',
    city: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    skills: ['React.js', 'Python'],
    interests: ['Web Development', 'UI/UX Design'],
  });

  const [availableSkills, setAvailableSkills] = useState(DEFAULT_SKILLS);
  const [availableInterests, setAvailableInterests] = useState(DEFAULT_INTERESTS);
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard');
    }

    // Fetch skills and interests catalog, fallback to defaults if empty
    apiService.getSkills()
      .then(res => {
        if (res.skills && res.skills.length > 0) {
          const names = res.skills.map(s => typeof s === 'string' ? s : s.name);
          setAvailableSkills(prev => Array.from(new Set([...prev, ...names])));
        }
      })
      .catch(() => {});

    apiService.getInterests()
      .then(res => {
        if (res.interests && res.interests.length > 0) {
          const names = res.interests.map(i => typeof i === 'string' ? i : i.name);
          setAvailableInterests(prev => Array.from(new Set([...prev, ...names])));
        }
      })
      .catch(() => {});
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skillName) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skillName);
      return {
        ...prev,
        skills: exists ? prev.skills.filter(s => s !== skillName) : [...prev.skills, skillName]
      };
    });
  };

  const toggleInterest = (intName) => {
    setFormData(prev => {
      const exists = prev.interests.includes(intName);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(i => i !== intName) : [...prev.interests, intName]
      };
    });
  };

  const addCustomSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSkill.trim();
    if (trimmed) {
      if (!formData.skills.includes(trimmed)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      }
      if (!availableSkills.includes(trimmed)) {
        setAvailableSkills(prev => [...prev, trimmed]);
      }
      setCustomSkill('');
    }
  };

  const addCustomInterest = (e) => {
    if (e) e.preventDefault();
    const trimmed = customInterest.trim();
    if (trimmed) {
      if (!formData.interests.includes(trimmed)) {
        setFormData(prev => ({ ...prev, interests: [...prev.interests, trimmed] }));
      }
      if (!availableInterests.includes(trimmed)) {
        setAvailableInterests(prev => [...prev, trimmed]);
      }
      setCustomInterest('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please verify your password entries.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: BRANDING & ENGINEERING STUDENTS COMMUNITY VISUAL */}
        <div className="lg:col-span-5 relative overflow-hidden p-8 sm:p-12 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-slate-200 min-h-[520px] bg-[#101A30]">
          
          {/* Hero Tech Students Background Image */}
          <img 
            src="/assets/hero_tech_students.jpg" 
            alt="Engineering Students Collaborating" 
            className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-85 hover:scale-105 transition-transform duration-700 pointer-events-none" 
          />

          {/* Translucent Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101A30] via-[#101A30]/60 to-[#101A30]/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101A30]/40 via-transparent to-transparent z-10 pointer-events-none" />

          <div className="space-y-6 relative z-20">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img
                  src="/logo.png"
                  alt="SS Logo"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.classList.remove('hidden');
                  }}
                />
                <span className="hidden font-black text-white text-xl">SS</span>
              </div>
              <span className="font-black text-xl tracking-tight text-white drop-shadow">
                STRUGGLE OF STUDENT
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2457E6]/40 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-[#2457E6]/60">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>DREAM - LEARN - GROW - TOGETHER</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Join Struggle of Student
            </h2>

            <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed font-normal drop-shadow-sm">
              Join thousands of engineering & college students across India discovering tech opportunities, building real projects, and growing together.
            </p>

            <div className="p-5 rounded-2xl bg-[#101A30]/80 backdrop-blur-lg border border-white/20 space-y-3 shadow-2xl">
              <h4 className="text-xs font-black text-[#2457E6] uppercase tracking-wider">Why Register on SS?</h4>
              <ul className="space-y-2 text-xs text-[#E2E8F0] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access verified student tech internships & roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Build your verified student developer portfolio</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Connect with campus leads & tech mentors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
          
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#0F172A]">Student Registration</h3>
            <p className="text-xs text-slate-500 font-medium">
              Fill in your college and basic information to get started.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700 font-bold animate-fadeIn">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: ACCOUNT & PERSONAL INFO */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                1. Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@college.edu.in"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      name="confirm_password"
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="phone_number"
                      required
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">City (Optional)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Hyderabad"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC INFO */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                2. Academic Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">College / University *</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="college"
                      required
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. VNR VJIET / Osmania University"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Graduation Year *</label>
                  <select
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                  >
                    {['2024', '2025', '2026', '2027', '2028', '2029'].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider mb-1.5">Course / Degree *</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science / BBA / B.Sc"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: SKILLS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                3. Skills
              </h4>

              {/* SKILLS SELECTION & CUSTOM INPUT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Select or Add Skills
                  </label>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {formData.skills.length} Selected
                  </span>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {availableSkills.map((skill) => {
                    const skName = typeof skill === 'string' ? skill : skill.name;
                    const selected = formData.skills.includes(skName);
                    return (
                      <button
                        type="button"
                        key={skName}
                        onClick={() => toggleSkill(skName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                          selected
                            ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-[#2563EB]'
                        }`}
                      >
                        <span>{selected ? '' : '+'}</span>
                        <span>{skName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    placeholder="Type custom skill (e.g. Flutter, Kubernetes) and press Enter"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold hover:bg-[#1D4ED8] transition-colors shadow-2xs"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 4: PROFESSIONAL LINKS (OPTIONAL) */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider border-b border-slate-200 pb-1.5">
                4. Professional Links (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-[#0F172A] uppercase tracking-wider mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#0F172A] uppercase tracking-wider mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#0F172A] uppercase tracking-wider mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    placeholder="https://myportfolio.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-lg shadow-blue-600/30 hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span>Creating Your SS Account...</span>
                </>
              ) : (
                <>
                  <span>Join Network & Register Account</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </>
              )}
            </button>

            {/* LOGIN LINK BELOW REGISTER BUTTON */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#2563EB] hover:underline">
                Log in here
              </Link>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
