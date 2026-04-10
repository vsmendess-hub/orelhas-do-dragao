'use client';

import { useState } from 'react';
import { Check, Star, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CharacterSpell, SpellSlotState } from '@/lib/data/spells';
import { SpellUpcastCalculator, UpcastBadge } from './spell-upcast-calculator';
import { getSpellById } from '@/lib/data/all-spells';
import { formatComponents } from '@/lib/data/spells';

interface SpellListProps {
  spells: CharacterSpell[];
  showPrepared: boolean;
  favorites?: string[]; // Array de spell IDs favoritos
  onToggleFavorite?: (spell: CharacterSpell) => void;
  onRemoveSpell?: (spellId: string) => void;
  spellSlots?: SpellSlotState[]; // Para upcast calculator
  onCastSpell?: (spellId: string, castAtLevel: number) => void;
}

export function SpellList({
  spells,
  showPrepared,
  favorites = [],
  onToggleFavorite,
  onRemoveSpell,
  spellSlots = [],
  onCastSpell,
}: SpellListProps) {
  const [expandedSpells, setExpandedSpells] = useState<Set<string>>(new Set());

  const toggleExpand = (spellId: string) => {
    setExpandedSpells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spellId)) {
        newSet.delete(spellId);
      } else {
        newSet.add(spellId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      {spells.map((spell) => {
        const isFavorite = favorites.includes(spell.spellId);
        const isExpanded = expandedSpells.has(spell.spellId);
        const spellDetails = getSpellById(spell.spellId);

        return (
          <div key={spell.spellId} className="rounded-lg border bg-card overflow-hidden">
            {/* Header da Magia */}
            <div className="flex items-center justify-between p-3 hover:bg-accent transition-colors">
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

                <button
                  onClick={() => toggleExpand(spell.spellId)}
                  className="flex-1 min-w-0 text-left flex items-center gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{spell.spellName}</p>
                      <UpcastBadge spellId={spell.spellId} spellLevel={spell.spellLevel} />
                      {spellDetails?.source && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {spellDetails.source}
                        </Badge>
                      )}
                    </div>
                    {spell.alwaysPrepared && (
                      <p className="text-xs text-muted-foreground">Sempre preparada</p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {spellSlots.length > 0 && onCastSpell && spell.spellLevel > 0 && (
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
                {onRemoveSpell && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Remover ${spell.spellName}?`)) {
                        onRemoveSpell(spell.spellId);
                      }
                    }}
                    title="Remover magia"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Detalhes Expandidos */}
            {isExpanded && spellDetails && (
              <div className="border-t bg-accent/50 p-4 space-y-3">
                {/* Informações da Magia */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold">Tempo:</span> {spellDetails.castingTime}
                  </div>
                  <div>
                    <span className="font-semibold">Alcance:</span> {spellDetails.range}
                  </div>
                  <div>
                    <span className="font-semibold">Duração:</span> {spellDetails.duration}
                  </div>
                  <div>
                    <span className="font-semibold">Componentes:</span>{' '}
                    {formatComponents(spellDetails.components)}
                  </div>
                </div>

                {/* Descrição */}
                <div className="text-sm">
                  <p>{spellDetails.description}</p>
                </div>

                {/* Em Níveis Superiores */}
                {spellDetails.atHigherLevels && (
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-sm">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      Em Níveis Superiores:
                    </p>
                    <p className="text-muted-foreground">{spellDetails.atHigherLevels}</p>
                  </div>
                )}

                {/* Referência do Livro */}
                {spellDetails.source && spellDetails.page && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <BookOpen className="h-3 w-3" />
                    <span>
                      <strong>Referência:</strong> {spellDetails.source}, página {spellDetails.page}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
