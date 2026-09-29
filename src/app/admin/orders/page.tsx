'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Search,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Trash2,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [internalNote, setInternalNote] = useState('');

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveInternalNote = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: internalNote }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Internal notes updated!');
        loadOrders();
        if (selectedOrder) setSelectedOrder(data.order);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusList: OrderStatus[] = [
    'New',
    'Contacted',
    'Confirmed',
    'Preparing',
    'Ready',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
              Order Requests Management
            </h1>
            <p className="text-xs text-[#7a6858] mt-1">
              View customer details, phone numbers, delivery addresses, update order statuses, and add internal studio notes.
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#4a3b32] text-white shadow'
                  : 'bg-[#faf7f2] text-[#5c4a3e] border border-[#d6c8b8]'
              }`}
            >
              All Orders
            </button>
            {statusList.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st.toLowerCase())}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  statusFilter === st.toLowerCase()
                    ? 'bg-[#b87333] text-white shadow'
                    : 'bg-[#faf7f2] text-[#5c4a3e] border border-[#d6c8b8]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8c7868]" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#7a6858]">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#7a6858]">
              No order requests found matching the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f5eee6] text-[#4a3b32] font-bold border-b border-[#ebdcd0]">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Delivery Location</th>
                    <th className="p-4">Items Summary</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Contact Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e8de]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#b87333]">{o.id}</div>
                        <div className="text-[10px] text-[#7a6858]">
                          {new Date(o.createdAt).toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#3b2d24]">{o.customerName}</div>
                        <a href={`tel:${o.phone}`} className="text-[#b87333] hover:underline font-semibold block">
                          📞 {o.phone}
                        </a>
                        <div className="text-[#7a6858] text-[10px]">{o.email}</div>
                        {o.instagramUsername && (
                          <div className="text-[#dc2743] text-[10px] font-semibold">
                            {o.instagramUsername}
                          </div>
                        )}
                      </td>

                      <td className="p-4 max-w-[180px]">
                        <div className="truncate text-[#3b2d24]">{o.deliveryAddress}</div>
                        <div className="font-semibold text-[#7a6858]">
                          {o.city}, {o.state} - {o.pincode}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-[#3b2d24]">
                          {o.items.length} Product(s)
                        </div>
                        <div className="text-[10px] text-[#7a6858] truncate max-w-[150px]">
                          {o.items.map((i) => i.productName).join(', ')}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-serif text-sm font-bold text-[#4a3b32]">
                          ₹{o.totalAmount}
                        </div>
                        {o.discountTotal > 0 && (
                          <div className="text-[10px] text-[#2e7d32]">Saved ₹{o.discountTotal}</div>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="bg-[#faf7f2] border border-[#d6c8b8] rounded-lg p-1.5 text-xs font-bold text-[#4a3b32]"
                        >
                          {statusList.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-center space-x-1.5 whitespace-nowrap">
                        <a
                          href={`tel:${o.phone}`}
                          className="p-2 bg-[#4a3b32] hover:bg-[#b87333] text-white rounded-lg inline-block shadow-sm"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${o.customerName}, thank you for your order on The Little Cozy Moonshine! Order ID: ${o.id}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg inline-block shadow-sm"
                          title="Open WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setInternalNote(o.internalNotes || '');
                          }}
                          className="p-2 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] rounded-lg inline-block border border-[#d6c8b8]"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Order Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white max-w-2xl w-full rounded-3xl border border-[#ebdcd0] p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              
              <div className="flex justify-between items-start border-b border-[#ebdcd0] pb-4">
                <div>
                  <div className="text-xs text-[#8c7868] uppercase font-bold">Order Details & History</div>
                  <h2 className="font-serif text-2xl font-bold text-[#b87333]">{selectedOrder.id}</h2>
                  <div className="text-xs text-[#7a6858]">
                    Date: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Customer Contact */}
              <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#ebdcd0] space-y-2 text-xs text-[#4a3b32]">
                <h3 className="font-bold text-sm text-[#3b2d24]">👤 Customer Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div>
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${selectedOrder.phone}`} className="text-[#b87333] font-bold">
                      {selectedOrder.phone}
                    </a>
                  </div>
                  <div><strong>Email:</strong> {selectedOrder.email}</div>
                  {selectedOrder.instagramUsername && (
                    <div><strong>Instagram:</strong> {selectedOrder.instagramUsername}</div>
                  )}
                  <div><strong>Preferred Contact:</strong> {selectedOrder.preferredContact || 'WhatsApp'}</div>
                </div>
                <div className="pt-2 border-t border-[#ebdcd0]">
                  <strong>📍 Address:</strong> {selectedOrder.deliveryAddress}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-[#3b2d24]">📦 Ordered Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#f5eee6] p-3 rounded-xl text-xs">
                      <div>
                        <strong className="text-[#3b2d24]">{item.productName}</strong> {item.variantName ? `(${item.variantName})` : ''}
                        {item.customizationDetails && (
                          <div className="text-[11px] text-[#b87333] italic mt-0.5">
                            Customization: {JSON.stringify(item.customizationDetails)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div>Qty: {item.quantity}</div>
                        <div className="font-bold text-[#4a3b32]">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.customerNotes && (
                <div className="bg-[#fff9e6] p-3 rounded-xl border border-[#ffe599] text-xs text-[#996600]">
                  <strong>📝 Customer Note:</strong> {selectedOrder.customerNotes}
                </div>
              )}

              {/* Internal Notes Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#4a3b32]">
                  Internal Studio Notes (Private to Admin):
                </label>
                <div className="flex space-x-2">
                  <textarea
                    rows={2}
                    placeholder="Add notes about payment status, custom scent prep, delivery tracking..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="flex-1 p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                  />
                  <button
                    onClick={() => handleSaveInternalNote(selectedOrder.id)}
                    className="px-4 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-bold rounded-xl shrink-0"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#ebdcd0]">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="text-xs text-[#d9534f] hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                <div className="flex space-x-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="px-4 py-2 bg-[#4a3b32] text-white text-xs font-bold rounded-full"
                  >
                    📞 Call Customer
                  </a>
                  <a
                    href={`https://wa.me/91${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-full"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
