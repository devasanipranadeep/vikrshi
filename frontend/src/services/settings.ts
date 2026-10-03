import { getBrowserClient } from '@/lib/supabase/client';
import { CompanySettings, Database } from '@/types';
import { initialCompanySettings } from '@/constants/mockData';

type SettingsRow = Database['public']['Tables']['company_settings']['Row'];
type SettingsUpdate = Database['public']['Tables']['company_settings']['Update'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

function mapSettingsRow(row: SettingsRow): CompanySettings {
  const whatsapp = row.whatsapp_number || '919441469814';
  const displayWa = whatsapp.startsWith('91') && whatsapp.length === 12
    ? `+91 ${whatsapp.slice(2, 7)} ${whatsapp.slice(7)}`
    : `+${whatsapp}`;

  const igUrl = row.instagram_url || 'https://instagram.com/vikrshisuppliers';
  const igHandle = igUrl.split('/').filter(Boolean).pop()?.replace(/^@/, '') || 'vikrshisuppliers';
  const addr = row.address || 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034, India';

  return {
    companyName: row.company_name,
    legalName: `${row.company_name} (Incorporated under MCA India)`,
    tagline: 'Fresh Organic Produce from Farm to Home',
    shortDescription: row.footer_description || 'Pesticide-free organic vegetables and fresh fruits.',
    logoUrl: row.logo_url || '/logo.png',
    logoPath: row.logo_path,
    whatsappNumber: whatsapp,
    whatsappDisplay: displayWa,
    phone: row.phone_number || '+91 9441469814',
    phoneNumber: row.phone_number || '+91 9441469814',
    email: row.email || 'contact@vikrshi.com',
    instagramUrl: igUrl,
    instagramHandle: `@${igHandle}`,
    address: {
      line1: addr,
      line2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      country: 'India',
      fullText: addr,
    },
    businessHours: {
      weekdays: row.business_hours || '6:00 AM – 8:00 PM',
      weekends: '6:00 AM – 9:00 PM',
      deliverySlots: ['6:00 AM – 9:00 AM Morning Harvest', '4:00 PM – 7:00 PM Evening Route'],
      fullText: row.business_hours || '6:00 AM – 8:00 PM',
    },
    googleMapsUrl: row.google_maps_url || 'https://maps.google.com/?q=Hyderabad',
    footerDescription: row.footer_description || '',
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    orderingEnabled: row.ordering_enabled,
    defaultLocation: 'Hyderabad',
  };
}

export const settingsService = {
  /**
   * Fetch company settings from Supabase singleton row (id = 1)
   */
  async getSettings(customClient?: any): Promise<CompanySettings> {
    return this.getCompanySettings(customClient);
  },

  async getCompanySettings(customClient?: any): Promise<CompanySettings> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('company_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error || !data) {
        return initialCompanySettings;
      }

      return mapSettingsRow(data as SettingsRow);
    } catch (err) {
      console.warn('Failed to load company settings from Supabase, using defaults:', err);
      return initialCompanySettings;
    }
  },

  /**
   * Admin: Update company settings
   */
  async updateCompanySettings(payload: Partial<SettingsUpdate>, customClient?: any): Promise<CompanySettings> {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('company_settings')
      .update(payload)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapSettingsRow(data as SettingsRow);
  },
};
