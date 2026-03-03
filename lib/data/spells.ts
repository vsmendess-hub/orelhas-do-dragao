/**
 * Sistema de Magias D&D 5e
 */

export type SpellSchool =
  | 'Abjuração'
  | 'Adivinhação'
  | 'Conjuração'
  | 'Encantamento'
  | 'Evocação'
  | 'Ilusão'
  | 'Necromancia'
  | 'Transmutação';

export type CastingTime = 'Ação' | 'Ação Bônus' | 'Reação' | '1 Minuto' | '10 Minutos' | '1 Hora';

export type SpellRange = string; // "Pessoal", "Toque", "30 pés", etc.

export type SpellDuration = string; // "Instantâneo", "Concentração, até 1 minuto", etc.

export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  materialDescription?: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: SpellSchool;
  castingTime: CastingTime;
  range: SpellRange;
  components: SpellComponents;
  duration: SpellDuration;
  ritual: boolean;
  concentration: boolean;
  description: string;
  atHigherLevels?: string;
  classes: string[]; // Classes que podem aprender
}

export interface CharacterSpell {
  spellId: string;
  spellName: string;
  spellLevel: number;
  prepared?: boolean; // Para classes que preparam
  alwaysPrepared?: boolean; // Domain spells, etc.
}

export interface SpellSlotState {
  level: number;
  total: number;
  used: number;
}

// Escolas de magia com ícones
export const SPELL_SCHOOLS: Record<SpellSchool, { icon: string; color: string }> = {
  Abjuração: { icon: '🛡️', color: 'blue' },
  Adivinhação: { icon: '🔮', color: 'purple' },
  Conjuração: { icon: '✨', color: 'green' },
  Encantamento: { icon: '💫', color: 'pink' },
  Evocação: { icon: '⚡', color: 'red' },
  Ilusão: { icon: '🎭', color: 'indigo' },
  Necromancia: { icon: '💀', color: 'gray' },
  Transmutação: { icon: '🔄', color: 'amber' },
};

// Componentes de magia
export const COMPONENT_LABELS: Record<string, string> = {
  verbal: 'V',
  somatic: 'S',
  material: 'M',
};

/**
 * Formata componentes de magia (V, S, M)
 */
export function formatComponents(components: SpellComponents): string {
  const parts: string[] = [];
  if (components.verbal) parts.push('V');
  if (components.somatic) parts.push('S');
  if (components.material) {
    if (components.materialDescription) {
      parts.push(`M (${components.materialDescription})`);
    } else {
      parts.push('M');
    }
  }
  return parts.join(', ');
}

/**
 * Formata nível de magia (0 = Cantrip, 1-9 = Círculo)
 */
export function formatSpellLevel(level: number): string {
  if (level === 0) return 'Cantrip';
  return `${level}º Círculo`;
}

/**
 * Calcula número de magias preparadas permitidas
 */
export function calculatePreparedSpellsLimit(
  characterClass: string,
  level: number,
  spellcastingAbilityModifier: number
): number | null {
  // Classes que preparam magias
  const preparingClasses = ['Mago', 'Clérigo', 'Druida', 'Paladino'];

  if (!preparingClasses.includes(characterClass)) {
    return null; // Classe não prepara magias
  }

  // Fórmula: Modificador de atributo + nível (mínimo 1)
  return Math.max(1, spellcastingAbilityModifier + level);
}

/**
 * Obtém atributo de conjuração por classe
 */
export function getSpellcastingAbility(characterClass: string): 'int' | 'wis' | 'cha' | null {
  const abilityMap: Record<string, 'int' | 'wis' | 'cha'> = {
    Mago: 'int',
    Feiticeiro: 'cha',
    Bruxo: 'cha',
    Bardo: 'cha',
    Clérigo: 'wis',
    Druida: 'wis',
    Ranger: 'wis',
    Paladino: 'cha',
    Artificer: 'int',
  };

  return abilityMap[characterClass] || null;
}

/**
 * Calcula DC de salvaguarda de magia
 */
export function calculateSpellSaveDC(
  proficiencyBonus: number,
  spellcastingAbilityModifier: number
): number {
  return 8 + proficiencyBonus + spellcastingAbilityModifier;
}

/**
 * Calcula bônus de ataque com magia
 */
export function calculateSpellAttackBonus(
  proficiencyBonus: number,
  spellcastingAbilityModifier: number
): number {
  return proficiencyBonus + spellcastingAbilityModifier;
}

/**
 * Agrupa magias por nível
 */
export function groupSpellsByLevel(spells: CharacterSpell[]): Record<number, CharacterSpell[]> {
  const grouped: Record<number, CharacterSpell[]> = {};

  spells.forEach((spell) => {
    if (!grouped[spell.spellLevel]) {
      grouped[spell.spellLevel] = [];
    }
    grouped[spell.spellLevel].push(spell);
  });

  return grouped;
}

/**
 * Filtra magias por nível
 */
export function filterSpellsByLevel(spells: CharacterSpell[], level: number): CharacterSpell[] {
  return spells.filter((spell) => spell.spellLevel === level);
}

/**
 * Conta magias preparadas
 */
export function countPreparedSpells(spells: CharacterSpell[]): number {
  return spells.filter((spell) => spell.prepared).length;
}
