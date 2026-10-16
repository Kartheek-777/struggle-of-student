import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Briefcase, Calendar, ShieldCheck, Quote } from 'lucide-react';
import { getPlacementDetail } from '../services/api';

const PlacementDetailPage = () => {
  const { id } = useParams();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlacementDetail(id);
      setPlacement(res.data?.data || res.data);
    } catch (err) {
      setError("Placement detail not found or private.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Placement Record Not Found</h2>
          <p className="text-xs text-gray-600">{error || "This placement record is unavailable."}</p>
          <Link to="/placements" className="inline-block px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold">
            Back to Placements List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/placements" className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#2563EB]">
          <ArrowLeft size={16} /> Back to Placements
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row gap-6 items-start justify-between border-b border-[#E2E8F0] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center font-extrabold text-[#2563EB]">
                {placement.company_logo_url ? (
                  <img src={placement.company_logo_url} alt={placement.company_name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Building2 className="w-8 h-8 text-[#2563EB]" />
                )}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[11px] font-bold border border-[#E2E8F0]">
                  <ShieldCheck size={14} /> Verified Record
                </span>
                <h1 className="text-3xl font-extrabold text-[#2563EB] mt-1">{placement.company_name}</h1>
                {placement.location && <p className="text-xs text-gray-500">{placement.location}</p>}
              </div>
            </div>

            <span className="px-4 py-1.5 bg-[#2563EB] text-white font-extrabold text-xs rounded-xl shadow-sm">
              Placement Year: {placement.placement_year}
            </span>
          </div>

          {/* PLACEMENT METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Students Placed</span>
              <div className="text-2xl font-extrabold text-[#2563EB] flex items-center gap-2">
                <Users className="w-6 h-6 text-[#2563EB]" />
                <span>{placement.number_of_students} Students</span>
              </div>
            </div>

            <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Recruitment Roles</span>
              <div className="text-sm font-bold text-[#2563EB] pt-1">
                {placement.roles_list?.join(', ') || placement.roles}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          {placement.description && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{placement.description}</p>
            </div>
          )}

          {/* STUDENT NAMES (IF PERMITTED) */}
          {placement.public_student_names && placement.public_student_names.length > 0 && (
            <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Placed Students</h3>
              <div className="flex flex-wrap gap-2">
                {placement.public_student_names.map((name, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-[#2563EB] rounded-xl flex items-center gap-1.5">
                    <Users size={14} className="text-[#2563EB]" />
                    <span>{name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {placement.testimonials && (
            <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
              <h3 className="text-lg font-bold text-[#2563EB]">Student Testimonials</h3>
              <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] flex gap-3">
                <Quote className="w-6 h-6 text-[#2563EB] shrink-0" />
                <p className="text-xs text-gray-700 italic leading-relaxed">{placement.testimonials}</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PlacementDetailPage;
