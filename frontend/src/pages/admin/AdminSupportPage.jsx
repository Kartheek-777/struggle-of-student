import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminSupportRequests, addAdminSupportReply, updateAdminSupportStatus } from '../../services/api';
import { HelpCircle, MessageSquare, Filter, RefreshCw, X, ShieldAlert, Send } from 'lucide-react';

const AdminSupportPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getAdminSupportRequests();
      if (res.data && res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await addAdminSupportReply(selectedTicket.id, {
        message: replyMessage,
        is_internal_note: isInternalNote
      });
      setMsg({ type: 'success', text: isInternalNote ? 'Internal note added.' : 'Student-visible reply sent.' });
      setReplyMessage('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to send reply.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, st) => {
    try {
      await updateAdminSupportStatus(id, { status: st });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Support Request Management">
      <div className="space-y-6">
        
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#2563EB] tracking-tight">Student Support Ticketing Portal</h2>
            <p className="text-xs text-gray-500">Manage academic, career, and technical support tickets with internal staff notes.</p>
          </div>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border text-xs font-bold ${msg.type === 'success' ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#E2E8F0]' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2563EB] mb-2" />
              <p className="text-xs font-bold">Loading Support Requests...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFFFF] border-b border-[#E2E8F0] text-[#2563EB] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref & Subject</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-[#FFFFFF]/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-[#2563EB]">{ticket.reference_number}</p>
                        <p className="font-semibold text-gray-700">{ticket.subject}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2563EB]">
                        {ticket.user_name} ({ticket.user_email})
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          ticket.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#2563EB]">
                        {ticket.status}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold text-[10px] hover:bg-[#1D4ED8]"
                          >
                            Reply / View
                          </button>

                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            className="px-2 py-1 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[10px] font-bold text-[#2563EB]"
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TICKET REPLY MODAL */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] max-w-2xl w-full p-6 space-y-4 animate-fadeIn shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-[#2563EB]">{selectedTicket.reference_number}: {selectedTicket.subject}</h3>
                  <p className="text-xs text-gray-500">From: {selectedTicket.user_name} ({selectedTicket.user_email})</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs space-y-1">
                <p className="font-bold text-[#2563EB]">Ticket Description:</p>
                <p className="text-gray-700">{selectedTicket.description}</p>
              </div>

              {/* PAST UPDATES & NOTES */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedTicket.updates?.map((upd) => (
                  <div key={upd.id} className={`p-3 rounded-xl text-xs ${upd.message?.includes('[INTERNAL NOTE]') ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-gray-50 text-gray-800'}`}>
                    <div className="flex justify-between font-bold text-[10px] mb-1">
                      <span>{upd.author_name}</span>
                      <span>{new Date(upd.created_at).toLocaleString()}</span>
                    </div>
                    <p>{upd.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReplySubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-[#2563EB]"
                    />
                    <span>Add as Internal Staff Note (Students will NEVER see internal notes)</span>
                  </label>
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder={isInternalNote ? "Write internal note for staff..." : "Write official reply to student..."}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs focus:outline-none focus:border-[#2563EB]"
                ></textarea>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{submitting ? 'Submitting...' : isInternalNote ? 'Save Internal Note' : 'Send Student Reply'}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;
