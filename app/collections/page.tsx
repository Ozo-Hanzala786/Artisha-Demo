import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CollectionsPage() {
  const collections = [
    {
      title: 'Autumn / Winter 2026: The Velvet Atelier',
      tagline: 'Signature Micro-Velvet & Antique Dabka',
      description: 'Opulent deep crimson and jewel-toned ensembles embellished with traditional kora, dabka, and pearl borders. Designed for winter soirees and festive gatherings in Lahore.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=pret-ready-to-wear',
    },
    {
      title: 'Royal Lahore Festive & Bridal Edit',
      tagline: 'Heirloom Kalidars & Zardozi Peshwas',
      description: 'Handcrafted over months by senior master embroiderers using French knots, marori wire, and semi-precious emerald inlays on authentic 80-gram raw silk.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=luxury-festive',
    },
    {
      title: 'The Kashmir Pashmina & Kalamkari Stoles',
      tagline: 'Pure Handwoven Himalayan Cashmere',
      description: 'Featherlight pure cashmere wool blankets and stoles featuring needlework Aari embroidery and miniature Mughal courtyard motifs.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=artisanal-shawls',
    },
    {
      title: 'Heirloom Polki & Filigree Jewelry',
      tagline: '22K Gold Plated Heritage Ornaments',
      description: 'Inspired by Lahore Museum antiquities and Mughal miniature portraiture. Kundan chokers, silver jhumkas, and freshwater pearls.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=bespoke-jewelry',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Collections</span>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#6B1724]/10 text-[#6B1724] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Lookbooks</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1F1D1D]">
          Artisha Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7873] leading-relaxed">
          Thematic chapters of Pakistani haute craft, inspired by the poetry of Lahore and the ancestral looms of our artisans.
        </p>
      </div>

      <div className="space-y-12">
        {collections.map((col, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E6DFD5] rounded-xs overflow-hidden shadow-xs ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[#F5EFE6] ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className={`lg:col-span-5 p-8 sm:p-12 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C2A26F] font-semibold block">
                {col.tagline}
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
                {col.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4644] leading-relaxed font-light">
                {col.description}
              </p>
              <div className="pt-2">
                <Link
                  href={col.link}
                  className="inline-flex items-center gap-2 bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors rounded-xs shadow-xs"
                >
                  <span>Explore The Lookbook</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
