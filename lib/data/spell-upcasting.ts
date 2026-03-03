/**
 * Sistema de Upcasting para Magias D&D 5e
 * Calcular efeitos de conjurar magias em níveis superiores
 */

export type UpcastScaling =
  | 'damage-per-level' // +XdY dano por nível acima
  | 'targets-per-level' // +N alvos por nível acima
  | 'duration-per-level' // +X tempo por nível acima
  | 'healing-per-level' // +XdY cura por nível acima
  | 'range-per-level' // +X pés alcance por nível acima
  | 'special'; // Efeito especial por nível

export interface UpcastRule {
  type: UpcastScaling;
  value: string; // "1d6", "2 alvos", "10 minutos", etc.
  description: string;
}

export interface SpellUpcastInfo {
  spellId: string;
  baseLevel: number;
  maxLevel: number; // Nível máximo útil para upcast (geralmente 9)
  rules: UpcastRule[];
}

/**
 * Calcula os slots de magia disponíveis para upcast
 */
export function getAvailableUpcastLevels(
  spellBaseLevel: number,
  availableSlots: Record<number, { total: number; used: number }>
): number[] {
  const levels: number[] = [];

  // Magias podem ser conjuradas usando slots de nível igual ou superior
  for (let level = spellBaseLevel; level <= 9; level++) {
    const slot = availableSlots[level];
    if (slot && slot.total > 0 && slot.used < slot.total) {
      levels.push(level);
    }
  }

  return levels;
}

/**
 * Calcula o custo de conjuração em um nível específico
 */
export function calculateUpcastCost(
  spellBaseLevel: number,
  castAtLevel: number
): {
  slotLevel: number;
  isUpcast: boolean;
  levelsAbove: number;
} {
  return {
    slotLevel: castAtLevel,
    isUpcast: castAtLevel > spellBaseLevel,
    levelsAbove: Math.max(0, castAtLevel - spellBaseLevel),
  };
}

/**
 * Aplica as regras de upcast e retorna descrição dos efeitos
 */
export function applyUpcastRules(
  rules: UpcastRule[],
  levelsAbove: number
): Array<{ type: UpcastScaling; effectDescription: string }> {
  if (levelsAbove === 0) return [];

  return rules.map((rule) => {
    let effectDescription = '';

    switch (rule.type) {
      case 'damage-per-level': {
        // Ex: "1d6" -> "3d6" (se 3 níveis acima)
        const match = rule.value.match(/(\d+)d(\d+)/);
        if (match) {
          const [, numDice, diceSize] = match;
          const totalDice = parseInt(numDice) * levelsAbove;
          effectDescription = `+${totalDice}d${diceSize} de dano adicional`;
        }
        break;
      }

      case 'healing-per-level': {
        const match = rule.value.match(/(\d+)d(\d+)/);
        if (match) {
          const [, numDice, diceSize] = match;
          const totalDice = parseInt(numDice) * levelsAbove;
          effectDescription = `+${totalDice}d${diceSize} de cura adicional`;
        }
        break;
      }

      case 'targets-per-level': {
        const match = rule.value.match(/(\d+)/);
        if (match) {
          const targetsPerLevel = parseInt(match[1]);
          const totalTargets = targetsPerLevel * levelsAbove;
          effectDescription = `+${totalTargets} alvo(s) adicional(is)`;
        }
        break;
      }

      case 'duration-per-level': {
        effectDescription = `Duração aumentada: ${rule.description}`;
        break;
      }

      case 'range-per-level': {
        const match = rule.value.match(/(\d+)/);
        if (match) {
          const rangePerLevel = parseInt(match[1]);
          const totalRange = rangePerLevel * levelsAbove;
          effectDescription = `+${totalRange} pés de alcance`;
        }
        break;
      }

      case 'special': {
        effectDescription = rule.description;
        break;
      }
    }

    return {
      type: rule.type,
      effectDescription,
    };
  });
}

/**
 * Database de regras de upcast para magias comuns
 */
