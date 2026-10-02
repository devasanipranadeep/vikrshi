import { getBrowserClient } from '@/lib/supabase/client';
import { Category, Database } from '@/types';
import { initialCategories } from '@/constants/mockData';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

export const categoryService = {
  /**
   * Fetch all active categories (or all categories if admin)
   */
  async getCategories(includeInactive = false, customClient?: any): Promise<Category[]> {
    try {
      const client = getClient(customClient);
      let query = client
        .from('categories')
        .select(`
          *,
          products(id, name, is_active)
        `)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase getCategories error, falling back to mock:', error.message);
        return initialCategories;
      }

      if (!data || data.length === 0) {
        return initialCategories;
      }

      return data.map((item: any) => {
        const activeCount = Array.isArray(item.products)
          ? item.products.filter((p: any) => p.is_active !== false).length
          : 0;

        return {
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description || '',
          image: item.image_url || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
          imageUrl: item.image_url,
          imagePath: item.image_path,
          itemCount: activeCount,
          isActive: item.is_active,
          sortOrder: item.sort_order,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        };
      });
    } catch (err) {
      console.warn('Failed to fetch categories from Supabase, using mock fallback:', err);
      return initialCategories;
    }
  },

  /**
   * Fetch a single category by slug
   */
  async getCategoryBySlug(slug: string, customClient?: any): Promise<Category | null> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('categories')
        .select(`
          *,
          products(id, name, is_active)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        const found = initialCategories.find((c) => c.slug === slug);
        return found || null;
      }

      const item = data as any;
      const activeCount = Array.isArray(item.products)
        ? item.products.filter((p: any) => p.is_active !== false).length
        : 0;

      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description || '',
        image: item.image_url || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
        imageUrl: item.image_url,
        imagePath: item.image_path,
        itemCount: activeCount,
        isActive: item.is_active,
        sortOrder: item.sort_order,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch {
      return initialCategories.find((c) => c.slug === slug) || null;
    }
  },

  /**
   * Admin: Create category
   */
  async createCategory(payload: CategoryInsert, customClient?: any): Promise<CategoryRow> {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('categories')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Admin: Update category
   */
  async updateCategory(id: string, payload: CategoryUpdate, customClient?: any): Promise<CategoryRow> {
    const client = getClient(customClient);
    const { data, error } = await client
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Admin: Delete category
   */
  async deleteCategory(id: string, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
