'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { Search, Filter, SlidersHorizontal, Sparkles, Flame, RotateCcw } from 'lucide-react';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchQueryParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [search, setSearch] = useState(searchQueryParam);
  const [sort, setSort] = useState('featured');
  const [priceFilter, setPriceFilter] = useState<number>(3000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(categoryParam === 'sale');

  useEffect(() => {
    setActiveCategory(categoryParam);
    if (categoryParam === 'sale') setOnlySale(true);
  }, [categoryParam]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load catalogue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    // Category match
    if (activeCategory !== 'all') {
      const catLower = activeCategory.toLowerCase();
      if (catLower === 'new-arrivals') {
        if (!p.isNewArrival) return false;
      } else if (catLower === 'sale') {
        if (!p.isSale && (!p.salePrice || p.salePrice >= p.price)) return false;
      } else {
        const pCat = p.category.toLowerCase().replace(/\s+/g, '-');
        if (pCat !== catLower && p.category.toLowerCase() !== catLower) return false;
      }
    }

    // Search query
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(s);
      const matchDesc = p.description.toLowerCase().includes(s);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(s));
      if (!matchName && !matchDesc && !matchTag) return false;
    }

    // Price Filter
    const price = p.salePrice || p.price;
    if (price > priceFilter) return false;

    // Stock
    if (onlyInStock && p.status === 'out_of_stock') return false;

    // Sale toggle
    if (onlySale && !p.isSale && (!p.salePrice || p.salePrice >= p.price)) return false;

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;

    if (sort === 'price-low') return priceA - priceB;
    if (sort === 'price-high') return priceB - priceA;
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const resetFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setSort('featured');
    setPriceFilter(3000);
    setOnlyInStock(false);
    setOnlySale(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3b2d24]">
          Studio Catalogue
        </h1>
        <p className="text-sm text-[#7a6858]">
          Explore our complete collection of handmade soy wax candles, resin art decor, bookmarks & hampers.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none justify-start sm:justify-center border-b border-[#ebdcd0]">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#4a3b32] text-white shadow'
              : 'bg-white text-[#5c4a3e] border border-[#d6c8b8] hover:bg-[#f5eee6]'
          }`}
        >
          ✨ All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.slug
                ? 'bg-[#4a3b32] text-white shadow'
                : 'bg-white text-[#5c4a3e] border border-[#d6c8b8] hover:bg-[#f5eee6]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#ebdcd0] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search product by name or fragrance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7868]" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8c7868] shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col justify-center space-y-1">
            <div className="flex justify-between text-xs text-[#7a6858] font-medium">
              <span>Max Price:</span>
              <span className="font-bold text-[#4a3b32]">₹{priceFilter}</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="accent-[#b87333] cursor-pointer"
            />
          </div>

        </div>

        {/* Toggles & Reset */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#f2e8de]">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer text-[#4a3b32] font-medium">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#b87333] rounded"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-[#4a3b32] font-medium">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
                className="accent-[#b87333] rounded"
              />
              <span className="text-[#b87333] font-bold">On Sale Only</span>
            </label>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 text-[#8c7868] hover:text-[#4a3b32] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="text-xs text-[#7a6858] mb-4 font-medium">
          Showing <span className="font-bold text-[#3b2d24]">{sortedProducts.length}</span> products
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#ebdcd0] p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-[#f5eee6] rounded-full mx-auto flex items-center justify-center text-[#b87333]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3b2d24]">No products found</h3>
            <p className="text-sm text-[#7a6858] max-w-sm mx-auto">
              We couldn't find any products matching your current filters or search query.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#4a3b32] text-white text-xs font-semibold rounded-full hover:bg-[#b87333] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
