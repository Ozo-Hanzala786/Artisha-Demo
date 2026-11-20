import React from 'react';
import Link from 'next/link';

export default function FaqsPage() {
  const faqs = [
    {
      q: 'Where is Artisha located?',
      a: 'Our flagship physical boutique is located at Shop 104, First Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore, Pakistan. We also ship nationwide across all cities in Pakistan.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) across Pakistan, Direct Bank Transfer (IBFT) to our official Meezan Bank corporate account, and mobile wallet transfers via JazzCash and Easypaisa.',
    },
    {
      q: 'How long does nationwide delivery take?',
      a: 'Orders in Lahore are delivered within 1 to 2 business days (same-day delivery options available upon request). Nationwide orders (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, etc.) typically arrive within 2 to 4 business days via TCS or Leopards Courier.',
    },
    {
      q: 'Is shipping free?',
      a: 'Yes, we provide complimentary nationwide shipping on all orders totaling Rs. 10,000 or above. For orders under Rs. 10,000, standard delivery is Rs. 150 for Lahore and Rs. 250 for nationwide delivery.',
    },
    {
      q: 'Can I pick up my order in person from Dolmen Mall Lahore?',
      a: 'Yes, absolutely. During checkout, customers residing in Lahore can select "Self-Pickup at Flagship Boutique" to collect their packaged order free of shipping charges at Dolmen Mall Lahore.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer a 7-day exchange window from the date of parcel delivery. Unworn garments with intact tags and original velvet packaging can be exchanged for another size, style, or store credit.',
    },
    {
      q: 'Do you offer custom stitching or bespoke bridal services?',
      a: 'Yes. For our Luxury Festive and Bridal Peshwas collections, we offer bespoke custom measurements and bridal consultations at our Dolmen Mall boutique or via WhatsApp concierge.',
    },
    {
      q: 'How do I care for my Artisha pure cashmere pashminas and velvet tunics?',
      a: 'All our pashmina shawls, zardozi tunics, and silk pieces require professional dry cleaning only. Store them in breathable cotton or velvet bags away from moisture and direct sunlight.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Frequently Asked Questions</span>
      </div>

      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Customer Support
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-[#7E7873]">
          Everything you need to know about purchasing, shipping, and styling with Artisha.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-[#E6DFD5] rounded-xs p-6 space-y-2 shadow-xs">
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
              {faq.q}
            </h3>
            <p className="text-xs text-[#4A4644] leading-relaxed font-light">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF8F5] border border-[#E6DFD5] p-6 rounded-xs text-center space-y-3">
        <h4 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">Still have questions?</h4>
        <p className="text-xs text-[#7E7873]">
          Our client concierge is available daily on WhatsApp and telephone to assist you.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold px-6 py-2.5 rounded-xs"
        >
          Contact Atelier Concierge
        </Link>
      </div>
    </div>
  );
}
