import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminTeam, getAdminPartners, getAdminTestimonials } from '../../services/api';
import { Users, Users2, ShieldCheck } from 'lucide-react';

const AdminTeamPartnersPage = () => {
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getAdminTeam().then(res => res.data?.success && setTeam(res.data.team));
    getAdminPartners().then(res => res.data?.success && setPartners(res.data.partners));
    getAdminTestimonials().then(res => res.data?.success && setTestimonials(res.data.testimonials));
  }, []);

  return (
    <AdminLayout title="Team & Partner Management">
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0]">
          <h2 className="text-xl font-black text-[#2563EB]">Core Team, Partners & Testimonials</h2>
          <p className="text-xs text-gray-500">Manage leadership members, team departments, partner logos, and approved testimonials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
            <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Active Core Team ({team.length})</h3>
            <div className="divide-y divide-gray-100">
              {team.map((mb) => (
                <div key={mb.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-[#2563EB]">{mb.name}</p>
                    <p className="text-[10px] text-gray-500">{mb.role} ({mb.department})</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/15 text-[#2563EB] font-bold text-[10px]">{mb.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
            <h3 className="text-sm font-black text-[#2563EB] uppercase tracking-wider">Partner Organizations ({partners.length})</h3>
            <div className="divide-y divide-gray-100">
              {partners.map((pt) => (
                <div key={pt.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-[#2563EB]">{pt.name}</p>
                    <p className="text-[10px] text-gray-500">{pt.partnership_type}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">{pt.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeamPartnersPage;
