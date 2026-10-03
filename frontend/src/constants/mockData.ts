import { CompanySettings, LocationItem, Category, Product, CustomerReview } from '@/types';

export const initialCompanySettings: CompanySettings = {
  companyName: 'Vikrshi Suppliers Pvt Ltd',
  legalName: 'Vikrshi Suppliers Private Limited',
  tagline: 'Fresh From Our Farms, Naturally Yours.',
  shortDescription: 'Responsibly grown organic vegetables, crisp leafy greens, and sun-ripened fruits delivered directly from certified partner farms to your doorstep.',
  logoUrl: '/logo.png',
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

export const initialLocations: LocationItem[] = [
  {
    id: 'loc-hyd',
    cityName: 'Hyderabad',
    state: 'Telangana',
    slug: 'hyderabad',
    isActive: true,
    isDefault: true,
    deliveryAvailability: 'Same-Day Delivery',
    deliveryAreas: [
      'Jubilee Hills',
      'Banjara Hills',
      'Gachibowli',
      'Madhapur',
      'Hitec City',
      'Kondapur',
      'Kukatpally',
      'Manikonda',
      'Financial District',
      'Tellapur',
      'Begumpet',
      'Somajiguda',
      'Attapur',
      'Kokapet',
    ],
    hubAddress: 'Vikrshi Central Sorting Hub, Shamshabad Agro Park, Hyderabad - 500077',
    contactPhone: '+91 94414 69814',
    operatingHours: '5:30 AM – 8:30 PM Everyday',
    pincodes: ['500033', '500034', '500081', '500084', '500032', '500072', '500089', '500075', '500016', '500077'],
  },
  {
    id: 'loc-sec',
    cityName: 'Secunderabad',
    state: 'Telangana',
    slug: 'secunderabad',
    isActive: true,
    isDefault: false,
    deliveryAvailability: 'Same-Day Delivery',
    deliveryAreas: [
      'West Marredpally',
      'East Marredpally',
      'Sainikpuri',
      'Alwal',
      'Trimulgherry',
      'Tarnaka',
      'Karkhana',
      'Bowenpally',
    ],
    hubAddress: 'Vikrshi North Depot, Near Sainikpuri Crossroads, Secunderabad - 500094',
    contactPhone: '+91 94414 69814',
    operatingHours: '6:00 AM – 8:00 PM Everyday',
    pincodes: ['500026', '500015', '500094', '500010', '500009', '500017'],
  },
  {
    id: 'loc-wgl',
    cityName: 'Warangal',
    state: 'Telangana',
    slug: 'warangal',
    isActive: true,
    isDefault: false,
    deliveryAvailability: 'Next-Day Morning',
    deliveryAreas: ['Hanamkonda', 'Kazipet', 'Subedari', 'Nayeem Nagar', 'Hunter Road'],
    hubAddress: 'Vikrshi Warangal Regional Center, Hanamkonda - 506001',
    contactPhone: '+91 94414 69814',
    operatingHours: '7:00 AM – 7:00 PM Mon-Sat',
    pincodes: ['506001', '506002', '506004'],
  },
  {
    id: 'loc-blr',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    slug: 'bengaluru',
    isActive: false,
    isDefault: false,
    deliveryAvailability: 'Coming Soon',
    deliveryAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Bellandur'],
    hubAddress: 'South Hub 2 (Upcoming), Sarjapur Road, Bengaluru',
    contactPhone: '+91 94414 69814',
    operatingHours: 'Launching Soon',
    pincodes: ['560034', '560038', '560102'],
  },
  {
    id: 'loc-vjw',
    cityName: 'Vijayawada',
    state: 'Andhra Pradesh',
    slug: 'vijayawada',
    isActive: false,
    isDefault: false,
    deliveryAvailability: 'Coming Soon',
    deliveryAreas: ['Benz Circle', 'Labbipet', 'Patamata', 'Governorpet'],
    hubAddress: 'Krishna Delta Hub (Upcoming), Vijayawada',
    contactPhone: '+91 94414 69814',
    operatingHours: 'Launching Soon',
    pincodes: ['520010', '520008'],
  },
];

// All mock data removed. When the backend server is unpaused, live data will automatically populate.
export const initialCategories: Category[] = [];

export const initialProducts: Product[] = [];

export const initialReviews: CustomerReview[] = [];

export const instagramPosts: any[] = [];

export const customerTestimonials: any[] = [];
