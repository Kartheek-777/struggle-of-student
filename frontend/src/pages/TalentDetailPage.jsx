import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ExternalLink, Globe, AlertCircle, Loader2, Share2 } from 'lucide-react';
import { apiService } from '../services/api';

const TalentDetailPage = () => {
  const { id } = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getTalentDetail(id)
      .then((res) => {
        if (res.data) {
          setTalent(res.data);
          document.title = `${res.data.student_name} - ${res.data.title || 'Student Talent'} | Struggle of Student`;
        } else {
          setError('Talent profile not found.');
        }
      })
      .catch(() => setError('Talent profile not found or unavailable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-16 px-4 flex items-center justify-center">
        <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="text-xl font-extrabold text-[#2563EB]">Talent Profile Not Found</h3>
          <Link to="/talent" className="inline-block px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold">
            Back to Talent Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/talent" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
          <span>Back to Talent Directory</span>
        </Link>

        {/* HERO CARD */}
        <div className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#E2E8F0] pb-6">
            <div className="w-24 h-24 rounded-full bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-bold text-3xl overflow-hidden border-4 border-[#2563EB]/50 shrink-0 shadow-lg">
              {talent.student_photo ? (
                <img src={talent.student_photo} alt={talent.student_name} className="w-full h-full object-cover" />
              ) : (
                <span>{talent.student_name?.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] uppercase tracking-wider">
                {talent.category_name || talent.category || 'Talent'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{talent.student_name}</h1>
              <p className="text-xs text-[#0F172A]/70 font-semibold">{talent.college} - {talent.course}</p>
              <h2 className="text-lg font-bold text-[#2563EB]">{talent.title}</h2>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[#2563EB] uppercase tracking-wider">About Talent</h3>
            <p className="text-sm text-[#0F172A] leading-relaxed font-medium whitespace-pre-line">
              {talent.description || talent.short_description}
            </p>
          </div>

          {/* SKILLS */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
              <h3 className="text-xs font-extrabold text-[#2563EB] uppercase">Skills & Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#2563EB]">
                    {typeof s === 'object' ? s.name : s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO & LINKS */}
          <div className="border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center gap-3">
            {talent.portfolio_url && (
              <a href={talent.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
                <Globe className="w-4 h-4 text-[#2563EB]" />
                <span>View Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {talent.social_links && (
              <a href={talent.social_links} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold">
                <Share2 className="w-4 h-4" />
                <span>Social Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TalentDetailPage;
