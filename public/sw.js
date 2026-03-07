// Service Worker for Orelhas do Dragão PWA
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `orelhas-dragao-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.jpg',
  '/offline',
];

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: ['/', '/personagens', '/api'],
  cacheFirst: ['/icon', '/logo', '/favicon', '/_next/static'],
  staleWhileRevalidate: ['/personagens/', '/_next/image'],
};

// Install event - precache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control immediately
  return self.clients.claim();
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine strategy
  const strategy = getStrategy(url.pathname);

  event.respondWith(
    strategy(request).catch(() => {
      // Fallback to offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return new Response('Offline - Recurso não disponível', {
        status: 503,
        statusText: 'Service Unavailable',
      });
    })
  );
});

// Get appropriate strategy for path
function getStrategy(pathname) {
  // Network First (for pages and API)
  if (
    CACHE_STRATEGIES.networkFirst.some((pattern) => pathname.startsWith(pattern))
  ) {
    return networkFirst;
  }

  // Cache First (for static assets)
  if (
    CACHE_STRATEGIES.cacheFirst.some((pattern) => pathname.includes(pattern))
  ) {
    return cacheFirst;
  }

  // Stale While Revalidate (for dynamic content)
  if (
    CACHE_STRATEGIES.staleWhileRevalidate.some((pattern) =>
      pathname.startsWith(pattern)
    )
  ) {
    return staleWhileRevalidate;
  }

  // Default to network first
  return networkFirst;
}

// Network First Strategy
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    // Cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Fetch in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // Return cached immediately if available
  return cached || fetchPromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-characters') {
    event.waitUntil(syncCharacters());
  }
});

// Sync characters when back online
async function syncCharacters() {
  try {
    // Get pending sync data from IndexedDB
    const db = await openDB();
    const pendingSync = await getPendingSync(db);

    if (pendingSync.length > 0) {
      console.log('[SW] Syncing', pendingSync.length, 'items');

      for (const item of pendingSync) {
        try {
          await fetch(item.url, {
            method: item.method,
            headers: item.headers,
            body: item.body,
          });

          // Remove from pending after successful sync
          await removePendingSync(db, item.id);
        } catch (error) {
          console.error('[SW] Failed to sync item:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('orelhas-dragao-sync', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-sync')) {
        db.createObjectStore('pending-sync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingSync(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-sync'], 'readonly');
    const store = transaction.objectStore('pending-sync');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingSync(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-sync'], 'readwrite');
    const store = transaction.objectStore('pending-sync');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  const options = {
    body: event.data?.text() || 'Nova notificação',
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification('Orelhas do Dragão', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
