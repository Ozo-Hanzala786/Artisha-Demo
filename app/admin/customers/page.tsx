'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Star, MapPin, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('ALL');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));

    const matchesSegment = segmentFilter === 'ALL' || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Orders Count', 'Total Spent (PKR)', 'Segment', 'Registered Date'];
    const rows = filtered.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      `"${c.phone || ''}"`,
      c.orderCount,
      c.totalSpent,
      c.segment,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Client Directory &amp; CRM
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Patron Management
          </h1>
          <p className="text-xs text-[#7E7873]">
            Maintain patron profiles, purchase histories, and lifetime value segments.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Patrons CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E6DFD5] p-4 rounded-xs shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-8 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E7873] absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'VIP Patron', 'Regular', 'New'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 rounded-xs font-semibold uppercase text-[10px] tracking-wider transition-colors ${
                segmentFilter === seg
                  ? 'bg-[#6B1724] text-white'
                  : 'bg-[#FAF8F5] text-[#7E7873] border border-[#E6DFD5] hover:text-[#1F1D1D]'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Patron Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Primary City</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Segment</th>
                <th className="py-3.5 px-4">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading patron directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7E7873]">
                    No patrons match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1F1D1D] block">{c.name}</span>
                      <span className="text-[10px] text-[#7E7873]">Patron #{c.id.slice(-6)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block text-[#1F1D1D]">{c.email}</span>
                      <span className="text-[10px] text-[#7E7873] block">{c.phone || 'No phone'}</span>
                    </td>
                    <td className="py-3 px-4 text-[#7E7873]">
                      {c.addresses[0]?.city || 'Lahore (Pending)'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      {c.orderCount} orders
                    </td>
                    <td className="py-3 px-4 font-bold text-[#6B1724]">
                      Rs. {c.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          c.segment === 'VIP Patron'
                            ? 'bg-[#C2A26F]/20 text-[#85652E] border border-[#C2A26F]/40'
                            : c.segment === 'Regular'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
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
