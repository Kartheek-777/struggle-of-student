import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Search, ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-3xl p-8 border-4 border-[#E2E8F0] shadow-2xl text-center space-y-6">
        
        {/* BADGE / ICON */}
        <div className="w-20 h-20 rounded-3xl bg-[#2563EB] text-[#2563EB] flex items-center justify-center font-extrabold text-3xl mx-auto shadow-lg border-2 border-[#2563EB]/40">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#2563EB] tracking-tight">
            Looks like this page took a different path.
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            The page or resource you are looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* CTAS */}
        <div className="space-y-3 pt-2">
          <Link
            to="/"
            className="w-full py-3 rounded-xl bg-[#2563EB] text-[#F8FAFC] font-bold text-xs hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 border border-[#2563EB]/50 shadow-md"
          >
            <Home className="w-4 h-4 text-[#2563EB]" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            to="/opportunities"
            className="w-full py-3 rounded-xl bg-white border-2 border-[#2563EB]/20 text-[#2563EB] font-bold text-xs hover:border-[#2563EB] transition-all flex items-center justify-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-[#2563EB]" />
            <span>Explore Opportunities</span>
          </Link>

          <Link
            to="/search"
            className="w-full py-2.5 text-xs font-bold text-[#2563EB] hover:text-[#2563EB] transition-colors flex items-center justify-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search SS Platform</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
