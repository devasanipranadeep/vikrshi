export * from './database';

export interface Product {
  id: string;
  categoryId?: string | null;
  name: string;
  slug: string;
  category: string;
  categoryName?: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number | null;
  unit: string;
  image: string;
  imageUrl?: string | null;
  imagePath?: string | null;
  gallery?: string[];
  galleryImages?: string[];
  inStock: boolean;
  isOrganic: boolean;
  isFeatured: boolean;
  isSeasonal: boolean;
  availabilityStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'seasonal';
  isActive?: boolean;
  sortOrder?: number;
  availableLocations: string[];
  locationPrices?: Record<string, number>;
  locationAvailability?: Record<string, boolean>;
  harvestDate?: string;
  originLocation?: string;
  nutritionalHighlights?: string[];
  farmingMethod?: string;
  shelfLife?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string | null;
  imagePath?: string | null;
  itemCount?: number;
  accentColor?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationItem {
  id: string;
  cityName: string;
  state: string;
  country?: string;
  slug: string;
  isActive: boolean;
  isDefault?: boolean;
  deliveryAvailable?: boolean;
  deliveryAvailability?: 'Same-Day Delivery' | 'Next-Day Morning' | 'Coming Soon';
  deliveryAreas: string[];
  serviceAreas?: string[];
  address?: string;
  hubAddress?: string;
  whatsappNumber?: string;
  contactPhone?: string;
  operatingHours?: string;
  latitude?: number | null;
  longitude?: number | null;
  pincodes?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySettings {
  companyName: string;
  legalName?: string;
  tagline?: string;
  shortDescription?: string;
  logoUrl?: string | null;
  logoPath?: string | null;
  whatsappNumber: string;
  whatsappDisplay?: string;
  phoneNumber?: string;
  phone?: string;
  email: string;
  instagramUrl: string;
  instagramHandle?: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    fullText?: string;
  };
  businessHours: {
    weekdays?: string;
    weekends?: string;
    deliverySlots?: string[];
    fullText?: string;
  };
  googleMapsUrl?: string;
  footerDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  orderingEnabled: boolean;
  defaultLocation?: string;
}

export type CommunityRequestStatus = 'new' | 'contacted' | 'approved' | 'rejected' | 'archived';

export interface CommunityRequestItem {
  id: string;
  applicantName: string;
  phone?: string | null;
  communityName: string;
  address: string;
  source: string;
  details?: string | null;
  status: CommunityRequestStatus;
  createdAt: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  locationId?: string | null;
  locationName?: string | null;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: string;
}

export interface OrderInquiryItemRecord {
  id: string;
  inquiryId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface OrderInquiryRecord {
  id: string;
  locationId: string | null;
  locationName?: string | null;
  customerName: string | null;
  customerPhone: string | null;
  deliveryAddress?: string | null;
  notes?: string | null;
  estimatedTotal: number | null;
  status: 'initiated' | 'whatsapp_redirected' | 'confirmed' | 'cancelled';
  createdAt: string;
  items?: OrderInquiryItemRecord[];
}

export interface AdminUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'content_manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  productName?: string;
  helpfulCount: number;
  avatar?: string;
}

export interface ReviewSubmissionData {
  name: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  productName?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  locationId?: string;
  subject?: string;
  message: string;
}

export interface SocialPost {
  id: string;
  imageUrl: string;
  imagePath?: string;
  caption: string;
  likes: number;
  date: string;
  postUrl?: string;
  isActive?: boolean;
  createdAt?: string;
}

export type GalleryCategory = 'all' | 'farms' | 'harvest' | 'coldchain' | 'community';

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  category: 'farms' | 'harvest' | 'coldchain' | 'community';
  locationTag?: string;
  imageUrl: string;
  imagePath?: string;
  date?: string;
  featured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

