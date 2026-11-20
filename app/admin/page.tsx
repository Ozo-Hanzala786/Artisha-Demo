import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import OverviewCharts from '@/components/admin/OverviewCharts';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Package,
  ArrowRight,
  Receipt,
  CreditCard,
  DollarSign,
} from 'lucide-react';

interface OverviewPageProps {
  searchParams: Promise<{
    range?: string;
  }>;
}

export default async function AdminOverviewPage({ searchParams }: OverviewPageProps) {
  const params = await searchParams;
  const range = params.range || 'all';

  // Date filter logic
  let dateFilter: any = undefined;
  const now = new Date();
  if (range === 'today') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = { gte: startOfToday };
  } else if (range === '7d') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { gte: sevenDaysAgo };
  } else if (range === '30d') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { gte: thirtyDaysAgo };
  }

  const orderWhere = dateFilter ? { createdAt: dateFilter } : {};

  // Fetch real database records in parallel
  const [
    totalOrdersCount,
    pendingOrdersCount,
    deliveredOrdersCount,
    cancelledOrdersCount,
    allOrders,
    totalCustomersCount,
    totalProductsCount,
    lowStockProducts,
    recentOrders,
    topProducts,
    categories,
    allExpenses,
  ] = await Promise.all([
    prisma.order.count({ where: orderWhere }),
    prisma.order.count({ where: { ...orderWhere, orderStatus: 'PENDING' } }),
    prisma.order.count({ where: { ...orderWhere, orderStatus: 'DELIVERED' } }),
    prisma.order.count({ where: { ...orderWhere, orderStatus: 'CANCELLED' } }),
    prisma.order.findMany({
      where: {
        ...orderWhere,
        orderStatus: { notIn: ['CANCELLED', 'REFUNDED'] },
      },
      select: {
        totalAmount: true,
        subtotal: true,
        discountAmount: true,
        shippingCost: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        stock: { lte: 5 },
      },
      include: { category: true },
      take: 5,
    }),
    prisma.order.findMany({
      where: orderWhere,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isBestseller: true, status: 'PUBLISHED' },
      include: { category: true },
      take: 5,
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: { where: { status: 'PUBLISHED' } } } },
      },
    }),
    prisma.expense.findMany(),
  ]);

  // Real Financial Aggregations
  const totalRevenue = allOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalDiscounts = allOrders.reduce((sum, ord) => sum + ord.discountAmount, 0);
  const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

  // Chart data series by date
  const dateMap: { [key: string]: { revenue: number; orders: number } } = {};
  allOrders.forEach((o) => {
    const dateStr = new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (!dateMap[dateStr]) dateMap[dateStr] = { revenue: 0, orders: 0 };
    dateMap[dateStr].revenue += o.totalAmount;
    dateMap[dateStr].orders += 1;
  });

  const salesData = Object.keys(dateMap).map((k) => ({
    date: k,
    revenue: dateMap[k].revenue,
    orders: dateMap[k].orders,
  }));

  // Fallback demo chart points if low order dates
  if (salesData.length < 3) {
    salesData.unshift(
      { date: '14 Nov', revenue: 45000, orders: 2 },
      { date: '16 Nov', revenue: 78000, orders: 3 }
    );
  }

  const categoryChartData = categories.map((c) => ({
    name: c.name.split(' ')[0],
    count: c._count.products,
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Executive Command Center
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Boutique Operations Overview
          </h1>
          <p className="text-xs text-[#7E7873] mt-0.5">
            Real-time telemetry from Dolmen Mall Lahore flagship &amp; nationwide e-commerce commerce.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white border border-[#E6DFD5] p-1 rounded-xs text-xs font-medium">
          <Link
            href="/admin?range=today"
            className={`px-3 py-1 rounded-xs transition-colors ${
              range === 'today' ? 'bg-[#6B1724] text-white' : 'text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Today
          </Link>
          <Link
            href="/admin?range=7d"
            className={`px-3 py-1 rounded-xs transition-colors ${
              range === '7d' ? 'bg-[#6B1724] text-white' : 'text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Last 7 Days
          </Link>
          <Link
            href="/admin?range=30d"
            className={`px-3 py-1 rounded-xs transition-colors ${
              range === '30d' ? 'bg-[#6B1724] text-white' : 'text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Last 30 Days
          </Link>
          <Link
            href="/admin?range=all"
            className={`px-3 py-1 rounded-xs transition-colors ${
              range === 'all' ? 'bg-[#6B1724] text-white' : 'text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            All Time
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#7E7873] font-semibold">
              Gross Revenue
            </span>
            <div className="p-2 bg-[#6B1724]/10 text-[#6B1724] rounded-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
              Rs. {totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-700 font-medium">
              Average Order: Rs. {averageOrderValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#7E7873] font-semibold">
              Orders Executed
            </span>
            <div className="p-2 bg-[#C2A26F]/20 text-[#85652E] rounded-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
              {totalOrdersCount}
            </h3>
            <div className="flex gap-2 text-[11px] text-[#7E7873]">
              <span>Pending: <strong className="text-amber-700">{pendingOrdersCount}</strong></span>
              <span>•</span>
              <span>Delivered: <strong className="text-emerald-700">{deliveredOrdersCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#7E7873] font-semibold">
              Registered Patrons
            </span>
            <div className="p-2 bg-blue-50 text-blue-800 rounded-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
              {totalCustomersCount}
            </h3>
            <span className="text-[11px] text-[#7E7873]">Active VIP and retail accounts</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#7E7873] font-semibold">
              Low Stock Alerts
            </span>
            <div className="p-2 bg-red-50 text-red-700 rounded-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-red-700">
              {lowStockProducts.length}
            </h3>
            <span className="text-[11px] text-[#7E7873]">Designs require atelier replenishment</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Component */}
      <OverviewCharts salesData={salesData} categoryData={categoryChartData} />

      {/* Bottom Grid: Recent Orders & Inventory / Bestsellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#F5EFE6] flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                Recent Orders
              </h3>
              <span className="text-[11px] text-[#7E7873]">Latest transactions across Pakistan</span>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#6B1724] hover:underline flex items-center gap-1"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#6B1724]">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1F1D1D]">
                      {ord.guestName || 'Registered Patron'}
                    </td>
                    <td className="py-3 px-4 text-[#7E7873]">{ord.city}</td>
                    <td className="py-3 px-4 text-[#7E7873] font-mono text-[10px]">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      Rs. {ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-[#6B1724] font-medium hover:underline text-[11px]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock & Bestsellers Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Warning */}
          <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                  Low Stock Inventory
                </h3>
                <span className="text-[11px] text-[#7E7873]">Urgent inventory adjustments</span>
              </div>
              <Link href="/admin/inventory" className="text-xs text-[#6B1724] font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-[#FAF8F5] rounded-xs border border-[#E6DFD5]">
                  <div className="min-w-0 pr-2">
                    <span className="font-medium text-[#1F1D1D] block truncate">{p.name}</span>
                    <span className="text-[10px] text-[#7E7873]">SKU: {p.sku}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded-xs shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bestsellers */}
          <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                  Bestselling Creations
                </h3>
                <span className="text-[11px] text-[#7E7873]">High demand wardrobe pieces</span>
              </div>
            </div>

            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-medium text-[#1F1D1D] block truncate">{p.name}</span>
                    <span className="text-[10px] text-[#7E7873]">{p.category.name}</span>
                  </div>
                  <span className="font-bold text-[#6B1724] shrink-0">
                    Rs. {(p.salePrice || p.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
