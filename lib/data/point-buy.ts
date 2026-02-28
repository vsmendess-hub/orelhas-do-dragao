/**
 * Sistema Point Buy D&D 5e
 * 27 pontos para distribuir
 * Valores base: 8-15
 */

export const POINT_BUY_BUDGET = 27;
export const MIN_ABILITY_SCORE = 8;
export const MAX_ABILITY_SCORE = 15;
export const MAX_FINAL_SCORE = 20; // Após bônus raciais

/**
 * Custo em pontos para cada valor de atributo
 */
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

/**
 * Calcular o custo total de um conjunto de atributos
 */
export function calculatePointBuyCost(abilities: {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}): number {
  return (
    POINT_BUY_COSTS[abilities.str] +
    POINT_BUY_COSTS[abilities.dex] +
    POINT_BUY_COSTS[abilities.con] +
    POINT_BUY_COSTS[abilities.int] +
    POINT_BUY_COSTS[abilities.wis] +
    POINT_BUY_COSTS[abilities.cha]
  );
}

/**
 * Calcular pontos restantes
 */
export function getRemainingPoints(abilities: {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}): number {
  return POINT_BUY_BUDGET - calculatePointBuyCost(abilities);
}

/**
 * Verificar se pode aumentar um atributo
 */
export function canIncreaseAbility(
  currentValue: number,
  currentTotal: number,
  budget: number = POINT_BUY_BUDGET
): boolean {
  if (currentValue >= MAX_ABILITY_SCORE) return false;

  const nextValue = currentValue + 1;
  const currentCost = POINT_BUY_COSTS[currentValue];
  const nextCost = POINT_BUY_COSTS[nextValue];
  const costDiff = nextCost - currentCost;

  return currentTotal + costDiff <= budget;
}

/**
 * Verificar se pode diminuir um atributo
 */
export function canDecreaseAbility(currentValue: number): boolean {
  return currentValue > MIN_ABILITY_SCORE;
}

/**
 * Calcular o modificador de um atributo
 * Modificador = (Valor - 10) / 2 (arredondado para baixo)
 */
export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Formatar modificador com sinal
 */
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Validar se a distribuição de atributos está completa
 */
export function isPointBuyValid(abilities: {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}): { valid: boolean; message?: string } {
  const cost = calculatePointBuyCost(abilities);
  const remaining = POINT_BUY_BUDGET - cost;

  if (remaining < 0) {
    return { valid: false, message: 'Você gastou mais pontos do que o permitido!' };
  }

  // Permitir avançar com pontos restantes (conforme ajuste do protótipo)
  return { valid: true };
}
