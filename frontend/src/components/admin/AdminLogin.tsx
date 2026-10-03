'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your admin email and password');
      return;
    }

    setError(null);
    setIsLoggingIn(true);

    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-cream-50">
      {/* Background organic glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to storefront link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cream-200/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Crest */}
        <div className="flex flex-col items-center text-center">
          <div className="relative h-28 w-28 rounded-2xl bg-white p-2.5 shadow-2xl mb-4 ring-2 ring-leaf-400/40 flex items-center justify-center">
            <Image
              src="/logo-full.png"
              alt="Vikrshi Suppliers"
              width={100}
              height={100}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Vikrshi Admin Portal
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-cream-200/70">
            Sign in to manage products, orders, and store operations
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-forest-900/90 backdrop-blur-xl border border-white/10 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-950/80 border border-white/15 text-white placeholder:text-cream-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-950/80 border border-white/15 text-white placeholder:text-cream-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-bold text-sm transition-all shadow-lg shadow-leaf-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-cream-200/50">
          <ShieldCheck className="w-4 h-4 text-leaf-400" />
          <span>Authorized Vikrshi Farm Personnel Only</span>
        </div>
      </div>
    </div>
  );
}

