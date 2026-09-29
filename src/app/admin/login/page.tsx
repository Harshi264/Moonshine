'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, Flame } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('moonshine_admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid password.');
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d241e] flex items-center justify-center p-4">
      <div className="bg-[#faf7f2] max-w-md w-full p-8 rounded-3xl border-2 border-[#b87333] shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#4a3b32] text-[#b87333] rounded-full mx-auto flex items-center justify-center shadow">
            <Flame className="w-8 h-8 text-[#e6c594]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-[#7a6858]">
            Protected dashboard for The Little Cozy Moonshine studio owner.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4a3b32] mb-1">
              Admin Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7868]" />
            </div>
            <p className="text-[10px] text-[#8c7868] mt-1 italic">
              Default password: <code className="bg-[#ebdcd0] px-1 rounded text-[#4a3b32]">moonshine2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Log In to Studio Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-[#7a6858] hover:text-[#3b2d24] underline">
            ← Return to Public Website
          </a>
        </div>

      </div>
    </div>
  );
}
