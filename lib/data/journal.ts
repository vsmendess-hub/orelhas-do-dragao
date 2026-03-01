/**
 * Sistema de Diário de Aventura
 */

export type EntryType = 'session' | 'note' | 'quest' | 'npc' | 'location' | 'treasure';

export interface JournalEntry {
  id: string;
  type: EntryType;
  title: string;
  content: string;
  date: string; // ISO date
  sessionNumber?: number;
  tags?: string[];
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  session: 'Sessão',
  note: 'Nota',
  quest: 'Missão',
  npc: 'NPC',
  location: 'Local',
  treasure: 'Tesouro',
};

export const ENTRY_TYPE_ICONS: Record<EntryType, string> = {
  session: '🎲',
  note: '📝',
  quest: '⚔️',
  npc: '👤',
  location: '🗺️',
  treasure: '💎',
};

export const ENTRY_TYPE_COLORS: Record<EntryType, string> = {
  session: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  note: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
  quest: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  npc: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  location: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  treasure: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
};

/**
 * Cria uma nova entrada de diário
 */
export function createJournalEntry(
  type: EntryType,
  title: string,
  content: string,
  options?: {
    sessionNumber?: number;
    tags?: string[];
    important?: boolean;
    date?: string;
  }
): Omit<JournalEntry, 'id'> {
  const now = new Date().toISOString();
  return {
    type,
    title,
    content,
    date: options?.date || now,
    sessionNumber: options?.sessionNumber,
    tags: options?.tags || [],
    important: options?.important || false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Atualiza uma entrada de diário
 */
export function updateJournalEntry(
  entry: JournalEntry,
  updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>
): JournalEntry {
  return {
    ...entry,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Filtra entradas por tipo
 */
export function filterEntriesByType(entries: JournalEntry[], type: EntryType): JournalEntry[] {
  return entries.filter((entry) => entry.type === type);
}

/**
 * Filtra entradas por tag
 */
export function filterEntriesByTag(entries: JournalEntry[], tag: string): JournalEntry[] {
  return entries.filter((entry) => entry.tags?.includes(tag));
}

/**
 * Busca entradas
 */
export function searchEntries(entries: JournalEntry[], query: string): JournalEntry[] {
  const lowerQuery = query.toLowerCase();
  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Ordena entradas por data (mais recentes primeiro)
 */
export function sortEntriesByDate(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Obtém entradas importantes
 */
export function getImportantEntries(entries: JournalEntry[]): JournalEntry[] {
  return entries.filter((entry) => entry.important);
}

/**
 * Obtém todas as tags únicas
 */
export function getAllTags(entries: JournalEntry[]): string[] {
  const tags = new Set<string>();
  entries.forEach((entry) => {
    entry.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Formata data para exibição
 */
export function formatEntryDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
