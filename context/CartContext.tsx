'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, CouponValidationResult } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  appliedCoupon: CouponValidationResult | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  shippingCity: string;
  setShippingCity: (city: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'artisha_cart_v1';
const WISHLIST_STORAGE_KEY = 'artisha_wishlist_v1';
const COUPON_STORAGE_KEY = 'artisha_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [shippingCity, setShippingCity] = useState<string>('Lahore');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load persisted state
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) setItems(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setMounted(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon, mounted]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + (newItem.quantity || 1), newItem.maxStock || 99);
        return prev.map((i) => (i.id === newItem.id ? { ...i, quantity: updatedQty } : i));
      }
      return [...prev, newItem];
    });
    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const validQty = Math.min(quantity, i.maxStock || 99);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
      return sum + activePrice * item.quantity;
    }, 0);
  }, [items]);

  // Shipping cost computation
  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    // Free shipping threshold over 10,000 or coupon
    if (appliedCoupon?.discountType === 'FREE_SHIPPING') return 0;
    if (subtotal >= 10000) return 0;
    if (shippingCity.toLowerCase() === 'lahore') return 150;
    return 250;
  }, [items.length, subtotal, shippingCity, appliedCoupon]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || !appliedCoupon.valid) return 0;
    if (appliedCoupon.discountType === 'PERCENTAGE' && appliedCoupon.value) {
      const calculated = (subtotal * appliedCoupon.value) / 100;
      return Math.round(calculated);
    }
    if (appliedCoupon.discountType === 'FIXED' && appliedCoupon.value) {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        return { success: true, message: `Coupon ${code.toUpperCase()} applied successfully!` };
      }
      return { success: false, message: data.message || 'Invalid or expired coupon code' };
    } catch {
      return { success: false, message: 'Could not validate coupon. Please try again.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
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
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
