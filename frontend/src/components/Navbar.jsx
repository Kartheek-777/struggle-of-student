import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ArrowRight, Sparkles, User, LogOut, LayoutDashboard, 
  ChevronDown, Code, BookOpen, Award, Building2, Star, ShieldCheck, Heart, Users, Briefcase, HelpCircle, PhoneCall,
  Bell, Settings, CheckCheck, Mail, Search, Bookmark, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotificationCount, getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';


const Navbar = ({ onOpenJoinModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [opportunitiesDropdownOpen, setOpportunitiesDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);

  const { isAuthenticated, profile, logout } = useAuth();
  const location = useLocation();

  const fetchNotificationState = async () => {
    if (!isAuthenticated) return;
    try {
      const countRes = await getUnreadNotificationCount();
      setUnreadCount(countRes.data?.unread_count ?? countRes.unread_count ?? 0);

      const notifRes = await getNotifications({ filter: 'all' });
      setRecentNotifs((notifRes.data || notifRes).slice(0, 4));
    } catch (err) {
      // Silently handle auth/network errors
    }
  };

  useEffect(() => {
    fetchNotificationState();
    const interval = setInterval(fetchNotificationState, 25000);
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
      setRecentNotifs(prev => prev.map(n => ({ ...n, status: 'READ', is_read: true })));
    } catch (err) {}
  };

  const handleSingleRead = async (id, link) => {
    try {
      await markNotificationRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setRecentNotifs(prev => prev.map(n => n.id === id ? { ...n, status: 'READ', is_read: true } : n));
    } catch (err) {}
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some(p => location.pathname === p);

  const aboutLinks = [
    { name: 'About SS', path: '/about', desc: 'Who we are, mission & identity' },
    { name: 'Leadership', path: '/leadership', desc: 'Founder, directors & team leads' },
    { name: 'The SS Team', path: '/team', desc: 'Student & core team members' },
    { name: 'Student Placements', path: '/placements', desc: 'Verified career outcomes' },
    { name: 'Our Impact', path: '/impact', desc: 'Backend statistics & milestones' },
    { name: 'Success Stories', path: '/success-stories', desc: 'Student achievement journeys' },
  ];

  const opportunitiesLinks = [
    { name: 'All Opportunities', path: '/opportunities', desc: 'Explore all available listings' },
    { name: 'Internships', path: '/opportunities?category=Internships', desc: 'Stipended & remote internships' },
    { name: 'IT Jobs', path: '/opportunities?category=IT Jobs', desc: 'Software, dev & tech roles' },
    { name: 'Non IT Jobs', path: '/opportunities?category=Non IT Jobs', desc: 'Management, media & core roles' },
  ];

  const communityLinks = [
    { name: 'Community Hub', path: '/community', desc: 'Connect with peers & members' },
    { name: 'Talent Showcase', path: '/talent', desc: 'Student portfolios & creative work' },
    { name: 'Student Projects', path: '/projects', desc: 'Open student projects & MVPs' },
    { name: 'Student Stories', path: '/stories', desc: 'Peer articles & hostel stories' },
    { name: 'Campus Ambassador', path: '/campus-ambassador', desc: 'Lead SS on your campus' },
  ];

  const servicesLinks = [
    { name: 'Online Sessions', path: '/sessions', desc: 'Live technical masterclasses & webinars' },
    { name: 'Hands-on Workshops', path: '/workshops', desc: 'Interactive skill building workshops' },
    { name: 'Past Session Recordings', path: '/sessions/past', desc: 'Watch recorded live streams' },
    { name: 'SS Services', path: '/services', desc: 'Event, IT & Student Band services' },
    { name: 'Student Support', path: '/support', desc: 'Get career & academic guidance' },
    { name: 'Contact SS', path: '/contact', desc: 'Reach out to the SS team' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform p-1 overflow-hidden relative">
              <img
                src="/logo.png"
                alt="Struggle of Student Logo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.classList.remove('hidden');
                    e.target.nextElementSibling.classList.add('flex');
                  }
                }}
              />
              <span className="hidden font-black text-[#2457E6] text-base sm:text-lg tracking-tighter">SS</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-[#2457E6] transition-colors">
                  Struggle of Student
                </span>
                <span className="hidden sm:inline-block bg-[#EFF6FF] text-[#2457E6] border border-blue-200 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  DEV HUB
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mt-1">
                DREAM - LEARN - GROW - TOGETHER
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            
            {/* 1. HOME */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                isActive('/')
                  ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                  : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
              }`}
            >
              Home
            </Link>

            {/* 2. ABOUT SS (DROPDOWN) */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                  isParentActive(['/about', '/leadership', '/team', '/placements', '/impact', '/success-stories'])
                    ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                    : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
                }`}
              >
                <span>About SS</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 space-y-1 animate-fadeIn z-50">
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setAboutDropdownOpen(false)}
                      className={`block px-4 py-2 hover:bg-[#EFF6FF] transition-colors ${isActive(item.path) ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : ''}`}
                    >
                      <div className="text-xs font-bold text-slate-900 hover:text-[#2563EB]">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. OPPORTUNITIES (DROPDOWN) */}
            <div 
              className="relative"
              onMouseEnter={() => setOpportunitiesDropdownOpen(true)}
              onMouseLeave={() => setOpportunitiesDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                  isParentActive(['/opportunities'])
                    ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                    : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
                }`}
              >
                <span>Opportunities</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${opportunitiesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {opportunitiesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 space-y-1 animate-fadeIn z-50">
                  {opportunitiesLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpportunitiesDropdownOpen(false)}
                      className={`block px-4 py-2 hover:bg-[#EFF6FF] transition-colors ${isActive(item.path) ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : ''}`}
                    >
                      <div className="text-xs font-bold text-slate-900 hover:text-[#2563EB]">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. EVENTS */}
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                isActive('/events')
                  ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                  : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
              }`}
            >
              Dev Events
            </Link>

            {/* 5. COMMUNITY (DROPDOWN) */}
            <div 
              className="relative"
              onMouseEnter={() => setCommunityDropdownOpen(true)}
              onMouseLeave={() => setCommunityDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                  isParentActive(['/community', '/talent', '/projects', '/stories', '/campus-ambassador'])
                    ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                    : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
                }`}
              >
                <span>Community</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${communityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {communityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 space-y-1 animate-fadeIn z-50">
                  {communityLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setCommunityDropdownOpen(false)}
                      className={`block px-4 py-2 hover:bg-[#EFF6FF] transition-colors ${isActive(item.path) ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : ''}`}
                    >
                      <div className="text-xs font-bold text-slate-900 hover:text-[#2563EB]">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 6. SERVICES & SUPPORT (DROPDOWN WITH SESSIONS & WORKSHOPS) */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                  isParentActive(['/services', '/support', '/contact', '/sessions', '/workshops'])
                    ? 'text-[#2563EB] bg-[#EFF6FF] border-b-2 border-[#2563EB]'
                    : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-100/80'
                }`}
              >
                <span>Roadmaps & Support</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 space-y-1 animate-fadeIn z-50">
                  {servicesLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setServicesDropdownOpen(false)}
                      className={`block px-4 py-2 hover:bg-[#EFF6FF] transition-colors ${isActive(item.path) ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : ''}`}
                    >
                      <div className="text-xs font-bold text-slate-900 hover:text-[#2563EB]">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* DASHBOARD LINK (IF AUTHENTICATED) */}
            {isAuthenticated && (
              <Link
                to={profile?.role && profile?.role !== 'STUDENT' ? "/admin" : "/student/dashboard"}
                className="ml-1 px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-[#2563EB] transition-all shadow-xs"
              >
                Dashboard
              </Link>
            )}

          </nav>

          {/* ACTIONS / PROFILE DROPDOWN */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* GLOBAL SEARCH ICON BUTTON */}
            <Link
              to="/search"
              className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
              title="Search SS Platform"
            >
              <Search className="w-4 h-4" />
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#2563EB] hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-extrabold text-sm shadow-md shadow-[#2563EB]/20 hover:bg-[#1D4ED8] transition-all group"
                >
                  <span>Join Community</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                
                {/* NOTIFICATION BELL DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 hover:text-[#2563EB] transition-all"
                    title="Notifications"
                    id="notification-bell-btn"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#2563EB] text-white font-black text-[9px] rounded-full shadow-sm animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION PREVIEW DROPDOWN */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl py-3 z-50 animate-fadeIn">
                      <div className="px-4 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto px-2 space-y-1">
                        {recentNotifs.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            You're all caught up! No notifications.
                          </div>
                        ) : (
                          recentNotifs.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleSingleRead(n.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                !n.is_read ? 'bg-[#EFF6FF] border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs text-slate-900 leading-snug">{n.title}</span>
                                {!n.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                                <span className="text-[9px] font-medium text-slate-400">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {n.cta_link && (
                                  <Link
                                    to={n.cta_link}
                                    onClick={() => setNotifDropdownOpen(false)}
                                    className="text-[10px] font-bold text-[#2563EB] hover:underline"
                                  >
                                    {n.cta_text || 'View Detail'} {'->'}</Link>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 px-4 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                        >
                          View All Notifications {'->'}</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* USER PROFILE BUTTON & DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100/90 border border-slate-200 hover:border-[#2563EB] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-xs uppercase overflow-hidden shadow-xs">
                      {profile?.profile_photo ? (
                        <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{profile?.full_name?.charAt(0) || 'S'}</span>
                      )}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-extrabold text-slate-900 leading-tight">
                        {profile?.full_name?.split(' ')[0] || 'User'}
                      </div>
                      <div className="text-[10px] font-bold text-[#2563EB]">
                        {profile?.role && profile?.role !== 'STUDENT'
                          ? profile.role.replace('_', ' ')
                          : 'Student Dev Member'}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* USER DROPDOWN */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 space-y-1 animate-fadeIn z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{profile?.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{profile?.email}</p>
                        {profile?.role && profile?.role !== 'STUDENT' && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[9px] uppercase">
                            {profile.role.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      {profile?.role && profile?.role !== 'STUDENT' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-extrabold text-[#2563EB] bg-[#EFF6FF] border-l-4 border-[#2563EB] hover:bg-blue-100 transition-all"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/student/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>{profile?.role && profile?.role !== 'STUDENT' ? 'Student View Preview' : 'Student Dashboard'}</span>
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      >
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span>Notification Center</span>
                      </Link>

                      <Link
                        to="/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      >
                        <Bookmark className="w-4 h-4 text-slate-500" />
                        <span>Saved Opportunities</span>
                      </Link>

                      <Link
                        to="/student/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </Link>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-bold text-[#2563EB]"
            >
              Home
            </Link>

            {/* ABOUT CATEGORY */}
            <div className="px-4 pt-2 pb-1 text-xs font-extrabold text-slate-400 uppercase tracking-wider">About SS</div>
            {aboutLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${isActive(link.path) ? 'bg-[#2563EB] text-white' : 'text-slate-700'}`}
              >
                {link.name}
              </Link>
            ))}

            {/* OPPORTUNITIES CATEGORY */}
            <div className="px-4 pt-2 pb-1 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Opportunities</div>
            {opportunitiesLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${isActive(link.path) ? 'bg-[#2563EB] text-white' : 'text-slate-700'}`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-bold text-slate-800"
            >
              Dev Events
            </Link>

            {/* COMMUNITY CATEGORY */}
            <div className="px-4 pt-2 pb-1 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Community</div>
            {communityLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${isActive(link.path) ? 'bg-[#2563EB] text-white' : 'text-slate-700'}`}
              >
                {link.name}
              </Link>
            ))}

            {/* SERVICES CATEGORY */}
            <div className="px-4 pt-2 pb-1 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Roadmaps & Support</div>
            {servicesLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-1.5 rounded-lg text-xs font-semibold ${isActive(link.path) ? 'bg-[#2563EB] text-white' : 'text-slate-700'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-center shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Join Community</span>
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-center hover:bg-slate-50"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-center hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
