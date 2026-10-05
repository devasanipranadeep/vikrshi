import { CustomerReview } from '@/types';
import { initialReviews } from '@/constants/mockData';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET_NAME = 'vikrshi-media';
const REVIEWS_FILE = 'reviews-metadata.json';

export async function loadPersistedReviews(): Promise<CustomerReview[]> {
  try {
    const adminClient = createAdminClient();
    const { data: fileData, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .download(REVIEWS_FILE);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read reviews-metadata.json from Supabase:', err);
  }

  return [...initialReviews];
}

export async function savePersistedReviews(reviews: CustomerReview[]): Promise<boolean> {
  try {
    const adminClient = createAdminClient();
    const buffer = Buffer.from(JSON.stringify(reviews, null, 2));
    const { error } = await adminClient.storage.from(BUCKET_NAME).upload(REVIEWS_FILE, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
    if (error) {
      console.error('Failed to save reviews metadata:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error saving reviews metadata:', err);
    return false;
  }
}
