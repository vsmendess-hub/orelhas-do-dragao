'use client';

import { useState } from 'react';
import { Sparkles, BookMarked, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  type Spell,
  getSpellLevelName,
  getSchoolColor,
  isPreparingCaster,
  calculatePreparedSpells,
} from '@/lib/data/spells';

interface SpellPreparationProps {
  characterId: string;
  characterClass: string;
  characterLevel: number;
  spellcastingModifier: number;
  spells: Spell[];
  onSpellsUpdate: (spells: Spell[]) => void;
}

export function SpellPreparation({
  characterId,
  characterClass,
  characterLevel,
  spellcastingModifier,
  spells,
  onSpellsUpdate,
}: SpellPreparationProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se é classe que prepara magias
  const canPrepareSpells = isPreparingCaster(characterClass);

  if (!canPrepareSpells) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            Preparação de Magias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-8 text-center">
            <BookMarked className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-medium">Sistema de Conjuração Espontânea</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {characterClass} não precisa preparar magias. Você pode conjurar qualquer magia
              conhecida usando seus espaços de magia disponíveis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular limite de preparação
  const maxPrepared = calculatePreparedSpells(spellcastingModifier, characterLevel);

  // Filtrar magias por nível (truques não precisam ser preparados)
  const cantrips = spells.filter((s) => s.level === 0);
  const leveledSpells = spells.filter((s) => s.level > 0);

  // Contar preparadas
  const preparedCount = leveledSpells.filter((s) => s.prepared).length;
  const canPrepareMore = preparedCount < maxPrepared;

  // Toggle preparação
  const togglePrepared = async (spellId: string) => {
    const spell = spells.find((s) => s.id === spellId);
    if (!spell || spell.level === 0) return;

    // Verificar limite ao preparar
    if (!spell.prepared && !canPrepareMore) {
      setError('Você já atingiu o limite de magias preparadas');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Atualizar lista
      const updatedSpells = spells.map((s) =>
        s.id === spellId ? { ...s, prepared: !s.prepared } : s
      );

      // Salvar no Supabase
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ spells: updatedSpells })
        .eq('id', characterId);

      if (updateError) throw updateError;

      // Atualizar estado
      onSpellsUpdate(updatedSpells);
    } catch (err) {
      console.error('Erro ao atualizar preparação:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Preparar todas (até o limite)
  const prepareAll = async () => {
    try {
      setIsSaving(true);
      setError(null);

      let prepared = 0;
      const updatedSpells = spells.map((s) => {
        if (s.level === 0) return s; // Truques não contam

        if (prepared < maxPrepared) {
          prepared++;
          return { ...s, prepared: true };
        }
        return { ...s, prepared: false };
      });

      // Salvar no Supabase
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ spells: updatedSpells })
        .eq('id', characterId);

      if (updateError) throw updateError;

      onSpellsUpdate(updatedSpells);
    } catch (err) {
      console.error('Erro ao preparar todas:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Despreparar todas
  const unprepareAll = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updatedSpells = spells.map((s) => ({ ...s, prepared: false }));

      // Salvar no Supabase
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ spells: updatedSpells })
        .eq('id', characterId);

      if (updateError) throw updateError;

      onSpellsUpdate(updatedSpells);
    } catch (err) {
      console.error('Erro ao despreparar todas:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Preparação de Magias
            </CardTitle>
            <CardDescription>
              {preparedCount} de {maxPrepared} magias preparadas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={unprepareAll}
              disabled={isSaving || preparedCount === 0}
              variant="outline"
              size="sm"
            >
              Limpar Tudo
            </Button>
            <Button
              onClick={prepareAll}
              disabled={isSaving || leveledSpells.length === 0}
              variant="outline"
              size="sm"
            >
              Preparar Até Limite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informação sobre preparação */}
        <div className="rounded-lg border bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/20 dark:text-blue-200">
          <p className="font-medium">📖 Como funciona a preparação:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>
              • Você pode preparar{' '}
              <strong>
                {maxPrepared} {maxPrepared === 1 ? 'magia' : 'magias'}
              </strong>{' '}
              (modificador {spellcastingModifier > 0 ? '+' : ''}
              {spellcastingModifier} + nível {characterLevel})
            </li>
            <li>• Truques não precisam ser preparados e podem ser usados livremente</li>
            <li>• Você pode mudar suas magias preparadas após um descanso longo</li>
            <li>• Só magias preparadas podem ser conjuradas (exceto truques)</li>
          </ul>
        </div>

        {/* Truques (sempre disponíveis) */}
        {cantrips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Truques (Sempre Disponíveis)
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {cantrips.map((spell) => (
                <div
                  key={spell.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2"
                >
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{spell.name}</p>
                    <p className={`text-xs ${getSchoolColor(spell.school)}`}>{spell.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Magias com níveis (precisam preparação) */}
        {leveledSpells.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Magias Conhecidas (Clique para Preparar)
            </h4>
            <div className="space-y-2">
              {leveledSpells.map((spell) => (
                <button
                  key={spell.id}
                  onClick={() => togglePrepared(spell.id)}
                  disabled={isSaving || (!spell.prepared && !canPrepareMore)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                    spell.prepared ? 'border-deep-purple bg-deep-purple/5' : 'hover:bg-muted/50'
                  } ${!spell.prepared && !canPrepareMore ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        spell.prepared
                          ? 'bg-deep-purple text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {spell.prepared ? (
                        <Sparkles className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-bold">{spell.level}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{spell.name}</p>
                        {spell.prepared && (
                          <Badge variant="secondary" className="text-xs">
                            Preparada
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getSpellLevelName(spell.level)}</span>
                        <span>•</span>
                        <span className={getSchoolColor(spell.school)}>{spell.school}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {spell.prepared ? '✓' : 'Clique para preparar'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <BookMarked className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-medium">Nenhuma magia conhecida</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Adicione magias ao seu grimório para poder prepará-las
            </p>
          </div>
        )}

        {/* Aviso de limite atingido */}
        {!canPrepareMore && leveledSpells.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Limite de preparação atingido</p>
              <p className="mt-1 text-xs">
                Você já preparou o máximo de magias permitido. Despreparar uma magia para preparar
                outra.
              </p>
            </div>
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
