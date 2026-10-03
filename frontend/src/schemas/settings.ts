import { z } from 'zod';

const urlOrPathSchema = z
  .string()
  .refine(
    (val) => !val || val.trim() === '' || val.startsWith('/') || /^https?:\/\//i.test(val),
    { message: 'Must be a valid URL or path (e.g. /logo-full.png or https://...)' }
  )
  .nullable()
  .optional()
  .or(z.literal(''));

const optionalUrlSchema = z
  .string()
  .refine(
    (val) => !val || val.trim() === '' || /^https?:\/\//i.test(val),
    { message: 'Must be a valid URL starting with http:// or https://' }
  )
  .nullable()
  .optional()
  .or(z.literal(''));

const optionalEmailSchema = z
  .string()
  .refine(
    (val) => !val || val.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: 'Invalid email address' }
  )
  .nullable()
  .optional()
  .or(z.literal(''));

export const companySettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logoUrl: urlOrPathSchema,
  logoPath: z.string().nullable().optional(),
  whatsappNumber: z.string().regex(/^[0-9+ ]*$/, 'Invalid WhatsApp number format').nullable().optional().or(z.literal('')),
  phoneNumber: z.string().optional().nullable().or(z.literal('')),
  email: optionalEmailSchema,
  instagramUrl: optionalUrlSchema,
  address: z.string().optional().nullable().or(z.literal('')),
  businessHours: z.string().optional().nullable().or(z.literal('')),
  googleMapsUrl: optionalUrlSchema,
  footerDescription: z.string().optional().nullable().or(z.literal('')),
  seoTitle: z.string().optional().nullable().or(z.literal('')),
  seoDescription: z.string().optional().nullable().or(z.literal('')),
  orderingEnabled: z.boolean().default(true),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;
