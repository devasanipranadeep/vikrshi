'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  MapPin,
  ShoppingBag,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, onSelectTab, children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Stock', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'locations', label: 'Delivery Hubs', icon: MapPin },
    { id: 'inquiries', label: 'Order Inquiries', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-50/50 text-forest-950 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-forest-950 text-white border-b border-forest-800">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden">
            <Image
              src="/logo-emblem.png"
              alt="Vikrshi"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <span className="font-serif font-bold text-base">Vikrshi Admin</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-cream-200 hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-forest-950 text-cream-50 flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 shadow-2xl ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5 overflow-y-auto">
          {/* Logo brand */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="relative w-10 h-10 rounded-full bg-white p-1 shadow-md overflow-hidden shrink-0">
              <Image
                src="/logo-emblem.png"
                alt="Vikrshi Suppliers"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-lg text-white block leading-tight truncate">
                Vikrshi Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-3 border-t border-forest-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-leaf-600 text-white shadow-sm'
                      : 'text-cream-200/70 hover:text-white hover:bg-forest-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-leaf-400'}`} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User info & Logout */}
        <div className="pt-4 border-t border-forest-800/80 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-cream-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-leaf-400" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-forest-400" />
          </Link>

          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-leaf-700 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.name || 'Vikrshi Admin'}
                </span>
                <span className="text-[10px] text-leaf-300 block truncate">
                  Administrator
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-cream-300/60 hover:text-red-400 hover:bg-forest-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-cream-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-forest-600">
            <span className="font-bold text-forest-950 capitalize">{activeTab}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" />
              <span>Secure Admin Session</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-semibold transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3 text-leaf-600" />
            </Link>

            <button
              onClick={logout}
              className="text-xs font-medium text-forest-600 hover:text-red-600 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
