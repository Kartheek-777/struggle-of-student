import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { 
  UserCheck, Briefcase, Calendar, Bookmark, FileText, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, 
  Code, BookOpen, Star, Award, Building2, Users, HelpCircle, Settings, Bell,
  MessageSquare, Compass, Video, LifeBuoy, HeartHandshake, ExternalLink
} from 'lucide-react';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const completion = Number(profile?.completion_percentage || 0);

  const [stats, setStats] = useState({
    opportunity_applications: 0,
    saved_opportunities: 0,
    event_registrations: 0,
    upcoming_events: 0,
    volunteer_applications: 0,
    talents_count: 0,
    projects_count: 0,
    stories_count: 0,
    achievements_count: 0,
    open_support_requests: 0,
    service_enquiries_count: 0,
    leadership_applications_count: 0,
    ambassador_status: null
  });
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [recommendedOpps, setRecommendedOpps] = useState([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState([]);

  useEffect(() => {
    apiService.getStudentDashboardStats()
      .then((res) => {
        if (res.success && res.stats) setStats(res.stats);
      })
      .catch(() => {});

    apiService.getNotifications({ filter: 'all' })
      .then((res) => {
        const notifData = res.data || res;
        setRecentNotifs(Array.isArray(notifData) ? notifData.slice(0, 3) : []);
      })
      .catch(() => {});

    apiService.getPersonalizedRecommendations()
      .then((res) => {
        const data = res.data || res;
        setRecommendedOpps(data.recommended_opportunities || []);
      })
      .catch(() => {});

    apiService.getEvents({ past: 'false', page_size: 3 })
      .then((res) => {
        const events = res.events || res.data || [];
        setUpcomingEventsList(Array.isArray(events) ? events.slice(0, 3) : []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* ADMIN MODE SWITCH BANNER */}
        {profile?.role && profile?.role !== 'STUDENT' && (
          <div className="bg-[#F8FAFC] text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border border-slate-200">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Logged in as <strong>{profile.role.replace('_', ' ')}</strong>. You are currently viewing the student dashboard preview.</span>
            </div>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs hover:bg-[#1D4ED8] transition shrink-0 flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Go to Admin Operations Control Center</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        )}
        
        {/* WELCOME BANNER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-black uppercase tracking-wider border border-[#2563EB]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Verified SS Student Developer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Welcome back,{' '}
              <span className="text-[#2563EB]">
                {profile?.full_name || 'Student'}!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
              You are connected as a verified student from <span className="font-black text-[#0F172A]">{profile?.college || 'your college'}</span> ({profile?.course || 'Degree'}, Class of {profile?.graduation_year || '2026'}).
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center p-4 bg-[#EFF6FF] rounded-2xl border border-blue-100 shadow-2xs">
            <div className="w-20 h-20 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-black text-2xl shadow-md">
              SS
            </div>
          </div>
        </div>

        {/* PROFILE COMPLETION CARD (ONLY SHOWN IF PROFILE IS INCOMPLETE) */}
        {completion < 100 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Profile Setup Progress</span>
                <h3 className="text-2xl font-black text-[#0F172A]">
                  Your Profile is {completion}% Complete
                </h3>
              </div>

              <Link
                to="/student/profile"
                className="px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <span>Complete Profile</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-slate-600 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.full_name && profile?.phone_number ? 'text-[#2563EB]' : 'text-slate-600'}`} />
                <span>Basic Info</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.college && profile?.course ? 'text-[#2563EB]' : 'text-slate-600'}`} />
                <span>Education</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.skills?.length > 0 ? 'text-[#2563EB]' : 'text-slate-600'}`} />
                <span>Skills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.interests?.length > 0 ? 'text-[#2563EB]' : 'text-slate-600'}`} />
                <span>Interests</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: PARTICIPATE IN UPCOMING EVENTS & SESSIONS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-2xs border border-blue-100">
                <Calendar className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0F172A]">Upcoming Events & Workshops</h3>
                <p className="text-xs text-slate-500 font-medium">Participate in live technical bootcamps, AI masterclasses & career webinars.</p>
              </div>
            </div>

            <Link
              to="/sessions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition shadow-md shrink-0"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {upcomingEventsList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-[#F8FAFC] rounded-2xl border border-slate-200">
              No upcoming events right now. Check back soon or explore past workshops!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEventsList.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#F8FAFC] border border-slate-200 hover:border-[#2563EB] rounded-2xl p-5 shadow-2xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-[#2563EB]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-blue-200 uppercase">
                        {event.session_type || 'Workshop'}
                      </span>
                      <span className="text-slate-500 font-bold">{event.mode}</span>
                    </div>

                    <h4 className="text-base font-black text-[#0F172A] leading-snug line-clamp-2">
                      {event.title}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2">
                      {event.short_description || event.description}
                    </p>

                    <div className="text-[11px] font-semibold text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div>📍 {event.location || 'Online Zoom'}</div>
                      <div>📅 {new Date(event.start_datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <Link
                    to={`/sessions/${event.id}`}
                    className="mt-4 w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Register / Participate</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: SHOWCASE SPECIAL TALENTS, PROJECTS & ACHIEVEMENTS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-2xs border border-blue-100">
              <Star className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0F172A]">Register Special Talents & Student Work</h3>
              <p className="text-xs text-slate-500 font-medium">Showcase your skills, coding projects, or campus achievements to the nationwide SS network.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition shadow-2xs">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-black text-[#0F172A]">Showcase Talent</h4>
                <p className="text-xs text-slate-500 font-medium">Register singing, photography, UI design, video editing, or sports talents on SS showcase.</p>
              </div>
              <Link
                to="/student/talent"
                className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2"
              >
                <span>Register Talent Profile</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition shadow-2xs">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-black text-[#0F172A]">Submit Student Project</h4>
                <p className="text-xs text-slate-500 font-medium">Publish your web app, mobile app, AI project or hardware build for peer review and showcase.</p>
              </div>
              <Link
                to="/student/projects"
                className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2"
              >
                <span>Submit New Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition shadow-2xs">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-black text-[#0F172A]">Add Achievement</h4>
                <p className="text-xs text-slate-500 font-medium">Display hackathon wins, academic honors, or certifications on your verified student profile.</p>
              </div>
              <Link
                to="/student/achievements"
                className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2"
              >
                <span>Post Achievement</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

          </div>
        </div>

        {/* SECTION 3: NEED HELP OR SUPPORT FROM SS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-2xs border border-blue-100">
              <HelpCircle className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0F172A]">Need Any Help or Support from SS?</h3>
              <p className="text-xs text-slate-500 font-medium">Get direct career guidance, raise support tickets, or request technical event support from SS teams.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-[#2563EB] transition">
              <div className="flex items-center gap-2 text-sm font-black text-[#0F172A]">
                <LifeBuoy className="w-5 h-5 text-[#2563EB]" />
                <span>Raise Support Ticket</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Have a query regarding placements, internships, or college projects? Submit a ticket for direct assistance.
              </p>
              <Link
                to="/student/support"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline pt-1"
              >
                <span>Open Support Ticket</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-[#2563EB] transition">
              <div className="flex items-center gap-2 text-sm font-black text-[#0F172A]">
                <Settings className="w-5 h-5 text-[#2563EB]" />
                <span>Enquire SS Services</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Need technical event management, web project guidance, or SS Band performance for your college campus?
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline pt-1"
              >
                <span>Browse SS Services</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-[#2563EB] transition">
              <div className="flex items-center gap-2 text-sm font-black text-[#0F172A]">
                <HeartHandshake className="w-5 h-5 text-[#2563EB]" />
                <span>Leadership & Volunteering</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Become a Campus Ambassador or lead student chapters to build practical leadership experience.
              </p>
              <Link
                to="/campus-ambassador"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline pt-1"
              >
                <span>Apply as Ambassador</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </Link>
            </div>

          </div>
        </div>

        {/* NOTIFICATIONS PREVIEW WIDGET */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-2xs border border-blue-100">
                <Bell className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">Latest Notifications</h3>
                <p className="text-xs text-slate-500 font-medium">Important status updates and platform announcements.</p>
              </div>
            </div>

            <Link
              to="/notifications"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 group"
            >
              <span>View all notifications</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {recentNotifs.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-[#F8FAFC] rounded-2xl border border-slate-200">
              No recent notifications. You're all caught up!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentNotifs.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !n.is_read ? 'bg-[#EFF6FF] border-[#2563EB]/30 shadow-2xs' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-[#0F172A] leading-snug line-clamp-1">{n.title}</span>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1" />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{n.message}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-semibold">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                    {n.cta_link && (
                      <Link to={n.cta_link} className="font-bold text-[#2563EB] hover:underline">
                        {n.cta_text || 'View'} {'->'}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PERSONALIZED RECOMMENDATIONS SECTION */}
        {recommendedOpps.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-2xs border border-blue-100">
                  <Sparkles className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Recommended Opportunities for You</h3>
                  <p className="text-xs text-slate-500 font-medium">Based on your skills ({profile?.skills?.map(s => s.name).join(', ') || 'profile interests'}).</p>
                </div>
              </div>

              <Link
                to="/opportunities"
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 group"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedOpps.slice(0, 3).map(opp => (
                <Link
                  key={opp.id}
                  to={`/opportunities/${opp.id}`}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-[#2563EB] shadow-2xs transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[10px] uppercase border border-blue-200">
                      {opp.opportunity_type || 'Opportunity'}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-1">{opp.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{opp.organization_name} - {opp.location || 'Remote'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#2563EB]">
                    <span>View Listing {'->'}</span>
                    {opp.stipend_salary && <span className="text-slate-500 text-[10px]">{opp.stipend_salary}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
