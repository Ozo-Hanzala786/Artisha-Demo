import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CollectionsPage() {
  const collections = [
    {
      title: 'The Royal Polki & Kundan Suite',
      tagline: '22K Gold Plated Heirloom Ornaments',
      description: 'Inspired by Lahore Museum antiquities and Mughal miniature portraiture. Handcrafted Polki chokers, Kundan chandbalis, emerald meenakari rings, and cultured freshwater pearls.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=jewellery',
    },
    {
      title: 'Artisanal Velvet Potlis & Minaudières',
      tagline: 'Hand-Embroidered Zardozi & Raw Silk',
      description: 'Opulent crimson micro-velvet potli bags finished with baroque pearl tassels, alongside raw silk hard-case evening clutches featuring intricate floral tilla embroidery.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=accessories',
    },
    {
      title: 'Handmade Keepsakes & Vanity Trays',
      tagline: 'Chinioti Rosewood & Lapis Marble Inlay',
      description: 'Hand-chiseled sheesham jewellery boxes lined in plush velvet, Makrana white marble trays inlaid with genuine Afghan lapis lazuli, and hand-poured Taif rose brass candles.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=handmade-gifts',
    },
    {
      title: 'The Imperial Celebration Hampers',
      tagline: 'Curated Wedding & Festive Gift Crates',
      description: 'The ultimate bespoke gifting experience. Embossed velvet hampers pairing handcrafted Kundan jewellery, artisanal potlis, and scented soy candles with personalized calligraphy cards.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
      link: '/shop?category=gift-hampers',
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
