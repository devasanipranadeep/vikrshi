export type StoreUpdateType = 'products' | 'categories' | 'settings' | 'locations' | 'reviews' | 'all';

export interface StoreUpdateMessage {
  type: StoreUpdateType;
  timestamp: number;
}

const CHANNEL_NAME = 'vikrshi_live_channel';
const STORAGE_KEY = 'vikrshi_sync_stamp';

/**
 * Dispatches an update across all open tabs, windows, and listeners.
 */
export function notifyStoreUpdate(type: StoreUpdateType = 'all') {
  if (typeof window === 'undefined') return;

  const message: StoreUpdateMessage = {
    type,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel across all browser tabs in this origin
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage(message);
      // Close shortly after to prevent memory leakage
      setTimeout(() => bc.close(), 100);
    }
  } catch (e) {
    // Ignore BroadcastChannel errors in restrictive environments
  }

  // 2. localStorage write to trigger storage event in other tabs
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
  } catch (e) {
    // Storage quota or disabled
  }

  // 3. Local CustomEvent for current tab
  try {
    window.dispatchEvent(new CustomEvent('vikrshi_store_updated', { detail: message }));
  } catch (e) {}
}

/**
 * Subscribes to live store updates from BroadcastChannel, storage events, custom window events,
 * and tab focus revalidation.
 */
export function subscribeToStoreUpdates(
  callback: (type: StoreUpdateType) => void,
  filterTypes?: StoreUpdateType[]
): () => void {
  if (typeof window === 'undefined') return () => {};

  let lastExecuted = 0;
  const handleUpdate = (type: StoreUpdateType) => {
    const now = Date.now();
    // Debounce rapid bursts within 200ms
    if (now - lastExecuted < 200) return;
    lastExecuted = now;

    if (!filterTypes || filterTypes.includes('all') || filterTypes.includes(type) || type === 'all') {
      callback(type);
    }
  };

  // 1. BroadcastChannel listener
  let bc: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.type) {
          handleUpdate(event.data.type);
        }
      };
    }
  } catch (e) {}

  // 2. Cross-tab storage event listener
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed?.type) {
          handleUpdate(parsed.type);
        }
      } catch {}
    }
  };
  window.addEventListener('storage', onStorage);

  // 3. Current tab CustomEvent listener
  const onCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<StoreUpdateMessage>;
    if (custom.detail?.type) {
      handleUpdate(custom.detail.type);
    }
  };
  window.addEventListener('vikrshi_store_updated', onCustomEvent);

  // 4. Window focus listener (revalidate when user switches back to this tab)
  let lastFocusCheck = Date.now();
  const onFocus = () => {
    const now = Date.now();
    // Throttle focus checks to at least 4 seconds apart
    if (now - lastFocusCheck > 4000) {
      lastFocusCheck = now;
      handleUpdate('all');
    }
  };
  window.addEventListener('focus', onFocus);

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onFocus();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Cleanup
  return () => {
    if (bc) {
      try {
        bc.close();
      } catch {}
    }
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('vikrshi_store_updated', onCustomEvent);
    window.removeEventListener('focus', onFocus);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
