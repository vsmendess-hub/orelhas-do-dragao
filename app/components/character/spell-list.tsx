'use client';

import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CharacterSpell, SpellSlotState } from '@/lib/data/spells';
import { SpellUpcastCalculator, UpcastBadge } from './spell-upcast-calculator';

interface SpellListProps {
  spells: CharacterSpell[];
  showPrepared: boolean;
  favorites?: string[]; // Array de spell IDs favoritos
  onToggleFavorite?: (spell: CharacterSpell) => void;
  spellSlots?: SpellSlotState[]; // Para upcast calculator
  onCastSpell?: (spellId: string, castAtLevel: number) => void;
}

export function SpellList({
  spells,
  showPrepared,
  favorites = [],
  onToggleFavorite,
  spellSlots = [],
  onCastSpell,
}: SpellListProps) {
  return (
    <div className="space-y-2">
      {spells.map((spell) => {
        const isFavorite = favorites.includes(spell.spellId);

        return (
          <div
            key={spell.spellId}
            className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-accent"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {showPrepared && (
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                    spell.prepared
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-muted-foreground'
                  }`}
                >
                  {spell.prepared && <Check className="h-4 w-4" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{spell.spellName}</p>
                  <UpcastBadge spellId={spell.spellId} spellLevel={spell.spellLevel} />
                </div>
                {spell.alwaysPrepared && (
                  <p className="text-xs text-muted-foreground">Sempre preparada</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {spellSlots.length > 0 && onCastSpell && (
                <SpellUpcastCalculator
                  spellId={spell.spellId}
                  spellName={spell.spellName}
                  spellLevel={spell.spellLevel}
                  spellSlots={spellSlots}
                  onCast={(level) => onCastSpell(spell.spellId, level)}
                />
              )}
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(spell)}
                  title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star
                    className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                  />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
