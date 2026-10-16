import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  Video, Calendar, Clock, ArrowRight, Sparkles, CheckCircle2, Play 
} from 'lucide-react';

const UpcomingSessionsSection = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getSessions({ is_featured: 'true', past: 'false' })
      .then((res) => {
        setSessions((res.events || []).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || sessions.length === 0) return null;

  return (
    <section className="py-16 bg-[#FFFFFF] border-t border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Live Learning & Workshops</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2563EB] tracking-tight">
              Upcoming Online Sessions & Workshops
            </h2>
            <p className="text-sm text-[#64748B] max-w-2xl">
              Participate in live technical masterclasses, career sessions, and interactive workshops with industry mentors.
            </p>
          </div>

          <Link
            to="/sessions"
            className="px-5 py-2.5 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-md border border-[#2563EB]/40 flex items-center gap-2 shrink-0"
          >
            <span>View All Sessions</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sessions.map((sess) => {
            const startDate = new Date(sess.start_datetime);
            const dateStr = startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const timeStr = startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={sess.id}
                className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#2563EB] text-[#F8FAFC] text-[10px] font-extrabold uppercase">
                      {sess.session_type?.replace('_', ' ') || sess.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#2563EB]">
                      {sess.registered_count} / {sess.participant_capacity} Registered
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#2563EB] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {sess.title}
                  </h3>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                    {sess.short_description || sess.description}
                  </p>

                  <div className="space-y-1 text-xs font-semibold text-gray-700 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{dateStr} - {timeStr} IST</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#2563EB]" />
                      <span>{sess.mode} ({sess.meeting_provider || 'Online'})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    to={`/sessions/${sess.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs text-center hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 shadow-sm border border-[#2563EB]/30"
                  >
                    <span>View & Register</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default UpcomingSessionsSection;
