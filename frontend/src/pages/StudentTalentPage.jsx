import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit, AlertCircle, CheckCircle2, Loader2, X, Globe, Share2 } from 'lucide-react';
import { apiService } from '../services/api';

const StudentTalentPage = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Photography',
    short_description: '',
    description: '',
    portfolio_url: '',
    social_links: '',
    skills_raw: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const categories = [
    'Photography', 'Design', 'Coding', 'Music', 'Singing', 'Dance', 
    'Videography', 'Writing', 'Poetry', 'Art', 'Public Speaking', 
    'Content Creation', 'Entrepreneurship', 'Sports', 'Other'
  ];

  const fetchMyTalents = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudentTalents();
      setTalents(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to load student talents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTalents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) {
      setMsg({ type: 'error', text: 'Title and short description are required.' });
      return;
    }
    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const skills = formData.skills_raw.split(',').map((s) => s.trim()).filter(Boolean);
      await apiService.createStudentTalent({ ...formData, skills });
      setShowModal(false);
      setMsg({ type: 'success', text: 'Talent profile submitted for review!' });
      setFormData({ title: '', category: 'Photography', short_description: '', description: '', portfolio_url: '', social_links: '', skills_raw: '' });
      fetchMyTalents();
    } catch (err) {
      setMsg({ type: 'error', text: 'Submission failed. Please check inputs.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this talent profile?')) return;
    try {
      await apiService.deleteStudentTalent(id);
      setMsg({ type: 'success', text: 'Talent profile deleted.' });
      fetchMyTalents();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Student Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#2563EB]">My Talent Profiles</h1>
            <p className="text-xs text-[#0F172A]/70 mt-1 font-medium">Showcase your skills and creative work to the SS community.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#2563EB] text-[#F8FAFC] font-bold text-xs rounded-xl shadow hover:bg-[#1D4ED8] border border-[#2563EB] flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Showcase New Talent</span>
          </button>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-900 border-red-300'}`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg({ type: '', text: '' })}>X</button>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
          </div>
        ) : talents.length === 0 ? (
          <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-lg font-extrabold text-[#2563EB]">No talent profiles added yet</h3>
            <p className="text-xs text-[#0F172A]/70 font-medium">Add your photography, coding, music, design, or writing portfolio to get discovered!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold"
            >
              Add Talent Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {talents.map((t) => (
              <div key={t.id} className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] uppercase">{t.category_name || t.category}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${t.status === 'PUBLISHED' ? 'bg-[#2563EB]/15 text-[#2563EB]' : 'bg-amber-100 text-amber-800'}`}>
                      {t.status === 'PUBLISHED' ? 'Published' : 'Pending Review'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#2563EB]">{t.title}</h3>
                  <p className="text-xs text-[#0F172A]/80 font-medium">{t.short_description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#2563EB] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-[#2563EB]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-[#2563EB]">Showcase Your Talent</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-[#2563EB]">
              <div>
                <label className="block mb-1">Talent Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urban Street Photography / UI Design"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white"
                />
              </div>

              <div>
                <label className="block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white font-bold"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1">Short Tagline / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portrait - Street - Events - Capturing campus stories"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white"
                />
              </div>

              <div>
                <label className="block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your passion, experience, and accomplishments..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="Photography, Lightroom, Photoshop"
                  value={formData.skills_raw}
                  onChange={(e) => setFormData({ ...formData, skills_raw: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1">Social Links URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/myhandle"
                    value={formData.social_links}
                    onChange={(e) => setFormData({ ...formData, social_links: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E2E8F0]">Cancel</button>
                <button disabled={submitting} type="submit" className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-extrabold flex items-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Submit for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentTalentPage;
