import { getBrowserClient } from '@/lib/supabase/client';
import { CommunityRequestItem, CommunityRequestStatus, Database } from '@/types';

type CommunityRequestRow = Database['public']['Tables']['community_requests']['Row'];
type CommunityRequestInsert = Database['public']['Tables']['community_requests']['Insert'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

function mapRow(row: any): CommunityRequestItem {
  return {
    id: row.id,
    applicantName: row.applicant_name,
    phone: row.phone,
    communityName: row.community_name,
    address: row.address,
    source: row.source,
    details: row.details,
    status: row.status as CommunityRequestStatus,
    createdAt: row.created_at,
  };
}

export const communityService = {
  /**
   * Submit a new community request
   */
  async createCommunityRequest(
    payload: CommunityRequestInsert,
    customClient?: any
  ): Promise<CommunityRequestItem | null> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('community_requests')
        .insert({
          applicant_name: payload.applicant_name,
          phone: payload.phone || null,
          community_name: payload.community_name,
          address: payload.address,
          source: payload.source,
          details: payload.details || null,
          status: payload.status || 'new',
        })
        .select()
        .single();

      if (error) {
        console.warn('Could not save community request to Supabase:', error.message);
        return null;
      }

      return mapRow(data);
    } catch (err) {
      console.warn('Failed inserting community request:', err);
      return null;
    }
  },

  /**
   * Admin: Get all community requests with optional status filter
   */
  async getCommunityRequests(
    statusFilter?: string,
    customClient?: any
  ): Promise<CommunityRequestItem[]> {
    try {
      const client = getClient(customClient);
      let query = client
        .from('community_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error || !data) {
        if (error) console.warn('Supabase getCommunityRequests error:', error.message);
        return [];
      }

      return data.map(mapRow);
    } catch {
      return [];
    }
  },

  /**
   * Admin: Update request status
   */
  async updateStatus(
    id: string,
    status: CommunityRequestStatus,
    customClient?: any
  ): Promise<boolean> {
    try {
      const client = getClient(customClient);
      const { error } = await client
        .from('community_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      console.error('Failed to update community request status:', err);
      throw err;
    }
  },

  /**
   * Admin: Delete community request
   */
  async deleteCommunityRequest(id: string, customClient?: any): Promise<boolean> {
    try {
      const client = getClient(customClient);
      const { error } = await client
        .from('community_requests')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      console.error('Failed to delete community request:', err);
      throw err;
    }
  },
};
