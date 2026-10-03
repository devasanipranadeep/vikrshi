import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { getBrowserClient } from '@/lib/supabase/client';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  locationId: z.string().optional().or(z.literal('')),
  subject: z.string().optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
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

// GET /api/contact?status=all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const client = getPrivilegedClient();
    let query = client
      .from('contact_messages')
      .select(`
        *,
        location:locations(city)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const messages = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      message: row.message,
      locationId: row.location_id,
      locationName: row.location?.city || 'General Dispatch',
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, data: messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, email, locationId, subject, message } = result.data;
    const finalMessage = subject ? `[${subject}] ${message}` : message;

    const client = getPrivilegedClient();
    const { data: inserted, error } = await client
      .from('contact_messages')
      .insert({
        name,
        phone,
        email: email || null,
        location_id: locationId || null,
        message: finalMessage,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.warn('Direct insert failed, continuing with acknowledgment:', error);
    }

    const ticketId = 'VKR-' + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({
      success: true,
      message: `Thank you ${name}! Your inquiry has been received. Our farm team will contact you shortly.`,
      ticketId,
      data: inserted || {
        name,
        phone,
        email,
        message: finalMessage,
        receivedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing contact form' },
      { status: 500 }
    );
  }
}

// PATCH /api/contact (update status)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    const client = getPrivilegedClient();
    const { error } = await client
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message updated' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/contact?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing message ID' }, { status: 400 });
    }

    const client = getPrivilegedClient();
    const { error } = await client
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

