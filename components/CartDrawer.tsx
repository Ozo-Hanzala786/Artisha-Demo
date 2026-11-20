'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, error: true });
    }
    setCouponLoading(false);
  };

  // Free shipping progress
  const freeShippingThreshold = 10000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-[#7E7873]">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-[#7E7873] hover:text-[#1F1D1D] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E6DFD5]">
            <div className="flex justify-between items-center text-xs font-medium mb-1.5 text-[#1F1D1D]">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-[#6B1724]">Rs. {amountNeeded.toLocaleString()}</strong> more for complimentary delivery
                </span>
              ) : (
                <span className="text-[#6B1724] font-semibold">
                  You have unlocked Complimentary Delivery!
                </span>
              )}
              <span className="text-[11px] text-[#7E7873]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5DDD0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#6B1724] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#7E7873]">
                  <Tag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif-luxury text-lg text-[#1F1D1D]">Your bag is currently empty</h3>
                <p className="text-xs text-[#7E7873] max-w-xs mx-auto">
                  Explore our curated pret collections, authentic pashminas, and ceremonial ensembles.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-widest font-medium px-6 py-3 hover:bg-[#500F1A] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white border border-[#E6DFD5] rounded-sm shadow-xs"
                  >
                    <div className="w-20 h-24 relative bg-[#F5EFE6] shrink-0 rounded-xs overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7E7873]">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="text-sm font-medium text-[#1F1D1D] hover:text-[#6B1724] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#A89F91] hover:text-[#6B1724] transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variantName && (
                          <span className="text-[11px] text-[#7E7873] block mt-0.5">
                            {item.variantName}
                          </span>
                        )}
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xs font-semibold text-[#1F1D1D]">
                            Rs. {activePrice.toLocaleString()}
                          </span>
                          {item.salePrice && item.salePrice < item.price && (
                            <span className="text-[10px] text-[#A89F91] line-through">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EFE6]">
                        <div className="flex items-center border border-[#E6DFD5] rounded-xs bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-[#6B1724] transition-colors text-xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-[#1F1D1D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[#6B1724] transition-colors text-xs"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-[#6B1724]">
                          Rs. {(activePrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E6DFD5] space-y-3.5">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F8F1F2] border border-[#6B1724]/20 p-2.5 rounded-xs text-xs">
                    <div className="flex items-center gap-2 text-[#6B1724] font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} Applied</span>
                      {discountAmount > 0 && <span>(-Rs. {discountAmount.toLocaleString()})</span>}
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#7E7873] hover:text-[#6B1724] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. ARTISHA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[#6B1724] rounded-xs"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-[#1F1D1D] text-white text-xs px-3.5 py-1.5 hover:bg-[#6B1724] transition-colors rounded-xs disabled:opacity-50 font-medium"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.error ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#7E7873] pt-2 border-t border-[#F5EFE6]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1D1D]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#1F1D1D]">
                    {shippingCost === 0 ? (
                      <span className="text-[#6B1724] font-bold uppercase text-[10px]">Complimentary</span>
                    ) : (
                      `Rs. ${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F1D1D] pt-2 border-t border-[#E6DFD5]">
                  <span>Total (PKR)</span>
                  <span className="text-[#6B1724]">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-[#6B1724] hover:bg-[#500F1A] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#7E7873]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure Checkout • Cash on Delivery & Bank Transfer</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
