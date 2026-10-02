import { z } from 'zod';

export const adminRoleEnum = z.enum(['admin', 'super_admin', 'content_manager']);

export const createAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  role: adminRoleEnum.default('admin'),
});

export const updateAdminUserSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').optional(),
  role: adminRoleEnum.optional(),
  isActive: z.boolean().optional(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
