'use server';

import { revalidatePath } from 'next/cache';
import { productSchema, ProductFormValues } from '@/schemas/product';
import { productService } from '@/services/products';
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

export async function createProductAction(formData: ProductFormValues) {
  try {
    const validated = productSchema.parse(formData);
    const slug = validated.slug?.trim() || generateSlug(validated.name);
    const adminClient = getServerAdminClient();

    const product = await productService.createProduct(
      {
        name: validated.name,
        slug,
        category_id: validated.categoryId || null,
        short_description: validated.shortDescription || null,
        description: validated.description || null,
        price: validated.price,
        compare_at_price: validated.compareAtPrice || null,
        unit: validated.unit,
        image_url: validated.imageUrl || null,
        image_path: validated.imagePath || null,
        gallery_images: validated.galleryImages || [],
        organic: validated.organic,
        seasonal: validated.seasonal,
        featured: validated.featured,
        availability_status: validated.availabilityStatus,
        is_active: validated.isActive,
        sort_order: validated.sortOrder,
      },
      validated.locationSettings,
      adminClient
    );

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/api/categories');
    revalidatePath('/', 'layout');

    return { success: true, data: product };
  } catch (err: any) {
    console.error('createProductAction error:', err);
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

export async function updateProductAction(id: string, formData: Partial<ProductFormValues>) {
  try {
    const validated = productSchema.partial().parse(formData);
    const slug = validated.name ? generateSlug(validated.name) : validated.slug;

    const payload: any = {};
    if (validated.name !== undefined) payload.name = validated.name;
    if (slug !== undefined) payload.slug = slug;
    if (validated.categoryId !== undefined) payload.category_id = validated.categoryId;
    if (validated.shortDescription !== undefined) payload.short_description = validated.shortDescription;
    if (validated.description !== undefined) payload.description = validated.description;
    if (validated.price !== undefined) payload.price = validated.price;
    if (validated.compareAtPrice !== undefined) payload.compare_at_price = validated.compareAtPrice;
    if (validated.unit !== undefined) payload.unit = validated.unit;
    if (validated.imageUrl !== undefined) payload.image_url = validated.imageUrl;
    if (validated.imagePath !== undefined) payload.image_path = validated.imagePath;
    if (validated.galleryImages !== undefined) payload.gallery_images = validated.galleryImages;
    if (validated.organic !== undefined) payload.organic = validated.organic;
    if (validated.seasonal !== undefined) payload.seasonal = validated.seasonal;
    if (validated.featured !== undefined) payload.featured = validated.featured;
    if (validated.availabilityStatus !== undefined) payload.availability_status = validated.availabilityStatus;
    if (validated.isActive !== undefined) payload.is_active = validated.isActive;
    if (validated.sortOrder !== undefined) payload.sort_order = validated.sortOrder;

    const adminClient = getServerAdminClient();
    const updated = await productService.updateProduct(id, payload, validated.locationSettings, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/api/categories');
    revalidatePath('/', 'layout');

    return { success: true, data: updated };
  } catch (err: any) {
    console.error('updateProductAction error:', err);
    return { success: false, error: err.message || 'Failed to update product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const adminClient = getServerAdminClient();
    await productService.deleteProduct(id, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/api/categories');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('deleteProductAction error:', err);
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

export async function toggleProductStatusAction(id: string, isActive: boolean) {
  try {
    const adminClient = getServerAdminClient();
    await productService.toggleProductStatus(id, isActive, adminClient);

    revalidatePath('/products');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/api/categories');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('toggleProductStatusAction error:', err);
    return { success: false, error: err.message || 'Failed to toggle product status' };
  }
}

