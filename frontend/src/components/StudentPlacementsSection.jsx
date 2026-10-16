import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { getPlacementsList } from '../services/api';

const StudentPlacementsSection = () => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const defaultPlacements = [
    {
      id: 1,
      company_name: "Non-IT Core Sector Enterprise",
      placement_year: "2026",
      number_of_students: 3,
      roles: "Operations, Business Analyst, Core Technical Associate",
      description: "Rajesh, Nithya, and Mohammed Sufiyan recently secured high-value 7 LPA placement offers from leading Non-IT companies.",
      student_names: "Rajesh, Nithya, Mohammed Sufiyan"
    }
  ];

  const fetchPlacements = async () => {
    try {
      const res = await getPlacementsList();
      const list = res.data?.placements || res.data?.results || res.data || [];
      setPlacements(Array.isArray(list) && list.length > 0 ? list : defaultPlacements);
    } catch (err) {
      console.error("Failed to load placement highlights:", err);
      setPlacements(defaultPlacements);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold uppercase tracking-wider mb-3 border border-[#E2E8F0]">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Placement & Outcome Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Creating Opportunities. Building Futures.
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-2xl">
              We help bridge the gap between classroom theory and real-world startup placements, internships, and freelance projects.
            </p>
          </div>

          <Link
            to="/placements"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-colors shrink-0 shadow-md shadow-[#2563EB]/20"
          >
            <span>See Placement Impact</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* HIGHLIGHT CARDS GRID */}
        {placements.length === 0 ? (
          <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center border border-[#E2E8F0] text-[#64748B] text-sm">
            Student placement records will be shared here soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {placements.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                      {item.placement_year} Recruitment
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#E2E8F0]">
                      {item.number_of_students} Students Placed
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">{item.company_name}</h3>
                  <p className="text-xs font-bold text-[#2563EB] mb-4">
                    {item.roles_list?.join(', ') || item.roles}
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#0F172A] font-semibold">
                  <span className="flex items-center gap-1 text-[#2563EB] font-bold">
                    <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                    Verified Placement
                  </span>
                  <Link to={`/placements/${item.id}`} className="text-[#2563EB] font-bold hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default StudentPlacementsSection;
