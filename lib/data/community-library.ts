/**
 * Sistema de Biblioteca da Comunidade D&D 5e
 */

import type { Character } from '@/lib/supabase/types';
import type { CharacterShare } from './character-sharing';

export interface CommunityCharacter {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background?: string;
  alignment?: string;
  shareInfo: CharacterShare;
  previewImage?: string;
}

export interface LibraryFilters {
  class: string | 'all';
  race: string | 'all';
  levelMin: number | 'all';
  levelMax: number | 'all';
  search: string;
  sortBy: LibrarySortBy;
}

export type LibrarySortBy =
  | 'recent'
  | 'popular'
  | 'level-asc'
  | 'level-desc'
  | 'name';

export const DEFAULT_LIBRARY_FILTERS: LibraryFilters = {
  class: 'all',
  race: 'all',
  levelMin: 'all',
  levelMax: 'all',
  search: '',
  sortBy: 'recent',
};

/**
 * Aplica filtros na biblioteca
 */
export function applyLibraryFilters(
  characters: CommunityCharacter[],
  filters: LibraryFilters
): CommunityCharacter[] {
  let filtered = [...characters];

  // Filtro por classe
  if (filters.class !== 'all') {
    filtered = filtered.filter((char) => char.class === filters.class);
  }

  // Filtro por raça
  if (filters.race !== 'all') {
    filtered = filtered.filter((char) => char.race === filters.race);
  }

  // Filtro por nível mínimo
  if (filters.levelMin !== 'all') {
    const minLevel = filters.levelMin as number;
    filtered = filtered.filter((char) => char.level >= minLevel);
  }

  // Filtro por nível máximo
  if (filters.levelMax !== 'all') {
    const maxLevel = filters.levelMax as number;
    filtered = filtered.filter((char) => char.level <= maxLevel);
  }

  // Busca por texto
  if (filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (char) =>
        char.name.toLowerCase().includes(searchLower) ||
        char.class.toLowerCase().includes(searchLower) ||
        char.race.toLowerCase().includes(searchLower) ||
        char.background?.toLowerCase().includes(searchLower) ||
        char.shareInfo.ownerName.toLowerCase().includes(searchLower)
    );
  }

  // Ordenação
  filtered = sortLibrary(filtered, filters.sortBy);

  return filtered;
}

/**
 * Ordena personagens da biblioteca
 */
