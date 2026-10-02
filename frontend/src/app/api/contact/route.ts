import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().min(2, 'Please select or enter your delivery location'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

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

    const { name, phone, location, subject } = result.data;
    const ticketId = 'VKR-' + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({
      success: true,
      message: `Thank you ${name}! Your inquiry for ${location} has been received. Our farm team will contact you shortly.`,
      ticketId,
      data: {
        name,
        phone,
        location,
        subject,
        receivedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error processing contact form' },
      { status: 500 }
    );
  }
}
