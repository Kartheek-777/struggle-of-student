import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, ArrowRight, Sparkles, Users } from 'lucide-react';
import { apiService } from '../services/api';

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getEvents({ page_size: 3 })
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return 'TBA';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold uppercase tracking-wider mb-3 border border-[#E2E8F0]">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>What's Happening Around SS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-2xl font-medium">
              Learn, connect, contribute and grow with the SS community.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-md shadow-[#2563EB]/20"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* EVENTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-[#F8FAFC] animate-pulse rounded-3xl border border-[#E2E8F0]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-2xl transition-all group"
              >
                <div>
                  {/* DATE & MODE BADGE */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2563EB] text-white text-xs font-bold shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-white" />
                      <span>{formatDate(evt.start_datetime)}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-[#EFF6FF] text-[#2563EB] border border-[#E2E8F0]">
                      {evt.mode}
                    </span>
                  </div>

                  {/* EVENT TITLE */}
                  <h3 className="text-xl font-black text-[#0F172A] mb-3 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {evt.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 line-clamp-3 font-medium">
                    {evt.short_description || evt.description}
                  </p>

                  {/* EVENT DETAILS */}
                  <div className="space-y-2 text-xs font-medium text-[#0F172A] border-t border-[#E2E8F0] pt-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>Time: {formatTime(evt.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evt.mode === 'Online' ? (
                        <Video className="w-4 h-4 text-[#2563EB]" />
                      ) : (
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                      )}
                      <span>Location: {evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#2563EB] font-bold">
                      <Users className="w-4 h-4 text-[#2563EB]" />
                      <span>Participants: {evt.registered_count} / {evt.participant_capacity}</span>
                    </div>
                  </div>
                </div>

                {/* CARD CTA */}
                <Link
                  to={`/events/${evt.id}`}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#2563EB]/20"
                >
                  <span>View Event & Register</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default UpcomingEventsSection;

