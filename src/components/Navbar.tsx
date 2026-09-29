'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  Flame,
  ShieldCheck,
  PhoneCall,
  User,
  MessageSquare,
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer } = useCustomerAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/catalogue' },
    { name: 'Candles 🕯️', href: '/catalogue?category=candles' },
    { name: 'Resin Crafts ✨', href: '/catalogue?category=resin-crafts' },
    { name: 'Gift Sets 🎁', href: '/catalogue?category=gift-sets' },
    { name: 'Sale 🔥', href: '/catalogue?category=sale' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Write a Review', href: '/review' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#ebdcd0] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#4a3b32] text-[#f7f3ed] text-xs py-2 px-4 flex justify-between items-center overflow-x-auto">
        <div className="flex items-center space-x-2 mx-auto text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#e6c594] animate-pulse" />
          <span>Handcrafted Soy Candles & Artisanal Resin Crafts • Free Shipping above ₹1000!</span>
        </div>
        <div className="hidden lg:flex items-center space-x-4 text-xs shrink-0">
          <a
            href="tel:8341790329"
            className="flex items-center space-x-1 hover:text-[#e6c594] transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#e6c594]" />
            <span>8341790329</span>
          </a>
          <a
            href="https://wa.me/918341790329"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-[#25D366] transition-colors"
          >
            <MessageSquare className="w-3 h-3 text-[#25D366]" />
            <span>8341790329</span>
          </a>
          <a
            href="https://www.instagram.com/thelittlecozymoonshine"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-[#e6c594] transition-colors"
          >
            <InstagramIcon className="w-3 h-3" />
            <span>@thelittlecozymoonshine</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#4a3b32] hover:text-[#b87333] hover:bg-[#f9f3ec] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#4a3b32] via-[#8c5e3c] to-[#d4af37] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#faf7f2] rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#b87333]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#3b2d24] group-hover:text-[#b87333] transition-colors">
                The Little Cozy Moonshine
              </span>
              <span className="text-[10px] sm:text-xs text-[#8c7868] font-sans tracking-widest uppercase -mt-1 font-semibold">
                Handmade Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.slice(0, 7).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#b87333] ${
                    isActive ? 'text-[#b87333] font-semibold border-b-2 border-[#b87333] pb-1' : 'text-[#5c4a3e]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4a3b32] hover:text-[#b87333] rounded-full hover:bg-[#f9f3ec] transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account Icon */}
            <Link
              href={customer ? '/account' : '/login'}
              className="p-2 text-[#4a3b32] hover:text-[#b87333] rounded-full hover:bg-[#f9f3ec] transition-colors flex items-center"
              title={customer ? `Account (${customer.name})` : 'Customer Login'}
            >
              <User className={`w-5 h-5 ${customer ? 'text-[#b87333] fill-[#b87333]/20' : ''}`} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#4a3b32] hover:text-[#b87333] rounded-full hover:bg-[#f9f3ec] transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#b87333] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-[#4a3b32] hover:text-[#b87333] rounded-full hover:bg-[#f9f3ec] transition-colors flex items-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#4a3b32] text-[#f7f3ed] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard link */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center space-x-1 text-xs text-[#7a6858] hover:text-[#4a3b32] bg-[#f5eee6] hover:bg-[#ebdcd0] px-2.5 py-1 rounded-full border border-[#d6c8b8] transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#b87333]" />
              <span className="font-medium">Admin</span>
            </Link>
          </div>
        </div>

        {/* Search Overlay Input */}
        {searchOpen && (
          <div className="py-3 border-t border-[#ebdcd0] animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search soy candles, resin coasters, custom gift hampers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-[#faf7f2] border border-[#d6c8b8] rounded-full text-sm text-[#3b2d24] focus:outline-none focus:ring-2 focus:ring-[#b87333]"
                autoFocus
              />
              <Search className="absolute left-3.5 w-4 h-4 text-[#8c7868]" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-[#4a3b32] hover:bg-[#b87333] text-white text-xs font-semibold rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf7f2] border-b border-[#ebdcd0] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#4a3b32] hover:bg-[#ebdcd0] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#d6c8b8] flex flex-col space-y-2">
            <Link
              href={customer ? '/account' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm text-[#b87333] font-bold py-1.5"
            >
              <User className="w-4 h-4" />
              <span>{customer ? `My Account (${customer.name})` : 'Customer Login'}</span>
            </Link>
            <a
              href="https://www.instagram.com/thelittlecozymoonshine"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-[#8c5e3c] font-semibold py-1.5"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow us @thelittlecozymoonshine</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm text-[#5c4a3e] py-1.5 font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-[#b87333]" />
              <span>Private Admin Dashboard Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
