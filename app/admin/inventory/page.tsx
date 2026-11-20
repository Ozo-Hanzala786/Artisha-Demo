'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  TrendingDown,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  History,
  X,
  Search,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Stock Adjustment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState('RESTOCK');
  const [adjustmentQty, setAdjustmentQty] = useState('5');
  const [adjustmentReason, setAdjustmentReason] = useState('New atelier intake from master weavers');
  const [referenceNote, setReferenceNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProd, resMov] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/inventory/movements'),
      ]);
      const dataProd = await resProd.json();
      const dataMov = await resMov.json();
      if (dataProd.products) setProducts(dataProd.products);
      if (dataMov.movements) setMovements(dataMov.movements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustModal = (product: any) => {
    setSelectedProduct(product);
    setAdjustmentType('RESTOCK');
    setAdjustmentQty('5');
    setAdjustmentReason('Atelier replenishment intake');
    setReferenceNote(`Batch ART-${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`);
    setError('');
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const qty = parseInt(adjustmentQty);
    const finalQty = adjustmentType === 'DAMAGE' || adjustmentType === 'ORDER_DEDUCT' ? -Math.abs(qty) : Math.abs(qty);

    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: adjustmentType,
          quantity: finalQty,
          reason: adjustmentReason,
          referenceNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Inventory Valuations
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalCostValuation = products.reduce((sum, p) => sum + p.stock * (p.costPrice || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
          Stock Control &amp; Atelier Valuation
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
          Inventory Management
        </h1>
        <p className="text-xs text-[#7E7873]">
          Real-time stock tracking, automated order deduction, stock restoration, and audit logs.
        </p>
      </div>

      {/* Valuation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            Total Inventory Units
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            {totalUnits.toLocaleString()} <span className="text-xs font-normal text-[#7E7873]">pieces</span>
          </h3>
          <span className="text-[11px] text-[#7E7873]">Across all product categories</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#6B1724] block">
            Retail Inventory Valuation
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#6B1724]">
            Rs. {totalRetailValuation.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">At active boutique list prices</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            Cost Capital Valuation
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. {totalCostValuation.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Direct fabric &amp; artisan outlay</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-red-700 block">
            Low Stock Alerts
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-red-700">
            {lowStockCount} <span className="text-xs font-normal text-[#7E7873]">designs</span>
          </h3>
          <span className="text-[11px] text-[#7E7873]">Below safety thresholds (&le; 5 units)</span>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
              Real-Time Atelier Stock Status
            </h3>
            <span className="text-[11px] text-[#7E7873]">Deducted automatically on confirmed client orders</span>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-8 pr-3 py-1.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
            />
            <Search className="w-3.5 h-3.5 text-[#7E7873] absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-[#7E7873]">
                    Loading stock records...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-[#7E7873]">
                    No inventory records match.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D]">{p.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#7E7873]">{p.sku}</td>
                    <td className="py-3 px-4 text-[#7E7873]">{p.category?.name}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-[#1F1D1D]">{p.stock}</span>
                      <span className="text-[10px] text-[#7E7873] ml-1">units</span>
                    </td>
                    <td className="py-3 px-4 text-[#7E7873]">{p.lowStockThreshold} units</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          p.stock <= 0
                            ? 'bg-red-100 text-red-800'
                            : p.stock <= p.lowStockThreshold
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock <= 0 ? 'Out of Stock' : p.stock <= p.lowStockThreshold ? 'Low Stock Alert' : 'Healthy Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openAdjustModal(p)}
                        className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-3 py-1 rounded-xs text-[11px] font-medium transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements Audit History */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#F5EFE6]">
          <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] flex items-center gap-2">
            <History className="w-4 h-4 text-[#6B1724]" />
            <span>Stock Movement Audit Trail</span>
          </h3>
          <span className="text-[11px] text-[#7E7873]">
            Comprehensive transactional record of intakes, customer order deductions, and restorations.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Quantity Delta</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Staff Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {movements.slice(0, 10).map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-2.5 px-4 text-[#7E7873] text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-[#1F1D1D]">{m.product?.name}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        m.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold">
                    <span className={m.quantity > 0 ? 'text-emerald-700' : 'text-red-700'}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#4A4644]">
                    {m.reason} {m.referenceNote && <span className="text-[10px] text-[#7E7873]">({m.referenceNote})</span>}
                  </td>
                  <td className="py-2.5 px-4 text-[#7E7873] font-medium">
                    {m.user?.name || 'Automated Store System'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                  Adjust Inventory Stock
                </h3>
                <span className="text-[11px] text-[#7E7873]">{selectedProduct.name}</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7E7873] hover:text-[#1F1D1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs flex justify-between items-center">
                <span className="text-[#7E7873]">Current Available Stock</span>
                <span className="font-bold text-base text-[#6B1724]">{selectedProduct.stock} units</span>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Movement Type *
                </label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                >
                  <option value="RESTOCK">Restock (Add Units)</option>
                  <option value="MANUAL_ADJUSTMENT">Manual Adjustment</option>
                  <option value="DAMAGE">Damaged / Flawed Goods (Deduct Units)</option>
                  <option value="RETURN">Customer Return (Add Units)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Adjustment Reason *
                </label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. Master weavers batch delivery"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Reference Note / Batch Code
                </label>
                <input
                  type="text"
                  value={referenceNote}
                  onChange={(e) => setReferenceNote(e.target.value)}
                  placeholder="e.g. Batch ART-2026-Q1"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D4C5B3] text-[#7E7873] hover:text-[#1F1D1D] rounded-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2 rounded-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Applying...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
