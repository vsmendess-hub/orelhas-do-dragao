'use client';

import { RotateCcw, Plus, Minus } from 'lucide-react';
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

  const spendSlot = (level: number) => {
    const newSlots = spellSlots.map((slot) => {
      if (slot.level === level && slot.used < slot.total) {
        return { ...slot, used: slot.used + 1 };
      }
      return slot;
    });
    saveSpellSlots(newSlots);
  };

  const recoverSlot = (level: number) => {
    const newSlots = spellSlots.map((slot) => {
      if (slot.level === level && slot.used > 0) {
        return { ...slot, used: slot.used - 1 };
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Espaços de Magia</CardTitle>
            <CardDescription>Gerencie seus espaços de magia disponíveis</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetAllSlots}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {spellSlots.map((slot) => {
            const available = slot.total - slot.used;
            const isEmpty = available === 0;

            return (
              <div
                key={slot.level}
                className={`rounded-lg border-2 p-4 transition-colors ${
                  isEmpty ? 'border-red-400/50 bg-red-500/10' : 'border-border'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Círculo {slot.level}º</span>
                  <span className="text-xs text-muted-foreground">Total: {slot.total}</span>
                </div>

                <div className="mb-3 text-center">
                  <span
                    className={`text-3xl font-bold ${isEmpty ? 'text-red-500' : 'text-purple-600'}`}
                  >
                    {available}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">disponíveis</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => spendSlot(slot.level)}
                    disabled={slot.used >= slot.total}
                    className="flex-1"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => recoverSlot(slot.level)}
                    disabled={slot.used === 0}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
