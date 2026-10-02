import { NextResponse, NextRequest } from 'next/server';
import { locationService } from '@/services/locations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const locations = await locationService.getLocations(!activeOnly);

    return NextResponse.json({
      success: true,
      data: locations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retrieve locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, state, country, address, serviceAreas, whatsappNumber } = body;

    if (!city) {
      return NextResponse.json({ success: false, message: 'City name is required' }, { status: 400 });
    }

    const created = await locationService.createLocation({
      city,
      state: state || 'Telangana',
      country: country || 'India',
      slug: body.slug || city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: address || null,
      service_areas: serviceAreas || [],
      delivery_available: body.deliveryAvailable !== false,
      whatsapp_number: whatsappNumber || null,
      is_active: body.isActive !== false,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Location ${city} added successfully`,
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create location' },
      { status: 500 }
    );
  }
}
