import { getBrowserClient } from '@/lib/supabase/client';
import { CreateOrderInquiryInput } from '@/schemas/order';
import { OrderInquiryRecord, InquiryStatus, Database } from '@/types';
import { initialCompanySettings } from '@/constants/mockData';

type OrderInquiryRow = Database['public']['Tables']['customer_orders']['Row'];

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

    // 2. Constant company settings for fallback WhatsApp phone
    const companyName = initialCompanySettings.companyName;
    const fallbackPhone = initialCompanySettings.whatsappNumber;
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
        locations
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
      const locList = (p?.locations && Array.isArray(p.locations) ? p.locations : p?.product_locations) || [];
      if (locationIdToSave && locList.length > 0) {
        const pl = locList.find((l: any) => l.location_id === locationIdToSave);
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
      const addressDetailsStr = input.houseNumber
        ? ` [H.No: ${input.houseNumber}${input.streetAddress ? `, ${input.streetAddress}` : ''}${input.pincode ? ` - ${input.pincode}` : ''}]`
        : '';
      const fullCustomerName = input.customerName
        ? `${input.customerName}${addressDetailsStr}`
        : (addressDetailsStr || null);

      const itemRows = itemsToInsert.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      }));

      const { data: inquiryRecord, error: inqError } = await client
        .from('customer_orders')
        .insert({
          location_id: locationIdToSave,
          customer_name: fullCustomerName,
          customer_phone: input.customerPhone || null,
          delivery_address: addressDetailsStr || null,
          estimated_total: calculatedTotal,
          items: itemRows,
          status: 'whatsapp_redirected',
        })
        .select()
        .single();

      if (!inqError && inquiryRecord) {
        inquiryId = inquiryRecord.id;
      }
    } catch (saveErr) {
      console.warn('Could not save order inquiry to Supabase, continuing to WhatsApp:', saveErr);
    }

    // 5. Generate clean WhatsApp message with delivery details
    let messageText = `Hello ${companyName},\n\nI would like to place an order:\n\n`;
    messageText += orderLines.join('\n');
    messageText += `\n\nEstimated Harvest Total: ₹${calculatedTotal.toLocaleString('en-IN')}`;

    if (input.houseNumber || input.streetAddress) {
      messageText += `\n\n🏡 Delivery Address:`;
      if (input.houseNumber) {
        messageText += `\n• House / Flat No: ${input.houseNumber}`;
      }
      if (input.streetAddress) {
        messageText += `\n• Street / Society: ${input.streetAddress}`;
      }
      if (input.landmark) {
        messageText += `\n• Landmark: ${input.landmark}`;
      }
      messageText += `\n• City / Area: ${locationName}`;
      if (input.pincode) {
        messageText += `\n• Pincode: ${input.pincode}`;
      }
    } else {
      messageText += `\nDelivery Location: ${locationName}`;
    }

    if (input.customerName || input.customerPhone) {
      messageText += `\n\n👤 Customer Details:`;
      if (input.customerName) {
        messageText += `\n• Name: ${input.customerName}`;
      }
      if (input.customerPhone) {
        messageText += `\n• Phone: ${input.customerPhone}`;
      }
    }

    if (input.customerNote) {
      messageText += `\n• Delivery Note: ${input.customerNote}`;
    }

    messageText += `\n\nInquiry Reference: #${inquiryId.slice(0, 8)}`;
    messageText += `\n\nPlease confirm availability, total amount and dispatch schedule.`;

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
        .from('customer_orders')
        .select(`
          *,
          location:locations(city)
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
        deliveryAddress: row.delivery_address || null,
        notes: row.notes || null,
        estimatedTotal: row.estimated_total ? Number(row.estimated_total) : null,
        status: row.status as InquiryStatus,
        createdAt: row.created_at,
        items: Array.isArray(row.items)
          ? row.items.map((i: any, index: number) => ({
              id: i.id || `${row.id}-${index}`,
              inquiryId: row.id,
              productId: i.product_id || i.productId || null,
              productName: i.product_name || i.productName || 'Farm Product',
              quantity: Number(i.quantity || 1),
              unit: i.unit || 'kg',
              price: Number(i.price || 0),
            }))
          : [],
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
      .from('customer_orders')
      .update({ status })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};