export const UPCAST_DATABASE: Record<string, SpellUpcastInfo> = {
  'magic-missile': {
    spellId: 'magic-missile',
    baseLevel: 1,
    maxLevel: 9,
    rules: [
      {
        type: 'targets-per-level',
        value: '1',
        description: '+1 míssil por nível de espaço acima do 1º',
      },
    ],
  },
  'cure-wounds': {
    spellId: 'cure-wounds',
    baseLevel: 1,
    maxLevel: 9,
    rules: [
      {
        type: 'healing-per-level',
        value: '1d8',
        description: '+1d8 de cura por nível de espaço acima do 1º',
      },
    ],
  },
  'burning-hands': {
    spellId: 'burning-hands',
    baseLevel: 1,
    maxLevel: 9,
    rules: [
      {
        type: 'damage-per-level',
        value: '1d6',
        description: '+1d6 de dano de fogo por nível de espaço acima do 1º',
      },
    ],
  },
  'fireball': {
    spellId: 'fireball',
    baseLevel: 3,
    maxLevel: 9,
    rules: [
      {
        type: 'damage-per-level',
        value: '1d6',
        description: '+1d6 de dano de fogo por nível de espaço acima do 3º',
      },
    ],
  },
  'lightning-bolt': {
    spellId: 'lightning-bolt',
    baseLevel: 3,
    maxLevel: 9,
    rules: [
      {
        type: 'damage-per-level',
        value: '1d6',
        description: '+1d6 de dano elétrico por nível de espaço acima do 3º',
      },
    ],
  },
  'spiritual-weapon': {
    spellId: 'spiritual-weapon',
    baseLevel: 2,
    maxLevel: 9,
    rules: [
      {
        type: 'damage-per-level',
        value: '1d8',
        description: '+1d8 de dano por 2 níveis de espaço acima do 2º',
      },
    ],
  },
  'aid': {
    spellId: 'aid',
    baseLevel: 2,
    maxLevel: 9,
    rules: [
      {
        type: 'special',
        value: '5',
        description: '+5 pontos de vida adicionais por nível de espaço acima do 2º',
      },
    ],
  },
  'hold-person': {
    spellId: 'hold-person',
    baseLevel: 2,
    maxLevel: 9,
    rules: [
      {
        type: 'targets-per-level',
        value: '1',
        description: '+1 criatura adicional por nível de espaço acima do 2º',
      },
    ],
  },
  'scorching-ray': {
    spellId: 'scorching-ray',
    baseLevel: 2,
    maxLevel: 9,
    rules: [
      {
        type: 'targets-per-level',
        value: '1',
        description: '+1 raio adicional por nível de espaço acima do 2º',
      },
    ],
  },
  'guiding-bolt': {
    spellId: 'guiding-bolt',
    baseLevel: 1,
    maxLevel: 9,
    rules: [
      {
        type: 'damage-per-level',
        value: '1d6',
        description: '+1d6 de dano radiante por nível de espaço acima do 1º',
      },
    ],
  },
};

/**
 * Busca informações de upcast para uma magia
 */
export function getUpcastInfo(spellId: string): SpellUpcastInfo | null {
  return UPCAST_DATABASE[spellId] || null;
}

/**
 * Verifica se uma magia pode ser upcast
 */
export function canBeUpcast(spellId: string, baseLevel: number): boolean {
  // Cantrips (nível 0) não podem ser upcast
  if (baseLevel === 0) return false;

  // Verificar se tem regras de upcast no database
  return !!UPCAST_DATABASE[spellId];
}

/**
 * Gera texto descritivo completo do upcast
 */
export function generateUpcastDescription(
  spellId: string,
  baseLevel: number,
  castAtLevel: number
): string | null {
  const upcastInfo = getUpcastInfo(spellId);
  if (!upcastInfo) return null;

  const { levelsAbove } = calculateUpcastCost(baseLevel, castAtLevel);
  if (levelsAbove === 0) return null;

  const effects = applyUpcastRules(upcastInfo.rules, levelsAbove);
  if (effects.length === 0) return null;

  const effectTexts = effects.map((e) => e.effectDescription).filter(Boolean);
  return `Conjurado no ${castAtLevel}º nível: ${effectTexts.join(', ')}`;
}

/**
 * Calcula dano médio de upcast (útil para sugestões)
 */
export function calculateAverageDamageIncrease(
  rules: UpcastRule[],
  levelsAbove: number
): number {
  let totalAverage = 0;

  for (const rule of rules) {
    if (rule.type === 'damage-per-level' || rule.type === 'healing-per-level') {
      const match = rule.value.match(/(\d+)d(\d+)/);
      if (match) {
        const [, numDice, diceSize] = match;
        const dicePerLevel = parseInt(numDice);
        const size = parseInt(diceSize);
        const averagePerDie = (size + 1) / 2;
        totalAverage += dicePerLevel * levelsAbove * averagePerDie;
      }
    }
  }

  return totalAverage;
}

/**
 * Recomenda o melhor nível para conjurar baseado em eficiência
 */
export function recommendUpcastLevel(
  spellId: string,
  baseLevel: number,
  availableLevels: number[]
): {
  recommended: number;
  reason: string;
} {
  // Se não tem upcast info, usar nível base
  const upcastInfo = getUpcastInfo(spellId);
  if (!upcastInfo || availableLevels.length === 0) {
    return {
      recommended: baseLevel,
      reason: 'Nível base (sem bônus de upcast)',
    };
  }

  // Se só tem nível base disponível
  if (availableLevels.length === 1 && availableLevels[0] === baseLevel) {
    return {
      recommended: baseLevel,
      reason: 'Único slot disponível',
    };
  }

  // Calcular eficiência de cada nível
  const efficiencies = availableLevels
    .filter((level) => level >= baseLevel)
    .map((level) => {
      const levelsAbove = level - baseLevel;
      const avgIncrease = calculateAverageDamageIncrease(upcastInfo.rules, levelsAbove);
      const costIncrease = levelsAbove;
      const efficiency = costIncrease > 0 ? avgIncrease / costIncrease : 0;

      return { level, efficiency, avgIncrease };
    });

  // Ordenar por eficiência
  efficiencies.sort((a, b) => b.efficiency - a.efficiency);

  const best = efficiencies[0];
  return {
    recommended: best.level,
    reason:
      best.level === baseLevel
        ? 'Melhor custo-benefício'
        : `+${Math.round(best.avgIncrease)} de aumento médio`,
  };
}
