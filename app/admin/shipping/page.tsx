'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Plus, Edit2, X, CheckCircle2 } from 'lucide-react';

export default function AdminShippingPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [city, setCity] = useState('');
  const [rate, setRate] = useState('250');
  const [estimatedDays, setEstimatedDays] = useState('2-3 business days');
  const [freeThreshold, setFreeThreshold] = useState('10000');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shipping');
      const data = await res.json();
      if (data.zones) setZones(data.zones);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const openEditModal = (z: any) => {
    setCity(z.city);
    setRate(z.rate.toString());
    setEstimatedDays(z.estimatedDays);
    setFreeThreshold(z.freeShippingThreshold ? z.freeShippingThreshold.toString() : '10000');
    setIsActive(z.isActive);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          rate: parseFloat(rate),
          estimatedDays,
          freeShippingThreshold: parseFloat(freeThreshold),
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save zone');

      setIsModalOpen(false);
      fetchZones();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Logistics &amp; Domestic Freight
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Shipping Zones &amp; Delivery Tariffs
          </h1>
          <p className="text-xs text-[#7E7873]">
            Configure city-based delivery charges, estimated transit days, and free shipping triggers across Pakistan.
          </p>
        </div>

        <button
          onClick={() => {
            setCity('');
            setRate('250');
            setEstimatedDays('2-3 business days');
            setFreeThreshold('10000');
            setIsActive(true);
            setError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipping Zone</span>
        </button>
      </div>

      {/* Zones Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Destination Zone / City</th>
                <th className="py-3.5 px-4">Courier Tariff</th>
                <th className="py-3.5 px-4">Estimated Transit Timeline</th>
                <th className="py-3.5 px-4">Free Shipping Trigger</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading shipping zones...
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    No shipping zones configured.
                  </td>
                </tr>
              ) : (
                zones.map((z) => (
                  <tr key={z.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">{z.city}</td>
                    <td className="py-3 px-4 font-bold text-[#6B1724]">
                      Rs. {z.rate.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#4A4644]">{z.estimatedDays}</td>
                    <td className="py-3 px-4 text-[#7E7873]">
                      Orders &gt; Rs. {z.freeShippingThreshold?.toLocaleString() || '10,000'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          z.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {z.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditModal(z)}
                        className="bg-[#1F1D1D] hover:bg-[#6B1724] text-white px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                Configure Shipping Destination
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7E7873] hover:text-[#1F1D1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  City / Destination Name *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Peshawar"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Standard Tariff (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Free Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(e.target.value)}
                    placeholder="10000"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Estimated Transit Time
                </label>
                <input
                  type="text"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  placeholder="e.g. 1-2 business days"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="text-[#6B1724]"
                  />
                  <span className="font-semibold text-[#1F1D1D]">Zone is active for online checkout</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D4C5B3] text-[#7E7873] rounded-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2 rounded-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
