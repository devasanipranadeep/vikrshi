import { NextResponse, NextRequest } from 'next/server';
import { orderService } from '@/services/orders';

export interface InquiryLead {
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

const fallbackLeads: InquiryLead[] = [
  {
    id: 'LEAD-1082',
    customerName: 'Radha Madhavan',
    phone: '+91 98480 12345',
    location: 'Jubilee Hills, Road No. 36',
    source: 'WhatsApp Order',
    itemsSummary: '2kg Country Tomatoes, 2 bunches Baby Palak, 1kg Ooty Carrots',
    estimatedValue: 246,
    status: 'New',
    createdAt: 'Today, 7:15 AM',
    notes: 'Requested early morning slot before 8:30 AM',
  },
  {
    id: 'LEAD-1081',
    customerName: 'Vikramaditya Rao',
    phone: '+91 94401 98765',
    location: 'Gachibowli, Telecom Nagar',
    source: 'Direct In-App Cart',
    itemsSummary: '1kg Anar (Pomegranate), 1kg Wild Sitaphal, 500g Bitter Gourd',
    estimatedValue: 388,
    status: 'Harvesting',
    createdAt: 'Today, 6:40 AM',
    notes: 'Chevella batch packed in jute bag',
  },
];

export async function GET() {
  try {
    const dbInquiries = await orderService.getOrderInquiries();
    if (dbInquiries && dbInquiries.length > 0) {
      const mapped: InquiryLead[] = dbInquiries.map((inq) => ({
        id: inq.id,
        customerName: inq.customerName || 'WhatsApp Customer',
        phone: inq.customerPhone || '+91 94901 23456',
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
      data: fallbackLeads,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: fallbackLeads,
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
    return NextResponse.json({ success: false, message: error.message || 'Failed to create inquiry' }, { status: 500 });
  }
}
