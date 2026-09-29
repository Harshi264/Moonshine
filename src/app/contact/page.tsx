'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, Flame } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Contact Our Studio
        </h1>
        <p className="text-sm text-[#7a6858]">
          Have a question about custom candle scents, bulk hamper orders, or delivery status? We are always happy to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Contact Details Card */}
        <div className="bg-[#4a3b32] text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#e6c594]">Direct Communication</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">Get in Touch Directly</h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              Click any number or link below to call, WhatsApp, or email our studio owner personally.
            </p>
          </div>

          <div className="space-y-6 text-sm">
            {/* Phone Number 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">Call / Phone Support 1</div>
                <a href="tel:8341790329" className="text-base font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5">
                  📞 8341790329
                </a>
              </div>
            </div>

            {/* Phone Number 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">Call / Phone Support 2</div>
                <a href="tel:7075905496" className="text-base font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5">
                  📞 7075905496
                </a>
              </div>
            </div>

            {/* WhatsApp Direct 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">WhatsApp Direct Line 1</div>
                <a
                  href="https://wa.me/918341790329?text=Hi!%20I%20have%20an%20inquiry%20regarding%20your%20candles/resin%20crafts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-white hover:text-[#25D366] transition-colors block mt-0.5"
                >
                  💬 Chat on WhatsApp (8341790329)
                </a>
              </div>
            </div>

            {/* WhatsApp Direct 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">WhatsApp Direct Line 2</div>
                <a
                  href="https://wa.me/917075905496?text=Hi!%20I%20have%20an%20inquiry%20regarding%20your%20candles/resin%20crafts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-white hover:text-[#25D366] transition-colors block mt-0.5"
                >
                  💬 Chat on WhatsApp (7075905496)
                </a>
              </div>
            </div>

            {/* Business Email */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">Official Business Email</div>
                <a href="mailto:thecozylittlemoonshine@gmail.com" className="text-sm font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5">
                  thecozylittlemoonshine@gmail.com
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#dc2743] flex items-center justify-center shrink-0">
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">Instagram Handle</div>
                <a
                  href="https://www.instagram.com/thelittlecozymoonshine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5"
                >
                  @thelittlecozymoonshine
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#e6c594] uppercase font-bold">Studio Location</div>
                <p className="text-sm font-semibold text-white mt-0.5">Hyderabad, Telangana, India</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-3">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="bg-[#e8f5e9] p-6 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-[#2e7d32] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#2e7d32]">Message Sent Successfully!</h3>
              <p className="text-xs text-[#4a3b32]">
                Thank you for reaching out. We will respond to your phone/email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 8341790329"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">Your Message / Custom Request *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you'd like to ask..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
