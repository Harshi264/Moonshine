import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, Clock, ShieldCheck, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund, Return & Cancellation Policy | The Little Cozy Moonshine',
  description: 'Understand our return and refund guidelines for handmade soy candles, resin crafts, transit damages, and order cancellations.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <RotateCcw className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Hassle-Free Resolution</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Refund, Return & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858] max-w-xl mx-auto">
          We take enormous pride in every handcrafted item we pour. If anything goes wrong with your delivery, we are here to make it right.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-8 text-sm text-[#4a3b32] leading-relaxed">
        
        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] space-y-1">
            <div className="text-xs text-[#b87333] uppercase font-bold">Transit Damage</div>
            <div className="font-serif text-lg font-bold text-[#3b2d24]">100% Replacement</div>
            <p className="text-[11px] text-[#7a6858]">With parcel unboxing video within 48h</p>
          </div>
          <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] space-y-1">
            <div className="text-xs text-[#b87333] uppercase font-bold">Order Cancellation</div>
            <div className="font-serif text-lg font-bold text-[#3b2d24]">Before Dispatch</div>
            <p className="text-[11px] text-[#7a6858]">Instant full refund initiated</p>
          </div>
          <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] space-y-1">
            <div className="text-xs text-[#b87333] uppercase font-bold">Refund Processing</div>
            <div className="font-serif text-lg font-bold text-[#3b2d24]">5 – 7 Business Days</div>
            <p className="text-[11px] text-[#7a6858]">Directly back to your bank / UPI</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">1. Damaged or Defective Items in Transit</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Because our scented candles are made with delicate glass containers and artisanal resin crafts are fragile, we pack every parcel with multiple layers of honeycomb foam, air bubble padding, and rigid boxes.
          </p>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            In the rare event that your product arrives cracked, broken, or defective due to rough courier handling:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li>Please record a continuous, unedited <strong>unboxing video</strong> when opening your parcel.</li>
            <li>Send the video and photos of the damaged item along with your Order ID to our WhatsApp at <strong>+91 8341790329</strong> or email <strong>thelittlecozymoonshine@gmail.com</strong> within <strong>48 hours</strong> of delivery.</li>
            <li>Once verified, we will immediately dispatch a <strong>free brand-new replacement</strong> at zero additional charge, or issue a full refund as preferred.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">2. Order Cancellation Policy</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            <strong>Before Dispatch:</strong> You can cancel any standard order free of charge by contacting us via phone or WhatsApp before the order status changes to "Shipped".
          </p>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            <strong>After Dispatch:</strong> Once a parcel is picked up by the courier partner, an in-transit shipment cannot be cancelled.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">3. Personalized & Bespoke Orders</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Items that feature customized personal names, custom quotes, specific color combinations, or personalized gift hampers (such as custom resin bookmarks and etched candles) are handcrafted uniquely for you. These items cannot be cancelled or returned once crafting has begun, except in case of damage during transit.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">4. Refund Timelines (Razorpay)</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Approved refunds are credited back to the original source account (UPI, Debit Card, Credit Card, or Net Banking) via Razorpay. It typically takes <strong>5 to 7 business days</strong> to reflect in your bank account depending on your issuing bank.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">5. Need Help With Your Order?</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Have an issue with your package? Our friendly studio team is here to assist you:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/918341790329?text=Hi!%20I%20have%20an%20issue%20with%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] text-white rounded-full text-xs font-bold flex items-center justify-center space-x-2"
            >
              <span>WhatsApp Us: +91 8341790329</span>
            </a>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-[#4a3b32] text-white rounded-full text-xs font-bold flex items-center justify-center space-x-2"
            >
              <span>Submit Contact Form</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
