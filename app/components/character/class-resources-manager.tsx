'use client';

import { useState } from 'react';
import { Sparkles, Plus, Minus, RotateCcw, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  type ClassResource,
  spendResource,
  recoverResource,
  generateClassResources,
} from '@/lib/data/class-resources';

interface ClassResourcesManagerProps {
  characterId: string;
  initialResources: ClassResource[];
  characterClass: string;
  characterLevel: number;
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
  characterClass,
  characterLevel,
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

  // Gerar recursos da classe
  const handleGenerateResources = () => {
    const generatedResources = generateClassResources(characterClass, characterLevel);
    if (generatedResources.length > 0) {
      saveResources(generatedResources);
    } else {
      alert(
        `A classe ${characterClass} não possui recursos rastreáveis no nível ${characterLevel}.`
      );
    }
  };

  if (resources.length === 0) {
    return (
      <div className="glass-card rounded-2xl border-dashed p-6">
        <div className="py-8 text-center space-y-4">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-gray-400/50" />
          <p className="text-sm text-gray-400">Nenhum recurso de classe encontrado</p>
          <Button onClick={handleGenerateResources} disabled={isSaving} className="tab-purple">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isSaving ? 'Gerando...' : 'Gerar Recursos de Classe'}
          </Button>
          <p className="text-xs text-gray-500">
            Clique para inicializar os recursos baseados em sua classe ({characterClass}) e nível (
            {characterLevel})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5" />
          Recursos de Classe
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          💤 Use os botões de descanso em &quot;Pontos de Vida&quot; para recuperar recursos
        </p>
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
                        isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'
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

        {/* Dica sobre recuperação */}
        <div className="rounded-lg glass-card-light p-3 text-xs text-gray-400">
          <p className="mb-2 font-medium text-white">💡 Dica:</p>
          <p>
            Para recuperar recursos durante descansos curtos ou longos, use os botões de descanso no
            card &quot;Pontos de Vida&quot; acima. Eles recuperam automaticamente HP, recursos de
            classe, spell slots e dados de vida.
          </p>
        </div>
      </div>
    </div>
  );
}
