'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, Star, Share2, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, toggleWishlist, isInWishlist } = useCart();

  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    images = ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000'];
  }

  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping' | 'reviews'>('description');
  const [copied, setCopied] = useState(false);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: images[0],
      quantity,
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      sku: selectedVariant?.sku || product.sku,
      maxStock: selectedVariant?.stock || product.stock,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Product Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-none shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 relative bg-[#F5EFE6] rounded-xs overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-[#6B1724]' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[3/4] bg-[#F5EFE6] rounded-xs overflow-hidden border border-[#E6DFD5] group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
            />
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-[#6B1724] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-xs">
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Details */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#7E7873] uppercase tracking-wider mb-2">
              <span>{product.category?.name || 'Artisha Atelier'}</span>
              <span>SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D] leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="flex text-[#C2A26F]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-[#C2A26F]" />
                ))}
              </div>
              <span className="text-[#7E7873]">({product.reviews?.length || 1} client reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-[#F5EFE6] rounded-xs border border-[#E6DFD5] flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#6B1724]">
              Rs. {activePrice.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm text-[#7E7873] line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-[#7E7873] ml-auto">Inclusive of all local taxes</span>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs text-[#4A4644] leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E6DFD5]">
              <span className="text-xs font-semibold text-[#1F1D1D] uppercase tracking-wider block">
                Select Option / Size:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-xs border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#6B1724] bg-[#6B1724] text-white shadow-xs'
                        : 'border-[#D4C5B3] bg-white text-[#1F1D1D] hover:border-[#6B1724]'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="text-xs flex items-center gap-2">
            <span className="font-semibold text-[#1F1D1D]">Availability:</span>
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.stock} units available at Lahore atelier)
              </span>
            ) : (
              <span className="text-red-700 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector and Purchase CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#D4C5B3] rounded-xs bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-xs hover:text-[#6B1724] transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#1F1D1D]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2.5 text-xs hover:text-[#6B1724] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-[#1F1D1D] hover:bg-[#6B1724] text-white py-3 px-6 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs disabled:opacity-50 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded-xs transition-colors ${
                  isFavorited
                    ? 'border-[#6B1724] bg-[#6B1724] text-white'
                    : 'border-[#D4C5B3] bg-white text-[#1F1D1D] hover:text-[#6B1724]'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full bg-[#6B1724] hover:bg-[#80142B] text-white py-3.5 px-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs disabled:opacity-50 shadow-md"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#E6DFD5] space-y-2.5 text-xs text-[#7E7873]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#6B1724] shrink-0" />
              <span>Complimentary nationwide courier dispatch on orders over Rs. 10,000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#6B1724] shrink-0" />
              <span>7-Day boutique exchange at Dolmen Mall Lahore or by courier</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#6B1724] shrink-0" />
              <span>Authentic Pakistani handcraft with verified artisan origins</span>
            </div>
          </div>

          {/* Share Button */}
          <div className="pt-2">
            <button
              onClick={handleShare}
              className="text-xs text-[#7E7873] hover:text-[#6B1724] flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied to Clipboard!' : 'Share Creation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Craft Details, Shipping & Delivery, Client Reviews */}
      <div className="border-t border-[#E6DFD5] pt-10">
        <div className="flex border-b border-[#E6DFD5] overflow-x-auto gap-8 text-xs font-semibold uppercase tracking-widest pb-3">
          <button
            onClick={() => setActiveTab('description')}
            className={`transition-colors pb-3 -mb-3 border-b-2 ${
              activeTab === 'description' ? 'border-[#6B1724] text-[#6B1724]' : 'border-transparent text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            The Atelier Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`transition-colors pb-3 -mb-3 border-b-2 ${
              activeTab === 'details' ? 'border-[#6B1724] text-[#6B1724]' : 'border-transparent text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Material &amp; Care
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`transition-colors pb-3 -mb-3 border-b-2 ${
              activeTab === 'shipping' ? 'border-[#6B1724] text-[#6B1724]' : 'border-transparent text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Delivery &amp; Exchanges
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`transition-colors pb-3 -mb-3 border-b-2 ${
              activeTab === 'reviews' ? 'border-[#6B1724] text-[#6B1724]' : 'border-transparent text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            Patron Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        <div className="py-8 text-sm text-[#4A4644] leading-relaxed max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E6DFD5] rounded-xs space-y-1">
                  <span className="text-xs font-bold text-[#6B1724] uppercase">Fabric &amp; Composition</span>
                  <p className="text-xs text-[#1F1D1D]">{product.material || '100% Pure Artisanal Fabric'}</p>
                </div>
                <div className="p-4 bg-white border border-[#E6DFD5] rounded-xs space-y-1">
                  <span className="text-xs font-bold text-[#6B1724] uppercase">Care &amp; Preservation</span>
                  <p className="text-xs text-[#1F1D1D]">{product.careInstructions || 'Dry clean only. Store in breathable garment cover.'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs text-[#4A4644]">
              <p>
                Orders are dispatched directly from our flagship fulfillment center at Dolmen Mall Lahore via premium courier partners (TCS, Leopards, Call Courier).
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Lahore:</strong> Same-day or next-day delivery (Rs. 150, or complimentary store pickup at Dolmen Mall).</li>
                <li><strong>Karachi &amp; Islamabad / Rawalpindi:</strong> 2 to 3 business days (Rs. 250).</li>
                <li><strong>Nationwide:</strong> Complimentary shipping on all orders totaling Rs. 10,000 or above.</li>
                <li><strong>Exchanges:</strong> We offer a 7-day exchange guarantee on unstitched and pret apparel with original tags intact.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-5 bg-white border border-[#E6DFD5] rounded-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1F1D1D]">{rev.authorName}</span>
                        <div className="flex text-[#C2A26F] text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#4A4644] italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-[#7E7873] block">
                        Verified Artisha Patron • {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#7E7873]">Be the first to review this artisanal creation.</p>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="p-6 bg-[#F5EFE6] border border-[#E6DFD5] rounded-xs space-y-4">
                <h4 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                  Write a Patron Review
                </h4>
                {reviewSubmitted ? (
                  <div className="text-xs text-emerald-800 bg-emerald-100 p-3 rounded-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Thank you for your feedback! Your review has been submitted for moderation.</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#1F1D1D] font-semibold block mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Maham Tariq"
                          className="w-full bg-white border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#1F1D1D] font-semibold block mb-1">
                          Rating
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          aria-label="Rating out of 5 stars"
                          className="w-full bg-white border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                        >
                          <option value="5">★★★★★ (5/5 Exceptional)</option>
                          <option value="4">★★★★☆ (4/5 Very Good)</option>
                          <option value="3">★★★☆☆ (3/5 Good)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#1F1D1D] font-semibold block mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell us about the fabric feel, embroidery detail, or sizing..."
                        className="w-full bg-white border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#6B1724] text-white text-xs uppercase tracking-widest font-semibold px-5 py-2.5 hover:bg-[#500F1A] transition-colors rounded-xs disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E6DFD5] space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
              Complementary Pieces
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <div className="aspect-[3/4] bg-[#F5EFE6] rounded-xs overflow-hidden border border-[#E6DFD5] mb-2.5">
                  <img
                    src={JSON.parse(p.images)[0] || ''}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif-luxury text-sm font-semibold text-[#1F1D1D] group-hover:text-[#6B1724] transition-colors line-clamp-1">
                  {p.name}
                </h4>
                <span className="text-xs font-bold text-[#6B1724]">
                  Rs. {(p.salePrice || p.price).toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
