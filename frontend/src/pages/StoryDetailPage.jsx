import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, User, ArrowLeft, Share2, 
  Sparkles, ShieldCheck, AlertCircle, Bookmark 
} from 'lucide-react';
import { getStoryDetail } from '../services/api';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoryDetail();
  }, [id]);

  const fetchStoryDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStoryDetail(id);
      setStory(res.data);
    } catch (err) {
      setError("Story not found or is undergoing moderation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Story Unavailable</h2>
          <p className="text-gray-600 mb-6">{error || "The story you requested could not be loaded."}</p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#2563EB]/90 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Student Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2563EB] mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Student Stories
        </Link>

        {/* Editorial Story Header */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-[#2563EB]/10 px-3 py-1 rounded-full">
              {story.category_name || 'Student Experience'}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={13} />
              Published {story.published_at ? new Date(story.published_at).toLocaleDateString() : 'Recently'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-8">
            {story.title}
          </h1>

          {/* Author info banner */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              {story.author_photo ? (
                <img
                  src={story.author_photo}
                  alt={story.author_name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg">
                  {story.author_name?.charAt(0) || 'S'}
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900">{story.author_name}</h3>
                <p className="text-xs text-gray-500">SS Student Community Contributor</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck size={20} className="text-[#2563EB]" title="Verified Student Story" />
            </div>
          </div>

          {/* Cover image if available */}
          {story.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img src={story.cover_image} alt={story.title} className="w-full max-h-[450px] object-cover" />
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 font-serif text-lg">
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-800">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer Call to Action / Impact Note */}
          <div className="mt-12 pt-8 border-t border-gray-100 bg-[#F8FAFC] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-[#0F172A] text-base">Inspired by this story?</h4>
              <p className="text-xs text-gray-600">Share your own journey with thousands of students across SS.</p>
            </div>
            <Link
              to="/student/stories"
              className="px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#2563EB]/90 whitespace-nowrap"
            >
              Share Your Story
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default StoryDetailPage;
