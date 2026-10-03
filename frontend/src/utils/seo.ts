import { CompanySettings, Product, CustomerReview } from '@/types';

export function getOrganizationSchema(settings: CompanySettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.companyName,
    legalName: settings.legalName,
    url: 'https://vikrshi.com',
    logo: 'https://vikrshi.com/logo.png',
    description: settings.shortDescription,
    telephone: settings.phone,
    email: settings.email,
    sameAs: [settings.instagramUrl],
    address: {
      '@type': 'PostalAddress',
      streetAddress: [settings.address.line1, settings.address.line2].filter(Boolean).join(', ') || settings.address.fullText || '',
      addressLocality: settings.address.city || 'Siddipet',
      addressRegion: settings.address.state || 'Telangana',
      postalCode: settings.address.pincode || '502279',
      addressCountry: settings.address.country || 'India',
    },
  };
}

export function getLocalBusinessSchema(settings: CompanySettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.companyName,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    telephone: settings.phone,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: [settings.address.line1, settings.address.line2].filter(Boolean).join(', ') || settings.address.fullText || '',
      addressLocality: settings.address.city || 'Siddipet',
      addressRegion: settings.address.state || 'Telangana',
      postalCode: settings.address.pincode || '502279',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '17.385044',
      longitude: '78.486671',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '06:00',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '06:00',
        closes: '21:00',
      },
    ],
  };
}

export function getProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Vikrshi Suppliers',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function getReviewsPageSchema(reviews: CustomerReview[], avgRating: number = 4.9, count: number = 280) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vikrshi Suppliers Pvt Ltd',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toString(),
      reviewCount: count.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
      },
      reviewBody: r.comment,
    })),
  };
}

