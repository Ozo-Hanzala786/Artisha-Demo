'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact dispatch / save notification
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E7873] uppercase tracking-wider border-b border-[#E6DFD5] pb-4">
        <Link href="/" className="hover:text-[#6B1724]">Home</Link>
        <span>/</span>
        <span className="text-[#1F1D1D] font-medium">Contact &amp; Flagship Boutique</span>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold">
          Client Concierge
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1D]">
          Get In Touch With Artisha
        </h1>
        <p className="text-xs text-[#7E7873]">
          Whether you have an inquiry regarding custom sizing, bridal appointments, order status, or boutique visits at Dolmen Mall Lahore.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Store Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F5] border border-[#E6DFD5] p-6 rounded-xs space-y-5 shadow-xs">
            <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-3">
              Flagship Boutique Lahore
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6B1724] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1D1D]">Store Address</strong>
                  <p className="text-[#7E7873]">
                    Shop 104, First Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#6B1724] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1D1D]">Boutique Timings</strong>
                  <p className="text-[#7E7873]">
                    Monday – Sunday: 11:00 AM – 11:00 PM (Including Holidays)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#6B1724] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1D1D]">Direct Telephone</strong>
                  <p className="text-[#7E7873]">+92 300 8472910 / +92 42 37189000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#6B1724] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1D1D]">Email Concierge</strong>
                  <p className="text-[#7E7873]">concierge@artisha.pk / care@artisha.pk</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-[#E6DFD5]">
              <a
                href="https://wa.me/923008472910"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+92 300 8472910)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white border border-[#E6DFD5] p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] border-b border-[#E6DFD5] pb-3">
            Send an Atelier Inquiry
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-[#F8F1F2] border border-[#6B1724]/20 rounded-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">Message Sent Successfully</h3>
              <p className="text-xs text-[#7E7873] max-w-sm mx-auto">
                Thank you for contacting Artisha. Our concierge representative will respond to your inquiry within 2 to 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#6B1724] font-semibold underline pt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Malik"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ayesha@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="General Inquiry">General Atelier Inquiry</option>
                    <option value="Bridal Appointment">Bespoke Bridal Appointment (Dolmen Mall)</option>
                    <option value="Order Tracking">Order &amp; Delivery Tracking</option>
                    <option value="Custom Sizing">Custom Stitching &amp; Sizing</option>
                    <option value="Corporate / Bulk">Corporate &amp; Trunk Shows</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our concierge assist you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3.5 py-2.5 rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#6B1724] hover:bg-[#500F1A] text-white py-3.5 px-7 uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{loading ? 'Sending Message...' : 'Transmit Inquiry'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
