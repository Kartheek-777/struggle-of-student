import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Calendar, Music, HelpCircle, Briefcase, BookOpen, Palette, Users, Settings, ArrowRight } from 'lucide-react';
import { getServices } from '../services/api';

const iconMap = {
  Code: Code,
  Calendar: Calendar,
  Music: Music,
  HelpCircle: HelpCircle,
  Briefcase: Briefcase,
  BookOpen: BookOpen,
  Palette: Palette,
  Users: Users,
  Settings: Settings
};

const FeaturedServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices({ is_featured: 'true' })
      .then(res => {
        if (res.data?.success) {
          const list = res.data.services || [];
          setServices(list.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to load featured services:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-[#F8FAFC] px-4">
        <div className="max-w-[1536px] mx-auto text-center">
          <div className="h-8 bg-gray-200 w-48 mx-auto rounded animate-pulse mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-[1536px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] uppercase tracking-wider">
              How SS Can Help
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              SS Services & Student Solutions
            </h2>
            <p className="text-gray-600 text-sm mt-1 max-w-2xl">
              From student guidance to technology, event management, and SS Band performances, we build practical solutions for students and organizations.
            </p>
          </div>

          <Link
            to="/services"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline"
          >
            Explore All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const IconComp = iconMap[svc.icon_name] || Settings;
            return (
              <div 
                key={svc.id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#2563EB]/40 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {svc.short_description || svc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/services/${svc.slug || svc.id}`}
                    className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/services/${svc.slug || svc.id}`}
                    className="px-3 py-1 bg-amber-50 text-[#2563EB] border border-amber-200 text-xs font-bold rounded-md hover:bg-amber-100 transition"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServicesSection;
