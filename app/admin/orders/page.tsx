'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  CheckCircle2,
  X,
  Truck,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Order Details / Edit Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Edit fields
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('TCS Express');
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (searchQuery) sp.set('q', searchQuery);
      if (statusFilter && statusFilter !== 'ALL') sp.set('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${sp.toString()}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'TCS Express');
    setInternalNotes(order.internalNotes || '');
    setUpdateError('');
    setModalOpen(true);
  };

  const openInvoiceModal = (order: any) => {
    setSelectedOrder(order);
    setInvoiceModalOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus,
          trackingNumber: trackingNumber.trim() || null,
          courierName: courierName.trim() || null,
          internalNotes: internalNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      setModalOpen(false);
      fetchOrders();
    } catch (err: any) {
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Total (PKR)', 'Payment', 'Order Status', 'Tracking #', 'Courier'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${(o.guestName || o.user?.name || '').replace(/"/g, '""')}"`,
      `"${o.guestPhone || ''}"`,
      `"${o.city}"`,
      o.totalAmount,
      o.paymentMethod,
      o.orderStatus,
      `"${o.trackingNumber || ''}"`,
      `"${o.courierName || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statuses = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
    'REFUNDED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Fulfillment &amp; Dispatch
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Order Management
          </h1>
          <p className="text-xs text-[#7E7873]">
            Track status pipelines, assign couriers, generate boutique invoices, and manage returns.
          </p>
        </div>

        <button
          onClick={exportOrdersCSV}
          className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xs font-semibold whitespace-nowrap transition-colors uppercase text-[11px] tracking-wider ${
              statusFilter === st
                ? 'bg-[#6B1724] text-white shadow-xs'
                : 'bg-white border border-[#E6DFD5] text-[#7E7873] hover:text-[#1F1D1D]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E6DFD5] p-4 rounded-xs shadow-xs flex items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order #, Customer, Phone, City, Tracking #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-8 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
            />
            <Search className="w-3.5 h-3.5 text-[#7E7873] absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="bg-[#1F1D1D] text-white px-4 py-2 rounded-xs font-medium hover:bg-[#6B1724] transition-colors"
          >
            Search
          </button>
        </form>

        <span className="text-xs text-[#7E7873]">
          Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">Courier / Tracking</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading boutique orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#7E7873]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#6B1724]">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1F1D1D] block">
                        {o.guestName || o.user?.name || 'Guest Patron'}
                      </span>
                      <span className="text-[10px] text-[#7E7873] block">{o.guestPhone || o.user?.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-[#4A4644]">
                      <span className="font-medium text-[#1F1D1D] block">{o.city}</span>
                      <span className="text-[10px] text-[#7E7873] truncate max-w-[140px] block">
                        {o.shippingAddress}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-[#1F1D1D] font-bold block">{o.paymentMethod}</span>
                      <span className={`text-[9px] uppercase font-bold px-1 rounded-xs ${o.paymentStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F1D1D]">
                      Rs. {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          o.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : o.orderStatus === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : o.orderStatus === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#7E7873] text-[11px]">
                      {o.trackingNumber ? (
                        <div>
                          <span className="text-[#1F1D1D] font-medium block">{o.courierName}</span>
                          <span className="font-mono text-[10px] text-[#6B1724]">{o.trackingNumber}</span>
                        </div>
                      ) : (
                        <span className="text-[#A89F91] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailsModal(o)}
                          className="bg-[#1F1D1D] hover:bg-[#6B1724] text-white px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => openInvoiceModal(o)}
                          className="p-1 text-[#7E7873] hover:text-[#6B1724] transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
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

      {/* MANAGE ORDER MODAL */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden my-8">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                  Manage Order: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-[#7E7873]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#7E7873] hover:text-[#1F1D1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateOrder} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Ordered Items summary */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#7E7873] block">
                  Ordered Creations ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-[#E6DFD5]">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#1F1D1D]">{item.name}</span>
                        <span className="text-[10px] text-[#7E7873] block">SKU: {item.sku} • Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#1F1D1D]">Rs. {item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E6DFD5] flex justify-between font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="text-[#6B1724]">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Updates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Order Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED (Restores Stock)</option>
                    <option value="RETURNED">RETURNED (Restores Stock)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                  <span className="text-[10px] text-[#7E7873] mt-1 block">
                    Cancelling or returning automatically replenishes inventory stock.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Payment Verification Status *
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="VERIFIED">VERIFIED / PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>

              {/* Courier & Tracking */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="TCS Express">TCS Express</option>
                    <option value="Leopards Courier">Leopards Courier</option>
                    <option value="Trax Logistics">Trax Logistics</option>
                    <option value="Call Courier">Call Courier</option>
                    <option value="M&P Courier">M&amp;P Express</option>
                    <option value="Dolmen Mall Boutique Rider">Dolmen Mall In-House Rider (Lahore)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Airway Bill / Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TCS-98201928"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs font-mono"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Internal Atelier Notes (Hidden from customer)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Call customer to re-confirm address, packed in velvet box..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    openInvoiceModal(selectedOrder);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B1724] font-semibold hover:underline"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Preview &amp; Print Invoice</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#D4C5B3] text-[#7E7873] rounded-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-5 py-2 rounded-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {invoiceModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-xs shadow-2xl p-8 space-y-6 my-8 border border-[#E6DFD5]">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-4">
              <div>
                <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-[#1F1D1D] uppercase">
                  Artisha
                </span>
                <span className="text-[10px] tracking-[0.3em] text-[#C2A26F] uppercase block">
                  Dolmen Mall Lahore Atelier
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-[#6B1724] text-sm block">INVOICE: {selectedOrder.orderNumber}</span>
                <span className="text-[#7E7873]">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="block text-[#1F1D1D] mb-1">Delivering To:</strong>
                <p className="text-[#4A4644] font-medium">{selectedOrder.guestName || selectedOrder.user?.name}</p>
                <p className="text-[#7E7873]">{selectedOrder.shippingAddress}</p>
                <p className="text-[#7E7873]">{selectedOrder.city}, Pakistan</p>
                <p className="text-[#7E7873]">Contact: {selectedOrder.guestPhone || selectedOrder.user?.phone}</p>
              </div>
              <div className="text-right">
                <strong className="block text-[#1F1D1D] mb-1">Payment &amp; Courier:</strong>
                <p className="text-[#7E7873]">Payment: <strong className="text-[#1F1D1D]">{selectedOrder.paymentMethod}</strong></p>
                <p className="text-[#7E7873]">Status: <strong className="text-emerald-700">{selectedOrder.paymentStatus}</strong></p>
                <p className="text-[#7E7873]">Courier: {selectedOrder.courierName || 'Standard'}</p>
                <p className="text-[#7E7873]">Tracking: {selectedOrder.trackingNumber || 'Pending'}</p>
              </div>
            </div>

            <div className="border border-[#E6DFD5] rounded-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {selectedOrder.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 font-medium text-[#1F1D1D]">{item.name}</td>
                      <td className="py-2 px-3 font-mono text-[10px] text-[#7E7873]">{item.sku}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">Rs. {item.price.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1F1D1D]">Rs. {item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-baseline text-xs pt-2 border-t border-[#E6DFD5]">
              <span className="text-[#7E7873]">Boutique Hotline: +92 300 8472910</span>
              <div className="space-y-1 text-right">
                <div className="flex justify-between gap-6">
                  <span className="text-[#7E7873]">Subtotal:</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between gap-6 text-emerald-700">
                    <span>Discount:</span>
                    <span>-Rs. {selectedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between gap-6">
                  <span className="text-[#7E7873]">Shipping:</span>
                  <span>Rs. {selectedOrder.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-6 font-bold text-sm text-[#6B1724] pt-1 border-t border-[#E6DFD5]">
                  <span>Total Amount:</span>
                  <span>Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6DFD5]">
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-2 border border-[#D4C5B3] text-xs font-semibold rounded-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#6B1724] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#500F1A]"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
