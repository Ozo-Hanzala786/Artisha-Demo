import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Privacy Policy</span>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Data Protection
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#7E7873]">
          Last revised: November 2026 • Artisha Private Limited
        </p>
      </div>

      <div className="bg-white border border-[#E6DFD5] p-6 sm:p-10 rounded-xs space-y-6 text-xs sm:text-sm text-[#4A4644] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">1. Information We Collect</h2>
          <p>
            When you browse Artisha or place an order, we collect essential transactional data including your name, delivery address, contact phone number, and email address. We do not store sensitive payment card details on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">2. How We Utilize Your Data</h2>
          <p>
            Your information is used strictly to fulfill online purchases, coordinate nationwide delivery with our approved courier partners (e.g. TCS, Leopards), provide order status updates via SMS/WhatsApp, and provide client concierge support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">3. Data Security</h2>
          <p>
            All communications and transactions are encrypted using Industry Standard Transport Layer Security (TLS/SSL). We never sell, lease, or monetize customer data to third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
}
