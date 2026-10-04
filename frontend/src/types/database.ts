export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'super_admin' | 'admin' | 'content_manager';
export type ProductUnit = 'kg' | '500g' | '250g' | 'piece' | 'dozen' | 'bunch' | 'box';
export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'seasonal';
export type MessageStatus = 'new' | 'read' | 'responded' | 'archived';
export type InquiryStatus = 'initiated' | 'whatsapp_redirected' | 'confirmed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: AdminRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          image_path: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          unit: ProductUnit;
          image_url: string | null;
          image_path: string | null;
          gallery_images: string[];
          organic: boolean;
          seasonal: boolean;
          featured: boolean;
          availability_status: AvailabilityStatus;
          is_active: boolean;
          sort_order: number;
          locations: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          unit: ProductUnit;
          image_url?: string | null;
          image_path?: string | null;
          gallery_images?: string[];
          organic?: boolean;
          seasonal?: boolean;
          featured?: boolean;
          availability_status?: AvailabilityStatus;
          is_active?: boolean;
          sort_order?: number;
          locations?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          unit?: ProductUnit;
          image_url?: string | null;
          image_path?: string | null;
          gallery_images?: string[];
          organic?: boolean;
          seasonal?: boolean;
          featured?: boolean;
          availability_status?: AvailabilityStatus;
          is_active?: boolean;
          sort_order?: number;
          locations?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          city: string;
          state: string;
          country: string;
          slug: string;
          address: string | null;
          service_areas: string[];
          delivery_available: boolean;
          whatsapp_number: string | null;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city: string;
          state?: string;
          country?: string;
          slug: string;
          address?: string | null;
          service_areas?: string[];
          delivery_available?: boolean;
          whatsapp_number?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          city?: string;
          state?: string;
          country?: string;
          slug?: string;
          address?: string | null;
          service_areas?: string[];
          delivery_available?: boolean;
          whatsapp_number?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_settings: {
        Row: {
          id: number;
          company_name: string;
          logo_url: string | null;
          logo_path: string | null;
          whatsapp_number: string | null;
          phone_number: string | null;
          email: string | null;
          instagram_url: string | null;
          address: string | null;
          business_hours: string | null;
          google_maps_url: string | null;
          footer_description: string | null;
          seo_title: string | null;
          seo_description: string | null;
          ordering_enabled: boolean;
          default_location: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          company_name?: string;
          logo_url?: string | null;
          logo_path?: string | null;
          whatsapp_number?: string | null;
          phone_number?: string | null;
          email?: string | null;
          instagram_url?: string | null;
          address?: string | null;
          business_hours?: string | null;
          google_maps_url?: string | null;
          footer_description?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          ordering_enabled?: boolean;
          default_location?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          company_name?: string;
          logo_url?: string | null;
          logo_path?: string | null;
          whatsapp_number?: string | null;
          phone_number?: string | null;
          email?: string | null;
          instagram_url?: string | null;
          address?: string | null;
          business_hours?: string | null;
          google_maps_url?: string | null;
          footer_description?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          ordering_enabled?: boolean;
          default_location?: string | null;
          updated_at?: string;
        };
      };
      customer_orders: {
        Row: {
          id: string;
          location_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          delivery_address: string | null;
          notes: string | null;
          estimated_total: number | null;
          items: Json;
          status: InquiryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          estimated_total?: number | null;
          items?: Json;
          status?: InquiryStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          estimated_total?: number | null;
          items?: Json;
          status?: InquiryStatus;
          created_at?: string;
        };
      };
      community_requests: {
        Row: {
          id: string;
          applicant_name: string;
          phone: string | null;
          community_name: string;
          address: string;
          source: string;
          details: string | null;
          status: 'new' | 'contacted' | 'approved' | 'rejected' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          applicant_name: string;
          phone?: string | null;
          community_name: string;
          address: string;
          source: string;
          details?: string | null;
          status?: 'new' | 'contacted' | 'approved' | 'rejected' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          applicant_name?: string;
          phone?: string | null;
          community_name?: string;
          address?: string;
          source?: string;
          details?: string | null;
          status?: 'new' | 'contacted' | 'approved' | 'rejected' | 'archived';
          created_at?: string;
        };
      };
    };
  };
}
