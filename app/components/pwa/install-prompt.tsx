'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;

      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkInstallation()) {
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        setIsInstalled(true);
      } else {
        console.log('PWA installation dismissed');
      }

      setShowPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  // Don't show if installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <div className="glass-card rounded-2xl p-4 border-2 border-purple-500/50 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex-shrink-0">
            <Download className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">Instalar App</h3>
            <p className="text-sm text-gray-400 mt-1">
              Instale Orelhas do Dragão para acesso rápido e uso offline!
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleInstallClick}
                className="flex-1 tab-purple"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Instalar
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* iOS Install Instructions */}
        {/iPhone|iPad|iPod/.test(navigator.userAgent) && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-400">
              📱 No iOS: Toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela Inicial</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
