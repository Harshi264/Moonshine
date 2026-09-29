'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Category } from '@/types';
import { Boxes, Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          image: image.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setDescription('');
        setImage('');
        loadCategories();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
            Category Management
          </h1>
          <p className="text-xs text-[#7a6858] mt-1">
            Create and edit store product categories. Additional categories can be created anytime without code edits!
          </p>
        </div>

        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#ebdcd0] shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#3b2d24] flex items-center space-x-2">
            <Plus className="w-5 h-5 text-[#b87333]" />
            <span>Create New Category</span>
          </h2>

          <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Festival Hampers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Category Image URL</label>
              <input
                type="text"
                placeholder="Image URL..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a3b32] mb-1">Short Description</label>
              <input
                type="text"
                placeholder="Category details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl"
              />
            </div>

            <div className="sm:col-span-3 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#ebdcd0] shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {c.image && (
                  <img src={c.image} alt="" className="w-12 h-12 object-cover rounded-xl border shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-sm text-[#3b2d24]">{c.name}</h3>
                  <p className="text-[11px] text-[#7a6858]">Slug: {c.slug}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(c.id, c.name)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
