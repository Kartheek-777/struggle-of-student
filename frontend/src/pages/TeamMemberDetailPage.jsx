import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Calendar, Award, Code, CheckCircle2 } from 'lucide-react';

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
import { getTeamDetail } from '../services/api';

const TeamMemberDetailPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeamDetail(id);
      setMember(res.data?.data || res.data);
    } catch (err) {
      setError("Team member profile not found.");
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

  if (error || !member) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Profile Not Found</h2>
          <p className="text-xs text-gray-600">{error || "This team member profile is not available."}</p>
          <Link to="/team" className="inline-block px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold">
            Back to Team List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/team" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft size={16} /> Back to SS Team
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8">
          
          {/* PROFILE TOP HEADER */}
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-[#2563EB] shrink-0 bg-[#FFFFFF] shadow-md">
              <img
                src={member.photo_display || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <span className="px-3 py-1 bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-[#2563EB] rounded-md uppercase tracking-wider">
                  {member.department}
                </span>
                <h1 className="text-3xl font-extrabold text-[#2563EB] mt-2">{member.name}</h1>
                <p className="text-sm font-bold text-[#2563EB]">{member.role}</p>
              </div>

              {member.joined_date && (
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center sm:justify-start">
                  <Calendar size={14} className="text-[#2563EB]" />
                  <span>Joined SS: {new Date(member.joined_date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-4 justify-center sm:justify-start">
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#2563EB] flex items-center gap-1 text-xs font-semibold">
                    <LinkedinIcon className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {member.github_url && (
                  <a href={member.github_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#2563EB] flex items-center gap-1 text-xs font-semibold">
                    <GithubIcon className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* BIO */}
          {member.bio && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">About</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* RESPONSIBILITIES */}
          {member.responsibilities && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Responsibilities</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{member.responsibilities}</p>
            </div>
          )}

          {/* SKILLS */}
          {member.skills_list && member.skills_list.length > 0 && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {member.skills_list.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-[#2563EB] rounded-xl">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CONTRIBUTIONS */}
          {member.contributions && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Projects & Contributions</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{member.contributions}</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default TeamMemberDetailPage;
