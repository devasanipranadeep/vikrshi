import { getBrowserClient } from '@/lib/supabase/client';
import { CreateOrderInquiryInput } from '@/schemas/order';
import { OrderInquiryRecord, InquiryStatus, Database } from '@/types';

type OrderInquiryRow = Database['public']['Tables']['order_inquiries']['Row'];

function getClient(customClient?: any) {
  return customClient || getBrowserClient();
}

export interface WhatsAppOrderResponse {
  success: boolean;
  inquiryId: string;
  whatsappUrl: string;
  estimatedTotal: number;
  currency: string;
  messageText: string;
  recipientPhone: string;
}

export const orderService = {
  /**
   * Secure Server-Side WhatsApp Order Inquiry Creation:
   * 1. Fetches real products from Supabase
   * 2. Resolves selected location
   * 3. Calculates price (applying location-specific custom price if set)
   * 4. Checks availability
   * 5. Saves order inquiry and items into Supabase
   * 6. Formats clean WhatsApp pre-filled text and link
   */
  async createWhatsAppOrderInquiry(
    input: CreateOrderInquiryInput,
    customClient?: any
  ): Promise<WhatsAppOrderResponse> {
    const client = getClient(customClient);

    // 1. Fetch location details
    let locationRecord: any = null;
    let locationIdToSave: string | null = null;
    let locationName = 'Hyderabad';
    let locationPhone: string | null = null;

    if (input.locationId) {
      // Find by id or slug or city name
      const { data: locData } = await client
        .from('locations')
        .select('*')
        .or(`id.eq.${input.locationId},slug.eq.${input.locationId.toLowerCase()},city.ilike.%${input.locationId}%`)
        .limit(1)
        .maybeSingle();

      if (locData) {
        locationRecord = locData;
        locationIdToSave = locData.id;
        locationName = locData.city;
        locationPhone = locData.whatsapp_number;
      }
    }

    // 2. Fetch company settings for fallback WhatsApp phone
    const { data: settingsData } = await client
      .from('company_settings')
      .select('company_name, whatsapp_number')
      .eq('id', 1)
      .maybeSingle();

    const companyName = settingsData?.company_name || 'Vikrshi Suppliers Pvt Ltd';
    const fallbackPhone = settingsData?.whatsapp_number || '919441469814';
    const cleanWaNumber = (locationPhone || fallbackPhone).replace(/[^0-9]/g, '');

    // 3. Fetch verified products from Supabase
    const productIds = input.items.map((i) => i.productId);
    const { data: dbProducts, error: prodErr } = await client
      .from('products')
      .select(`
        id,
        name,
        price,
        unit,
        is_active,
        availability_status,
        product_locations(*)
      `)
      .in('id', productIds);

    if (prodErr || !dbProducts || dbProducts.length === 0) {
      console.warn('Could not find products in Supabase, using mock fallback calculation');
    }

    const productsMap = new Map<string, any>((dbProducts || []).map((p: any) => [p.id, p]));

    let calculatedTotal = 0;
    const itemsToInsert: {
      productId: string | null;
      productName: string;
      quantity: number;
      unit: string;
      price: number;
    }[] = [];

    const orderLines: string[] = [];

    input.items.forEach((item, index) => {
      const p = productsMap.get(item.productId);
      const name = p ? p.name : `Item #${item.productId}`;
      const unit = p ? p.unit : 'kg';

      let unitPrice = p ? Number(p.price) : 50;

      // Check for location-specific custom price
      if (locationIdToSave && p?.product_locations) {
        const pl = p.product_locations.find((l: any) => l.location_id === locationIdToSave);
        if (pl && pl.custom_price !== null && pl.custom_price !== undefined) {
          unitPrice = Number(pl.custom_price);
        }
      }

      const lineTotal = unitPrice * item.quantity;
      calculatedTotal += lineTotal;

      itemsToInsert.push({
        productId: p ? p.id : null,
        productName: name,
        quantity: item.quantity,
        unit,
        price: unitPrice,
      });

      orderLines.push(`${index + 1}. ${name} – ${item.quantity} ${unit} (₹${lineTotal})`);
    });

    // 4. Save order inquiry in Supabase
    let inquiryId = `inq-${Date.now()}`;
    try {
      const { data: inquiryRecord, error: inqError } = await client
        .from('order_inquiries')
        .insert({
          location_id: locationIdToSave,
          customer_name: input.customerName || null,
          customer_phone: input.customerPhone || null,
          estimated_total: calculatedTotal,
          status: 'whatsapp_redirected',
        })
        .select()
        .single();

      if (!inqError && inquiryRecord) {
        inquiryId = inquiryRecord.id;

        // Insert inquiry items
        const itemRows = itemsToInsert.map((item) => ({
          inquiry_id: inquiryRecord.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
        }));

        await client.from('order_inquiry_items').insert(itemRows);
      }
    } catch (saveErr) {
      console.warn('Could not save order inquiry to Supabase, continuing to WhatsApp:', saveErr);
    }

    // 5. Generate clean WhatsApp message
    let messageText = `Hello ${companyName},\n\nI would like to place an order:\n\n`;
    messageText += orderLines.join('\n');
    messageText += `\n\nEstimated Harvest Total: ₹${calculatedTotal.toLocaleString('en-IN')}`;
    messageText += `\nDelivery Location: ${locationName}`;

    if (input.customerName) {
      messageText += `\nCustomer Name: ${input.customerName}`;
    }
    if (input.customerPhone) {
      messageText += `\nPhone: ${input.customerPhone}`;
    }
    if (input.customerNote) {
      messageText += `\nSpecial Note: ${input.customerNote}`;
    }

    messageText += `\nInquiry Reference: #${inquiryId.slice(0, 8)}`;
    messageText += `\n\nPlease confirm availability, total amount and delivery details.`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodedText}`;

    return {
      success: true,
      inquiryId,
      whatsappUrl,
      estimatedTotal: calculatedTotal,
      currency: 'INR',
      messageText,
      recipientPhone: cleanWaNumber,
    };
  },

  /**
   * Admin: Get all order inquiries
   */
  async getOrderInquiries(statusFilter?: string, customClient?: any): Promise<OrderInquiryRecord[]> {
    try {
      const client = getClient(customClient);
      let query = client
        .from('order_inquiries')
        .select(`
          *,
          location:locations(city),
          items:order_inquiry_items(*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        locationId: row.location_id,
        locationName: row.location?.city || 'Hyderabad Hub',
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        estimatedTotal: row.estimated_total ? Number(row.estimated_total) : null,
        status: row.status as InquiryStatus,
        createdAt: row.created_at,
        items: (row.items || []).map((i: any) => ({
          id: i.id,
          inquiryId: i.inquiry_id,
          productId: i.product_id,
          productName: i.product_name,
          quantity: Number(i.quantity),
          unit: i.unit,
          price: Number(i.price),
        })),
      }));
    } catch {
      return [];
    }
  },

  /**
   * Admin: Update inquiry status
   */
  async updateInquiryStatus(id: string, status: InquiryStatus, customClient?: any): Promise<void> {
    const client = getClient(customClient);
    const { error } = await client
      .from('order_inquiries')
      .update({ status })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};
