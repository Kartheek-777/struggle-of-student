import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminPlacements, createAdminPlacement, updateAdminPlacement, deleteAdminPlacement } from '../../services/api';
import { Award, Plus, Trash2, Edit3, CheckCircle, RefreshCw } from 'lucide-react';

const AdminPlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '', roles: 'Software Engineer, Analyst', number_of_students: 1,
    placement_year: '2026', location: 'Hyderabad', verification_status: 'VERIFIED',
    visibility: 'PUBLIC', student_names_visibility: 'ANONYMOUS', student_names: ''
  });

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await getAdminPlacements();
      if (res.data && res.data.success) {
        setPlacements(res.data.placements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminPlacement(formData);
      setMsg({ type: 'success', text: 'Placement record created.' });
      setModalOpen(false);
      fetchPlacements();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to create placement record.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete placement record?')) return;
    try {
      await deleteAdminPlacement(id);
      setMsg({ type: 'success', text: 'Placement record deleted.' });
      fetchPlacements();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete placement.' });
    }
  };

  return (
    <AdminLayout title="Placement Management">
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#2563EB]">Verified Student Placements</h2>
            <p className="text-xs text-gray-500">Only verified placement records are displayed on public pages.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs">
            Add Placement
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Roles</th>
                <th className="py-3 px-4">Students Placed</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {placements.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-extrabold text-[#2563EB]">{p.company_name}</td>
                  <td className="py-3 px-4 text-gray-700">{p.roles}</td>
                  <td className="py-3 px-4 font-black text-[#2563EB]">{p.number_of_students} Students</td>
                  <td className="py-3 px-4 font-medium">{p.placement_year}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#2563EB]/15 text-[#2563EB]">
                      {p.verification_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(p.id)} className="p-1 rounded-lg text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlacementsPage;
