import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, MapPin, 
  GraduationCap, Award, Briefcase, ExternalLink, Code, AlertCircle 
} from 'lucide-react';
import { getCommunityMembers, getCommunityStats } from '../services/api';

const CommunityPage = () => {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]);

  const fetchStats = async () => {
    try {
      const res = await getCommunityStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load community stats", err);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;
      const res = await getCommunityMembers(params);
      setMembers(res.data.results || res.data || []);
    } catch (err) {
      setError("Failed to load community directory.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-4">
            <Users size={14} /> Global SS Community Directory
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Our Community
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Students, creators, builders and leaders growing together on Struggle of Student.
          </p>
        </div>

        {/* Real Backend Statistics Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{stats.total_members}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Active Members</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{stats.active_ambassadors}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Ambassadors</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{stats.project_contributors}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Project Builders</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-800">{stats.volunteer_members}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Volunteers</div>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">{stats.student_contributors}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Talents & Authors</div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search community members by name, skill, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter size={18} className="text-gray-500 shrink-0" />
              {[
                { label: 'All Roles', value: '' },
                { label: 'Ambassadors', value: 'ambassador' },
                { label: 'Volunteers', value: 'volunteer' },
                { label: 'Builders', value: 'builder' },
                { label: 'Talent', value: 'talent' },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setRoleFilter(role.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    roleFilter === role.value
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Member Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p className="font-semibold">{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm border border-gray-100">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">No Members Found</h3>
            <p className="text-gray-500 mt-2">No public community members match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {member.profile_photo ? (
                      <img
                        src={member.profile_photo}
                        alt={member.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F172A] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                        {member.full_name?.charAt(0) || 'S'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#0F172A] truncate">{member.full_name}</h3>
                      <p className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 mt-0.5">
                        <GraduationCap size={13} /> {member.college || 'SS Community Member'}
                      </p>
                      {member.course && (
                        <p className="text-xs text-gray-500 truncate">{member.course}</p>
                      )}
                    </div>
                  </div>

                  {/* Badges / Roles */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.community_roles && member.community_roles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-600 text-xs line-clamp-2 mb-4">
                      "{member.bio}"
                    </p>
                  )}

                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.skills.slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {typeof sk === 'object' ? sk.name : sk}
                        </span>
                      ))}
                      {member.skills.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                          +{member.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#2563EB]" /> Verified Member
                  </span>
                  {member.has_talent && (
                    <span className="text-[#2563EB] font-medium">Talent Showcase</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
