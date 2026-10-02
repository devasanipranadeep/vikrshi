import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Singleton browser client instance for convenience
let browserClientInstance: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (typeof window === 'undefined') {
    return createClient();
  }
  if (!browserClientInstance) {
    browserClientInstance = createClient();
  }
  return browserClientInstance;
}
