import { NextResponse } from 'next/server';
import { initialCompanySettings } from '@/constants/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: initialCompanySettings,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
