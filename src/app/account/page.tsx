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
  Clock,
  CheckCircle,
  Truck,
  Package,
  Star,
  ArrowRight,
} from 'lucide-react';

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
          // Filter customer's orders by phone or email
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
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-2xl font-bold text-[#3b2d24]">Please Log In</h1>
        <p className="text-xs text-[#7a6858]">Log in with your phone or email to view your customer account.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-[#4a3b32] text-white font-bold text-xs rounded-full shadow"
        >
          Go to Customer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-[#f5eee6] text-[#b87333] rounded-full flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3b2d24]">
              Welcome, {customer.name}!
            </h1>
            <p className="text-xs text-[#7a6858] mt-0.5">
              Contact: <strong>{customer.phone || customer.email}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={logoutCustomer}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200 flex items-center space-x-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
        <div className="border-b border-[#ebdcd0] pb-3">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">
            Your Orders ({orders.length})
          </h2>
          <p className="text-xs text-[#7a6858] mt-1">
            Real-time status updates and order details.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#7a6858]">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-[#b87333] mx-auto" />
            <p className="text-xs text-[#7a6858]">You haven't placed any order requests yet.</p>
            <Link
              href="/catalogue"
              className="inline-block px-6 py-2.5 bg-[#4a3b32] text-white font-bold text-xs rounded-full shadow"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ebdcd0] space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#ebdcd0] pb-3 text-xs gap-2">
                  <div>
                    <span className="font-bold text-[#b87333] font-serif text-base">{o.id}</span>
                    <span className="text-[#8c7868] ml-2">
                      ({new Date(o.createdAt).toLocaleDateString()})
                    </span>
                  </div>

                  <span className="bg-[#4a3b32] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Status: {o.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong className="text-[#3b2d24] block mb-1">Items Ordered:</strong>
                    <ul className="space-y-1 text-[#5c4a3e]">
                      {o.items.map((item, i) => (
                        <li key={i}>
                          • {item.productName} (x{item.quantity}) — ₹{item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 text-[#5c4a3e]">
                    <div><strong>Total Amount:</strong> ₹{o.totalAmount}</div>
                    <div><strong>Delivery Location:</strong> {o.city}, {o.state}</div>
                    {o.customerNotes && (
                      <div className="text-[11px] text-[#996600] bg-[#fff9e6] p-2 rounded-lg mt-1">
                        Notes: {o.customerNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick WhatsApp Action */}
                <div className="pt-3 border-t border-[#ebdcd0] flex justify-between items-center text-xs">
                  <a
                    href={`https://wa.me/918341790329?text=${encodeURIComponent(`Hi! Inquiry regarding my Order ${o.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-bold hover:underline flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp (8341790329)</span>
                  </a>

                  {o.status === 'Delivered' && (
                    <Link
                      href={`/review?orderId=${o.id}`}
                      className="px-3 py-1 bg-[#4a3b32] text-white text-[11px] font-bold rounded-full"
                    >
                      Write a Review
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
