import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { getBrowserClient } from '@/lib/supabase/client';

const communitySchema = z.object({
  applicantName: z.string().min(2, 'Applicant name is required'),
  phone: z.string().optional().or(z.literal('')),
  communityName: z.string().min(2, 'Community name is required'),
  address: z.string().min(3, 'Address is required'),
  source: z.string().min(1, 'Source is required'),
  details: z.string().optional().or(z.literal('')),
});

function getPrivilegedClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createAdminClient();
    } catch (e) {
      console.warn('Could not create admin client:', e);
    }
  }
  return getBrowserClient();
}

// GET /api/community?status=all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const client = getPrivilegedClient();
    let query = client
      .from('community_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const requests = (data || []).map((row: any) => ({
      id: row.id,
      applicantName: row.applicant_name,
      phone: row.phone,
      communityName: row.community_name,
      address: row.address,
      source: row.source,
      details: row.details,
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/community
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = communitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const client = getPrivilegedClient();
    const { data, error } = await client
      .from('community_requests')
      .insert({
        applicant_name: parsed.data.applicantName.trim(),
        phone: parsed.data.phone?.trim() || null,
        community_name: parsed.data.communityName.trim(),
        address: parsed.data.address.trim(),
        source: parsed.data.source.trim(),
        details: parsed.data.details?.trim() || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Community delivery request recorded successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit community request' },
      { status: 500 }
    );
  }
}

// PATCH /api/community
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'contacted', 'approved', 'rejected', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const client = getPrivilegedClient();
    const { data, error } = await client
      .from('community_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Status updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}

// DELETE /api/community?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: id' },
        { status: 400 }
      );
    }

    const client = getPrivilegedClient();
    const { error } = await client
      .from('community_requests')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community request deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete request' },
      { status: 500 }
    );
  }
}
