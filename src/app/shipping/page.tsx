import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Studio Policies & Shipping Information
        </h1>
        <p className="text-sm text-[#7a6858]">
          Everything you need to know about delivery timelines, custom order lead times, returns & privacy.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#4a3b32] leading-relaxed">
        
        {/* Shipping & Delivery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-[#b87333]">
            <Truck className="w-6 h-6" />
            <h2 className="font-serif text-xl font-bold text-[#3b2d24]">Shipping & Delivery Areas</h2>
          </div>
          <ul className="space-y-2.5 list-disc list-inside text-xs sm:text-sm text-[#5c4a3e]">
            <li><strong>Delivery Coverage:</strong> We ship across all major pincodes in India via express courier partners.</li>
            <li><strong>Processing & Preparation Time:</strong> Ready products ship in 2-3 business days. Custom candles and personalized resin crafts require 3-5 business days to cure perfectly.</li>
            <li><strong>Shipping Charges:</strong> FREE shipping on orders above ₹1500! Orders below ₹1500 carry a standard ₹70 delivery charge.</li>
            <li><strong>Estimated Transit Time:</strong> 2-4 days within Telangana & South India, 4-6 days for Rest of India.</li>
          </ul>
        </div>

        {/* Returns & Cancellations */}
        <div id="returns" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-[#b87333]">
            <RotateCcw className="w-6 h-6" />
            <h2 className="font-serif text-xl font-bold text-[#3b2d24]">Return & Cancellation Policy</h2>
          </div>
          <ul className="space-y-2.5 list-disc list-inside text-xs sm:text-sm text-[#5c4a3e]">
            <li><strong>Order Cancellation:</strong> You can cancel your order request before it enters the preparation phase by contacting us on WhatsApp/Phone.</li>
            <li><strong>Damaged / Defective Deliveries:</strong> Because our products are fragile handmade glass and resin items, we pack them with heavy protective bubble cushioning. If an item arrives damaged in transit, please share an unboxing video within 24 hours to receive a free replacement.</li>
            <li><strong>Customized Items:</strong> Bespoke items with personalized names or custom text cannot be returned unless damaged during transit.</li>
          </ul>
        </div>

        {/* Privacy Policy */}
        <div id="privacy" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-[#b87333]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="font-serif text-xl font-bold text-[#3b2d24]">Privacy Policy & Data Security</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            We respect your personal privacy. Customer phone numbers, email addresses, and delivery details collected during checkout are strictly used for confirming and delivering your order. We never sell or share your phone numbers publicly.
          </p>
        </div>

      </div>
    </div>
  );
}
