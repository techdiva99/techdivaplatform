// TechDIVA PWA Service Worker
const CACHE_NAME = 'techdiva-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  OFFLINE_URL
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('🚀 TechDIVA PWA: Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 TechDIVA PWA: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ TechDIVA PWA: Installation complete');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ TechDIVA PWA: Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 TechDIVA PWA: Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ TechDIVA PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ TechDIVA PWA: Activation complete');
      // Take control of all open clients
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('📱 TechDIVA PWA: Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache API responses and important assets
            if (shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('💾 TechDIVA PWA: Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // For images, return a placeholder
            if (event.request.destination === 'image') {
              return new Response(
                '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#ff67c7"/><text x="100" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="14">TechDIVA</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Determine if URL should be cached
function shouldCache(url) {
  // Cache TechDIVA API responses
  if (url.includes('/api/')) return true;
  
  // Cache static assets
  if (url.includes('/static/')) return true;
  
  // Cache images
  if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return true;
  
  // Cache fonts
  if (url.match(/\.(woff|woff2|ttf|eot)$/)) return true;
  
  return false;
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('🔔 TechDIVA PWA: Push notification received');
  
  let options = {
    body: 'You have a new message from TechDIVA!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open TechDIVA',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    tag: 'techdiva-notification'
  };
  
  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      options.body = pushData.body || options.body;
      options.title = pushData.title || 'TechDIVA';
      options.data = { ...options.data, ...pushData.data };
    } catch (e) {
      console.log('📝 TechDIVA PWA: Push data parsing failed, using defaults');
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('TechDIVA', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('👆 TechDIVA PWA: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Open or focus TechDIVA app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If TechDIVA is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('techdiva') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open new window
      if (clients.openWindow) {
        const url = event.action === 'explore' ? '/' : '/';
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 TechDIVA PWA: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline chat messages
    const offlineChats = await getStoredOfflineChats();
    if (offlineChats.length > 0) {
      console.log('💬 TechDIVA PWA: Syncing offline chat messages');
      await syncChatMessages(offlineChats);
    }
    
    // Sync offline cart changes
    const offlineCartChanges = await getStoredOfflineCartChanges();
    if (offlineCartChanges.length > 0) {
      console.log('🛒 TechDIVA PWA: Syncing offline cart changes');
      await syncCartChanges(offlineCartChanges);
    }
    
    console.log('✅ TechDIVA PWA: Background sync complete');
  } catch (error) {
    console.error('❌ TechDIVA PWA: Background sync failed:', error);
  }
}

// Helper functions for background sync (implement based on your data structure)
async function getStoredOfflineChats() {
  // Implementation depends on your offline storage strategy
  return [];
}

async function syncChatMessages(chats) {
  // Implementation for syncing chat messages
}

async function getStoredOfflineCartChanges() {
  // Implementation depends on your offline storage strategy
  return [];
}

async function syncCartChanges(changes) {
  // Implementation for syncing cart changes
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('📨 TechDIVA PWA: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('🎉 TechDIVA PWA: Service Worker loaded successfully!');