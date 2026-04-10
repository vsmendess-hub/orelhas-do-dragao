'use client';

import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttributesEditor } from './attributes-editor';
import { formatModifier } from '@/lib/data/point-buy';

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface AttributesSectionProps {
  characterId: string;
  attributes: Attributes;
  modifiers: Attributes;
  currentHP: {
    current: number;
    max: number;
    temp: number;
  };
  characterLevel: number;
  proficiencyBonus: number;
  weaponProficiencies: string[];
  armorProficiencies: string[];
  feats?: Array<{ featId: string; name: string }>;
}

export function AttributesSection({
  characterId,
  attributes,
  modifiers,
  currentHP,
  characterLevel,
  proficiencyBonus,
  weaponProficiencies,
  armorProficiencies,
  feats = [],
}: AttributesSectionProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Atributos</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditorOpen(true)}
          className="text-purple-300 hover:text-purple-200 hover:bg-white/10 -mr-2"
        >
          <Edit3 className="h-4 w-4 mr-1.5" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((attr) => (
          <div key={attr} className="attribute-card">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {ABILITY_ABBREVIATIONS[attr]}
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{attributes[attr]}</p>
            <p className="text-sm text-purple-300 font-semibold">
              {formatModifier(modifiers[attr])}
            </p>
          </div>
        ))}
      </div>

      <AttributesEditor
        characterId={characterId}
        attributes={attributes}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        currentHP={currentHP}
        characterLevel={characterLevel}
        proficiencyBonus={proficiencyBonus}
        weaponProficiencies={weaponProficiencies}
        armorProficiencies={armorProficiencies}
        feats={feats}
      />
    </div>
  );
}
