/**
 * Componente de Estatísticas do Personagem (Proficiência e Deslocamento)
 * Com funcionalidade de edição
 */

'use client';

import { useState } from 'react';
import { Dices, Footprints, Edit3 } from 'lucide-react';
import { ProficiencyEditor } from './proficiency-editor';
import { SpeedEditor } from './speed-editor';

interface CharacterStatsProps {
  characterId: string;
  proficiencyBonus: number;
  speed: number; // em pés
}

export function CharacterStats({ characterId, proficiencyBonus, speed }: CharacterStatsProps) {
  const [proficiencyEditorOpen, setProficiencyEditorOpen] = useState(false);
  const [speedEditorOpen, setSpeedEditorOpen] = useState(false);

  // Converter pés para metros
  const speedInMeters = Math.floor(speed * 0.3048);

  return (
    <>
      <div className="space-y-3">
        {/* Proficiência */}
        <button
          onClick={() => setProficiencyEditorOpen(true)}
          className="glass-card-light rounded-xl p-4 pb-10 text-center w-full border border-white/10 hover:border-purple-500/50 active:scale-95 hover:scale-[1.02] transition-all group cursor-pointer relative"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <Dices className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <p className="text-xs text-gray-400 uppercase group-hover:text-gray-300 transition-colors">
              Proficiência
            </p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors">
            +{proficiencyBonus}
          </p>

          {/* Badge "Editável" embaixo - sempre visível */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Edit3 className="h-3 w-3 text-purple-400 group-hover:text-purple-300" />
            <span className="text-[10px] text-purple-400 group-hover:text-purple-300 font-medium">
              Editar
            </span>
          </div>
        </button>

        {/* Deslocamento */}
        <button
          onClick={() => setSpeedEditorOpen(true)}
          className="glass-card-light rounded-xl p-4 pb-10 text-center w-full border border-white/10 hover:border-purple-500/50 active:scale-95 hover:scale-[1.02] transition-all group cursor-pointer relative"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <Footprints className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <p className="text-xs text-gray-400 uppercase group-hover:text-gray-300 transition-colors">
              Deslocamento
            </p>
          </div>
          <p className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors">
            {speedInMeters} m
          </p>
          <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
            por turno
          </p>

          {/* Badge "Editável" embaixo - sempre visível */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Edit3 className="h-3 w-3 text-purple-400 group-hover:text-purple-300" />
            <span className="text-[10px] text-purple-400 group-hover:text-purple-300 font-medium">
              Editar
            </span>
          </div>
        </button>
      </div>

      {/* Editores */}
      <ProficiencyEditor
        characterId={characterId}
        proficiencyBonus={proficiencyBonus}
        open={proficiencyEditorOpen}
        onOpenChange={setProficiencyEditorOpen}
      />
      <SpeedEditor
        characterId={characterId}
        speed={speed}
        open={speedEditorOpen}
        onOpenChange={setSpeedEditorOpen}
      />
    </>
  );
}
