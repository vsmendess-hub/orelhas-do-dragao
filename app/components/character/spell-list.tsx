'use client';

import { Check, Circle } from 'lucide-react';
import type { CharacterSpell } from '@/lib/data/spells';

interface SpellListProps {
  spells: CharacterSpell[];
  showPrepared: boolean;
}

export function SpellList({ spells, showPrepared }: SpellListProps) {
  return (
    <div className="space-y-2">
      {spells.map((spell) => (
        <div
          key={spell.spellId}
          className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            {showPrepared && (
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  spell.prepared
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-muted-foreground'
                }`}
              >
                {spell.prepared && <Check className="h-4 w-4" />}
              </div>
            )}
            <div>
              <p className="font-medium">{spell.spellName}</p>
              {spell.alwaysPrepared && (
                <p className="text-xs text-muted-foreground">Sempre preparada</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
