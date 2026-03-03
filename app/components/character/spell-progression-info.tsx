'use client';

import { Wand2, Sparkles, BookOpen, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getSpellSlots,
  isSpellcaster,
  getCantripsKnown,
  getSpellsKnown,
  getMaxSpellLevel,
  CASTER_TYPE,
} from '@/lib/data/spell-progression';

interface SpellProgressionInfoProps {
  characterClass: string;
  currentLevel: number;
}

export function SpellProgressionInfo({ characterClass, currentLevel }: SpellProgressionInfoProps) {
  if (!isSpellcaster(characterClass)) {
    return null;
  }

  const spellSlots = getSpellSlots(characterClass, currentLevel);
  const cantripsKnown = getCantripsKnown(characterClass, currentLevel);
  const spellsKnown = getSpellsKnown(characterClass, currentLevel);
  const maxSpellLevel = getMaxSpellLevel(characterClass, currentLevel);
  const casterType = CASTER_TYPE[characterClass];

  const casterTypeLabels: Record<string, string> = {
    'full-caster': 'Conjurador Completo',
    'half-caster': 'Meio Conjurador',
    'third-caster': 'Um Terço Conjurador',
    warlock: 'Pact Magic',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Progressão de Magias
          </CardTitle>
          <Badge variant="secondary">{casterTypeLabels[casterType] || casterType}</Badge>
        </div>
        <CardDescription>Nível {currentLevel} - Slots e capacidades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cantrips */}
        {cantripsKnown > 0 && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Cantrips Conhecidos</span>
              </div>
              <Badge>{cantripsKnown}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Magias de nível 0 - uso ilimitado</p>
          </div>
        )}

        {/* Spells Known */}
        {spellsKnown !== null && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Magias Conhecidas</span>
              </div>
              <Badge>{spellsKnown}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total de magias que você pode conhecer
            </p>
          </div>
        )}

        {/* Prepared Spells Info */}
        {spellsKnown === null && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-blue-900 dark:text-blue-100">Magias Preparadas</p>
                <p className="mt-1 text-blue-700 dark:text-blue-300">
                  {characterClass === 'Mago' &&
                    'Como Mago, você pode preparar magias do seu grimório.'}
                  {characterClass === 'Clérigo' &&
                    'Como Clérigo, você pode preparar magias da lista de clérigo.'}
                  {characterClass === 'Druida' &&
                    'Como Druida, você pode preparar magias da lista de druida.'}
                  {characterClass === 'Paladino' &&
                    'Como Paladino, você pode preparar magias da lista de paladino.'}
                  {!['Mago', 'Clérigo', 'Druida', 'Paladino'].includes(characterClass) &&
                    'Você pode preparar um número de magias igual ao seu modificador de atributo + nível.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Spell Slots */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium">Espaços de Magia por Círculo</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(spellSlots).map(([level, slots]) => (
              <div key={level} className="rounded-md border bg-card p-2 text-center">
                <p className="text-xs text-muted-foreground">Círculo {level}º</p>
                <p className="text-xl font-bold text-purple-600">{slots}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Max Spell Level */}
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-3 text-center dark:border-purple-900 dark:bg-purple-950/20">
          <p className="text-sm text-muted-foreground">Círculo Máximo Disponível</p>
          <p className="text-3xl font-bold text-purple-600">{maxSpellLevel}º</p>
        </div>

        {/* Warlock Special */}
        {casterType === 'warlock' && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-900 dark:bg-purple-950/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-purple-600" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-purple-900 dark:text-purple-100">Pact Magic</p>
                <p className="mt-1 text-purple-700 dark:text-purple-300">
                  Seus espaços de magia são todos do círculo máximo e se recuperam em descanso
                  curto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">💡 Dica:</p>
          <p className="mt-1">
            Use a página de <strong>Magias</strong> para gerenciar suas magias preparadas/conhecidas
            e rastrear espaços de magia gastos durante aventuras.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
