'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Order } from '@/types';
import {
  User,
  ShoppingBag,
  LogOut,
  MessageSquare,
  CheckCircle,
  Truck,
  Package,
  Star,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Flame,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: 'Order Pending',    color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200',  icon: Clock },
  confirmed: { label: 'Confirmed',        color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: CheckCircle },
  preparing: { label: 'Being Prepared',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Package },
  shipped:   { label: 'Shipped',          color: 'text-cyan-700',   bg: 'bg-cyan-50 border-cyan-200',     icon: Truck },
  delivered: { label: 'Delivered ✓',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle },
  cancelled: { label: 'Cancelled',        color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: Package },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status,
    color: 'text-[#4a3b32]',
    bg: 'bg-[#faf7f2] border-[#ebdcd0]',
    icon: Package,
  };
}

export default function CustomerAccountPage() {
  const { customer, logoutCustomer } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerOrders() {
      if (!customer) return;
      setLoading(true);
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          const matched = data.orders.filter(
            (o: Order) =>
              (customer.email && o.email.toLowerCase() === customer.email.toLowerCase()) ||
              (customer.phone && o.phone.replace(/[^0-9]/g, '') === customer.phone.replace(/[^0-9]/g, ''))
          );
          setOrders(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerOrders();
  }, [customer]);

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-md">
          <div className="w-16 h-16 bg-[#f5eee6] text-[#b87333] rounded-2xl mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3b2d24]">Sign In to Your Account</h1>
            <p className="text-sm text-[#7a6858] mt-2">
              Log in with your phone or email to view orders and get delivery updates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow flex items-center justify-center space-x-2 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>
            <Link
              href="/catalogue"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#d6c8b8] text-[#4a3b32] font-bold text-sm rounded-full flex items-center justify-center space-x-2 hover:bg-[#faf7f2] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Shop</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = customer.name
    ? customer.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '🕯️';

  const deliveredCount = orders.filter((o) => o.status?.toLowerCase() === 'delivered').length;
  const pendingCount = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status?.toLowerCase())).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Account Header Card */}
      <div className="bg-gradient-to-r from-[#4a3b32] to-[#6e4e3b] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center font-serif text-xl font-bold text-[#e6c594] border border-white/20 shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-0.5">Welcome back</div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {customer.name || 'Valued Customer'}
            </h1>
            <p className="text-sm text-white/70 mt-0.5 flex items-center space-x-1.5">
              {customer.phone ? (
                <><Phone className="w-3.5 h-3.5" /><span>{customer.phone}</span></>
              ) : (
                <><Mail className="w-3.5 h-3.5" /><span>{customer.email}</span></>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={logoutCustomer}
          id="logout-btn"
          className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full border border-white/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-[#b87333]', bg: 'bg-[#f5eee6]' },
          { label: 'Active Orders', value: pendingCount, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Delivered', value: deliveredCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#ebdcd0] p-4 text-center shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl mx-auto flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="font-serif text-2xl font-bold text-[#3b2d24]">{value}</div>
            <div className="text-[11px] text-[#8c7868] mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-[#ebdcd0] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#3b2d24]">My Orders</h2>
            <p className="text-xs text-[#8c7868] mt-0.5">Your complete order history with live status</p>
          </div>
          <Link
            href="/catalogue"
            className="text-xs font-bold text-[#b87333] hover:text-[#4a3b32] flex items-center space-x-1 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop More</span>
          </Link>
        </div>

        {loading ? (
          <div className="px-8 py-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#b87333] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#7a6858]">Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="px-8 py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#f5eee6] text-[#b87333] rounded-2xl mx-auto flex items-center justify-center">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-[#3b2d24]">No orders yet</p>
              <p className="text-sm text-[#7a6858] mt-1">Start exploring our handcrafted collection!</p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow transition-all"
            >
              <span>Browse Candles & Crafts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#f5eee6]">
            {orders.map((o) => {
              const sc = getStatusConfig(o.status);
              const StatusIcon = sc.icon;
              return (
                <div key={o.id} className="p-5 sm:p-6 hover:bg-[#faf7f2] transition-colors">
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-base font-bold text-[#b87333]">{o.id}</span>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{sc.label}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8c7868]">
                        Placed {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg font-bold text-[#3b2d24]">₹{o.totalAmount}</div>
                      <div className="text-[11px] text-[#8c7868]">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-[#faf7f2] rounded-xl border border-[#ebdcd0] p-3 space-y-2 mb-4">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {item.productImage && (
                            <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded-lg object-cover border border-[#ebdcd0]" />
                          )}
                          <div>
                            <div className="font-bold text-[#3b2d24]">{item.productName}</div>
                            {item.variantName && <div className="text-[#8c7868]">Option: {item.variantName}</div>}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="font-bold text-[#4a3b32]">₹{item.price * item.quantity}</span>
                          <span className="text-[#8c7868] block">×{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery info & actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-1.5 text-xs text-[#7a6858]">
                      <MapPin className="w-3.5 h-3.5 text-[#b87333]" />
                      <span>{o.city}, {o.state} — {o.pincode}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/918341790329?text=${encodeURIComponent(`Hi! I have a query about my Order ${o.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] text-xs font-bold rounded-full border border-[#a5d6a7] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {o.status?.toLowerCase() === 'delivered' && (
                        <Link
                          href={`/review?orderId=${o.id}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#b87333] text-xs font-bold rounded-full border border-[#d6c8b8] transition-colors"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Leave a Review</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {o.customerNotes && (
                    <div className="mt-3 text-[11px] text-[#996600] bg-[#fff9e6] border border-[#ffe599] p-2.5 rounded-lg">
                      📝 Note: {o.customerNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/catalogue', icon: ShoppingBag, label: 'Browse All Products', desc: 'Explore our full collection' },
          { href: '/wishlist', icon: Flame, label: 'My Wishlist', desc: 'Saved items for later' },
          { href: '/review', icon: Star, label: 'Write a Review', desc: 'Share your experience' },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-[#ebdcd0] rounded-2xl p-4 flex items-center space-x-3 hover:border-[#b87333] hover:bg-[#faf7f2] transition-all group shadow-sm"
          >
            <div className="w-9 h-9 bg-[#f5eee6] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#ebdcd0] transition-colors">
              <Icon className="w-4 h-4 text-[#b87333]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#3b2d24] group-hover:text-[#b87333] transition-colors truncate">{label}</p>
              <p className="text-[11px] text-[#8c7868] truncate">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#d6c8b8] group-hover:text-[#b87333] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
