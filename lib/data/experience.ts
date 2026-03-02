/**
 * Sistema de Experiência e Progressão de Nível D&D 5e
 */

// Tabela oficial de XP por nível do D&D 5e
export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

// Bônus de proficiência por nível
export const PROFICIENCY_BONUS_TABLE: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

/**
 * Calcula o nível baseado no XP atual
 */
export function calculateLevel(xp: number): number {
  for (let level = 20; level >= 1; level--) {
    if (xp >= XP_TABLE[level]) {
      return level;
    }
  }
  return 1;
}

/**
 * Retorna XP necessário para o próximo nível
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= 20) return XP_TABLE[20];
  return XP_TABLE[currentLevel + 1];
}

/**
 * Retorna XP necessário para o nível atual
 */
export function getXPForCurrentLevel(level: number): number {
  return XP_TABLE[level] || 0;
}

/**
 * Calcula progresso de XP até o próximo nível (0-100%)
 */
export function calculateXPProgress(currentXP: number, currentLevel: number): number {
  if (currentLevel >= 20) return 100;

  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
}

/**
 * Verifica se pode subir de nível
 */
export function canLevelUp(currentXP: number, currentLevel: number): boolean {
  if (currentLevel >= 20) return false;
  return currentXP >= getXPForNextLevel(currentLevel);
}

/**
 * Calcula bônus de proficiência baseado no nível
 */
export function getProficiencyBonus(level: number): number {
  return PROFICIENCY_BONUS_TABLE[level] || 2;
}

/**
 * Adiciona XP e retorna novo XP e nível
 */
export function addExperience(
  currentXP: number,
  xpToAdd: number,
  currentLevel: number
): {
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
} {
  const newXP = currentXP + xpToAdd;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > currentLevel;

  return {
    newXP,
    newLevel,
    leveledUp,
  };
}

/**
 * Formata número de XP com separador de milhares
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString('pt-BR');
}

/**
 * Tabela de XP por CR (Challenge Rating) para encontros
 */
export const XP_BY_CR: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

/**
 * Níveis em que personagens ganham Ability Score Improvement
 */
export const ASI_LEVELS = [4, 8, 12, 16, 19];

/**
 * Verifica se um nível concede ASI
 */
export function grantsASI(level: number): boolean {
  return ASI_LEVELS.includes(level);
}
