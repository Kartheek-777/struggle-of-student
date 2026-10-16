import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, PlusCircle, Clock, ChevronRight, AlertCircle, MessageSquare } from 'lucide-react';
import { getStudentSupportRequests } from '../services/api';

const statusBadges = {
  OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
  ACKNOWLEDGED: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
  WAITING_FOR_STUDENT: 'bg-orange-100 text-orange-800 border-orange-200',
  RESOLVED: 'bg-[#2563EB]/15 text-[#2563EB] border-[#E2E8F0]',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

const StudentSupportListPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login?redirect=/student/support');
      return;
    }
    fetchSupportRequests();
  }, [navigate]);

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const res = await getStudentSupportRequests();
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load support requests:", err);
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
              <HelpCircle className="w-4 h-4 text-[#2563EB]" />
              Support & Guidance Tracker
            </div>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">My Support Requests</h1>
            <p className="text-xs text-gray-600 mt-1">Track the status of your guidance tickets and updates from SS team.</p>
          </div>

          <Link
            to="/support/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl shadow hover:bg-[#2563EB]/90 transition"
          >
            <PlusCircle className="w-4 h-4 text-[#2563EB]" />
            New Support Request
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-pulse h-28"></div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0F172A]">No Support Requests Found</h3>
            <p className="text-gray-600 text-sm mt-1">You haven't submitted any guidance tickets yet.</p>
            <Link
              to="/support/new"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition text-sm"
            >
              <PlusCircle className="w-4 h-4 text-[#2563EB]" />
              Create Support Ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((ticket) => {
              const badgeClass = statusBadges[ticket.status] || 'bg-gray-100 text-gray-800';
              return (
                <div 
                  key={ticket.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#2563EB]/40 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-md">
                        {ticket.reference_number}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded">
                        {ticket.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {ticket.subject}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      {ticket.updates && ticket.updates.length > 0 && (
                        <span className="text-[#2563EB] font-semibold">
                          {ticket.updates.length} {ticket.updates.length === 1 ? 'Update' : 'Updates'}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/student/support/${ticket.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-[#2563EB]/90 transition shrink-0"
                  >
                    View Ticket
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSupportListPage;
