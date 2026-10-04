import { getBrowserClient } from '@/lib/supabase/client';
import { LocationItem, Database } from '@/types';

type LocationRow = Database['public']['Tables']['locations']['Row'];
type LocationInsert = Database['public']['Tables']['locations']['Insert'];
type LocationUpdate = Database['public']['Tables']['locations']['Update'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

function mapLocationRow(row: LocationRow): LocationItem {
  const defaultHubAddr = 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet, Telangana 502279-India.';
  const isDefault = row.slug === 'hyderabad' || row.sort_order === 0 || row.sort_order === 1;
  const isOldAddr = !row.address || row.address.includes('Chevella') || row.address.includes('Shamshabad') || row.address.includes('500075');
  const resolvedAddress = (isDefault && isOldAddr) ? defaultHubAddr : (row.address || `${row.city} Farm Dispatch Hub, Telangana`);

  return {
    id: row.id,
    cityName: row.city,
    state: row.state,
    country: row.country,
    slug: row.slug,
    isActive: row.is_active,
    isDefault,
    deliveryAvailable: row.delivery_available,
    deliveryAvailability: row.delivery_available ? 'Same-Day Delivery' : 'Coming Soon',
    deliveryAreas: row.service_areas || [],
    serviceAreas: row.service_areas || [],
    address: resolvedAddress,
    hubAddress: resolvedAddress,
    whatsappNumber: row.whatsapp_number || undefined,
    contactPhone: row.whatsapp_number ? `+${row.whatsapp_number}` : '+91 94414 69814',
    operatingHours: 'Morning Dispatch: 6:00 AM – 10:00 AM',
    latitude: row.latitude,
    longitude: row.longitude,
    pincodes: [],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const locationService = {
  /**
   * Fetch all locations (active only for public, all for admin)
   */
  async getLocations(includeInactive = false, customClient?: any): Promise<LocationItem[]> {
    try {
      const client = getClient(customClient);
      let query = client
        .from('locations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('city', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase getLocations error:', error.message);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(mapLocationRow);
    } catch (err) {
      console.warn('Failed fetching locations from Supabase:', err);
      return [];
    }
  },

  /**
   * Fetch a single location by slug
   */
  async getLocationBySlug(slug: string, customClient?: any): Promise<LocationItem | null> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return null;
      }

      return mapLocationRow(data as LocationRow);
    } catch {
      return null;
    }
  },

  /**
   * Admin: Create a new location (e.g. Hyderabad, Bengaluru, Mumbai, Pune, Chennai)
   */
  async createLocation(payload: LocationInsert, customClient?: any): Promise<LocationRow> {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('locations')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Admin: Update location details
   */
  async updateLocation(id: string, payload: LocationUpdate, customClient?: any): Promise<LocationRow> {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('locations')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Admin: Delete location
   */
  async deleteLocation(id: string, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client.from('locations').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Get products available for a specific location
   */
  async getLocationProducts(locationId: string, customClient?: any) {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(error.message);

    return (data || []).filter((p: any) => {
      const locList = (p.locations && Array.isArray(p.locations) ? p.locations : p.product_locations) || [];
      const match = locList.find((l: any) => l.location_id === locationId);
      return match ? match.is_available : true;
    });
  },
};
