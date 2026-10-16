import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Calendar, User, ArrowRight, AlertCircle, Bookmark } from 'lucide-react';
import { getStories, getStoryCategories } from '../services/api';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await getStoryCategories();
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load story categories", err);
    }
  };

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const res = await getStories(params);
      setStories(res.data.results || res.data || []);
    } catch (err) {
      setError("Failed to load student stories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStories();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen size={14} /> Community Insights & Journeys
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Student Stories
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Real experiences, journeys and lessons from the SS community. Written by students, for students.
          </p>
        </div>

        {/* Search & Category filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search stories by title, content, or author..."
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
                All Stories
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
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p className="font-semibold">{error}</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm border border-gray-100">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">No Stories Available</h3>
            <p className="text-gray-500 mt-2">No student stories have been published yet matching your selection.</p>
          </div>
        ) : (
          /* Editorial Grid of Stories */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-[#2563EB]/10 px-3 py-1 rounded-full">
                      {story.category_name || 'Student Story'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {story.published_at ? new Date(story.published_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  {/* Image optional preview */}
                  {story.cover_image && (
                    <div className="h-44 rounded-xl overflow-hidden mb-4">
                      <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 line-clamp-2 hover:text-[#2563EB] transition-colors">
                    <Link to={`/stories/${story.id}`}>
                      {story.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {story.excerpt || story.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {story.author_photo ? (
                      <img 
                        src={story.author_photo} 
                        alt={story.author_name} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                        {story.author_name?.charAt(0) || 'S'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-800">{story.author_name}</span>
                  </div>

                  <Link
                    to={`/stories/${story.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
                  >
                    Read Story <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
