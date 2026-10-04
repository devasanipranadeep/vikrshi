import { CompanySettings, Category, Product, CustomerReview, GalleryItem } from '@/types';

export const initialCompanySettings: CompanySettings = {
  companyName: 'Vikrshi Suppliers Pvt Ltd',
  legalName: 'Vikrshi Suppliers Private Limited',
  tagline: 'Fresh From Our Farms, Naturally Yours.',
  shortDescription: 'Responsibly grown organic vegetables, crisp leafy greens, and sun-ripened fruits delivered directly from certified partner farms to your doorstep.',
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

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Chevella Agro-Cluster Sunrise Harvest',
    caption: 'Our partner farmers harvesting crisp organic greens and vine tomatoes at 5:30 AM under natural morning dew.',
    category: 'harvest',
    locationTag: 'Chevella Agro-Cluster, Telangana',
    imageUrl: '/hero/farm-1.jpg',
    date: 'Dawn Harvest',
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'gallery-2',
    title: 'Vikrshi Cold Chain & Sorting Facility',
    caption: 'Multi-stage gentle manual inspection, ozone water wash, and temperature-controlled pre-cooling before Hyderabad dispatch.',
    category: 'coldchain',
    locationTag: 'Central Sorting Facility, Hyderabad',
    imageUrl: '/hero/farm-2.jpg',
    date: 'Facility Logistics',
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'gallery-3',
    title: 'Living Soil & Jeevamrutham Cultivation',
    caption: 'Nourishing our crops with native cow dung, bio-cultures, and organic compost instead of synthetic petroleum-derived fertilizers.',
    category: 'farms',
    locationTag: 'Vikarabad Organic Belt',
    imageUrl: '/hero/farm-3.jpg',
    date: 'Sustainable Soil',
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'gallery-4',
    title: 'Direct Farmer Partnership & Field Inspection',
    caption: 'Agronomists and farm coordinators conducting soil quality testing and fair covenant verification with local smallholders.',
    category: 'farms',
    locationTag: 'Mahabubnagar Partner Cluster',
    imageUrl: '/hero/farm-4.jpg',
    date: 'Direct Covenant',
    featured: true,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'gallery-5',
    title: 'Fresh Leafy Greens Harvest Batch',
    caption: 'Plucked before sunrise, washed in clean natural water, and packed in breathable eco-crates within 2 hours of harvest.',
    category: 'harvest',
    locationTag: 'Chevella Farms',
    imageUrl: '/hero/farm-5.jpg',
    date: 'Morning Harvest',
    featured: true,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'gallery-6',
    title: 'Gated Community Morning Deliveries',
    caption: 'Direct van delivery routes reaching residential gated communities across Gachibowli, Kondapur, and Jubilee Hills by 7:30 AM.',
    category: 'community',
    locationTag: 'Hyderabad Residential Routes',
    imageUrl: '/background.png',
    date: 'Same-Day Delivery',
    featured: true,
    sortOrder: 6,
    isActive: true,
  },
];
