'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Phone, Mail, User, ArrowRight, Sparkles, Flame, ShieldCheck } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomer } = useCustomerAuth();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        router.push('/account');
      } else {
        setError(data.error || 'Failed to log in.');
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-[#f5eee6] text-[#b87333] rounded-full mx-auto flex items-center justify-center shadow">
          <Flame className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3b2d24]">
          Customer Account Login
        </h1>
        <p className="text-xs text-[#7a6858]">
          Log in with your email or phone number to view your orders, live delivery updates, and saved addresses.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
        
        {/* Toggle Phone vs Email */}
        <div className="grid grid-cols-2 p-1 bg-[#faf7f2] rounded-full border border-[#ebdcd0] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setIdentifier('');
              setError('');
            }}
            className={`py-2 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
              authMethod === 'phone' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone Number</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setIdentifier('');
              setError('');
            }}
            className={`py-2 rounded-full flex items-center justify-center space-x-1.5 transition-all ${
              authMethod === 'email' ? 'bg-[#4a3b32] text-white shadow' : 'text-[#7a6858] hover:text-[#3b2d24]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Address</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#4a3b32] mb-1">Your Full Name (Optional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ananya Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
              />
              <User className="absolute left-3 top-3.5 w-4 h-4 text-[#8c7868]" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#4a3b32] mb-1">
              {authMethod === 'phone' ? 'Mobile / Phone Number *' : 'Email Address *'}
            </label>
            <div className="relative">
              <input
                type={authMethod === 'phone' ? 'tel' : 'email'}
                required
                placeholder={authMethod === 'phone' ? 'e.g. 8341790329' : 'e.g. customer@example.com'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
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
            disabled={loading}
            className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Continue to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#ebdcd0] text-center text-[11px] text-[#7a6858]">
          <span className="flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>Optional Account — Guest Checkout is always allowed!</span>
          </span>
        </div>

      </div>
    </div>
  );
}
