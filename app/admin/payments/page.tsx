'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Building2, Smartphone, Truck } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleVerify = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalCollected = transactions
    .filter((t) => t.status === 'VERIFIED')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingVerification = transactions
    .filter((t) => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
          Financial Settlements
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
          Payment Transactions
        </h1>
        <p className="text-xs text-[#7E7873]">
          Verify bank transfer slips, audit COD courier remittances, and review wallet transactions.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">
            Verified &amp; Realized Funds
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1D]">
            Rs. {totalCollected.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Settled via Meezan Bank IBFT and COD</span>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-xs space-y-2 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-700 block">
            Pending Realization / Slip Verification
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-amber-800">
            Rs. {pendingVerification.toLocaleString()}
          </h3>
          <span className="text-[11px] text-[#7E7873]">Awaiting bank slip approval or courier delivery</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Reference / Bank Details</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7E7873]">
                    No payment transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#6B1724]">
                      {t.order?.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D]">
                      {t.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      Rs. {t.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#4A4644]">
                      <span className="font-mono text-[10px] block">{t.transactionRef || 'COD In-Transit'}</span>
                      <span className="text-[10px] text-[#7E7873]">{t.bankAccount || t.notes}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          t.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {t.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleVerify(t.id, 'VERIFIED')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-xs text-[10px] font-semibold"
                          >
                            Verify &amp; Approve
                          </button>
                          <button
                            onClick={() => handleVerify(t.id, 'FAILED')}
                            className="border border-red-300 text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-xs text-[10px] font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold">Verified</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
