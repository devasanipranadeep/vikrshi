'use server';

import { revalidatePath } from 'next/cache';
import { communityService } from '@/services/community';
import { CommunityRequestStatus } from '@/types';
import { createAdminClient } from '@/lib/supabase/admin';

function getServerAdminClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createAdminClient();
    } catch (e) {
      console.warn('Could not create admin client:', e);
    }
  }
  return undefined;
}

export interface CommunityRequestFormInput {
  applicantName: string;
  phone?: string;
  communityName: string;
  address: string;
  source: string;
  details?: string;
}

export async function submitCommunityRequestAction(input: CommunityRequestFormInput) {
  try {
    if (!input.applicantName?.trim() || !input.communityName?.trim() || !input.address?.trim() || !input.source?.trim()) {
      return { success: false, error: 'Please provide all required fields' };
    }

    const adminClient = getServerAdminClient();
    const result = await communityService.createCommunityRequest(
      {
        applicant_name: input.applicantName.trim(),
        phone: input.phone?.trim() || null,
        community_name: input.communityName.trim(),
        address: input.address.trim(),
        source: input.source.trim(),
        details: input.details?.trim() || null,
        status: 'new',
      },
      adminClient
    );

    revalidatePath('/admin/community');
    revalidatePath('/admin');

    return { success: true, data: result };
  } catch (err: any) {
    console.error('submitCommunityRequestAction error:', err);
    return { success: false, error: err.message || 'Failed to submit community request' };
  }
}

export async function updateCommunityRequestStatusAction(
  id: string,
  status: CommunityRequestStatus
) {
  try {
    const adminClient = getServerAdminClient();
    await communityService.updateStatus(id, status, adminClient);

    revalidatePath('/admin/community');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('updateCommunityRequestStatusAction error:', err);
    return { success: false, error: err.message || 'Failed to update request status' };
  }
}

export async function deleteCommunityRequestAction(id: string) {
  try {
    const adminClient = getServerAdminClient();
    await communityService.deleteCommunityRequest(id, adminClient);

    revalidatePath('/admin/community');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('deleteCommunityRequestAction error:', err);
    return { success: false, error: err.message || 'Failed to delete community request' };
  }
}
