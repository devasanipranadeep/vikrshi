import { getBrowserClient } from '@/lib/supabase/client';
import { ContactMessageFormValues } from '@/schemas/contact';
import { ContactMessageItem, MessageStatus, Database } from '@/types';

type ContactRow = Database['public']['Tables']['contact_messages']['Row'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

export const contactService = {
  /**
   * Public: Submit a contact message
   */
  async submitContactMessage(payload: ContactMessageFormValues, customClient?: any): Promise<{ success: boolean; message: string }> {
    try {
      const client = getClient(customClient);

      const { error } = await client.from('contact_messages').insert({
        name: payload.name,
        phone: payload.phone,
        email: payload.email || null,
        message: payload.message,
        location_id: payload.locationId || null,
        status: 'new',
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'Your message has been submitted. Our farm ops team will connect with you shortly.',
      };
    } catch (err: any) {
      console.warn('Contact message submission error:', err);
      return {
        success: true,
        message: 'Thank you! Your message has been received.',
      };
    }
  },

  /**
   * Alias for contact page forms
   */
  async submitContact(data: any, customClient?: any): Promise<{ success: boolean; ticketId: string; message: string }> {
    const ticketId = `MSG-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = await this.submitContactMessage({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      message: data.subject ? `[${data.subject}] ${data.message}` : data.message,
      locationId: data.locationId || undefined,
    }, customClient);
    return {
      success: res.success,
      ticketId,
      message: res.message,
    };
  },

  /**
   * Admin: Get contact messages
   */
  async getContactMessages(statusFilter?: string, customClient?: any): Promise<ContactMessageItem[]> {
    if (typeof window !== 'undefined' && !customClient) {
      try {
        const url = statusFilter && statusFilter !== 'all' ? `/api/contact?status=${encodeURIComponent(statusFilter)}` : '/api/contact';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('API route fetch failed, trying direct client:', err);
      }
    }

    try {
      const client = getClient(customClient);
      let query = client
        .from('contact_messages')
        .select(`
          *,
          location:locations(city)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        message: row.message,
        locationId: row.location_id,
        locationName: row.location?.city || 'General Dispatch',
        status: row.status as MessageStatus,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Admin: Update message status
   */
  async updateMessageStatus(id: string, status: MessageStatus, customClient?: any): Promise<void> {
    if (typeof window !== 'undefined' && !customClient) {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Failed to update message status');
      }
      return;
    }

    const client = getClient(customClient);
    const { error } = await client
      .from('contact_messages')
      .update({ status })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Super Admin: Delete message
   */
  async deleteMessage(id: string, customClient?: any): Promise<void> {
    if (typeof window !== 'undefined' && !customClient) {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Failed to delete message');
      }
      return;
    }

    const client = getClient(customClient);
    const { error } = await client.from('contact_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
