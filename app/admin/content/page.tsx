'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminContentPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [announcementText, setAnnouncementText] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
        if (data.content.announcement) setAnnouncementText(data.content.announcement.text || '');
        if (data.content.hero) {
          setHeroTagline(data.content.hero.tagline || '');
          setHeroHeadline(data.content.hero.headline || '');
          setHeroSubheadline(data.content.hero.subheadline || '');
        }
        if (data.content.storeInfo) {
          setStoreAddress(data.content.storeInfo.address || '');
          setStorePhone(data.content.storeInfo.phone || '');
          setStoreEmail(data.content.storeInfo.email || '');
          setWhatsappNumber(data.content.storeInfo.whatsapp || '');
        }
        if (data.content.socialLinks) {
          setInstagramUrl(data.content.socialLinks.instagram || '');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveSection = async (key: string, value: any) => {
    setSavingKey(key);
    setSavedSuccess('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSavedSuccess(`Section "${key}" updated live across customer website!`);
        setTimeout(() => setSavedSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
          Headless CMS Configuration
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
          Website Content Management
        </h1>
        <p className="text-xs text-[#7E7873]">
          Update homepage banners, announcement tickers, boutique contact details, and social channels without developer assistance.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-[#7E7873]">Loading content configuration...</div>
      ) : (
        <div className="space-y-8">
          {/* Announcement Bar Section */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-2">
              <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                Top Announcement Bar
              </h3>
              <button
                onClick={() => saveSection('announcement', { text: announcementText, isActive: true })}
                disabled={savingKey === 'announcement'}
                className="bg-[#6B1724] text-white px-4 py-1.5 rounded-xs text-xs font-semibold hover:bg-[#500F1A] transition-colors disabled:opacity-50"
              >
                {savingKey === 'announcement' ? 'Saving...' : 'Save Announcement'}
              </button>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Announcement Message (Displayed across customer site header)
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Visit our flagship boutique at Dolmen Mall Lahore..."
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
            </div>
          </div>

          {/* Hero Section Banner */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-2">
              <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                Homepage Editorial Hero Banner
              </h3>
              <button
                onClick={() =>
                  saveSection('hero', {
                    tagline: heroTagline,
                    headline: heroHeadline,
                    subheadline: heroSubheadline,
                    primaryButtonText: 'Explore Collection',
                    primaryButtonLink: '/shop',
                  })
                }
                disabled={savingKey === 'hero'}
                className="bg-[#6B1724] text-white px-4 py-1.5 rounded-xs text-xs font-semibold hover:bg-[#500F1A] transition-colors disabled:opacity-50"
              >
                {savingKey === 'hero' ? 'Saving...' : 'Save Hero Section'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Season Tagline
                </label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Supporting Editorial Copy
                </label>
                <textarea
                  rows={2}
                  value={heroSubheadline}
                  onChange={(e) => setHeroSubheadline(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* Store Info & WhatsApp Section */}
          <div className="bg-white border border-[#E6DFD5] p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-2">
              <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                Dolmen Mall Boutique &amp; Contact Telephony
              </h3>
              <button
                onClick={() =>
                  saveSection('storeInfo', {
                    address: storeAddress,
                    phone: storePhone,
                    email: storeEmail,
                    whatsapp: whatsappNumber,
                  })
                }
                disabled={savingKey === 'storeInfo'}
                className="bg-[#6B1724] text-white px-4 py-1.5 rounded-xs text-xs font-semibold hover:bg-[#500F1A] transition-colors disabled:opacity-50"
              >
                {savingKey === 'storeInfo' ? 'Saving...' : 'Save Store Details'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Physical Store Address
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Official Phone Hotline
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  WhatsApp Concierge Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
