import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

const JoinCTASection = ({ onOpenJoinModal }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#EFF6FF] text-slate-800 relative overflow-hidden border-b border-blue-100">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2563EB] text-xs font-mono font-bold uppercase tracking-widest border border-blue-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Join The Student Dev Movement</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">
            Your Journey Doesn't Have to Be a <br className="hidden sm:inline" />
            <span className="text-[#2563EB] font-black">
              Solo One.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Join a community of 1,200+ engineering students who are learning, building open-source tools, cracking interviews, and growing together across India.
          </p>

          {/* CONCEPT STRIP */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
            {['Showcase Your Talent', 'Build Your Network', 'Grow Your Skills', 'Explore Opportunities', 'Get Support'].map((concept) => (
              <span key={concept} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                {concept}
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenJoinModal}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#2563EB] text-white font-black text-base shadow-md hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-3 border border-[#2563EB]"
            >
              <span>JOIN STUDENT DEV NETWORK</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <Link
              to="/opportunities"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-bold text-base hover:border-[#2563EB] hover:bg-slate-50 transition-all text-center shadow-2xs"
            >
              EXPLORE OPPORTUNITIES
            </Link>
          </div>

          <div className="pt-2 text-xs text-slate-500 font-medium">
            <span>Built by students, for students. 100% free open educational ecosystem.</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default JoinCTASection;
