import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Award, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative py-24 bg-[#1F1D1D] text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1600"
            alt="Artisha Atelier Lahore"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1D] via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C2A26F] font-semibold block">
            Our Heritage &amp; Ethos
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold">
            The Story of Artisha
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C5B3] leading-relaxed font-light max-w-xl mx-auto">
            Born out of a profound reverence for ancient Pakistani embroidery and weaving arts, Artisha bridges heirloom ateliers with modern luxury aesthetics.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-[#4A4644] leading-relaxed font-light">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block">
              The Atelier Genesis
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
              Preserving Living Craft Traditions
            </h2>
            <p>
              Artisha was founded in Lahore with a singular conviction: that traditional craftsmanship should not be an endangered relic of museum archives, but a thriving, luxurious reality celebrated every day.
            </p>
            <p>
              We curate and handcraft three foundational pillars: <strong>Heirloom Jewellery</strong> (Polki chokers, Kundan chandbalis, 925 sterling silver filigree), <strong>Bespoke Accessories</strong> (hand-zardozi velvet potlis, raw silk minaudières, hair jewellery), and <strong>Artisanal Handmade Gifts</strong> (hand-carved sheesham keepsakes, lapis lazuli marble trays, hammered brass candles).
            </p>
            <p>
              Every piece in our boutique is shaped by multigenerational silversmiths, embroiderers, and inlay masters across Lahore, Multan, Taxila, and Chiniot.
            </p>
          </div>

          <div className="relative aspect-[4/5] rounded-xs overflow-hidden bg-[#F5EFE6] border border-[#E6DFD5] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
              alt="Artisha Master Jewellery & Keepsake Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white border border-[#E6DFD5] rounded-xs space-y-2 shadow-xs">
            <Award className="w-6 h-6 text-[#6B1724]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">Authentic Materials</h3>
            <p className="text-xs text-[#7E7873] leading-relaxed">
              We exclusively use 22K gold plating, hallmarked 925 silver, natural cultured pearls, uncut polki stones, Makrana marble, and pure sheesham wood.
            </p>
          </div>
          <div className="p-6 bg-white border border-[#E6DFD5] rounded-xs space-y-2 shadow-xs">
            <Users className="w-6 h-6 text-[#6B1724]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">Master Artisan Guild</h3>
            <p className="text-xs text-[#7E7873] leading-relaxed">
              Our direct relationships with master silversmiths, zardozi needleworkers, and Chinioti woodcarvers ensure ethical compensation and fair trade.
            </p>
          </div>
          <div className="p-6 bg-white border border-[#E6DFD5] rounded-xs space-y-2 shadow-xs">
            <Heart className="w-6 h-6 text-[#6B1724]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">Bespoke Keepsakes</h3>
            <p className="text-xs text-[#7E7873] leading-relaxed">
              Designed as meaningful gifts and heirloom treasures to be cherished, preserved, and handed down across family generations.
            </p>
          </div>
        </div>

        {/* Flagship Presence */}
        <div className="bg-[#FAF8F5] border border-[#E6DFD5] p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#6B1724] font-bold">
              Flagship Experience
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
              Visit Us at Dolmen Mall Lahore
            </h3>
            <p className="text-xs text-[#7E7873] max-w-lg">
              Explore our physical boutique at Shop 104, 1st Floor, Dolmen Mall DHA Phase 6, Lahore. Book a bespoke bridal appointment or experience our textures in person.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors shrink-0"
          >
            Store Details &amp; Hours
          </Link>
        </div>
      </section>
    </div>
  );
}
