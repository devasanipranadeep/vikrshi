import { CompanySettings, Category, Product, CustomerReview } from '@/types';

export const initialCompanySettings: CompanySettings = {
  companyName: 'Vikrshi Suppliers Pvt Ltd',
  legalName: 'Vikrshi Suppliers Private Limited',
  tagline: 'Fresh From Our Farms, Naturally Yours.',
  shortDescription: 'Responsibly grown organic vegetables, crisp leafy greens, and sun-ripened fruits delivered directly from certified partner farms to your community.',
  logoUrl: '/logo-full.png',
  whatsappNumber: '919441469814',
  whatsappDisplay: '+91 94414 69814',
  email: 'hello@vikrshi.com',
  phone: '+91 94414 69814',
  instagramUrl: 'https://instagram.com/vikrshi',
  instagramHandle: '@vikrshi',
  address: {
    line1: 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar',
    line2: 'Mulugu Mandal',
    city: 'Siddipet',
    state: 'Telangana',
    pincode: '502279',
    country: 'India',
    fullText: 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet, Telangana 502279-India.',
  },
  businessHours: {
    weekdays: '6:00 AM – 8:30 PM',
    weekends: '6:00 AM – 9:00 PM',
    deliverySlots: [
      'Morning Harvest Batch: 6:30 AM – 9:30 AM',
      'Evening Farm Batch: 4:30 PM – 7:30 PM',
    ],
  },
  orderingEnabled: true,
  defaultLocation: 'Hyderabad',
};

// All mock data removed. When the backend server is unpaused, live data will automatically populate.
export const initialCategories: Category[] = [];

export const initialProducts: Product[] = [];

export const initialReviews: CustomerReview[] = [];

export const instagramPosts: any[] = [];

export const customerTestimonials: any[] = [];
