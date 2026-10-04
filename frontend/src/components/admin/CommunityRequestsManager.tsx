'use client';

import React, { useState } from 'react';
import { CommunityRequestItem, CommunityRequestStatus } from '@/types';
import {
  updateCommunityRequestStatusAction,
  deleteCommunityRequestAction,
} from '@/actions/community';
import {
  Building2,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Search,
  Compass,
  FileText,
  Trash2,
  Loader2,
  ExternalLink,
  Users2,
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunityRequestsManagerProps {
  requests: CommunityRequestItem[];
  onRequestUpdated: () => void;
}

export function CommunityRequestsManager({
  requests,
  onRequestUpdated,
}: CommunityRequestsManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (req.applicantName || '').toLowerCase().includes(q);
      const matchCommunity = (req.communityName || '').toLowerCase().includes(q);
      const matchPhone = (req.phone || '').toLowerCase().includes(q);
      const matchAddress = (req.address || '').toLowerCase().includes(q);
      const matchSource = (req.source || '').toLowerCase().includes(q);
      return matchName || matchCommunity || matchPhone || matchAddress || matchSource;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: CommunityRequestStatus) => {
    setUpdatingId(id);
    try {
      const res = await updateCommunityRequestStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Request marked as ${newStatus}`);
        onRequestUpdated();
      } else {
        toast.error(res.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, communityName: string) => {
    if (!window.confirm(`Are you sure you want to delete the request from ${communityName}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteCommunityRequestAction(id);
      if (res.success) {
        toast.success('Community request deleted');
        onRequestUpdated();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: CommunityRequestStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Approved
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            <MessageCircle className="w-3 h-3 text-blue-600" /> Contacted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
            <XCircle className="w-3 h-3 text-red-600" /> Rejected
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" /> New Request
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              Community & Society Requests
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-leaf-100 text-leaf-800 text-xs font-bold">
              {requests.length} Total
            </span>
          </div>
          <p className="text-xs text-forest-600 mt-0.5">
            Incoming partnership requests from gated communities, apartment societies, and RWAs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-cream-200 shadow-2xs">
          {['all', 'new', 'contacted', 'approved', 'rejected', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'text-forest-700 hover:bg-cream-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by applicant name, society name, phone, address, or referral source..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-cream-200 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 shadow-2xs font-medium"
        />
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center shadow-xs">
          <Building2 className="w-12 h-12 text-leaf-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-forest-900">
            No community requests found
          </h3>
          <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
            When apartment residents or society committees submit requests through the website, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs divide-y divide-cream-200">
          {filteredRequests.map((req) => {
            const dateStr = req.createdAt
              ? new Date(req.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now';

            const cleanPhone = req.phone?.replace(/[^0-9]/g, '');

            return (
              <div
                key={req.id}
                className="p-5 sm:p-6 hover:bg-cream-50/50 transition-colors space-y-3.5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info: Community name and badges */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-leaf-600 shrink-0" />
                        <span>{req.communityName}</span>
                      </span>
                      {getStatusBadge(req.status)}
                      <span className="text-[11px] text-forest-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" /> {dateStr}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-forest-800 pt-0.5">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <User className="w-3.5 h-3.5 text-leaf-600" />
                        <span>{req.applicantName}</span>
                      </span>

                      {req.phone && (
                        <a
                          href={`tel:${req.phone}`}
                          className="flex items-center gap-1.5 text-forest-600 hover:text-forest-950 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-leaf-600" />
                          <span>{req.phone}</span>
                        </a>
                      )}

                      <span className="flex items-center gap-1.5 text-forest-600">
                        <MapPin className="w-3.5 h-3.5 text-leaf-500" />
                        <span className="line-clamp-1">{req.address}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] text-leaf-800 bg-leaf-50 px-2 py-0.5 rounded-md border border-leaf-200">
                        <Compass className="w-3 h-3 text-leaf-600" />
                        <span>Source: {req.source}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions: Quick status select, WhatsApp Chat, Delete */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Status select */}
                    <div className="relative">
                      <select
                        value={req.status}
                        disabled={updatingId === req.id}
                        onChange={(e) =>
                          handleStatusChange(req.id, e.target.value as CommunityRequestStatus)
                        }
                        className="text-xs px-3 py-1.5 rounded-xl border border-cream-300 bg-white font-medium text-forest-900 focus:outline-none focus:border-leaf-500 shadow-2xs cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* WhatsApp Direct Chat Button */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                          req.applicantName
                        )},%20thank%20you%20for%20reaching%20out%20to%20Vikrshi%20Suppliers%20regarding%20organic%20produce%20deliveries%20for%20${encodeURIComponent(
                          req.communityName
                        )}.%20We%20would%20love%20to%20coordinate%20with%20your%20society!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        title="Chat with applicant on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={deletingId === req.id}
                      onClick={() => handleDelete(req.id, req.communityName)}
                      className="p-1.5 rounded-lg text-forest-400 hover:text-red-600 hover:bg-cream-100 transition-colors cursor-pointer"
                      title="Delete request"
                    >
                      {deletingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Details / Preferences if present */}
                {req.details && (
                  <div className="pt-2 text-xs text-forest-800 bg-cream-50/70 p-3.5 rounded-xl border border-cream-200/70 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-forest-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-forest-900 block mb-0.5">
                        Resident & Society Requirements:
                      </span>
                      <p className="text-forest-700 leading-relaxed">{req.details}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
