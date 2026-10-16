import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Search, Filter, Sparkles, 
  CheckCircle2, Users, ArrowRight, Video, AlertCircle, RefreshCw 
} from 'lucide-react';
import { apiService } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    'All', 'Workshop', 'Conference', 'Meetup', 'Competition', 
    'Hackathon', 'Career Session', 'Networking', 'Community', 'Cultural', 'Other'
  ];

  const modes = ['All', 'Online', 'Offline', 'Hybrid'];
  const statuses = ['All', 'REGISTRATION_OPEN', 'CLOSING_SOON', 'REGISTRATION_CLOSED', 'COMPLETED'];
  const locations = ['All', 'Hyderabad', 'Remote'];

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        page_size: 12,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedMode !== 'All') params.mode = selectedMode;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedLocation !== 'All') params.location = selectedLocation;

      const res = await apiService.getEvents(params);
      if (res.success) {
        setEvents(res.events || []);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total_count || 0);
      } else {
        setError(res.message || 'Failed to load events.');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, selectedCategory, selectedMode, selectedStatus, selectedLocation, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedMode('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
    setPage(1);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'TBA';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
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

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'REGISTRATION_OPEN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#E2E8F0]">Registration Open</span>;
      case 'CLOSING_SOON':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Closing Soon</span>;
      case 'REGISTRATION_FULL':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Registration Full</span>;
      case 'REGISTRATION_CLOSED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-800 border border-gray-300">Registration Closed</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Event Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Open</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* HERO HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/40 text-[#2563EB] text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>SS Community Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2563EB] tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-base sm:text-lg text-[#0F172A]/80 font-medium">
            Learn, connect, contribute and grow with the SS community.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
          
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2563EB]/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search events by title, description, location, organizer..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] placeholder-[#0F172A]/50 focus:outline-none focus:border-[#2563EB] text-sm font-medium transition-colors"
            />
          </div>

          {/* FILTER SELECTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            {/* CATEGORY */}
            <div>
              <label className="block text-xs font-bold text-[#2563EB] mb-1">Event Type</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* MODE */}
            <div>
              <label className="block text-xs font-bold text-[#2563EB] mb-1">Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => { setSelectedMode(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
              >
                {modes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-xs font-bold text-[#2563EB] mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="All">All Statuses</option>
                <option value="REGISTRATION_OPEN">Registration Open</option>
                <option value="CLOSING_SOON">Closing Soon</option>
                <option value="REGISTRATION_CLOSED">Registration Closed</option>
                <option value="COMPLETED">Event Completed</option>
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-xs font-bold text-[#2563EB] mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

          </div>

          {/* ACTIVE FILTER STATS & RESET */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs font-bold text-[#2563EB]">
            <span>Showing {totalCount} events</span>
            {(search || selectedCategory !== 'All' || selectedMode !== 'All' || selectedStatus !== 'All' || selectedLocation !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-extrabold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-800">{error}</h3>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && events.length === 0 && (
          <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-[#2563EB] mx-auto" />
            <h3 className="text-xl font-extrabold text-[#2563EB]">No upcoming events right now</h3>
            <p className="text-sm text-[#0F172A]/70 font-medium">
              We couldn't find any events matching your selected search or filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#2563EB] text-[#F8FAFC] rounded-xl text-xs font-bold border border-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* EVENT CARDS GRID */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#2563EB] transition-all group"
              >
                <div className="space-y-4">
                  
                  {/* HEADER BADGES */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] uppercase tracking-wider">
                      {event.category}
                    </span>
                    {getStatusBadge(event.effective_status)}
                  </div>

                  {/* EVENT TITLE */}
                  <h3 className="text-xl font-extrabold text-[#2563EB] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  {/* DATE & TIME */}
                  <div className="space-y-1 text-xs font-semibold text-[#0F172A]/80">
                    <div className="flex items-center gap-2 text-[#2563EB]">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{formatDate(event.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</span>
                    </div>
                  </div>

                  {/* LOCATION & MODE */}
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0]">
                      {event.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />}
                      <span>{event.mode}</span>
                    </div>
                    <span className="text-[#0F172A]/70 truncate">{event.location}</span>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="text-xs text-[#0F172A]/80 line-clamp-3 leading-relaxed">
                    {event.short_description || event.description}
                  </p>

                  {/* CAPACITY INDICATOR */}
                  <div className="pt-2 border-t border-[#E2E8F0] text-xs font-semibold text-[#0F172A]/70 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{event.registered_count} / {event.participant_capacity} Registered</span>
                    </div>
                    {event.is_registered && (
                      <span className="text-[#2563EB] font-extrabold text-[11px] bg-[#2563EB]/10 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        Registered
                      </span>
                    )}
                  </div>

                </div>

                {/* CARD FOOTER CTA */}
                <div className="pt-5">
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs shadow hover:bg-[#1D4ED8] transition-colors border border-[#2563EB]/50"
                  >
                    <span>View Event</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl border-2 border-[#E2E8F0] bg-white text-xs font-bold text-[#2563EB] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-[#2563EB] px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 rounded-xl border-2 border-[#E2E8F0] bg-white text-xs font-bold text-[#2563EB] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventsPage;
