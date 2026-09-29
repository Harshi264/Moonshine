'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import {
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Order, Product } from '@/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !metrics) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-sm text-[#7a6858] animate-pulse">
          Loading Studio Analytics & Dashboard...
        </div>
      </AdminLayout>
    );
  }

  const { metrics: m, salesByCategory, lowStockProducts, recentOrders } = metrics;

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
              Studio Dashboard Overview
            </h1>
            <p className="text-xs text-[#7a6858] mt-1">
              Live sales performance, order requests, review ratings & inventory alerts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-bold rounded-full shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-white text-[#4a3b32] border border-[#d6c8b8] text-xs font-bold rounded-full shadow-sm hover:bg-[#f5eee6]"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#b87333]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c7868]">Total Orders</span>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">{m.totalOrders}</div>
            <div className="text-[11px] text-[#7a6858] flex items-center space-x-1">
              <span className="text-[#2e7d32] font-bold">{m.newOrders} New</span>
              <span>• {m.pendingOrders} Pending</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#b87333]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c7868]">Total Revenue</span>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">₹{m.totalRevenue}</div>
            <div className="text-[11px] text-[#7a6858]">
              Avg Order Value: <strong>₹{m.avgOrderValue}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#b87333]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c7868]">Products & Stock</span>
              <Package className="w-5 h-5" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">{m.totalProducts}</div>
            <div className="text-[11px] text-[#d9534f] font-semibold">
              {m.lowStockCount + m.outOfStockCount} items low/out of stock
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#d4af37]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c7868]">Avg Review Rating</span>
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">{m.avgRating} / 5.0</div>
            <div className="text-[11px] text-[#7a6858]">
              {m.totalReviews} total customer reviews
            </div>
          </div>

        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Orders (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#ebdcd0] pb-3">
              <h2 className="font-serif text-xl font-bold text-[#3b2d24]">Recent Order Requests</h2>
              <Link href="/admin/orders" className="text-xs text-[#b87333] hover:underline font-bold">
                View All Orders →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-[#7a6858] italic py-4 text-center">No order requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f5eee6] text-[#4a3b32] font-bold">
                      <th className="p-3 rounded-l-xl">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2e8de]">
                    {recentOrders.map((o: Order) => (
                      <tr key={o.id} className="hover:bg-[#faf7f2]">
                        <td className="p-3 font-bold text-[#b87333]">{o.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-[#3b2d24]">{o.customerName}</div>
                          <a href={`tel:${o.phone}`} className="text-[11px] text-[#7a6858] hover:underline">
                            📞 {o.phone}
                          </a>
                        </td>
                        <td className="p-3 font-bold text-[#4a3b32]">₹{o.totalAmount}</td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="bg-[#faf7f2] border border-[#d6c8b8] rounded-lg p-1 text-[11px] font-semibold text-[#4a3b32]"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <a
                            href={`https://wa.me/91${o.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#25D366] text-white rounded-md inline-block shadow"
                            title="Open WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Low Stock Alerts & Category breakdown */}
          <div className="space-y-6">
            
            {/* Low Stock Warning */}
            <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-[#d9534f] border-b border-[#ebdcd0] pb-3">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="font-serif text-lg font-bold text-[#3b2d24]">Low Stock Warnings</h2>
              </div>

              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-[#2e7d32] font-semibold">All products have healthy stock levels!</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((p: Product) => (
                    <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-[#fff8f6] border border-[#ffded6] rounded-xl">
                      <span className="font-bold text-[#3b2d24] truncate max-w-[150px]">{p.name}</span>
                      <span className="bg-[#d9534f] text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                  <Link href="/admin/inventory" className="text-xs text-[#b87333] hover:underline font-bold block pt-1">
                    Manage Inventory Stock →
                  </Link>
                </div>
              )}
            </div>

            {/* Sales by Category */}
            <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3">
                Sales by Category
              </h2>
              <div className="space-y-3 text-xs">
                {Object.entries(salesByCategory).map(([cat, data]: [string, any]) => (
                  <div key={cat} className="flex justify-between items-center p-2.5 bg-[#faf7f2] rounded-xl">
                    <span className="font-bold text-[#3b2d24] capitalize">{cat.replace('-', ' ')}</span>
                    <span className="text-[#7a6858]">
                      {data.count} items • <strong>₹{data.revenue}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
