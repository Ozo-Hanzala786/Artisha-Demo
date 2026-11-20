import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ShopSortSelect from '@/components/ShopSortSelect';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const query = params.q?.trim();
  const sort = params.sort || 'newest';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const inStockOnly = params.inStock === 'true';

  // Build prisma query
  const where: any = {
    status: 'PUBLISHED',
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { sku: { contains: query } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'popularity') orderBy = { isBestseller: 'desc' };

  const [products, categories, currentCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    categorySlug
      ? prisma.category.findUnique({ where: { slug: categorySlug } })
      : null,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div className="border-b border-[#E6DFD5] pb-6">
        <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider mb-2">
          <Link href="/" className="hover:text-[#6B1724]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#6B1724]">Shop</Link>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-[#1F1D1D] font-medium">{currentCategory.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
              {currentCategory ? currentCategory.name : query ? `Search: "${query}"` : 'All Creations'}
            </h1>
            {currentCategory?.description && (
              <p className="text-sm text-[#7E7873] mt-1 max-w-2xl font-light">
                {currentCategory.description}
              </p>
            )}
          </div>
          <span className="text-xs text-[#7E7873] font-medium">
            Showing {products.length} {products.length === 1 ? 'creation' : 'creations'}
          </span>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F5EFE6] p-4 rounded-xs border border-[#E6DFD5] text-xs">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
          <Link
            href="/shop"
            className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap font-medium ${
              !categorySlug
                ? 'bg-[#6B1724] text-white'
                : 'bg-white text-[#1F1D1D] hover:bg-[#FAF8F5] border border-[#E6DFD5]'
            }`}
          >
            All Pieces
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap font-medium ${
                categorySlug === c.slug
                  ? 'bg-[#6B1724] text-white'
                  : 'bg-white text-[#1F1D1D] hover:bg-[#FAF8F5] border border-[#E6DFD5]'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Sort & In-Stock Filter */}
        <div className="flex items-center gap-3 ml-auto">
          <Link
            href={`/shop?${new URLSearchParams({
              ...(categorySlug ? { category: categorySlug } : {}),
              ...(query ? { q: query } : {}),
              ...(sort ? { sort } : {}),
              inStock: inStockOnly ? 'false' : 'true',
            }).toString()}`}
            className={`px-3 py-1.5 border rounded-xs transition-colors font-medium flex items-center gap-1.5 ${
              inStockOnly
                ? 'bg-[#6B1724] text-white border-[#6B1724]'
                : 'bg-white text-[#1F1D1D] border-[#E6DFD5] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>In Stock Only</span>
            {inStockOnly && <X className="w-3.5 h-3.5" />}
          </Link>

          <ShopSortSelect currentSort={sort} />
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-white border border-[#E6DFD5] rounded-xs p-8">
          <h3 className="font-serif-luxury text-2xl text-[#1F1D1D]">No creations matched your criteria</h3>
          <p className="text-xs text-[#7E7873] max-w-sm mx-auto">
            Try resetting your active filters or explore another artisanal category.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#500F1A] transition-colors"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
