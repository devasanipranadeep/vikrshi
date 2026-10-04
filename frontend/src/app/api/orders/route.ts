import { NextResponse, NextRequest } from 'next/server';
import { orderService } from '@/services/orders';

export interface OrderLead {
  id: string;
  customerName: string;
  phone: string;
  location: string;
  source: 'WhatsApp Order' | 'Direct In-App Cart' | 'Contact Form' | 'Bulk Institution';
  itemsSummary: string;
  estimatedValue: number;
  status: 'New' | 'Contacted' | 'Harvesting' | 'Dispatched' | 'Delivered' | 'whatsapp_redirected' | 'confirmed';
  createdAt: string;
  notes?: string;
}

export async function GET() {
  try {
    const dbOrders = await orderService.getOrderInquiries();
    if (dbOrders && dbOrders.length > 0) {
      const mapped: OrderLead[] = dbOrders.map((inq) => ({
        id: inq.id,
        customerName: inq.customerName || 'WhatsApp Customer',
        phone: inq.customerPhone || '+91 94414 69814',
        location: inq.locationName || 'Hyderabad',
        source: 'WhatsApp Order',
        itemsSummary:
          inq.items && inq.items.length > 0
            ? inq.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')
            : 'Organic Farm Harvest',
        estimatedValue: inq.estimatedTotal || 0,
        status: (inq.status === 'confirmed' ? 'Delivered' : inq.status === 'whatsapp_redirected' ? 'New' : 'Contacted') as any,
        createdAt: inq.createdAt ? new Date(inq.createdAt).toLocaleString('en-IN') : 'Recently',
      }));

      return NextResponse.json({
        success: true,
        data: mapped,
      });
    }

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await orderService.createWhatsAppOrderInquiry({
      locationId: body.locationId || body.location || 'hyderabad',
      customerName: body.customerName,
      customerPhone: body.phone,
      customerNote: body.notes,
      items: body.items || [{ productId: 'default', quantity: 1 }],
    });

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to create order' }, { status: 500 });
  }
}
