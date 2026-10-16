import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminServices, createAdminService, deleteAdminService } from '../../services/api';
import { Settings, Plus, RefreshCw, Trash2 } from 'lucide-react';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getAdminServices();
      if (res.data && res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteAdminService(id);
      setMsg({ type: 'success', text: 'Service deleted.' });
      fetchServices();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete service.' });
    }
  };

  return (
    <AdminLayout title="Service Management">
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#2563EB]">SS Services Directory</h2>
            <p className="text-xs text-gray-500">Manage student band, IT solutions, and event management services.</p>
          </div>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#2563EB] uppercase">{srv.category}</span>
                <h3 className="text-base font-black text-[#2563EB] my-1">{srv.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-3">{srv.short_description || srv.description}</p>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
                <button onClick={() => handleDelete(srv.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServicesPage;
