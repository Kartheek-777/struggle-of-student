import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, ArrowLeft, Send, Upload, Clock, User, 
  ShieldCheck, AlertCircle, CheckCircle2, FileText 
} from 'lucide-react';
import { getStudentSupportDetail, addSupportUpdate } from '../services/api';

const statusBadges = {
  OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
  ACKNOWLEDGED: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
  WAITING_FOR_STUDENT: 'bg-orange-100 text-orange-800 border-orange-200',
  RESOLVED: 'bg-[#2563EB]/15 text-[#2563EB] border-[#E2E8F0]',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

const StudentSupportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentSupportDetail(id);
      if (res.data?.success && res.data.data) {
        setTicket(res.data.data);
      } else {
        setError(res.data?.message || "Ticket not found.");
      }
    } catch (err) {
      console.error("Failed to load support ticket detail:", err);
      setError("Support ticket detail could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setUpdateMsg(null);
    try {
      let payload;
      let isMultipart = false;

      if (attachment) {
        isMultipart = true;
        payload = new FormData();
        payload.append('message', message);
        payload.append('attachment', attachment);
      } else {
        payload = { message };
      }

      const res = await addSupportUpdate(id, payload, isMultipart);
      if (res.data?.success) {
        setMessage('');
        setAttachment(null);
        setUpdateMsg("Update added successfully!");
        fetchTicketDetail();
      } else {
        setError(res.data?.message || "Failed to add update.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "An error occurred while adding update.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-[#0F172A]">Request Not Found</h2>
          <p className="text-gray-600 mt-2">{error || "Access denied or request does not exist."}</p>
          <Link
            to="/student/support"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#2563EB]/90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Support Requests
          </Link>
        </div>
      </div>
    );
  }

  const badgeClass = statusBadges[ticket.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/student/support"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Support Requests
        </Link>

        {/* TICKET HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm font-bold text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-md">
                  {ticket.reference_number}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded">
                  {ticket.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {ticket.subject}
              </h1>
            </div>

            <div className="text-xs text-gray-500 space-y-1 sm:text-right">
              <div>Created: <span className="font-bold text-gray-700">{new Date(ticket.created_at).toLocaleString()}</span></div>
              <div>Priority: <span className="font-bold text-[#2563EB]">{ticket.priority}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initial Request Description</h4>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>

            {ticket.attachment && (
              <div className="mt-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <a 
                  href={ticket.attachment} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  View Attachment
                </a>
              </div>
            )}
          </div>
        </div>

        {/* CONVERSATION UPDATES TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            Request Updates & Conversation ({ticket.updates ? ticket.updates.length : 0})
          </h3>

          {!ticket.updates || ticket.updates.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-sm">
              No updates yet. Our SS Support Team will review your request and post guidance here.
            </div>
          ) : (
            <div className="space-y-6">
              {ticket.updates.map((upd) => (
                <div 
                  key={upd.id} 
                  className={`p-5 rounded-2xl border ${
                    upd.is_staff_reply 
                      ? 'bg-amber-50/70 border-amber-200 ml-4 sm:ml-8' 
                      : 'bg-gray-50 border-gray-200 mr-4 sm:mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {upd.is_staff_reply ? (
                        <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-bold text-sm text-[#0F172A]">
                        {upd.author_name}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {new Date(upd.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed pl-9">
                    {upd.message}
                  </p>

                  {upd.attachment && (
                    <div className="mt-3 pl-9 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                      <a 
                        href={upd.attachment} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        Attachment
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD UPDATE FORM */}
        {ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">
              Add Update / Message
            </h3>

            {updateMsg && (
              <div className="mb-4 p-3 bg-[#2563EB]/10 text-[#2563EB] text-sm rounded-xl flex items-center gap-2 border border-[#E2E8F0]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {updateMsg}
              </div>
            )}

            <form onSubmit={handleAddUpdate} className="space-y-4">
              <div>
                <textarea
                  rows="3"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message or update here..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">
                  <Upload className="w-4 h-4 text-[#2563EB]" />
                  Attach File
                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && setAttachment(e.target.files[0])} 
                    className="hidden" 
                  />
                </label>
                {attachment && (
                  <span className="text-xs text-gray-600 truncate font-mono">
                    {attachment.name}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="px-6 py-2.5 bg-[#2563EB] text-white font-bold text-sm rounded-xl shadow hover:bg-[#2563EB]/90 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#2563EB]" />
                  Send Update
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSupportDetailPage;
