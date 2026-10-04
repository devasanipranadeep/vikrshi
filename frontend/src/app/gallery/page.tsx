import { Metadata } from 'next';
import { GalleryClient } from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
  title: 'Farm Gallery & Harvest Journal | Vikrshi Suppliers Pvt Ltd',
  description:
    'Experience our regenerative living soil fields, dawn vegetable harvests, partner smallholder farmers, and daily morning deliveries across Hyderabad.',
  openGraph: {
    title: 'Farm Gallery & Live Moments | Vikrshi Suppliers',
    description:
      'Explore regenerative organic farming in Telangana, sunrise harvests, and clean farm-to-community supply chain.',
    images: ['/background.png'],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
