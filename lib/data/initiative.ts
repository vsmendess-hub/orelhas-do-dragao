/**
 * Sistema de Initiative Tracker para Combate D&D 5e
 */

export type CombatantType = 'player' | 'ally' | 'enemy' | 'neutral';

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  type: CombatantType;
  hp?: {
    current: number;
    max: number;
  };
  ac?: number;
  conditions?: string[];
  characterId?: string; // Se for um PC, link para o personagem
}

export interface Combat {
  id: string;
  round: number;
  currentTurn: number; // Index do combatente na lista ordenada
  combatants: Combatant[];
  startedAt: string;
}

export const COMBATANT_TYPE_LABELS: Record<CombatantType, string> = {
  player: 'Jogador',
  ally: 'Aliado',
  enemy: 'Inimigo',
  neutral: 'Neutro',
};

export const COMBATANT_TYPE_COLORS: Record<CombatantType, string> = {
  player: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500',
  ally: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500',
  enemy: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500',
  neutral: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500',
};

/**
 * Cria novo combatente
 */
export function createCombatant(
  name: string,
  initiative: number,
  type: CombatantType,
  options?: {
    hp?: { current: number; max: number };
    ac?: number;
    characterId?: string;
  }
): Combatant {
  return {
    id: crypto.randomUUID(),
    name,
    initiative,
    type,
    hp: options?.hp,
    ac: options?.ac,
    characterId: options?.characterId,
    conditions: [],
  };
}

/**
 * Ordena combatentes por iniciativa (maior primeiro)
 */
export function sortByInitiative(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => b.initiative - a.initiative);
}

/**
 * Próximo turno
 */
export function nextTurn(combat: Combat): Combat {
  const sortedCombatants = sortByInitiative(combat.combatants);
  let nextTurn = combat.currentTurn + 1;
  let nextRound = combat.round;

  // Se passou de todos, volta pro primeiro e incrementa rodada
  if (nextTurn >= sortedCombatants.length) {
    nextTurn = 0;
    nextRound += 1;
  }

  return {
    ...combat,
    currentTurn: nextTurn,
    round: nextRound,
  };
}

/**
 * Turno anterior
 */
export function previousTurn(combat: Combat): Combat {
  const sortedCombatants = sortByInitiative(combat.combatants);
  let prevTurn = combat.currentTurn - 1;
  let prevRound = combat.round;

  // Se voltou antes do primeiro, vai pro último e decrementa rodada
  if (prevTurn < 0) {
    prevTurn = sortedCombatants.length - 1;
    prevRound = Math.max(1, prevRound - 1);
  }

  return {
    ...combat,
    currentTurn: prevTurn,
    round: prevRound,
  };
}

/**
 * Adiciona combatente
 */
export function addCombatant(combat: Combat, combatant: Combatant): Combat {
  return {
    ...combat,
    combatants: [...combat.combatants, combatant],
  };
}

/**
 * Remove combatente
 */
export function removeCombatant(combat: Combat, combatantId: string): Combat {
  const sortedCombatants = sortByInitiative(combat.combatants);
  const currentCombatant = sortedCombatants[combat.currentTurn];
  const newCombatants = combat.combatants.filter((c) => c.id !== combatantId);
  const newSorted = sortByInitiative(newCombatants);

  // Ajustar currentTurn se necessário
  let newCurrentTurn = combat.currentTurn;
  if (currentCombatant) {
    const newIndex = newSorted.findIndex((c) => c.id === currentCombatant.id);
    if (newIndex !== -1) {
      newCurrentTurn = newIndex;
    } else if (combat.currentTurn >= newSorted.length) {
      newCurrentTurn = Math.max(0, newSorted.length - 1);
    }
  }

  return {
    ...combat,
    combatants: newCombatants,
    currentTurn: newCurrentTurn,
  };
}

/**
 * Atualiza HP de combatente
 */
export function updateCombatantHP(combat: Combat, combatantId: string, newCurrent: number): Combat {
  return {
    ...combat,
    combatants: combat.combatants.map((c) =>
      c.id === combatantId && c.hp
        ? { ...c, hp: { ...c.hp, current: Math.max(0, Math.min(newCurrent, c.hp.max)) } }
        : c
    ),
  };
}

/**
 * Adiciona condição a combatente
 */
export function addConditionToCombatant(
  combat: Combat,
  combatantId: string,
  condition: string
): Combat {
  return {
    ...combat,
    combatants: combat.combatants.map((c) =>
      c.id === combatantId ? { ...c, conditions: [...(c.conditions || []), condition] } : c
    ),
  };
}

/**
 * Inicia novo combate
 */
export function startCombat(combatants: Combatant[]): Combat {
  return {
    id: crypto.randomUUID(),
    round: 1,
    currentTurn: 0,
    combatants,
    startedAt: new Date().toISOString(),
  };
}

/**
 * Reseta combate
 */
export function resetCombat(): Combat | null {
  return null;
}
