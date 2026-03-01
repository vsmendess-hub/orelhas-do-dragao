'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpellList } from './spell-list';
import { SpellSlotsManager } from './spell-slots-manager';
import { SpellDialog } from './spell-dialog';
import { SpellPreparation } from './spell-preparation';
import { createClient } from '@/lib/supabase/client';
import {
  type Spell,
  type SpellSlots,
  type SpellcasterInfo,
  isPreparingCaster,
} from '@/lib/data/spells';

interface SpellsManagerProps {
  characterId: string;
  characterClass: string;
  characterLevel: number;
  spellcastingModifier: number;
  proficiencyBonus: number;
  initialSpells: Spell[];
  initialSpellSlots: SpellSlots;
  spellcasterInfo: SpellcasterInfo;
}

export function SpellsManager({
  characterId,
  characterClass,
  characterLevel,
  spellcastingModifier,
  initialSpells,
  initialSpellSlots,
}: SpellsManagerProps) {
  const [spells, setSpells] = useState<Spell[]>(initialSpells);
  const [isSpellDialogOpen, setIsSpellDialogOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);

  const canPrepareSpells = isPreparingCaster(characterClass);

  // Salvar magias no Supabase
  const saveSpells = async (newSpells: Spell[]) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('characters')
        .update({ spells: newSpells })
        .eq('id', characterId);

      if (error) throw error;
      setSpells(newSpells);
    } catch (err) {
      console.error('Erro ao salvar magias:', err);
    }
  };

  // Adicionar/editar magia
  const handleSaveSpell = (spell: Spell) => {
    const existingIndex = spells.findIndex((s) => s.id === spell.id);

    let newSpells: Spell[];
    if (existingIndex >= 0) {
      // Editar existente
      newSpells = [...spells];
      newSpells[existingIndex] = spell;
    } else {
      // Adicionar nova
      newSpells = [...spells, spell];
    }

    saveSpells(newSpells);
  };

  // Deletar magia
  const handleDeleteSpell = (spellId: string) => {
    if (!confirm('Tem certeza que deseja remover esta magia?')) return;

    const newSpells = spells.filter((spell) => spell.id !== spellId);
    saveSpells(newSpells);
  };

  // Toggle preparada
  const handleTogglePrepared = (spellId: string) => {
    const newSpells = spells.map((spell) =>
      spell.id === spellId ? { ...spell, prepared: !spell.prepared } : spell
    );
    saveSpells(newSpells);
  };

  // Abrir dialog para editar
  const handleEditSpell = (spell: Spell) => {
    setEditingSpell(spell);
    setIsSpellDialogOpen(true);
  };

  // Abrir dialog para adicionar
  const handleAddSpell = () => {
    setEditingSpell(null);
    setIsSpellDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="spells" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spells">Magias</TabsTrigger>
          <TabsTrigger value="slots">Espaços</TabsTrigger>
          {canPrepareSpells && <TabsTrigger value="preparation">Preparação</TabsTrigger>}
          {!canPrepareSpells && (
            <TabsTrigger value="preparation" disabled>
              Preparação
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Lista de Magias */}
        <TabsContent value="spells">
          <SpellList
            spells={spells}
            isPreparingCaster={canPrepareSpells}
            onAddSpell={handleAddSpell}
            onEditSpell={handleEditSpell}
            onDeleteSpell={handleDeleteSpell}
            onTogglePrepared={handleTogglePrepared}
          />
        </TabsContent>

        {/* Tab: Slots de Magia */}
        <TabsContent value="slots">
          <SpellSlotsManager characterId={characterId} initialSlots={initialSpellSlots} />
        </TabsContent>

        {/* Tab: Preparação */}
        {canPrepareSpells && (
          <TabsContent value="preparation">
            <SpellPreparation
              characterId={characterId}
              characterClass={characterClass}
              characterLevel={characterLevel}
              spellcastingModifier={spellcastingModifier}
              spells={spells}
              onSpellsUpdate={setSpells}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog de Magia */}
      <SpellDialog
        open={isSpellDialogOpen}
        onOpenChange={setIsSpellDialogOpen}
        onSave={handleSaveSpell}
        editingSpell={editingSpell}
      />
    </>
  );
}
