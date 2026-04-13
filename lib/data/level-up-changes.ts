/**
 * Calcula todas as mudanças ao subir de nível
 * Retorna bullets informativos para o jogador
 */

import { grantsASI, getProficiencyBonus } from './experience';
import { HIT_DICE, AVERAGE_HP_GAIN } from './level-up';

export interface LevelChange {
  level: number;
  changes: {
    hp: {
      averageGain: number;
      maxPossible: number; // Se rolar máximo
      minPossible: number; // Se rolar mínimo
      dice: string; // Ex: "1d8"
    };
    proficiencyBonus: {
      old: number;
      new: number;
      increased: boolean;
    };
    features: string[]; // Lista de features ganhas nesse nível
    asi: boolean; // Se ganha ASI nesse nível
    spellSlots?: {
      level: number;
      slots: number;
    }[]; // Novos slots de magia
    subclassChoice?: {
      level: number;
      description: string;
    };
  };
}

/**
 * Features ganhas por nível para cada classe
 */
const CLASS_FEATURES: Record<string, Record<number, string[]>> = {
  Guerreiro: {
    2: ['Action Surge (1 uso)'],
    3: ['Arquétipo Marcial (escolha seu arquétipo)'],
    4: [],
    5: ['Ataque Extra'],
    6: ['ASI adicional'],
    7: ['Feature do Arquétipo'],
    8: [],
    9: ['Indomável (1 uso)'],
    10: ['Feature do Arquétipo'],
    11: ['Ataque Extra (2)'],
    12: [],
    13: ['Indomável (2 usos)'],
    14: [],
    15: ['Feature do Arquétipo'],
    16: [],
    17: ['Action Surge (2 usos)', 'Indomável (3 usos)'],
    18: ['Feature do Arquétipo'],
    19: [],
    20: ['Ataque Extra (3)'],
  },
  Mago: {
    2: ['Tradição Arcana (escolha sua tradição)'],
    3: [],
    4: [],
    5: [],
    6: ['Feature da Tradição'],
    7: [],
    8: [],
    9: [],
    10: ['Feature da Tradição'],
    11: [],
    12: [],
    13: [],
    14: ['Feature da Tradição'],
    15: [],
    16: [],
    17: [],
    18: ['Maestria em Magias'],
    19: [],
    20: ['Assinatura de Magia'],
  },
  Clérigo: {
    2: ['Feature do Domínio', 'Canalizar Divindade (1 uso)'],
    3: [],
    4: [],
    5: ['Destruir Mortos-Vivos (CR 1/2)'],
    6: ['Canalizar Divindade (2 usos)', 'Feature do Domínio'],
    7: [],
    8: ['Feature do Domínio', 'Destruir Mortos-Vivos (CR 1)'],
    9: [],
    10: ['Intervenção Divina'],
    11: ['Destruir Mortos-Vivos (CR 2)'],
    12: [],
    13: [],
    14: ['Destruir Mortos-Vivos (CR 3)'],
    15: [],
    16: [],
    17: ['Feature do Domínio', 'Destruir Mortos-Vivos (CR 4)'],
    18: ['Canalizar Divindade (3 usos)'],
    19: [],
    20: ['Intervenção Divina Melhorada'],
  },
  // Adicionar outras classes conforme necessário
};

/**
 * Spell slots ganhos por nível (classes full casters)
 */
const SPELL_SLOTS_FULL_CASTER: Record<number, Record<number, number>> = {
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
};

/**
 * Classes que são full casters
 */
const FULL_CASTER_CLASSES = ['Clérigo', 'Druida', 'Feiticeiro', 'Mago', 'Bardo'];

/**
 * Calcula mudanças para um único nível
 */
