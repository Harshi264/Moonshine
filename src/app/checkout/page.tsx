'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  Phone,
  MessageSquare,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Gift,
  CreditCard,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal, discountTotal, shippingFee, total, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'request' | 'razorpay'>('request');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    instagramUsername: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    customerNotes: '',
    giftMessage: '',
    preferredContact: 'WhatsApp' as 'WhatsApp' | 'Phone' | 'Email' | 'Instagram',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [upiCopied, setUpiCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyUpi = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!formData.customerName || !formData.phone || !formData.email || !formData.deliveryAddress || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required contact and delivery fields.');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        variantId: item.variant?.id,
        variantName: item.variant?.name,
        price: item.unitPrice,
        quantity: item.quantity,
        customizationDetails: item.customizationDetails,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setSubmittedOrder(data.order);
        clearCart();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        setError(data.error || 'Failed to submit order request. Please try again.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#b87333] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#e8f5e9] text-[#2e7d32] rounded-full mx-auto flex items-center justify-center shadow">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-[#f5eee6] text-[#b87333] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Order Confirmed & Email Receipt Sent!
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24] mt-2">
              Thank You, {submittedOrder.customerName}!
            </h1>
            <p className="text-sm text-[#7a6858] mt-2 max-w-md mx-auto">
              Your order has been submitted to <strong>The Little Cozy Moonshine</strong>. An email receipt has been sent to <strong>{submittedOrder.email}</strong>.
            </p>
          </div>

          {/* Order ID Banner */}
          <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ebdcd0] max-w-md mx-auto">
            <div className="text-xs text-[#8c7868] uppercase font-bold tracking-wider">Your Unique Order ID</div>
            <div className="font-serif text-2xl font-bold text-[#b87333] mt-1">{submittedOrder.id}</div>
            <div className="text-[11px] text-[#7a6858] mt-1">
              Date: {new Date(submittedOrder.createdAt).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#f5eee6] p-6 rounded-2xl border border-[#ebdcd0] text-left text-xs sm:text-sm space-y-2 text-[#4a3b32]">
            <h3 className="font-serif font-bold text-base text-[#3b2d24] border-b border-[#ebdcd0] pb-2">
              Order Details & Next Steps
            </h3>
            <p className="leading-relaxed">
              1. Our studio team is preparing your candle & resin creations.
            </p>
            <p className="leading-relaxed">
              2. We will contact you via <strong>{submittedOrder.preferredContact || 'WhatsApp'}</strong> ({submittedOrder.phone}) to confirm delivery date!
            </p>
          </div>

          {/* Dual WhatsApp Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/918341790329?text=${encodeURIComponent(
                `Hi! I placed Order ${submittedOrder.id} on your website.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp 1: 8341790329</span>
            </a>

            <a
              href={`https://wa.me/917075905496?text=${encodeURIComponent(
                `Hi! I placed Order ${submittedOrder.id} on your website.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp 2: 7075905496</span>
            </a>

            <Link
              href="/catalogue"
              className="w-full sm:w-auto px-6 py-3 bg-[#4a3b32] text-white font-bold text-xs rounded-full shadow flex items-center justify-center"
            >
              Back to Shop
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858]">
          Free Express Shipping on orders above <strong>₹1000</strong>!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Checkout Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3 flex items-center space-x-2">
            <span>1. Contact & Delivery Address</span>
            <span className="text-xs text-red-500 font-sans font-normal">* Required</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Full Name *</label>
              <input
                type="text"
                name="customerName"
                required
                placeholder="e.g. Kavya Reddy"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. 8341790329"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. kavya@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Instagram Handle (Optional)</label>
              <input
                type="text"
                name="instagramUsername"
                placeholder="e.g. @kavya_art"
                value={formData.instagramUsername}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3b32] mb-1">Complete Delivery Address *</label>
            <textarea
              name="deliveryAddress"
              rows={2}
              required
              placeholder="House/Flat No., Building Name, Street Name, Landmark"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                placeholder="e.g. Hyderabad"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">State *</label>
              <input
                type="text"
                name="state"
                required
                placeholder="e.g. Telangana"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                required
                placeholder="e.g. 500033"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3 pt-4">
            2. Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod('request')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'request'
                  ? 'border-[#b87333] bg-[#f5eee6]'
                  : 'border-[#ebdcd0] bg-[#faf7f2] hover:bg-[#f5eee6]/50'
              }`}
            >
              <div className="flex items-center space-x-2 text-sm font-bold text-[#3b2d24]">
                <Phone className="w-4 h-4 text-[#b87333]" />
                <span>Order Request (Pay Later / Call)</span>
              </div>
              <p className="text-[11px] text-[#7a6858] mt-1">
                Submit order without online payment. We call/WhatsApp you to confirm order & UPI/COD payment.
              </p>
            </div>

            <div
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'razorpay'
                  ? 'border-[#b87333] bg-[#f5eee6]'
                  : 'border-[#ebdcd0] bg-[#faf7f2] hover:bg-[#f5eee6]/50'
              }`}
            >
              <div className="flex items-center space-x-2 text-sm font-bold text-[#3b2d24]">
                <CreditCard className="w-4 h-4 text-[#b87333]" />
                <span>Online Payment (UPI / Razorpay / Cards)</span>
              </div>
              <p className="text-[11px] text-[#7a6858] mt-1">
                Instant UPI / Credit Card payment via Razorpay secure gateway.
              </p>
            </div>
          </div>

          {/* If Razorpay / UPI chosen, show instant UPI ID copy details */}
          {paymentMethod === 'razorpay' && (
            <div className="bg-[#fff9e6] p-4 rounded-2xl border border-[#ffe599] space-y-2 text-xs text-[#3b2d24]">
              <div className="flex items-center space-x-2 font-bold text-[#b87333]">
                <QrCode className="w-4 h-4" />
                <span>Instant Studio UPI Payment Handles:</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => copyUpi('8341790329@okicici')}
                  className="px-3 py-1.5 bg-white border border-[#d6c8b8] rounded-lg font-bold flex items-center space-x-1 hover:bg-[#f5eee6]"
                >
                  <span>UPI 1: 8341790329@okicici</span>
                  {upiCopied ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5 text-[#8c7868]" />}
                </button>
                <button
                  type="button"
                  onClick={() => copyUpi('7075905496@ybl')}
                  className="px-3 py-1.5 bg-white border border-[#d6c8b8] rounded-lg font-bold flex items-center space-x-1 hover:bg-[#f5eee6]"
                >
                  <span>UPI 2: 7075905496@ybl</span>
                  {upiCopied ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5 text-[#8c7868]" />}
                </button>
              </div>
            </div>
          )}

          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3 pt-2">
            3. Special Notes & Contact Preference
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Customization / Delivery Notes</label>
              <textarea
                name="customerNotes"
                rows={2}
                placeholder="Add special instructions, custom scents, or gift notes..."
                value={formData.customerNotes}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Preferred Contact Method</label>
              <select
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              >
                <option value="WhatsApp">WhatsApp Message</option>
                <option value="Phone">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Instagram">Instagram Direct Message</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs py-1 border-b border-[#f5eee6]">
                  <div className="flex items-center space-x-2">
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <div className="font-bold text-[#3b2d24] line-clamp-1">{item.product.name}</div>
                      <div className="text-[#8c7868]">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-[#4a3b32]">₹{item.unitPrice * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#ebdcd0] space-y-2 text-xs text-[#5c4a3e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Discount Saved</span>
                  <span className="font-bold">-₹{discountTotal}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-[#3b2d24]">
                  {shippingFee === 0 ? <span className="text-[#2e7d32]">FREE (₹1000+)</span> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#ebdcd0] flex justify-between items-center text-lg font-bold text-[#3b2d24]">
                <span>Total Amount</span>
                <span className="font-serif text-2xl text-[#4a3b32]">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Order...</span>
              ) : (
                <>
                  <span>Submit Order ({paymentMethod === 'razorpay' ? 'Razorpay / Online' : 'Pay Later'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-[#8c7868] text-center italic">
              Order receipt will be emailed immediately to your email address!
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
