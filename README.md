# Vikrshi Suppliers Pvt Ltd

> **Farm-to-Home Organic Farming & Products Supply Platform**  
> Built with **Next.js (App Router, Server Actions, TypeScript)** and a **complete Supabase backend (PostgreSQL, Supabase Auth, Supabase Storage, and Row Level Security)**.

---

## 🌾 Overview

Vikrshi Suppliers supplies fresh, responsibly grown organic vegetables, leafy greens, and handpicked orchard fruits from Vedic partner farms directly to homes.

- **Current Anchor Location**: Hyderabad, Telangana, India.
- **Multi-City Scalability**: Dynamic database-driven locations architecture. Admin can add Bengaluru, Mumbai, Pune, Chennai, or any other city at any time from the admin panel without modifying frontend code.
- **WhatsApp Ordering**: Customers browse products, select delivery location, review their order, and click **Place Order on WhatsApp**. Before redirecting, the server securely validates product availability and prices, creates an order inquiry in Supabase, and pre-fills the WhatsApp dispatch message.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Sonner Notifications, Canvas Confetti
- **Backend Platform**: **Supabase Only** (No separate Express, NestJS, or MongoDB)
  - **Database**: Supabase PostgreSQL with triggers, indexes, and automated timestamps
  - **Security**: Strict PostgreSQL Row Level Security (RLS) policies on all tables
  - **Authentication**: Supabase Auth with custom `profiles` and role checks
  - **Storage**: `vikrshi-media` bucket (products, categories, company assets)

---

## 🗄️ Database Architecture

The backend consists of 9 PostgreSQL tables:
1. `profiles`: Centralized admin account linked to Supabase Auth (`admin`)
2. `categories`: High-level product categories (*Vegetables*, *Fruits*, *Leafy Greens*, *Seasonal Products*)
3. `products`: Organic products items, prices, units, stock status, gallery
4. `locations`: Service cities, delivery availability, WhatsApp numbers, coordinates
5. `product_locations`: City-specific availability and custom regional pricing
6. `company_settings`: Singleton company branding, WhatsApp dispatch number, address, and hours
7. `contact_messages`: Inbound customer questions with status workflow
8. `order_inquiries`: Secure server-validated customer orders before WhatsApp redirect
9. `order_inquiry_items`: Line items with quantities and verified prices

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm or pnpm
- Supabase account ([https://supabase.com](https://supabase.com))

### 2. Environment Setup
Copy the environment template:
```bash
cp frontend/.env.example frontend/.env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Database Migration & Seeding
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run `supabase/schema.sql` to create all tables, triggers, functions, RLS policies, and storage bucket.
3. Run `supabase/seed.sql` to populate initial company settings, Hyderabad location, categories, and development products.

### 4. Running the Application
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Admin Portal

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin) or `/admin/login`
- **Demo Quick Access**: Enter PIN `5678` or credentials `admin@vikrshi.com` / `vikrshi2026`.
- **Production Access**: Created securely in Supabase Auth with centralized admin privileges.

### Admin Capabilities:
- **Dashboard**: Live metrics (total products, active in-stock items, vegetables, fruits, active delivery hubs, customer reviews, new inquiries, recent orders).
- **Products**: Add products, manage prices, upload images to Supabase Storage, and set city-specific pricing.
- **Categories**: Organize categories with image assets and ordering.
- **Locations**: Add and toggle service cities dynamically.
- **Order Inquiries**: Inspect customer WhatsApp orders and update fulfillment status.
- **Messages**: Review and respond to contact inquiries.
- **Store Settings**: Real-time updates to official WhatsApp dispatch number, address, and branding.

---

## 📖 Additional Documentation
- Detailed Supabase setup and migration instructions: [`SUPABASE_SETUP.md`](file:///d:/Vikrshi/SUPABASE_SETUP.md)
