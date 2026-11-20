'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Download, X, DollarSign, TrendingDown, Calendar, Tag } from 'lucide-react';

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('RENT');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/expenses');
      const data = await res.json();
      if (data.expenses) setExpenses(data.expenses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          amount: parseFloat(amount),
          date,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record expense');

      setIsModalOpen(false);
      setTitle('');
      setAmount('');
      setDescription('');
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'ALL',
    'RENT',
    'SALARIES',
    'INVENTORY',
    'MARKETING',
    'PACKAGING',
    'COURIER',
    'UTILITIES',
    'MISC',
  ];

  const filtered = expenses.filter(
    (exp) => categoryFilter === 'ALL' || exp.category === categoryFilter
  );

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Operational Outlays &amp; Overhead
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Expense &amp; Cost Management
          </h1>
          <p className="text-xs text-[#7E7873]">
            Track boutique lease, artisan salaries, fabric procurement, packaging, and logistics overhead.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            Total Recorded Expenses
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#6B1724]">
            Rs. {totalExpenseAmount.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Cumulative operational costs</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            Boutique Retail Lease (Dolmen Mall)
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. 350,000 <span className="text-xs font-normal text-[#7E7873]">/ mo</span>
          </h3>
          <span className="text-[11px] text-[#7E7873]">Dolmen Mall Lahore prime floor lease</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
            Payroll &amp; Master Artisans
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. 240,000 <span className="text-xs font-normal text-[#7E7873]">/ mo</span>
          </h3>
          <span className="text-[11px] text-[#7E7873]">Tailors, embroiderers &amp; sales staff</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xs font-semibold whitespace-nowrap transition-colors uppercase text-[10px] tracking-wider ${
              categoryFilter === cat
                ? 'bg-[#6B1724] text-white shadow-xs'
                : 'bg-white border border-[#E6DFD5] text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Description &amp; Context</th>
                <th className="py-3.5 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading expense ledger...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D]">{e.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#FAF8F5] border border-[#E6DFD5] px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold text-[#6B1724]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      Rs. {e.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#4A4644] max-w-xs">{e.description || '—'}</td>
                    <td className="py-3 px-4 text-[#7E7873]">{e.recordedBy || 'System Staff'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                Record Operational Expense
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

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Raw silk fabric procurement batch"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  >
                    <option value="RENT">RENT (Boutique Lease)</option>
                    <option value="SALARIES">SALARIES (Staff & Artisans)</option>
                    <option value="INVENTORY">INVENTORY (Fabrics & Stones)</option>
                    <option value="MARKETING">MARKETING (Ads & Campaigns)</option>
                    <option value="PACKAGING">PACKAGING (Boxes & Dustbags)</option>
                    <option value="COURIER">COURIER (TCS/Leopards Freight)</option>
                    <option value="UTILITIES">UTILITIES (Mall Maintenance)</option>
                    <option value="MISC">MISCELLANEOUS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="45000"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Expense Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Description / Receipt Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or invoice reference..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
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
                  {submitting ? 'Recording...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
