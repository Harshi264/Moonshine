'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const saved = data.products.filter((p: Product) => wishlist.includes(p.id));
          setProducts(saved);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlist]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[#7a6858]">
        Loading your saved wishlist...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#fce4ec] text-[#d9534f] rounded-full mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3b2d24]">Your Wishlist is Empty</h1>
        <p className="text-sm text-[#7a6858] max-w-sm mx-auto">
          Save your favorite soy candles and resin crafts by clicking the heart icon on any product.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-xs rounded-full shadow"
        >
          <span>Explore Studio Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#ebdcd0] pb-4">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24]">
          Saved Wishlist ({products.length} items)
        </h1>
        <p className="text-xs text-[#7a6858] mt-1">
          Your personal collection of saved handmade creations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
