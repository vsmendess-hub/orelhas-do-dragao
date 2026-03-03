/**
 * Sistema de Progressão de Magias D&D 5e
 */

// Spell slots por nível de personagem e círculo de magia
export const SPELL_SLOTS: Record<string, Record<number, Record<number, number>>> = {
  // Full Casters (Wizard, Cleric, Druid, Bard, Sorcerer)
  'full-caster': {
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
  // Half Casters (Paladin, Ranger)
  'half-caster': {
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 },
    7: { 1: 4, 2: 3 },
    8: { 1: 4, 2: 3 },
    9: { 1: 4, 2: 3, 3: 2 },
    10: { 1: 4, 2: 3, 3: 2 },
    11: { 1: 4, 2: 3, 3: 3 },
    12: { 1: 4, 2: 3, 3: 3 },
    13: { 1: 4, 2: 3, 3: 3, 4: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 2 },
    16: { 1: 4, 2: 3, 3: 3, 4: 2 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  },
  // Third Casters (Eldritch Knight, Arcane Trickster)
  'third-caster': {
    3: { 1: 2 },
    4: { 1: 3 },
    5: { 1: 3 },
    6: { 1: 3 },
    7: { 1: 4, 2: 2 },
    8: { 1: 4, 2: 2 },
    9: { 1: 4, 2: 2 },
    10: { 1: 4, 2: 3 },
    11: { 1: 4, 2: 3 },
    12: { 1: 4, 2: 3 },
    13: { 1: 4, 2: 3, 3: 2 },
    14: { 1: 4, 2: 3, 3: 2 },
    15: { 1: 4, 2: 3, 3: 2 },
    16: { 1: 4, 2: 3, 3: 3 },
    17: { 1: 4, 2: 3, 3: 3 },
    18: { 1: 4, 2: 3, 3: 3 },
    19: { 1: 4, 2: 3, 3: 3, 4: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 1 },
  },
  // Warlock (Pact Magic - diferente)
  warlock: {
    1: { 1: 1 },
    2: { 1: 2 },
    3: { 2: 2 },
    4: { 2: 2 },
    5: { 3: 2 },
    6: { 3: 2 },
    7: { 4: 2 },
    8: { 4: 2 },
    9: { 5: 2 },
    10: { 5: 2 },
    11: { 5: 3 },
    12: { 5: 3 },
    13: { 5: 3 },
    14: { 5: 3 },
    15: { 5: 3 },
    16: { 5: 3 },
    17: { 5: 4 },
    18: { 5: 4 },
    19: { 5: 4 },
    20: { 5: 4 },
  },
};

// Classificação de classes por tipo de caster
export const CASTER_TYPE: Record<string, string> = {
  Mago: 'full-caster',
  Feiticeiro: 'full-caster',
  Clérigo: 'full-caster',
  Druida: 'full-caster',
  Bardo: 'full-caster',
  Paladino: 'half-caster',
  Ranger: 'half-caster',
  Bruxo: 'warlock',
  // Subclasses
  'Guerreiro (Eldritch Knight)': 'third-caster',
  'Ladino (Arcane Trickster)': 'third-caster',
  Artificer: 'half-caster',
};

// Cantrips conhecidos por nível
export const CANTRIPS_KNOWN: Record<string, Record<number, number>> = {
  'full-caster': {
    1: 3,
    4: 4,
    10: 5,
  },
  Mago: {
    1: 3,
    4: 4,
    10: 5,
  },
  Bardo: {
    1: 2,
    4: 3,
    10: 4,
  },
  Bruxo: {
    1: 2,
    4: 3,
    10: 4,
  },
};

// Magias conhecidas por nível (para classes que aprendem magias fixas)
export const SPELLS_KNOWN: Record<string, Record<number, number>> = {
  Bardo: {
    1: 4,
    2: 5,
    3: 6,
    4: 7,
    5: 8,
    6: 9,
    7: 10,
    8: 11,
    9: 12,
    10: 14,
    11: 15,
    12: 15,
    13: 16,
    14: 18,
    15: 19,
    16: 19,
    17: 20,
    18: 22,
    19: 22,
    20: 22,
  },
  Feiticeiro: {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 11,
    11: 12,
    12: 12,
    13: 13,
    14: 13,
    15: 14,
    16: 14,
    17: 15,
    18: 15,
    19: 15,
    20: 15,
  },
  Ranger: {
    2: 2,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 5,
    8: 5,
    9: 6,
    10: 6,
    11: 7,
    12: 7,
    13: 8,
    14: 8,
    15: 9,
    16: 9,
    17: 10,
    18: 10,
    19: 11,
    20: 11,
  },
  Bruxo: {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 10,
    11: 11,
    12: 11,
    13: 12,
    14: 12,
    15: 13,
    16: 13,
    17: 14,
    18: 14,
    19: 15,
    20: 15,
  },
};

/**
 * Obtém spell slots para um nível e classe
 */
export function getSpellSlots(characterClass: string, level: number): Record<number, number> {
  const casterType = CASTER_TYPE[characterClass];
  if (!casterType) return {};

  const slots = SPELL_SLOTS[casterType];
  if (!slots) return {};

  return slots[level] || {};
}

/**
 * Verifica se classe é conjuradora
 */
export function isSpellcaster(characterClass: string): boolean {
  return characterClass in CASTER_TYPE;
}

/**
 * Obtém número de cantrips conhecidos
 */
export function getCantripsKnown(characterClass: string, level: number): number {
  // Verificar tabela específica da classe
  if (characterClass in CANTRIPS_KNOWN) {
    const table = CANTRIPS_KNOWN[characterClass];
    // Pegar o valor mais alto até o nível atual
    let count = 0;
    for (const [lvl, num] of Object.entries(table)) {
      if (parseInt(lvl) <= level) {
        count = num;
      }
    }
    return count;
  }

  // Verificar tipo de caster
  const casterType = CASTER_TYPE[characterClass];
  if (casterType && casterType in CANTRIPS_KNOWN) {
    const table = CANTRIPS_KNOWN[casterType];
    let count = 0;
    for (const [lvl, num] of Object.entries(table)) {
      if (parseInt(lvl) <= level) {
        count = num;
      }
    }
    return count;
  }

  return 0;
}

/**
 * Obtém número de magias conhecidas
 */
export function getSpellsKnown(characterClass: string, level: number): number | null {
  if (!(characterClass in SPELLS_KNOWN)) {
    return null; // Classe prepara magias (Wizard, Cleric, Druid)
  }

  const table = SPELLS_KNOWN[characterClass];
  let count = 0;
  for (const [lvl, num] of Object.entries(table)) {
    if (parseInt(lvl) <= level) {
      count = num;
    }
  }
  return count;
}

/**
 * Obtém círculo máximo de magia
 */
export function getMaxSpellLevel(characterClass: string, level: number): number {
  const slots = getSpellSlots(characterClass, level);
  const circles = Object.keys(slots).map((k) => parseInt(k));
  return circles.length > 0 ? Math.max(...circles) : 0;
}
