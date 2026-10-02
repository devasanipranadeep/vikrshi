// Centralized API Client

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Handle client vs server URL
  const baseUrl = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}
