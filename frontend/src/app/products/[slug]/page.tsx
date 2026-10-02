import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/products';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { getProductSchema } from '@/utils/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Vikrshi Organic Farms',
    };
  }

  return {
    title: `${product.name} | Vikrshi Organic Farms Hyderabad`,
    description: `${product.shortDescription} Responsibly grown, harvested at dawn, delivered fresh to your door in Hyderabad.`,
    openGraph: {
      title: `${product.name} | Vikrshi Organic Farms`,
      description: product.shortDescription,
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allCategoryProducts = await productService.getProducts({ category: product.category });
  const related = allCategoryProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const schema = getProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailView product={product} relatedProducts={related} />
    </>
  );
}
