import React from 'react';
import { FileText, ShieldCheck, Scale, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | The Little Cozy Moonshine',
  description: 'Terms and conditions governing the purchase of handcrafted soy candles, resin crafts, and custom hampers from The Little Cozy Moonshine.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858]">
          Effective Date: October 2026 • The Little Cozy Moonshine, Hyderabad, Telangana
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-8 text-sm text-[#4a3b32] leading-relaxed">
        
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">1. Acceptance of Terms</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            By browsing, accessing, or purchasing products on this website (<strong>thelittlecozymoonshine.in</strong> or affiliated domains), you agree to comply with and be bound by these Terms and Conditions, our Privacy Policy, and our Refund & Shipping Policies.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">2. Handmade Artisanal Nature of Products</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            All our candles are 100% hand-poured with natural soy wax and lead-free cotton wicks. All resin bookmarks, coasters, and vanity trays are individually crafted using dried botanicals and gold/silver flakes.
          </p>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Because each piece is made by human hands rather than mass-produced in a factory, minor variations in petal placement, color hue, or surface frosting on pure soy wax are natural characteristics of artisanal crafts and do not constitute product defects.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">3. Pricing, Orders & Payment</h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li>All prices listed on the website are in <strong>Indian Rupees (INR - ₹)</strong> and inclusive of all applicable taxes.</li>
            <li>We reserve the right to modify prices or discontinue products at any time without prior notice.</li>
            <li>Online payments are securely processed through Razorpay. You agree that the transaction is subject to the rules and policies of the payment gateway and your issuing bank.</li>
            <li>In the event of an unintentional pricing typographical error, we reserve the right to cancel the order and provide a full refund.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">4. Product Usage & Candle Safety Warning</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Candles involve an open flame. By purchasing, the customer acknowledges personal responsibility for candle safety:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li>Never leave a burning candle unattended. Keep out of reach of children and domestic pets.</li>
            <li>Always trim candle wicks to 1/4 inch before each burn to prevent excessive soot or flickering.</li>
            <li>Burn on a stable, heat-resistant surface away from curtains, drafts, and flammable objects.</li>
            <li>Resin items (coasters, vanity trays) are meant for decorative and home use; do not expose them to temperatures exceeding 60°C or place them in dishwashers/microwaves.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">5. Intellectual Property</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            All website designs, branding, logos, product photographs, text content, and graphics are the exclusive property of <strong>The Little Cozy Moonshine</strong>. Unauthorized reproduction, copying, or commercial exploitation is strictly prohibited without written consent.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">6. Governing Law & Jurisdiction</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Hyderabad, Telangana, India</strong>.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">7. Studio Contact Information</h2>
          <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] text-xs space-y-1 text-[#4a3b32]">
            <div><strong>Business Name:</strong> The Little Cozy Moonshine</div>
            <div><strong>Email:</strong> thelittlecozymoonshine@gmail.com</div>
            <div><strong>Phone / WhatsApp:</strong> +91 8341790329</div>
            <div><strong>Registered Address:</strong> Banjara Hills, Hyderabad, Telangana 500034, India</div>
          </div>
        </div>

      </div>
    </div>
  );
}
