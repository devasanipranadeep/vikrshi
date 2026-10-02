import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'A valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  locationId: z.string().uuid('Invalid location ID').nullable().optional(),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;
