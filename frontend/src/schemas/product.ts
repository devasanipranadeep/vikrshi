import { z } from 'zod';

export const productUnitEnum = z.enum([
  'kg',
  '500g',
  '250g',
  'piece',
  'dozen',
  'bunch',
  'box',
]);

export const availabilityStatusEnum = z.enum([
  'in_stock',
  'low_stock',
  'out_of_stock',
  'seasonal',
]);

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must have at least 2 characters'),
  slug: z.string().optional(),
  categoryId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform((val) => (!val || val === '' ? null : val)),
  shortDescription: z.string().max(250, 'Short description cannot exceed 250 characters').optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, 'Price must be greater than or equal to 0'),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  unit: productUnitEnum,
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
  galleryImages: z.array(z.string()).optional().default([]),
  organic: z.boolean().optional().default(true),
  seasonal: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  availabilityStatus: availabilityStatusEnum.optional().default('in_stock'),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
  locationSettings: z
    .array(
      z.object({
        locationId: z.string(),
        isAvailable: z.boolean().default(true),
        customPrice: z.coerce.number().min(0).nullable().optional(),
        availabilityStatus: availabilityStatusEnum.nullable().optional(),
      })
    )
    .optional(),
});

export type ProductInputValues = z.input<typeof productSchema>;
export type ProductFormValues = z.input<typeof productSchema>;
export type ProductValidatedValues = z.output<typeof productSchema>;
