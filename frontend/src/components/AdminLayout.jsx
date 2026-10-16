import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminGlobalSearch } from '../services/api';
import {
  LayoutDashboard, Users, Briefcase, FileText, Calendar, HandHeart,
  Settings, HelpCircle, MessageSquare, ShieldCheck, Award, Users2,
  BarChart3, History, Search, Bell, LogOut, Menu, X, ExternalLink,
  ChevronDown, Globe, Sparkles, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  CONTENT_MANAGER: ['dashboard', 'moderation', 'team', 'reports', 'settings'],
  EVENT_MANAGER: ['dashboard', 'events', 'volunteers', 'reports'],
  OPPORTUNITY_MANAGER: ['dashboard', 'opportunities', 'applications', 'reports'],
  COMMUNITY_MANAGER: ['dashboard', 'users', 'moderation', 'reports'],
  SUPPORT_MANAGER: ['dashboard', 'support', 'enquiries', 'services', 'reports'],
  HR_TEAM: ['dashboard', 'placements', 'team', 'users', 'reports'],
  MODERATOR: ['dashboard', 'moderation', 'reports'],
  REPORT_VIEWER: ['dashboard', 'reports']
};

const navCategories = [
  {
    category: 'PLATFORM HUB',
    items: [
      { name: 'Dashboard', path: '/admin', id: 'dashboard', icon: LayoutDashboard },
      { name: 'Users & Students', path: '/admin/users', id: 'users', icon: Users, badge: '14.8k', badgeType: 'gray' },
      { name: 'Opportunities', path: '/admin/opportunities', id: 'opportunities', icon: Briefcase, badge: '34 Active', badgeType: 'green' },
      { name: 'Applications', path: '/admin/applications', id: 'applications', icon: FileText },
      { name: 'Events & Sessions', path: '/admin/events', id: 'events', icon: Calendar, badge: '12 Live', badgeType: 'purple' },
      { name: 'Volunteers', path: '/admin/volunteers', id: 'volunteers', icon: HandHeart },
    ]
  },
  {
    category: 'MANAGEMENT & CARE',
    items: [
      { name: 'Services', path: '/admin/services', id: 'services', icon: Settings },
      { name: 'Support Desk', path: '/admin/support', id: 'support', icon: HelpCircle, dot: 'amber' },
      { name: 'Enquiries', path: '/admin/enquiries', id: 'enquiries', icon: MessageSquare, badge: '4', badgeType: 'amber' },
      { name: 'Moderation', path: '/admin/moderation', id: 'moderation', icon: ShieldCheck },
      { name: 'Placements', path: '/admin/placements', id: 'placements', icon: Award },
      { name: 'Team & Partners', path: '/admin/team', id: 'team', icon: Users2 },
    ]
  },
  {
    category: 'GOVERNANCE',
    items: [
      { name: 'Reports & Metrics', path: '/admin/reports', id: 'reports', icon: BarChart3 },
      { name: 'Audit Logs', path: '/admin/audit-logs', id: 'audit-logs', icon: History },
      { name: 'Platform Settings', path: '/admin/settings', id: 'settings', icon: SlidersHorizontal },
    ]
  }
];

