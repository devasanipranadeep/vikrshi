import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { LocationSelectorModal } from '@/components/layout/LocationSelectorModal';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { CommunityRequestModal } from '@/components/home/CommunityRequestModal';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vikrshi.com'),
  title: {
    default: 'Vikrshi Suppliers Pvt Ltd | Fresh Organic Products from Farm to Home',
    template: '%s | Vikrshi Suppliers Pvt Ltd',
  },
  description:
    'Vikrshi Suppliers supplies fresh, responsibly grown organic vegetables and fruits directly from trusted partner farms to your home in Hyderabad and beyond.',
  keywords: [
    'organic farming',
    'fresh vegetables Hyderabad',
    'farm fresh products',
    'organic fruits delivery',
    'Vikrshi Suppliers',
    'pesticide-free food Telangana',
    'farm to home delivery',
  ],
  authors: [{ name: 'Vikrshi Suppliers Pvt Ltd' }],
  creator: 'Vikrshi Suppliers Pvt Ltd',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vikrshi.com',
    siteName: 'Vikrshi Suppliers Pvt Ltd',
    title: 'Vikrshi Suppliers Pvt Ltd | Fresh Organic Products from Farm to Home',
    description:
      'Fresh, responsibly grown organic vegetables and orchard fruits delivered directly from trusted partner farms to your home.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Vikrshi Fresh Organic Farm Harvest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vikrshi Suppliers Pvt Ltd | Fresh Organic Farm Products',
    description:
      'Responsibly grown vegetables and fruits delivered from trusted farms to your doorstep in Hyderabad.',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80'],
  },
  icons: {
    icon: [
      { url: '/logo-full.png', type: 'image/png' },
    ],
    shortcut: '/logo-full.png',
    apple: [
      { url: '/logo-full.png', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#081B11',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-cream-50 text-forest-950 font-sans antialiased selection:bg-leaf-200 selection:text-forest-900">
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <LocationSelectorModal />
          <FloatingWhatsApp />
          <CommunityRequestModal />
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
