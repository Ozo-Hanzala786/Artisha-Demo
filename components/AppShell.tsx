'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <CartProvider>
      {isAdmin ? (
        <div className="min-h-screen bg-[#F5F2ED] text-[#1F1D1D]">{children}</div>
      ) : (
        <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1F1D1D]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </div>
      )}
    </CartProvider>
  );
}
