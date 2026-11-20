import React from 'react';
import Link from 'next/link';

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Terms &amp; Conditions</span>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Legal Agreement
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Terms &amp; Conditions of Service
        </h1>
        <p className="text-xs text-[#7E7873]">
          Last revised: November 2026 • Artisha Private Limited, Lahore, Pakistan
        </p>
      </div>

      <div className="bg-white border border-[#E6DFD5] p-6 sm:p-10 rounded-xs space-y-6 text-xs sm:text-sm text-[#4A4644] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">1. Intellectual Property</h2>
          <p>
            All content on this site, including the Artisha brand mark, design motifs, garment photography, editorial copy, and multimedia assets, is the sole property of Artisha Private Limited and protected under Pakistani and international copyright laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">2. Pricing &amp; Currency</h2>
          <p>
            All prices are quoted in Pakistani Rupees (PKR) and include applicable domestic sales taxes unless specified otherwise. We reserve the right to correct accidental pricing errors before order fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">3. Handcraft Variations</h2>
          <p>
            Because our apparel, pashminas, and jewelry are individually crafted by hand, slight organic variations in weave texture, block-print alignment, and embroidery shades are inherent characteristics of authentic artisanal luxury.
          </p>
        </section>
      </div>
    </div>
  );
}
