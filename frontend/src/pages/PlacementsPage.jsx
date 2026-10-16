import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Briefcase, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { getPlacementsList } from '../services/api';

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await getPlacementsList();
      setPlacements(res.data?.placements || res.data?.results || res.data || []);
    } catch (err) {
      console.error("Failed to load placements:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20">
            <ShieldCheck size={14} className="text-[#2563EB]" /> Verified Placement Records
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl tracking-tight">
            Student Success
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Students supported by SS are moving forward in their careers.
          </p>
        </div>

        {/* PLACEMENTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : placements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0]">
            <p className="text-gray-600 font-semibold text-sm">
              Student placement stories will be shared here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center font-extrabold text-[#2563EB]">
                        {item.company_logo_url ? (
                          <img src={item.company_logo_url} alt={item.company_name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <Building2 className="w-6 h-6 text-[#2563EB]" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2563EB]">{item.company_name}</h3>
                        {item.location && <p className="text-xs text-gray-500">{item.location}</p>}
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-[#1D4ED8]/20 text-[#2563EB] font-bold text-xs rounded-full">
                      {item.placement_year}
                    </span>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#2563EB]">
                      <Users className="w-4 h-4 text-[#2563EB]" />
                      <span>{item.number_of_students} Students Placed</span>
                    </div>

                    <div className="text-xs text-gray-600 font-medium">
                      <span className="font-bold text-[#2563EB]">Roles: </span>
                      {item.roles_list?.join(', ') || item.roles}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <Link
                    to={`/placements/${item.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#2563EB] text-[#F8FAFC] text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Placement Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PlacementsPage;
