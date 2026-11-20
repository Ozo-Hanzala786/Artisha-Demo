'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface OverviewChartsProps {
  salesData: { date: string; revenue: number; orders: number }[];
  categoryData: { name: string; count: number }[];
}

export default function OverviewCharts({ salesData, categoryData }: OverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Revenue Over Time Chart */}
      <div className="lg:col-span-8 bg-white border border-[#E6DFD5] p-5 sm:p-6 rounded-xs shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
              Sales &amp; Revenue Velocity
            </h3>
            <span className="text-[11px] text-[#7E7873]">Gross domestic order proceeds (PKR)</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B1724" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6B1724" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6DFD5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#7E7873' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#7E7873' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `Rs.${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1D1D',
                  color: '#FAF8F5',
                  borderRadius: '2px',
                  border: 'none',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6B1724"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="lg:col-span-4 bg-white border border-[#E6DFD5] p-5 sm:p-6 rounded-xs shadow-xs space-y-4">
        <div className="border-b border-[#F5EFE6] pb-3">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
            Catalogue Allocation
          </h3>
          <span className="text-[11px] text-[#7E7873]">Products count per artisanal category</span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6DFD5" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7E7873' }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fill: '#1F1D1D' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1D1D',
                  color: '#FAF8F5',
                  borderRadius: '2px',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#C2A26F" radius={[0, 2, 2, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
