import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Filter, ArrowRight, Globe } from 'lucide-react';

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
import { getTeamList } from '../services/api';

const TeamPage = ({ onOpenJoinModal }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  const departments = [
    'All', 'Core Team', 'Technology', 'Events', 'Community',
    'Content', 'Marketing', 'Design', 'Operations', 'Volunteer Coordination', 'Partnerships'
  ];

  useEffect(() => {
    fetchTeam();
  }, [selectedDept]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await getTeamList({ department: selectedDept });
      setTeamMembers(res.data?.team || res.data?.results || res.data || []);
    } catch (err) {
      console.error("Failed to load team members:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20">
            <Users size={14} className="text-[#2563EB]" /> Active Team Members
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            The SS Team
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Students and professionals contributing their time, skills and energy to build the SS community.
          </p>
        </div>

        {/* DEPARTMENT FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-[#2563EB] text-[#F8FAFC] shadow-md border border-[#2563EB]'
                  : 'bg-white text-gray-700 hover:bg-[#2563EB]/5 border border-[#E2E8F0]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* TEAM GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0]">
            <p className="text-gray-600 font-semibold text-sm">
              Our team information will be updated soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-lg transition-all flex flex-col justify-between text-center group"
              >
                <div>
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-[#2563EB] bg-[#FFFFFF] group-hover:scale-105 transition-transform">
                    <img
                      src={member.photo_display || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#2563EB]">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#2563EB] mt-0.5">{member.role}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#FFFFFF] text-[10px] font-bold text-gray-600 rounded-full border border-[#E2E8F0]">
                    {member.department}
                  </span>

                  <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    {member.short_bio || member.bio || "Building digital solutions & community for SS."}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#2563EB]">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}
                    {member.github_url && (
                      <a href={member.github_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#2563EB]">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <Link
                    to={`/team/${member.id}`}
                    className="text-xs font-bold text-[#2563EB] hover:text-[#2563EB] inline-flex items-center gap-1"
                  >
                    <span>Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

export default TeamPage;
