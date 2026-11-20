import React from 'react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Shipping &amp; Delivery Policy</span>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Nationwide Logistics
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-[#7E7873]">
          Last revised: November 2026 • Artisha Flagship Boutique, Dolmen Mall Lahore
        </p>
      </div>

      <div className="bg-white border border-[#E6DFD5] p-6 sm:p-10 rounded-xs space-y-6 text-xs sm:text-sm text-[#4A4644] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">1. Dispatch Origins</h2>
          <p>
            All online orders placed through Artisha are carefully inspected, hand-packed in our signature dustbags or velvet gift boxes, and dispatched from our primary fulfillment center at Dolmen Mall, DHA Phase 6, Lahore.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">2. Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Lahore Metropolitan Area:</strong> 1 to 2 business days. Same-day express dispatch can be coordinated through our WhatsApp concierge.</li>
            <li><strong>Major Urban Centers (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan):</strong> 2 to 3 business days via TCS or Leopards Courier.</li>
            <li><strong>Other Cities &amp; Remote Districts:</strong> 3 to 5 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">3. Delivery Tariffs</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Complimentary Nationwide Delivery:</strong> Applicable on all domestic orders of Rs. 10,000 and above.</li>
            <li><strong>Standard Lahore Delivery:</strong> Flat rate of Rs. 150 for orders below Rs. 10,000.</li>
            <li><strong>Nationwide Courier Delivery:</strong> Flat rate of Rs. 250 for orders below Rs. 10,000.</li>
            <li><strong>Dolmen Mall Flagship Store Pickup:</strong> Free of charge.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">4. Order Tracking</h2>
          <p>
            Upon courier handover, an automated tracking number (Airway Bill) is assigned to your order. You can track your shipment status in real time on our website using the <Link href="/order-tracking" className="text-[#6B1724] underline">Track Order</Link> portal.
          </p>
        </section>
      </div>
    </div>
  );
}
