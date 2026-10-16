import React, { useState, useEffect } from 'react';
import { 
  Code, Plus, Edit3, Trash2, Eye, ExternalLink, GitBranch, 
  Send, AlertCircle, CheckCircle, Clock, Archive, X 
} from 'lucide-react';
import { 
  getStudentProjects, createStudentProject, 
  updateStudentProject, deleteStudentProject, getProjectCategories 
} from '../services/api';

const StudentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    short_description: '',
    problem_statement: '',
    solution: '',
    technologies: '',
    features: '',
    github_url: '',
    live_demo_url: '',
    portfolio_url: '',
    image_url: '',
    project_status: 'IN_DEVELOPMENT',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, catRes] = await Promise.all([
        getStudentProjects(),
        getProjectCategories(),
      ]);
      setProjects(projRes.data.results || projRes.data || []);
      setCategories(catRes.data.results || catRes.data || []);
    } catch (err) {
      setError("Failed to load your projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setFormData({
        title: proj.title || '',
        category: proj.category || '',
        description: proj.description || '',
        short_description: proj.short_description || '',
        problem_statement: proj.problem_statement || '',
        solution: proj.solution || '',
        technologies: proj.technologies || '',
        features: proj.features || '',
        github_url: proj.github_url || '',
        live_demo_url: proj.live_demo_url || '',
        portfolio_url: proj.portfolio_url || '',
        image_url: proj.image_url || '',
        project_status: proj.project_status || 'IN_DEVELOPMENT',
        status: proj.status || 'DRAFT',
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: categories.length > 0 ? categories[0].id : '',
        description: '',
        short_description: '',
        problem_statement: '',
        solution: '',
        technologies: '',
        features: '',
        github_url: '',
        live_demo_url: '',
        portfolio_url: '',
        image_url: '',
        project_status: 'IN_DEVELOPMENT',
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
      if (editingProject) {
        await updateStudentProject(editingProject.id, payload);
        setSuccessMsg("Project updated successfully.");
      } else {
        await createStudentProject(payload);
        setSuccessMsg(
          payload.status === 'PENDING_REVIEW'
            ? "Project submitted for review!"
            : "Project draft created successfully."
        );
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save project. Please check form fields.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteStudentProject(id);
      setSuccessMsg("Project deleted successfully.");
      fetchData();
    } catch (err) {
      setError("Failed to delete project.");
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
              <Code className="text-[#2563EB]" /> My Student Projects
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Create, manage, and submit your projects to showcase to the SS community.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2563EB]/90 transition-colors shadow-sm"
          >
            <Plus size={18} /> Submit New Project
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

        {/* Projects List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm animate-pulse">
            Loading your projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Code size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Projects Submitted Yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Showcase what you've built to the SS community, future collaborators, and recruiters!
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2563EB]/90"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#2563EB] bg-[#1D4ED8]/10 px-2.5 py-1 rounded-md">
                      {proj.category_name || 'Project'}
                    </span>
                    {getStatusBadge(proj.status)}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{proj.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {proj.short_description || proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {proj.status === 'PUBLISHED' && (
                      <a
                        href={`/projects/${proj.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors"
                        title="View Public Page"
                      >
                        <Eye size={18} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.status === 'DRAFT' && (
                      <button
                        onClick={(e) => {
                          setEditingProject(proj);
                          setFormData(proj);
                          handleSubmit(e, 'PENDING_REVIEW');
                        }}
                        className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-[#2563EB]/90 flex items-center gap-1"
                      >
                        <Send size={12} /> Submit for Review
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenModal(proj)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(proj.id)}
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

        {/* Submission / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Student Project'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => handleSubmit(e, formData.status)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. AI Study Assistant"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
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
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Development Status</label>
                      <select
                        value={formData.project_status}
                        onChange={(e) => setFormData({ ...formData, project_status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                      >
                        <option value="IDEA">Idea Stage</option>
                        <option value="IN_DEVELOPMENT">In Development</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description (1-2 lines)</label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief teaser of what the project does..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive details about the project..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Problem Statement</label>
                      <textarea
                        rows={3}
                        value={formData.problem_statement}
                        onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                        placeholder="What student problem does this address?"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Solution</label>
                      <textarea
                        rows={3}
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        placeholder="How does your project solve it?"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Technologies Used (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="Python, Django, React, MySQL, Tailwind CSS"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        value={formData.live_demo_url}
                        onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                        placeholder="https://myproject.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/cover.png"
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

export default StudentProjectsPage;
