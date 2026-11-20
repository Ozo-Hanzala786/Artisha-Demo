import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Package, MapPin, User, LogOut, ExternalLink, Clock, ShieldCheck, Heart } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [dbUser, orders, wishlistItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      include: { addresses: true },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { product: true },
    }),
  ]);

  const isStaff = user.role !== 'CUSTOMER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Artisha Patron Portal
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#7E7873] mt-1">{user.email} • Role: {user.role}</p>
        </div>

        <div className="flex items-center gap-3">
          {isStaff && (
            <Link
              href="/admin"
              className="bg-[#6B1724] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#500F1A] transition-colors"
            >
              Open Staff Management Panel
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orders History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#6B1724]" />
              <span>Your Orders ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-[#E6DFD5] p-8 text-center rounded-xs space-y-3">
              <Package className="w-10 h-10 text-[#A89F91] mx-auto opacity-40" />
              <p className="text-sm font-semibold text-[#1F1D1D]">You haven't placed any orders yet.</p>
              <p className="text-xs text-[#7E7873]">Explore our boutique collections and place your first order.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-xs mt-2"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-[#E6DFD5] rounded-xs p-5 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EFE6] pb-3 text-xs">
                    <div>
                      <span className="font-bold text-[#6B1724] text-sm block">{order.orderNumber}</span>
                      <span className="text-[#7E7873] text-[11px]">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-[#FAF8F5] text-[#1F1D1D] px-2.5 py-1 rounded-xs border border-[#E6DFD5] font-semibold text-[11px]">
                        Status: <strong className="text-[#6B1724]">{order.orderStatus}</strong>
                      </span>
                      <Link
                        href={`/order-tracking?order=${order.orderNumber}`}
                        className="text-[#6B1724] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Track</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#F5EFE6] text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-10 h-12 object-cover rounded-xs border border-[#E6DFD5]" />
                          )}
                          <div>
                            <span className="font-medium text-[#1F1D1D] block">{item.name}</span>
                            <span className="text-[11px] text-[#7E7873]">Qty: {item.quantity} • Rs. {item.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#1F1D1D]">Rs. {item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Courier */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#F5EFE6] text-xs">
                    <div className="text-[11px] text-[#7E7873]">
                      <span>Payment: {order.paymentMethod}</span>
                      {order.trackingNumber && (
                        <span className="ml-3 text-[#1F1D1D] font-medium">
                          Courier Tracking: {order.courierName} ({order.trackingNumber})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#7E7873] mr-2">Total Paid:</span>
                      <span className="text-sm font-bold text-[#6B1724]">Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profile & Addresses */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-4 shadow-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] flex items-center gap-2 border-b border-[#E6DFD5] pb-2">
              <User className="w-4 h-4 text-[#6B1724]" />
              <span>Patron Profile</span>
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Name</span>
                <span className="font-medium text-[#1F1D1D]">{user.name}</span>
              </div>
              <div>
                <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Email</span>
                <span className="font-medium text-[#1F1D1D]">{user.email}</span>
              </div>
              <div>
                <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-medium text-[#1F1D1D]">{dbUser?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-4 shadow-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] flex items-center gap-2 border-b border-[#E6DFD5] pb-2">
              <MapPin className="w-4 h-4 text-[#6B1724]" />
              <span>Saved Shipping Addresses</span>
            </h3>

            {dbUser?.addresses && dbUser.addresses.length > 0 ? (
              <div className="space-y-3">
                {dbUser.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1F1D1D]">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="bg-[#6B1724]/10 text-[#6B1724] text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[#4A4644]">{addr.recipientName}</p>
                    <p className="text-[#7E7873]">{addr.streetAddress}, {addr.city}</p>
                    <p className="text-[#7E7873]">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7E7873]">No addresses saved yet. Addresses are automatically saved upon checkout.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
