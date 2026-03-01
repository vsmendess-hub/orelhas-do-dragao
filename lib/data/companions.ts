/**
 * Sistema de Companheiros (Familiares, Animais, NPCs)
 */

export type CompanionType = 'familiar' | 'beast' | 'npc' | 'summon' | 'other';

export interface Companion {
  id: string;
  name: string;
  type: CompanionType;
  race?: string; // Ex: "Corvo", "Lobo", "Humano"
  class?: string; // Para NPCs
  level?: number;
  hp: {
    current: number;
    max: number;
  };
  ac: number;
  speed: number;
  abilities: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills?: string[];
  features?: string[];
  notes?: string;
  active: boolean; // Se está com o personagem no momento
  createdAt: string;
}

export const EMPTY_COMPANION: Omit<Companion, 'id' | 'createdAt'> = {
  name: '',
  type: 'beast',
  hp: { current: 10, max: 10 },
  ac: 10,
  speed: 30,
  abilities: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  active: true,
};

export const COMPANION_TYPE_LABELS: Record<CompanionType, string> = {
  familiar: 'Familiar',
  beast: 'Besta',
  npc: 'NPC',
  summon: 'Conjuração',
  other: 'Outro',
};

export const COMPANION_TYPE_ICONS: Record<CompanionType, string> = {
  familiar: '🦉',
  beast: '🐺',
  npc: '🧙',
  summon: '✨',
  other: '🎭',
};

/**
 * Templates comuns de companheiros
 */
export const COMPANION_TEMPLATES: Record<string, Partial<Companion>> = {
  // Familiares
  raven: {
    name: 'Corvo',
    type: 'familiar',
    race: 'Corvo',
    hp: { current: 1, max: 1 },
    ac: 12,
    speed: 10,
    abilities: { str: 2, dex: 14, con: 8, int: 2, wis: 12, cha: 6 },
    features: ['Voo 50 pés', 'Mímica'],
  },
  cat: {
    name: 'Gato',
    type: 'familiar',
    race: 'Gato',
    hp: { current: 2, max: 2 },
    ac: 12,
    speed: 40,
    abilities: { str: 3, dex: 15, con: 10, int: 3, wis: 12, cha: 7 },
    features: ['Sentidos Aguçados', 'Garras'],
  },
  owl: {
    name: 'Coruja',
    type: 'familiar',
    race: 'Coruja',
    hp: { current: 1, max: 1 },
    ac: 11,
    speed: 5,
    abilities: { str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7 },
    features: ['Voo 60 pés', 'Visão no Escuro', 'Sentidos Aguçados'],
  },

  // Bestas
  wolf: {
    name: 'Lobo',
    type: 'beast',
    race: 'Lobo',
    hp: { current: 11, max: 11 },
    ac: 13,
    speed: 40,
    abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
    features: ['Sentidos Aguçados', 'Mordida +4 (2d4+2)'],
    skills: ['Percepção +3', 'Furtividade +4'],
  },
  bear: {
    name: 'Urso',
    type: 'beast',
    race: 'Urso Pardo',
    hp: { current: 34, max: 34 },
    ac: 11,
    speed: 40,
    abilities: { str: 19, dex: 10, con: 16, int: 2, wis: 13, cha: 7 },
    features: ['Sentidos Aguçados', 'Garras +6 (2d6+4)', 'Mordida +6 (1d8+4)'],
    skills: ['Percepção +3'],
  },
  hawk: {
    name: 'Falcão',
    type: 'beast',
    race: 'Falcão',
    hp: { current: 1, max: 1 },
    ac: 13,
    speed: 10,
    abilities: { str: 5, dex: 16, con: 8, int: 2, wis: 14, cha: 6 },
    features: ['Voo 60 pés', 'Sentidos Aguçados', 'Garras +5 (1)'],
  },
};

/**
 * Calcula modificador de habilidade
 */
export function calculateCompanionModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Atualiza HP do companheiro
 */
export function updateCompanionHP(companion: Companion, newCurrent: number): Companion {
  return {
    ...companion,
    hp: {
      ...companion.hp,
      current: Math.max(0, Math.min(newCurrent, companion.hp.max)),
    },
  };
}

/**
 * Cura companheiro
 */
export function healCompanion(companion: Companion, amount: number): Companion {
  return updateCompanionHP(companion, companion.hp.current + amount);
}

/**
 * Causa dano ao companheiro
 */
export function damageCompanion(companion: Companion, amount: number): Companion {
  return updateCompanionHP(companion, companion.hp.current - amount);
}

/**
 * Ativa/desativa companheiro
 */
export function toggleCompanionActive(companion: Companion): Companion {
  return {
    ...companion,
    active: !companion.active,
  };
}

/**
 * Cria um novo companheiro a partir de um template
 */
export function createCompanionFromTemplate(
  templateKey: string,
  customizations?: Partial<Companion>
): Omit<Companion, 'id' | 'createdAt'> {
  const template = COMPANION_TEMPLATES[templateKey];
  if (!template) {
    return { ...EMPTY_COMPANION, ...customizations };
  }

  return {
    ...EMPTY_COMPANION,
    ...template,
    ...customizations,
  } as Omit<Companion, 'id' | 'createdAt'>;
}
