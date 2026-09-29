'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Mail, Clock, Eye, CheckCircle } from 'lucide-react';

export default function AdminEmailsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/emails');
        const data = await res.json();
        if (data.success) setLogs(data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Email Order Notification Logs
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Whenever a customer submits an order request, a complete order notification email is sent to your business email (thecozylittlemoonshine@gmail.com). You can also view all logged email notifications here!
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm p-6 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#7a6858]">Loading email logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#7a6858]">
              No email notifications recorded yet. Submit a test order on the checkout page to see instant email logs!
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#faf7f2] p-4 rounded-2xl border border-[#ebdcd0] flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-[#b87333]">{log.subject}</span>
                      <span className="text-[10px] text-[#7a6858]">
                        ({new Date(log.timestamp).toLocaleString('en-IN')})
                      </span>
                    </div>
                    <div className="text-xs text-[#4a3b32]">
                      To: <strong>{log.to}</strong> • Customer: <strong>{log.customerName}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEmail(log)}
                    className="px-3 py-1.5 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Email HTML</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Preview Modal */}
        {selectedEmail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white max-w-2xl w-full rounded-3xl border border-[#ebdcd0] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#ebdcd0] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#3b2d24]">Email Notification Preview</h3>
                <button onClick={() => setSelectedEmail(null)} className="text-gray-400 font-bold text-lg">✕</button>
              </div>

              <div
                className="border border-[#ebdcd0] rounded-2xl p-2 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
              />
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
