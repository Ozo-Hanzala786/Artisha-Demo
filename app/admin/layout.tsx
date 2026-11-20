import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopNav from '@/components/admin/AdminTopNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role === 'CUSTOMER') {
    redirect('/login');
  }

  // Fetch unread notifications count
  const unreadNotificationsCount = await prisma.notification.count({
    where: { isRead: false },
  });

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1F1D1D] flex">
      {/* Sidebar Component */}
      <AdminSidebar user={user} unreadNotifications={unreadNotificationsCount} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopNav user={user} unreadNotifications={unreadNotificationsCount} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
