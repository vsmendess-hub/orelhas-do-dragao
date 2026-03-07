'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Fantasy Background */}
      <div className="fantasy-bg" />
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/originals/a1/5d/0e/a15d0e8c4f4f8b8c4f4f8b8c4f4f8b8c.jpg)',
          filter: 'blur(3px)',
        }}
      />

      <div className="container mx-auto px-4">
        <div className="glass-card rounded-3xl p-12 max-w-2xl mx-auto text-center border-2 border-dashed border-purple-500/30">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/20">
            <WifiOff className="h-12 w-12 text-purple-400" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Você está Offline
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8">
            Parece que você perdeu a conexão com a internet. Algumas funcionalidades podem estar limitadas.
          </p>

          {/* Features Available Offline */}
          <div className="glass-card-light rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-4">
              📱 Disponível Offline:
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Visualizar fichas de personagens já carregadas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Rolar dados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Ver magias e inventário (dados em cache)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">⚠</span>
                Edições serão sincronizadas quando voltar online
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full tab-purple"
              size="lg"
            >
              Tentar Reconectar
            </Button>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Voltar
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-8 text-sm text-gray-400">
            <p>💡 Dica: Instale o app para melhor experiência offline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
