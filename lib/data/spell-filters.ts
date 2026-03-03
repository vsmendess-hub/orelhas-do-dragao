/**
 * Sistema Avançado de Filtros para Magias D&D 5e
 */

import type { Spell, SpellSchool, CastingTime } from './spells';

export interface SpellFilters {
  school: SpellSchool | 'all';
  level: number | 'all'; // 0-9 ou 'all'
  castingTime: CastingTime | 'all';
  range: 'self' | 'touch' | 'ranged' | 'all'; // Filtro simplificado
  concentration: boolean | 'all';
  ritual: boolean | 'all';
  components: {
    verbal: boolean | 'all';
    somatic: boolean | 'all';
    material: boolean | 'all';
  };
  search: string;
  class: string | 'all';
}

export const DEFAULT_FILTERS: SpellFilters = {
  school: 'all',
  level: 'all',
  castingTime: 'all',
  range: 'all',
  concentration: 'all',
  ritual: 'all',
  components: {
    verbal: 'all',
    somatic: 'all',
    material: 'all',
  },
  search: '',
  class: 'all',
};

/**
 * Aplica todos os filtros em uma lista de magias
 */
export function applySpellFilters(spells: Spell[], filters: SpellFilters): Spell[] {
  let filtered = [...spells];

  // Filtro por escola
  if (filters.school !== 'all') {
    filtered = filtered.filter((spell) => spell.school === filters.school);
  }

  // Filtro por nível
  if (filters.level !== 'all') {
    filtered = filtered.filter((spell) => spell.level === filters.level);
  }

  // Filtro por casting time
  if (filters.castingTime !== 'all') {
    filtered = filtered.filter((spell) => spell.castingTime === filters.castingTime);
  }

  // Filtro por range
  if (filters.range !== 'all') {
    filtered = filtered.filter((spell) => {
      const rangeLower = spell.range.toLowerCase();
      if (filters.range === 'self') return rangeLower.includes('pessoal');
      if (filters.range === 'touch') return rangeLower.includes('toque');
      if (filters.range === 'ranged') {
        // Ranged = não é pessoal nem toque
        return !rangeLower.includes('pessoal') && !rangeLower.includes('toque');
      }
      return true;
    });
  }

  // Filtro por concentração
  if (filters.concentration !== 'all') {
    filtered = filtered.filter((spell) => spell.concentration === filters.concentration);
  }

  // Filtro por ritual
  if (filters.ritual !== 'all') {
    filtered = filtered.filter((spell) => spell.ritual === filters.ritual);
  }

  // Filtro por componentes verbais
  if (filters.components.verbal !== 'all') {
    filtered = filtered.filter((spell) => spell.components.verbal === filters.components.verbal);
  }

  // Filtro por componentes somáticos
  if (filters.components.somatic !== 'all') {
    filtered = filtered.filter(
      (spell) => spell.components.somatic === filters.components.somatic
    );
  }

  // Filtro por componentes materiais
  if (filters.components.material !== 'all') {
    filtered = filtered.filter(
      (spell) => spell.components.material === filters.components.material
    );
  }

  // Filtro por classe
  if (filters.class !== 'all') {
    filtered = filtered.filter((spell) => spell.classes.includes(filters.class));
  }

  // Busca por texto
  if (filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (spell) =>
        spell.name.toLowerCase().includes(searchLower) ||
        spell.description.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Conta quantos filtros estão ativos
 */
export function countActiveFilters(filters: SpellFilters): number {
  let count = 0;

  if (filters.school !== 'all') count++;
  if (filters.level !== 'all') count++;
  if (filters.castingTime !== 'all') count++;
  if (filters.range !== 'all') count++;
  if (filters.concentration !== 'all') count++;
  if (filters.ritual !== 'all') count++;
  if (filters.components.verbal !== 'all') count++;
  if (filters.components.somatic !== 'all') count++;
  if (filters.components.material !== 'all') count++;
  if (filters.class !== 'all') count++;
  if (filters.search.trim()) count++;

  return count;
}

/**
 * Reseta todos os filtros
 */
export function resetFilters(): SpellFilters {
  return { ...DEFAULT_FILTERS };
}

/**
 * Labels para escolas de magia (já em português)
 */
export const SCHOOL_LABELS: Record<SpellSchool, string> = {
  'Abjuração': 'Abjuração',
  'Conjuração': 'Conjuração',
  'Adivinhação': 'Adivinhação',
  'Encantamento': 'Encantamento',
  'Evocação': 'Evocação',
  'Ilusão': 'Ilusão',
  'Necromancia': 'Necromancia',
  'Transmutação': 'Transmutação',
};

/**
 * Labels para casting time (já em português)
 */
export const CASTING_TIME_LABELS: Record<CastingTime, string> = {
  'Ação': 'Ação',
  'Ação Bônus': 'Ação Bônus',
  'Reação': 'Reação',
  '1 Minuto': '1 Minuto',
  '10 Minutos': '10 Minutos',
  '1 Hora': '1 Hora',
};

/**
 * Labels para range
 */
export const RANGE_LABELS = {
  self: 'Pessoal',
  touch: 'Toque',
  ranged: 'À Distância',
  all: 'Qualquer',
};

/**
 * Cria um preset de filtros
 */
export function createFilterPreset(
  name: string,
  filters: Partial<SpellFilters>
): SpellFilters {
  return {
    ...DEFAULT_FILTERS,
    ...filters,
  };
}

/**
 * Presets comuns de filtros
 */
export const FILTER_PRESETS = {
  combatSpells: createFilterPreset('Magias de Combate', {
    school: 'Evocação',
    castingTime: 'Ação',
  }),
  healingSpells: createFilterPreset('Magias de Cura', {
    search: 'curar',
  }),
  utilitySpells: createFilterPreset('Utilitárias', {
    ritual: true,
  }),
  quickSpells: createFilterPreset('Rápidas', {
    castingTime: 'Ação Bônus',
  }),
  defenseSpells: createFilterPreset('Defesa', {
    school: 'Abjuração',
  }),
  noConcentration: createFilterPreset('Sem Concentração', {
    concentration: false,
  }),
};

/**
 * Ordena magias por diferentes critérios
 */
export type SpellSortBy = 'name' | 'level' | 'school' | 'castingTime';

export function sortSpells(spells: Spell[], sortBy: SpellSortBy = 'name'): Spell[] {
  const sorted = [...spells];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'level':
      return sorted.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    case 'school':
      return sorted.sort(
        (a, b) => a.school.localeCompare(b.school) || a.name.localeCompare(b.name)
      );
    case 'castingTime':
      return sorted.sort(
        (a, b) => a.castingTime.localeCompare(b.castingTime) || a.name.localeCompare(b.name)
      );
    default:
      return sorted;
  }
}
