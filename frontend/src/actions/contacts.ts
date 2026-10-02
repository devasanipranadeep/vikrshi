'use server';

import { revalidatePath } from 'next/cache';
import { contactMessageSchema, ContactMessageFormValues } from '@/schemas/contact';
import { contactService } from '@/services/contacts';
import { MessageStatus } from '@/types';

export async function submitContactMessageAction(formData: ContactMessageFormValues) {
  try {
    const validated = contactMessageSchema.parse(formData);
    const result = await contactService.submitContactMessage(validated);

    revalidatePath('/admin/messages');
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to submit contact message' };
  }
}

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  try {
    await contactService.updateMessageStatus(id, status);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update message status' };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await contactService.deleteMessage(id);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete message' };
  }
}
