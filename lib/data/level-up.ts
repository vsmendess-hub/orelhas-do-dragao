/**
 * Sistema de Level Up D&D 5e
 */

import { grantsASI, getProficiencyBonus } from './experience';

// Hit Dice por classe
export const HIT_DICE: Record<string, number> = {
  Bárbaro: 12,
  Guerreiro: 10,
  Paladino: 10,
  Ranger: 10,
  Clérigo: 8,
  Druida: 8,
  Monge: 8,
  Ladino: 8,
  Bardo: 8,
  Feiticeiro: 6,
  Mago: 6,
  Bruxo: 8,
  Artificer: 8,
};

// Média de HP por classe (arredondado para cima)
export const AVERAGE_HP_GAIN: Record<string, number> = {
  Bárbaro: 7,
  Guerreiro: 6,
  Paladino: 6,
  Ranger: 6,
  Clérigo: 5,
  Druida: 5,
  Monge: 5,
  Ladino: 5,
  Bardo: 5,
  Feiticeiro: 4,
  Mago: 4,
  Bruxo: 5,
  Artificer: 5,
};

export interface LevelUpData {
  newLevel: number;
  hpRoll?: number;
  hpGain: number;
  proficiencyBonus: number;
  grantsASI: boolean;
  abilityScoreIncrease?: {
    ability1: keyof AbilityScores;
    ability1Increase: number;
    ability2?: keyof AbilityScores;
    ability2Increase?: number;
  };
  // Para futuras expansões:
  // newFeatures?: string[];
  // newSpellsKnown?: number;
  // newSpellSlots?: Record<number, number>;
}

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

/**
 * Calcula HP ganho no level up
 */
export function calculateHPGain(
  characterClass: string,
  hpRoll: number | null,
  constitutionModifier: number
): number {
  const roll = hpRoll ?? AVERAGE_HP_GAIN[characterClass];
  return Math.max(1, roll + constitutionModifier);
}

/**
 * Rola dado de vida para HP
 */
export function rollHitDice(characterClass: string): number {
  const dice = HIT_DICE[characterClass] || 8;
  return Math.floor(Math.random() * dice) + 1;
}

/**
 * Valida increases de atributo (máximo +2 total, máximo 20 por atributo)
 */
export function validateAbilityIncrease(
  currentScores: AbilityScores,
  ability1: keyof AbilityScores,
  ability1Increase: number,
  ability2?: keyof AbilityScores,
  ability2Increase?: number
): { valid: boolean; error?: string } {
  // Verificar total de increases
  const totalIncrease = ability1Increase + (ability2Increase || 0);
  if (totalIncrease !== 2) {
    return { valid: false, error: 'Você deve distribuir exatamente 2 pontos' };
  }

  // Verificar máximo por atributo individual
  if (ability1Increase > 2 || (ability2Increase && ability2Increase > 2)) {
    return { valid: false, error: 'Máximo de +2 por atributo' };
  }

  // Verificar limite de 20
  if (currentScores[ability1] + ability1Increase > 20) {
    return { valid: false, error: `${ability1.toUpperCase()} não pode exceder 20` };
  }

  if (ability2 && ability2Increase && currentScores[ability2] + ability2Increase > 20) {
    return { valid: false, error: `${ability2.toUpperCase()} não pode exceder 20` };
  }

  // Verificar se não está tentando aumentar o mesmo atributo duas vezes com ability2
  if (ability2 && ability1 === ability2) {
    return { valid: false, error: 'Use o mesmo campo para aumentar o mesmo atributo' };
  }

  return { valid: true };
}

/**
 * Aplica ASI aos atributos
 */
export function applyAbilityIncrease(
  currentScores: AbilityScores,
  ability1: keyof AbilityScores,
  ability1Increase: number,
  ability2?: keyof AbilityScores,
  ability2Increase?: number
): AbilityScores {
  const newScores = { ...currentScores };

  newScores[ability1] = Math.min(20, newScores[ability1] + ability1Increase);

  if (ability2 && ability2Increase) {
    newScores[ability2] = Math.min(20, newScores[ability2] + ability2Increase);
  }

  return newScores;
}

/**
 * Prepara dados para level up
 */
export function prepareLevelUpData(
  currentLevel: number,
  characterClass: string,
  hpRoll: number | null,
  constitutionModifier: number
): Omit<LevelUpData, 'abilityScoreIncrease'> {
  const newLevel = currentLevel + 1;

  return {
    newLevel,
    hpRoll: hpRoll ?? undefined,
    hpGain: calculateHPGain(characterClass, hpRoll, constitutionModifier),
    proficiencyBonus: getProficiencyBonus(newLevel),
    grantsASI: grantsASI(newLevel),
  };
}

/**
 * Slots de magia por classe e nível (para futuro)
 */
export const SPELL_SLOTS_BY_CLASS: Record<string, Record<number, Record<number, number>>> = {
  // Exemplo para Mago (full caster)
  Mago: {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
  },
  // Adicionar outras classes conforme necessário
};
