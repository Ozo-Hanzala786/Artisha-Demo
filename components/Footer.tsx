'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1F1D1D] text-[#E8DFD5] pt-16 pb-12 border-t border-[#383330]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#383330]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-3xl tracking-[0.2em] text-[#FAF8F5] uppercase font-bold block">
                Artisha
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#C2A26F] uppercase block mt-1">
                Atelier • Lahore
              </span>
            </Link>
            <p className="text-sm text-[#A89F91] leading-relaxed max-w-sm">
              Artisha celebrates indigenous Pakistani craft heritage through meticulously tailored luxury pret, ceremonial festive couture, pure pashminas, and handcrafted heirloom jewelry.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#C5BDB2]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C2A26F] shrink-0 mt-0.5" />
                <span>Shop 104, 1st Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C2A26F] shrink-0" />
                <span>+92 300 8472910 / +92 42 37189000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C2A26F] shrink-0" />
                <span>Monday – Sunday: 11:00 AM – 11:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C2A26F] shrink-0" />
                <span>concierge@artisha.pk</span>
              </div>
            </div>
          </div>

          {/* Collections & Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89F91]">
              <li>
                <Link href="/shop?category=pret-ready-to-wear" className="hover:text-[#FAF8F5] transition-colors">
                  Pret & Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=luxury-festive" className="hover:text-[#FAF8F5] transition-colors">
                  Luxury Festive Couture
                </Link>
              </li>
              <li>
                <Link href="/shop?category=artisanal-shawls" className="hover:text-[#FAF8F5] transition-colors">
                  Artisanal Shawls & Stoles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=handcrafted-accessories" className="hover:text-[#FAF8F5] transition-colors">
                  Handcrafted Potlis & Bags
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bespoke-jewelry" className="hover:text-[#FAF8F5] transition-colors">
                  Polki & Silver Jewelry
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#FAF8F5] transition-colors">
                  Featured Lookbooks
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#FAF8F5] transition-colors">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Service */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89F91]">
              <li>
                <Link href="/order-tracking" className="hover:text-[#FAF8F5] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FAF8F5] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-[#FAF8F5] transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#FAF8F5] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAF8F5] transition-colors">
                  The Artisha Atelier
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FAF8F5] transition-colors">
                  Dolmen Mall Boutique
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FAF8F5] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#FAF8F5] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Atelier Notes */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] mb-4">
              The Atelier Gazette
            </h4>
            <p className="text-xs text-[#A89F91] leading-relaxed mb-4">
              Receive private invitations to seasonal trunk shows, new collection previews, and artisanal stories.
            </p>
            {subscribed ? (
              <div className="bg-[#2D2826] p-3 rounded text-xs text-[#C2A26F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you. You are now subscribed to the Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2A2624] border border-[#403B38] text-xs text-white px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-[#C2A26F] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bg-[#6B1724] text-white p-1.5 rounded-sm hover:bg-[#80142B] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#7E7873] block">
                  We respect your privacy. Unsubscribe at any time.
                </span>
              </form>
            )}

            <div className="pt-6">
              <span className="text-[11px] uppercase tracking-wider text-[#FAF8F5] font-semibold block mb-2.5">
                Connect With Artisha
              </span>
              <div className="flex items-center space-x-3 text-[#A89F91]">
                <a
                  href="https://instagram.com/artisha.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#2A2624] rounded-full hover:text-[#FAF8F5] hover:bg-[#6B1724] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/artishapakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#2A2624] rounded-full hover:text-[#FAF8F5] hover:bg-[#6B1724] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/923008472910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#2A2624] rounded-full hover:text-[#FAF8F5] hover:bg-[#6B1724] transition-colors text-xs font-bold"
                  aria-label="WhatsApp"
                >
                  WA
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#7E7873] gap-4">
          <p>© 2026 Artisha Private Limited. All rights reserved. Flagship Boutique at Dolmen Mall Lahore.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-[#A89F91]">Cash on Delivery • Direct Bank Transfer • JazzCash • Easypaisa</span>
            <Link href="/admin" className="text-[#A89F91] hover:text-[#FAF8F5] transition-colors underline">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
