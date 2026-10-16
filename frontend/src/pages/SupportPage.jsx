import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, Briefcase, GraduationCap, Code, Compass, 
  Users, DollarSign, Calendar, MessageSquare, PlusCircle, ShieldAlert, CheckCircle2, ArrowRight 
} from 'lucide-react';

const categories = [
  { id: 'Career', title: 'Career Guidance', icon: Briefcase, desc: 'Career direction, resume reviews, interview prep, job search.' },
  { id: 'Education', title: 'Education & Academics', icon: GraduationCap, desc: 'Course confusion, subject guidance, study strategies.' },
  { id: 'Internship', title: 'Internship Preparation', icon: Compass, desc: 'Finding internships, cold emailing, application strategies.' },
  { id: 'Skills', title: 'Skills & Development', icon: Code, desc: 'Choosing tech stacks, learning roadmaps, coding practice.' },
  { id: 'Projects', title: 'Student Projects', icon: PlusCircle, desc: 'Project ideas, architecture feedback, team building.' },
  { id: 'College Life', title: 'College Life & Campus', icon: Users, desc: 'Managing time, student clubs, campus initiatives.' },
  { id: 'Events', title: 'Events & Volunteering', icon: Calendar, desc: 'Participating in events, organizing campus meetups.' },
  { id: 'Financial Guidance', title: 'Financial Guidance', icon: DollarSign, desc: 'Scholarship awareness, budget tips for students.' },
  { id: 'General', title: 'General Support', icon: MessageSquare, desc: 'Any other student problem or general enquiry.' },
];

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
            Student Guidance & Peer Support
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight sm:text-5xl">
            Facing a Student Problem? <br />
            <span className="text-[#2563EB]">You're Not Alone.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            Tell us what you're facing. We'll help you understand possible next steps, share peer guidance, or connect you with the right community resources.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/support/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:bg-[#2563EB]/90 transition"
            >
              <PlusCircle className="w-5 h-5 text-[#2563EB]" />
              Request Support Now
            </Link>
            <Link
              to="/student/support"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#0F172A] border border-gray-300 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition"
            >
              <MessageSquare className="w-5 h-5 text-[#2563EB]" />
              My Support Requests
            </Link>
          </div>
        </div>

        {/* GUIDANCE DISCLAIMER BANNER */}
        <div className="mb-12 p-5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4 max-w-4xl mx-auto shadow-sm">
          <ShieldAlert className="w-6 h-6 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed">
            <span className="font-bold text-[#0F172A] text-sm block mb-0.5">Important Notice</span>
            SS provides peer guidance, career resources, and student community support. SS does not provide medical, legal, or licensed mental health counselling. For urgent personal or health issues, please reach out to qualified professional or institutional authorities.
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A]">Explore Problem Categories</h2>
            <p className="text-gray-600 text-sm mt-1">Select a topic below to request specialized guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#2563EB] hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      to={`/support/new?category=${encodeURIComponent(cat.id)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      Request {cat.title}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW SUPPORT WORKS */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#0F172A] text-center mb-8">
            How SS Guidance Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-black text-base flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-[#0F172A] text-base mb-1">Describe Your Issue</h4>
              <p className="text-xs text-gray-600">Submit a support request describing the problem you are facing.</p>
            </div>

            <div className="p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-black text-base flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-[#0F172A] text-base mb-1">Get Reference Ticket</h4>
              <p className="text-xs text-gray-600">Receive a unique tracking ID (e.g. SS-SUP-20261008-0012) for private updates.</p>
            </div>

            <div className="p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-black text-base flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-[#0F172A] text-base mb-1">Receive Action Plan</h4>
              <p className="text-xs text-gray-600">SS Team reviews your ticket and updates you with guidance and action steps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
