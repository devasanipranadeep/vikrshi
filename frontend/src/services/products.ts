import { getBrowserClient } from '@/lib/supabase/client';
import { Product, Database } from '@/types';
import { initialProducts } from '@/constants/mockData';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductFilters {
  category?: string;
  categorySlug?: string;
  location?: string;
  locationId?: string;
  featured?: boolean;
  organic?: boolean;
  seasonal?: boolean;
  availability?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  includeInactive?: boolean;
}

export interface LocationAssignment {
  locationId: string;
  isAvailable: boolean;
  customPrice?: number | null;
  availabilityStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'seasonal' | null;
}

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

function mapProductRow(
  row: ProductRow & { category?: { name: string; slug: string } | null; product_locations?: any[] },
  selectedLocationId?: string
): Product {
  let activePrice = Number(row.price);
  let availability = row.availability_status;
  let isAvailableInLocation = true;

  const locPrices: Record<string, number> = {};
  const locAvail: Record<string, boolean> = {};

  if (row.product_locations && Array.isArray(row.product_locations)) {
    row.product_locations.forEach((pl: any) => {
      if (pl.custom_price !== null && pl.custom_price !== undefined) {
        locPrices[pl.location_id] = Number(pl.custom_price);
      }
      locAvail[pl.location_id] = Boolean(pl.is_available);

      if (selectedLocationId && pl.location_id === selectedLocationId) {
        if (pl.custom_price !== null && pl.custom_price !== undefined) {
          activePrice = Number(pl.custom_price);
        }
        if (row.availability_status !== 'out_of_stock' && pl.availability_status) {
          availability = pl.availability_status;
        }
        isAvailableInLocation = Boolean(pl.is_available);
      }
    });
  }

  // If parent product is marked out_of_stock, it is ALWAYS out of stock everywhere
  if (row.availability_status === 'out_of_stock') {
    availability = 'out_of_stock';
  }

  const isActuallyInStock = availability !== 'out_of_stock' && isAvailableInLocation;

  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    category: row.category?.slug || (row.category_id ? 'fresh-products' : 'vegetables'),
    categoryName: row.category?.name || 'Fresh Products',
    shortDescription: row.short_description || 'Farm-fresh organic products harvested daily.',
    description: row.description || row.short_description || '',
    price: activePrice,
    originalPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    unit: row.unit,
    image: row.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    imageUrl: row.image_url,
    imagePath: row.image_path,
    gallery: row.gallery_images || [],
    galleryImages: row.gallery_images || [],
    inStock: isActuallyInStock,
    availabilityStatus: availability,
    isOrganic: row.organic,
    isFeatured: row.featured,
    isSeasonal: row.seasonal,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    availableLocations: ['all', 'hyderabad'],
    locationPrices: locPrices,
    locationAvailability: locAvail,
    originLocation: 'Telangana Organic Partner Farms',
    harvestDate: 'Morning Harvest Today',
    nutritionalHighlights: ['100% Pesticide Free', 'High Dietary Fiber'],
    farmingMethod: 'Natural composting & bio-fertilizers',
    shelfLife: '4–5 days at room temperature',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const productService = {
  /**
   * Query products with filters, location-specific pricing, and search
   */
  async getProducts(filters: ProductFilters = {}, customClient?: any): Promise<Product[]> {
    try {
      const client = getClient(customClient);

      let query = client
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          product_locations(*)
        `);

      if (!filters.includeInactive) {
        query = query.eq('is_active', true);
      }

      if (filters.featured) {
        query = query.eq('featured', true);
      }

      if (filters.seasonal) {
        query = query.eq('seasonal', true);
      }

      if (filters.organic !== undefined) {
        query = query.eq('organic', filters.organic);
      }

      if (filters.availability && filters.availability !== 'all') {
        query = query.eq('availability_status', filters.availability);
      }

      if (filters.search && filters.search.trim()) {
        const s = filters.search.trim();
        query = query.or(`name.ilike.%${s}%,short_description.ilike.%${s}%`);
      }

      // Sorting
      if (filters.sort === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (filters.sort === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (filters.sort === 'name-asc') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase getProducts error, falling back to mock:', error.message);
        return this.filterMockProducts(filters);
      }

      if (!data || data.length === 0) {
        return this.filterMockProducts(filters);
      }

      let results = data.map((row: any) => mapProductRow(row, filters.locationId));

      // Filter by category slug if provided
      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        results = results.filter((p: Product) => p.category.toLowerCase() === cat || (p.categoryName || '').toLowerCase() === cat);
      }

      // Filter by price range
      if (filters.minPrice !== undefined) {
        results = results.filter((p: Product) => p.price >= (filters.minPrice as number));
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter((p: Product) => p.price <= (filters.maxPrice as number));
      }

      return results;
    } catch (err) {
      console.warn('Failed querying products from Supabase, using mock fallback:', err);
      return this.filterMockProducts(filters);
    }
  },

  /**
   * Helper fallback filter for mock products
   */
  filterMockProducts(filters: ProductFilters): Product[] {
    let list: Product[] = [...initialProducts];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter((p: Product) => p.name.toLowerCase().includes(s) || (p.shortDescription || '').toLowerCase().includes(s));
    }
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      list = list.filter((p: Product) => p.category.toLowerCase() === cat || (p.categoryName || '').toLowerCase() === cat);
    }
    if (filters.featured) {
      list = list.filter((p: Product) => p.isFeatured);
    }
    if (filters.seasonal) {
      list = list.filter((p: Product) => p.isSeasonal);
    }
    if (filters.minPrice !== undefined) {
      list = list.filter((p: Product) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p: Product) => p.price <= filters.maxPrice!);
    }
    return list;
  },

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts(limit = 6, customClient?: any): Promise<Product[]> {
    const products = await this.getProducts({ featured: true }, customClient);
    return products.slice(0, limit);
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug: string, locationId?: string, customClient?: any): Promise<Product | null> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          product_locations(*)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return initialProducts.find((p) => p.slug === slug) || null;
      }

      return mapProductRow(data as any, locationId);
    } catch {
      return initialProducts.find((p) => p.slug === slug) || null;
    }
  },

  /**
   * Get products by category slug
   */
  async getProductsByCategory(categorySlug: string, customClient?: any): Promise<Product[]> {
    return this.getProducts({ category: categorySlug }, customClient);
  },

  /**
   * Get products by location
   */
  async getProductsByLocation(locationSlug: string, customClient?: any): Promise<Product[]> {
    return this.getProducts({ location: locationSlug }, customClient);
  },

  /**
   * Admin: Create product along with location-specific availability/pricing
   */
  async createProduct(
    payload: ProductInsert,
    locations?: LocationAssignment[],
    customClient?: any
  ): Promise<ProductRow> {
    const client = getClient(customClient);

    const { data: product, error } = await client
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (locations && locations.length > 0) {
      const locationRows = locations.map((loc) => ({
        product_id: product.id,
        location_id: loc.locationId,
        is_available: loc.isAvailable,
        custom_price: loc.customPrice ?? null,
        availability_status: loc.availabilityStatus ?? null,
      }));

      await client.from('product_locations').insert(locationRows);
    }

    return product;
  },

  /**
   * Admin: Update product and update location relations
   */
  async updateProduct(
    id: string,
    payload: ProductUpdate,
    locations?: LocationAssignment[],
    customClient?: any
  ): Promise<ProductRow> {
    const client = getClient(customClient);

    const { data: product, error } = await client
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Keep product_locations availability in sync with master product
    if (payload.availability_status !== undefined) {
      await client
        .from('product_locations')
        .update({
          availability_status: payload.availability_status,
          is_available: payload.availability_status !== 'out_of_stock',
        })
        .eq('product_id', id);
    }

    if (locations) {
      // Upsert product location records
      for (const loc of locations) {
        await client.from('product_locations').upsert(
          {
            product_id: id,
            location_id: loc.locationId,
            is_available: loc.isAvailable,
            custom_price: loc.customPrice ?? null,
            availability_status: loc.availabilityStatus ?? null,
          },
          { onConflict: 'product_id,location_id' }
        );
      }
    }

    return product;
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id: string, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Admin: Quick toggle product status
   */
  async toggleProductStatus(id: string, isActive: boolean, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client
      .from('products')
      .update({ is_active: isActive })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};
