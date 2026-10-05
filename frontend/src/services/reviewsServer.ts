import { CustomerReview } from '@/types';
import { initialReviews } from '@/constants/mockData';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET_NAME = 'vikrshi-media';
const REVIEWS_FILE = 'reviews-metadata.json';

function mapRowToReview(row: any): CustomerReview {
  let formattedDate = 'Today';
  try {
    if (row.created_at) {
      formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(row.created_at));
    }
  } catch {
    // fallback to formattedDate
  }

  return {
    id: String(row.id),
    name: row.name,
    location: row.location,
    rating: Number(row.rating),
    title: row.title,
    comment: row.comment,
    date: row.date || formattedDate,
    verifiedPurchase: row.verified_purchase ?? true,
    productName: row.product_name || undefined,
    helpfulCount: Number(row.helpful_count || 0),
  };
}

export async function loadPersistedReviews(): Promise<CustomerReview[]> {
  // 1. Primary: Query the customer_reviews table in Supabase PostgreSQL
  try {
    const adminClient = createAdminClient();
    const { data: dbData, error: dbError } = await adminClient
      .from('customer_reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!dbError && dbData && dbData.length > 0) {
      return dbData.map(mapRowToReview);
    }
  } catch (err) {
    console.warn('Supabase DB customer_reviews query fallback:', err);
  }

  // 2. Secondary fallback: Storage file
  try {
    const adminClient = createAdminClient();
    const { data: fileData, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .download(REVIEWS_FILE);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read reviews-metadata.json from Supabase:', err);
  }

  return [...initialReviews];
}

export async function insertPersistedReview(data: {
  name: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  productName?: string;
}): Promise<CustomerReview> {
  const today = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // 1. Try inserting directly into Supabase database table using admin client
  try {
    const adminClient = createAdminClient();
    const { data: inserted, error: dbError } = await adminClient
      .from('customer_reviews')
      .insert({
        name: data.name,
        location: data.location,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        product_name: data.productName && data.productName.trim().length > 0 ? data.productName.trim() : null,
        verified_purchase: true,
        helpful_count: 0,
        is_active: true,
      })
      .select();

    if (!dbError && inserted && inserted.length > 0) {
      const review = mapRowToReview(inserted[0]);
      await syncToStorage([review]);
      return review;
    } else if (dbError) {
      console.warn('DB insert via client warning:', dbError.message);
    }
  } catch (err) {
    console.warn('DB insert error:', err);
  }

  // 1b. Direct REST fetch fallback to insert into customer_reviews
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && key) {
      const restRes = await fetch(`${supabaseUrl}/rest/v1/customer_reviews`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          product_name: data.productName && data.productName.trim().length > 0 ? data.productName.trim() : null,
          verified_purchase: true,
          helpful_count: 0,
          is_active: true,
        }),
      });

      if (restRes.ok) {
        const rows = await restRes.json();
        if (rows && rows.length > 0) {
          const review = mapRowToReview(rows[0]);
          await syncToStorage([review]);
          return review;
        }
      }
    }
  } catch (err) {
    console.warn('REST insert fallback error:', err);
  }

  // 2. Fallback: Save to storage
  const newReview: CustomerReview = {
    id: `rev-${Date.now()}`,
    name: data.name,
    location: data.location,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    date: today,
    verifiedPurchase: true,
    productName: data.productName && data.productName.trim().length > 0 ? data.productName.trim() : undefined,
    helpfulCount: 0,
  };

  const existing = await loadPersistedReviews();
  existing.unshift(newReview);
  await saveStorageReviews(existing);
  return newReview;
}

export async function deletePersistedReview(id: string): Promise<boolean> {
  const adminClient = createAdminClient();

  // 1. Delete from Supabase PostgreSQL database
  try {
    const { error } = await adminClient
      .from('customer_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('DB delete warning:', error.message);
    }
  } catch (err) {
    console.warn('DB delete error:', err);
  }

  // 2. Also remove from storage backup
  try {
    const existing = await loadPersistedReviews();
    const filtered = existing.filter((r) => r.id !== id);
    await saveStorageReviews(filtered);
  } catch (err) {
    console.warn('Storage cleanup error:', err);
  }

  return true;
}

export async function upvotePersistedReview(id: string): Promise<number> {
  const adminClient = createAdminClient();

  // 1. Try DB
  try {
    const { data: current } = await adminClient
      .from('customer_reviews')
      .select('helpful_count')
      .eq('id', id)
      .single();

    if (current) {
      const newCount = (current.helpful_count || 0) + 1;
      await adminClient
        .from('customer_reviews')
        .update({ helpful_count: newCount })
        .eq('id', id);
      return newCount;
    }
  } catch (err) {
    console.warn('DB upvote error:', err);
  }

  // 2. Fallback storage
  const existing = await loadPersistedReviews();
  const rev = existing.find((r) => r.id === id);
  if (rev) {
    rev.helpfulCount = (rev.helpfulCount || 0) + 1;
    await saveStorageReviews(existing);
    return rev.helpfulCount;
  }
  return 1;
}

async function saveStorageReviews(reviews: CustomerReview[]): Promise<boolean> {
  try {
    const adminClient = createAdminClient();
    const buffer = Buffer.from(JSON.stringify(reviews, null, 2));
    await adminClient.storage.from(BUCKET_NAME).upload(REVIEWS_FILE, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
    return true;
  } catch (err) {
    console.error('Error saving reviews to storage:', err);
    return false;
  }
}

async function syncToStorage(extraReviews: CustomerReview[]): Promise<void> {
  try {
    const existing = await loadPersistedReviews();
    const merged = [...extraReviews, ...existing.filter((e) => !extraReviews.some((r) => r.id === e.id))];
    await saveStorageReviews(merged);
  } catch {
    // ignore
  }
}
