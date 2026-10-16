import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Calendar, Code, HeartHandshake, Briefcase, BookOpen, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

const ServicesSection = ({ onOpenJoinModal }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    'SS Band': Music,
    'SS Event Management': Calendar,
    'SS IT Solutions': Code,
    'Student Problems & Guidance': HeartHandshake,
    'Career & Internship Support': Briefcase,
    'Workshops & Interactive Sessions': BookOpen,
    'Student Projects Guidance': Layers,
    'Other SS Services & Custom Requests': HelpCircle
  };

  useEffect(() => {
    apiService.getServices()
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
            SS Services Directory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            How SS Can Help
          </h2>
          <p className="mt-3 text-base text-[#64748B] leading-relaxed">
            From technical project development and college event management to peer counseling and music performances- explore the 8 core services offered by Struggle of Student.
          </p>
        </div>

        {/* 8 SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => {
            const IconComp = iconMap[srv.title] || Layers;
            return (
              <div
                key={srv.id || srv.order}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 shadow-md shadow-[#2563EB]/20 transition-transform">
                      <IconComp className="w-6 h-6 text-white stroke-[2]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2563EB]">
                      0{srv.order}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs font-bold text-[#2563EB] mb-3">
                    {srv.tagline}
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                  <div className="text-[11px] font-semibold text-[#0F172A]">
                    <span className="text-[#2563EB] font-bold">For: </span>
                    {srv.who_it_is_for}
                  </div>
                  <Link
                    to={`/services/${srv.slug || srv.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 border border-[#2563EB] shadow-xs"
                  >
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl shadow-md shadow-[#2563EB]/25 hover:bg-[#1D4ED8] transition"
          >
            <span>Explore All SS Services</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
