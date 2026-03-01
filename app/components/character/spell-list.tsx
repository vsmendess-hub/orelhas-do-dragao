'use client';

import { useState } from 'react';
import { Sparkles, Edit, Trash2, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  type Spell,
  type SpellLevel,
  getSpellLevelName,
  getSchoolColor,
  formatSpellComponents,
} from '@/lib/data/spells';

interface SpellListProps {
  spells: Spell[];
  isPreparingCaster: boolean;
  onAddSpell: () => void;
  onEditSpell: (spell: Spell) => void;
  onDeleteSpell: (spellId: string) => void;
  onTogglePrepared?: (spellId: string) => void;
}

export function SpellList({
  spells,
  isPreparingCaster,
  onAddSpell,
  onEditSpell,
  onDeleteSpell,
  onTogglePrepared,
}: SpellListProps) {
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Agrupar magias por nível
  const spellsByLevel: Record<SpellLevel, Spell[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  };

  spells.forEach((spell) => {
    spellsByLevel[spell.level].push(spell);
  });

  // Filtrar magias
  const filterSpells = (levelSpells: Spell[]) => {
    let filtered = levelSpells;

    if (filterSchool !== 'all') {
      filtered = filtered.filter((spell) => spell.school === filterSchool);
    }

    return filtered;
  };

  // Toggle expandir descrição
  const toggleExpand = (spellId: string) => {
    setExpandedSpell(expandedSpell === spellId ? null : spellId);
  };

  // Renderizar card de magia
  const renderSpellCard = (spell: Spell) => {
    const isExpanded = expandedSpell === spell.id;

    return (
      <Card key={spell.id} className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{spell.name}</CardTitle>
                {isPreparingCaster && spell.prepared && (
                  <Badge variant="secondary" className="text-xs">
                    Preparada
                  </Badge>
                )}
                {spell.concentration === 'Sim' && (
                  <Badge variant="outline" className="text-xs">
                    Concentração
                  </Badge>
                )}
                {spell.ritual === 'Sim' && (
                  <Badge variant="outline" className="text-xs">
                    Ritual
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">
                <span className={getSchoolColor(spell.school)}>{spell.school}</span>
                {spell.source && <span className="ml-2 text-xs">• {spell.source}</span>}
              </CardDescription>
            </div>

            {/* Ações */}
            <div className="flex gap-1">
              {isPreparingCaster && onTogglePrepared && spell.level > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePrepared(spell.id)}
                  className="h-8 w-8 p-0"
                  title={spell.prepared ? 'Despreparar' : 'Preparar'}
                >
                  <Sparkles
                    className={`h-4 w-4 ${spell.prepared ? 'fill-yellow-500 text-yellow-500' : ''}`}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSpell(spell)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSpell(spell.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pt-0">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Tempo:</span> {spell.castingTime}
            </div>
            <div>
              <span className="font-medium">Alcance:</span> {spell.range}
            </div>
            <div>
              <span className="font-medium">Componentes:</span>{' '}
              {formatSpellComponents(spell.components)}
            </div>
            <div>
              <span className="font-medium">Duração:</span> {spell.duration}
            </div>
          </div>

          {/* Descrição (colapsável) */}
          <div>
            <button
              onClick={() => toggleExpand(spell.id)}
              className="w-full text-left text-sm hover:underline"
            >
              {isExpanded ? '▼ Ocultar descrição' : '▶ Ver descrição'}
            </button>
            {isExpanded && (
              <div className="mt-2 space-y-2 text-sm">
                <p>{spell.description}</p>
                {spell.higherLevels && (
                  <div className="rounded-md bg-muted/50 p-2">
                    <p className="font-medium">Em Níveis Superiores:</p>
                    <p className="mt-1">{spell.higherLevels}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Contar magias por filtro
  const totalSpells = spells.length;
  const cantripsCount = spellsByLevel[0].length;
  const leveled = spells.filter((s) => s.level > 0).length;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Grimório de Magias
          </CardTitle>
          <CardDescription>
            {totalSpells} {totalSpells === 1 ? 'magia conhecida' : 'magias conhecidas'} •{' '}
            {cantripsCount} {cantripsCount === 1 ? 'truque' : 'truques'} • {leveled} com nível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="rounded-md border bg-background px-3 py-1 text-sm"
            >
              <option value="all">Todas as Escolas</option>
              <option value="Abjuração">Abjuração</option>
              <option value="Adivinhação">Adivinhação</option>
              <option value="Conjuração">Conjuração</option>
              <option value="Encantamento">Encantamento</option>
              <option value="Evocação">Evocação</option>
              <option value="Ilusão">Ilusão</option>
              <option value="Necromancia">Necromancia</option>
              <option value="Transmutação">Transmutação</option>
            </select>

            <Button onClick={onAddSpell} size="sm" className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Magia
            </Button>
          </div>

          {/* Info sobre preparação */}
          {isPreparingCaster && (
            <div className="rounded-lg border bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-950/20 dark:text-blue-200">
              💡 <strong>Preparação de Magias:</strong> Clique no ícone ✨ para marcar magias como
              preparadas. Você pode preparar um número limitado de magias por dia.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista vazia */}
      {totalSpells === 0 && (
        <Card className="text-center">
          <CardContent className="py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg font-medium">Nenhuma magia conhecida</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece adicionando magias ao seu grimório
            </p>
            <Button onClick={onAddSpell} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeira Magia
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Magias por nível */}
      {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as SpellLevel[]).map((level) => {
        const levelSpells = filterSpells(spellsByLevel[level]);
        if (levelSpells.length === 0) return null;

        return (
          <div key={level} className="space-y-3">
            <h3 className="text-lg font-semibold">
              {getSpellLevelName(level)}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({levelSpells.length})
              </span>
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {levelSpells.map((spell) => renderSpellCard(spell))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
