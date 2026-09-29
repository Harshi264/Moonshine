'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Upload, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '@/types';

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const initialProductId = searchParams.get('productId') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          if (!selectedProductId && data.products.length > 0) {
            setSelectedProductId(data.products[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedProductId || !customerName || !comment) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imagePreview) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: imagePreview }),
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          orderId: orderId ? orderId.trim() : undefined,
          customerName: customerName.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : undefined,
          rating,
          comment: comment.trim(),
          images: imageUrl ? [imageUrl] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err: any) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full mx-auto flex items-center justify-center shadow">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3b2d24]">Review Submitted!</h1>
        <p className="text-sm text-[#7a6858]">
          Thank you so much for sharing your feedback with <strong>The Little Cozy Moonshine</strong>. Your review has been submitted for studio moderation and will appear on the product page shortly.
        </p>
        <a
          href="/catalogue"
          className="inline-block px-8 py-3.5 bg-[#4a3b32] text-white font-bold text-xs rounded-full shadow"
        >
          Explore More Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-[#f5eee6] text-[#b87333] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Customer Feedback & Review Link</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Share Your Candle & Craft Experience
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858]">
          Help our small studio grow! Have an Order ID? Enter it below to receive a <strong>Verified Buyer</strong> badge.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
        
        {/* Order ID Input */}
        <div>
          <label className="block text-xs font-bold text-[#4a3b32] mb-1">
            Order ID (Optional for Verified Buyer Badge)
          </label>
          <input
            type="text"
            placeholder="e.g. ORD-2026-00125"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-xs font-bold text-[#4a3b32] mb-1">Select Product *</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Star Rating Picker */}
        <div>
          <label className="block text-xs font-bold text-[#4a3b32] mb-2">Overall Rating *</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none text-[#d4af37] transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-[#4a3b32] ml-2">{rating} Stars</span>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-xs font-bold text-[#4a3b32] mb-1">Written Review *</label>
          <textarea
            rows={4}
            required
            placeholder="Tell us about the scent, fragrance throw, resin finish, packaging..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
          />
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4a3b32] mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3b32] mb-1">Email Address (Optional)</label>
            <input
              type="email"
              placeholder="e.g. ananya@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
            />
          </div>
        </div>

        {/* Image Upload Box */}
        <div>
          <label className="block text-xs font-bold text-[#4a3b32] mb-1">
            Upload Product Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-[#d6c8b8] bg-[#faf7f2] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#f5eee6] transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {imagePreview ? (
              <div className="space-y-2">
                <img src={imagePreview} alt="Preview" className="h-32 mx-auto object-cover rounded-xl" />
                <p className="text-[11px] text-[#2e7d32] font-bold">Photo attached! Click to change.</p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-6 h-6 text-[#b87333] mx-auto" />
                <p className="text-xs font-semibold text-[#4a3b32]">Click to upload product photo</p>
                <p className="text-[10px] text-[#8c7868]">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting Review...' : 'Submit Verified Review'}
        </button>

      </form>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading review page...</div>}>
      <ReviewFormContent />
    </Suspense>
  );
}
