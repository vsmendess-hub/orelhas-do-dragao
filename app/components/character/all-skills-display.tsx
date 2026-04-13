/**
 * Componente que exibe TODAS as 18 perícias do D&D 5e
 * Com cálculo automático, destaque para proficientes e edição
 */

'use client';

import { useState } from 'react';
import { Target, Edit3 } from 'lucide-react';
import { ALL_SKILLS } from '@/lib/data/all-skills';
import { SkillsEditor } from './skills-editor';

interface CharacterSkill {
  name: string;
  attribute: string;
  proficient: boolean;
  expertise: boolean;
}

interface SkillOverride {
  [skillId: string]: number;
}

interface AllSkillsDisplayProps {
  characterId: string;
  skills: CharacterSkill[]; // Perícias proficientes do personagem
  modifiers: Record<string, number>;
  proficiencyBonus: number;
  abilityAbbreviations: Record<string, string>;
  skillOverrides?: SkillOverride;
}

// Format modifier helper
function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function AllSkillsDisplay({
  characterId,
  skills,
  modifiers,
  proficiencyBonus,
  abilityAbbreviations,
  skillOverrides = {},
}: AllSkillsDisplayProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  // Criar mapa de perícias proficientes
  const proficientSkills = new Set(skills.map((s) => s.name));
  const expertiseSkills = new Set(skills.filter((s) => s.expertise).map((s) => s.name));

  // Calcular todas as perícias
  const allSkillsWithBonus = ALL_SKILLS.map((skillDef) => {
    const isProficient = proficientSkills.has(skillDef.name);
    const hasExpertise = expertiseSkills.has(skillDef.name);
    const attrMod = modifiers[skillDef.attribute] || 0;

    // Calcular bônus base
    let baseBonus = attrMod;
    if (hasExpertise) {
      baseBonus += proficiencyBonus * 2;
    } else if (isProficient) {
      baseBonus += proficiencyBonus;
    }

    // Usar override se existir
    const finalBonus =
      skillOverrides[skillDef.id] !== undefined ? skillOverrides[skillDef.id] : baseBonus;

    const isOverridden = skillOverrides[skillDef.id] !== undefined;

    return {
      ...skillDef,
      isProficient,
      hasExpertise,
      baseBonus,
      finalBonus,
      isOverridden,
    };
  });

  const proficientCount = allSkillsWithBonus.filter((s) => s.isProficient).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-400" />
          <p className="text-sm text-gray-400">
            {proficientCount} perícias proficientes de {ALL_SKILLS.length}
          </p>
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all text-purple-300 hover:text-purple-200 text-sm"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Editar Perícias
        </button>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {allSkillsWithBonus.map((skill) => (
          <div
            key={skill.id}
            className={`glass-card-light rounded-lg p-3 flex items-center justify-between transition-all ${
              skill.isProficient
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 hover:border-purple-500/70'
                : 'border border-white/10 hover:border-white/20'
            } ${skill.isOverridden ? 'ring-2 ring-amber-500/30' : ''}`}
          >
            <div className="flex items-center gap-2">
              {/* Badge de proficiência */}
              {skill.isProficient && (
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    skill.hasExpertise
                      ? 'bg-yellow-500/30 text-yellow-300 ring-2 ring-yellow-500/50'
                      : 'bg-purple-500/30 text-purple-300'
                  }`}
                >
                  {skill.hasExpertise ? '★' : '✓'}
                </div>
              )}

              {/* Nome e atributo */}
              <div>
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-sm font-medium ${
                      skill.isProficient ? 'text-purple-100' : 'text-gray-300'
                    }`}
                  >
                    {skill.name}
                  </p>
                  {skill.isOverridden && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                      MANUAL
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{abilityAbbreviations[skill.attribute]}</p>
              </div>
            </div>

            {/* Bônus */}
            <p
              className={`text-lg font-bold ${
                skill.isOverridden
                  ? 'text-amber-300'
                  : skill.isProficient
                    ? 'text-purple-300'
                    : 'text-gray-400'
              }`}
            >
              {formatModifier(skill.finalBonus)}
            </p>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-gray-300 space-y-1">
        <p className="font-semibold text-blue-300 mb-2">ℹ️ Legenda:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <span className="text-purple-300">✓</span> = Proficiente (+{proficiencyBonus})
          </span>
          <span>
            <span className="text-yellow-300">★</span> = Especialista (+
            {proficiencyBonus * 2})
          </span>
          <span>
            <span className="text-amber-400">MANUAL</span> = Valor customizado
          </span>
        </div>
      </div>

      {/* Editor */}
      <SkillsEditor
        characterId={characterId}
        allSkills={allSkillsWithBonus}
        proficiencyBonus={proficiencyBonus}
        skillOverrides={skillOverrides}
        modifiers={modifiers}
        proficientSkills={Array.from(proficientSkills)}
        open={editorOpen}
        onOpenChange={setEditorOpen}
      />
    </div>
  );
}
