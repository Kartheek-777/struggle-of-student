import React from 'react';
import { Award, Mail, Phone, ExternalLink } from 'lucide-react';

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const FounderLeadershipSection = () => {
  const founder = {
    name: 'Chanti Nelatalli',
    role: 'Founder & CEO',
    email: 'chantidepavath@gmail.com',
    phone: '+91 98496 03265',
    linkedin: 'https://www.linkedin.com/in/chanti-nelatalli-6b592932a/',
    bio: 'Founder and CEO of Struggle of Student (SS). Dedicated to building a supportive community ecosystem where college students across India can discover verified opportunities, build practical skills, and get genuine guidance.',
    focus: 'Visionary Leadership & Community Strategy',
    image: '/assets/founder_chanti.jpg'
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3 border border-[#E2E8F0]">
            <Award className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Guiding The Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Meet Our Founder
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            The visionary leadership driving the Struggle of Student vision and building opportunities for students across India.
          </p>
        </div>

        {/* CENTERED FOUNDER CARD */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#F8FAFC] border-2 border-[#2563EB] rounded-3xl p-8 sm:p-10 text-center shadow-2xl hover:shadow-3xl transition-all">
            
            <div className="relative w-40 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-[#2563EB] shadow-xl bg-[#F8FAFC]">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>

            <div className="inline-block px-3.5 py-1 bg-[#EFF6FF] text-[#2563EB] font-extrabold text-xs rounded-full uppercase tracking-wider mb-2 border border-[#E2E8F0]">
              {founder.role}
            </div>

            <h3 className="text-3xl font-black text-[#0F172A] mb-1">{founder.name}</h3>
            
            <div className="text-xs font-mono font-bold text-[#2563EB] mb-4">
              Focus: {founder.focus}
            </div>

            <p className="text-sm text-[#64748B] leading-relaxed max-w-lg mx-auto mb-8">
              {founder.bio}
            </p>

            {/* CONTACT & LINKEDIN BUTTONS */}
            <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-3">
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] transition shadow-md shadow-[#2563EB]/20"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={`mailto:${founder.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF6FF]/70 text-[#0F172A] font-bold text-xs hover:bg-[#EFF6FF] transition border border-[#E2E8F0]"
              >
                <Mail className="w-4 h-4 text-[#2563EB]" />
                <span>{founder.email}</span>
              </a>

              <a
                href={`tel:${founder.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF6FF]/70 text-[#0F172A] font-bold text-xs hover:bg-[#EFF6FF] transition border border-[#E2E8F0]"
              >
                <Phone className="w-4 h-4 text-[#2563EB]" />
                <span>{founder.phone}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FounderLeadershipSection;
