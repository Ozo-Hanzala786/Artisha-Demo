'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, X, UserCheck, UserX, Key, Lock, Mail, Phone } from 'lucide-react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MANAGER');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (data.staffMembers) setStaffList(data.staffMembers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff');

      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (res.ok) fetchStaff();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      if (res.ok) fetchStaff();
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
            Access Control &amp; Governance
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Staff &amp; Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#7E7873]">
            Enforce granular operational permissions for Atelier managers, inventory leads, and fulfillment officers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading staff directory...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E7873]">
                    No staff records found.
                  </td>
                </tr>
              ) : (
                staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1F1D1D]">{st.name}</td>
                    <td className="py-3 px-4 text-[#4A4644]">{st.email}</td>
                    <td className="py-3 px-4 text-[#7E7873]">{st.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={st.role}
                        onChange={(e) => handleRoleChange(st.id, e.target.value)}
                        className="bg-[#FAF8F5] border border-[#D4C5B3] px-2 py-1 rounded-xs font-mono text-[11px] font-bold text-[#6B1724]"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                        <option value="MANAGER">MANAGER (Operations & Reports)</option>
                        <option value="INVENTORY_MANAGER">INVENTORY_MANAGER (Stock Only)</option>
                        <option value="ORDER_MANAGER">ORDER_MANAGER (Orders & Couriers)</option>
                        <option value="MARKETING_MANAGER">MARKETING_MANAGER (Campaigns)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          st.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {st.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(st.id, st.isActive)}
                        className={`text-[11px] font-semibold underline ${
                          st.isActive ? 'text-red-700 hover:text-red-900' : 'text-emerald-700 hover:text-emerald-900'
                        }`}
                      >
                        {st.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                Provision New Staff Officer
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

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Siddiqui"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asad@artisha.pk"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Assigned Staff Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-semibold"
                >
                  <option value="MANAGER">MANAGER (Products, Orders, Customers, Reports)</option>
                  <option value="INVENTORY_MANAGER">INVENTORY_MANAGER (Stock & Warehousing)</option>
                  <option value="ORDER_MANAGER">ORDER_MANAGER (Fulfillment & Dispatch)</option>
                  <option value="MARKETING_MANAGER">MARKETING_MANAGER (Campaigns & Content)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Unrestricted CEO Access)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
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
                  {submitting ? 'Creating...' : 'Provision Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
