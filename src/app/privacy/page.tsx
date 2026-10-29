import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Data Security | The Little Cozy Moonshine',
  description: 'Our privacy policy explains how we collect, protect, and handle your personal information and online payment security.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
          <span>Data Protection & Trust</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b2d24]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858]">
          Last Updated: October 2026 • The Little Cozy Moonshine Studio, Hyderabad
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-8 text-sm text-[#4a3b32] leading-relaxed">
        
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">1. Introduction & Overview</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            Welcome to <strong>The Little Cozy Moonshine</strong> ("we", "our", or "us"). We specialize in handcrafted eco-friendly soy wax candles, artisanal resin art, and personalized gift hampers based in Hyderabad, Telangana, India. We respect your privacy and are committed to protecting any personal information you share with us through our website.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">2. Information We Collect</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            When you browse our studio catalog, place an order, or contact us via our contact form, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li><strong>Contact Details:</strong> Full name, phone/WhatsApp number, and email address.</li>
            <li><strong>Delivery Information:</strong> Complete street address, city, state, and postal pincode.</li>
            <li><strong>Custom Order Specifications:</strong> Custom names, initials, quote messages, and reference photos uploaded for personalized bookmarks, coasters, or gift hampers.</li>
            <li><strong>Technical Data:</strong> Browser type, IP address, and cookie identifiers used strictly for cart persistence and rate-limiting security.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24] flex items-center space-x-2">
            <Lock className="w-5 h-5 text-[#b87333]" />
            <span>3. Payment Gateway Security (Razorpay)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            All online transactions on our store (UPI, credit/debit cards, net banking, and wallets) are processed securely through <strong>Razorpay Software Private Limited</strong>, a RBI-authorized, PCI-DSS Level 1 compliant payment gateway.
          </p>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            <strong>We do not store or have access to your bank card numbers, CVV codes, or UPI MPINs.</strong> Razorpay encrypts your financial data using 256-bit AES encryption and tokenization standards.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">4. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li>Processing, handcrafting, and fulfilling your candle and resin decor orders.</li>
            <li>Sending automatic order receipts, shipping confirmations, and live courier tracking links via email or WhatsApp.</li>
            <li>Responding to your contact form inquiries and custom order design consultations.</li>
            <li>Protecting our website from spam, bot attacks, and fraudulent transactions.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">5. Data Sharing & Third Parties</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            We never sell, rent, or trade your personal information. We only share delivery details with trusted third-party partners strictly necessary to complete your order:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5c4a3e]">
            <li><strong>Logistics Partners:</strong> Courier companies (Shiprocket, Delhivery, India Post) to deliver packages to your doorstep.</li>
            <li><strong>Payment Gateways:</strong> Razorpay to process payments safely.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#f5eee6]">
          <h2 className="font-serif text-xl font-bold text-[#3b2d24]">6. Contact Privacy Officer</h2>
          <p className="text-xs sm:text-sm text-[#5c4a3e]">
            If you have questions about our privacy policy or wish to request data correction or deletion, please reach out to our studio:
          </p>
          <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] text-xs space-y-1.5">
            <div><strong>Studio:</strong> The Little Cozy Moonshine</div>
            <div><strong>Email:</strong> thelittlecozymoonshine@gmail.com</div>
            <div><strong>Phone / WhatsApp:</strong> +91 8341790329</div>
            <div><strong>Studio Address:</strong> Banjara Hills, Hyderabad, Telangana 500034, India</div>
          </div>
        </div>

      </div>
    </div>
  );
}
