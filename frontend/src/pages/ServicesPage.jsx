import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Calendar, Music, HelpCircle, Briefcase, 
  BookOpen, Palette, Users, Settings, Search, ArrowRight, CheckCircle, MessageSquare
} from 'lucide-react';
import { getServices, getServiceCategories, getServiceFaqs } from '../services/api';
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

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [svcRes, catRes, faqRes] = await Promise.all([
        getServices(),
        getServiceCategories(),
        getServiceFaqs()
      ]);

      if (svcRes.data?.success) {
        setServices(svcRes.data.services || []);
      }
      if (catRes.data?.success) {
        setCategories(catRes.data.categories || []);
      }
      if (faqRes.data?.success) {
        setFaqs(faqRes.data.faqs || []);
      }
    } catch (err) {
      console.error("Failed to load services data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEnquiry = (service) => {
    setSelectedServiceForEnquiry(service);
    setIsEnquiryModalOpen(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto">
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-sm font-semibold mb-4">
            <Settings className="w-4 h-4 text-[#2563EB]" />
            Practical Student & Organizational Solutions
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight sm:text-5xl">
            What Can <span className="text-[#2563EB]">SS</span> Help You With?
          </h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            From student support to technology, events, creative services, and community initiatives, SS connects people with practical solutions built by students, for students.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg shadow hover:bg-[#2563EB]/90 transition"
            >
              <HelpCircle className="w-5 h-5 text-[#2563EB]" />
              Facing a Student Problem?
            </Link>
            <button
              onClick={() => handleOpenEnquiry(null)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F172A] border border-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <MessageSquare className="w-5 h-5 text-[#2563EB]" />
              General Service Enquiry
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                  selectedCategory === 'All'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SERVICES GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-pulse h-64">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
            <h3 className="text-xl font-bold text-[#0F172A]">No Services Found</h3>
            <p className="text-gray-600 mt-1">Try resetting your search filter or category selection.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:bg-[#2563EB]/90 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const IconComp = iconMap[service.icon_name] || Settings;
              return (
                <div 
                  key={service.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#2563EB]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-[#2563EB] border border-amber-200">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {service.title}
                    </h3>
                    
                    {service.tagline && (
                      <p className="text-xs text-[#2563EB] font-semibold mt-1">
                        {service.tagline}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                      {service.short_description || service.description}
                    </p>

                    {service.who_it_is_for && (
                      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">For: </span>
                        {service.who_it_is_for}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/services/${service.slug || service.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline"
                    >
                      Explore Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleOpenEnquiry(service)}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 transition"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mt-2">
              Have questions about SS services, support, or how we collaborate? Here are answers to common enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.id || faq.question} className="p-5 rounded-xl bg-[#F8FAFC]/60 border border-gray-200">
                <h4 className="font-bold text-[#0F172A] text-base flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  {faq.question}
                </h4>
                <p className="text-gray-700 text-sm mt-2 leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ENQUIRY MODAL */}
        <ServiceEnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          service={selectedServiceForEnquiry}
        />
      </div>
    </div>
  );
};

export default ServicesPage;
