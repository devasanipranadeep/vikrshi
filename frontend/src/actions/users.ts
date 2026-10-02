'use server';

import { revalidatePath } from 'next/cache';
import { createAdminUserSchema, CreateAdminUserInput } from '@/schemas/user';
import { profileService } from '@/services/profiles';
import { AdminRole } from '@/types';

export async function createAdminUserAction(formData: CreateAdminUserInput) {
  try {
    const validated = createAdminUserSchema.parse(formData);
    const profile = await profileService.createAdminUser(validated);

    revalidatePath('/admin/users');

    return { success: true, data: profile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create admin user' };
  }
}

export async function updateAdminUserStatusAction(id: string, isActive: boolean) {
  try {
    await profileService.updateProfileStatus(id, isActive);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update user status' };
  }
}

export async function updateAdminUserRoleAction(id: string, role: AdminRole) {
  try {
    await profileService.updateProfileRole(id, role);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update user role' };
  }
}

export async function deleteAdminUserAction(id: string) {
  try {
    await profileService.deleteAdminUser(id);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete user' };
  }
}
