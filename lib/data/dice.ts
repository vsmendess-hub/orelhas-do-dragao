/**
 * Sistema de Rolagem de Dados D&D 5e
 * Tipos e interfaces para rolagens, histórico e cálculos
 */

// Tipos de dados disponíveis
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

// Tipo de rolagem (normal, vantagem, desvantagem)
export type RollType = 'normal' | 'advantage' | 'disadvantage';

// Resultado individual de um dado
export interface DiceRoll {
  die: DiceType;
  result: number;
  dropped?: boolean; // Para vantagem/desvantagem
}

// Resultado completo de uma rolagem
export interface RollResult {
  rolls: DiceRoll[]; // Dados rolados
  modifier: number; // Modificador aplicado
  total: number; // Resultado final
  type: RollType; // Tipo de rolagem
  isCritical?: boolean; // Acerto crítico (20 natural)
  isCriticalFail?: boolean; // Falha crítica (1 natural)
  timestamp: number; // Quando foi rolado
  description?: string; // Descrição opcional (ex: "Ataque com Espada")
}

// Entrada de histórico
export interface RollHistoryEntry extends RollResult {
  id: string;
}

// Configuração de rolagem customizada salva
export interface SavedRoll {
  id: string;
  name: string; // Ex: "Ataque Furtivo"
  diceCount: number; // Quantidade de dados
  diceType: DiceType; // Tipo de dado
  modifier: number; // Modificador
  damageRoll?: {
    // Rolagem de dano adicional opcional
    diceCount: number;
    diceType: DiceType;
    modifier: number;
  };
}

/**
 * Rola um dado específico
 */
export function rollDie(diceType: DiceType): number {
  const sides: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d100: 100,
  };

  return Math.floor(Math.random() * sides[diceType]) + 1;
}

/**
 * Rola múltiplos dados do mesmo tipo
 */
export function rollDice(count: number, diceType: DiceType): DiceRoll[] {
  const rolls: DiceRoll[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push({
      die: diceType,
      result: rollDie(diceType),
    });
  }
  return rolls;
}

/**
 * Rola com vantagem (2d20, pega o maior)
 */
export function rollWithAdvantage(modifier: number = 0, description?: string): RollResult {
  const roll1 = rollDie('d20');
  const roll2 = rollDie('d20');

  const rolls: DiceRoll[] = [
    { die: 'd20', result: roll1, dropped: roll1 < roll2 },
    { die: 'd20', result: roll2, dropped: roll2 < roll1 },
  ];

  const bestRoll = Math.max(roll1, roll2);
  const total = bestRoll + modifier;

  return {
    rolls,
    modifier,
    total,
    type: 'advantage',
    isCritical: bestRoll === 20,
    isCriticalFail: bestRoll === 1,
    timestamp: Date.now(),
    description,
  };
}

/**
 * Rola com desvantagem (2d20, pega o menor)
 */
export function rollWithDisadvantage(modifier: number = 0, description?: string): RollResult {
  const roll1 = rollDie('d20');
  const roll2 = rollDie('d20');

  const rolls: DiceRoll[] = [
    { die: 'd20', result: roll1, dropped: roll1 > roll2 },
    { die: 'd20', result: roll2, dropped: roll2 > roll1 },
  ];

  const worstRoll = Math.min(roll1, roll2);
  const total = worstRoll + modifier;

  return {
    rolls,
    modifier,
    total,
    type: 'disadvantage',
    isCritical: worstRoll === 20,
    isCriticalFail: worstRoll === 1,
    timestamp: Date.now(),
    description,
  };
}

/**
 * Rola normalmente
 */
export function rollNormal(
  count: number,
  diceType: DiceType,
  modifier: number = 0,
  description?: string
): RollResult {
  const rolls = rollDice(count, diceType);
  const sum = rolls.reduce((acc, roll) => acc + roll.result, 0);
  const total = sum + modifier;

  // Verificar críticos apenas para d20
  const isCritical = diceType === 'd20' && count === 1 && rolls[0].result === 20;
  const isCriticalFail = diceType === 'd20' && count === 1 && rolls[0].result === 1;

  return {
    rolls,
    modifier,
    total,
    type: 'normal',
    isCritical,
    isCriticalFail,
    timestamp: Date.now(),
    description,
  };
}

