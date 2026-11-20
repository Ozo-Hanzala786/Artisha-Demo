import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Package, ExternalLink, ArrowLeft } from 'lucide-react';

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <Link href="/account" className="hover:text-[#6B1724]">Account</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Order History</span>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#1F1D1D]">
            Order History
          </h1>
          <p className="text-xs text-[#7E7873] mt-1">Review all your previous Artisha purchases and delivery tracking.</p>
        </div>
        <Link href="/account" className="text-xs font-semibold text-[#6B1724] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E6DFD5] p-12 text-center rounded-xs space-y-3">
          <Package className="w-12 h-12 text-[#A89F91] mx-auto opacity-40" />
          <p className="text-base font-semibold text-[#1F1D1D]">No orders recorded under this account.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-xs mt-2"
          >
            Explore Atelier Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E6DFD5] rounded-xs p-6 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5EFE6] pb-3 text-xs">
                <div>
                  <span className="font-bold text-[#6B1724] text-base block">{order.orderNumber}</span>
                  <span className="text-[#7E7873] text-[11px]">
                    Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#FAF8F5] text-[#1F1D1D] px-3 py-1 rounded-xs border border-[#E6DFD5] font-semibold text-xs">
                    Status: <strong className="text-[#6B1724]">{order.orderStatus}</strong>
                  </span>
                  <Link
                    href={`/order-tracking?order=${order.orderNumber}`}
                    className="bg-[#6B1724] text-white px-3 py-1 text-xs font-medium rounded-xs hover:bg-[#500F1A] transition-colors flex items-center gap-1"
                  >
                    <span>Track Order</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-[#F5EFE6] text-xs">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-14 object-cover rounded-xs border border-[#E6DFD5]" />
                      )}
                      <div>
                        <span className="font-medium text-[#1F1D1D] text-sm block">{item.name}</span>
                        <span className="text-[11px] text-[#7E7873]">SKU: {item.sku} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#1F1D1D]">Rs. {item.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#F5EFE6] flex flex-wrap items-center justify-between text-xs">
                <span className="text-[#7E7873]">
                  Delivering to: <strong className="text-[#1F1D1D]">{order.shippingAddress}, {order.city}</strong>
                </span>
                <span className="text-sm font-bold text-[#6B1724]">
                  Total: Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
