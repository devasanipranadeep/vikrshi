import { Metadata } from 'next';
import { GalleryClient } from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
  title: 'Farm & Facility Photo Gallery | Vikrshi Suppliers Pvt Ltd',
  description:
    'Experience the real farm-to-table journey of Vikrshi Suppliers Pvt Ltd. Explore genuine photography of our partner farms across Chevella, dawn harvests, cold chain sorting, and morning community deliveries in Hyderabad.',
  openGraph: {
    title: 'Farm & Facility Photo Gallery | Vikrshi Suppliers Pvt Ltd',
    description:
      'Transparent photography of living soil, Jeevamrutham cultivation, morning harvests, and hygienic cold-chain distribution in Hyderabad.',
    images: ['/hero/farm-1.jpg'],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
