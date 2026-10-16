import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Clock, MessageSquare, PlusCircle } from 'lucide-react';
import { getStudentEnquiries } from '../services/api';

const statusBadges = {
  NEW: 'bg-blue-100 text-blue-800 border-blue-200',
  ACKNOWLEDGED: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_REVIEW: 'bg-purple-100 text-purple-800 border-purple-200',
  CONTACTED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPLETED: 'bg-[#2563EB]/15 text-[#2563EB] border-[#E2E8F0]',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200'
};

const StudentEnquiriesListPage = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login?redirect=/student/enquiries');
      return;
    }
    fetchEnquiries();
  }, [navigate]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getStudentEnquiries();
      if (res.data?.success) {
        setEnquiries(res.data.enquiries || []);
      }
    } catch (err) {
      console.error("Failed to load service enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider mb-1">
              <Settings className="w-4 h-4 text-[#2563EB]" />
              Service Enquiry Tracker
            </div>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">My Service Enquiries</h1>
            <p className="text-xs text-gray-600 mt-1">Track the status of your service & solution enquiries submitted to SS.</p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl shadow hover:bg-[#2563EB]/90 transition"
          >
            <PlusCircle className="w-4 h-4 text-[#2563EB]" />
            Explore Services
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-pulse h-28"></div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0F172A]">No Service Enquiries Yet</h3>
            <p className="text-gray-600 text-sm mt-1">You haven't submitted any service enquiries for IT solutions, SS Band, or Event Management yet.</p>
            <Link
              to="/services"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition text-sm"
            >
              Explore SS Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => {
              const badgeClass = statusBadges[enq.status] || 'bg-gray-100 text-gray-800';
              return (
                <div 
                  key={enq.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#2563EB]/40 transition"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-md">
                          {enq.reference_number}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                          {enq.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded">
                          {enq.enquiry_type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        {enq.service_name || 'General Service Enquiry'}
                      </h3>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(enq.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 space-y-2">
                    <p className="line-clamp-2">
                      <span className="font-bold text-gray-900">Requirement: </span>
                      {enq.requirement}
                    </p>
                    {enq.expected_timeline && (
                      <p>
                        <span className="font-bold text-gray-900">Expected Timeline: </span>
                        {enq.expected_timeline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnquiriesListPage;
