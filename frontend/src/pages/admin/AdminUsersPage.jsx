import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminUsers, getAdminUserDetail, updateAdminUserAction } from '../../services/api';
import {
  Users, Search, Filter, ShieldCheck, ShieldAlert, Eye, UserCheck,
  UserX, UserMinus, RefreshCw, X, CheckCircle, Award, Calendar, FileText
} from 'lucide-react';

const ADMIN_ROLES = [
  'STUDENT', 'SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER',
  'OPPORTUNITY_MANAGER', 'COMMUNITY_MANAGER', 'SUPPORT_MANAGER', 'HR_TEAM',
  'MODERATOR', 'REPORT_VIEWER', 'TEAM_MEMBER'
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({
        page,
        search,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data && res.data.success) {
        setUsers(res.data.users);
        setTotalCount(res.data.total_count);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openUserDetail = async (userId) => {
    setUserDetailLoading(true);
    setSelectedUser(null);
    try {
      const res = await getAdminUserDetail(userId);
      if (res.data && res.data.success) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      console.error('Fetch user detail error:', err);
    } finally {
      setUserDetailLoading(false);
    }
  };

  const handleAction = async (userId, action, roleVal = null) => {
    setActionLoading(true);
    setMsg(null);
    try {
      const res = await updateAdminUserAction(userId, { action, role: roleVal });
      if (res.data && res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        fetchUsers();
        if (selectedUser) openUserDetail(userId);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update user.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Student & Admin Directory</h2>
            <p className="text-xs font-medium text-slate-500">Manage user accounts, account statuses, and fine-grained admin roles.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] shadow-xs">
              Search
            </button>
          </form>
        </div>

        {/* MESSAGES */}
        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-indigo-50 text-[#2563EB] border-indigo-100' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
            {msg.text}
          </div>
        )}

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <span className="font-extrabold text-slate-800">Filters:</span>

            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700"
            >
              <option value="all">All Roles</option>
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended / Inactive</option>
            </select>
          </div>

          <span className="font-bold text-slate-500">Total Records: {totalCount}</span>
        </div>

        {/* USER TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
              <p className="text-xs font-bold">Loading User Records...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold">No user accounts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">College & Education</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {users.map((usr) => {
                    const prof = usr.profile || {};
                    const isSuspended = !usr.is_active;
                    return (
                      <tr key={usr.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs uppercase overflow-hidden shrink-0">
                              {prof.profile_photo ? (
                                <img src={prof.profile_photo} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{prof.full_name?.charAt(0) || usr.email.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{prof.full_name || usr.username}</p>
                              <p className="text-[10px] text-slate-400 truncate">{usr.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{prof.college || 'N/A'}</p>
                          <p className="text-[10px] text-slate-500">{prof.course ? `${prof.course} (${prof.graduation_year})` : ''}</p>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase border ${
                            usr.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            usr.role === 'ADMIN' ? 'bg-indigo-50 text-[#2563EB] border-indigo-200' :
                            usr.role !== 'STUDENT' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {usr.role}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            usr.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {usr.is_active ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500 font-medium">
                          {new Date(usr.date_joined).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openUserDetail(usr.id)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#2563EB] hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isSuspended ? (
                              <button
                                onClick={() => handleAction(usr.id, 'activate')}
                                className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-[10px] hover:bg-[#1D4ED8]"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAction(usr.id, 'suspend')}
                                className="px-2 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* USER DETAIL MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-[#2563EB] font-black text-xl flex items-center justify-center">
                    {selectedUser.user.first_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2563EB]">{selectedUser.user.profile?.full_name}</h3>
                    <p className="text-xs text-gray-500">{selectedUser.user.email} - Joined {new Date(selectedUser.user.date_joined).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* ROLE ASSIGNMENT */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#2563EB]">Role-Based Access Control</p>
                  <p className="text-[11px] text-gray-500">Current Role: <span className="font-extrabold text-[#2563EB]">{selectedUser.user.role}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id="roleSelect"
                    defaultValue={selectedUser.user.role}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#2563EB]"
                  >
                    {ADMIN_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById('roleSelect').value;
                      handleAction(selectedUser.user.id, 'assign_role', sel);
                    }}
                    disabled={actionLoading}
                    className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8]"
                  >
                    Assign Role
                  </button>
                </div>
              </div>

              {/* USER ACTIVITY SUMMARY TABS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB]">User Activity Summary</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-gray-500">Applications</p>
                    <p className="text-lg font-black text-[#2563EB]">{selectedUser.activity_summary?.applications?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-gray-500">Events Registered</p>
                    <p className="text-lg font-black text-[#2563EB]">{selectedUser.activity_summary?.events?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-gray-500">Volunteered</p>
                    <p className="text-lg font-black text-[#2563EB]">{selectedUser.activity_summary?.volunteers?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-gray-500">Projects Submitted</p>
                    <p className="text-lg font-black text-[#2563EB]">{selectedUser.activity_summary?.projects?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-bold text-xs"
                >
                  Close Detail
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
