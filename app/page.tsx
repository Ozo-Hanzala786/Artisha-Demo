import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Sparkles, MapPin, Phone, Clock, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default async function HomePage() {
  const [categories, bestsellers, newArrivals, reviews] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isBestseller: true, status: 'PUBLISHED' },
      take: 4,
      include: { category: true },
    }),
    prisma.product.findMany({
      where: { isNewArrival: true, status: 'PUBLISHED' },
      take: 4,
      include: { category: true },
    }),
    prisma.review.findMany({
      where: { status: 'APPROVED' },
      take: 3,
      include: { product: true },
    }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1F1D1D] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=2000"
            alt="Artisha Autumn Winter Atelier"
            className="w-full h-full object-cover object-center opacity-45 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1D] via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 bg-[#6B1724]/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.25em] text-[#FAF8F5] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A26F]" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-[#FAF8F5]">
            The Poetry of <br />
            <span className="italic font-normal text-[#E8DFD5]">Pakistani Craftsmanship</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D4C5B3] max-w-xl mx-auto leading-relaxed font-light">
            Artisanal pret, regal festive couture, and authentic Himalayan pashminas tailored for the discerning modern connoisseur.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-[#6B1724] hover:bg-[#80142B] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-lg hover:shadow-[#6B1724]/20 flex items-center justify-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center"
            >
              Visit Lahore Boutique
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6 bg-[#F5EFE6] rounded-xs border border-[#E6DFD5]">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-[#6B1724] shrink-0 stroke-[1.5]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1D]">Artisanal Atelier</h4>
              <p className="text-[11px] text-[#7E7873]">Master hand-embellished craft</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-[#6B1724] shrink-0 stroke-[1.5]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1D]">Nationwide Dispatch</h4>
              <p className="text-[11px] text-[#7E7873]">Free shipping on orders &gt; Rs. 10k</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#6B1724] shrink-0 stroke-[1.5]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1D]">Flagship Retail</h4>
              <p className="text-[11px] text-[#7E7873]">Dolmen Mall, DHA Lahore</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#6B1724] shrink-0 stroke-[1.5]" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1D]">Hassle-Free Returns</h4>
              <p className="text-[11px] text-[#7E7873]">7-day exchange guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DFD5] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1F1D1D]">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs uppercase tracking-widest font-semibold text-[#6B1724] hover:text-[#500F1A] flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xs bg-[#F5EFE6] border border-[#E6DFD5]"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C2A26F] font-medium block">
                  Artisha Collection
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold group-hover:text-[#FAF8F5] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#D4C5B3] line-clamp-1 font-light">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#FAF8F5] font-semibold group-hover:text-[#C2A26F] transition-colors">
                  <span>Discover Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DFD5] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
              Atelier Favorites
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1F1D1D]">
              Best-Selling Creations
            </h2>
          </div>
          <Link
            href="/shop?sort=popularity"
            className="text-xs uppercase tracking-widest font-semibold text-[#6B1724] hover:text-[#500F1A] flex items-center gap-1 group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. EDITORIAL PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs overflow-hidden bg-[#2D1B20] text-[#FAF8F5] grid grid-cols-1 lg:grid-cols-2 border border-[#4D2932]">
          <div className="p-8 sm:p-14 flex flex-col justify-center space-y-5">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C2A26F] font-semibold">
              The Royal Heritage Atelier
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
              Kashmiri Pashmina &amp; Hand-Zardozi Peshwas
            </h2>
            <p className="text-sm text-[#D4C5B3] leading-relaxed font-light">
              Each piece takes up to 120 artisan hours. Pure hand-spun Himalayan cashmere and 80-gram raw silk adorned with antique dabka, kora, and semi-precious stone embellishments.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=luxury-festive"
                className="inline-flex items-center gap-2 bg-[#6B1724] hover:bg-[#80142B] text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md"
              >
                <span>Explore Ceremonial Wear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[350px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=1200"
              alt="Artisha Bridal & Pashmina Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DFD5] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
              Fresh Off The Loom
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1F1D1D]">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs uppercase tracking-widest font-semibold text-[#6B1724] hover:text-[#500F1A] flex items-center gap-1 group"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PHYSICAL STORE PRESENCE – DOLMEN MALL LAHORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#6B1724]/10 text-[#6B1724] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Dolmen Mall Lahore Flagship</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
              Experience Artisha in Person
            </h2>
            <p className="text-sm text-[#7E7873] leading-relaxed">
              Step into our experiential boutique at Dolmen Mall Lahore. Immerse yourself in tactile luxury—feel the warmth of pure handwoven cashmere, inspect our delicate antique tilla embroidery up close, and enjoy bespoke bridal consultations with our master stylists.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 bg-white border border-[#E6DFD5] rounded-xs space-y-1">
                <span className="text-[#6B1724] font-bold uppercase tracking-wider block text-[10px]">
                  Boutique Address
                </span>
                <p className="text-[#1F1D1D] font-medium">
                  Shop 104, First Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E6DFD5] rounded-xs space-y-1">
                <span className="text-[#6B1724] font-bold uppercase tracking-wider block text-[10px]">
                  Opening Timings
                </span>
                <p className="text-[#1F1D1D] font-medium">
                  Monday – Sunday: 11:00 AM – 11:00 PM
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-[#1F1D1D] hover:bg-[#6B1724] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Get Directions &amp; Store Info
              </Link>
              <a
                href="https://wa.me/923008472910"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Book Bridal Appointment</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-square overflow-hidden rounded-xs border border-[#E6DFD5]">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000"
              alt="Artisha Flagship Store Lahore"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY CURATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#6B1724] font-semibold">
            @artisha.official
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Curated on Instagram
          </h2>
          <p className="text-xs text-[#7E7873]">
            Tag #ArtishaLahore to be featured on our digital gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
              caption: 'Velvet tunics in deep crimson',
            },
            {
              url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
              caption: 'Ivory Chanderi silk daylight reflections',
            },
            {
              url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
              caption: 'Heirloom polki jewelry & bridal pearls',
            },
            {
              url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=600',
              caption: 'Pure pashmina hand-embroidery in progress',
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com/artisha.official"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xs bg-[#F5EFE6]"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <span className="text-xs text-white font-medium">{item.caption}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 9. CLIENT TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="bg-[#F5EFE6] py-16 border-y border-[#E6DFD5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
                Patron Impressions
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1F1D1D]">
                Words From Our Clients
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-7 rounded-xs border border-[#E6DFD5] space-y-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-[#C2A26F] text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-[#4A4644] italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1F1D1D] block">{rev.authorName}</span>
                      <span className="text-[10px] text-[#7E7873]">Verified Artisha Patron</span>
                    </div>
                    <span className="text-[10px] text-[#6B1724] font-medium bg-[#6B1724]/10 px-2 py-0.5 rounded-xs">
                      {rev.product.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
