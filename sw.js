// Service Worker for PWA functionality
const CACHE_NAME = 'devportfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/about.html',
    '/projects.html',
    '/services.html',
    '/blog.html',
    '/contact.html',
    '/styles.css',
    '/script.js',
    '/js/translations.js',
    '/images/hero-bg.svg',
    '/images/profile.svg',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }
                
                // Otherwise fetch from network
                return fetch(request)
                    .then(response => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for caching
                        const responseToCache = response.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('Service Worker: Network request failed', error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Return cached version if available
                        return caches.match(request);
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(syncContactForm());
    }
});

// Sync contact form data when online
async function syncContactForm() {
    try {
        const formData = await getStoredFormData();
        if (formData) {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                console.log('Service Worker: Form data synced successfully');
                await clearStoredFormData();
            }
        }
    } catch (error) {
        console.error('Service Worker: Sync failed', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Yeni bir güncelleme mevcut!',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Portfolio\'yu Gör',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Kapat',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('DevPortfolio', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urlsToCache = event.data.urls;
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(urlsToCache))
        );
    }
});

// Utility functions for form data storage
async function getStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/stored-form-data');
        if (response) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error getting stored form data:', error);
    }
    return null;
}

async function clearStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/stored-form-data');
    } catch (error) {
        console.error('Error clearing stored form data:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Sync latest blog posts, projects, etc.
        console.log('Service Worker: Periodic sync triggered');
        
        const response = await fetch('/api/sync');
        if (response.ok) {
            const data = await response.json();
            // Update cache with new content
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put('/api/sync', response);
        }
    } catch (error) {
        console.error('Service Worker: Periodic sync failed', error);
    }
}

console.log('Service Worker: Loaded successfully');
