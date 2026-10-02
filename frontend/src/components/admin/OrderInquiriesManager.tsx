'use client';

import React, { useState } from 'react';
import { OrderInquiryRecord, InquiryStatus } from '@/types';
import { updateInquiryStatusAction } from '@/actions/orders';
import { formatCurrency } from '@/utils/formatters';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderInquiriesManagerProps {
  inquiries: OrderInquiryRecord[];
  onInquiryUpdated: () => void;
}

export function OrderInquiriesManager({ inquiries, onInquiryUpdated }: OrderInquiriesManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await updateInquiryStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Inquiry marked as ${newStatus.replace('_', ' ')}`);
        onInquiryUpdated();
      } else {
        toast.error(res.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Confirmed
          </span>
        );
      case 'whatsapp_redirected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leaf-100 text-leaf-800 text-[11px] font-bold">
            <MessageCircle className="w-3 h-3 text-leaf-600" /> WhatsApp Redirected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
            <XCircle className="w-3 h-3 text-red-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" /> Initiated
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">WhatsApp Order Inquiries</h2>
          <p className="text-xs text-forest-600 mt-0.5">
            Verified server-side orders initiated by customers for WhatsApp farm dispatch
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-cream-200 shadow-2xs">
          {['all', 'whatsapp_redirected', 'confirmed', 'cancelled', 'initiated'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'text-forest-700 hover:bg-cream-100'
              }`}
            >
              {st === 'whatsapp_redirected' ? 'WhatsApp' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center shadow-xs">
          <ShoppingBag className="w-12 h-12 text-leaf-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-forest-900">No order inquiries found</h3>
          <p className="text-xs text-forest-600 mt-1">
            When customers click &quot;Place Order on WhatsApp&quot;, their verified inquiry appears here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-cream-200">
            {filteredInquiries.map((inq) => {
              const isExpanded = expandedId === inq.id;
              const dateStr = inq.createdAt
                ? new Date(inq.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now';

              return (
                <div key={inq.id} className="p-5 hover:bg-cream-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Inquiry Left info */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-forest-900 bg-cream-100 px-2 py-0.5 rounded-md">
                          #{inq.id.slice(0, 8)}
                        </span>
                        {getStatusBadge(inq.status)}
                        <span className="text-[11px] text-forest-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {dateStr}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-forest-800 pt-1">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <User className="w-3.5 h-3.5 text-leaf-600" />
                          {inq.customerName || 'WhatsApp Customer'}
                        </span>
                        {inq.customerPhone && (
                          <span className="flex items-center gap-1.5 text-forest-600">
                            <Phone className="w-3.5 h-3.5 text-leaf-600" />
                            {inq.customerPhone}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-leaf-700 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {inq.locationName || 'Hyderabad'}
                        </span>
                      </div>
                    </div>

                    {/* Inquiry Right info & Status Select */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-forest-500 uppercase tracking-wider block">
                          Verified Total
                        </span>
                        <span className="font-serif text-lg font-bold text-forest-950">
                          {inq.estimatedTotal !== null
                            ? formatCurrency(inq.estimatedTotal)
                            : 'Pending'}
                        </span>
                      </div>

                      {/* Status quick select */}
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-cream-300 bg-white font-medium text-forest-900 focus:outline-none focus:border-leaf-500 shadow-2xs"
                      >
                        <option value="initiated">Initiated</option>
                        <option value="whatsapp_redirected">WhatsApp Redirected</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Expand item list */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                        className="p-1.5 rounded-lg text-forest-600 hover:text-forest-900 hover:bg-cream-200 transition-colors"
                        title={isExpanded ? 'Collapse items' : 'View order items'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Details */}
                  {isExpanded && inq.items && inq.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-cream-200/80 bg-cream-50/70 p-4 rounded-2xl">
                      <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2.5">
                        Harvest Order Items ({inq.items.length})
                      </h4>
                      <div className="divide-y divide-cream-200/60">
                        {inq.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-forest-900">
                                {item.productName}
                              </span>
                              <span className="text-forest-600 ml-2">
                                ({item.quantity} {item.unit})
                              </span>
                            </div>
                            <span className="font-mono font-medium text-forest-950">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
