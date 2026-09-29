'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Tag,
  Boxes,
  Mail,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Plus,
  Flame,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Check admin authentication session token
    const token = localStorage.getItem('moonshine_admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('moonshine_admin_token');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#2d241e] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-[#b87333] animate-pulse mx-auto" />
          <p className="text-sm">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders Management', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products Catalogue', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Boxes },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Discounts & Sales', href: '/admin/discounts', icon: Tag },
    { name: 'Stock & Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Email Notifications Log', href: '/admin/emails', icon: Mail },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#2d241e] text-[#e8ded3] flex-col shrink-0 border-r border-[#473930]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#473930] flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#b87333] flex items-center justify-center text-white">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-white leading-tight">
              Studio Admin
            </h2>
            <p className="text-[10px] text-[#b8a798]">The Little Cozy Moonshine</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#b87333] text-white shadow-sm'
                    : 'text-[#b8a798] hover:bg-[#40342b] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#473930] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full text-center py-2 px-3 bg-[#40342b] hover:bg-[#4d3f35] text-xs font-semibold text-[#e8ded3] rounded-lg block transition-colors"
          >
            ↗ View Public Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#2d241e] text-white p-4 border-b border-[#473930] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-[#e8ded3] hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif font-bold text-sm">Studio Admin Portal</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-300 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-[#2d241e] text-[#e8ded3] p-4 space-y-2 border-b border-[#473930]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-[#b87333] text-white' : 'text-[#b8a798] hover:bg-[#40342b]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
