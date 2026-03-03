'use client';

import { useState } from 'react';
import { Wand2, Plus, Sparkles, BookOpen, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
  calculatePreparedSpellsLimit,
  groupSpellsByLevel,
  countPreparedSpells,
  type CharacterSpell,
  type SpellSlotState,
} from '@/lib/data/spells';
import { getSpellSlots, getCantripsKnown, getSpellsKnown } from '@/lib/data/spell-progression';
import { formatModifier } from '@/lib/data/point-buy';
import { SpellSlotTracker } from './spell-slot-tracker';
import { SpellList } from './spell-list';
import { SpellFavoritesPanel } from './spell-favorites-panel';
import {
  type SpellFavorite,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from '@/lib/data/spell-favorites';
import { createClient } from '@/lib/supabase/client';

interface SpellManagerProps {
  characterId: string;
  characterClass: string;
  characterLevel: number;
  proficiencyBonus: number;
  spellcastingAbility: 'int' | 'wis' | 'cha' | null;
  spellcastingModifier: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  initialSpells: CharacterSpell[];
  initialSpellSlots: SpellSlotState[];
  initialFavorites?: SpellFavorite[];
}

const ABILITY_LABELS: Record<string, string> = {
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
};

export function SpellManager({
  characterId,
  characterClass,
  characterLevel,
  proficiencyBonus,
  spellcastingAbility,
  spellcastingModifier,
  attributes,
  initialSpells,
  initialSpellSlots,
  initialFavorites = [],
}: SpellManagerProps) {
  const [spells] = useState<CharacterSpell[]>(initialSpells);
  const [favorites, setFavorites] = useState<SpellFavorite[]>(initialFavorites);

  // Calcular stats
  const spellSaveDC = calculateSpellSaveDC(proficiencyBonus, spellcastingModifier);
  const spellAttackBonus = calculateSpellAttackBonus(proficiencyBonus, spellcastingModifier);
  const preparedLimit = calculatePreparedSpellsLimit(
    characterClass,
    characterLevel,
    spellcastingModifier
  );
  const preparedCount = countPreparedSpells(spells);

  // Spell slots disponíveis
  const availableSlots = getSpellSlots(characterClass, characterLevel);

  // Inicializar spell slots state
  const [spellSlots, setSpellSlots] = useState<SpellSlotState[]>(() => {
    if (initialSpellSlots.length > 0) {
      return initialSpellSlots;
    }

    // Criar state inicial
    return Object.entries(availableSlots).map(([level, total]) => ({
      level: parseInt(level),
      total,
      used: 0,
    }));
  });

  // Cantrips e spells conhecidos
  const cantripsKnown = getCantripsKnown(characterClass, characterLevel);
  const spellsKnownLimit = getSpellsKnown(characterClass, characterLevel);

  // Agrupar magias por nível
  const groupedSpells = groupSpellsByLevel(spells);
  const cantrips = groupedSpells[0] || [];
  const leveledSpells = Object.entries(groupedSpells)
    .filter(([level]) => parseInt(level) > 0)
    .sort(([a], [b]) => parseInt(a) - parseInt(b));

  // Toggle favorite
  const handleToggleFavorite = async (spell: CharacterSpell) => {
    try {
      const supabase = createClient();
      let newFavorites: SpellFavorite[];

      if (isFavorite(favorites, spell.spellId)) {
        newFavorites = removeFromFavorites(favorites, spell.spellId);
      } else {
        newFavorites = addToFavorites(favorites, spell);
      }

      const { error } = await supabase
        .from('characters')
        .update({ spell_favorites: newFavorites })
        .eq('id', characterId);

      if (error) throw error;

      setFavorites(newFavorites);
    } catch (err) {
      console.error('Erro ao atualizar favoritos:', err);
      alert('Erro ao atualizar favoritos. Tente novamente.');
    }
  };

  const favoriteIds = favorites.map((f) => f.spellId);

  // Handler para conjurar magia (usa spell slot)
  const handleCastSpell = async (spellId: string, castAtLevel: number) => {
    try {
      const supabase = createClient();

      // Encontrar o slot e usar
      const updatedSlots = spellSlots.map((slot) => {
        if (slot.level === castAtLevel && slot.used < slot.total) {
          return { ...slot, used: slot.used + 1 };
        }
        return slot;
      });

      const { error } = await supabase
        .from('characters')
        .update({ spell_slots: updatedSlots })
        .eq('id', characterId);

      if (error) throw error;

      setSpellSlots(updatedSlots);
      alert(`${spells.find((s) => s.spellId === spellId)?.spellName} conjurada no ${castAtLevel}º nível!`);
    } catch (err) {
      console.error('Erro ao conjurar magia:', err);
      alert('Erro ao conjurar magia. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Spellcasting Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Atributo de Conjuração</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {spellcastingAbility ? ABILITY_LABELS[spellcastingAbility] : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">{formatModifier(spellcastingModifier)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">CD de Salvaguarda</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{spellSaveDC}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Bônus de Ataque</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatModifier(spellAttackBonus)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">
              {preparedLimit !== null ? 'Magias Preparadas' : 'Magias Conhecidas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {preparedLimit !== null
                ? `${preparedCount}/${preparedLimit}`
                : spellsKnownLimit || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spell Slots Tracker */}
      <SpellSlotTracker
        characterId={characterId}
        spellSlots={spellSlots}
        onUpdate={setSpellSlots}
      />

      {/* Spells Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-600" />
              Suas Magias
            </CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Magia
            </Button>
          </div>
          <CardDescription>Gerencie suas magias conhecidas e preparadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cantrips" className="w-full">
            <TabsList
              className="grid w-full grid-cols-auto-fit gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
            >
              <TabsTrigger value="favorites">
                <Star className="mr-2 h-4 w-4" />
                Favoritas
                <Badge variant="secondary" className="ml-2">
                  {favorites.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="cantrips">
                <Sparkles className="mr-2 h-4 w-4" />
                Cantrips
                <Badge variant="secondary" className="ml-2">
                  {cantrips.length}/{cantripsKnown}
                </Badge>
              </TabsTrigger>
              {leveledSpells.map(([level]) => (
                <TabsTrigger key={level} value={`level-${level}`}>
                  {level}º Círculo
                  <Badge variant="secondary" className="ml-2">
                    {groupedSpells[parseInt(level)].length}
                  </Badge>
                </TabsTrigger>
              ))}
              <TabsTrigger value="all">
                <BookOpen className="mr-2 h-4 w-4" />
                Todas
              </TabsTrigger>
            </TabsList>

            {/* Favorites */}
            <TabsContent value="favorites" className="mt-4">
              <SpellFavoritesPanel
                characterId={characterId}
                favorites={favorites}
                onUpdate={setFavorites}
              />
            </TabsContent>

            {/* Cantrips */}
            <TabsContent value="cantrips" className="mt-4">
              {cantrips.length > 0 ? (
                <SpellList
                  spells={cantrips}
                  showPrepared={false}
                  favorites={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  spellSlots={spellSlots}
                  onCastSpell={handleCastSpell}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Nenhum cantrip ainda</p>
                  <p className="text-xs text-muted-foreground">
                    Adicione cantrips que você conhece
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Leveled Spells */}
            {leveledSpells.map(([level, levelSpells]) => (
              <TabsContent key={level} value={`level-${level}`} className="mt-4">
                <SpellList
                  spells={levelSpells}
                  showPrepared={preparedLimit !== null}
                  favorites={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  spellSlots={spellSlots}
                  onCastSpell={handleCastSpell}
                />
              </TabsContent>
            ))}

            {/* All Spells */}
            <TabsContent value="all" className="mt-4">
              {spells.length > 0 ? (
                <div className="space-y-6">
                  {/* Cantrips */}
                  {cantrips.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                        <Sparkles className="h-5 w-5" />
                        Cantrips
                      </h3>
                      <SpellList
                        spells={cantrips}
                        showPrepared={false}
                        favorites={favoriteIds}
                        onToggleFavorite={handleToggleFavorite}
                        spellSlots={spellSlots}
                        onCastSpell={handleCastSpell}
                      />
                    </div>
                  )}

                  {/* Leveled Spells */}
                  {leveledSpells.map(([level, levelSpells]) => (
                    <div key={level}>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                        <Zap className="h-5 w-5" />
                        {level}º Círculo
                      </h3>
                      <SpellList
                        spells={levelSpells}
                        showPrepared={preparedLimit !== null}
                        favorites={favoriteIds}
                        onToggleFavorite={handleToggleFavorite}
                        spellSlots={spellSlots}
                        onCastSpell={handleCastSpell}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Nenhuma magia ainda</p>
                  <p className="text-xs text-muted-foreground">
                    Adicione as magias que você conhece ou pode preparar
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
