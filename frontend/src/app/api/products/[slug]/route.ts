import { NextResponse, NextRequest } from 'next/server';
import { initialProducts } from '@/constants/mockData';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;
    const product = initialProducts.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Also get related products from same category
    const related = initialProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      data: {
        product,
        related,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve product details' },
      { status: 500 }
    );
  }
}
