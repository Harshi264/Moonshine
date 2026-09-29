'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Product } from '@/types';
import { Boxes, Save, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  async function loadInventory() {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        const map: Record<string, number> = {};
        data.products.forEach((p: Product) => {
          map[p.id] = p.stock;
        });
        setStockEdits(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockChange = (id: string, val: number) => {
    setStockEdits((prev) => ({ ...prev, [id]: val }));
  };

  const saveStockUpdate = async (id: string) => {
    const newStock = stockEdits[id];
    const status = newStock === 0 ? 'out_of_stock' : 'active';
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, status }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Stock updated successfully!');
        loadInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Inventory & Stock Management
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Track product stock levels, low-stock warnings, and manually update available quantities.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f5eee6] text-[#4a3b32] font-bold">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Update Quantity</th>
                  <th className="p-3 text-center">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2e8de]">
                {products.map((p) => {
                  const isLow = (stockEdits[p.id] ?? p.stock) <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-[#faf7f2]">
                      <td className="p-3 font-bold text-[#3b2d24]">
                        {p.name}
                        {isLow && (
                          <span className="ml-2 text-[10px] text-red-600 bg-red-100 font-bold px-1.5 py-0.5 rounded">
                            ⚠️ Low Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3 capitalize">{p.category.replace('-', ' ')}</td>
                      <td className="p-3 font-bold text-[#4a3b32]">{p.stock}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          value={stockEdits[p.id] ?? p.stock}
                          onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                          className="w-24 p-1.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-lg font-bold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => saveStockUpdate(p.id)}
                          className="px-3 py-1.5 bg-[#4a3b32] hover:bg-[#b87333] text-white rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
