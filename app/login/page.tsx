'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push(data.redirectUrl || '/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'admin' | 'manager' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@artisha.pk');
      setPassword('adminpassword123');
    } else if (role === 'manager') {
      setEmail('manager@artisha.pk');
      setPassword('managerpassword123');
    } else {
      setEmail('customer@artisha.pk');
      setPassword('customerpassword123');
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
            Sign in to Your Account
          </h2>
          <p className="text-xs text-[#7E7873]">
            Access your order history, saved addresses, and wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
              Email Address
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D]">
                Password
              </label>
              <span className="text-[11px] text-[#6B1724] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
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
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-4 border-t border-[#E6DFD5] space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#7E7873] font-semibold block text-center">
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="p-1.5 bg-[#F5EFE6] hover:bg-[#E6DFD5] text-[#1F1D1D] rounded-xs font-medium transition-colors text-center"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('manager')}
              className="p-1.5 bg-[#F5EFE6] hover:bg-[#E6DFD5] text-[#1F1D1D] rounded-xs font-medium transition-colors text-center"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="p-1.5 bg-[#F5EFE6] hover:bg-[#E6DFD5] text-[#1F1D1D] rounded-xs font-medium transition-colors text-center"
            >
              Customer
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#7E7873] pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#6B1724] font-semibold underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
