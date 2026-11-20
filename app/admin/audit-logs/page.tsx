'use client';

import React, { useState, useEffect } from 'react';
import { ScrollText, Search, User, Shield, Clock, Download } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
      l.entityType.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Timestamp', 'Staff Name', 'Role', 'Action', 'Entity', 'Details'];
    const rows = filtered.map((l) => [
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      l.userRole,
      l.action,
      l.entityType,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
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
            Governance &amp; Security Auditing
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            System Audit Trail
          </h1>
          <p className="text-xs text-[#7E7873]">
            Immutable chronological ledger of all administrative modifications, pricing changes, and stock movements.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E6DFD5] p-4 rounded-xs shadow-xs flex items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by staff member, action type, or modification details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-8 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E7873] absolute left-2.5 top-2.5" />
        </div>

        <span className="text-xs text-[#7E7873]">
          Showing {filtered.length} audit {filtered.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Staff Officer</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Details &amp; Audit Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 text-[#7E7873] text-[11px] whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D] whitespace-nowrap">
                      {l.userName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#FAF8F5] border border-[#E6DFD5] px-2 py-0.5 rounded-xs font-mono text-[9px] font-bold text-[#6B1724]">
                        {l.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-[#1F1D1D]">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 text-[#7E7873] font-medium">{l.entityType}</td>
                    <td className="py-3 px-4 text-[#4A4644] max-w-md">{l.details}</td>
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