export function calculateLevelChanges(
  fromLevel: number,
  toLevel: number,
  characterClass: string,
  constitutionModifier: number
): LevelChange {
  const hitDice = HIT_DICE[characterClass] || 8;
  const averageHPGain = AVERAGE_HP_GAIN[characterClass];

  const oldProf = getProficiencyBonus(fromLevel);
  const newProf = getProficiencyBonus(toLevel);

  // Features da classe
  const classFeatures = CLASS_FEATURES[characterClass]?.[toLevel] || [];

  // Spell slots (se for caster)
  let spellSlots: { level: number; slots: number }[] | undefined;
  if (FULL_CASTER_CLASSES.includes(characterClass)) {
    const oldSlots = SPELL_SLOTS_FULL_CASTER[fromLevel] || {};
    const newSlots = SPELL_SLOTS_FULL_CASTER[toLevel] || {};

    const changes: { level: number; slots: number }[] = [];
    for (const level in newSlots) {
      const levelNum = parseInt(level);
      const oldCount = oldSlots[levelNum] || 0;
      const newCount = newSlots[levelNum];
      if (newCount > oldCount) {
        changes.push({ level: levelNum, slots: newCount });
      }
    }
    if (changes.length > 0) {
      spellSlots = changes;
    }
  }

  // Subclass choice
  let subclassChoice;
  if (
    (characterClass === 'Clérigo' && toLevel === 1) ||
    (characterClass === 'Mago' && toLevel === 2) ||
    (characterClass === 'Guerreiro' && toLevel === 3)
  ) {
    subclassChoice = {
      level: toLevel,
      description: `Escolha seu ${characterClass === 'Clérigo' ? 'Domínio' : characterClass === 'Mago' ? 'Tradição Arcana' : 'Arquétipo Marcial'}`,
    };
  }

  return {
    level: toLevel,
    changes: {
      hp: {
        averageGain: Math.max(1, averageHPGain + constitutionModifier),
        maxPossible: Math.max(1, hitDice + constitutionModifier),
        minPossible: Math.max(1, 1 + constitutionModifier),
        dice: `1d${hitDice}`,
      },
      proficiencyBonus: {
        old: oldProf,
        new: newProf,
        increased: newProf > oldProf,
      },
      features: classFeatures,
      asi: grantsASI(toLevel),
      spellSlots,
      subclassChoice,
    },
  };
}

/**
 * Calcula todas as mudanças para múltiplos níveis
 */
export function calculateMultiLevelChanges(
  currentLevel: number,
  levelsToGain: number,
  characterClass: string,
  constitutionModifier: number
): LevelChange[] {
  const changes: LevelChange[] = [];

  for (let i = 1; i <= levelsToGain; i++) {
    const fromLevel = currentLevel + i - 1;
    const toLevel = currentLevel + i;

    if (toLevel > 20) break; // Máximo nível 20

    changes.push(calculateLevelChanges(fromLevel, toLevel, characterClass, constitutionModifier));
  }

  return changes;
}

/**
 * Formata mudanças para exibição
 */
export function formatLevelChanges(change: LevelChange): string[] {
  const bullets: string[] = [];

  // HP
  bullets.push(
    `💚 **HP**: +${change.changes.hp.averageGain} (média) ou role ${change.changes.hp.dice} + CON (min ${change.changes.hp.minPossible}, max ${change.changes.hp.maxPossible})`
  );

  // Proficiência
  if (change.changes.proficiencyBonus.increased) {
    bullets.push(
      `🎯 **Bônus de Proficiência**: ${change.changes.proficiencyBonus.old} → +${change.changes.proficiencyBonus.new}`
    );
  }

  // ASI
  if (change.changes.asi) {
    bullets.push(`⭐ **ASI**: Aumento de Atributo ou Talento`);
  }

  // Features
  if (change.changes.features.length > 0) {
    bullets.push(`✨ **Novas Features**: ${change.changes.features.join(', ')}`);
  }

  // Spell slots
  if (change.changes.spellSlots && change.changes.spellSlots.length > 0) {
    const slotsText = change.changes.spellSlots
      .map((s) => `${s.slots}x nível ${s.level}`)
      .join(', ');
    bullets.push(`🔮 **Espaços de Magia**: ${slotsText}`);
  }

  // Subclass
  if (change.changes.subclassChoice) {
    bullets.push(`🎓 **Escolha Importante**: ${change.changes.subclassChoice.description}`);
  }

  return bullets;
}
