import React from 'react';
import { Flame, Scissors, ShieldAlert, Sparkles, Wind, Sun, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Candle Care & Safety Guide | The Little Cozy Moonshine',
  description: 'Expert tips on how to burn 100% soy wax candles for maximum fragrance throw, clean burning, and safe home ambiance.',
};

export default function CandleCarePage() {
  const steps = [
    {
      icon: Flame,
      step: '01',
      title: 'The First Burn is Crucial (Wax Memory)',
      desc: 'When burning your new soy candle for the first time, allow it to burn for 2 to 3 hours until the melted wax pool reaches the glass edges. Soy wax has a "memory" — doing this prevents tunneling and ensures an even burn for the lifetime of the candle.',
    },
    {
      icon: Scissors,
      step: '02',
      title: 'Always Trim Your Wick to 1/4 Inch',
      desc: 'Before every lighting, trim the cotton wick to approximately 1/4 inch (6mm). This prevents high flickering flames, mushrooming, and soot residue, giving you a calm, clean, and longer-lasting burn.',
    },
    {
      icon: Wind,
      step: '03',
      title: 'Avoid Drafts, AC Vents & Ceiling Fans',
      desc: 'Keep burning candles away from open windows, ceiling fans, air conditioners, and busy walkways. Air drafts cause rapid, uneven burning, smoking wicks, and reduce scent dispersion.',
    },
    {
      icon: ShieldAlert,
      step: '04',
      title: 'Burn in 3–4 Hour Maximum Sessions',
      desc: 'Never burn a candle for more than 4 hours at a time. Extended burning can cause the jar to overheat and fragrance oils to vaporize too quickly. Extinguish, let it cool for 2 hours, trim the wick, and relight.',
    },
    {
      icon: Sun,
      step: '05',
      title: 'Store in Cool, Dark Place Away from Sunlight',
      desc: 'Natural soy wax is sensitive to UV light and heat. Store unused candles with lids closed in a cool, dark cupboard to preserve the essential and phthalate-free fragrance oils.',
    },
    {
      icon: Sparkles,
      step: '06',
      title: 'Resin Art & Coaster Care Guidelines',
      desc: 'Handmade resin coasters, bookmarks, and vanity trays should be wiped gently with a soft microfiber damp cloth. Avoid harsh chemicals, alcohol wipes, microwaves, dishwashers, and temperatures above 60°C.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Studio Wisdom & Longevity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Candle Care & Safety Guide
        </h1>
        <p className="text-xs sm:text-base text-[#7a6858] max-w-2xl mx-auto leading-relaxed">
          Follow our master studio guide to maximize the burn time, fragrance throw, and safety of your artisanal soy wax candles and resin creations.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#b87333] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] text-[#b87333] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#ebdcd0]">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3b2d24] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6b584a] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Golden Rules Banner */}
      <div className="bg-[#4a3b32] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-2 text-[#e6c594] text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>General Candle Safety Rules</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          The 4 Golden Safety Commandments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-200">
          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-[#e6c594] shrink-0 mt-0.5" />
            <span><strong>Never leave burning unattended:</strong> Always extinguish when leaving the room or going to sleep.</span>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-[#e6c594] shrink-0 mt-0.5" />
            <span><strong>Keep away from children & pets:</strong> Place on high, sturdy surfaces where paws or curious hands cannot reach.</span>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-[#e6c594] shrink-0 mt-0.5" />
            <span><strong>Burn on heat-resistant mats:</strong> Always keep on a coaster, tray, or plate to protect furniture from heat.</span>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-[#e6c594] shrink-0 mt-0.5" />
            <span><strong>Stop when 1/2 inch wax remains:</strong> Discontinue burning when 1/2 inch of wax is left to prevent jar thermal crack.</span>
          </div>
        </div>
      </div>

      {/* CTA to Shop */}
      <div className="text-center pt-4">
        <Link
          href="/catalogue?category=candles"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#b87333] hover:bg-[#8c5e3c] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Explore Scented Soy Candles</span>
        </Link>
      </div>

    </div>
  );
}
