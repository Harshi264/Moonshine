'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Flame, Sparkles, Truck, CreditCard, Gift, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Candles & Wax',
    question: 'What type of wax do you use in your candles?',
    answer:
      'We use 100% natural, biodegradable soy wax sourced sustainably. Soy wax burns cleaner, produces zero toxic black soot, and lasts 30-50% longer than commercial paraffin candles. Our wicks are made of 100% lead-free, unbleached cotton.',
  },
  {
    category: 'Candles & Wax',
    question: 'What is the burn time of your soy candles?',
    answer:
      'Our standard 180g amber jar candles burn for approximately 40 to 45 hours. Our luxury 300g glass candles offer up to 70 hours of burn time. To maximize burn time, always trim the wick to 1/4 inch before each lighting.',
  },
  {
    category: 'Candles & Wax',
    question: 'Why does my soy candle look slightly frosted or bumpy after burning?',
    answer:
      'Frosting or uneven surface texture after cooling is a hallmark of 100% pure soy wax without synthetic paraffin chemical additives! It does not affect candle scent throw or burning performance at all.',
  },
  {
    category: 'Custom Orders',
    question: 'Can I personalize a resin bookmark or coaster set with a name or quote?',
    answer:
      'Yes, absolutely! Personalized resin bookmarks and custom coasters are among our bestsellers. You can add your name, initials, wedding date, or favorite quote in calligraphy script or serif font with gold or silver foil flakes. Visit our Contact or Custom Order section to submit your request.',
  },
  {
    category: 'Custom Orders',
    question: 'Do you create bulk hampers for weddings, baby showers, or corporate events?',
    answer:
      'Yes! We craft bespoke luxury hampers containing custom scented candles, resin coasters, match jars, and customized greeting cards in wooden boxes or rigid kraft crates. We offer exclusive bulk discounts starting from 15+ units. Contact us on WhatsApp at +91 8341790329 for a bulk catalog.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long does delivery take across India?',
    answer:
      'Ready-to-ship products are dispatched from Hyderabad within 1-2 business days. Express couriers (Shiprocket, Delhivery, Bluedart) deliver within 1-2 days in Hyderabad, 2-4 days in South India, and 3-5 days across the rest of India. You will receive live SMS/WhatsApp tracking once dispatched.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Is shipping free?',
    answer:
      'Yes! We provide 100% FREE express shipping on all orders above ₹1000 across India. Orders below ₹1000 carry a flat ₹70 standard delivery fee.',
  },
  {
    category: 'Payments & Security',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept all major Indian payment options via Razorpay secure gateway: Google Pay, PhonePe, Paytm, BHIM UPI, Credit & Debit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Wallets. We also offer Order Request with Pay on Delivery confirmation via WhatsApp.',
  },
  {
    category: 'Returns & Damages',
    question: 'What happens if my candle or resin art arrives broken in transit?',
    answer:
      'We package every parcel with heavy multilayered bubble wrap and rigid boxes. In the rare case of transit damage, simply record an unboxing video and send it to our WhatsApp (+91 8341790329) within 48 hours. We will immediately dispatch a 100% free replacement parcel!',
  },
];

export default function FAQPage() {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 3, 5]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Candles & Wax', 'Custom Orders', 'Shipping & Delivery', 'Payments & Security', 'Returns & Damages'];

  const toggleIndex = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Got Questions? We Have Answers</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#7a6858] max-w-xl mx-auto">
          Everything you need to know about our handcrafted soy candles, resin decor, custom gift hampers, and express shipping.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-[#4a3b32] text-white shadow-md'
                : 'bg-white text-[#7a6858] border border-[#ebdcd0] hover:bg-[#f5eee6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={faq.question}
              className="bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden shadow-xs hover:border-[#b87333] transition-colors"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#b87333] tracking-wider">
                    {faq.category}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#3b2d24]">
                    {faq.question}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#faf7f2] flex items-center justify-center shrink-0 text-[#8c7868]">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5c4a3e] leading-relaxed border-t border-[#f5eee6] animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-[#4a3b32] text-white p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <h3 className="font-serif text-xl sm:text-2xl font-bold">
          Still Have a Special Question?
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
          Need custom scent suggestions or a custom corporate quotation? Our studio founder is always ready to chat.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/918341790329?text=Hi!%20I%20have%20a%20question%20about%20your%20candles/crafts."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-full shadow transition-all"
          >
            Chat on WhatsApp (+91 8341790329)
          </a>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#4a3b32] hover:bg-[#f5eee6] font-bold text-xs rounded-full shadow transition-all"
          >
            Send Studio Message
          </Link>
        </div>
      </div>

    </div>
  );
}