const AdminLayout = ({ children, title = "SS Administrative Control Center" }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const role = profile?.role || 'ADMIN';
  const allowedModules = ROLE_PERMISSIONS[role] || ['*'];

  const isModuleAllowed = (moduleId) => {
    if (allowedModules.includes('*')) return true;
    return allowedModules.includes(moduleId);
  };

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      setShowSearchOverlay(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await getAdminGlobalSearch(searchQuery);
        if (res.data && res.data.success) {
          setSearchResults(res.data.results);
          setShowSearchOverlay(true);
        }
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const renderBadge = (badge, badgeType) => {
    if (!badge) return null;
    if (badgeType === 'green') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {badge}
        </span>
      );
    }
    if (badgeType === 'purple') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
          {badge}
        </span>
      );
    }
    if (badgeType === 'amber') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {badge}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-600">
        {badge}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-800 antialiased">
      
      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#101A30] text-slate-300 border-r border-[#1E293B] shrink-0 sticky top-0 h-screen z-30 shadow-xl">
        
        {/* BRAND LOGO HEADER */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#1E293B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform p-1 overflow-hidden relative">
              <img
                src="/logo.png"
                alt="SS Admin Logo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.classList.remove('hidden');
                    e.target.nextElementSibling.classList.add('flex');
                  }
                }}
              />
              <span className="hidden font-black text-[#2457E6] text-sm">SS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">SS ADMIN</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#2457E6]/20 text-[#2457E6] text-[9px] font-black tracking-wider uppercase border border-[#2457E6]/30">
                  V2.4
                </span>
              </div>
              <div className="text-[10px] text-[#94A3B8] font-extrabold tracking-widest uppercase mt-0.5">
                STRUGGLE OF STUDENT
              </div>
            </div>
          </Link>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] hover:text-white cursor-pointer" />
        </div>

        {/* NAVIGATION CATEGORIES */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1E293B]">
          {navCategories.map((group) => {
            const filteredItems = group.items.filter((item) => isModuleAllowed(item.id));
            if (filteredItems.length === 0) return null;
            return (
              <div key={group.category} className="space-y-1">
                <div className="px-3 text-[10px] font-black tracking-widest text-[#64748B] uppercase">
                  {group.category}
                </div>
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const active = (item.path === '/admin' && location.pathname === '/admin') || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-[#2457E6] text-white shadow-md font-black'
                          : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#64748B] group-hover:text-white'}`} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.dot === 'amber' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                        {renderBadge(item.badge, item.badgeType)}
                        {active && <span className="w-2 h-2 rounded-full bg-white shadow-xs"></span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* BOTTOM USER CARD */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B132B]">
          <div className="p-3 rounded-2xl bg-[#101A30] border border-[#1E293B] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#2457E6] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SA'}
              </div>
              <div className="truncate">
                <p className="text-xs font-black text-white truncate">{profile?.full_name || 'SS Super Admin'}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{profile?.email || 'admin@struggleofstudent.org'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-xs font-semibold text-slate-500 hidden sm:block">
                Manage the Struggle of Student community, applications, and operations
              </p>
            </div>
          </div>

          {/* GLOBAL SEARCH & PROFILE */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* GLOBAL SEARCH BAR */}
            <div className="relative hidden md:block w-72 lg:w-96">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Global search students, events, jobs... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-xs"
                />
                <kbd className="absolute right-3 top-2 text-[10px] font-mono font-bold bg-white text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">
                  ⌘K
                </kbd>
              </div>

              {/* SEARCH OVERLAY RESULTS */}
              {showSearchOverlay && searchResults && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 max-h-96 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100">
                    <span>Search Results for "{searchQuery}"</span>
                    <button onClick={() => setShowSearchOverlay(false)} className="text-slate-400 hover:text-slate-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {Object.keys(searchResults).length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No matching records found.</p>
                  ) : (
                    Object.entries(searchResults).map(([mod, items]) => (
                      <div key={mod} className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]">{mod}</p>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setShowSearchOverlay(false);
                              if (mod === 'users') navigate(`/admin/users/${item.id}`);
                              else if (mod === 'opportunities') navigate('/admin/opportunities');
                              else if (mod === 'events') navigate('/admin/events');
                              else if (mod === 'support') navigate('/admin/support');
                              else if (mod === 'enquiries') navigate('/admin/enquiries');
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                          >
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {item.full_name || item.title || item.subject || item.email}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {item.college || item.organization_name || item.reference_number || mod}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATIONS PLACEHOLDER */}
            <div className="relative" title="Admin Notifications">
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors relative shadow-2xs">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>
            </div>

            {/* PUBLIC WEBSITE LINK */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-2xs"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            {/* PROFILE MENU DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] text-white flex items-center justify-center font-black text-xs uppercase overflow-hidden shadow-xs">
                  {profile?.profile_photo ? (
                    <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span>SS</span>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-black text-slate-900 leading-tight">Ops Root</p>
                  <p className="text-[10px] font-bold text-slate-400 leading-none">Super Admin</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 space-y-1">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{profile?.full_name || 'SS Admin'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{profile?.email || 'admin@struggleofstudent.org'}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] font-black text-[9px] uppercase border border-[#2563EB]/20">
                      {role}
                    </span>
                  </div>

                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Admin Settings</span>
                  </Link>

                  <a
                    href="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>Public Student Site</span>
                  </a>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* DRAWER SIDEBAR (MOBILE) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 max-w-xs w-full bg-white text-slate-700 p-5 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white font-black flex items-center justify-center text-xs">
                    SS
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#0F172A]">SS ADMIN</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{role}</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 space-y-4">
                {navCategories.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <p className="px-3 text-[10px] font-black text-slate-400 uppercase">{group.category}</p>
                    {group.items.filter((item) => isModuleAllowed(item.id)).map((item) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            active ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {renderBadge(item.badge, item.badgeType)}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1536px] w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
