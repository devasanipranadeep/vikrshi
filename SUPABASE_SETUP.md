# Vikrshi Suppliers Pvt Ltd - Supabase Backend Setup Guide

This document contains step-by-step instructions to configure **Supabase** as the complete backend platform for **Vikrshi Suppliers Pvt Ltd**.

---

## 1. Quick Overview

Vikrshi Suppliers uses **Supabase only** for:
- **Database**: PostgreSQL with strict Row Level Security (RLS) on all 10 tables.
- **Authentication**: Supabase Auth for Super Admin, Admin, and Content Manager roles.
- **Storage**: `vikrshi-media` bucket for produce images, categories, and company branding.
- **Security**: Row Level Security (RLS) policies allowing public read access to active produce, and restricting management to authorized admin roles.
- **WhatsApp Ordering**: Secure server-side inquiry creation and price validation before WhatsApp redirect.

---

## 2. Setting up Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create or open your project.
2. Under **Project Settings -> API**, copy:
   - **Project URL**
   - **anon / public key** (or publishable key)
   - **service_role key** (keep this secret!)

3. In your local `frontend/.env.local` (or production environment variables):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 3. Database Schema & Migration Execution

1. Open your Supabase Dashboard and click on the **SQL Editor** tab in the left sidebar.
2. Click **New Query**.
3. Copy the complete contents of `supabase/schema.sql` and paste it into the editor.
4. Click **Run** (Ctrl + Enter).
   - This creates all 9 tables:
     - `profiles`
     - `categories`
     - `products`
     - `locations`
     - `product_locations`
     - `company_settings`
     - `contact_messages`
     - `order_inquiries`
     - `order_inquiry_items`
   - This creates the `handle_updated_at` timestamp triggers.
   - This creates the `is_admin()`, `is_super_admin()`, and `is_full_admin()` functions.
   - This enables RLS across all tables and applies public and admin policies.
   - This configures the `vikrshi-media` storage bucket and access policies.

---

## 4. Seeding Initial Data

1. In the Supabase **SQL Editor**, open another **New Query**.
2. Copy the contents of `supabase/seed.sql` and paste it into the editor.
3. Click **Run**.
   - Inserts company settings for *Vikrshi Suppliers Pvt Ltd*.
   - Inserts the initial anchor location: **Hyderabad, Telangana, India**.
   - Inserts default categories: *Vegetables*, *Fruits*, *Leafy Greens*, *Seasonal Produce*.
   - Inserts development produce items: *Organic Tomatoes*, *Fresh Spinach*, *Farm Fresh Carrots*, *Apples*, *Bananas*.
   - Connects produce to Hyderabad in `product_locations`.

---

## 5. Creating the Centralized Admin Account

1. In Supabase Dashboard, navigate to **Authentication -> Users**.
2. Click **Add User** -> **Create User**.
3. Enter:
   - **Email**: `admin@vikrshi.com`
   - **Password**: (Choose a secure password, e.g., `Vikrshi@2026Admin`)
   - **Auto Confirm User?**: Check **Yes**.
4. Click **Create User**.
5. Open the **SQL Editor** and run (it automatically matches the email you just registered):
   ```sql
   insert into public.profiles (id, full_name, role, is_active)
   select 
     id,
     'Vikrshi Admin',
     'admin',
     true
   from auth.users
   where email = 'admin@vikrshi.com'
   on conflict (id) do update set
     role = 'admin',
     is_active = true;
   ```
6. You can now log into `/admin` or `/admin/login` using this email and password!

---

## 6. Supabase Storage Setup

The SQL script automatically creates the `vikrshi-media` bucket:
- **Bucket ID**: `vikrshi-media`
- **Public**: `true`
- **Max file size**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
- **Organized folders**:
  - `products/`
  - `categories/`
  - `company/`

If you prefer to verify or create it manually:
1. Go to **Storage** in the Supabase Dashboard.
2. Confirm `vikrshi-media` exists and is marked **Public**.

---

## 7. Multi-City Expansion (No Frontend Code Changes Needed)

The platform is built to expand to unlimited cities:
1. Go to `/admin/locations` in the admin panel.
2. Click **Add New City**.
3. Fill in:
   - **City**: e.g., *Bengaluru*
   - **State**: e.g., *Karnataka*
   - **Slug**: `bengaluru`
   - **WhatsApp Number**: (Optional dedicated city dispatch number)
   - **Service Areas**: e.g., *Indiranagar, Koramangala, Whitefield*
4. Click **Save Location**.
5. The public storefront (`/locations`, `/shop`, cart drawer) will instantly display Bengaluru without redeploying frontend code.

---

## 8. Customer WhatsApp Order Flow

1. Customer browses organic fruits and vegetables on `/shop`.
2. Adds items to cart and selects delivery location.
3. Clicks **Place Order on WhatsApp**.
4. Next.js Server Action (`createWhatsAppOrderAction`) executes on the server:
   - Fetches actual product prices from Supabase.
   - Checks location-specific price or regular price.
   - Validates availability.
   - Creates an `order_inquiries` record and `order_inquiry_items` in Supabase.
   - Generates pre-filled WhatsApp message URL.
5. WhatsApp opens directly with the farm manager containing the order summary and inquiry reference code.
6. The inquiry immediately appears in the admin panel under **Order Inquiries** (`/admin/inquiries`).

---

## 9. Centralized Admin Access

| Module | Centralized Admin | Public / Anon |
|---|---|---|
| View active products | Full Access | Read active |
| Create / Edit / Delete products | Full Access | No |
| Categories CRUD | Full Access | Read active |
| Locations CRUD | Full Access | Read active |
| View & Manage Order Inquiries | Full Access | Insert only |
| View & Respond to Messages | Full Access | Insert only |
| Store Settings | Full Access | Read public |
| Customer Reviews Moderation | Full Access | Read approved |