/**
 * Rola baseado no tipo (normal/vantagem/desvantagem)
 */
export function roll(
  count: number,
  diceType: DiceType,
  modifier: number = 0,
  type: RollType = 'normal',
  description?: string
): RollResult {
  if (type === 'advantage') {
    return rollWithAdvantage(modifier, description);
  }
  if (type === 'disadvantage') {
    return rollWithDisadvantage(modifier, description);
  }
  return rollNormal(count, diceType, modifier, description);
}

/**
 * Formata resultado de rolagem para exibição
 * Ex: "2d6+3 = [4, 5] + 3 = 12"
 */
export function formatRollResult(result: RollResult): string {
  const diceNotation = formatDiceNotation(result.rolls);
  const rollValues = result.rolls.map((r) => (r.dropped ? `~~${r.result}~~` : r.result)).join(', ');

  const modifierStr =
    result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : '';

  return `${diceNotation}${modifierStr} = [${rollValues}]${modifierStr} = ${result.total}`;
}

/**
 * Formata notação de dados (ex: "2d6", "1d20")
 */
export function formatDiceNotation(rolls: DiceRoll[]): string {
  if (rolls.length === 0) return '';

  // Agrupar dados por tipo
  const groups = rolls.reduce(
    (acc, roll) => {
      if (!roll.dropped) {
        acc[roll.die] = (acc[roll.die] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(groups)
    .map(([die, count]) => (count > 1 ? `${count}${die}` : die))
    .join(' + ');
}

/**
 * Retorna nome legível do tipo de dado
 */
export function getDiceName(diceType: DiceType): string {
  const names: Record<DiceType, string> = {
    d4: 'D4',
    d6: 'D6',
    d8: 'D8',
    d10: 'D10',
    d12: 'D12',
    d20: 'D20',
    d100: 'D100',
  };
  return names[diceType];
}

/**
 * Retorna cor do dado
 */
export function getDiceColor(diceType: DiceType): string {
  const colors: Record<DiceType, string> = {
    d4: 'text-green-600 dark:text-green-400',
    d6: 'text-blue-600 dark:text-blue-400',
    d8: 'text-purple-600 dark:text-purple-400',
    d10: 'text-orange-600 dark:text-orange-400',
    d12: 'text-red-600 dark:text-red-400',
    d20: 'text-deep-purple dark:text-deep-purple',
    d100: 'text-yellow-600 dark:text-yellow-400',
  };
  return colors[diceType];
}

/**
 * Retorna classe de cor de fundo para o dado
 */
export function getDiceBackgroundColor(diceType: DiceType): string {
  const colors: Record<DiceType, string> = {
    d4: 'bg-green-100 dark:bg-green-900/20',
    d6: 'bg-blue-100 dark:bg-blue-900/20',
    d8: 'bg-purple-100 dark:bg-purple-900/20',
    d10: 'bg-orange-100 dark:bg-orange-900/20',
    d12: 'bg-red-100 dark:bg-red-900/20',
    d20: 'bg-deep-purple/10',
    d100: 'bg-yellow-100 dark:bg-yellow-900/20',
  };
  return colors[diceType];
}

/**
 * Formata timestamp para exibição
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Calcula estatísticas de múltiplas rolagens
 */
export interface RollStats {
  count: number;
  average: number;
  min: number;
  max: number;
  criticals: number;
  criticalFails: number;
}

export function calculateRollStats(results: RollResult[]): RollStats {
  if (results.length === 0) {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      criticals: 0,
      criticalFails: 0,
    };
  }

  const totals = results.map((r) => r.total);
  const sum = totals.reduce((acc, val) => acc + val, 0);

  return {
    count: results.length,
    average: Math.round(sum / results.length),
    min: Math.min(...totals),
    max: Math.max(...totals),
    criticals: results.filter((r) => r.isCritical).length,
    criticalFails: results.filter((r) => r.isCriticalFail).length,
  };
}

// Rolagens rápidas comuns
export const QUICK_ROLLS = {
  initiative: { name: 'Iniciativa', dice: 1, type: 'd20' as DiceType },
  deathSave: { name: 'Teste de Morte', dice: 1, type: 'd20' as DiceType },
  inspiration: { name: 'Inspiração', dice: 1, type: 'd20' as DiceType },
};
