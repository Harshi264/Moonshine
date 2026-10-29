import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Home, ShoppingBag, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 animate-fadeIn">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-xl text-center space-y-6">
        
        {/* Animated Studio Flame */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-[#f5eee6] flex items-center justify-center">
          <Flame className="w-10 h-10 text-[#b87333] animate-bounce" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#4a3b32] text-white text-[11px] font-bold flex items-center justify-center shadow">
            404
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#b87333]">
            Oops! Candle Extinguished
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#7a6858] leading-relaxed">
            The page you are looking for has melted away or moved to a different shelf. Let’s guide you back to our cozy studio collections!
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>

          <Link
            href="/catalogue"
            className="w-full py-3.5 bg-[#faf7f2] hover:bg-[#f5eee6] text-[#4a3b32] border border-[#d6c8b8] font-bold text-xs rounded-full flex items-center justify-center space-x-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#b87333]" />
            <span>Browse Scented Candles & Resin Art</span>
          </Link>

          <a
            href="https://wa.me/918341790329?text=Hi!%20I%20got%20lost%20on%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 text-[#25D366] hover:text-[#20bd5a] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Need Help? Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
