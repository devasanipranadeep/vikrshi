'use client';

import React, { useState } from 'react';
import { ContactMessageItem, MessageStatus } from '@/types';
import { updateMessageStatusAction, deleteMessageAction } from '@/actions/contacts';
import {
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface MessagesManagerProps {
  messages: ContactMessageItem[];
  onMessageUpdated: () => void;
}

export function MessagesManager({ messages, onMessageUpdated }: MessagesManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    try {
      const res = await updateMessageStatusAction(id, status);
      if (res.success) {
        toast.success(`Message marked as ${status}`);
        onMessageUpdated();
      } else {
        toast.error(res.error || 'Failed to update message');
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!window.confirm(`Delete message from ${senderName}?`)) return;
    try {
      const res = await deleteMessageAction(id);
      if (res.success) {
        toast.success('Message deleted');
        onMessageUpdated();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3 text-blue-600" /> New
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cream-200 text-forest-800 text-[10px] font-bold uppercase">
            Read
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Responded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase">
            <Archive className="w-3 h-3 text-stone-500" /> Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Customer Inquiries & Messages</h2>
          <p className="text-xs text-forest-600 mt-0.5">
            Contact form submissions and direct customer inquiries
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-cream-200 shadow-2xs">
          {['all', 'new', 'read', 'responded', 'archived'].map((st) => (
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

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center shadow-xs">
          <MessageSquare className="w-12 h-12 text-leaf-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-forest-900">No messages found</h3>
          <p className="text-xs text-forest-600 mt-1">
            Incoming contact messages from the website will appear here for the ops team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => {
            const dateStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently';

            return (
              <div
                key={msg.id}
                className="bg-white rounded-2xl border border-cream-200 p-5 shadow-xs hover:border-leaf-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-forest-900 text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-leaf-600" />
                      {msg.name}
                    </span>
                    {getStatusBadge(msg.status)}
                    <span className="text-[11px] text-forest-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={msg.status}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value as MessageStatus)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-cream-300 bg-cream-50/50 font-medium text-forest-800"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="p-1.5 rounded-lg text-forest-400 hover:text-red-600 hover:bg-cream-100 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-forest-700">
                  <a
                    href={`tel:${msg.phone}`}
                    className="flex items-center gap-1.5 text-leaf-700 hover:underline font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {msg.phone}
                  </a>

                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 text-forest-600 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {msg.email}
                    </a>
                  )}

                  <span className="flex items-center gap-1.5 text-forest-600">
                    <MapPin className="w-3.5 h-3.5 text-leaf-500" />
                    {msg.locationName || 'Hyderabad'}
                  </span>
                </div>

                <p className="text-xs text-forest-900/90 leading-relaxed bg-cream-50/60 p-3.5 rounded-xl border border-cream-200/60">
                  {msg.message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
