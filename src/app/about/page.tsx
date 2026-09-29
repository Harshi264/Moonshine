import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#f5eee6] text-[#b87333] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Crafting Philosophy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Handcrafted with Love in Hyderabad
        </h1>
        <p className="text-base sm:text-lg text-[#6b584a] leading-relaxed">
          Welcome to <strong>The Little Cozy Moonshine</strong>. We are a small artisanal studio dedicated to creating hand-poured soy wax candles and crystal resin crafts that bring warmth, serenity, and luxury into everyday homes.
        </p>
      </div>

      {/* Grid Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-square">
          <img
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
            alt="Candle Pouring Process"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4 text-sm sm:text-base text-[#4a3b32] leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Why We Started
          </h2>
          <p>
            What began as a passion for peaceful evenings and warm ambiance quickly evolved into our boutique handmade brand. We believed that home fragrances should be pure, eco-friendly, and free from toxic paraffin wax.
          </p>
          <p>
            Every candle we make is poured in small batches using 100% natural soy wax, cotton wicks, and phthalate-free fragrance oils. Each resin coaster, tray, and bookmark is individually hand-cast with real pressed botanicals and gold leaf accents.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-bold text-[#3b2d24]">
            <div className="p-4 bg-[#f5eee6] rounded-2xl border border-[#ebdcd0]">
              🌿 100% Eco Soy Wax
            </div>
            <div className="p-4 bg-[#f5eee6] rounded-2xl border border-[#ebdcd0]">
              ✨ Hand-Poured Resin
            </div>
          </div>
        </div>
      </div>

      {/* Quality Commitment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 bg-[#f5eee6] text-[#b87333] rounded-full mx-auto flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3b2d24]">Clean & Eco Burning</h3>
          <p className="text-xs text-[#7a6858] leading-relaxed">
            Our candles burn soot-free and last up to 50% longer than traditional candles, leaving your room filled with gentle, soothing aromas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 bg-[#f5eee6] text-[#b87333] rounded-full mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3b2d24]">Artisanal Precision</h3>
          <p className="text-xs text-[#7a6858] leading-relaxed">
            No two pieces are identical! Each resin craft features real dried flowers, gold leafing, and unique fluid resin cells.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] space-y-3 shadow-sm text-center">
          <div className="w-12 h-12 bg-[#f5eee6] text-[#b87333] rounded-full mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3b2d24]">Personalized Touch</h3>
          <p className="text-xs text-[#7a6858] leading-relaxed">
            We love crafting custom orders for birthdays, weddings, anniversaries, and corporate hamper gifts with custom names.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#4a3b32] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold">Connect With Our Studio</h2>
        <p className="text-sm text-gray-300 max-w-md mx-auto">
          Follow our daily studio pours and process videos on Instagram @thelittlecozymoonshine.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="https://www.instagram.com/thelittlecozymoonshine"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[#b87333] hover:bg-[#a05f25] text-white font-bold text-xs rounded-full shadow flex items-center space-x-2"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @thelittlecozymoonshine</span>
          </a>
          <Link
            href="/catalogue"
            className="px-8 py-3.5 bg-white text-[#4a3b32] hover:bg-[#f5eee6] font-bold text-xs rounded-full shadow flex items-center space-x-2"
          >
            <span>Explore Studio Shop</span>
            <ArrowRight className="w-4 h-4 text-[#b87333]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
