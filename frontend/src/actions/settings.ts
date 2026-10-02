'use server';

import { revalidatePath } from 'next/cache';
import { companySettingsSchema, CompanySettingsFormValues } from '@/schemas/settings';
import { settingsService } from '@/services/settings';
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

export async function updateCompanySettingsAction(formData: CompanySettingsFormValues) {
  try {
    const validated = companySettingsSchema.parse(formData);
    const adminClient = getServerAdminClient();

    const updated = await settingsService.updateCompanySettings({
      company_name: validated.companyName,
      logo_url: validated.logoUrl || null,
      logo_path: validated.logoPath || null,
      whatsapp_number: validated.whatsappNumber || null,
      phone_number: validated.phoneNumber || null,
      email: validated.email || null,
      instagram_url: validated.instagramUrl || null,
      address: validated.address || null,
      business_hours: validated.businessHours || null,
      google_maps_url: validated.googleMapsUrl || null,
      footer_description: validated.footerDescription || null,
      seo_title: validated.seoTitle || null,
      seo_description: validated.seoDescription || null,
      ordering_enabled: validated.orderingEnabled,
    }, adminClient);

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');

    return { success: true, data: updated };
  } catch (err: any) {
    console.error('updateCompanySettingsAction error:', err);
    if (err?.issues && Array.isArray(err.issues)) {
      const msg = err.issues.map((i: any) => i.message).join(', ');
      return { success: false, error: msg };
    }
    return { success: false, error: err.message || 'Failed to update company settings' };
  }
}

