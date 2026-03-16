/**
 * Sistema de Efeitos de Optional Features
 * Aplica bônus automáticos de Fighting Styles e outras features
 */

import type { Weapon } from './weapons';
import type { Armor } from './armors';

export interface FeatureEffect {
  featureId: string;
  type: 'attack' | 'damage' | 'ac' | 'other';
  bonus: number;
  condition?: (item: Weapon | Armor, context?: Record<string, unknown>) => boolean;
  description: string;
}

/**
 * Mapeamento de features e seus efeitos
 */
export const FEATURE_EFFECTS: Record<string, FeatureEffect[]> = {
  // Fighting Styles
  archery: [
    {
      featureId: 'archery',
      type: 'attack',
      bonus: 2,
      condition: (item) => {
        if ('category' in item) {
          const weapon = item as Weapon;
          return (
            weapon.category === 'Simples à Distância' || weapon.category === 'Marcial à Distância'
          );
        }
        return false;
      },
      description: '+2 ataque com armas à distância',
    },
  ],
  defense: [
    {
      featureId: 'defense',
      type: 'ac',
      bonus: 1,
      condition: (item) => {
        if ('category' in item) {
          const armor = item as Armor;
          return armor.category !== 'Escudo';
        }
        return false;
      },
      description: '+1 CA enquanto usar armadura',
    },
  ],
  dueling: [
    {
      featureId: 'dueling',
      type: 'damage',
      bonus: 2,
      condition: (item, context) => {
        if ('category' in item) {
          const weapon = item as Weapon;
          const isMelee =
            weapon.category === 'Simples Corpo a Corpo' ||
            weapon.category === 'Marcial Corpo a Corpo';
          const isOneHanded = !weapon.properties?.includes('Duas Mãos');
          // Precisa verificar se não está usando arma na outra mão (context teria essa info)
          return isMelee && isOneHanded;
        }
        return false;
      },
      description: '+2 dano com arma corpo a corpo de uma mão',
    },
  ],
  'great-weapon-fighting': [
    // Este é um efeito especial que permite reroll, não um bônus numérico
    // Vamos apenas marcar como tendo o efeito
  ],
  protection: [
    // Efeito tático, não numérico
  ],
  'two-weapon-fighting': [
    // Efeito que adiciona modificador ao off-hand, não implementaremos agora
  ],
  'blind-fighting': [
    // Efeito de visão cega, não numérico
  ],
  'unarmed-fighting': [
    // Efeito para ataques desarmados, não implementaremos agora
  ],
};

/**
 * Calcula bônus de ataque de todas as features aplicáveis
 */
export function calculateFeatureAttackBonus(
  weapon: Weapon,
  activeFeatures: string[],
  context?: Record<string, unknown>
): number {
  let totalBonus = 0;

  for (const featureId of activeFeatures) {
    const effects = FEATURE_EFFECTS[featureId];
    if (!effects) continue;

    for (const effect of effects) {
      if (effect.type === 'attack') {
        if (!effect.condition || effect.condition(weapon, context)) {
          totalBonus += effect.bonus;
        }
      }
    }
  }

  return totalBonus;
}

/**
 * Calcula bônus de dano de todas as features aplicáveis
 */
export function calculateFeatureDamageBonus(
  weapon: Weapon,
  activeFeatures: string[],
  context?: Record<string, unknown>
): number {
  let totalBonus = 0;

  for (const featureId of activeFeatures) {
    const effects = FEATURE_EFFECTS[featureId];
    if (!effects) continue;

    for (const effect of effects) {
      if (effect.type === 'damage') {
        if (!effect.condition || effect.condition(weapon, context)) {
          totalBonus += effect.bonus;
        }
      }
    }
  }

  return totalBonus;
}

/**
 * Calcula bônus de CA de todas as features aplicáveis
 */
export function calculateFeatureACBonus(
  armor: Armor | null,
  activeFeatures: string[],
  context?: Record<string, unknown>
): number {
  if (!armor) return 0;

  let totalBonus = 0;

  for (const featureId of activeFeatures) {
    const effects = FEATURE_EFFECTS[featureId];
    if (!effects) continue;

    for (const effect of effects) {
      if (effect.type === 'ac') {
        if (!effect.condition || effect.condition(armor, context)) {
          totalBonus += effect.bonus;
        }
      }
    }
  }

  return totalBonus;
}

/**
 * Retorna descrição dos efeitos ativos para um item
 */
export function getActiveFeatureEffects(
  item: Weapon | Armor,
  activeFeatures: string[],
  context?: Record<string, unknown>
): string[] {
  const descriptions: string[] = [];

  for (const featureId of activeFeatures) {
    const effects = FEATURE_EFFECTS[featureId];
    if (!effects) continue;

    for (const effect of effects) {
      if (!effect.condition || effect.condition(item, context)) {
        descriptions.push(effect.description);
      }
    }
  }

  return descriptions;
}
