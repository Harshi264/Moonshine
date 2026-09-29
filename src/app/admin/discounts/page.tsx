'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Discount, Product, Category } from '@/types';
import { Tag, Plus, Check, Percent, Sparkles } from 'lucide-react';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'category' | 'product'>('all');
  const [targetId, setTargetId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');

  async function loadData() {
    setLoading(true);
    try {
      const [dRes, pRes, cRes] = await Promise.all([
        fetch('/api/discounts'),
        fetch('/api/products?admin=true'),
        fetch('/api/categories'),
      ]);
      const dData = await dRes.json();
      const pData = await pRes.json();
      const cData = await cRes.json();

      if (dData.success) setDiscounts(dData.discounts);
      if (pData.success) setProducts(pData.products);
      if (cData.success) setCategories(cData.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          targetType,
          targetId: targetId || undefined,
          discountPercent: Number(discountPercent),
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Discount applied to products!');
        setTitle('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveProductDiscount = async (productId: string) => {
    try {
      const res = await fetch('/api/discounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-discount', productId }),
      });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Discounts & Festival Sales System
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Apply discount percentages to individual products, specific categories (e.g. Candles), or storewide.
          </p>
        </div>

        {/* Create Sale Campaign Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#3b2d24] flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#b87333]" />
            <span>Create & Apply New Sale Campaign</span>
          </h2>

          <form onSubmit={handleCreateDiscount} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Campaign Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Diwali Festival Offer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Target Scope *</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              >
                <option value="all">Entire Store (All Products)</option>
                <option value="category">Specific Category</option>
                <option value="product">Single Product</option>
              </select>
            </div>

            {targetType === 'category' && (
              <div>
                <label className="block font-bold text-[#4a3b32] mb-1">Select Category</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
                >
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'product' && (
              <div>
                <label className="block font-bold text-[#4a3b32] mb-1">Select Product</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
                >
                  <option value="">Select...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Discount Percentage (%) *</label>
              <input
                type="number"
                required
                min="1"
                max="90"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl font-bold"
              />
            </div>

            <div className="sm:col-span-4 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow"
              >
                Apply Discount Campaign Now
              </button>
            </div>
          </form>
        </div>

        {/* Active Discounted Products Table */}
        <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#3b2d24]">
            Currently Discounted Products
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f5eee6] text-[#4a3b32] font-bold">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Original Price</th>
                  <th className="p-3">Discounted Sale Price</th>
                  <th className="p-3">Discount %</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8de]">
                {products
                  .filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf7f2]">
                      <td className="p-3 font-bold text-[#3b2d24]">{p.name}</td>
                      <td className="p-3 text-[#99887a] line-through">₹{p.price}</td>
                      <td className="p-3 font-bold text-[#2e7d32]">₹{p.salePrice}</td>
                      <td className="p-3 font-bold text-[#b87333]">
                        {p.discountPercent || Math.round(((p.price - (p.salePrice || 0)) / p.price) * 100)}% OFF
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemoveProductDiscount(p.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-200"
                        >
                          Remove Discount
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
