import React from 'react';
import { Video, Calendar, Users, ArrowRight, ShieldCheck } from 'lucide-react';

const OnlineSessionsSection = ({ onOpenJoinModal }) => {
  const sessions = [
    {
      title: 'AI Career Roadmap & Tools Bootcamp',
      mode: 'Online Zoom',
      date: 'Coming Soon (Phase 2)',
      capacity: '100 Participants',
      topic: 'Adapting to AI in tech, design, content & business roles.'
    },
    {
      title: 'Open Mic & Peer Mentorship Circle',
      mode: 'Online Zoom',
      date: 'Weekly Sundays',
      capacity: '50 Participants',
      topic: 'Discussing academic stress, backlogs, and career direction in a safe space.'
    },
    {
      title: 'Live Resume & Portfolio teardowns',
      mode: 'Interactive Webinar',
      date: 'Bi-Weekly',
      capacity: '80 Participants',
      topic: 'Live constructive feedback on student GitHub, Figma, and resumes.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            <Video className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Virtual Student Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2563EB] tracking-tight">
            Learn Together. Connect Online.
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Participate in interactive Zoom masterclasses, career Q&As, and live portfolio reviews from anywhere in India.
          </p>
        </div>

        {/* SESSION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sessions.map((sess, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-800 text-[11px] font-bold border border-blue-200">
                    {sess.mode}
                  </span>
                  <span className="text-xs font-bold text-[#2563EB] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                    Cap: {sess.capacity}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#2563EB] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {sess.title}
                </h3>
                <p className="text-xs font-bold text-[#2563EB] mb-3">{sess.date}</p>
                <p className="text-xs text-[#64748B] leading-relaxed mb-6">{sess.topic}</p>
              </div>

              <button
                onClick={onOpenJoinModal}
                className="w-full py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 border border-[#2563EB]/40"
              >
                <span>Reserve Seat Interest</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OnlineSessionsSection;
