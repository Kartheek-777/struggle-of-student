import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  User, Mail, Phone, GraduationCap, BookOpen, MapPin, Globe, 
  Upload, Trash2, CheckCircle2, ShieldAlert, Loader2, Sparkles, Edit3, Eye,
  ExternalLink, Award, Code, Star, Calendar, Building2, Share2, Copy
} from 'lucide-react';

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const StudentProfilePage = () => {
  const { profile, updateProfileState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copiedLink, setCopiedLink] = useState(false);

  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    college: '',
    course: '',
    graduation_year: '2026',
    city: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    skills_selected: [],
    interests_selected: [],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        college: profile.college || '',
        course: profile.course || '',
        graduation_year: profile.graduation_year || '2026',
        city: profile.city || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || '',
        skills_selected: profile.skills ? profile.skills.map(s => s.name) : [],
        interests_selected: profile.interests ? profile.interests.map(i => i.name) : [],
      });
    }

    apiService.getSkills().then(res => setAvailableSkills(res.skills || [])).catch(() => {});
    apiService.getInterests().then(res => setAvailableInterests(res.interests || [])).catch(() => {});
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skillName) => {
    setFormData(prev => {
      const exists = prev.skills_selected.includes(skillName);
      return {
        ...prev,
        skills_selected: exists 
          ? prev.skills_selected.filter(s => s !== skillName) 
          : [...prev.skills_selected, skillName]
      };
    });
  };

  const toggleInterest = (intName) => {
    setFormData(prev => {
      const exists = prev.interests_selected.includes(intName);
      return {
        ...prev,
        interests_selected: exists 
          ? prev.interests_selected.filter(i => i !== intName) 
          : [...prev.interests_selected, intName]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const updatePayload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        college: formData.college,
        course: formData.course,
        graduation_year: formData.graduation_year,
        city: formData.city,
        bio: formData.bio,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        skills_input: formData.skills_selected,
        interests_input: formData.interests_selected,
      };

      const res = await apiService.updateProfile(updatePayload);
      if (res.success && res.data) {
        updateProfileState(res.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage({ type: '', text: '' });
    setPhotoUploading(true);

    try {
      const data = new FormData();
      data.append('photo', file);
      const res = await apiService.uploadPhoto(data);
      if (res.success && res.data) {
        updateProfileState(res.data);
        setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload profile photo.' });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setMessage({ type: '', text: '' });
    try {
      const res = await apiService.deletePhoto();
      if (res.success && res.data) {
        updateProfileState(res.data);
        setMessage({ type: 'success', text: 'Profile photo removed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove photo.' });
    }
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const completion = Number(profile?.completion_percentage || 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* TOP ALERT FEEDBACK */}
        {message.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB]' 
              : 'bg-red-500/10 border border-red-500/30 text-red-900'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#2563EB]" /> : <ShieldAlert className="w-5 h-5 text-red-700" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* COMPACT ELEGANT PROFILE HERO HEADER */}
        <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* AVATAR & NAME DETAILS */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
              {/* PROFILE PHOTO AVATAR */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F8FAFC] border-2 border-[#2563EB] shadow-md overflow-hidden uppercase flex items-center justify-center font-extrabold text-3xl text-[#2563EB]">
                  {profile?.profile_photo ? (
                    <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile?.full_name?.charAt(0) || 'S'}</span>
                  )}
                </div>

                <label className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] border border-white shadow-md cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1D4ED8]/15 text-[#2563EB] text-[11px] font-extrabold uppercase tracking-wide border border-[#2563EB]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Verified SS Student Member</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">
                  {profile?.full_name}
                </h1>

                <p className="text-xs sm:text-sm font-bold text-[#64748B]">
                  {profile?.course} - Class of {profile?.graduation_year}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                    {profile?.college}
                  </span>
                  {profile?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                      {profile.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2.5 justify-center w-full md:w-auto shrink-0">
              <button
                onClick={handleCopyProfileLink}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-[#2563EB] font-bold text-xs hover:bg-[#E2E8F0] border border-[#E2E8F0] shadow-sm flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-5 py-2 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition shadow-sm flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>

              {profile?.profile_photo && (
                <button
                  onClick={handleRemovePhoto}
                  className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition"
                  title="Remove profile photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* HIGHLY VISIBLE BRANDED SOCIAL LINKS BAR */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mr-1">Connected Channels:</span>

            {profile?.linkedin_url ? (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0A66C2] text-white font-bold text-xs hover:bg-[#084e96] transition shadow-sm"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            ) : (
              <span className="text-xs text-gray-400 font-semibold px-3 py-1 rounded-xl bg-gray-100 border border-gray-200">
                LinkedIn: Not Added
              </span>
            )}

            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#24292F] text-white font-bold text-xs hover:bg-[#1b1f23] transition shadow-sm"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            ) : (
              <span className="text-xs text-gray-400 font-semibold px-3 py-1 rounded-xl bg-gray-100 border border-gray-200">
                GitHub: Not Added
              </span>
            )}

            {profile?.portfolio_url ? (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#2563EB] text-[#2563EB] font-bold text-xs hover:bg-[#2563EB] hover:text-white transition shadow-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio Website</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            ) : (
              <span className="text-xs text-gray-400 font-semibold px-3 py-1 rounded-xl bg-gray-100 border border-gray-200">
                Portfolio: Not Added
              </span>
            )}

            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] font-bold text-xs hover:bg-[#E2E8F0]/50 transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{profile.email}</span>
              </a>
            )}

            {profile?.phone_number && (
              <a
                href={`tel:${profile.phone_number}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] font-bold text-xs hover:bg-[#E2E8F0]/50 transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Phone: {profile.phone_number}</span>
              </a>
            )}
          </div>

        </div>

        {/* PROFILE COMPLETION BAR (ONLY SHOWN IF PROFILE IS INCOMPLETE) */}
        {completion < 100 && (
          <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#2563EB]" />
              <div>
                <div className="text-sm font-extrabold text-[#2563EB]">Profile Completion: {completion}%</div>
                <div className="text-xs text-[#64748B]">A complete student profile increases visibility for internships & campus leadership.</div>
              </div>
            </div>

            <div className="w-full sm:w-64 bg-[#E2E8F0] h-3.5 rounded-full overflow-hidden border border-[#E2E8F0]">
              <div className="bg-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
        )}

        {/* EDIT FORM MODE VS VIEW MODE */}
        {isEditing ? (
          /* EDIT PROFILE FORM */
          <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-[#2563EB]">Edit Professional Student Profile</h3>
                <p className="text-xs text-[#64748B]">Update your academic background, skills, and social links.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            {/* SECTION 1: PERSONAL & CONTACT */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">City / Region</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad, Telangana"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">About / Career Focus Bio</label>
                <textarea
                  rows="4"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share your goals, career focus, or college projects..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>
            </div>

            {/* SECTION 2: EDUCATION */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                Education & College
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">College / University *</label>
                  <input
                    type="text"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">Graduation Batch *</label>
                  <select
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                  >
                    {['2024', '2025', '2026', '2027', '2028', '2029'].map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">Degree / Course / Major *</label>
                <input
                  type="text"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor of Technology in CSE"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-semibold"
                />
              </div>
            </div>

            {/* SECTION 3: SKILLS & INTERESTS */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                Skills & Technical Expertise
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-2">My Technical Skills</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => {
                    const selected = formData.skills_selected.includes(skill.name);
                    return (
                      <button
                        type="button"
                        key={skill.name}
                        onClick={() => toggleSkill(skill.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                            : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2563EB] uppercase mb-2">My Domain Interests</label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map(interest => {
                    const selected = formData.interests_selected.includes(interest.name);
                    return (
                      <button
                        type="button"
                        key={interest.name}
                        onClick={() => toggleInterest(interest.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-[#2563EB] text-[#F8FAFC] border border-[#2563EB]'
                            : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{interest.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 4: PROFESSIONAL SOCIAL LINKS */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                Professional Social Links
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/in/username"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2563EB] uppercase mb-1">Portfolio / Website URL</label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    placeholder="https://myportfolio.dev"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-sm shadow-md hover:bg-[#1D4ED8] transition border border-[#2563EB]/40"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3.5 rounded-xl bg-[#F8FAFC] text-[#0F172A] font-bold text-sm border border-[#E2E8F0]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* PROFESSIONAL VIEW PROFILE CARD GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT MAIN CARDS (ABOUT, SKILLS, INTERESTS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ABOUT STUDENT */}
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
                <h3 className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">About & Career Summary</h3>
                <p className="text-sm text-[#0F172A] leading-relaxed font-normal">
                  {profile?.bio || 'No bio added yet. Click "Edit Profile" above to share your goals and student background.'}
                </p>
              </div>

              {/* SKILLS */}
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                <h3 className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Skills & Technical Expertise</h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills.map(sk => (
                      <span key={sk.id || sk.name} className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] text-[#2563EB] text-xs font-bold border-2 border-[#2563EB]/30 shadow-sm">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No skills listed yet.</p>
                )}
              </div>

              {/* INTERESTS */}
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                <h3 className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Domain Interests</h3>
                {profile?.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profile.interests.map(it => (
                      <span key={it.id || it.name} className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] text-[#2563EB] text-xs font-bold border border-[#E2E8F0]">
                        {it.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No interests listed yet.</p>
                )}
              </div>

            </div>

            {/* RIGHT SIDEBAR (METADATA & VISIBLE LINKS) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 shadow-xl space-y-6">
                <h3 className="text-xs font-mono font-bold text-[#2563EB] uppercase border-b border-[#E2E8F0] pb-2">
                  Academic & Contact Info
                </h3>

                <div className="space-y-4 text-xs font-semibold text-[#0F172A]">
                  <div>
                    <span className="text-gray-400 block uppercase text-[10px] font-bold">Email Address</span>
                    <span className="text-sm font-bold text-[#2563EB]">{profile?.email}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block uppercase text-[10px] font-bold">Phone Number</span>
                    <span className="text-sm font-bold text-[#2563EB]">{profile?.phone_number || 'Not added'}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block uppercase text-[10px] font-bold">College</span>
                    <span className="text-xs font-bold text-[#64748B]">{profile?.college}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block uppercase text-[10px] font-bold">Course / Major</span>
                    <span className="text-xs font-bold text-[#64748B]">{profile?.course}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block uppercase text-[10px] font-bold">City</span>
                    <span className="text-xs font-bold text-[#64748B]">{profile?.city || 'Not added'}</span>
                  </div>
                </div>

                {/* VISIBLE SOCIAL LINKS */}
                <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                  <h4 className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">Shared Public Links</h4>

                  <div className="space-y-2">
                    {profile?.linkedin_url ? (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] font-bold text-xs hover:bg-[#0A66C2]/20 transition border border-[#0A66C2]/30"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <LinkedinIcon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{profile.linkedin_url}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-400 text-xs italic border border-gray-200">
                        LinkedIn: Not added
                      </div>
                    )}

                    {profile?.github_url ? (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-[#24292F]/10 text-[#24292F] font-bold text-xs hover:bg-[#24292F]/20 transition border border-[#24292F]/30"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <GithubIcon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{profile.github_url}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-400 text-xs italic border border-gray-200">
                        GitHub: Not added
                      </div>
                    )}

                    {profile?.portfolio_url ? (
                      <a
                        href={profile.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-[#2563EB]/10 text-[#2563EB] font-bold text-xs hover:bg-[#2563EB]/20 transition border border-[#2563EB]/30"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Globe className="w-4 h-4 shrink-0 text-[#2563EB]" />
                          <span className="truncate">{profile.portfolio_url}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#2563EB]" />
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-400 text-xs italic border border-gray-200">
                        Portfolio: Not added
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentProfilePage;
