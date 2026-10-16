import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Code, Calendar, Music, HelpCircle, Briefcase, 
  BookOpen, Palette, Users, Settings, ArrowLeft, CheckCircle, 
  Send, Layers, Clock, ShieldCheck, MessageSquare
} from 'lucide-react';
import { getServiceDetail } from '../services/api';
import ServiceEnquiryModal from '../components/ServiceEnquiryModal';

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

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    fetchService();
  }, [slug]);

  const fetchService = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getServiceDetail(slug);
      if (res.data?.success && res.data.data) {
        setService(res.data.data);
      } else {
        setError(res.data?.message || "Service details not found.");
      }
    } catch (err) {
      console.error("Failed to load service detail:", err);
      setError("Service details could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-[#0F172A]">Service Not Found</h2>
          <p className="text-gray-600 mt-2">{error || "The requested service is unavailable."}</p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#2563EB]/90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const IconComp = iconMap[service.icon_name] || Settings;
  const featureList = service.features
    ? service.features.split('\n').filter(f => f.trim())
    : [];
  const processList = service.process
    ? service.process.split('->').map(p => p.trim()).filter(p => p)
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Services
        </Link>

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                  <IconComp className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-[#2563EB] border border-amber-200">
                    {service.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
                    {service.title}
                  </h1>
                </div>
              </div>

              {service.tagline && (
                <p className="text-base font-bold text-[#2563EB] mb-3">
                  {service.tagline}
                </p>
              )}

              <p className="text-gray-700 text-base leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white font-extrabold rounded-xl shadow-lg hover:bg-[#2563EB]/90 transition"
              >
                <Send className="w-5 h-5 text-[#2563EB]" />
                Enquire Now
              </button>
              
              <Link
                to="/support"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-[#0F172A] font-semibold text-sm rounded-xl hover:bg-gray-200 transition"
              >
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                Need Student Guidance?
              </Link>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* LEFT 2 COLS: FEATURES & PROCESS */}
          <div className="md:col-span-2 space-y-8">
            {/* WHO IT IS FOR */}
            {service.who_it_is_for && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[#2563EB]" />
                  Who Is It For?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {service.who_it_is_for}
                </p>
              </div>
            )}

            {/* KEY FEATURES */}
            {featureList.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-[#2563EB]" />
                  What SS Provides
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featureList.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <CheckCircle className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROCESS */}
            {processList.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-[#2563EB]" />
                  How It Works (Process)
                </h3>
                <div className="space-y-4">
                  {processList.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-bold text-[#0F172A]">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: DELIVERABLES & CTA CARD */}
          <div className="space-y-6">
            {service.deliverables && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                  Expected Deliverables
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {service.deliverables}
                </p>
              </div>
            )}

            <div className="bg-[#2563EB] text-white rounded-2xl p-6 shadow-lg text-center">
              <h3 className="text-xl font-extrabold mb-2">Let's Discuss Your Requirement</h3>
              <p className="text-xs text-gray-200 mb-6 leading-relaxed">
                Tell us about your campus fest, website project, or guidance needs. We're ready to assist!
              </p>
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full py-3 bg-[#1D4ED8] text-[#0F172A] font-black rounded-xl hover:bg-amber-400 transition"
              >
                Submit Enquiry Now
              </button>
            </div>
          </div>
        </div>

        {/* FAQS SECTION */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6">
              Service FAQs
            </h3>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <div key={faq.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-xs mt-2 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ServiceEnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          service={service}
        />
      </div>
    </div>
  );
};

export default ServiceDetailPage;
