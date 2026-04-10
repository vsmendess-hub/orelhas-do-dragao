/**
 * Componente de Percepção Passiva
 * Baseado no PHB: 10 + modificador de Sabedoria + bônus de proficiência (se proficiente)
 */

import { Eye } from 'lucide-react';

interface PassivePerceptionProps {
  wisdomModifier: number;
  proficiencyBonus: number;
  isProficientInPerception: boolean;
}

export function PassivePerception({
  wisdomModifier,
  proficiencyBonus,
  isProficientInPerception,
}: PassivePerceptionProps) {
  // Fórmula PHB: 10 + mod Sabedoria + bônus de proficiência (se proficiente)
  const baseScore = 10;
  const perceptionBonus = isProficientInPerception ? proficiencyBonus : 0;
  const passivePerception = baseScore + wisdomModifier + perceptionBonus;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Eye className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Percepção Passiva</h3>
      </div>

      <div className="glass-card-light rounded-xl p-6 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all">
        <div className="text-center">
          <div className="mb-3">
            <div className="inline-block rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4">
              <Eye className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <p className="text-5xl font-bold text-emerald-400 mb-2">{passivePerception}</p>

          <div className="space-y-1 text-sm text-gray-400">
            <p>10 (base)</p>
            <p>
              {wisdomModifier >= 0 ? '+' : ''}
              {wisdomModifier} (Sabedoria)
            </p>
            {isProficientInPerception && (
              <p className="text-emerald-400">+{proficiencyBonus} (proficiência)</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-gray-300">
        <p className="font-semibold text-emerald-300 mb-1">ℹ️ O que é?</p>
        <p>
          A Percepção Passiva representa o quão alerta você está do ambiente ao seu redor sem
          precisar fazer um teste. O Mestre usa este valor para verificar se você percebe coisas
          escondidas, emboscadas, portas secretas, etc.
        </p>
      </div>

      {!isProficientInPerception && (
        <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-gray-300">
          <p className="font-semibold text-amber-300 mb-1">💡 Dica:</p>
          <p>
            Você não é proficiente em Percepção. Considere adicionar esta perícia para melhorar sua
            capacidade de notar ameaças!
          </p>
        </div>
      )}
    </div>
  );
}
