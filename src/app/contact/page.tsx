'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle,
  Flame,
  Sparkles,
  Upload,
  X,
  Clock,
  ShieldCheck,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'custom'>('general');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    customType: 'Handmade Candle',
    customQuantity: '1',
    desiredDate: '',
    message: '',
    honeypot: '', // bot trap
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<any>(null);

  const handleTabSwitch = (tab: 'general' | 'custom') => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      subject: tab === 'custom' ? 'Custom Order Request' : 'General Inquiry',
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Max size is 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) {
          uploadedImageUrl = uploadJson.url;
        }
        setUploadingImage(false);
      }

      // Compile detailed message if Custom Order
      let finalMessage = formData.message.trim();
      if (activeTab === 'custom') {
        finalMessage = `[Custom Item: ${formData.customType}] [Quantity: ${formData.customQuantity}] ${
          formData.desiredDate ? `[Target Delivery: ${formData.desiredDate}]` : ''
        }\n\n${finalMessage}`;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: finalMessage,
          imageUrl: uploadedImageUrl,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmittedMessage({
          ...data.contactMessage,
          message: finalMessage,
          imageUrl: uploadedImageUrl,
        });
      } else {
        setError(data.error || 'Failed to send message. Please try again or reach out on WhatsApp.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setSubmittedMessage(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: activeTab === 'custom' ? 'Custom Order Request' : 'General Inquiry',
      customType: 'Handmade Candle',
      customQuantity: '1',
      desiredDate: '',
      message: '',
      honeypot: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#b87333]" />
          <span>Handmade Studio in Hyderabad</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Get in Touch With Our Studio
        </h1>
        <p className="text-sm sm:text-base text-[#7a6858] leading-relaxed">
          Have a question about scents, custom resin bookmarks, wedding favors, or corporate hampers? We’d love to craft something special for you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Contact Info & Studio Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#4a3b32] text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#b87333]/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#e6c594]">
                Direct Communication
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                Studio Contact Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Connect directly with our studio founders. We respond promptly via phone, WhatsApp, or email.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              {/* Primary Phone & WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0 shadow">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Primary Phone & Call Support
                  </div>
                  <a
                    href="tel:8341790329"
                    className="text-base font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5"
                  >
                    📞 +91 8341790329
                  </a>
                  <span className="text-[11px] text-gray-300">Mon - Sat, 10:00 AM - 7:30 PM IST</span>
                </div>
              </div>

              {/* WhatsApp Direct Line 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Primary WhatsApp Direct
                  </div>
                  <a
                    href="https://wa.me/918341790329?text=Hi!%20I%20have%20an%20inquiry%20regarding%20The%20Little%20Cozy%20Moonshine%20candles/crafts."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-white hover:text-[#25D366] transition-colors block mt-0.5"
                  >
                    💬 Chat on WhatsApp (8341790329)
                  </a>
                  <span className="text-[11px] text-gray-300">Fastest replies for orders & hampers</span>
                </div>
              </div>

              {/* WhatsApp Direct Line 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/80 flex items-center justify-center shrink-0 shadow">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Alternate WhatsApp Support
                  </div>
                  <a
                    href="https://wa.me/917075905496?text=Hi!%20I%20have%20an%20inquiry%20regarding%20The%20Little%20Cozy%20Moonshine%20candles/crafts."
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
                <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0 shadow">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Official Business Email
                  </div>
                  <a
                    href="mailto:thelittlecozymoonshine@gmail.com"
                    className="text-sm font-bold text-white hover:text-[#e6c594] transition-colors block mt-0.5"
                  >
                    thelittlecozymoonshine@gmail.com
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow">
                  <InstagramIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Instagram Community
                  </div>
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

              {/* Studio Physical Location */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#b87333] flex items-center justify-center shrink-0 shadow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] text-[#e6c594] uppercase font-bold tracking-wider">
                    Registered Studio Address
                  </div>
                  <p className="text-sm font-medium text-white mt-0.5 leading-snug">
                    Banjara Hills, Hyderabad, Telangana 500034, India
                  </p>
                  <span className="text-[11px] text-gray-300">All products handcrafted & shipped from Hyderabad</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick FAQ note */}
          <div className="bg-[#f5eee6] p-6 rounded-3xl border border-[#ebdcd0] text-xs text-[#5c4a3e] space-y-2">
            <div className="flex items-center space-x-2 font-bold text-[#3b2d24]">
              <Clock className="w-4 h-4 text-[#b87333]" />
              <span>Response Guarantee</span>
            </div>
            <p className="leading-relaxed">
              We personally read and answer all messages within <strong>24 hours</strong>. For urgent delivery orders or wedding gifts, please ping us directly on WhatsApp!
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6">
          
          {submittedMessage ? (
            /* Confirmation Card */
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#e8f5e9] p-8 rounded-3xl text-center space-y-4 border border-[#a5d6a7]">
                <div className="w-16 h-16 bg-[#2e7d32] text-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#2e7d32]">
                    Message Saved & Alert Sent!
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#2e7d32] mt-1">
                    Thank You, {submittedMessage.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4a3b32] mt-2 max-w-md mx-auto leading-relaxed">
                    We have received your message and sent an auto-reply confirmation to <strong>{submittedMessage.email}</strong>. Our team will review your inquiry and reply within <strong>24 hours</strong>.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#c8e6c9] max-w-md mx-auto text-left text-xs space-y-2 text-[#3b2d24]">
                  <div><strong>Reference ID:</strong> {submittedMessage.id}</div>
                  <div><strong>Subject:</strong> {submittedMessage.subject}</div>
                  <div><strong>Contact Phone:</strong> {submittedMessage.phone}</div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="bg-[#faf7f2] p-6 rounded-2xl border border-[#ebdcd0] text-center space-y-3">
                <p className="text-xs text-[#7a6858]">
                  Want an immediate answer? Send this message directly to our WhatsApp chat:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/918341790329?text=${encodeURIComponent(
                      `Hi! I just sent inquiry ${submittedMessage.id} on your website regarding: ${submittedMessage.subject}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-full shadow flex items-center justify-center space-x-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send on WhatsApp (8341790329)</span>
                  </a>

                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-[#4a3b32] border border-[#d6c8b8] hover:bg-[#f5eee6] font-bold text-xs rounded-full transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tabs Switcher: General vs Custom Order */}
              <div className="flex rounded-2xl bg-[#faf7f2] p-1 border border-[#ebdcd0]">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('general')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    activeTab === 'general'
                      ? 'bg-[#4a3b32] text-white shadow'
                      : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>General Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabSwitch('custom')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    activeTab === 'custom'
                      ? 'bg-[#b87333] text-white shadow'
                      : 'text-[#7a6858] hover:text-[#3b2d24]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Order Request 🌸</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 8341790329"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                    Inquiry Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Order Request">Custom Order Request (Candles / Resin)</option>
                    <option value="Bulk or Gifting Hampers">Bulk / Festival Gifting Hampers</option>
                    <option value="Order Status / Issue">Existing Order Status / Issue</option>
                  </select>
                </div>
              </div>

              {/* Special Custom Order Fields (Shown when Custom tab is active or Custom subject selected) */}
              {(activeTab === 'custom' || formData.subject.toLowerCase().includes('custom')) && (
                <div className="bg-[#faf7f2] p-5 rounded-2xl border border-[#ebdcd0] space-y-4 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#b87333]">
                    <Sparkles className="w-4 h-4" />
                    <span>Customization Details (Personalised Items & Hampers)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                        Item Type
                      </label>
                      <select
                        value={formData.customType}
                        onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                      >
                        <option value="Handmade Soy Candle">Handmade Soy Candle</option>
                        <option value="Resin Coasters Set">Resin Coasters Set</option>
                        <option value="Personalized Bookmark">Personalized Bookmark</option>
                        <option value="Ocean Wave Vanity Tray">Ocean Wave Vanity Tray</option>
                        <option value="Luxury Gift Hamper">Luxury Gift Hamper</option>
                        <option value="Wedding / Event Favors">Wedding / Event Favors</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                        Estimated Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1 or 25 pieces"
                        value={formData.customQuantity}
                        onChange={(e) => setFormData({ ...formData, customQuantity: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5c4a3e] mb-1">
                        Needed By (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.desiredDate}
                        onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Message Details */}
              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                  Your Message / Specifications *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    activeTab === 'custom'
                      ? "Tell us names to personalize, desired colors, scent preferences (e.g. Vanilla, Lavender), or special instructions..."
                      : "How can our studio help you today? Ask about scent recommendations, delivery times, or stock availability..."
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                />
              </div>

              {/* Photo Upload for Custom Designs */}
              <div>
                <label className="block text-xs font-bold text-[#4a3b32] mb-1">
                  Optional Design / Inspiration Photo (Max 5MB)
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block border-2 border-[#b87333] rounded-2xl overflow-hidden shadow-md">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#d6c8b8] hover:border-[#b87333] rounded-2xl cursor-pointer bg-[#faf7f2] hover:bg-[#f5eee6] transition-colors">
                    <Upload className="w-6 h-6 text-[#8c7868] mb-1" />
                    <span className="text-xs font-bold text-[#4a3b32]">Click to upload reference image</span>
                    <span className="text-[10px] text-[#8c7868] mt-0.5">PNG, JPG, WebP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Honeypot hidden input for spam bots */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full py-4 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading || uploadingImage ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message (Guaranteed 24h Response)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-[#8c7868]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>Spam protected • Your email and phone are kept strictly private</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
