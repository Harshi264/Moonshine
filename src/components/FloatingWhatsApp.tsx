'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Flame } from 'lucide-react';

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const primaryPhone = '8341790329';

  const promptPills = [
    'Custom order for bookmarks & candles',
    'Bulk hamper pricing for gifting',
    'Check order delivery timeline',
    'Recommend best-selling scents',
  ];

  const handleSend = (text?: string) => {
    const message = text || userMsg || 'Hi! I am reaching out from The Little Cozy Moonshine website.';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${primaryPhone}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Floating Chat Modal Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#ebdcd0] overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-[#4a3b32] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center text-white shadow">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm leading-tight">
                  The Little Cozy Moonshine
                </h3>
                <p className="text-[10px] text-green-300 font-medium">
                  Online • Studio Founder Direct
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#faf7f2] space-y-3">
            
            {/* Studio Welcome Bubble */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-[#ebdcd0] shadow-sm text-xs text-[#3b2d24] space-y-1.5">
              <p className="leading-relaxed">
                Hi there! 👋 Welcome to our cozy studio. Looking for a custom candle, personalized resin bookmark, or festival gift hamper?
              </p>
              <span className="text-[10px] text-[#8c7868] block text-right">
                Studio Assistant • Just now
              </span>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] uppercase font-bold text-[#8c7868] tracking-wider">
                Common Inquiries:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {promptPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => handleSend(pill)}
                    className="text-[11px] bg-white hover:bg-[#f5eee6] text-[#4a3b32] border border-[#d6c8b8] px-2.5 py-1 rounded-full text-left transition-colors font-medium shadow-2xs"
                  >
                    💬 {pill}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-[#ebdcd0] flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1 px-3 py-2 bg-[#faf7f2] border border-[#d6c8b8] rounded-full text-xs text-[#3b2d24] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow transition-all transform hover:scale-105 active:scale-95"
              title="Chat on WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/50"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border border-white"></span>
        </span>

        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        <span className="font-semibold text-xs sm:text-sm tracking-wide hidden sm:inline">
          Chat with Studio
        </span>
      </button>

    </div>
  );
};
