'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch(`/api/products/batch?ids=${wishlist.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlist]);

  const handleMoveToCart = (product: any) => {
    const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: images[0] || '',
      quantity: 1,
      sku: product.sku,
      maxStock: product.stock,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Your Wishlist</span>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
            Curated Wishlist
          </h1>
          <p className="text-xs text-[#7E7873] mt-1">Pieces you've admired and reserved for later.</p>
        </div>
        <span className="text-xs font-semibold text-[#7E7873]">
          {wishlist.length} {wishlist.length === 1 ? 'creation' : 'creations'}
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#7E7873]">Loading your saved pieces...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-[#E6DFD5] p-16 text-center rounded-xs space-y-4">
          <Heart className="w-12 h-12 text-[#A89F91] mx-auto opacity-40" />
          <h2 className="font-serif-luxury text-2xl text-[#1F1D1D]">Your wishlist is empty</h2>
          <p className="text-xs text-[#7E7873] max-w-sm mx-auto">
            Click the heart icon on any creation in our catalog to save it to your private wishlist.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 hover:bg-[#500F1A] transition-colors"
          >
            Explore Creations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
            const primaryImage = images[0] || '';
            const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

            return (
              <div key={product.id} className="bg-white border border-[#E6DFD5] rounded-xs overflow-hidden flex flex-col justify-between group shadow-xs">
                <div className="relative aspect-[3/4] bg-[#F5EFE6] overflow-hidden">
                  <img src={primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 rounded-full hover:bg-white text-[#6B1724] shadow-xs"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7E7873] block">{product.category?.name}</span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif-luxury text-sm font-semibold text-[#1F1D1D] hover:text-[#6B1724] transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs font-bold text-[#6B1724] block mt-1">
                      Rs. {activePrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-[#1F1D1D] hover:bg-[#6B1724] text-white py-2 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-xs disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{product.stock > 0 ? 'Move to Bag' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
