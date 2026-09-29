'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import {
  Phone,
  Mail,
  User,
  ArrowRight,
  Flame,
  ShieldCheck,
  Sparkles,
  Truck,
  Package,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomer } = useCustomerAuth();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${authMethod === 'phone' ? 'phone number' : 'email address'}.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/customer/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          name: name.trim(),
          isEmail: authMethod === 'email',
        }),
      });

      const data = await res.json();
      if (data.success && data.customer) {
        loginCustomer(data.customer);
        setSuccess(true);
        setTimeout(() => router.push('/account'), 1200);
      } else {
        setError(data.error || 'Failed to log in. Please try again.');
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: Package, text: 'Track all your orders in real-time' },
    { icon: Truck, text: 'Get live delivery status updates' },
    { icon: Star, text: 'Personalized product recommendations' },
    { icon: Sparkles, text: 'Exclusive member-only offers & deals' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-[#ebdcd0] bg-white">

        {/* Left Panel — Brand Side */}
        <div className="bg-gradient-to-br from-[#4a3b32] via-[#6e4e3b] to-[#b87333] p-8 sm:p-10 flex flex-col justify-between text-white">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#e6c594]" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-white leading-tight">The Little Cozy</p>
                <p className="font-serif text-lg font-bold text-[#e6c594] leading-tight">Moonshine</p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Your Cozy <br />
                <span className="text-[#e6c594]">Account Awaits</span>
              </h1>
              <p className="text-sm text-white/70 leading-relaxed">
                Sign in to access your orders, wishlist, and exclusive studio updates.
              </p>
            </div>

            {/* Perks List */}
            <div className="space-y-3 pt-2">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#e6c594]" />
                  </div>
                  <span className="text-sm text-white/85">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <div className="pt-8 text-xs text-white/50 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#e6c594]" />
            <span>No password required. No spam. Ever.</span>
          </div>
        </div>

        {/* Right Panel — Form Side */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">

          {success ? (
            <div className="text-center space-y-4 py-8 animate-fadeIn">
              <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">You're in! ✨</h2>
              <p className="text-sm text-[#7a6858]">Welcome back! Redirecting to your account…</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">Sign In</h2>
                <p className="text-xs text-[#8c7868]">Enter your phone or email — no password needed.</p>
              </div>

              {/* Auth Method Toggle */}
              <div className="grid grid-cols-2 p-1 bg-[#faf7f2] rounded-full border border-[#ebdcd0] text-xs font-bold">
                <button
                  type="button"
                  id="toggle-phone"
                  onClick={() => { setAuthMethod('phone'); setIdentifier(''); setError(''); }}
                  className={`py-2.5 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
                    authMethod === 'phone' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone Number</span>
                </button>
                <button
                  type="button"
                  id="toggle-email"
                  onClick={() => { setAuthMethod('email'); setIdentifier(''); setError(''); }}
                  className={`py-2.5 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
                    authMethod === 'email' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center animate-fadeIn">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4a3b32]">
                    Your Full Name <span className="text-[#8c7868] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-name"
                      type="text"
                      placeholder="e.g. Ananya Roy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]/40 focus:border-[#b87333] transition-all"
                    />
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                  </div>
                </div>

                {/* Identifier Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4a3b32]">
                    {authMethod === 'phone' ? 'Mobile / Phone Number' : 'Email Address'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customer-identifier"
                      type={authMethod === 'phone' ? 'tel' : 'email'}
                      required
                      placeholder={authMethod === 'phone' ? 'e.g. 8341790329' : 'e.g. you@example.com'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]/40 focus:border-[#b87333] transition-all"
                    />
                    {authMethod === 'phone' ? (
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                    ) : (
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  id="login-submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  <span>{loading ? 'Signing In…' : 'Continue to My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-px bg-[#ebdcd0]" />
                <span className="text-xs text-[#8c7868] font-medium">or</span>
                <div className="flex-1 h-px bg-[#ebdcd0]" />
              </div>

              {/* Guest Option */}
              <div className="text-center space-y-2">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-[#b87333] hover:text-[#4a3b32] transition-colors group"
                >
                  <span>Continue Shopping as Guest</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <p className="text-[11px] text-[#9c8878]">
                  No account needed to browse or place orders.
                </p>
              </div>

              <div className="bg-[#faf7f2] rounded-2xl p-3 flex items-start space-x-2.5 border border-[#ebdcd0]">
                <ShieldCheck className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#7a6858] leading-relaxed">
                  <strong className="text-[#3b2d24]">Guest Checkout is always available!</strong> Login is optional — it just helps you track your orders and get faster support.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
