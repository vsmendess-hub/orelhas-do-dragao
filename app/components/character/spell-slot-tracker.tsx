'use client';

import { Circle, CircleDot, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import type { SpellSlotState } from '@/lib/data/spells';

interface SpellSlotTrackerProps {
  characterId: string;
  spellSlots: SpellSlotState[];
  onUpdate: (slots: SpellSlotState[]) => void;
}

export function SpellSlotTracker({ characterId, spellSlots, onUpdate }: SpellSlotTrackerProps) {
  const saveSpellSlots = async (newSlots: SpellSlotState[]) => {
    try {
      const supabase = createClient();
      await supabase.from('characters').update({ spell_slots: newSlots }).eq('id', characterId);
      onUpdate(newSlots);
    } catch (err) {
      console.error('Erro ao salvar spell slots:', err);
    }
  };

  const toggleSlot = (level: number, index: number) => {
    const newSlots = spellSlots.map((slot) => {
      if (slot.level === level) {
        const currentUsed = slot.used;
        const targetUsed = index + 1;

        return {
          ...slot,
          used: currentUsed === targetUsed ? targetUsed - 1 : targetUsed,
        };
      }
      return slot;
    });

    saveSpellSlots(newSlots);
  };

  const resetAllSlots = () => {
    const newSlots = spellSlots.map((slot) => ({ ...slot, used: 0 }));
    saveSpellSlots(newSlots);
  };

  if (spellSlots.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Espaços de Magia</CardTitle>
            <CardDescription>Clique para marcar como usado/disponível</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetAllSlots}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {spellSlots.map((slot) => (
            <div key={slot.level} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Círculo {slot.level}º</span>
                <span className="text-xs text-muted-foreground">
                  {slot.total - slot.used}/{slot.total} disponíveis
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: slot.total }).map((_, index) => {
                  const isUsed = index < slot.used;
                  return (
                    <button
                      key={index}
                      onClick={() => toggleSlot(slot.level, index)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                        isUsed
                          ? 'border-muted bg-muted text-muted-foreground'
                          : 'border-purple-600 bg-purple-600 text-white'
                      }`}
                      title={isUsed ? 'Usado' : 'Disponível'}
                    >
                      {isUsed ? <Circle className="h-5 w-5" /> : <CircleDot className="h-5 w-5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
