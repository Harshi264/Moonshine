import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getDB } from '@/lib/db';
import {
  Sparkles,
  Flame,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Gift,
  Heart,
  Truck,
  CheckCircle,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default async function HomePage() {
  const db = getDB();
  const products = db.products.filter((p) => p.status === 'active');
  const categories = db.categories;
  const reviews = db.reviews.filter((r) => r.status === 'approved');

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const saleProducts = products.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price)).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#f5eee6] via-[#faf7f2] to-[#faf7f2] pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#ebdcd0] text-[#4a3b32] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#b87333]" />
                <span>Handcrafted Studio in Hyderabad</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#3b2d24] leading-tight">
                Warm Ambiance. <br />
                <span className="text-[#b87333]">Handcrafted Magic.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6b584a] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover our signature eco-friendly soy wax candles and crystal-clear resin crafts. Designed to infuse your home with serene fragrances, luxury textures, and cozy aesthetics.
              </p>

              {/* Action CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/catalogue?category=candles"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#4a3b32] hover:bg-[#b87333] text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Flame className="w-4 h-4 text-[#e6c594]" />
                  <span>Shop Candles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/catalogue?category=resin-crafts"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#f5eee6] text-[#4a3b32] border border-[#d6c8b8] font-semibold text-sm rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#b87333]" />
                  <span>Shop Resin Crafts</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#ebdcd0] grid grid-cols-3 gap-4 text-center lg:text-left text-xs text-[#7a6858]">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#b87333] shrink-0" />
                  <span>100% Soy Wax</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#b87333] shrink-0" />
                  <span>Free Shipping &gt; ₹1500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-[#b87333] shrink-0" />
                  <span>Customized Orders</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80"
                    alt="Handmade Soy Candles"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Overlay Badge 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#ebdcd0] flex items-center space-x-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-[#f5eee6] flex items-center justify-center text-[#b87333]">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3b2d24]">5.0 Star Rated Studio</p>
                    <p className="text-[11px] text-[#7a6858]">Verified Customer Reviews</p>
                  </div>
                </div>

                {/* Floating Overlay Badge 2 */}
                <div className="absolute -top-6 -right-6 bg-[#4a3b32] text-white p-3.5 rounded-2xl shadow-xl border border-[#3b2d24] flex items-center space-x-3 hidden sm:flex">
                  <Gift className="w-5 h-5 text-[#e6c594]" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#e6c594]">Special Hampers</p>
                    <p className="text-[10px] text-gray-300">Customized Gift Crate</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24]">
            Explore Our Handcrafted Collections
          </h2>
          <p className="text-sm text-[#7a6858] mt-2">
            Each creation is hand-poured, molded, and customized with organic botanicals & fine finish.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-white border border-[#ebdcd0] shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d241e]/90 via-[#2d241e]/30 to-transparent flex flex-col justify-end p-3 sm:p-4 text-white">
                <h3 className="font-serif text-sm sm:text-base font-bold group-hover:text-[#e6c594] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-gray-300 flex items-center mt-1">
                  Explore <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#4a3b32] via-[#6e4e3b] to-[#b87333] text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-[#e6c594] text-[#4a3b32] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              🔥 Festival Season Offer
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Get Up to 25% OFF On Selected Crafts
            </h2>
            <p className="text-sm sm:text-base text-gray-200">
              Transform your living space or surprise loved ones with handcrafted scented candles and gold leaf resin coasters.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogue?category=sale"
                className="inline-flex items-center space-x-2 bg-white text-[#4a3b32] hover:bg-[#faf7f2] px-6 py-3 rounded-full font-bold text-sm shadow transition-all"
              >
                <span>View Discounted Collection</span>
                <ArrowRight className="w-4 h-4 text-[#b87333]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#b87333]">Handpicked Studio Favorites</div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24] mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="text-sm font-semibold text-[#b87333] hover:text-[#4a3b32] flex items-center space-x-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#f5eee6] py-12 rounded-3xl border border-[#ebdcd0]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b87333]">Customer Favorites</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24] mt-1">
            Our Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-[#7a6858] mt-2">
            Most-loved by our Instagram community & candle enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex justify-center text-[#d4af37] space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3b2d24]">
            Loved by Candle & Resin Lovers
          </h2>
          <p className="text-sm text-[#7a6858] mt-2">
            Real customer feedback from verified lovers of our handmade studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-[#ebdcd0] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#d4af37]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Order
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#4a3b32] italic leading-relaxed mb-4">
                  "{review.comment}"
                </p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                  <img src={review.images[0]} alt="Customer review photo" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-3 border-t border-[#f2e8de] flex justify-between items-center text-xs">
                <span className="font-bold text-[#3b2d24]">{review.customerName}</span>
                <span className="text-[#8c7868]">{review.productName}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/review"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#b87333] hover:text-[#4a3b32] underline"
          >
            <span>Have you ordered from us? Click here to write a review & upload your photo!</span>
          </Link>
        </div>
      </section>

      {/* Instagram Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#faf7f2] border-2 border-dashed border-[#d6c8b8] rounded-3xl p-8 text-center space-y-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full mx-auto flex items-center justify-center text-white shadow-md">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2d24]">
              Follow Us on Instagram
            </h2>
            <p className="text-sm text-[#7a6858] mt-1">
              @thelittlecozymoonshine • Behind the scenes candle pours, resin demolding reels & new releases!
            </p>
          </div>
          <div>
            <a
              href="https://www.instagram.com/thelittlecozymoonshine"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#dc2743] to-[#bc1888] text-white px-7 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@thelittlecozymoonshine</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
