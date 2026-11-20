'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  Megaphone,
  Receipt,
  BarChart3,
  Shield,
  Bell,
  Globe,
  Truck,
  Settings,
  ScrollText,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  unreadNotifications: number;
}

export default function AdminSidebar({ user, unreadNotifications }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Discounts & Coupons', href: '/admin/discounts', icon: Tag },
    { name: 'Marketing & Reviews', href: '/admin/marketing', icon: Megaphone },
    { name: 'Expenses & Costs', href: '/admin/expenses', icon: Receipt },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { name: 'Staff & Roles', href: '/admin/staff', icon: Shield },
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
    { name: 'Website Content', href: '/admin/content', icon: Globe },
    { name: 'Shipping Settings', href: '/admin/shipping', icon: Truck },
    { name: 'General Settings', href: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#6B1724] text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1F1D1D] text-[#E8DFD5] flex flex-col border-r border-[#383330] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#383330] flex items-center justify-between">
          <Link href="/admin" className="block">
            <span className="font-serif-luxury text-2xl font-bold tracking-[0.18em] text-[#FAF8F5] uppercase">
              Artisha
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C2A26F] block">
              Business Suite • Lahore
            </span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-[#A89F91] hover:text-white transition-colors p-1"
            title="View Live Store"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* User Card */}
        <div className="px-5 py-3.5 bg-[#282523] border-b border-[#383330] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6B1724] text-white flex items-center justify-center font-bold text-xs uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#FAF8F5] truncate block">
              {user.name}
            </span>
            <span className="text-[10px] text-[#C2A26F] font-mono block">
              {user.role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xs transition-colors font-medium ${
                  isActive
                    ? 'bg-[#6B1724] text-white shadow-xs'
                    : 'text-[#A89F91] hover:bg-[#282523] hover:text-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#C2A26F] text-[#1F1D1D] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#383330] text-[11px] text-[#7E7873] flex items-center justify-between">
          <span>Dolmen Mall Atelier</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </aside>
    </>
  );
}
