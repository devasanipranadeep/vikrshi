'use server';

import { revalidatePath } from 'next/cache';
import { locationSchema, LocationFormValues } from '@/schemas/location';
import { locationService } from '@/services/locations';
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

export async function createLocationAction(formData: LocationFormValues) {
  try {
    const validated = locationSchema.parse(formData);
    const slug = validated.slug?.trim() || generateSlug(validated.city);
    const adminClient = getServerAdminClient();

    const location = await locationService.createLocation({
      city: validated.city,
      state: validated.state,
      country: validated.country || 'India',
      slug,
      address: validated.address || null,
      service_areas: validated.serviceAreas || [],
      delivery_available: validated.deliveryAvailable,
      whatsapp_number: validated.whatsappNumber || null,
      latitude: validated.latitude || null,
      longitude: validated.longitude || null,
      is_active: validated.isActive,
      sort_order: validated.sortOrder,
    }, adminClient);

    revalidatePath('/locations');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/locations');

    return { success: true, data: location };
  } catch (err: any) {
    console.error('createLocationAction error:', err);
    return { success: false, error: err.message || 'Failed to create location' };
  }
}

export async function updateLocationAction(id: string, formData: Partial<LocationFormValues>) {
  try {
    const validated = locationSchema.partial().parse(formData);
    const slug = validated.city ? generateSlug(validated.city) : validated.slug;

    const payload: any = {};
    if (validated.city !== undefined) payload.city = validated.city;
    if (validated.state !== undefined) payload.state = validated.state;
    if (validated.country !== undefined) payload.country = validated.country;
    if (slug !== undefined) payload.slug = slug;
    if (validated.address !== undefined) payload.address = validated.address;
    if (validated.serviceAreas !== undefined) payload.service_areas = validated.serviceAreas;
    if (validated.deliveryAvailable !== undefined) payload.delivery_available = validated.deliveryAvailable;
    if (validated.whatsappNumber !== undefined) payload.whatsapp_number = validated.whatsappNumber;
    if (validated.latitude !== undefined) payload.latitude = validated.latitude;
    if (validated.longitude !== undefined) payload.longitude = validated.longitude;
    if (validated.isActive !== undefined) payload.is_active = validated.isActive;
    if (validated.sortOrder !== undefined) payload.sort_order = validated.sortOrder;

    const adminClient = getServerAdminClient();
    const updated = await locationService.updateLocation(id, payload, adminClient);

    revalidatePath('/locations');
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/locations');

    return { success: true, data: updated };
  } catch (err: any) {
    console.error('updateLocationAction error:', err);
    return { success: false, error: err.message || 'Failed to update location' };
  }
}

export async function deleteLocationAction(id: string) {
  try {
    const adminClient = getServerAdminClient();
    await locationService.deleteLocation(id, adminClient);

    revalidatePath('/locations');
    revalidatePath('/shop');
    revalidatePath('/admin/locations');

    return { success: true };
  } catch (err: any) {
    console.error('deleteLocationAction error:', err);
    return { success: false, error: err.message || 'Failed to delete location' };
  }
}

