'use client';

import React, { useState } from 'react';
import { InquiryLead } from '@/app/api/inquiries/route';
import {
  MessageSquare,
  Phone,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle,
  Truck,
  Filter,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface LeadsManagerProps {
  leads: InquiryLead[];
  onLeadUpdated: () => void;
}

export function LeadsManager({ leads, onLeadUpdated }: LeadsManagerProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleUpdateStatus = async (id: string, newStatus: InquiryLead['status']) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Updated order status to ${newStatus}`);
        onLeadUpdated();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (e) {
      toast.error('Network error updating order');
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.itemsSummary.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-sm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
            WhatsApp Orders & Dispatch Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-0.5">
            Manage incoming WhatsApp customer orders, custom requests, and community deliveries.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <span>{leads.length} Total Registered Inquiries</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, phone, location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'New', 'Harvesting', 'Dispatched', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-leaf-700 text-white shadow-xs'
                  : 'bg-white text-forest-700 hover:bg-forest-50 border border-forest-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Feed */}
      <div className="space-y-4">
        {filtered.map((lead) => {
          const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
          const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
            lead.customerName
          )},%20this%20is%20Vikrshi%20Suppliers.%20Regarding%20your%20order%20(${lead.id})...`;

          return (
            <div
              key={lead.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-forest-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-serif font-bold text-forest-950 text-base">
                    {lead.customerName}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-forest-100/70 text-forest-700 font-semibold">
                    {lead.id}
                  </span>
                  <span className="text-[11px] font-medium text-forest-500 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
                    Source: {lead.source}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-forest-800 font-medium">
                  {lead.itemsSummary}
                </p>

                <div className="flex items-center gap-4 text-xs text-forest-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-leaf-600" />
                    {lead.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-leaf-600" />
                    {lead.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-leaf-600" />
                    {lead.createdAt}
                  </span>
                </div>

                {lead.notes && (
                  <p className="text-xs text-amber-800 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60 inline-block">
                    Note: {lead.notes}
                  </p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-forest-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-forest-500 block">Est. Amount</span>
                  <span className="text-lg font-serif font-bold text-forest-950">
                    ₹{lead.estimatedValue}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleUpdateStatus(lead.id, e.target.value as any)
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-forest-200 bg-forest-50 text-forest-900 focus:outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
