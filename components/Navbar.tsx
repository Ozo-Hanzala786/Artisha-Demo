'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Search, User, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, wishlist, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Check auth status
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isStaff = currentUser && currentUser.role !== 'CUSTOMER';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DFD5]">
      {/* Announcement Bar */}
      <div className="bg-[#6B1724] text-[#FAF8F5] py-2 px-4 text-center text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <span>Visit our flagship boutique at Dolmen Mall Lahore</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Complimentary nationwide shipping on orders over Rs. 10,000</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F1D1D] hover:text-[#6B1724] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <Link
              href="/shop"
              className={`hover:text-[#6B1724] transition-colors py-1 ${
                pathname === '/shop' ? 'text-[#6B1724] font-semibold border-b border-[#6B1724]' : 'text-[#1F1D1D]'
              }`}
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=pret-ready-to-wear"
              className="text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
            >
              Pret
            </Link>
            <Link
              href="/shop?category=luxury-festive"
              className="text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
            >
              Festive
            </Link>
            <Link
              href="/shop?category=artisanal-shawls"
              className="text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
            >
              Shawls
            </Link>
            <Link
              href="/collections"
              className="text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-[#7E7873] hover:text-[#1F1D1D] transition-colors"
            >
              Our Story
            </Link>
          </nav>

          {/* Center Brand Logo */}
          <div className="text-center flex-1 lg:flex-initial">
            <Link href="/" className="inline-block group">
              <span className="font-serif-luxury text-3xl sm:text-4xl tracking-[0.18em] text-[#1F1D1D] group-hover:text-[#6B1724] transition-colors font-bold block uppercase">
                Artisha
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#7E7873] uppercase block -mt-1 font-sans">
                Lahore • Atelier
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#1F1D1D]">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-[#6B1724] transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1 hover:text-[#6B1724] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account or Staff link */}
            {currentUser ? (
              <div className="relative group">
                <Link
                  href={isStaff ? '/admin' : '/account'}
                  className="flex items-center gap-1.5 p-1 hover:text-[#6B1724] transition-colors text-xs font-medium"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                  <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  {isStaff && (
                    <span className="bg-[#6B1724]/10 text-[#6B1724] text-[10px] font-semibold px-1.5 py-0.5 rounded ml-0.5">
                      Admin
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-1 hover:text-[#6B1724] transition-colors"
                aria-label="Account Login"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-1 hover:text-[#6B1724] transition-colors flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="py-4 border-t border-[#E6DFD5] animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search cashmere shawls, bridal peshwas, velvet kurtas, jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-24 py-2.5 bg-white border border-[#D4C5B3] rounded-sm text-sm focus:outline-none focus:border-[#6B1724] transition-all"
              />
              <Search className="w-4 h-4 text-[#7E7873] absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-[#6B1724] text-white text-xs px-4 py-1.5 rounded-sm hover:bg-[#500F1A] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E6DFD5] px-6 py-6 space-y-4">
          <div className="space-y-3 font-medium text-base">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Shop All Catalogue
            </Link>
            <Link
              href="/shop?category=pret-ready-to-wear"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Pret & Ready-to-Wear
            </Link>
            <Link
              href="/shop?category=luxury-festive"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Luxury Festive Couture
            </Link>
            <Link
              href="/shop?category=artisanal-shawls"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Artisanal Shawls & Stoles
            </Link>
            <Link
              href="/shop?category=handcrafted-accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Handcrafted Accessories & Bags
            </Link>
            <Link
              href="/shop?category=bespoke-jewelry"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Bespoke Jewelry
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Curated Collections
            </Link>
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Track Your Order
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              About Artisha
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1F1D1D] hover:text-[#6B1724]"
            >
              Dolmen Mall Lahore Flagship
            </Link>
          </div>

          <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-sm">
            {currentUser ? (
              <Link
                href={isStaff ? '/admin' : '/account'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#6B1724] font-medium"
              >
                {isStaff ? 'Open Admin Dashboard' : 'My Account & Orders'}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#6B1724] font-medium"
              >
                Sign In / Register
              </Link>
            )}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#7E7873]"
            >
              Wishlist ({wishlistCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
