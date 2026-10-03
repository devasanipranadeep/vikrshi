'use client';

import React from 'react';
import Image from 'next/image';
import {
  Package,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowUpRight,
  Sparkles,
  Mail,
  ShoppingBag,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  Product,
  LocationItem,
  CustomerReview,
  OrderInquiryRecord,
  ContactMessageItem,
} from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface DashboardOverviewProps {
  products: Product[];
  locations: LocationItem[];
  inquiries?: OrderInquiryRecord[];
  messages?: ContactMessageItem[];
  reviews?: CustomerReview[];
  onNavigateTab: (tab: string) => void;
}

export function DashboardOverview({
  products = [],
  locations = [],
  inquiries = [],
  messages = [],
  reviews = [],
  onNavigateTab,
}: DashboardOverviewProps) {
  // Metric calculations
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive !== false && p.availabilityStatus !== 'out_of_stock' && p.inStock).length;
  const vegetablesCount = products.filter((p) => p.category?.toLowerCase().includes('vegetable') || p.categoryName?.toLowerCase().includes('vegetable')).length;
  const fruitsCount = products.filter((p) => p.category?.toLowerCase().includes('fruit') || p.categoryName?.toLowerCase().includes('fruit')).length;
  const activeLocationsCount = locations.filter((l) => l.isActive).length;

  const newMessagesCount = messages.filter((m) => m.status === 'new').length;
  const totalInquiriesCount = inquiries.length;

  const recentProducts = products.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 p-6 sm:p-8 text-white relative overflow-hidden border border-forest-800 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Operations Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Operations & Farm Dispatch Command
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl leading-relaxed">
              Real-time synchronization across organic product catalogs, WhatsApp order inquiries, and multi-city delivery hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('products')}
              className="px-4 py-2.5 rounded-xl bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              + Add Product Item
            </button>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all border border-white/10 cursor-pointer"
            >
              View Inquiries ({totalInquiriesCount})
            </button>
          </div>
        </div>
      </div>

      {/* Required Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Total Items</span>
            <Package className="w-4 h-4 text-forest-400 group-hover:text-leaf-600 transition-colors" />
          </div>
          <span className="font-serif text-2xl font-bold text-forest-950">{totalProducts}</span>
          <span className="text-[10px] text-forest-500 block mt-0.5">Catalog total</span>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Active Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-emerald-700">{activeProducts}</span>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">In stock now</span>
        </div>

        {/* Vegetables */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Vegetables</span>
            <Layers className="w-4 h-4 text-leaf-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-forest-950">{vegetablesCount}</span>
          <span className="text-[10px] text-forest-500 block mt-0.5">Farm greens</span>
        </div>

        {/* Fruits */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Fruits</span>
            <Sparkles className="w-4 h-4 text-gold-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-forest-950">{fruitsCount}</span>
          <span className="text-[10px] text-forest-500 block mt-0.5">Orchard picks</span>
        </div>

        {/* Active Locations */}
        <div
          onClick={() => onNavigateTab('locations')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Active Cities</span>
            <MapPin className="w-4 h-4 text-leaf-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-forest-950">{activeLocationsCount}</span>
          <span className="text-[10px] text-leaf-600 block mt-0.5">Delivery hubs</span>
        </div>



        {/* New Messages */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">Messages</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-blue-700">{newMessagesCount}</span>
          <span className="text-[10px] text-blue-600 block mt-0.5">New unread</span>
        </div>

        {/* Order Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs hover:border-leaf-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-forest-600 truncate">WhatsApp Inq</span>
            <ShoppingBag className="w-4 h-4 text-leaf-600" />
          </div>
          <span className="font-serif text-2xl font-bold text-leaf-700">{totalInquiriesCount}</span>
          <span className="text-[10px] text-leaf-600 block mt-0.5">Total orders</span>
        </div>
      </div>

      {/* Two-Column Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products Table */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Recent Product Additions</h3>
                <p className="text-xs text-forest-600">Fresh harvest entries synchronized in real-time</p>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-semibold text-leaf-600 hover:text-leaf-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-cream-100">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xl bg-cream-100 overflow-hidden shrink-0">
                      <Image
                        src={p.imageUrl || p.image}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-forest-900 truncate">{p.name}</h4>
                      <span className="text-[11px] text-forest-500 capitalize">{p.categoryName || p.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-forest-900">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="text-[10px] text-forest-500 block">/{p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Order Inquiries Table */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Recent WhatsApp Inquiries</h3>
                <p className="text-xs text-forest-600">Latest customer orders dispatched to WhatsApp</p>
              </div>
              <button
                onClick={() => onNavigateTab('inquiries')}
                className="text-xs font-semibold text-leaf-600 hover:text-leaf-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-forest-600">
                No orders yet. Orders initiated by customers will show here.
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-forest-900">
                          #{inq.id.slice(0, 8)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-leaf-50 text-leaf-700 font-semibold capitalize">
                          {inq.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-forest-700 truncate">
                        {inq.customerName || 'Customer'} • {inq.locationName || 'Hyderabad'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-bold text-forest-950">
                        {inq.estimatedTotal !== null ? formatCurrency(inq.estimatedTotal) : '—'}
                      </span>
                      <span className="text-[10px] text-forest-500 block">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
