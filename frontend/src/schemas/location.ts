import { z } from 'zod';

export const locationSchema = z.object({
  city: z.string().min(2, 'City name is required'),
  state: z.string().min(2, 'State name is required'),
  country: z.string().default('India'),
  slug: z.string().optional(),
  address: z.string().optional().nullable(),
  serviceAreas: z.array(z.string()).default([]),
  deliveryAvailable: z.boolean().default(true),
  whatsappNumber: z
    .string()
    .regex(/^[0-9+ ]*$/, 'Invalid WhatsApp number format')
    .optional()
    .nullable(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type LocationInputValues = z.input<typeof locationSchema>;
export type LocationFormValues = z.input<typeof locationSchema>;
export type LocationValidatedValues = z.output<typeof locationSchema>;
