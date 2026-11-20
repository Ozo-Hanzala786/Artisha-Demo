'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCity,
    setShippingCity,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
    setCouponLoading(false);
  };

  const pakistaniCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Shopping Bag</span>
      </div>

      <div className="flex items-baseline justify-between">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Your Shopping Bag
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-[#7E7873] hover:text-[#6B1724] underline transition-colors"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E6DFD5] rounded-xs space-y-5 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#7E7873]">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <h2 className="font-serif-luxury text-2xl text-[#1F1D1D]">Your shopping bag is empty</h2>
          <p className="text-xs text-[#7E7873] max-w-sm mx-auto">
            Discover our collection of artisanal pret, ceremonial peshwas, and pure cashmere shawls.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 hover:bg-[#500F1A] transition-colors"
          >
            Explore Atelier Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#E6DFD5] rounded-xs divide-y divide-[#E6DFD5]">
              {items.map((item) => {
                const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                    <div className="w-24 h-32 relative bg-[#F5EFE6] rounded-xs overflow-hidden shrink-0 border border-[#E6DFD5]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-serif-luxury text-base font-bold text-[#1F1D1D] hover:text-[#6B1724] transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <span className="text-xs text-[#7E7873] block">{item.variantName}</span>
                      )}
                      <span className="text-[11px] text-[#A89F91] block">SKU: {item.sku}</span>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#6B1724]">
                          Rs. {activePrice.toLocaleString()}
                        </span>
                        {item.salePrice && item.salePrice < item.price && (
                          <span className="text-xs text-[#A89F91] line-through">
                            Rs. {item.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <div className="flex items-center border border-[#D4C5B3] rounded-xs bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs hover:text-[#6B1724] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#1F1D1D]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs hover:text-[#6B1724] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1F1D1D] block">
                          Rs. {(activePrice * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-[#A89F91] hover:text-[#6B1724] underline transition-colors mt-1 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider text-[#6B1724] hover:text-[#500F1A] font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs space-y-5 shadow-xs">
              <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-3">
                Order Summary
              </h2>

              {/* Destination City Selection */}
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Delivery Destination
                </label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                >
                  {pakistaniCities.map((city) => (
                    <option key={city} value={city}>
                      {city} {city === 'Lahore' ? '(Flagship City • Rs. 150)' : '(Nationwide • Rs. 250)'}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7E7873] block mt-1">
                  Complimentary nationwide delivery on orders over Rs. 10,000.
                </span>
              </div>

              {/* Coupon Form */}
              <div className="pt-2 border-t border-[#F5EFE6]">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1.5">
                  Promotional Coupon
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F8F1F2] border border-[#6B1724]/20 p-2.5 rounded-xs text-xs">
                    <div className="flex items-center gap-1.5 text-[#6B1724] font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} Applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-[#7E7873] hover:text-[#6B1724] underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ARTISHA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#6B1724] rounded-xs"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-[#1F1D1D] text-white text-xs px-4 py-2 hover:bg-[#6B1724] transition-colors rounded-xs disabled:opacity-50 font-medium"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] mt-1 ${couponMsg.error ? 'text-red-600' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#4A4644] pt-2 border-t border-[#F5EFE6]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1D1D]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery ({shippingCity})</span>
                  <span className="font-semibold text-[#1F1D1D]">
                    {shippingCost === 0 ? (
                      <span className="text-[#6B1724] font-bold uppercase text-[10px]">Complimentary</span>
                    ) : (
                      `Rs. ${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1F1D1D] pt-3 border-t border-[#E6DFD5]">
                  <span>Total Amount</span>
                  <span className="text-[#6B1724]">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  className="w-full bg-[#6B1724] hover:bg-[#500F1A] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#7E7873] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure SSL Checkout • Pakistan Nationwide Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
