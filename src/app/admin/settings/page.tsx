'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { StoreSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-xs text-[#7a6858]">Loading store settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Store & Studio Settings
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Manage business contact info, email notification address, Instagram link, shipping rates, and admin security password.
          </p>
        </div>

        {saved && (
          <div className="bg-[#e8f5e9] border border-[#2e7d32] text-[#2e7d32] p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Store settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-6 text-xs">
          
          <h2 className="font-serif text-lg font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-2">
            1. Business Information & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Business / Brand Name</label>
              <input
                type="text"
                name="businessName"
                value={settings.businessName}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Business Notification Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Phone Number (Call)</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#4a3b32] mb-1">Instagram Page URL</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>
          </div>

          <h2 className="font-serif text-lg font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-2 pt-4">
            2. Shipping Rates & Currency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Default Shipping Fee (₹)</label>
              <input
                type="number"
                name="defaultShippingFee"
                value={settings.defaultShippingFee}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Store Currency</label>
              <input
                type="text"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>
          </div>

          <h2 className="font-serif text-lg font-bold text-[#3b2d24] border-b border-[#ebdcd0] pb-2 pt-4">
            3. Admin Security & Password
          </h2>

          <div>
            <label className="block font-bold text-[#4a3b32] mb-1">Admin Access Password</label>
            <input
              type="text"
              name="adminPasswordHash"
              value={settings.adminPasswordHash || 'moonshine2026'}
              onChange={handleChange}
              className="w-full sm:w-1/2 p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center space-x-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
