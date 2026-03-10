/**
 * Componente de Testes de Salvaguarda
 * Baseado no PHB - Cada classe tem proficiência em 2 atributos
 */

import { Shield } from 'lucide-react';

interface SavingThrowsProps {
  modifiers: Record<string, number>;
  proficiencyBonus: number;
  savingThrowProficiencies: string[]; // Ex: ['Força', 'Constituição']
}

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function SavingThrows({
  modifiers,
  proficiencyBonus,
  savingThrowProficiencies,
}: SavingThrowsProps) {
  // Calcular salvaguardas para cada atributo
  const savingThrows = (Object.keys(ABILITY_NAMES) as Array<keyof typeof ABILITY_NAMES>).map(
    (attr) => {
      const abilityName = ABILITY_NAMES[attr];
      const isProficient = savingThrowProficiencies.includes(abilityName);
      const modifier = modifiers[attr] || 0;
      const bonus = isProficient ? modifier + proficiencyBonus : modifier;

      return {
        attr,
        name: abilityName,
        abbreviation: ABILITY_ABBREVIATIONS[attr],
        modifier,
        bonus,
        isProficient,
      };
    }
  );

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Testes de Resistência</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {savingThrows.map((save) => (
          <div
            key={save.attr}
            className={`rounded-xl p-3 transition-all ${
              save.isProficient
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'glass-card-light border border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {save.isProficient && (
                  <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    ✓
                  </div>
                )}
                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium uppercase tracking-wide whitespace-nowrap ${
                      save.isProficient ? 'text-blue-300' : 'text-gray-400'
                    }`}
                  >
                    {save.abbreviation}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{save.name}</p>
                </div>
              </div>
              <p
                className={`text-2xl font-bold flex-shrink-0 ${
                  save.isProficient ? 'text-blue-300' : 'text-white'
                }`}
              >
                {formatModifier(save.bonus)}
              </p>
            </div>

            {save.isProficient && (
              <div className="mt-2 text-xs text-blue-400 whitespace-nowrap">
                {formatModifier(save.modifier)} + {proficiencyBonus} (prof)
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-gray-300">
        <p className="font-semibold text-blue-300 mb-1">ℹ️ Como Funciona:</p>
        <p>
          Testes de resistência marcados com <span className="text-blue-300">✓</span> adicionam seu
          bônus de proficiência (+{proficiencyBonus}) ao modificador do atributo.
        </p>
      </div>
    </div>
  );
}
