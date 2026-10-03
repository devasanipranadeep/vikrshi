'use server';

import { revalidatePath } from 'next/cache';
import { createOrderInquirySchema, CreateOrderInquiryInput } from '@/schemas/order';
import { orderService } from '@/services/orders';
import { InquiryStatus } from '@/types';
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

export async function createWhatsAppOrderAction(input: CreateOrderInquiryInput) {
  try {
    const validated = createOrderInquirySchema.parse(input);
    const adminClient = getServerAdminClient();
    const result = await orderService.createWhatsAppOrderInquiry(validated, adminClient);

    revalidatePath('/admin/inquiries');

    return {
      success: true,
      whatsappUrl: result.whatsappUrl,
      inquiryId: result.inquiryId,
      estimatedTotal: result.estimatedTotal,
      messageText: result.messageText,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to initialize WhatsApp order inquiry',
    };
  }
}

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  try {
    const adminClient = getServerAdminClient();
    await orderService.updateInquiryStatus(id, status, adminClient);
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update inquiry status' };
  }
}

