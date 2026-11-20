import React from 'react';
import Link from 'next/link';

export default function ReturnsRefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Returns &amp; Refunds Policy</span>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Client Care &amp; Satisfaction
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Returns &amp; Exchange Policy
        </h1>
        <p className="text-xs text-[#7E7873]">
          Last revised: November 2026 • Artisha Flagship Boutique, Dolmen Mall Lahore
        </p>
      </div>

      <div className="bg-white border border-[#E6DFD5] p-6 sm:p-10 rounded-xs space-y-6 text-xs sm:text-sm text-[#4A4644] leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">1. 7-Day Exchange Window</h2>
          <p>
            At Artisha, we want you to be completely delighted with your creation. If you require a different size or wish to exchange for another piece, you may request an exchange within 7 calendar days of parcel delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">2. Exchange Conditions</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Garments must be unworn, unwashed, unaltered, and without fragrance or blemishes.</li>
            <li>Original Artisha brand tags, seals, and luxury dustbags/packaging must remain attached.</li>
            <li>Customized bridal peshwas or custom-tailored measurements are not eligible for standard return unless a manufacturing defect exists.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">3. In-Person Exchange at Dolmen Mall</h2>
          <p>
            Patrons in Lahore may bring their parcel directly to our flagship boutique at Shop 104, Dolmen Mall Lahore along with the order receipt for immediate exchange or boutique credit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">4. Damaged or Defective Items</h2>
          <p>
            In the rare event that an item arrives with an artisanal defect or damaged in courier transit, please notify our team within 48 hours via WhatsApp (+92 300 8472910) with photo evidence. We will arrange a priority reverse pickup and full replacement or refund.
          </p>
        </section>
      </div>
    </div>
  );
}
