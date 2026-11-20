'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-[#E6DFD5] rounded-xs shadow-sm">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-serif-luxury text-3xl font-bold tracking-[0.2em] text-[#1F1D1D] uppercase">
              Artisha
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#7E7873] uppercase block -mt-1">
              Lahore
            </span>
          </Link>
          <h2 className="font-serif-luxury text-xl font-bold text-[#1F1D1D] pt-2">
            Create an Account
          </h2>
          <p className="text-xs text-[#7E7873]">
            Join the Artisha Patron Circle for expedited checkout &amp; bespoke previews.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Zainab Qureshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-9 pr-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
              <User className="w-4 h-4 text-[#7E7873] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-9 pr-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
              <Mail className="w-4 h-4 text-[#7E7873] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Phone Number (for order SMS updates)
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-9 pr-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
              <Phone className="w-4 h-4 text-[#7E7873] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Password (at least 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-9 pr-3.5 py-2.5 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
              />
              <Lock className="w-4 h-4 text-[#7E7873] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B1724] hover:bg-[#500F1A] text-white py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-md disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#7E7873] pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6B1724] font-semibold underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
