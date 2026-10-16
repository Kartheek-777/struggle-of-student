import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Tag } from 'lucide-react';

const LatestUpdatesSection = () => {
  const updates = [
    {
      title: 'Struggle of Student Phase 1 Portal Launch',
      date: 'October 2026',
      category: 'Community Announcement',
      snippet: 'Official launch of the SS public website, connecting students across India with opportunities, skills, and events.'
    },
    {
      title: 'Hyderabad Campus Ambassador Drive 2026',
      date: 'November 2026',
      category: 'Campus Outreach',
      snippet: 'Inviting energetic student leaders across engineering, arts, and degree colleges to represent SS on campus.'
    },
    {
      title: 'Student Stories: From 14 Rejections to Full-stack Intern',
      date: 'November 2026',
      category: 'Student Story',
      snippet: 'An authentic reflection on handling college interview rejections and rebuilding confidence through peer projects.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
              <Newspaper className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>News & Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2563EB] tracking-tight">
              Latest from SS
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-2xl">
              Stay updated with community announcements, student success highlights, and campus initiatives.
            </p>
          </div>

          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-sm hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-md border border-[#2563EB]/40"
          >
            <span>View All Updates</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </Link>
        </div>

        {/* UPDATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {updates.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[11px] font-bold uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#64748B] font-mono">{item.date}</span>
                </div>

                <h3 className="text-xl font-bold text-[#2563EB] mb-3 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                  {item.snippet}
                </p>
              </div>

              <Link
                to="/community"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestUpdatesSection;
