import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, ExternalLink, GitBranch, Filter, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { getProjects, getProjectCategories } from '../services/api';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await getProjectCategories();
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load project categories", err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const res = await getProjects(params);
      setProjects(res.data.results || res.data || []);
    } catch (err) {
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-4">
            <Code size={14} /> Student Innovation Showcase
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Student Projects
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore what students are building, creating and solving. Real tech, real projects, built by real students.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search projects by title, description, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter size={18} className="text-gray-500 shrink-0" />
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-[#2563EB] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug || cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === (cat.slug || cat.id)
                      ? 'bg-[#2563EB] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p className="font-semibold">{error}</p>
            <button onClick={fetchProjects} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm border border-gray-100">
            <Code className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">No Projects Found</h3>
            <p className="text-gray-500 mt-2">No student projects have been published yet or match your search filters.</p>
          </div>
        ) : (
          /* Grid of Projects */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => {
              const techList = proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : [];
              return (
                <div 
                  key={proj.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image or fallback */}
                    <div className="h-48 bg-gray-100 overflow-hidden relative group">
                      {proj.image_url ? (
                        <img 
                          src={proj.image_url} 
                          alt={proj.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#0F172A] flex items-center justify-center p-6 text-center text-white">
                          <div>
                            <Code size={40} className="mx-auto mb-2 text-[#2563EB]" />
                            <span className="font-bold text-lg">{proj.title}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        {proj.status_display || proj.project_status}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-[#1D4ED8]/10 px-2.5 py-1 rounded-md">
                          {proj.category_name || 'Project'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0F172A] line-clamp-1 mb-1">
                        {proj.title}
                      </h3>

                      <p className="text-xs font-medium text-gray-500 mb-3">
                        By <span className="text-gray-800 font-semibold">{proj.owner_name}</span>
                        {proj.team_members_count > 1 && ` + ${proj.team_members_count - 1} team member(s)`}
                      </p>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {proj.short_description || proj.description}
                      </p>

                      {/* Tech stack */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {techList.slice(0, 4).map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                          {techList.length > 4 && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-mono">
                              +{techList.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center gap-3">
                      {proj.github_url && (
                        <a 
                          href={proj.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                          title="View GitHub"
                        >
                          <GitBranch size={18} />
                        </a>
                      )}
                      {proj.live_demo_url && (
                        <a 
                          href={proj.live_demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-[#2563EB] transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${proj.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-[#2563EB]/80 transition-colors"
                    >
                      <Eye size={16} /> View Project
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
