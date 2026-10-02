import { getBrowserClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { CreateAdminUserInput, UpdateAdminUserInput } from '@/schemas/user';
import { AdminUserProfile, AdminRole, Database } from '@/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

export const profileService = {
  /**
   * Super Admin: Get all profiles
   */
  async getProfiles(customClient?: any): Promise<AdminUserProfile[]> {
    try {
      const client = getClient(customClient);
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: ProfileRow) => ({
        id: row.id,
        email: 'admin@vikrshi.com',
        fullName: row.full_name,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUserProfile(customClient?: any): Promise<AdminUserProfile | null> {
    try {
      const client = getClient(customClient);
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) return null;

      const { data: profile, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        return null;
      }

      return {
        id: profile.id,
        email: user.email || '',
        fullName: profile.full_name,
        role: profile.role,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Super Admin: Create a new admin user (Server-side privileged operation)
   */
  async createAdminUser(input: CreateAdminUserInput): Promise<AdminUserProfile> {
    const adminClient = createAdminClient();

    // 1. Create auth user with Supabase Auth admin API
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.fullName,
        role: input.role,
      },
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create admin user: ${authError?.message}`);
    }

    // 2. Create or upsert profile in public.profiles
    const { data: profile, error: profError } = await adminClient
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name: input.fullName,
        role: input.role,
        is_active: true,
      })
      .select()
      .single();

    if (profError) {
      throw new Error(`Failed to create profile: ${profError.message}`);
    }

    return {
      id: profile.id,
      email: input.email,
      fullName: profile.full_name,
      role: profile.role,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  },

  /**
   * Super Admin: Update profile status (active/inactive)
   */
  async updateProfileStatus(id: string, isActive: boolean, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Super Admin: Update profile role
   */
  async updateProfileRole(id: string, role: AdminRole, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client
      .from('profiles')
      .update({ role })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Super Admin: Delete profile and auth user
   */
  async deleteAdminUser(id: string): Promise<void> {
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) throw new Error(error.message);
  },
};
