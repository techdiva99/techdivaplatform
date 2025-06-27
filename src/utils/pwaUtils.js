// TechDIVA PWA Utilities
// Service Worker Registration and PWA Management

// Register service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log('🚀 TechDIVA PWA: Registering service worker...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('✅ TechDIVA PWA: Service worker registered successfully');
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 TechDIVA PWA: New service worker version found');
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 TechDIVA PWA: New version available');
              showUpdateAvailableNotification();
            }
          });
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        
        // Register for background sync
        if ('sync' in registration) {
          console.log('✅ TechDIVA PWA: Background sync supported');
        }
        
        return registration;
      } catch (error) {
        console.error('❌ TechDIVA PWA: Service worker registration failed:', error);
      }
    });
  } else {
    console.log('❌ TechDIVA PWA: Service workers not supported');
  }
};

// Handle service worker messages
const handleServiceWorkerMessage = (event) => {
  const { data } = event;
  
  switch (data.type) {
    case 'SW_UPDATE_AVAILABLE':
      showUpdateAvailableNotification();
      break;
    case 'SW_CACHE_UPDATED':
      console.log('📦 TechDIVA PWA: Cache updated');
      break;
    default:
      console.log('📨 TechDIVA PWA: Unknown message from SW:', data);
  }
};

// Show update notification
const showUpdateAvailableNotification = () => {
  // Check if notification already exists
  if (document.getElementById('pwa-update-notification')) {
    return;
  }

  // Create update notification
  const notification = document.createElement('div');
  notification.id = 'pwa-update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff67c7;
      color: white;
      padding: 16px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 500;
    ">
      <span>🆕 TechDIVA™ update available!</span>
      <button id="pwa-update-btn" style="
        background: white;
        color: #ff67c7;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
      ">Update</button>
      <button id="pwa-dismiss-btn" style="
        background: none;
        color: white;
        border: none;
        padding: 4px;
        cursor: pointer;
        font-size: 16px;
      ">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add event listeners
  document.getElementById('pwa-update-btn').addEventListener('click', updatePWA);
  document.getElementById('pwa-dismiss-btn').addEventListener('click', dismissUpdateNotification);
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    dismissUpdateNotification();
  }, 10000);
};

// Update PWA function
const updatePWA = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ TechDIVA PWA: Update failed:', error);
  }
};

// Dismiss update notification function
const dismissUpdateNotification = () => {
  const notification = document.getElementById('pwa-update-notification');
  if (notification) {
    notification.remove();
  }
};

// Check if running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         window.navigator.standalone === true;
};

// Get PWA display mode
export const getPWADisplayMode = () => {
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  return 'browser';
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('❌ TechDIVA PWA: Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    console.log('✅ TechDIVA PWA: Notification permission already granted');
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.log('❌ TechDIVA PWA: Notification permission denied');
    return false;
  }
  
  try {
    console.log('🔔 TechDIVA PWA: Requesting notification permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ TechDIVA PWA: Notification permission granted');
      // Send welcome notification
      showNotification('Welcome to TechDIVA™!', {
        body: 'You\'ll now receive updates about your chatbots and orders.',
        icon: '/icons/icon-192x192.png'
      });
      return true;
    } else {
      console.log('❌ TechDIVA PWA: Notification permission denied by user');
      return false;
    }
  } catch (error) {
    console.error('❌ TechDIVA PWA: Error requesting notification permission:', error);
    return false;
  }
};

// Show notification
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('❌ TechDIVA PWA: Cannot show notification - permission not granted');
    return;
  }
  
  const defaultOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: 'techdiva-notification'
  };
  
  const notification = new Notification(title, { ...defaultOptions, ...options });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);
  
  return notification;
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      throw new Error('Service worker not registered');
    }
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log('✅ TechDIVA PWA: Already subscribed to push notifications');
      return subscription;
    }
    
    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission denied');
    }
    
    // Subscribe to push notifications
    // Note: You'll need to generate VAPID keys for production
    const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // Replace with your actual VAPID key
    
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    console.log('✅ TechDIVA PWA: Subscribed to push notifications');
    
    // Send subscription to your server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('❌ TechDIVA PWA: Push subscription failed:', error);
    throw error;
  }
};

// Convert VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Send subscription to server
const sendSubscriptionToServer = async (subscription) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }
    
    console.log('✅ TechDIVA PWA: Subscription sent to server');
  } catch (error) {
    console.error('❌ TechDIVA PWA: Failed to send subscription to server:', error);
  }
};

// Background sync for offline actions
export const registerBackgroundSync = async (tag, data = {}) => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Store data for sync
      if (data && Object.keys(data).length > 0) {
        const syncData = JSON.parse(localStorage.getItem('pwa-sync-data') || '[]');
        syncData.push({ tag, data, timestamp: Date.now() });
        localStorage.setItem('pwa-sync-data', JSON.stringify(syncData));
      }
      
      await registration.sync.register(tag);
      console.log('✅ TechDIVA PWA: Background sync registered:', tag);
    } catch (error) {
      console.error('❌ TechDIVA PWA: Background sync registration failed:', error);
    }
  }
};

// Cache management
export const clearPWACache = async () => {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ TechDIVA PWA: All caches cleared');
  } catch (error) {
    console.error('❌ TechDIVA PWA: Cache clearing failed:', error);
  }
};

// Get cache size
export const getCacheSize = async () => {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return {
      bytes: totalSize,
      mb: (totalSize / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('❌ TechDIVA PWA: Failed to calculate cache size:', error);
    return { bytes: 0, mb: '0.00' };
  }
};

// Analytics for PWA usage - FIXED: Safe gtag check
export const trackPWAUsage = () => {
  // Track PWA display mode
  const displayMode = getPWADisplayMode();
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'pwa_usage', {
      event_category: 'PWA',
      event_label: `Display Mode: ${displayMode}`,
      custom_parameter_1: displayMode
    });
  }
  
  // Track installation status
  if (isPWA()) {
    console.log('📱 TechDIVA PWA: Running as installed PWA');
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pwa_launch', {
        event_category: 'PWA',
        event_label: 'Launched as PWA'
      });
    }
  }
};

// Initialize PWA
export const initializePWA = () => {
  console.log('🎉 TechDIVA PWA: Initializing...');
  
  // Register service worker
  registerServiceWorker();
  
  // Track usage
  trackPWAUsage();
  
  // Set up viewport meta tag for better mobile experience
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);
  }
  
  // Add theme color meta tags
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#ff67c7';
    document.head.appendChild(themeColor);
  }
  
  console.log('✅ TechDIVA PWA: Initialization complete');
};

export default {
  registerServiceWorker,
  isPWA,
  getPWADisplayMode,
  requestNotificationPermission,
  showNotification,
  subscribeToPushNotifications,
  registerBackgroundSync,
  clearPWACache,
  getCacheSize,
  trackPWAUsage,
  initializePWA
};