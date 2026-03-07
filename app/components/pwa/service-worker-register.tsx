'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Service worker registered:', reg);
        setRegistration(reg);

        // Check for updates every hour
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New update available
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker activated');
      // Optionally reload to use new service worker
      if (updateAvailable) {
        window.location.reload();
      }
    });

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Back online');
      // Trigger sync if available
      if (registration && 'sync' in registration) {
        registration.sync.register('sync-characters').catch((error) => {
          console.error('Background sync registration failed:', error);
        });
      }
    };

    const handleOffline = () => {
      console.log('Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [registration, updateAvailable]);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the service worker to skip waiting and take control
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <div className="glass-card rounded-2xl p-4 border-2 border-blue-500/50 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">Atualização Disponível</h3>
            <p className="text-sm text-gray-400 mt-1">
              Uma nova versão do app está pronta!
            </p>

            <Button
              onClick={handleUpdate}
              className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
