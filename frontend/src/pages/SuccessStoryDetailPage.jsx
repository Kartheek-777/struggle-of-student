import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Quote, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getSuccessStoryDetail } from '../services/api';

const SuccessStoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSuccessStoryDetail(id);
      setStory(res.data?.data || res.data);
    } catch (err) {
      setError("Success story not found or not published.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Story Not Found</h2>
          <p className="text-xs text-gray-600">{error || "This success story is unavailable."}</p>
          <Link to="/success-stories" className="inline-block px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold">
            Back to Success Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/success-stories" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft size={16} /> Back to Success Stories
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8">
          
          {/* HEADER */}
          <div className="space-y-4 border-b border-[#E2E8F0] pb-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#FFFFFF] border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase rounded-md">
                {story.category}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold border border-[#E2E8F0]">
                <ShieldCheck size={14} /> Verified Outcome
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-[#2563EB]">{story.title}</h1>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2563EB] bg-[#FFFFFF] shrink-0">
                <img
                  src={story.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={story.display_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2563EB]">{story.display_name}</h4>
                {story.company && <p className="text-xs text-gray-500">{story.role || 'Student'} @ {story.company}</p>}
              </div>
            </div>
          </div>

          {/* OUTCOME BOX */}
          {story.outcome && (
            <div className="p-6 bg-[#2563EB]/10 border border-[#E2E8F0] rounded-2xl space-y-1">
              <span className="text-xs font-bold text-[#2563EB] uppercase">Measurable Outcome</span>
              <p className="text-base font-extrabold text-[#2563EB]">{story.outcome}</p>
            </div>
          )}

          {/* CHALLENGE */}
          {story.challenge && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">The Challenge</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{story.challenge}</p>
            </div>
          )}

          {/* HOW SS HELPED */}
          {story.how_ss_helped && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">How SS Helped</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{story.how_ss_helped}</p>
            </div>
          )}

          {/* FULL STORY */}
          <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
            <h3 className="text-lg font-bold text-[#2563EB]">The Student Journey</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{story.story}</p>
          </div>

          {/* QUOTE */}
          {story.student_quote && (
            <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] flex gap-3 border-l-4 border-l-[#B45309]">
              <Quote className="w-6 h-6 text-[#2563EB] shrink-0" />
              <blockquote className="text-xs text-[#2563EB] font-medium italic leading-relaxed">
                "{story.student_quote}"
              </blockquote>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SuccessStoryDetailPage;
