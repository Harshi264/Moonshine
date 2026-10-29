'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

const ORDER_STEPS = [
  { key: 'New', label: 'Order Placed', desc: 'Received at studio' },
  { key: 'Confirmed', label: 'Payment Confirmed', desc: 'Verified & scheduled' },
  { key: 'Preparing', label: 'Crafting & Curing', desc: 'Artisanal hand-poured' },
  { key: 'Shipped', label: 'Dispatched in Transit', desc: 'Courier express partner' },
  { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your cozy ambiance!' },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [query, setQuery] = useState(''); // phone or email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  // Check URL params if coming from email link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('orderId');
      if (urlId) {
        setOrderId(urlId);
        handleTrackOrder(urlId);
      }
    }
  }, []);

  const handleTrackOrder = async (searchId?: string) => {
    const idToSearch = searchId || orderId;
    if (!idToSearch.trim()) {
      setError('Please enter your Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const q = query.trim() ? `&query=${encodeURIComponent(query.trim())}` : '';
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(idToSearch.trim())}${q}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No matching order found. Please verify your Order ID and phone number.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ['New', 'Contacted', 'Confirmed', 'Preparing', 'Ready', 'Shipped', 'Delivered'];
    const stepEquivalents: Record<string, number> = {
      New: 0,
      Confirmed: 2,
      Preparing: 3,
      Shipped: 5,
      Delivered: 6,
    };

    const currentRank = statusOrder.indexOf(currentStatus);
    const stepRank = stepEquivalents[stepKey] ?? 0;

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (currentRank >= stepRank) return 'completed';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Real-time Order Status</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Track Your Studio Order
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858] max-w-xl mx-auto">
          Enter your Order ID (from your confirmation email / SMS) to view live craft progress, dispatch status, and delivery tracking.
        </p>
      </div>

      {/* Tracking Input Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrackOrder();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                Order ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-2026-00042"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                Phone Number or Email (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 8341790329 or your email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs sm:text-sm rounded-full shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching Studio Records...' : 'Track Live Status'}</span>
          </button>
        </form>
      </div>

      {/* Order Tracking Result View */}
      {order && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-lg space-y-8 animate-fadeIn">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#ebdcd0] pb-6">
            <div>
              <span className="text-[10px] text-[#b87333] font-bold uppercase tracking-wider">
                Order Tracking Record
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#3b2d24] mt-0.5">
                {order.id}
              </h2>
              <p className="text-xs text-[#8c7868]">
                Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : order.status === 'Shipped'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : order.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#f5eee6] text-[#b87333] border border-[#ebdcd0]'
                }`}
              >
                ● Status: {order.status}
              </span>
            </div>
          </div>

          {/* 5-Step Visual Timeline */}
          <div className="py-4">
            <h3 className="font-serif text-lg font-bold text-[#3b2d24] mb-6">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {ORDER_STEPS.map((s, idx) => {
                const state = getStepStatus(s.key, order.status);
                const isCompleted = state === 'completed';

                return (
                  <div key={s.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-sm ${
                        isCompleted
                          ? 'bg-[#2e7d32] text-white ring-4 ring-green-100'
                          : 'bg-[#faf7f2] text-[#8c7868] border-2 border-[#ebdcd0]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isCompleted ? 'text-[#3b2d24]' : 'text-[#8c7868]'}`}>
                        {s.label}
                      </div>
                      <div className="text-[10px] text-[#7a6858] mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this Order */}
          <div className="pt-4 border-t border-[#f5eee6] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3b2d24]">
              Ordered Handmade Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] text-xs"
                >
                  <div className="flex items-center space-x-3">
                    {item.productImage && (
                      <img src={item.productImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <div className="font-bold text-[#3b2d24]">{item.productName}</div>
                      {item.variantName && (
                        <div className="text-[10px] text-[#8c7868]">Variant: {item.variantName}</div>
                      )}
                      <div className="text-[11px] text-[#7a6858]">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-serif font-bold text-sm text-[#4a3b32]">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#f5eee6] rounded-2xl flex justify-between items-center text-xs text-[#4a3b32]">
              <div>
                <strong>Destination:</strong> {order.city}, {order.state} - {order.pincode}
              </div>
              <div className="text-right">
                <span className="text-[#8c7868]">Total Paid: </span>
                <span className="font-serif font-bold text-base text-[#3b2d24]">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Inquiry for this order */}
          <div className="pt-4 border-t border-[#ebdcd0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#7a6858]">
              Have questions regarding delivery timing or custom changes?
            </span>
            <a
              href={`https://wa.me/918341790329?text=${encodeURIComponent(
                `Hi! I am inquiring about my Order ${order.id} for ${order.customerName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold flex items-center space-x-2 transition-all shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire on WhatsApp (+91 8341790329)</span>
            </a>
          </div>

        </div>
      )}

      {/* Helpful Hint */}
      <div className="p-5 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] text-center text-xs text-[#7a6858] space-y-1">
        <p>
          Can't locate your Order ID? Check your order confirmation email from <strong>thelittlecozymoonshine@gmail.com</strong> or message us on WhatsApp with your phone number.
        </p>
      </div>

    </div>
  );
}
