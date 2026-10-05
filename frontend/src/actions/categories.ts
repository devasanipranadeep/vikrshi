'use server';

import { revalidatePath } from 'next/cache';
import { categorySchema, CategoryFormValues } from '@/schemas/category';
import { categoryService } from '@/services/categories';
import { generateSlug } from '@/utils/slug';
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

function formatErrorMessage(err: any): string {
  if (err?.issues && Array.isArray(err.issues) && err.issues.length > 0) {
    return err.issues.map((i: any) => i.message).join(', ');
  }
  if (err?.message) {
    try {
      const parsed = JSON.parse(err.message);
      if (Array.isArray(parsed) && parsed[0]?.message) {
        return parsed.map((p: any) => p.message).join(', ');
      }
    } catch {
      // not JSON
    }
    return err.message;
  }
  return 'An unexpected error occurred';
}

export async function createCategoryAction(formData: CategoryFormValues) {
  try {
    const validated = categorySchema.parse(formData);
    const slug = validated.slug?.trim() || generateSlug(validated.name);
    const adminClient = getServerAdminClient();

    const category = await categoryService.createCategory({
      name: validated.name,
      slug,
      description: validated.description || null,
      image_url: validated.imageUrl || null,
      image_path: validated.imagePath || null,
      is_active: validated.isActive,
      sort_order: validated.sortOrder,
    }, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true, data: category };
  } catch (err: any) {
    console.error('createCategoryAction error:', err);
    return { success: false, error: formatErrorMessage(err) };
  }
}

export async function updateCategoryAction(id: string, formData: Partial<CategoryFormValues>) {
  try {
    const validated = categorySchema.partial().parse(formData);
    const slug = validated.name ? generateSlug(validated.name) : validated.slug;

    const payload: any = {};
    if (validated.name !== undefined) payload.name = validated.name;
    if (slug !== undefined) payload.slug = slug;
    if (validated.description !== undefined) payload.description = validated.description;
    if (validated.imageUrl !== undefined) payload.image_url = validated.imageUrl;
    if (validated.imagePath !== undefined) payload.image_path = validated.imagePath;
    if (validated.isActive !== undefined) payload.is_active = validated.isActive;
    if (validated.sortOrder !== undefined) payload.sort_order = validated.sortOrder;

    const adminClient = getServerAdminClient();
    const updated = await categoryService.updateCategory(id, payload, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true, data: updated };
  } catch (err: any) {
    console.error('updateCategoryAction error:', err);
    return { success: false, error: formatErrorMessage(err) };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const adminClient = getServerAdminClient();
    await categoryService.deleteCategory(id, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (err: any) {
    console.error('deleteCategoryAction error:', err);
    return { success: false, error: formatErrorMessage(err) };
  }
}

