/**
 * Componente de Estatísticas de Combate (CA e Iniciativa)
 * Com funcionalidade de edição
 */

'use client';

import { useState } from 'react';
import { Shield, Zap, Edit3 } from 'lucide-react';
import { formatModifier } from '@/lib/data/point-buy';
import { ArmorClassEditor } from './armor-class-editor';
import { InitiativeEditor } from './initiative-editor';

interface CombatStatsProps {
  characterId: string;
  armorClass: number;
  initiative: number;
  hasAlertFeat?: boolean;
}

export function CombatStats({
  characterId,
  armorClass,
  initiative,
  hasAlertFeat = false,
}: CombatStatsProps) {
  const [acEditorOpen, setAcEditorOpen] = useState(false);
  const [initiativeEditorOpen, setInitiativeEditorOpen] = useState(false);

  // Calcular Iniciativa total com bônus de Alerta (+5)
  const initiativeBonus = hasAlertFeat ? 5 : 0;
  const totalInitiative = initiative + initiativeBonus;

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Combate</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Classe de Armadura */}
          <button
            onClick={() => setAcEditorOpen(true)}
            className="glass-card rounded-xl p-6 text-center border-2 border-purple-500/30 hover:border-purple-500/70 hover:scale-[1.02] transition-all group cursor-pointer relative"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <p className="text-sm font-medium text-gray-300 uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                Classe de Armadura
              </p>
            </div>
            <p className="text-4xl font-bold text-white group-hover:text-purple-100 transition-colors">
              {armorClass}
            </p>

            {/* Badge "Editável" embaixo - aparece no hover */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="h-3 w-3 text-purple-300" />
              <span className="text-xs text-purple-300 font-medium">Clique para editar</span>
            </div>
          </button>

          {/* Iniciativa */}
          <button
            onClick={() => setInitiativeEditorOpen(true)}
            className="glass-card rounded-xl p-6 text-center border-2 border-purple-500/30 hover:border-purple-500/70 hover:scale-[1.02] transition-all group cursor-pointer relative"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <p className="text-sm font-medium text-gray-300 uppercase tracking-wide group-hover:text-gray-200 transition-colors">
                Iniciativa
              </p>
            </div>
            <p className="text-4xl font-bold text-white group-hover:text-purple-100 transition-colors">
              {formatModifier(totalInitiative)}
            </p>
            {hasAlertFeat && (
              <p className="text-xs text-purple-400 mt-2 group-hover:text-purple-300 transition-colors">
                +5 Alerta
              </p>
            )}

            {/* Badge "Editável" embaixo - aparece no hover */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="h-3 w-3 text-purple-300" />
              <span className="text-xs text-purple-300 font-medium">Clique para editar</span>
            </div>
          </button>
        </div>
      </div>

      {/* Editores */}
      <ArmorClassEditor
        characterId={characterId}
        armorClass={armorClass}
        open={acEditorOpen}
        onOpenChange={setAcEditorOpen}
      />
      <InitiativeEditor
        characterId={characterId}
        initiative={initiative}
        open={initiativeEditorOpen}
        onOpenChange={setInitiativeEditorOpen}
      />
    </>
  );
}
