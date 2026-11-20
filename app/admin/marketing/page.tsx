'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Mail, Star, Download, CheckCircle2, XCircle, Share2, Sparkles } from 'lucide-react';

export default function AdminMarketingPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/marketing');
      const data = await res.json();
      if (data.subscribers) setSubscribers(data.subscribers);
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const handleReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status: newStatus }),
      });
      if (res.ok) fetchMarketingData();
    } catch (e) {
      console.error(e);
    }
  };

  const exportSubscribers = () => {
    const headers = ['Email', 'Subscribed Date'];
    const rows = subscribers.map((s) => [s.email, `"${new Date(s.subscribedAt).toLocaleDateString()}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DFD5] pb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
          Engagement &amp; Advocacy
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
          Marketing &amp; Social Proof
        </h1>
        <p className="text-xs text-[#7E7873]">
          Manage newsletter subscribers, moderate patron reviews, and orchestrate campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reviews Moderation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs p-5">
            <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D] mb-1">
              Patron Reviews Moderation
            </h3>
            <span className="text-[11px] text-[#7E7873] block mb-4">
              Approved reviews appear automatically on live product detail pages.
            </span>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-xs text-[#7E7873]">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7E7873]">No reviews to moderate.</div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-[#1F1D1D]">{r.authorName}</strong>
                        <span className="text-[10px] text-[#7E7873] block">
                          on <strong>{r.product?.name}</strong>
                        </span>
                      </div>
                      <div className="flex text-[#C2A26F] text-xs">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[#4A4644] italic">"{r.comment}"</p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E6DFD5]">
                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold ${
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>

                      <div className="flex gap-2">
                        {r.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleReviewStatus(r.id, 'APPROVED')}
                            className="bg-emerald-700 text-white px-2.5 py-1 rounded-xs text-[10px] font-semibold hover:bg-emerald-800"
                          >
                            Approve Review
                          </button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleReviewStatus(r.id, 'REJECTED')}
                            className="border border-red-300 text-red-700 px-2.5 py-1 rounded-xs text-[10px] font-semibold hover:bg-red-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#1F1D1D]">
                  The Atelier Gazette Subscribers
                </h3>
                <span className="text-[11px] text-[#7E7873]">
                  {subscribers.length} opt-in high intent email leads
                </span>
              </div>
              <button
                onClick={exportSubscribers}
                className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4C5B3] px-2.5 py-1 text-[11px] font-semibold rounded-xs hover:bg-white"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-[#F5EFE6] text-xs">
              {subscribers.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#6B1724]" />
                    <span className="font-medium text-[#1F1D1D]">{sub.email}</span>
                  </div>
                  <span className="text-[10px] text-[#7E7873]">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
