'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, X, CheckCircle2, Percent, DollarSign, Truck } from 'lucide-react';

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [value, setValue] = useState('10');
  const [minSpend, setMinSpend] = useState('5000');
  const [maxDiscount, setMaxDiscount] = useState('3000');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode(`ARTISHA${Math.floor(10 + Math.random() * 90)}`);
    setDiscountType('PERCENTAGE');
    setValue('10');
    setMinSpend('5000');
    setMaxDiscount('3000');
    setUsageLimit('200');
    setExpiresAt('');
    setIsActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setValue(c.value.toString());
    setMinSpend(c.minSpend?.toString() || '0');
    setMaxDiscount(c.maxDiscount ? c.maxDiscount.toString() : '');
    setUsageLimit(c.usageLimit ? c.usageLimit.toString() : '');
    setExpiresAt(c.expiresAt ? new Date(c.expiresAt).toISOString().split('T')[0] : '');
    setIsActive(c.isActive);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          value: parseFloat(value),
          minSpend: minSpend ? parseFloat(minSpend) : 0,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save coupon');
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Promotions &amp; Concessions
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Discount &amp; Coupon Codes
          </h1>
          <p className="text-xs text-[#7E7873]">
            Configure promotional percentage vouchers, fixed credits, and free shipping triggers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Type</th>
                <th className="py-3.5 px-4">Benefit</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Usage Count</th>
                <th className="py-3.5 px-4">Expires On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading active coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#7E7873]">
                    No promotional coupons created yet.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#6B1724] font-mono text-sm">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D] text-[11px]">
                      {c.discountType}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      {c.discountType === 'PERCENTAGE'
                        ? `${c.value}% OFF`
                        : c.discountType === 'FIXED'
                        ? `Rs. ${c.value.toLocaleString()} Flat`
                        : 'Free Delivery'}
                    </td>
                    <td className="py-3 px-4 text-[#7E7873]">
                      Rs. {c.minSpend.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#1F1D1D]">
                      <strong>{c.usedCount}</strong> {c.usageLimit ? `/ ${c.usageLimit} max` : 'used'}
                    </td>
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never expires'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1 text-[#7E7873] hover:text-[#6B1724]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1 text-[#A89F91] hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                {editingCoupon ? 'Edit Promotional Coupon' : 'Create New Coupon'}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ARTISHA10"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 10 or 1000"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Minimum Order Spend (PKR)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Usage Cap Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
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
                  <span className="font-semibold text-[#1F1D1D]">Coupon is Active and Redeemable</span>
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
                  className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2 rounded-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
