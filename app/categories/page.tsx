import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { products: { where: { status: 'PUBLISHED' } } },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Categories</span>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Atelier Categories
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1F1D1D]">
          Artisha Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7873] leading-relaxed">
          From heirloom Polki jewellery and embroidered velvet potlis to handcrafted sheesham keepsakes and bespoke gift hampers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-xs bg-[#F5EFE6] border border-[#E6DFD5] shadow-xs"
          >
            <img
              src={cat.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A26F] font-semibold block">
                {cat._count.products} {cat._count.products === 1 ? 'Design' : 'Designs'}
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold group-hover:text-[#FAF8F5] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#D4C5B3] line-clamp-2 font-light">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] group-hover:text-[#C2A26F] transition-colors">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
