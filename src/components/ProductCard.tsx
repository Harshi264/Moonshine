'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Star, ShoppingBag, Eye, CheckCircle } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const isDiscounted = Boolean(product.salePrice && product.salePrice < product.price);
  const currentPrice = product.salePrice || product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Gallery Preview */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#faf7f2]">
        <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
          {isDiscounted && (
            <span className="bg-[#b87333] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#4a3b32] text-[#f7f3ed] text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
              🔥 Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#5c7a5c] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
              🌱 New
            </span>
          )}
          {product.status === 'out_of_stock' && (
            <span className="bg-gray-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#4a3b32] hover:text-[#d9534f] shadow-md backdrop-blur-sm transition-all z-10"
          title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-[#d9534f] fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8c7868] mb-1">
            {product.category.replace('-', ' ')}
          </div>
          <Link href={`/product/${product.slug || product.id}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#3b2d24] group-hover:text-[#b87333] line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#7a6858] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating preview */}
        <div className="flex items-center space-x-1 text-xs text-[#8c7868]">
          <div className="flex text-[#d4af37]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-medium text-[#4a3b32] ml-1">5.0</span>
          <span>(12+ reviews)</span>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-[#f2e8de] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#4a3b32]">
                ₹{currentPrice}
              </span>
              {isDiscounted && (
                <span className="text-xs text-[#99887a] line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-[#b87333] font-semibold">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.status === 'out_of_stock'}
            className={`px-3 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
              product.status === 'out_of_stock'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#4a3b32] hover:bg-[#b87333] text-white hover:scale-105 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.status === 'out_of_stock' ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
