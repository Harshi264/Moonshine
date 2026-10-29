import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, Flame, ShieldCheck, Lock, Truck, HelpCircle, FileText } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export const Footer = () => {
  return (
    <footer className="bg-[#2d241e] text-[#e8ded3] pt-16 pb-10 border-t-4 border-[#b87333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 mb-10 border-b border-[#473930] text-center sm:text-left">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#382d25]/60 border border-[#473930]">
            <div className="w-10 h-10 rounded-full bg-[#b87333]/20 text-[#e6c594] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Razorpay Secure</div>
              <div className="text-[10px] text-[#b8a798]">UPI, Cards, Netbanking</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#382d25]/60 border border-[#473930]">
            <div className="w-10 h-10 rounded-full bg-[#b87333]/20 text-[#e6c594] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Free Express Shipping</div>
              <div className="text-[10px] text-[#b8a798]">On all orders above ₹1000</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#382d25]/60 border border-[#473930]">
            <div className="w-10 h-10 rounded-full bg-[#b87333]/20 text-[#e6c594] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Soy Wax</div>
              <div className="text-[10px] text-[#b8a798]">Eco-friendly, lead-free wicks</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#382d25]/60 border border-[#473930]">
            <div className="w-10 h-10 rounded-full bg-[#b87333]/20 text-[#e6c594] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Hyderabad Handmade</div>
              <div className="text-[10px] text-[#b8a798]">Artisanal crafted with love</div>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#473930]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center text-white shadow">
                <Flame className="w-6 h-6 text-[#f7f3ed]" />
              </div>
              <span className="font-serif text-xl font-bold text-[#faf7f2]">
                The Little Cozy Moonshine
              </span>
            </div>
            <p className="text-sm text-[#b8a798] leading-relaxed">
              Artisanal hand-poured soy wax candles and crystal resin crafts created with love in Hyderabad. Bringing warm ambiance, botanical fragrances, and aesthetic handmade magic into your cozy home.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://www.instagram.com/thelittlecozymoonshine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#40342b] hover:bg-[#b87333] text-[#e8ded3] hover:text-white flex items-center justify-center transition-colors shadow"
                title="Follow on Instagram @thelittlecozymoonshine"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:thelittlecozymoonshine@gmail.com"
                className="w-9 h-9 rounded-full bg-[#40342b] hover:bg-[#b87333] text-[#e8ded3] hover:text-white flex items-center justify-center transition-colors shadow"
                title="Email Studio"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:8341790329"
                className="w-9 h-9 rounded-full bg-[#40342b] hover:bg-[#b87333] text-[#e8ded3] hover:text-white flex items-center justify-center transition-colors shadow"
                title="Call Studio"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#f7f3ed] border-b border-[#473930] pb-2 inline-block">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-[#b8a798]">
              <li>
                <Link href="/catalogue?category=candles" className="hover:text-[#e6c594] transition-colors">
                  🕯️ Scented Soy Candles
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=resin-crafts" className="hover:text-[#e6c594] transition-colors">
                  ✨ Resin Coasters & Vanity Trays
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=customized-products" className="hover:text-[#e6c594] transition-colors">
                  🌸 Personalized Flower Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=gift-sets" className="hover:text-[#e6c594] transition-colors">
                  🎁 Festive & Birthday Hampers
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=sale" className="hover:text-[#e6c594] transition-colors font-medium text-[#e6c594]">
                  🔥 Limited-Time Special Offers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#e6c594] transition-colors text-xs text-[#e6c594]">
                  🌸 Request Custom Bulk Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Legal Policies */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#f7f3ed] border-b border-[#473930] pb-2 inline-block">
              Customer Care & Policies
            </h3>
            <ul className="space-y-2 text-sm text-[#b8a798]">
              <li>
                <Link href="/track" className="hover:text-[#e6c594] transition-colors font-semibold text-[#e6c594]">
                  📦 Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#e6c594] transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#e6c594] transition-colors">
                  Refund, Return & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#e6c594] transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#e6c594] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#e6c594] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/candle-care" className="hover:text-[#e6c594] transition-colors">
                  Candle Care & Safety Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#f7f3ed] border-b border-[#473930] pb-2 inline-block">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm text-[#b8a798]">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-[#b87333] mt-1 shrink-0" />
                <a href="mailto:thelittlecozymoonshine@gmail.com" className="hover:text-white transition-colors">
                  thelittlecozymoonshine@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#b87333] mt-1 shrink-0" />
                <div>
                  <a href="tel:8341790329" className="hover:text-white transition-colors font-semibold block">
                    📞 +91 8341790329 (Primary & WhatsApp)
                  </a>
                  <a href="https://wa.me/917075905496" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors block text-xs mt-0.5">
                    💬 +91 7075905496 (Secondary WhatsApp)
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#b87333] mt-1 shrink-0" />
                <span>Banjara Hills, Hyderabad, Telangana 500034, India</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center space-x-1 text-xs text-[#a39080] hover:text-white underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Store Admin Login Portal</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#99887a] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} The Little Cozy Moonshine. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-[#c2b2a3]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#d9534f] fill-current" />
            <span>for candle & resin lovers across India</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
