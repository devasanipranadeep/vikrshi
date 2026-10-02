import { z } from 'zod';

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
});

export const createOrderInquirySchema = z.object({
  locationId: z.string().min(1, 'Delivery location is required'),
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  customerNote: z.string().optional().nullable(),
  items: z.array(orderItemInputSchema).min(1, 'Order must contain at least 1 item'),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CreateOrderInquiryInput = z.infer<typeof createOrderInquirySchema>;
