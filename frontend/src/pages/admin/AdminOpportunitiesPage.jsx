import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminOpportunities, createAdminOpportunity, updateAdminOpportunity, deleteAdminOpportunity } from '../../services/api';
import { Briefcase, Plus, Search, Filter, Edit3, Trash2, Eye, RefreshCw, X, AlertTriangle } from 'lucide-react';

const AdminOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    title: '', organization_name: 'SS Community Partners', category: 'Internships',
    mode: 'Online', location: 'Remote', work_type: 'Remote', experience_level: 'Beginner',
    stipend: 'Rs. 10,000 / month', short_description: '', description: '',
    eligibility: 'Undergraduate Students', status: 'OPEN', tags: 'Python, React, Web'
  });

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const res = await getAdminOpportunities({
        page, search, status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data && res.data.success) {
        setOpportunities(res.data.opportunities);
        setTotalCount(res.data.total_count);
      }
    } catch (err) {
      console.error('Fetch opportunities error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, [page, statusFilter]);

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setFormData({
      title: '', organization_name: 'SS Community Partners', category: 'Internships',
      mode: 'Online', location: 'Remote', work_type: 'Remote', experience_level: 'Beginner',
      stipend: 'Rs. 10,000 / month', short_description: '', description: '',
      eligibility: 'Undergraduate Students', status: 'OPEN', tags: 'Python, React, Web'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (opp) => {
    setEditingOpp(opp);
    setFormData({
      title: opp.title, organization_name: opp.organization_name, category: opp.category,
      mode: opp.mode, location: opp.location, work_type: opp.work_type,
      experience_level: opp.experience_level, stipend: opp.stipend,
      short_description: opp.short_description, description: opp.description,
      eligibility: opp.eligibility, status: opp.status, tags: opp.tags
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMsg(null);
    try {
      if (editingOpp) {
        await updateAdminOpportunity(editingOpp.id, formData);
        setMsg({ type: 'success', text: 'Opportunity updated successfully.' });
      } else {
        await createAdminOpportunity(formData);
        setMsg({ type: 'success', text: 'Opportunity created and published successfully.' });
      }
      setModalOpen(false);
      fetchOpps();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save opportunity.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/archive this opportunity?')) return;
    try {
      const res = await deleteAdminOpportunity(id);
      setMsg({ type: 'success', text: res.data.message });
      fetchOpps();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete opportunity.' });
    }
  };

  return (
    <AdminLayout title="Opportunity Management">
      <div className="space-y-6">
        
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Opportunities Listings</h2>
            <p className="text-xs text-gray-500">Create, edit, publish, and manage stipended internships, IT, and Non-IT roles.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Create Opportunity</span>
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* OPPORTUNITY TABLE */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
              <p className="text-xs font-bold">Loading Opportunities...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stipend / Salary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{opp.title}</p>
                        <p className="text-[10px] text-gray-500">{opp.mode} - {opp.location}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">{opp.organization_name}</td>
                      <td className="py-3 px-4 font-semibold text-gray-600">{opp.category}</td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">{opp.stipend}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          opp.status === 'OPEN' ? 'bg-[#2563EB]/15 text-[#2563EB]' :
                          opp.status === 'CLOSING_SOON' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {opp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(opp)}
                            className="p-1.5 rounded-lg bg-gray-100 text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(opp.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL DIALOG */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-black text-[#2563EB]">
                  {editingOpp ? 'Edit Opportunity' : 'Create New Opportunity'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2563EB] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#2563EB] mb-1">Organization</label>
                    <input
                      type="text"
                      required
                      value={formData.organization_name}
                      onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#2563EB] mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                    >
                      <option value="Internships">Internships</option>
                      <option value="IT Jobs">IT Jobs</option>
                      <option value="Non IT Jobs">Non IT Jobs</option>
                      <option value="Campus Ambassador">Campus Ambassador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#2563EB] mb-1">Stipend / Salary</label>
                    <input
                      type="text"
                      value={formData.stipend}
                      onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#2563EB] mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSING_SOON">CLOSING_SOON</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2563EB] mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8]"
                  >
                    {formLoading ? 'Saving...' : 'Save Opportunity'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminOpportunitiesPage;
