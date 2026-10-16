import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Edit3, Trash2, Eye, Send, 
  AlertCircle, CheckCircle, Clock, Archive, X 
} from 'lucide-react';
import { 
  getStudentStories, createStudentStory, 
  updateStudentStory, deleteStudentStory, getStoryCategories 
} from '../services/api';

const StudentStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    cover_image: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [storyRes, catRes] = await Promise.all([
        getStudentStories(),
        getStoryCategories(),
      ]);
      setStories(storyRes.data.results || storyRes.data || []);
      setCategories(catRes.data.results || catRes.data || []);
    } catch (err) {
      setError("Failed to load your stories.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (story = null) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        title: story.title || '',
        category: story.category || '',
        excerpt: story.excerpt || '',
        content: story.content || '',
        cover_image: story.cover_image || '',
        status: story.status || 'DRAFT',
      });
    } else {
      setEditingStory(null);
      setFormData({
        title: '',
        category: categories.length > 0 ? categories[0].id : '',
        excerpt: '',
        content: '',
        cover_image: '',
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

    if (!payload.category && categories.length > 0) {
      payload.category = categories[0].id;
    }

    try {
      if (editingStory) {
        await updateStudentStory(editingStory.id, payload);
        setSuccessMsg("Story updated successfully.");
      } else {
        await createStudentStory(payload);
        setSuccessMsg(
          payload.status === 'PENDING_REVIEW'
            ? "Story submitted for community review!"
            : "Story draft saved successfully."
        );
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save story. Please verify fields.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteStudentStory(id);
      setSuccessMsg("Story deleted successfully.");
      fetchData();
    } catch (err) {
      setError("Failed to delete story.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-[#2563EB]/15 text-[#2563EB] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12}/> Published</span>;
      case 'PENDING_REVIEW':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12}/> Pending Review</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12}/> Needs Revision</span>;
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
              <BookOpen className="text-[#2563EB]" /> My Student Stories
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Share your personal journey, internship experience, or community lessons with SS.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2563EB]/90 transition-colors shadow-sm"
          >
            <Plus size={18} /> Write New Story
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

        {/* Stories list */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm animate-pulse">
            Loading your stories...
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Stories Written Yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Inspire thousands of fellow students by sharing your learning or career story!
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2563EB]/90"
            >
              Write Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full">
                      {story.category_name || 'Student Story'}
                    </span>
                    {getStatusBadge(story.status)}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {story.excerpt || story.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {story.status === 'PUBLISHED' && (
                      <a
                        href={`/stories/${story.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors"
                        title="View Published Story"
                      >
                        <Eye size={18} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {story.status === 'DRAFT' && (
                      <button
                        onClick={(e) => {
                          setEditingStory(story);
                          setFormData(story);
                          handleSubmit(e, 'PENDING_REVIEW');
                        }}
                        className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-[#2563EB]/90 flex items-center gap-1"
                      >
                        <Send size={12} /> Submit for Review
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenModal(story)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(story.id)}
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
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStory ? 'Edit Story' : 'Write New Student Story'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => handleSubmit(e, formData.status)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Story Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. How I Secured My First Tech Internship as a 2nd Year Student"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Story Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Short Excerpt / Teaser</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Summary of the key takeaway or lesson..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Story Content *</label>
                    <textarea
                      rows={8}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Share your detailed story, challenge, milestones, and advice..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
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

export default StudentStoriesPage;
