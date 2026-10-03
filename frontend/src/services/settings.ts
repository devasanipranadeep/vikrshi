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

  const igUrl = row.instagram_url || 'https://instagram.com/vikrshi';
  const igHandle = igUrl.split('/').filter(Boolean).pop()?.replace(/^@/, '') || 'vikrshi';
  const defaultAddr = 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet, Telangana 502279-India.';
  const addr = (row.address && !row.address.includes('Banjara Hills')) ? row.address : defaultAddr;

  const rawLogo = row.logo_url;
  const logoUrl = (!rawLogo || rawLogo === '/logo-emblem.png') ? '/logo.png' : rawLogo;

  return {
    companyName: row.company_name || 'Vikrshi Suppliers Pvt Ltd',
    legalName: `${row.company_name || 'Vikrshi Suppliers Pvt Ltd'} (Incorporated under MCA India)`,
    tagline: 'Fresh Organic Produce from Farm to Home',
    shortDescription: row.footer_description || 'Pesticide-free organic vegetables and fresh fruits.',
    logoUrl,
    logoPath: row.logo_path,
    whatsappNumber: whatsapp,
    whatsappDisplay: displayWa,
    phone: row.phone_number || '+91 94414 69814',
    phoneNumber: row.phone_number || '+91 94414 69814',
    email: row.email || 'contact@vikrshi.com',
    instagramUrl: igUrl,
    instagramHandle: `@${igHandle}`,
    address: {
      line1: 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar',
      line2: 'Mulugu Mandal',
      city: 'Siddipet',
      state: 'Telangana',
      pincode: '502279',
      country: 'India',
      fullText: addr,
    },
    businessHours: {
      weekdays: row.business_hours || '6:00 AM – 8:30 PM',
      weekends: '6:00 AM – 9:00 PM',
      deliverySlots: ['6:00 AM – 9:00 AM Morning Harvest', '4:00 PM – 7:00 PM Evening Route'],
      fullText: row.business_hours || '6:00 AM – 8:30 PM',
    },
    googleMapsUrl: row.google_maps_url || 'https://maps.google.com/?q=Mulugu+Mandal+Siddipet+Telangana+502279',
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
