import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'CONTENT_MANAGER',
  'EVENT_MANAGER',
  'OPPORTUNITY_MANAGER',
  'COMMUNITY_MANAGER',
  'SUPPORT_MANAGER',
  'HR_TEAM',
  'MODERATOR',
  'REPORT_VIEWER',
  'TEAM_MEMBER'
];

const AdminRoute = ({ children }) => {
  const { profile, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-[#2563EB]">
        <RefreshCw className="w-10 h-10 animate-spin text-[#2563EB] mb-3" />
        <p className="font-extrabold text-sm tracking-wide">Verifying SS Admin Privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = profile?.role || 'STUDENT';
  const hasAdminAccess = ADMIN_ROLES.includes(role);

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4 shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#2563EB] mb-2">403 - Permission Denied</h1>
        <p className="text-sm text-gray-600 max-w-md mb-6">
          You don't have administrative permissions to access the internal SS Administration Platform.
        </p>
        <a
          href="/student/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-colors"
        >
          Return to Student Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
