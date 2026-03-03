/**
 * Sistema de Descanso D&D 5e
 */

import type { SpellSlotState } from './spells';
import type { ClassResource } from './class-resources';
import type { DeathSaves } from './death-saves';

export type RestType = 'short' | 'long';

export interface RestResult {
  hpRestored: number;
  newHP: number;
  spellSlotsRestored: SpellSlotState[];
  classResourcesRestored: ClassResource[];
  hitDiceUsed?: number;
  hitDiceRestored?: number;
  deathSavesReset?: boolean;
  message: string;
}

/**
 * Calcula hit dice disponível (metade do nível, mínimo 1)
 */
export function calculateAvailableHitDice(level: number, hitDiceUsed: number): number {
  return Math.max(0, level - hitDiceUsed);
}

/**
 * Processa Short Rest
 */
export function processShortRest(
  currentHP: number,
  maxHP: number,
  level: number,
  constitutionModifier: number,
  hitDiceUsed: number,
  hitDiceToSpend: number,
  characterClass: string,
  spellSlots: SpellSlotState[],
  classResources: ClassResource[]
): RestResult {
  // Validar hit dice disponível
  const available = calculateAvailableHitDice(level, hitDiceUsed);
  const actualDiceSpent = Math.min(hitDiceToSpend, available);

  // Calcular HP restaurado (rolar hit dice + CON mod por dado)
  // Para simplificar, vamos usar o valor médio do hit dice por classe
  const hitDiceValue = getAverageHitDice(characterClass);
  const hpPerDice = Math.max(1, hitDiceValue + constitutionModifier);
  const hpRestored = hpPerDice * actualDiceSpent;
  const newHP = Math.min(maxHP, currentHP + hpRestored);

  // Warlock recupera spell slots em short rest
  const restoredSpellSlots =
    characterClass === 'Bruxo' ? spellSlots.map((slot) => ({ ...slot, used: 0 })) : spellSlots;

  // Class resources que recuperam em short rest
  const restoredClassResources = classResources.map((resource) => {
    if (resource.recovery === 'short_rest') {
      return { ...resource, current: resource.max };
    }
    return resource;
  });

  return {
    hpRestored,
    newHP,
    hitDiceUsed: actualDiceSpent,
    spellSlotsRestored: restoredSpellSlots,
    classResourcesRestored: restoredClassResources,
    message: `Descanso Curto completado! Gastou ${actualDiceSpent} dados de vida e recuperou ${hpRestored} HP.`,
  };
}

/**
 * Processa Long Rest
 */
export function processLongRest(
  maxHP: number,
  level: number,
  hitDiceUsed: number,
  spellSlots: SpellSlotState[],
  classResources: ClassResource[],
  deathSaves: DeathSaves
): RestResult {
  // HP total restaurado
  const newHP = maxHP;
  const hpRestored = maxHP;

  // Recupera metade dos hit dice (mínimo 1)
  const hitDiceRestored = Math.max(1, Math.floor(level / 2));

  // Todos os spell slots restaurados
  const restoredSpellSlots = spellSlots.map((slot) => ({ ...slot, used: 0 }));

  // Todos os class resources restaurados
  const restoredClassResources = classResources.map((resource) => ({
    ...resource,
    current: resource.max,
  }));

  // Death saves resetados
  const shouldResetDeathSaves = deathSaves.successes > 0 || deathSaves.failures > 0;

  return {
    hpRestored,
    newHP,
    hitDiceRestored,
    spellSlotsRestored: restoredSpellSlots,
    classResourcesRestored: restoredClassResources,
    deathSavesReset: shouldResetDeathSaves,
    message: `Descanso Longo completado! HP totalmente restaurado, ${hitDiceRestored} dados de vida recuperados, e todos os recursos restaurados.`,
  };
}

/**
 * Obtém valor médio do hit dice por classe
 */
function getAverageHitDice(characterClass: string): number {
  const hitDiceMap: Record<string, number> = {
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

  return hitDiceMap[characterClass] || 5;
}

/**
 * Valida se pode fazer short rest
 */
export function canTakeShortRest(currentHP: number): { can: boolean; reason?: string } {
  if (currentHP === 0) {
    return { can: false, reason: 'Personagem está inconsciente (0 HP)' };
  }
  return { can: true };
}

/**
 * Valida se pode fazer long rest
 */
export function canTakeLongRest(currentHP: number): { can: boolean; reason?: string } {
  if (currentHP === 0) {
    return { can: false, reason: 'Personagem está inconsciente (0 HP)' };
  }
  return { can: true };
}
