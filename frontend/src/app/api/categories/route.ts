import { NextResponse } from 'next/server';
import { categoryService } from '@/services/categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await categoryService.getCategories();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve categories' },
      { status: 500 }
    );
  }
}
