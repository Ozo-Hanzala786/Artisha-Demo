'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ExternalLink, LogOut, Store } from 'lucide-react';

interface AdminTopNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  unreadNotifications: number;
}

export default function AdminTopNav({ user, unreadNotifications }: AdminTopNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-[#E6DFD5] px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider font-bold text-[#6B1724]">
          Artisha Management Suite
        </span>
        <span className="hidden sm:inline text-xs text-[#7E7873]">•</span>
        <span className="hidden sm:inline text-xs text-[#7E7873]">
          Boutique 104, Dolmen Mall Lahore
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* View Store */}
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-[#1F1D1D] hover:text-[#6B1724] transition-colors flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E6DFD5] px-3 py-1.5 rounded-xs"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Live Website</span>
          <ExternalLink className="w-3 h-3 text-[#7E7873]" />
        </Link>

        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="relative p-2 text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 bg-[#6B1724] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="p-2 text-[#7E7873] hover:text-[#6B1724] transition-colors"
          title="Sign out of Admin Suite"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
