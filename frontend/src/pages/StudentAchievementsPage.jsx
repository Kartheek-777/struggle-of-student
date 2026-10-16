import React, { useState, useEffect } from 'react';
import { 
  Award, Plus, Edit3, Trash2, Eye, ExternalLink, 
  Send, AlertCircle, CheckCircle, Clock, Archive, X 
} from 'lucide-react';
import { 
  getStudentAchievements, createStudentAchievement, 
  updateStudentAchievement, deleteStudentAchievement 
} from '../services/api';

const ACHIEVEMENT_TYPES = [
  { value: 'HACKATHON', label: 'Hackathon Winner / Finalist' },
  { value: 'COMPETITION', label: 'Competition Achievement' },
  { value: 'INTERNSHIP', label: 'Internship Milestone' },
  { value: 'CERTIFICATION', label: 'Professional Certification' },
  { value: 'RESEARCH', label: 'Research Publication / Paper' },
  { value: 'AWARD', label: 'Award & Recognition' },
  { value: 'LEADERSHIP', label: 'Leadership Achievement' },
  { value: 'PROJECT', label: 'Project Milestone' },
  { value: 'COMMUNITY', label: 'Community Contribution' },
  { value: 'OTHER', label: 'Other Achievement' },
];

const StudentAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    achievement_type: 'HACKATHON',
    organization: '',
    date_achieved: '',
    description: '',
    proof_url: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await getStudentAchievements();
      setAchievements(res.data.results || res.data || []);
    } catch (err) {
      setError("Failed to load your achievements.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ach = null) => {
    if (ach) {
      setEditingAchievement(ach);
      setFormData({
        title: ach.title || '',
        achievement_type: ach.achievement_type || 'HACKATHON',
        organization: ach.organization || '',
        date_achieved: ach.date_achieved || '',
        description: ach.description || '',
        proof_url: ach.proof_url || '',
        status: ach.status || 'DRAFT',
      });
    } else {
      setEditingAchievement(null);
      setFormData({
        title: '',
        achievement_type: 'HACKATHON',
        organization: '',
        date_achieved: new Date().toISOString().split('T')[0],
        description: '',
        proof_url: '',
        status: 'DRAFT',
      });
    }
    setShowModal(true);
    setError(null);
  };

  const handleSubmit = async (e, targetStatus = null) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const payload = {
      ...formData,
      status: targetStatus || formData.status,
    };

    try {
      if (editingAchievement) {
        await updateStudentAchievement(editingAchievement.id, payload);
        setSuccessMsg("Achievement updated successfully.");
      } else {
        await createStudentAchievement(payload);
        setSuccessMsg(
          payload.status === 'PENDING_REVIEW'
            ? "Achievement submitted for review!"
            : "Achievement draft saved."
        );
      }
      setShowModal(false);
      fetchAchievements();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save achievement.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this achievement?")) return;
    try {
      await deleteStudentAchievement(id);
      setSuccessMsg("Achievement deleted.");
      fetchAchievements();
    } catch (err) {
      setError("Failed to delete achievement.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-[#2563EB]/15 text-[#2563EB] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12}/> Published</span>;
      case 'PENDING_REVIEW':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12}/> Pending Review</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12}/> Revision Needed</span>;
      case 'ARCHIVED':
        return <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Archive size={12}/> Archived</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">Draft</span>;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F172A] flex items-center gap-3">
              <Award className="text-[#2563EB]" /> My Student Achievements
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Showcase awards, hackathon wins, certifications, and milestones on your SS Profile.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2563EB]/90 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Achievement
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="bg-[#2563EB]/10 border border-[#E2E8F0] text-[#2563EB] px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)}><X size={16} /></button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        {/* Achievements list */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm animate-pulse">
            Loading your achievements...
          </div>
        ) : achievements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Award size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Achievements Added Yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Add your hackathons, publications, awards, or internship achievements to boost your profile!
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2563EB]/90"
            >
              Add First Achievement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2563EB] bg-[#1D4ED8]/10 px-2.5 py-1 rounded-md">
                      {ach.achievement_type}
                    </span>
                    {getStatusBadge(ach.status)}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-1">{ach.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    {ach.organization && `${ach.organization} - `}
                    {ach.date_achieved && new Date(ach.date_achieved).toLocaleDateString()}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {ach.proof_url && (
                      <a
                        href={ach.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> Certificate / Link
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {ach.status === 'DRAFT' && (
                      <button
                        onClick={(e) => {
                          setEditingAchievement(ach);
                          setFormData(ach);
                          handleSubmit(e, 'PENDING_REVIEW');
                        }}
                        className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-[#2563EB]/90 flex items-center gap-1"
                      >
                        <Send size={12} /> Submit
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenModal(ach)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(ach.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 my-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAchievement ? 'Edit Achievement' : 'Add Student Achievement'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => handleSubmit(e, formData.status)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Achievement Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 1st Place - Smart India Hackathon 2025"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                      <select
                        value={formData.achievement_type}
                        onChange={(e) => setFormData({ ...formData, achievement_type: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                      >
                        {ACHIEVEMENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Date Achieved</label>
                      <input
                        type="date"
                        value={formData.date_achieved}
                        onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Issuing Organization / Event</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Ministry of Education / Google Cloud"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief details about what you achieved and your impact..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Certificate / Proof Image Link (URL)</label>
                    <input
                      type="url"
                      value={formData.proof_url}
                      onChange={(e) => setFormData({ ...formData, proof_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e, 'DRAFT')}
                    className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'PENDING_REVIEW')}
                    className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#2563EB]/90 shadow-sm flex items-center gap-1.5"
                  >
                    <Send size={16} /> Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAchievementsPage;
