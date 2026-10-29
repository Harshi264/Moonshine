'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
  Inbox,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  RefreshCw,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'read' | 'unread' | 'replied') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status, repliedAt: status === 'replied' ? new Date().toISOString() : m.repliedAt } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
                Customer Messages & Custom Inquiries
              </h1>
              {unreadCount > 0 && (
                <span className="bg-[#b87333] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#7a6858] mt-1">
              Direct inquiries from your website contact form and custom order requests.
            </p>
          </div>

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="px-4 py-2 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] text-xs font-bold rounded-full border border-[#d6c8b8] flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#b87333]' : ''}`} />
            <span>Refresh Inbox</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl border border-[#ebdcd0]">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {(['all', 'unread', 'read', 'replied'] as const).map((tab) => {
              const count =
                tab === 'all'
                  ? messages.length
                  : messages.filter((m) => m.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                    statusFilter === tab
                      ? 'bg-[#4a3b32] text-white shadow-sm'
                      : 'text-[#7a6858] hover:bg-[#f5eee6]'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search name, phone, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#faf7f2] border border-[#d6c8b8] rounded-full text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8c7868]" />
          </div>
        </div>

        {/* Messages List & Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Message Cards List */}
          <div className={`space-y-3 ${selectedMessage ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
            {loading ? (
              <div className="bg-white p-12 text-center text-xs text-[#7a6858] rounded-2xl border border-[#ebdcd0] animate-pulse">
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#ebdcd0] space-y-2">
                <Inbox className="w-10 h-10 text-[#d6c8b8] mx-auto" />
                <p className="text-sm font-semibold text-[#4a3b32]">No messages found</p>
                <p className="text-xs text-[#8c7868]">
                  {search ? 'Try clearing your search query.' : 'Customer messages will appear here once submitted.'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'unread';
                const isCustomOrder = msg.subject.toLowerCase().includes('custom') || msg.subject.toLowerCase().includes('bulk');

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') {
                        handleUpdateStatus(msg.id, 'read');
                      }
                    }}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'border-[#b87333] ring-2 ring-[#b87333]/20'
                        : isUnread
                        ? 'border-[#d6c8b8] bg-[#fffdfa]'
                        : 'border-[#ebdcd0]'
                    }`}
                  >
                    {isUnread && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#b87333] shadow" />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-sm text-[#3b2d24]">
                            {msg.name}
                          </span>
                          {isCustomOrder && (
                            <span className="bg-[#f5eee6] text-[#b87333] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Custom Request</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7a6858] mt-0.5 flex items-center space-x-2">
                          <span>{msg.phone}</span>
                          <span>•</span>
                          <span>{msg.email}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#99887a] whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-xs font-semibold text-[#4a3b32] line-clamp-1">
                        {msg.subject}
                      </div>
                      <p className="text-xs text-[#7a6858] mt-1 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#f5eee6] flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-800'
                            : msg.status === 'replied'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {msg.status}
                      </span>

                      {msg.imageUrl && (
                        <span className="text-[10px] text-[#b87333] font-semibold flex items-center space-x-1">
                          <span>📸 Photo Attached</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Selected Message Detailed View */}
          {selectedMessage && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-md space-y-6 sticky top-24 h-fit">
              
              {/* Header and Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#ebdcd0] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b87333]">
                    Message ID: {selectedMessage.id}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2d24] mt-0.5">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-xs text-[#8c7868]">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedMessage.id,
                        selectedMessage.status === 'replied' ? 'read' : 'replied'
                      )
                    }
                    disabled={actionLoading}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1 ${
                      selectedMessage.status === 'replied'
                        ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7]'
                        : 'bg-[#4a3b32] hover:bg-[#b87333] text-white shadow'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{selectedMessage.status === 'replied' ? 'Marked Replied' : 'Mark as Replied'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={actionLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#ebdcd0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-[#8c7868] uppercase font-bold">Customer</div>
                  <div className="font-bold text-[#3b2d24] mt-0.5">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8c7868] uppercase font-bold">Phone Number</div>
                  <a href={`tel:${selectedMessage.phone}`} className="font-bold text-[#b87333] hover:underline mt-0.5 block">
                    📞 {selectedMessage.phone}
                  </a>
                </div>
                <div>
                  <div className="text-[10px] text-[#8c7868] uppercase font-bold">Email Address</div>
                  <a href={`mailto:${selectedMessage.email}`} className="font-bold text-[#b87333] hover:underline mt-0.5 block truncate">
                    ✉️ {selectedMessage.email}
                  </a>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#4a3b32] uppercase tracking-wider">
                  Inquiry Message:
                </label>
                <div className="p-4 bg-[#fffdfa] border border-[#ebdcd0] rounded-2xl text-xs sm:text-sm text-[#3b2d24] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Optional Photo Attachment */}
              {selectedMessage.imageUrl && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4a3b32] uppercase tracking-wider">
                    Inspiration / Custom Reference Photo:
                  </label>
                  <div className="rounded-2xl border border-[#ebdcd0] overflow-hidden max-w-sm">
                    <img
                      src={selectedMessage.imageUrl}
                      alt="Custom Order Reference"
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-2 bg-[#f5eee6] text-right">
                      <a
                        href={selectedMessage.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#b87333] font-bold inline-flex items-center space-x-1 hover:underline"
                      >
                        <span>Open Full Image</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 1-Click Fast Reply Actions */}
              <div className="pt-2 border-t border-[#ebdcd0] space-y-3">
                <div className="text-xs font-bold text-[#4a3b32] uppercase tracking-wider">
                  Quick Reply to Customer:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/91${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hi ${selectedMessage.name}! This is The Little Cozy Moonshine handmade studio regarding your inquiry about "${selectedMessage.subject}". How can we help?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-full shadow flex items-center space-x-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: ${selectedMessage.subject} - The Little Cozy Moonshine`
                    )}`}
                    className="px-4 py-2.5 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-bold rounded-full shadow flex items-center space-x-1.5 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {/* Phone Call */}
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="px-4 py-2.5 bg-white text-[#4a3b32] border border-[#d6c8b8] hover:bg-[#f5eee6] text-xs font-bold rounded-full shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#b87333]" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}
