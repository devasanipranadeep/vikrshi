'use server';

import { revalidatePath } from 'next/cache';
import { contactMessageSchema, ContactMessageFormValues } from '@/schemas/contact';
import { contactService } from '@/services/contacts';
import { MessageStatus } from '@/types';
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

export async function submitContactMessageAction(formData: ContactMessageFormValues) {
  try {
    const validated = contactMessageSchema.parse(formData);
    const adminClient = getServerAdminClient();
    const result = await contactService.submitContactMessage(validated, adminClient);

    revalidatePath('/admin/messages');
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to submit contact message' };
  }
}

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  try {
    const adminClient = getServerAdminClient();
    await contactService.updateMessageStatus(id, status, adminClient);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    console.error('updateMessageStatusAction error:', err);
    return { success: false, error: err.message || 'Failed to update message status' };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    const adminClient = getServerAdminClient();
    await contactService.deleteMessage(id, adminClient);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    console.error('deleteMessageAction error:', err);
    return { success: false, error: err.message || 'Failed to delete message' };
  }
}

