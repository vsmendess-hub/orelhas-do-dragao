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
            className="glass-card rounded-xl p-6 text-center border-2 border-purple-500/30 hover:border-purple-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                Classe de Armadura
              </p>
              <Edit3 className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-4xl font-bold text-white">{armorClass}</p>
          </button>

          {/* Iniciativa */}
          <button
            onClick={() => setInitiativeEditorOpen(true)}
            className="glass-card rounded-xl p-6 text-center border-2 border-purple-500/30 hover:border-purple-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                Iniciativa
              </p>
              <Edit3 className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-4xl font-bold text-white">{formatModifier(totalInitiative)}</p>
            {hasAlertFeat && <p className="text-xs text-purple-400 mt-2">+5 Alerta</p>}
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
