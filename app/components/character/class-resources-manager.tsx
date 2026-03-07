'use client';

import { useState } from 'react';
import { Sparkles, Plus, Minus, RotateCcw, Moon, Coffee } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  type ClassResource,
  spendResource,
  recoverResource,
  recoverResourcesAfterRest,
} from '@/lib/data/class-resources';

interface ClassResourcesManagerProps {
  characterId: string;
  initialResources: ClassResource[];
}

const RECOVERY_LABELS: Record<string, string> = {
  short_rest: 'Descanso Curto',
  long_rest: 'Descanso Longo',
  dawn: 'Amanhecer',
  manual: 'Manual',
};

const RECOVERY_COLORS: Record<string, string> = {
  short_rest: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  long_rest: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  dawn: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  manual: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
};

export function ClassResourcesManager({
  characterId,
  initialResources,
}: ClassResourcesManagerProps) {
  const [resources, setResources] = useState<ClassResource[]>(initialResources);
  const [isSaving, setIsSaving] = useState(false);

  // Salvar no Supabase
  const saveResources = async (newResources: ClassResource[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ class_resources: newResources })
        .eq('id', characterId);

      if (error) throw error;
      setResources(newResources);
    } catch (err) {
      console.error('Erro ao salvar recursos:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Usar recurso (decrementar)
  const handleUseResource = (resourceId: string) => {
    const newResources = resources.map((r) => (r.id === resourceId ? spendResource(r, 1) : r));
    saveResources(newResources);
  };

  // Recuperar recurso (incrementar)
  const handleRecoverResource = (resourceId: string) => {
    const newResources = resources.map((r) => (r.id === resourceId ? recoverResource(r, 1) : r));
    saveResources(newResources);
  };

  // Reset completo de um recurso
  const handleResetResource = (resourceId: string) => {
    const newResources = resources.map((r) => (r.id === resourceId ? recoverResource(r) : r));
    saveResources(newResources);
  };

  // Descanso curto
  const handleShortRest = () => {
    const newResources = recoverResourcesAfterRest(resources, 'short');
    saveResources(newResources);
  };

  // Descanso longo
  const handleLongRest = () => {
    const newResources = recoverResourcesAfterRest(resources, 'long');
    saveResources(newResources);
  };

  if (resources.length === 0) {
    return (
      <div className="glass-card rounded-2xl border-dashed p-6">
        <div className="py-8 text-center">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-gray-400/50" />
          <p className="text-sm text-gray-400">
            Esta classe não possui recursos rastreáveis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5" />
            Recursos de Classe
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShortRest}
              disabled={isSaving}
              title="Descanso Curto"
            >
              <Coffee className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLongRest}
              disabled={isSaving}
              title="Descanso Longo"
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {resources.map((resource) => {
          const percentage = (resource.current / resource.max) * 100;
          const isLow = percentage < 30;
          const isEmpty = resource.current === 0;

          return (
            <div
              key={resource.id}
              className={`rounded-lg glass-card-light border p-4 transition-colors ${
                isEmpty ? 'border-red-400/50 bg-red-500/10' : 'border-white/10'
              }`}
            >
              {/* Header do Recurso */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{resource.name}</h4>
                    <Badge variant="secondary" className={RECOVERY_COLORS[resource.recovery]}>
                      {RECOVERY_LABELS[resource.recovery]}
                    </Badge>
                  </div>
                  {resource.description && (
                    <p className="mt-1 text-xs text-gray-400">{resource.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleResetResource(resource.id)}
                  disabled={isSaving || resource.current === resource.max}
                  title="Resetar para máximo"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Contador e Controles */}
              <div className="space-y-2">
                {/* Valor Atual / Máximo */}
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUseResource(resource.id)}
                    disabled={isSaving || resource.current === 0}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex min-w-[120px] items-center justify-center gap-1">
                    <span
                      className={`text-3xl font-bold transition-colors ${
                        isEmpty
                          ? 'text-red-400'
                          : isLow
                            ? 'text-amber-400'
                            : 'text-white'
                      }`}
                    >
                      {resource.current}
                    </span>
                    <span className="text-xl text-gray-400">/</span>
                    <span className="text-xl text-gray-400">{resource.max}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRecoverResource(resource.id)}
                    disabled={isSaving || resource.current >= resource.max}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Barra de Progresso */}
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Legenda de Descansos */}
        <div className="rounded-lg glass-card-light p-3 text-xs text-gray-400">
          <p className="mb-2 font-medium text-white">💤 Recuperação:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coffee className="h-3 w-3" />
              <span>Descanso Curto (1 hora) - recupera recursos de curto descanso</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="h-3 w-3" />
              <span>Descanso Longo (8 horas) - recupera todos os recursos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
