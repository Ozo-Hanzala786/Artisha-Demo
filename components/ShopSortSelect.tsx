'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export default function ShopSortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams(searchParams?.toString() || '');
    sp.set('sort', e.target.value);
    router.push(`/shop?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-[#E6DFD5] px-3 py-1.5 rounded-xs">
      <ArrowUpDown className="w-3.5 h-3.5 text-[#7E7873]" />
      <select
        value={currentSort}
        onChange={handleSortChange}
        aria-label="Sort creations by"
        className="bg-transparent text-xs text-[#1F1D1D] focus:outline-none cursor-pointer"
      >
        <option value="newest">Sort: Newest First</option>
        <option value="popularity">Sort: Popularity / Bestseller</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
