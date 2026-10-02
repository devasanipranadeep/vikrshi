import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must have at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z
    .string()
    .refine(
      (val) => !val || val.trim() === '' || val.startsWith('/') || /^https?:\/\//i.test(val),
      { message: 'Must be a valid URL or path' }
    )
    .nullable()
    .optional()
    .or(z.literal('')),
  imagePath: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryInputValues = z.input<typeof categorySchema>;
export type CategoryFormValues = z.input<typeof categorySchema>;
export type CategoryValidatedValues = z.output<typeof categorySchema>;
