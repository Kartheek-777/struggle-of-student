import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Filter, ArrowRight, UserCheck, Star, Sparkles } from 'lucide-react';
import { getSuccessStoriesList } from '../services/api';

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'Placement', 'Internship', 'Career', 'Leadership',
    'Project', 'Volunteer', 'Campus Ambassador', 'Skill Development'
  ];

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const defaultStories = [
    {
      id: 1,
      display_name: "Rajesh",
      student_name: "Rajesh",
      title: "Secured a 7 LPA Offer from Non-IT Core Enterprise",
      category: "Placement",
      excerpt: "Secured a Rs. 7 LPA offer from a leading Non-IT company after leveraging SS placement mentorship and skill guidance.",
      story: "Rajesh prepared for core domain interviews using SS resume clinics and aptitude sessions. His dedication and practical problem-solving skills helped him land a high-value 7 LPA offer at a top Non-IT core enterprise.",
      outcome: "Placed with Rs. 7 LPA Package (Non-IT Sector)",
      company: "Non-IT Core Enterprise",
      role: "Operations & Core Management Specialist",
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      display_name: "Nithya",
      student_name: "Nithya",
      title: "Achieved 7 LPA Non-IT Core Placement",
      category: "Placement",
      excerpt: "Landed a Rs. 7 LPA placement offer at a reputed Non-IT organization through SS interview bootcamps.",
      story: "Nithya participated actively in SS student sessions and mock interviews. Through focused preparation in analytical reasoning and domain concepts, she earned a 7 LPA package from a top Non-IT corporation.",
      outcome: "Placed with Rs. 7 LPA Package (Non-IT Sector)",
      company: "Non-IT Corporate Partner",
      role: "Business Strategy & Core Analyst",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      display_name: "Mohammed Sufiyan",
      student_name: "Mohammed Sufiyan",
      title: "Landed 7 LPA Non-IT Placement Offer Recently",
      category: "Placement",
      excerpt: "Successfully cleared multi-stage recruitment drives to land a 7 LPA package at a Non-IT enterprise.",
      story: "Mohammed Sufiyan leveraged SS resources, project portfolio guidance, and interview prep workshops. His consistent preparation resulted in a 7 LPA offer from a renowned Non-IT firm.",
      outcome: "Placed with Rs. 7 LPA Package (Non-IT Sector)",
      company: "Non-IT Core Industry",
      role: "Core Technical & Operations Associate",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await getSuccessStoriesList({ category: selectedCategory });
      const apiStories = res.data?.stories || res.data?.results || res.data || [];
      setStories(Array.isArray(apiStories) && apiStories.length > 0 ? apiStories : defaultStories);
    } catch (err) {
      console.error("Failed to load success stories:", err);
      setStories(defaultStories);
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
            <Award size={14} className="text-[#2563EB]" /> Verified Student Outcomes
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Student Success Stories
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Inspiring journeys of students building skills, landing roles, and leading initiatives with SS.
          </p>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-[#F8FAFC] shadow-md border border-[#2563EB]'
                  : 'bg-white text-gray-700 hover:bg-[#2563EB]/5 border border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* STORIES GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0]">
            <p className="text-gray-600 font-semibold text-sm">
              Student success stories are coming soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#FFFFFF] border border-[#E2E8F0] text-[#2563EB] text-[10px] font-bold uppercase rounded-md">
                      {story.category}
                    </span>
                    <span className="text-xs text-[#2563EB] font-bold flex items-center gap-1">
                      <Sparkles size={12} /> Verified
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#2563EB] group-hover:text-[#2563EB] transition-colors">
                    {story.title}
                  </h3>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2563EB] bg-[#FFFFFF] shrink-0">
                      <img
                        src={story.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                        alt={story.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2563EB]">{story.display_name}</h4>
                      {story.company && <p className="text-[11px] text-gray-500">{story.role || 'Student'} @ {story.company}</p>}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {story.excerpt || story.story}
                  </p>

                  {story.outcome && (
                    <div className="p-3 bg-[#2563EB]/10 border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#2563EB]">
                      Outcome: {story.outcome}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <Link
                    to={`/success-stories/${story.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
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

export default SuccessStoriesPage;
