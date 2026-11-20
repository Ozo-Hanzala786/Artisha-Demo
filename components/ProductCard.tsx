'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    images: string; // JSON string or array
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    category?: {
      name: string;
      slug: string;
    };
    variants?: any[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();

  let imagesList: string[] = [];
  try {
    imagesList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    imagesList = [];
  }

  const primaryImage = imagesList[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800';
  const secondaryImage = imagesList[1] || primaryImage;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: primaryImage,
      quantity: 1,
      sku: product.sku,
      maxStock: product.stock,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col luxury-card-hover bg-white border border-[#EBE4DB] rounded-sm overflow-hidden">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#F5EFE6]">
        {/* Main Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
          loading="lazy"
        />
        {/* Hover Secondary Image */}
        <img
          src={secondaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-0 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-[#6B1724] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#1F1D1D] text-[#FAF8F5] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#C2A26F] text-[#1F1D1D] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
              Special Price
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-700 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-[#6B1724] text-white shadow-md'
              : 'bg-white/80 text-[#1F1D1D] hover:bg-white hover:text-[#6B1724]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay Button */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[#1F1D1D]/90 hover:bg-[#6B1724] text-white py-2.5 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors rounded-xs shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add to Bag</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[10px] uppercase tracking-widest text-[#7E7873] block mb-1">
              {product.category.name}
            </span>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="font-serif-luxury text-sm font-semibold text-[#1F1D1D] group-hover:text-[#6B1724] transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-[#6B1724]">
                Rs. {product.salePrice?.toLocaleString()}
              </span>
              <span className="text-xs text-[#7E7873] line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#1F1D1D]">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
