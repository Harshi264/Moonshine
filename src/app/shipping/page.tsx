import React from 'react';
import { Truck, Clock, ShieldCheck, CheckCircle, MapPin, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping & Delivery Policy | The Little Cozy Moonshine',
  description: 'Learn about our shipping coverage across India, free shipping threshold over ₹1000, express couriers, and delivery timelines.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Pan-India Delivery</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858] max-w-xl mx-auto">
          Every soy candle, resin craft, and personalized gift hamper is handcrafted and packed with maximum care from our Hyderabad studio.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#4a3b32] leading-relaxed">
        
        {/* Key Highlights Card */}
        <div className="bg-[#4a3b32] text-white p-6 sm:p-8 rounded-3xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-xs text-[#e6c594] uppercase font-bold tracking-wider">Free Shipping</div>
            <div className="font-serif text-2xl font-bold text-white">Above ₹1000</div>
            <p className="text-[11px] text-gray-300">Standard ₹70 fee for orders under ₹1000</p>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-[#e6c594] uppercase font-bold tracking-wider">Studio Processing</div>
            <div className="font-serif text-2xl font-bold text-white">1 - 3 Days</div>
            <p className="text-[11px] text-gray-300">Cured & inspected before dispatch</p>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-[#e6c594] uppercase font-bold tracking-wider">Express Courier</div>
            <div className="font-serif text-2xl font-bold text-white">2 - 5 Days</div>
            <p className="text-[11px] text-gray-300">Shiprocket, Delhivery & Bluedart</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
          
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#b87333]" />
              <span>1. Delivery Coverage & Serviceability</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4a3e]">
              We ship to all serviceable postal pincodes across India, including Telangana, Andhra Pradesh, Maharashtra, Karnataka, Tamil Nadu, Delhi NCR, and all other states & Union Territories.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#b87333]" />
              <span>2. Estimated Delivery Timelines</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcd0]">
                <strong>Hyderabad & Secunderabad:</strong> 1 – 2 business days
              </div>
              <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcd0]">
                <strong>South India Metro Cities:</strong> 2 – 4 business days
              </div>
              <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcd0]">
                <strong>Rest of India Metros & Tier 2:</strong> 3 – 5 business days
              </div>
              <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcd0]">
                <strong>Remote / North-East Locations:</strong> 5 – 7 business days
              </div>
            </div>
            <p className="text-[11px] text-[#8c7868]">
              *Custom-engraved resin bookmarks and personalized gift hampers require 24–48 hours extra curing time before dispatch.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#b87333]" />
              <span>3. Fragile Eco-Packaging Guarantee</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4a3e]">
              Candles in luxury glass jars and artisanal resin crafts are delicate items. We use multilayered protective honey-comb cushioning, bubble padding, and rigid corrugated shipping boxes. Every parcel is taped securely with "Fragile — Handle With Care" labels.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
            <h2 className="font-serif text-xl font-bold text-[#3b2d24] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#b87333]" />
              <span>4. Tracking Your Order</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4a3e]">
              As soon as your parcel is dispatched from our Hyderabad studio, you will receive an email and WhatsApp message with your tracking link and courier AWB number. You can also track your live status anytime on our website at{' '}
              <Link href="/track" className="text-[#b87333] font-bold underline">
                Track Order Page
              </Link>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
