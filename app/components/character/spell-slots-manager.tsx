'use client';

import { useState } from 'react';
import { Moon, RefreshCw, Loader2, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type SpellSlots,
  type SpellLevel,
  getSpellLevelName,
  restoreAllSlots,
} from '@/lib/data/spells';

interface SpellSlotsManagerProps {
  characterId: string;
  initialSlots: SpellSlots;
}

export function SpellSlotsManager({ characterId, initialSlots }: SpellSlotsManagerProps) {
  const [slots, setSlots] = useState<SpellSlots>(initialSlots);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Salvar slots no Supabase
  const saveSlots = async (newSlots: SpellSlots) => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ spell_slots: newSlots })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setSlots(newSlots);
    } catch (err) {
      console.error('Erro ao salvar slots:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Marcar/desmarcar slot usado
  const toggleSlot = (level: SpellLevel) => {
    if (level === 0) return; // Truques são ilimitados

    const slotKey = `level${level}` as keyof SpellSlots;
    const currentSlot = slots[slotKey];

    // Se todos estão usados, volta para 0
    if (currentSlot.used >= currentSlot.total) {
      const newSlots = {
        ...slots,
        [slotKey]: { ...currentSlot, used: 0 },
      };
      saveSlots(newSlots);
    } else {
      // Incrementa usado
      const newSlots = {
        ...slots,
        [slotKey]: { ...currentSlot, used: currentSlot.used + 1 },
      };
      saveSlots(newSlots);
    }
  };

  // Descanso longo (restaurar todos)
  const handleLongRest = async () => {
    const restoredSlots = restoreAllSlots(slots);
    await saveSlots(restoredSlots);
  };

  // Verificar se tem algum slot
  const hasAnySlots = Object.keys(slots).some((key) => {
    const slot = slots[key as keyof SpellSlots];
    return slot.total > 0;
  });

  // Calcular total de slots usados e disponíveis
  const totalSlotsUsed = Object.keys(slots).reduce((sum, key) => {
    return sum + slots[key as keyof SpellSlots].used;
  }, 0);

  const totalSlotsAvailable = Object.keys(slots).reduce((sum, key) => {
    return sum + slots[key as keyof SpellSlots].total;
  }, 0);

  // Renderizar slots de um nível
  const renderLevelSlots = (level: SpellLevel) => {
    if (level === 0) return null; // Truques não têm slots

    const slotKey = `level${level}` as keyof SpellSlots;
    const slot = slots[slotKey];

    if (slot.total === 0) return null; // Nível sem slots

    const available = slot.total - slot.used;

    return (
      <div
        key={level}
        className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-purple/10 font-bold text-deep-purple">
            {level}
          </div>
          <div>
            <p className="font-medium">{getSpellLevelName(level)}</p>
            <p className="text-xs text-muted-foreground">
              {available} de {slot.total} disponíveis
            </p>
          </div>
        </div>

        {/* Visualização de slots */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: slot.total }).map((_, index) => {
              const isUsed = index < slot.used;
              return (
                <button
                  key={index}
                  onClick={() => toggleSlot(level)}
                  disabled={isSaving}
                  className={`h-8 w-8 rounded-md border-2 transition-colors ${
                    isUsed
                      ? 'border-gray-400 bg-gray-400 dark:border-gray-600 dark:bg-gray-600'
                      : 'border-deep-purple bg-deep-purple hover:bg-deep-purple/80'
                  }`}
                  title={isUsed ? 'Slot usado' : 'Slot disponível'}
                >
                  <Zap className={`h-4 w-4 ${isUsed ? 'text-white opacity-30' : 'text-white'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Espaços de Magia
            </CardTitle>
            <CardDescription>
              {totalSlotsAvailable - totalSlotsUsed} de {totalSlotsAvailable} espaços disponíveis
            </CardDescription>
          </div>
          <Button
            onClick={handleLongRest}
            disabled={isSaving || totalSlotsUsed === 0}
            variant="outline"
            size="sm"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Descanso Longo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slots por nível */}
        {hasAnySlots ? (
          <div className="space-y-2">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9] as SpellLevel[]).map((level) => renderLevelSlots(level))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Zap className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-medium">Nenhum espaço de magia disponível</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Este personagem não possui espaços de magia ou ainda não foram configurados
            </p>
          </div>
        )}

        {/* Informação sobre uso */}
        {hasAnySlots && (
          <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">💡 Como usar:</p>
            <ul className="mt-2 space-y-1">
              <li>• Clique em um slot ⚡ para marcá-lo como usado</li>
              <li>• Clique novamente no nível para restaurar todos os slots daquele nível</li>
              <li>
                • Use <strong>Descanso Longo</strong> para restaurar todos os espaços de uma vez
              </li>
            </ul>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            ⚠️ {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
