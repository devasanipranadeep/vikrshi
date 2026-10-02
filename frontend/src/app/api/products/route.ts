import { NextResponse, NextRequest } from 'next/server';
import { productService } from '@/services/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const seasonal = searchParams.get('seasonal') === 'true' ? true : undefined;
    const location = searchParams.get('location') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const products = await productService.getProducts({
      search,
      category,
      featured,
      seasonal,
      location,
      sort,
      minPrice,
      maxPrice,
      includeInactive: searchParams.get('includeInactive') === 'true',
    });

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await productService.createProduct(body, body.locationSettings);

    return NextResponse.json(
      {
        success: true,
        message: 'Product added successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const updated = await productService.updateProduct(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    await productService.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Product removed from catalog',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
