'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, ShoppingBag, Users, ExternalLink, Check } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Real-Time Operational Signals
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Notification Center
          </h1>
          <p className="text-xs text-[#7E7873]">
            Telemetry alerts on incoming orders, out-of-stock events, and customer registrations.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs divide-y divide-[#F5EFE6]">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7E7873]">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#7E7873]">No alerts in your inbox.</div>
        ) : (
          notifications.map((n) => {
            const isOrder = n.type.includes('ORDER');
            const isStock = n.type.includes('STOCK');
            const isCustomer = n.type.includes('CUSTOMER');

            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !n.isRead ? 'bg-[#FAF8F5]' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xs shrink-0 mt-0.5 ${
                      isStock
                        ? 'bg-red-50 text-red-700'
                        : isOrder
                        ? 'bg-[#6B1724]/10 text-[#6B1724]'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isStock ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : isOrder ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1F1D1D]">{n.title}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#6B1724]" />
                      )}
                    </div>
                    <p className="text-xs text-[#4A4644] max-w-xl">{n.message}</p>
                    <span className="text-[10px] text-[#7E7873] block">
                      {new Date(n.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      className="text-[#6B1724] hover:underline text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] text-[#7E7873] hover:text-[#1F1D1D] underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
