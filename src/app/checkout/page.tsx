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
  Tag,
  AlertCircle,
  Lock,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { cart, subtotal, discountTotal, shippingFee, total, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'request'>('razorpay');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    instagramUsername: '',
    deliveryAddress: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    customerNotes: '',
    giftMessage: '',
    preferredContact: 'WhatsApp' as 'WhatsApp' | 'Phone' | 'Email' | 'Instagram',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [upiCopied, setUpiCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyUpi = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'FIRST10') {
      const discount = Math.round((subtotal * 10) / 100);
      setAppliedCoupon('FIRST10');
      setCouponDiscount(discount);
      setCouponMessage('🎉 Coupon FIRST10 applied: 10% discount saved!');
    } else if (clean === 'COZY15') {
      const discount = Math.round((subtotal * 15) / 100);
      setAppliedCoupon('COZY15');
      setCouponDiscount(discount);
      setCouponMessage('🎉 Coupon COZY15 applied: 15% discount saved!');
    } else {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponMessage('Invalid or expired coupon code. Try FIRST10 or COZY15.');
    }
  };

  const effectiveTotal = Math.max(0, total - couponDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (
      !formData.customerName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.deliveryAddress.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all required contact and delivery address fields.');
      return;
    }

    setLoading(true);

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

    try {
      if (paymentMethod === 'razorpay') {
        // ── Razorpay Online Flow ───────────────────────────────────
        // 1. Create order on server (recalculates prices from DB)
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            items,
            couponCode: appliedCoupon,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          setError(orderData.error || 'Failed to initiate Razorpay checkout.');
          setLoading(false);
          return;
        }

        const isScriptLoaded = await loadRazorpayScript();

        if (isScriptLoaded && window.Razorpay && !orderData.simulated) {
          // Open authentic Razorpay Checkout popup
          const options = {
            key: orderData.key,
            amount: orderData.razorpayOrder.amount,
            currency: 'INR',
            name: 'The Little Cozy Moonshine',
            description: `Order ${orderData.orderId}`,
            image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=200&q=80',
            order_id: orderData.razorpayOrder.id,
            handler: async function (response: any) {
              setLoading(true);
              // Verify signature on server
              const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderData.orderId,
                }),
              });

              const verifyData = await verifyRes.json();
              setLoading(false);

              if (verifyData.success) {
                setSubmittedOrder(verifyData.order || { id: orderData.orderId, ...formData });
                clearCart();
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              } else {
                setError(verifyData.error || 'Payment verification failed.');
              }
            },
            prefill: {
              name: formData.customerName,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#4a3b32',
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (resp: any) {
            setError(`Payment Failed: ${resp.error?.description || 'Transaction was declined.'}`);
            setLoading(false);
          });
          rzp.open();
          return;
        } else {
          // Test/dev mode simulation: verify directly so checkout completes smoothly
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderData.razorpayOrder.id,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'simulated_test_signature',
              orderId: orderData.orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSubmittedOrder(verifyData.order || { id: orderData.orderId, ...formData });
            clearCart();
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } else {
            setError(verifyData.error || 'Payment failed.');
          }
        }
      } else {
        // ── Order Request / Pay Later Flow ─────────────────────────
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
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else {
          setError(data.error || 'Failed to submit order request. Please try again.');
        }
      }
    } catch (err: any) {
      setError('Checkout error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS CONFIRMATION SCREEN ──────────────────────────────────
  if (submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#b87333] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#e8f5e9] text-[#2e7d32] rounded-full mx-auto flex items-center justify-center shadow">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-[#f5eee6] text-[#b87333] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Order Confirmed & Receipt Dispatched!
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24] mt-2">
              Thank You, {submittedOrder.customerName}!
            </h1>
            <p className="text-sm text-[#7a6858] mt-2 max-w-md mx-auto">
              Your handmade candle & resin decor order has been confirmed at <strong>The Little Cozy Moonshine</strong>. An email receipt was sent to <strong>{submittedOrder.email}</strong>.
            </p>
          </div>

          {/* Unique Order ID Banner */}
          <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ebdcd0] max-w-md mx-auto space-y-1">
            <div className="text-xs text-[#8c7868] uppercase font-bold tracking-wider">
              Your Unique Order ID
            </div>
            <div className="font-serif text-2xl font-bold text-[#b87333]">
              {submittedOrder.id}
            </div>
            <div className="text-[11px] text-[#7a6858]">
              Date: {new Date(submittedOrder.createdAt || Date.now()).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="bg-[#f5eee6] p-6 rounded-2xl border border-[#ebdcd0] text-left text-xs sm:text-sm space-y-2.5 text-[#4a3b32]">
            <h3 className="font-serif font-bold text-base text-[#3b2d24] border-b border-[#ebdcd0] pb-2">
              Studio Preparation & Delivery Next Steps
            </h3>
            <p className="leading-relaxed">
              1. <strong>Handcrafting:</strong> Your candles and resin crafts are being cured, polished, and packaged safely.
            </p>
            <p className="leading-relaxed">
              2. <strong>Express Dispatch:</strong> Once ready, your parcel will be handed to our express courier partner with live SMS/WhatsApp tracking.
            </p>
            <p className="leading-relaxed">
              3. <strong>Direct Studio Assistance:</strong> Need changes? Call or WhatsApp us directly at <strong>+91 8341790329</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track?orderId=${submittedOrder.id}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-1.5 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Status</span>
            </Link>

            <a
              href={`https://wa.me/918341790329?text=${encodeURIComponent(
                `Hi! I placed Order ${submittedOrder.id} on your website. Customer: ${submittedOrder.customerName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Studio (+91 8341790329)</span>
            </a>

            <Link
              href="/catalogue"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#4a3b32] border border-[#d6c8b8] hover:bg-[#f5eee6] font-bold text-xs rounded-full shadow-sm flex items-center justify-center transition-all"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ── MAIN CHECKOUT FORM SCREEN ────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858]">
          Free Express Shipping across India on orders above <strong>₹1000</strong>!
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Checkout Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Delivery, Contact, Payment */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
          
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3 flex items-center justify-between">
            <span>1. Contact & Delivery Details</span>
            <span className="text-xs text-red-500 font-sans font-normal">* All fields required</span>
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
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. 8341790329"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Email Address (for receipt) *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. kavya@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">Instagram Handle (Optional)</label>
              <input
                type="text"
                name="instagramUsername"
                placeholder="e.g. @kavya_candles"
                value={formData.instagramUsername}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4a3b32] mb-1">Complete Street / Delivery Address *</label>
            <textarea
              name="deliveryAddress"
              rows={2}
              required
              placeholder="Flat/House No., Building Name, Street, Landmark"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
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
                placeholder="e.g. 500034"
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
            {/* Razorpay Online */}
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
                <span>Razorpay (UPI / Cards / Netbanking)</span>
              </div>
              <p className="text-[11px] text-[#7a6858] mt-1">
                Instant payment via Google Pay, PhonePe, Paytm, Cards, or Netbanking. 100% secure.
              </p>
            </div>

            {/* Pay Later / Request */}
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
                <span>Pay on Confirmation (WhatsApp / COD)</span>
              </div>
              <p className="text-[11px] text-[#7a6858] mt-1">
                Submit order request now. We call/WhatsApp you to confirm details before payment.
              </p>
            </div>
          </div>

          {/* Quick Studio UPI Handles */}
          <div className="bg-[#fff9e6] p-4 rounded-2xl border border-[#ffe599] space-y-2 text-xs text-[#3b2d24]">
            <div className="flex items-center space-x-2 font-bold text-[#b87333]">
              <QrCode className="w-4 h-4" />
              <span>Studio Direct UPI Handles (Copy for direct payment):</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copyUpi('8341790329@okicici')}
                className="px-3 py-1.5 bg-white border border-[#d6c8b8] rounded-lg font-bold flex items-center space-x-1 hover:bg-[#f5eee6]"
              >
                <span>UPI: 8341790329@okicici</span>
                {upiCopied ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5 text-[#8c7868]" />}
              </button>
              <button
                type="button"
                onClick={() => copyUpi('7075905496@ybl')}
                className="px-3 py-1.5 bg-white border border-[#d6c8b8] rounded-lg font-bold flex items-center space-x-1 hover:bg-[#f5eee6]"
              >
                <span>UPI: 7075905496@ybl</span>
                {upiCopied ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5 text-[#8c7868]" />}
              </button>
            </div>
          </div>

          {/* Special Notes & Gift Message */}
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3 pt-2">
            3. Gift Message & Contact Preference
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                Gift Card Message (Optional - Handwritten by studio)
              </label>
              <input
                type="text"
                name="giftMessage"
                placeholder="e.g. Happy Birthday Priya! Wishing you a cozy year ahead."
                value={formData.giftMessage}
                onChange={handleChange}
                className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                  Delivery / Customization Notes
                </label>
                <textarea
                  name="customerNotes"
                  rows={2}
                  placeholder="Special instructions, ribbon color, or scent requests..."
                  value={formData.customerNotes}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                  Preferred Contact Method
                </label>
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                >
                  <option value="WhatsApp">WhatsApp Message (+91 {formData.phone || '8341790329'})</option>
                  <option value="Phone">Direct Phone Call</option>
                  <option value="Email">Email Communication</option>
                  <option value="Instagram">Instagram Direct Message</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Summary Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3">
              Order Summary ({cart.length})
            </h2>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#f5eee6]"
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div>
                      <div className="font-bold text-[#3b2d24] line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-[#8c7868]">
                        Qty: {item.quantity} {item.variant ? `(${item.variant.name})` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-[#4a3b32] whitespace-nowrap">
                    ₹{item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-[#ebdcd0]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. FIRST10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-2 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs uppercase text-[#3b2d24] font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <div
                  className={`text-[11px] mt-1.5 font-medium ${
                    appliedCoupon ? 'text-[#2e7d32]' : 'text-red-600'
                  }`}
                >
                  {couponMessage}
                </div>
              )}
            </div>

            {/* Calculation Breakdown */}
            <div className="pt-3 border-t border-[#ebdcd0] space-y-2 text-xs text-[#5c4a3e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Product Discount Saved</span>
                  <span className="font-bold">-₹{discountTotal}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Coupon ({appliedCoupon})</span>
                  <span className="font-bold">-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-bold text-[#3b2d24]">
                  {shippingFee === 0 ? (
                    <span className="text-[#2e7d32]">FREE (₹1000+)</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#ebdcd0] flex justify-between items-center text-lg font-bold text-[#3b2d24]">
                <span>Total Amount</span>
                <span className="font-serif text-2xl text-[#4a3b32]">
                  ₹{effectiveTotal}
                </span>
              </div>
            </div>

            {/* Order Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ₹{effectiveTotal} via {paymentMethod === 'razorpay' ? 'Razorpay' : 'Confirmation'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-[#8c7868]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Razorpay 256-bit SSL encryption • Official studio receipt sent</span>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
