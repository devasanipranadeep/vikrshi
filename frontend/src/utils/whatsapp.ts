import { Product, CartItem } from '@/types';

/**
 * Normalizes phone numbers to pure digits for wa.me links
 */
export function cleanWhatsAppNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export interface WhatsAppDeliveryDetails {
  houseNumber?: string;
  streetAddress?: string;
  landmark?: string;
  pincode?: string;
  customerName?: string;
  customerPhone?: string;
}

/**
 * Builds direct WhatsApp URL for a single product order
 */
export function buildSingleProductWhatsAppUrl({
  phone,
  companyName = 'Vikrshi Suppliers Pvt Ltd',
  product,
  quantity = 1,
  location = 'Hyderabad',
  deliveryDetails,
}: {
  phone: string;
  companyName?: string;
  product: Product;
  quantity?: number;
  location?: string;
  deliveryDetails?: WhatsAppDeliveryDetails;
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const qtyText = quantity > 1 ? `${quantity} x (${product.unit})` : product.unit;
  const estimatedPrice = product.price * quantity;

  const messageParts = [
    `Hi ${companyName},`,
    '',
    `I would like to order:`,
    `Product: ${product.name}`,
    `Quantity: ${qtyText}`,
    `Estimated Total: ₹${estimatedPrice}`,
  ];

  if (deliveryDetails?.houseNumber || deliveryDetails?.streetAddress) {
    messageParts.push('', `🏡 Delivery Address:`);
    if (deliveryDetails.houseNumber) messageParts.push(`• House / Flat No: ${deliveryDetails.houseNumber}`);
    if (deliveryDetails.streetAddress) messageParts.push(`• Street / Society: ${deliveryDetails.streetAddress}`);
    if (deliveryDetails.landmark) messageParts.push(`• Landmark: ${deliveryDetails.landmark}`);
    messageParts.push(`• City / Area: ${location}`);
    if (deliveryDetails.pincode) messageParts.push(`• Pincode: ${deliveryDetails.pincode}`);
  } else {
    messageParts.push(`Location: ${location}`);
  }

  if (deliveryDetails?.customerName || deliveryDetails?.customerPhone) {
    messageParts.push('', `👤 Customer Details:`);
    if (deliveryDetails.customerName) messageParts.push(`• Name: ${deliveryDetails.customerName}`);
    if (deliveryDetails.customerPhone) messageParts.push(`• Phone: ${deliveryDetails.customerPhone}`);
  }

  messageParts.push('', `Please confirm availability and delivery dispatch details.`);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageParts.join('\n'))}`;
}

/**
 * Builds multi-product WhatsApp order message from CartItems
 */
export function buildMultiProductWhatsAppUrl({
  phone,
  companyName = 'Vikrshi Suppliers Pvt Ltd',
  items,
  location = 'Hyderabad',
  customerNote,
  deliveryDetails,
}: {
  phone: string;
  companyName?: string;
  items: CartItem[];
  location?: string;
  customerNote?: string;
  deliveryDetails?: WhatsAppDeliveryDetails;
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);

  const productLines = items.map((item, idx) => {
    const qtyText = item.quantity > 1 ? `${item.quantity} x (${item.product.unit})` : item.product.unit;
    const subtotal = item.product.price * item.quantity;
    return `${idx + 1}. ${item.product.name} – ${qtyText} (₹${subtotal})`;
  });

  const grandTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const messageParts = [
    `Hello ${companyName},`,
    '',
    `I would like to place an order:`,
    '',
    ...productLines,
    '',
    `Estimated Total: ₹${grandTotal}`,
  ];

  if (deliveryDetails?.houseNumber || deliveryDetails?.streetAddress) {
    messageParts.push('', `🏡 Delivery Address:`);
    if (deliveryDetails.houseNumber) messageParts.push(`• House / Flat No: ${deliveryDetails.houseNumber}`);
    if (deliveryDetails.streetAddress) messageParts.push(`• Street / Society: ${deliveryDetails.streetAddress}`);
    if (deliveryDetails.landmark) messageParts.push(`• Landmark: ${deliveryDetails.landmark}`);
    messageParts.push(`• City / Area: ${location}`);
    if (deliveryDetails.pincode) messageParts.push(`• Pincode: ${deliveryDetails.pincode}`);
  } else {
    messageParts.push(`Delivery Location: ${location}`);
  }

  if (deliveryDetails?.customerName || deliveryDetails?.customerPhone) {
    messageParts.push('', `👤 Customer Details:`);
    if (deliveryDetails.customerName) messageParts.push(`• Name: ${deliveryDetails.customerName}`);
    if (deliveryDetails.customerPhone) messageParts.push(`• Phone: ${deliveryDetails.customerPhone}`);
  }

  if (customerNote && customerNote.trim()) {
    messageParts.push(`• Delivery Note: ${customerNote.trim()}`);
  }

  messageParts.push('', `Please confirm availability, total amount and delivery details.`);

  const message = messageParts.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds general inquiry WhatsApp URL
 */
export function buildGeneralWhatsAppUrl({
  phone,
  companyName = 'Vikrshi Suppliers Pvt Ltd',
  location = 'Hyderabad',
  customGreeting,
}: {
  phone: string;
  companyName?: string;
  location?: string;
  customGreeting?: string;
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const greeting =
    customGreeting ||
    `Hello ${companyName}, I would like to know more about your farm-fresh delivery slots in ${location}.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
}

/**
 * Builds out-of-stock restock inquiry WhatsApp URL
 */
export function buildOutOfStockInquiryWhatsAppUrl({
  phone,
  companyName = 'Vikrshi Suppliers Pvt Ltd',
  product,
  location = 'Hyderabad',
}: {
  phone: string;
  companyName?: string;
  product: Product;
  location?: string;
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const message = [
    `Hi ${companyName},`,
    '',
    `I noticed that ${product.name} is currently out of stock for ${location}.`,
    `Could you please let me know when fresh stock will be available for harvest dispatch?`,
    '',
    `Product Link: /products/${product.slug}`,
    '',
    `Thank you!`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface CommunityRequestDetails {
  applicantName: string;
  phone?: string;
  communityName: string;
  address: string;
  details?: string;
  source: string;
}

/**
 * Builds community bulk/apartment supply request WhatsApp URL
 */
export function buildCommunityRequestWhatsAppUrl({
  phone,
  companyName = 'Vikrshi Suppliers Pvt Ltd',
  request,
}: {
  phone: string;
  companyName?: string;
  request: CommunityRequestDetails;
}): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const messageParts = [
    `Hello ${companyName},`,
    '',
    `🌿 *Community / Apartment Supply Request*`,
    `I would like to explore getting Vikrshi fresh organic farm produce delivered to our residential community:`,
    '',
    `👤 *Applicant Name*: ${request.applicantName}`,
  ];

  if (request.phone) {
    messageParts.push(`📞 *Contact Phone*: ${request.phone}`);
  }

  messageParts.push(`🏢 *Community / Society*: ${request.communityName}`);
  messageParts.push(`📍 *Location & Address*: ${request.address}`);
  messageParts.push(`📢 *Heard About Us Via*: ${request.source}`);

  if (request.details && request.details.trim()) {
    messageParts.push('', `📝 *Details & Requirements*:`, request.details.trim());
  }

  messageParts.push(
    '',
    `Please share the details on how we can setup a community delivery schedule or farm harvest pop-up for our residents. Thank you!`
  );

  const message = messageParts.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
