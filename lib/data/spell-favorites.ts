/**
 * Sistema de Magias Favoritas D&D 5e
 */

import type { Spell, CharacterSpell } from './spells';

export interface SpellFavorite {
  spellId: string;
  spellName: string;
  spellLevel: number;
  addedAt: string; // ISO timestamp
  notes?: string; // Notas personalizadas sobre a magia
  quickCast?: boolean; // Marca como "quick cast" para acesso ultra-rápido
}

/**
 * Verifica se uma magia está nos favoritos
 */
export function isFavorite(favorites: SpellFavorite[], spellId: string): boolean {
  return favorites.some((fav) => fav.spellId === spellId);
}

/**
 * Adiciona uma magia aos favoritos
 */
export function addToFavorites(
  favorites: SpellFavorite[],
  spell: CharacterSpell
): SpellFavorite[] {
  // Não adicionar duplicatas
  if (isFavorite(favorites, spell.spellId)) {
    return favorites;
  }

  const newFavorite: SpellFavorite = {
    spellId: spell.spellId,
    spellName: spell.spellName,
    spellLevel: spell.spellLevel,
    addedAt: new Date().toISOString(),
    quickCast: false,
  };

  return [...favorites, newFavorite];
}

/**
 * Remove uma magia dos favoritos
 */
export function removeFromFavorites(
  favorites: SpellFavorite[],
  spellId: string
): SpellFavorite[] {
  return favorites.filter((fav) => fav.spellId !== spellId);
}

/**
 * Toggle quick cast status
 */
export function toggleQuickCast(
  favorites: SpellFavorite[],
  spellId: string
): SpellFavorite[] {
  return favorites.map((fav) =>
    fav.spellId === spellId ? { ...fav, quickCast: !fav.quickCast } : fav
  );
}

/**
 * Atualiza as notas de uma magia favorita
 */
export function updateFavoriteNotes(
  favorites: SpellFavorite[],
  spellId: string,
  notes: string
): SpellFavorite[] {
  return favorites.map((fav) => (fav.spellId === spellId ? { ...fav, notes } : fav));
}

/**
 * Agrupa favoritos por nível
 */
export function groupFavoritesByLevel(
  favorites: SpellFavorite[]
): Record<number, SpellFavorite[]> {
  return favorites.reduce(
    (acc, fav) => {
      if (!acc[fav.spellLevel]) {
        acc[fav.spellLevel] = [];
      }
      acc[fav.spellLevel].push(fav);
      return acc;
    },
    {} as Record<number, SpellFavorite[]>
  );
}

/**
 * Obtém apenas magias quick cast
 */
export function getQuickCastSpells(favorites: SpellFavorite[]): SpellFavorite[] {
  return favorites.filter((fav) => fav.quickCast);
}

/**
 * Ordena favoritos por diferentes critérios
 */
export type FavoriteSortBy = 'name' | 'level' | 'recent' | 'quickCast';

export function sortFavorites(
  favorites: SpellFavorite[],
  sortBy: FavoriteSortBy = 'name'
): SpellFavorite[] {
  const sorted = [...favorites];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.spellName.localeCompare(b.spellName));
    case 'level':
      return sorted.sort((a, b) => a.spellLevel - b.spellLevel || a.spellName.localeCompare(b.spellName));
    case 'recent':
      return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    case 'quickCast':
      return sorted.sort((a, b) => {
        if (a.quickCast === b.quickCast) return a.spellName.localeCompare(b.spellName);
        return a.quickCast ? -1 : 1;
      });
    default:
      return sorted;
  }
}

/**
 * Exporta favoritos para JSON
 */
export function exportFavorites(favorites: SpellFavorite[]): string {
  return JSON.stringify(favorites, null, 2);
}

/**
 * Importa favoritos de JSON
 */
export function importFavorites(jsonString: string): SpellFavorite[] | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) =>
          item.spellId &&
          item.spellName &&
          typeof item.spellLevel === 'number' &&
          item.addedAt
      );
    }
    return null;
  } catch {
    return null;
  }
}