export function sortLibrary(
  characters: CommunityCharacter[],
  sortBy: LibrarySortBy
): CommunityCharacter[] {
  const sorted = [...characters];

  switch (sortBy) {
    case 'recent':
      return sorted.sort(
        (a, b) =>
          new Date(b.shareInfo.createdAt).getTime() -
          new Date(a.shareInfo.createdAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.shareInfo.viewCount - a.shareInfo.viewCount);
    case 'level-asc':
      return sorted.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    case 'level-desc':
      return sorted.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Labels para ordenação
 */
export const SORT_LABELS: Record<LibrarySortBy, string> = {
  recent: 'Mais Recentes',
  popular: 'Mais Populares',
  'level-asc': 'Nível (Menor)',
  'level-desc': 'Nível (Maior)',
  name: 'Nome (A-Z)',
};

/**
 * Lista de classes D&D 5e
 */
export const DND_CLASSES = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
  'Patrulheiro',
];

/**
 * Lista de raças D&D 5e (principais)
 */
export const DND_RACES = [
  'Anão',
  'Elfo',
  'Halfling',
  'Humano',
  'Draconato',
  'Gnomo',
  'Meio-Elfo',
  'Meio-Orc',
  'Tiefling',
];

/**
 * Níveis para filtros
 */
export const LEVEL_RANGES = [
  { label: 'Iniciante (1-4)', min: 1, max: 4 },
  { label: 'Intermediário (5-10)', min: 5, max: 10 },
  { label: 'Avançado (11-16)', min: 11, max: 16 },
  { label: 'Épico (17-20)', min: 17, max: 20 },
];

/**
 * Conta personagens por filtro ativo
 */
export function countActiveLibraryFilters(filters: LibraryFilters): number {
  let count = 0;

  if (filters.class !== 'all') count++;
  if (filters.race !== 'all') count++;
  if (filters.levelMin !== 'all') count++;
  if (filters.levelMax !== 'all') count++;
  if (filters.search.trim()) count++;
  // sortBy não conta como filtro

  return count;
}

/**
 * Reseta filtros
 */
export function resetLibraryFilters(): LibraryFilters {
  return { ...DEFAULT_LIBRARY_FILTERS };
}

/**
 * Estatísticas da biblioteca
 */
export interface LibraryStats {
  totalCharacters: number;
  totalViews: number;
  mostPopularClass: string;
  mostPopularRace: string;
  averageLevel: number;
}

export function calculateLibraryStats(
  characters: CommunityCharacter[]
): LibraryStats {
  if (characters.length === 0) {
    return {
      totalCharacters: 0,
      totalViews: 0,
      mostPopularClass: 'N/A',
      mostPopularRace: 'N/A',
      averageLevel: 0,
    };
  }

  const totalViews = characters.reduce((sum, char) => sum + char.shareInfo.viewCount, 0);
  const averageLevel =
    characters.reduce((sum, char) => sum + char.level, 0) / characters.length;

  // Contar classes
  const classCounts: Record<string, number> = {};
  characters.forEach((char) => {
    classCounts[char.class] = (classCounts[char.class] || 0) + 1;
  });
  const mostPopularClass = Object.entries(classCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Contar raças
  const raceCounts: Record<string, number> = {};
  characters.forEach((char) => {
    raceCounts[char.race] = (raceCounts[char.race] || 0) + 1;
  });
  const mostPopularRace = Object.entries(raceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalCharacters: characters.length,
    totalViews,
    mostPopularClass,
    mostPopularRace,
    averageLevel: Math.round(averageLevel),
  };
}

/**
 * Transforma character completo em CommunityCharacter
 */
export function toCommunityCharacter(character: Character & { character_share?: CharacterShare; portrait_url?: string }): CommunityCharacter | null {
  if (!character.character_share) return null;
  if (character.character_share.visibility !== 'public') return null;

  return {
    id: character.id,
    name: character.name,
    race: character.race,
    class: character.class,
    level: character.level,
    background: character.background || undefined,
    alignment: character.alignment || undefined,
    shareInfo: character.character_share,
    previewImage: character.portrait_url || undefined,
  };
}

/**
 * Busca rápida (top N resultados)
 */
export function quickSearch(
  characters: CommunityCharacter[],
  query: string,
  limit: number = 5
): CommunityCharacter[] {
  if (!query.trim()) return [];

  const searchLower = query.toLowerCase();
  const results = characters.filter(
    (char) =>
      char.name.toLowerCase().includes(searchLower) ||
      char.class.toLowerCase().includes(searchLower) ||
      char.race.toLowerCase().includes(searchLower)
  );

  return results.slice(0, limit);
}

/**
 * Personagens em destaque (featured)
 */
export function getFeaturedCharacters(
  characters: CommunityCharacter[],
  count: number = 3
): CommunityCharacter[] {
  // Critério: mais visualizações
  const sorted = [...characters].sort((a, b) => b.shareInfo.viewCount - a.shareInfo.viewCount);
  return sorted.slice(0, count);
}

/**
 * Personagens relacionados (mesma classe ou raça)
 */
export function getRelatedCharacters(
  character: CommunityCharacter,
  allCharacters: CommunityCharacter[],
  count: number = 3
): CommunityCharacter[] {
  const related = allCharacters
    .filter((char) => char.id !== character.id)
    .filter((char) => char.class === character.class || char.race === character.race)
    .slice(0, count);

  return related;
}
