'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Review } from '@/types';
import { Star, CheckCircle, XCircle, Trash2, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?admin=true&status=${statusFilter !== 'all' ? statusFilter : ''}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const updateReviewStatus = async (id: string, status: string, isFeatured?: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...(isFeatured !== undefined ? { isFeatured } : {}) }),
      });
      const data = await res.json();
      if (data.success) loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Review Moderation & Customer Ratings
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Moderate customer review submissions, approve ratings, view uploaded photos, and mark top reviews as featured.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-white p-3 rounded-2xl border border-[#ebdcd0]">
          {['all', 'pending', 'approved', 'rejected', 'hidden'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider capitalize ${
                statusFilter === st
                  ? 'bg-[#4a3b32] text-white shadow'
                  : 'bg-[#faf7f2] text-[#5c4a3e] hover:bg-[#f5eee6]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#7a6858]">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-[#ebdcd0] text-center text-xs text-[#7a6858]">
              No reviews found matching current filter.
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-3xl border border-[#ebdcd0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-bold text-[#3b2d24]">{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified Order ({r.orderId || 'Verified'})
                      </span>
                    )}
                    <span className="text-[#8c7868]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex text-[#d4af37]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#4a3b32] italic">"{r.comment}"</p>

                  <div className="text-[11px] text-[#7a6858]">
                    Product: <strong>{r.productName}</strong>
                  </div>

                  {r.images && r.images.length > 0 && (
                    <div className="pt-1">
                      <img src={r.images[0]} alt="Customer photo" className="w-20 h-20 object-cover rounded-xl border" />
                    </div>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
                  <button
                    onClick={() => updateReviewStatus(r.id, 'approved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 ${
                      r.status === 'approved'
                        ? 'bg-[#2e7d32] text-white'
                        : 'bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => updateReviewStatus(r.id, 'rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 ${
                      r.status === 'rejected'
                        ? 'bg-[#d9534f] text-white'
                        : 'bg-red-50 text-[#d9534f] hover:bg-[#d9534f] hover:text-white'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => updateReviewStatus(r.id, r.status, !r.isFeatured)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      r.isFeatured ? 'bg-[#e6c594] text-[#4a3b32]' : 'bg-[#faf7f2] text-[#4a3b32]'
                    }`}
                  >
                    {r.isFeatured ? '★ Featured' : 'Mark Featured'}
                  </button>

                  <button
                    onClick={() => deleteReview(r.id)}
                    className="p-1.5 bg-gray-100 hover:bg-red-100 text-red-600 rounded-xl"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
