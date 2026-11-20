'use client';

import React from 'react';
import { Download, Printer } from 'lucide-react';

interface ReportsExportButtonProps {
  grossSales: number;
  totalDiscounts: number;
  netRevenue: number;
  totalCOGS: number;
  totalExpenses: number;
  netProfit: number;
}

export default function ReportsExportButton({
  grossSales,
  totalDiscounts,
  netRevenue,
  totalCOGS,
  totalExpenses,
  netProfit,
}: ReportsExportButtonProps) {
  const exportCSV = () => {
    const rows = [
      ['Metric', 'Amount (PKR)'],
      ['Gross Merchandise Value (GMV)', grossSales],
      ['Promotional Discounts & Coupons', -totalDiscounts],
      ['Net Realized Revenue', netRevenue],
      ['Cost of Goods Sold (COGS)', -totalCOGS],
      ['Operational & Lease Expenses', -totalExpenses],
      ['Net Operating Profit', netProfit],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_financial_pnl_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Statement</span>
      </button>
      <button
        onClick={exportCSV}
        className="inline-flex items-center gap-1.5 bg-[#6B1724] text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#500F1A] transition-colors shadow-xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export P&amp;L (CSV)</span>
      </button>
    </div>
  );
}
