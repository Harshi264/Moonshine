'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Flame,
  ZoomIn,
  X,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Active UI states
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [customizationValues, setCustomizationValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care' | 'shipping'>('desc');

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || '');
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.reviews || []);

          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-96 bg-gray-200 rounded-3xl max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">Product Not Found</h2>
        <p className="text-sm text-[#7a6858]">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/catalogue"
          className="inline-block px-6 py-2.5 bg-[#4a3b32] text-white rounded-full text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const currentPrice = selectedVariant
    ? selectedVariant.salePrice || selectedVariant.price
    : product.salePrice || product.price;

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const isDiscounted = Boolean(
    selectedVariant ? selectedVariant.salePrice : product.salePrice && product.salePrice < product.price
  );

  const handleCustomizationChange = (label: string, value: string) => {
    setCustomizationValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, customizationValues);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, customizationValues);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#7a6858]">
        <Link href="/" className="hover:text-[#4a3b32]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/catalogue" className="hover:text-[#4a3b32]">Catalogue</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-[#4a3b32] truncate">{product.name}</span>
      </nav>

      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        
        {/* Left Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#ebdcd0] shadow-md group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            />
            <button
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-[#4a3b32] shadow-lg backdrop-blur-sm transition-all"
              title="Click to zoom image"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            {isDiscounted && (
              <span className="absolute top-4 left-4 bg-[#b87333] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                {product.discountPercent || 20}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#b87333] ring-2 ring-[#b87333]/30 scale-105' : 'border-[#ebdcd0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#8c7868] mb-1">
              <span>{product.category.replace('-', ' ')}</span>
              {product.subcategory && (
                <>
                  <span>•</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Stock Badge */}
          <div className="flex items-center space-x-4 bg-[#f5eee6] p-4 rounded-2xl border border-[#ebdcd0]">
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-3xl font-bold text-[#4a3b32]">
                ₹{currentPrice}
              </span>
              {isDiscounted && (
                <span className="text-base text-[#99887a] line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {product.status === 'out_of_stock' ? (
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            ) : (
              <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> In Stock ({product.stock} left)
              </span>
            )}
          </div>

          <p className="text-sm text-[#6b584a] leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#4a3b32] uppercase tracking-wider">
                Select Option / Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-[#4a3b32] text-white border-[#4a3b32] shadow-sm'
                        : 'bg-white text-[#4a3b32] border-[#d6c8b8] hover:bg-[#f5eee6]'
                    }`}
                  >
                    {v.name} — ₹{v.salePrice || v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Customization Fields */}
          {product.customizationFields && product.customizationFields.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcd0] space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#b87333] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Personalization / Customization Options</span>
              </div>
              {product.customizationFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-[#4a3b32]">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      onChange={(e) => handleCustomizationChange(field.label, e.target.value)}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                    >
                      <option value="">Select option...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={2}
                      placeholder={field.helpText || 'Enter custom text or notes...'}
                      onChange={(e) => handleCustomizationChange(field.label, e.target.value)}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.helpText || `Enter ${field.label}...`}
                      onChange={(e) => handleCustomizationChange(field.label, e.target.value)}
                      className="w-full p-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-xl text-xs text-[#3b2d24]"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Action CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-[#d6c8b8] bg-white rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#4a3b32]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full border transition-all ${
                  isLiked ? 'bg-[#fce4ec] border-[#f8bbd0] text-[#d9534f]' : 'bg-white border-[#d6c8b8] text-[#4a3b32] hover:bg-[#f5eee6]'
                }`}
                title="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="w-full py-3.5 bg-white hover:bg-[#f5eee6] text-[#4a3b32] border-2 border-[#4a3b32] font-bold text-sm rounded-full shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.status === 'out_of_stock'}
                className="w-full py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-bold text-sm rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4 text-[#e6c594]" />
                <span>Order Now</span>
              </button>
            </div>
          </div>

          {/* Policy Snippet */}
          <div className="border-t border-[#ebdcd0] pt-4 grid grid-cols-2 gap-3 text-xs text-[#7a6858]">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#b87333]" />
              <span>Ships in 2-3 Days Across India</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#b87333]" />
              <span>Personalized Confirmation</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Specs & Details */}
      <div className="bg-white rounded-3xl border border-[#ebdcd0] p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-[#ebdcd0] space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-serif font-bold text-base transition-colors ${
              activeTab === 'desc' ? 'text-[#b87333] border-b-2 border-[#b87333]' : 'text-[#7a6858]'
            }`}
          >
            Description & Fragrance
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-serif font-bold text-base transition-colors ${
              activeTab === 'specs' ? 'text-[#b87333] border-b-2 border-[#b87333]' : 'text-[#7a6858]'
            }`}
          >
            Materials & Specs
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 font-serif font-bold text-base transition-colors ${
              activeTab === 'care' ? 'text-[#b87333] border-b-2 border-[#b87333]' : 'text-[#7a6858]'
            }`}
          >
            Care Instructions
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 font-serif font-bold text-base transition-colors ${
              activeTab === 'shipping' ? 'text-[#b87333] border-b-2 border-[#b87333]' : 'text-[#7a6858]'
            }`}
          >
            Shipping Info
          </button>
        </div>

        <div className="text-sm text-[#4a3b32] leading-relaxed space-y-4">
          {activeTab === 'desc' && (
            <div>
              <p className="mb-3">{product.description}</p>
              {product.fragranceInfo && (
                <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebdcd0] mt-3">
                  <strong className="text-[#b87333] block mb-1">🌿 Fragrance Profile:</strong>
                  <p>{product.fragranceInfo}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.materials && (
                <div><strong>Materials:</strong> {product.materials}</div>
              )}
              {product.dimensions && (
                <div><strong>Dimensions:</strong> {product.dimensions}</div>
              )}
              {product.weight && (
                <div><strong>Weight:</strong> {product.weight}</div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <p>{product.careInstructions || 'Keep away from direct heat and light. Trim candle wick to 1/4 inch before each light.'}</p>
          )}

          {activeTab === 'shipping' && (
            <p>{product.shippingInfo || 'All products are handmade on order and dispatched within 2-3 days via Express Delivery.'}</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-[#ebdcd0] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#ebdcd0] pb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">Customer Reviews</h2>
            <div className="flex items-center space-x-2 mt-1 text-sm text-[#7a6858]">
              <div className="flex text-[#d4af37]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-[#3b2d24]">5.0</span>
              <span>• Based on {reviews.length} reviews</span>
            </div>
          </div>

          <Link
            href={`/review?productId=${product.id}`}
            className="px-5 py-2.5 bg-[#f5eee6] hover:bg-[#ebdcd0] text-[#4a3b32] font-semibold text-xs rounded-full border border-[#d6c8b8] transition-colors"
          >
            Write a Review
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-[#7a6858] italic text-center py-4">
            No reviews yet for this creation. Be the first to share your experience!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ebdcd0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3b2d24]">{r.customerName}</span>
                  <span className="text-[#8c7868]">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-[#d4af37]">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4a3b32]">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Section: People who bought this also liked */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#3b2d24]">
            People Who Bought This Also Liked...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={selectedImage} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}

    </div>
  );
}
