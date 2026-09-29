'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Product, Category } from '@/types';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Flame,
  Sparkles,
  Upload,
  Check,
  Search,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'candles',
    subcategory: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '10',
    imageUrls: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'],
    dimensions: '',
    weight: '',
    materials: '',
    fragranceInfo: '',
    careInstructions: '',
    shippingInfo: '',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    status: 'active' as 'active' | 'out_of_stock' | 'hidden',
  });

  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.id || 'candles',
      subcategory: '',
      description: '',
      price: '',
      salePrice: '',
      stock: '10',
      imageUrls: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'],
      dimensions: '',
      weight: '',
      materials: '',
      fragranceInfo: '',
      careInstructions: '',
      shippingInfo: '',
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || '',
      description: p.description || '',
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      stock: String(p.stock),
      imageUrls: p.images || [],
      dimensions: p.dimensions || '',
      weight: p.weight || '',
      materials: p.materials || '',
      fragranceInfo: p.fragranceInfo || '',
      careInstructions: p.careInstructions || '',
      shippingInfo: p.shippingInfo || '',
      isFeatured: Boolean(p.isFeatured),
      isBestseller: Boolean(p.isBestseller),
      isNewArrival: Boolean(p.isNewArrival),
      status: p.status,
    });
    setModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64 }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            setFormData((prev) => ({ ...prev, imageUrls: [data.url, ...prev.imageUrls] }));
          }
        } catch (err) {
          console.error('Upload error:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        images: formData.imageUrls,
        dimensions: formData.dimensions,
        weight: formData.weight,
        materials: formData.materials,
        fragranceInfo: formData.fragranceInfo,
        careInstructions: formData.careInstructions,
        shippingInfo: formData.shippingInfo,
        isFeatured: formData.isFeatured,
        isBestseller: formData.isBestseller,
        isNewArrival: formData.isNewArrival,
        status: formData.status,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHideProduct = async (p: Product) => {
    const newStatus = p.status === 'hidden' ? 'active' : 'hidden';
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
              Product Management
            </h1>
            <p className="text-xs text-[#7a6858] mt-1">
              Add new candles and resin crafts, update prices, set sale discounts, adjust stock, or upload images.
            </p>
          </div>

          <button
            onClick={openNewModal}
            className="px-5 py-2.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#e6c594]" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-[#ebdcd0] shadow-sm">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search product by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8c7868]" />
          </div>
        </div>

        {/* Product Grid / Table */}
        <div className="bg-white rounded-3xl border border-[#ebdcd0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#7a6858]">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#7a6858]">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f5eee6] text-[#4a3b32] font-bold border-b border-[#ebdcd0]">
                    <th className="p-4">Image & Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Sale</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Flags</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e8de]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf7f2]">
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl border border-[#ebdcd0]"
                        />
                        <div>
                          <div className="font-bold text-[#3b2d24]">{p.name}</div>
                          <div className="text-[10px] text-[#7a6858]">ID: {p.id}</div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-[#5c4a3e] capitalize">
                        {p.category.replace('-', ' ')}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#4a3b32]">₹{p.salePrice || p.price}</div>
                        {p.salePrice && p.salePrice < p.price && (
                          <div className="text-[10px] text-[#99887a] line-through">₹{p.price}</div>
                        )}
                      </td>

                      <td className="p-4 font-bold text-[#4a3b32]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>

                      <td className="p-4 space-x-1">
                        {p.isFeatured && <span className="bg-[#e6c594] text-[#4a3b32] text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isBestseller && <span className="bg-[#4a3b32] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Bestseller</span>}
                        {p.isNewArrival && <span className="bg-[#5c7a5c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>}
                      </td>

                      <td className="p-4 font-semibold capitalize">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          p.status === 'active'
                            ? 'bg-[#e8f5e9] text-[#2e7d32]'
                            : p.status === 'out_of_stock'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] rounded-lg border"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleHideProduct(p)}
                          className="p-1.5 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] rounded-lg border"
                          title={p.status === 'hidden' ? 'Unhide Product' : 'Hide Product'}
                        >
                          {p.status === 'hidden' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white max-w-3xl w-full rounded-3xl border border-[#ebdcd0] p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              
              <div className="flex justify-between items-center border-b border-[#ebdcd0] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#3b2d24]">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 text-lg font-bold">✕</button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Original Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Sale / Discounted Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4a3b32] mb-1">Upload Product Image</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="text-xs"
                    />
                  </div>
                  {formData.imageUrls.length > 0 && (
                    <div className="flex space-x-2 mt-2">
                      {formData.imageUrls.map((url, idx) => (
                        <img key={idx} src={url} alt="" className="w-12 h-12 object-cover rounded-lg border" />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#4a3b32] mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Fragrance Notes (Candles)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vanilla, Amber, Sandalwood"
                      value={formData.fragranceInfo}
                      onChange={(e) => setFormData({ ...formData, fragranceInfo: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4a3b32] mb-1">Materials / Ingredients</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Soy Wax, Epoxy Resin, Dried Flowers"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 border-t border-[#ebdcd0]">
                  <label className="flex items-center space-x-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#b87333]"
                    />
                    <span>Featured Product</span>
                  </label>

                  <label className="flex items-center space-x-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="accent-[#b87333]"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center space-x-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#b87333]"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#f5eee6] text-[#4a3b32] font-bold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold rounded-full shadow"
                  >
                    Save Product
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
