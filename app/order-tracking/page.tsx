'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }
      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || 'Could not find order. Please verify your order reference.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      fetchOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = orderData ? steps.indexOf(orderData.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Live Logistics Status
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Track Your Order
        </h1>
        <p className="text-xs text-[#7E7873] max-w-md mx-auto">
          Enter your Artisha order number (e.g., ART-10021) to view real-time atelier processing, packing, and courier transit.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="max-w-lg mx-auto bg-white p-6 border border-[#E6DFD5] rounded-xs shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Order Number (e.g. ART-10021)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1 bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 text-xs uppercase font-medium rounded-xs focus:outline-none focus:border-[#6B1724]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {orderData && (
        <div className="bg-white border border-[#E6DFD5] rounded-xs p-6 sm:p-8 space-y-8 shadow-xs animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5EFE6] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7E7873] block font-semibold">
                Order Reference
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#6B1724]">
                {orderData.orderNumber}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#7E7873] block font-semibold">
                Current Status
              </span>
              <span className="inline-block bg-[#6B1724]/10 text-[#6B1724] font-bold px-3 py-1 rounded-xs text-xs mt-0.5">
                {orderData.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-4">
            <div className="relative flex items-center justify-between max-w-2xl mx-auto">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#E6DFD5] z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6B1724] z-0 transition-all duration-700"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#6B1724] text-white ring-4 ring-[#6B1724]/20 scale-110'
                          : isPassed
                          ? 'bg-[#6B1724] text-white'
                          : 'bg-[#E6DFD5] text-[#7E7873]'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold mt-2 text-center max-w-[60px] ${
                        isCurrent ? 'text-[#6B1724]' : isPassed ? 'text-[#1F1D1D]' : 'text-[#A89F91]'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Dispatch Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs text-xs">
            <div>
              <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Courier Partner</span>
              <span className="font-bold text-[#1F1D1D]">{orderData.courierName || 'Pending Courier Handover'}</span>
            </div>
            <div>
              <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Airway Bill / Tracking #</span>
              <span className="font-bold text-[#6B1724]">{orderData.trackingNumber || 'Tracking number will be assigned upon dispatch'}</span>
            </div>
            <div>
              <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Destination City</span>
              <span className="font-bold text-[#1F1D1D]">{orderData.city}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1F1D1D]">
              Items In This Package
            </h4>
            <div className="divide-y divide-[#F5EFE6] border-t border-b border-[#F5EFE6]">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-12 object-cover rounded-xs border border-[#E6DFD5]" />
                    )}
                    <div>
                      <span className="font-medium text-[#1F1D1D]">{item.name}</span>
                      <span className="text-[10px] text-[#7E7873] block">Qty: {item.quantity} • Rs. {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1F1D1D]">Rs. {item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financials & Delivery address */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs pt-2">
            <div>
              <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Delivery Address</span>
              <p className="text-[#1F1D1D] font-medium">{orderData.shippingAddress}, {orderData.city}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[#7E7873] block text-[10px] uppercase font-semibold">Total Amount</span>
              <span className="font-serif-luxury text-xl font-bold text-[#6B1724]">
                Rs. {orderData.totalAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#7E7873] block">Paid via {orderData.paymentMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-xs text-[#7E7873]">Loading order tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
