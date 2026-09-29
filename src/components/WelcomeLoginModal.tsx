'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import {
  X,
  Flame,
  Phone,
  Mail,
  User,
  LogIn,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export function WelcomeLoginModal() {
  const { customer, loginCustomer } = useCustomerAuth();

  const [showModal, setShowModal] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (customer) return; // Already logged in
    const alreadyShown = sessionStorage.getItem('moonshine_welcome_shown');
    const savedCustomer = localStorage.getItem('moonshine_customer');
    if (!alreadyShown && !savedCustomer) {
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem('moonshine_welcome_shown', '1');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [customer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!identifier.trim()) {
      setLoginError(`Please enter your ${authMethod === 'phone' ? 'phone number' : 'email address'}.`);
      return;
    }
    setLoginLoading(true);
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
        setLoginSuccess(true);
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setLoginError(data.error || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setLoginError('Connection error: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  if (!showModal || customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2d241e]/60 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#ebdcd0] w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Decorative top gradient bar */}
        <div className="bg-gradient-to-r from-[#4a3b32] via-[#8c5e3c] to-[#b87333] h-1.5" />

        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c7868] hover:text-[#3b2d24] hover:bg-[#f5eee6] transition-colors z-10"
          aria-label="Close welcome modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-[#f5eee6] to-[#ebdcd0] text-[#b87333] rounded-2xl mx-auto flex items-center justify-center shadow-sm">
              <Flame className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">
              Welcome to Moonshine! 🕯️
            </h2>
            <p className="text-xs text-[#7a6858] leading-relaxed max-w-xs mx-auto">
              Sign in to track orders & get personalized updates.{' '}
              <strong>Completely optional</strong> — you can always shop as a guest!
            </p>
          </div>

          {loginSuccess ? (
            <div className="py-6 text-center space-y-3 animate-fadeIn">
              <CheckCircle className="w-12 h-12 text-[#2e7d32] mx-auto" />
              <p className="font-bold text-[#2e7d32] text-sm">You're signed in! ✨</p>
              <p className="text-xs text-[#7a6858]">Enjoy shopping at The Little Cozy Moonshine!</p>
            </div>
          ) : (
            <>
              {/* Toggle Phone/Email */}
              <div className="grid grid-cols-2 p-1 bg-[#faf7f2] rounded-full border border-[#ebdcd0] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('phone'); setIdentifier(''); setLoginError(''); }}
                  className={`py-2.5 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
                    authMethod === 'phone' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setIdentifier(''); setLoginError(''); }}
                  className={`py-2.5 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
                    authMethod === 'email' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs text-center font-semibold">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]/40 transition-all"
                  />
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                </div>

                <div className="relative">
                  <input
                    type={authMethod === 'phone' ? 'tel' : 'email'}
                    required
                    placeholder={authMethod === 'phone' ? 'Phone Number *' : 'Email Address *'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]/40 transition-all"
                  />
                  {authMethod === 'phone'
                    ? <Phone className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                    : <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
                  }
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loginLoading ? 'Signing in…' : 'Sign In to Account'}</span>
                </button>
              </form>

              <div className="text-center space-y-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-sm font-semibold text-[#7a6858] hover:text-[#4a3b32] underline underline-offset-2 transition-colors"
                >
                  Continue as Guest — Skip Login →
                </button>
                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#9c8878]">
                  <ShieldCheck className="w-3 h-3 text-[#2e7d32]" />
                  <span>No password needed. Your data is safe.</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
