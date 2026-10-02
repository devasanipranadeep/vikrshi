'use server';

import { revalidatePath } from 'next/cache';
import { createOrderInquirySchema, CreateOrderInquiryInput } from '@/schemas/order';
import { orderService } from '@/services/orders';
import { InquiryStatus } from '@/types';

export async function createWhatsAppOrderAction(input: CreateOrderInquiryInput) {
  try {
    const validated = createOrderInquirySchema.parse(input);
    const result = await orderService.createWhatsAppOrderInquiry(validated);

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
    await orderService.updateInquiryStatus(id, status);
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update inquiry status' };
  }
}
