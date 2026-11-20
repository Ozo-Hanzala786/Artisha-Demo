import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { BarChart3, TrendingUp, DollarSign, Download, ArrowRight, PieChart } from 'lucide-react';
import ReportsExportButton from '@/components/admin/ReportsExportButton';

export default async function AdminReportsPage() {
  const [orders, expenses, products, categories] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.expense.findMany(),
    prisma.product.findMany(),
    prisma.category.findMany({
      include: { products: true },
    }),
  ]);

  // Financial Calculations
  const nonCancelledOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
  const grossSales = nonCancelledOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscounts = nonCancelledOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const totalShipping = nonCancelledOrders.reduce((sum, o) => sum + o.shippingCost, 0);
  const netRevenue = grossSales - totalDiscounts + totalShipping;

  const totalRefunds = orders
    .filter((o) => o.orderStatus === 'REFUNDED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Cost of Goods Sold (COGS) based on actual product costPrice
  let totalCOGS = 0;
  nonCancelledOrders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const unitCost = prod?.costPrice || 0;
      totalCOGS += unitCost * item.quantity;
    });
  });

  const grossProfit = netRevenue - totalCOGS;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingProfit = grossProfit - totalExpenses;

  // Breakdown by payment method
  const paymentMethodBreakdown: { [key: string]: { count: number; volume: number } } = {};
  nonCancelledOrders.forEach((o) => {
    if (!paymentMethodBreakdown[o.paymentMethod]) {
      paymentMethodBreakdown[o.paymentMethod] = { count: 0, volume: 0 };
    }
    paymentMethodBreakdown[o.paymentMethod].count += 1;
    paymentMethodBreakdown[o.paymentMethod].volume += o.totalAmount;
  });

  // Breakdown by category
  const categoryBreakdown = categories.map((cat) => {
    let salesVolume = 0;
    nonCancelledOrders.forEach((o) => {
      o.items.forEach((item) => {
        const matches = cat.products.some((p) => p.id === item.productId);
        if (matches) salesVolume += item.subtotal;
      });
    });
    return { name: cat.name, salesVolume };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Financial Ledger &amp; P&amp;L Analysis
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Sales &amp; Financial Reports
          </h1>
          <p className="text-xs text-[#7E7873]">
            Verified gross revenue, actual cost of goods sold, overhead deductions, and net profit ledger.
          </p>
        </div>

        <ReportsExportButton
          grossSales={grossSales}
          totalDiscounts={totalDiscounts}
          netRevenue={netRevenue}
          totalCOGS={totalCOGS}
          totalExpenses={totalExpenses}
          netProfit={netOperatingProfit}
        />
      </div>

      {/* P&L Executive Statement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            1. Gross Sales Volume
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. {grossSales.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Before discounts &amp; shipping</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#6B1724] block">
            2. Net Realized Revenue
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#6B1724]">
            Rs. {netRevenue.toLocaleString()}
          </h3>
          <span className="text-[11px] text-emerald-700 font-medium">Discounts: -Rs. {totalDiscounts.toLocaleString()}</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            3. Cost of Goods (COGS)
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. {totalCOGS.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Raw materials &amp; fabric cost</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#85652E] block">
            4. Net Operating Margin
          </span>
          <h3 className={`font-serif-luxury text-2xl font-bold ${netOperatingProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
            Rs. {netOperatingProfit.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">After store rent &amp; expenses</span>
        </div>
      </div>

      {/* Comprehensive Statement Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs p-6 space-y-4">
        <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D] border-b border-[#F5EFE6] pb-3">
          Profit &amp; Loss Financial Breakdown (PKR)
        </h3>

        <div className="divide-y divide-[#F5EFE6] text-xs">
          <div className="py-2.5 flex justify-between">
            <span className="font-medium text-[#1F1D1D]">Gross Merchandise Value (GMV)</span>
            <span className="font-bold text-[#1F1D1D]">Rs. {grossSales.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between text-red-700">
            <span>Less: Promotional Coupons &amp; Concessions</span>
            <span>-Rs. {totalDiscounts.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between text-[#7E7873]">
            <span>Add: Shipping Freight Charges Recovered</span>
            <span>+Rs. {totalShipping.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between font-bold text-[#1F1D1D] bg-[#FAF8F5] px-2 rounded-xs">
            <span>Net Sales Revenue</span>
            <span className="text-[#6B1724]">Rs. {netRevenue.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between text-[#7E7873]">
            <span>Less: Cost of Goods Sold (Fabrics, Cashmere Wool, Artisan Tailoring)</span>
            <span>-Rs. {totalCOGS.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between font-bold text-[#1F1D1D] bg-[#FAF8F5] px-2 rounded-xs">
            <span>Gross Atelier Profit</span>
            <span className="text-emerald-800">Rs. {grossProfit.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between text-red-700">
            <span>Less: Store Rent (Dolmen Mall Lahore), Salaries, Courier Logistics</span>
            <span>-Rs. {totalExpenses.toLocaleString()}</span>
          </div>
          <div className="py-3 flex justify-between text-sm font-bold bg-[#FAF8F5] px-3 rounded-xs border-t-2 border-[#6B1724]">
            <span className="uppercase tracking-wider text-[#1F1D1D]">Net Operating Business Profit</span>
            <span className={netOperatingProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}>
              Rs. {netOperatingProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Payment Method Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs shadow-xs space-y-4">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] border-b border-[#F5EFE6] pb-2">
            Revenue by Payment Channel
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(paymentMethodBreakdown).map(([method, data]) => (
              <div key={method} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xs border border-[#E6DFD5]">
                <div>
                  <span className="font-bold text-[#1F1D1D] block">{method}</span>
                  <span className="text-[10px] text-[#7E7873]">{data.count} transactions</span>
                </div>
                <span className="font-bold text-[#6B1724]">
                  Rs. {data.volume.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs shadow-xs space-y-4">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] border-b border-[#F5EFE6] pb-2">
            Revenue by Category
          </h3>
          <div className="space-y-3 text-xs">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xs border border-[#E6DFD5]">
                <span className="font-bold text-[#1F1D1D]">{cat.name}</span>
                <span className="font-bold text-[#6B1724]">
                  Rs. {cat.salesVolume.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
