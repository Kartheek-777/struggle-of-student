import React from 'react';
import { Users, Camera, Share2, ClipboardList, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

const VolunteerSection = ({ onOpenJoinModal }) => {
  const volunteerRoles = [
    {
      title: 'Registration Desk & Desk Ops',
      icon: ClipboardList,
      description: 'Manage attendee check-ins, distribute welcome badges, and assist speakers upon arrival.'
    },
    {
      title: 'Social Media & Live Coverage',
      icon: Share2,
      description: 'Create real-time Instagram stories, tweet highlights, and capture student quotes during sessions.'
    },
    {
      title: 'Event Photography & Media',
      icon: Camera,
      description: 'Capture high-res candid photography of workshops, networking sessions, and stage moments.'
    },
    {
      title: 'Technical Support & AV Ops',
      icon: Cpu,
      description: 'Manage Zoom broadcasts, stage microphones, slide clickers, and Q&A polling software.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FFFFFF] text-[#0F172A] border-b border-[#E2E8F0]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT EXPLANATION */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Event Leadership & Capacity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Be Part of the Event Team
            </h2>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              Want to contribute beyond attending? Join the SS volunteer team and help us organize meaningful student experiences across college campuses and online masterclasses.
            </p>

            {/* CAPACITY BADGE */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-sm shadow-sm">
              <div>
                <div className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">Current Event Target</div>
                <div className="text-lg font-bold text-[#2563EB]">Student Startup Meetup 2026</div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-[#FFFFFF] text-[#2563EB] font-bold text-xs border border-[#E2E8F0] shadow-sm">
                  Slots: 20 / Status: Open
                </span>
              </div>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="px-8 py-4 rounded-xl bg-[#2563EB] text-white font-extrabold text-base hover:bg-[#1D4ED8] transition-colors shadow-lg flex items-center gap-3"
            >
              <span>Apply for Volunteer Team</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* RIGHT ROLES GRID */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {volunteerRoles.map((role, idx) => {
              const IconComp = role.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#2563EB] transition-all space-y-3 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
                    <IconComp className="w-5 h-5 text-white stroke-[2]" />
                  </div>
                  <h4 className="font-bold text-[#0F172A] text-sm">{role.title}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{role.description}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default VolunteerSection;
