'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Store, DollarSign, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = useState('Artisha');
  const [storeTagline, setStoreTagline] = useState('Curated Pret, Luxury Festive & Artisanal Heirlooms');
  const [currency, setCurrency] = useState('PKR (Rs.)');
  const [location, setLocation] = useState('Shop 104, 1st Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore, Pakistan');
  const [phone, setPhone] = useState('+92 300 8472910');
  const [email, setEmail] = useState('concierge@artisha.pk');
  const [taxPercent, setTaxPercent] = useState('0');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.storeInfo) {
          const info = data.content.storeInfo;
          if (info.brandName) setBrandName(info.brandName);
          if (info.tagline) setStoreTagline(info.tagline);
          if (info.address) setLocation(info.address);
          if (info.phone) setPhone(info.phone);
          if (info.email) setEmail(info.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'storeInfo',
          value: {
            brandName,
            tagline: storeTagline,
            address: location,
            phone,
            email,
            currency,
            taxPercent,
          },
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
          Atelier System Configuration
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
          General Business Settings
        </h1>
        <p className="text-xs text-[#7E7873]">
          Configure core brand parameters, physical retail presence at Dolmen Mall Lahore, and domestic taxation.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs p-6 space-y-6 text-xs">
        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] flex items-center gap-2 border-b border-[#F5EFE6] pb-2">
            <Store className="w-4 h-4 text-[#6B1724]" />
            <span>Brand Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Store Currency
              </label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-xs text-[#7E7873] cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={storeTagline}
              onChange={(e) => setStoreTagline(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
            />
          </div>
        </div>

        {/* Physical Retail Presence */}
        <div className="space-y-4 pt-4 border-t border-[#F5EFE6]">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] flex items-center gap-2 border-b border-[#F5EFE6] pb-2">
            <Shield className="w-4 h-4 text-[#6B1724]" />
            <span>Flagship Location (Lahore)</span>
          </h3>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Boutique Address (Dolmen Mall Lahore)
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Hotline Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2.5 rounded-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
