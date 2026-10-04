import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settings';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let client: any = undefined;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        client = createAdminClient();
      } catch (e) {
        console.warn('Could not create admin client:', e);
      }
    }
    const settings = await settingsService.getCompanySettings(client);
    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retrieve company settings' },
      { status: 500 }
    );
  }
}
