/**
 * Sistema de Condições D&D 5e
 */

export type ConditionType =
  | 'blinded'
  | 'charmed'
  | 'deafened'
  | 'frightened'
  | 'grappled'
  | 'incapacitated'
  | 'invisible'
  | 'paralyzed'
  | 'petrified'
  | 'poisoned'
  | 'prone'
  | 'restrained'
  | 'stunned'
  | 'unconscious'
  | 'exhaustion';

export interface Condition {
  type: ConditionType;
  active: boolean;
  notes?: string;
  level?: number; // Para exhaustion (1-6)
}

export interface ConditionInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CONDITION_DETAILS: Record<ConditionType, ConditionInfo> = {
  blinded: {
    name: 'Cego',
    description:
      'Falha automaticamente em testes de habilidade que requerem visão. Ataques contra você têm vantagem, seus ataques têm desvantagem.',
    icon: '👁️',
    color: 'bg-gray-500',
  },
  charmed: {
    name: 'Enfeitiçado',
    description:
      'Não pode atacar o enfeitiçador ou ter ele como alvo de habilidades/efeitos mágicos prejudiciais. O enfeitiçador tem vantagem em testes sociais.',
    icon: '💖',
    color: 'bg-pink-500',
  },
  deafened: {
    name: 'Surdo',
    description:
      'Não pode ouvir e falha automaticamente em testes de habilidade que requerem audição.',
    icon: '🔇',
    color: 'bg-gray-500',
  },
  frightened: {
    name: 'Amedrontado',
    description:
      'Tem desvantagem em testes de habilidade e ataques enquanto a fonte do medo estiver em linha de visão. Não pode se aproximar voluntariamente da fonte.',
    icon: '😨',
    color: 'bg-yellow-500',
  },
  grappled: {
    name: 'Agarrado',
    description: 'Velocidade se torna 0 e não pode se beneficiar de bônus de velocidade.',
    icon: '🤝',
    color: 'bg-orange-500',
  },
  incapacitated: {
    name: 'Incapacitado',
    description: 'Não pode realizar ações ou reações.',
    icon: '🚫',
    color: 'bg-red-500',
  },
  invisible: {
    name: 'Invisível',
    description:
      'Impossível de ver sem magia ou sentido especial. Considerado fortemente obscurecido. Ataques contra você têm desvantagem, seus ataques têm vantagem.',
    icon: '👻',
    color: 'bg-blue-500',
  },
  paralyzed: {
    name: 'Paralisado',
    description:
      'Incapacitado, não pode se mover ou falar. Falha automaticamente em testes de Força e Destreza. Ataques contra você têm vantagem. Acertos a 5 pés são críticos.',
    icon: '⚡',
    color: 'bg-purple-500',
  },
  petrified: {
    name: 'Petrificado',
    description:
      'Transformado em substância inanimada (geralmente pedra). Peso multiplicado por 10. Incapacitado, não pode se mover ou falar. Resistência a todo dano. Imune a veneno e doença.',
    icon: '🗿',
    color: 'bg-stone-500',
  },
  poisoned: {
    name: 'Envenenado',
    description: 'Tem desvantagem em ataques e testes de habilidade.',
    icon: '🧪',
    color: 'bg-green-500',
  },
  prone: {
    name: 'Caído',
    description:
      'Só pode se rastejar ou se levantar (gasta metade do movimento). Desvantagem em ataques. Ataques a 5 pés têm vantagem, ataques à distância têm desvantagem.',
    icon: '⬇️',
    color: 'bg-amber-500',
  },
  restrained: {
    name: 'Contido',
    description:
      'Velocidade se torna 0. Ataques contra você têm vantagem, seus ataques têm desvantagem. Desvantagem em testes de resistência de Destreza.',
    icon: '⛓️',
    color: 'bg-slate-500',
  },
  stunned: {
    name: 'Atordoado',
    description:
      'Incapacitado, não pode se mover, fala apenas devagar. Falha automaticamente em testes de Força e Destreza. Ataques contra você têm vantagem.',
    icon: '💫',
    color: 'bg-indigo-500',
  },
  unconscious: {
    name: 'Inconsciente',
    description:
      'Incapacitado, não pode se mover ou falar, sem consciência do ambiente. Solta o que está segurando e cai. Falha automaticamente em testes de Força e Destreza. Ataques têm vantagem. Acertos a 5 pés são críticos.',
    icon: '😴',
    color: 'bg-gray-700',
  },
  exhaustion: {
    name: 'Exaustão',
    description:
      'Níveis 1-6 com efeitos cumulativos: 1=Desvantagem em testes; 2=Velocidade reduzida pela metade; 3=Desvantagem em ataques e resistências; 4=HP máximo reduzido pela metade; 5=Velocidade reduzida a 0; 6=Morte.',
    icon: '🥵',
    color: 'bg-red-600',
  },
};

export const EMPTY_CONDITIONS: Condition[] = Object.keys(CONDITION_DETAILS).map(
  (type) =>
    ({
      type: type as ConditionType,
      active: false,
    }) as Condition
);

/**
 * Ativa uma condição
 */
export function activateCondition(
  conditions: Condition[],
  type: ConditionType,
  notes?: string,
  level?: number
): Condition[] {
  return conditions.map((c) =>
    c.type === type
      ? {
          ...c,
          active: true,
          notes,
          level: type === 'exhaustion' ? level : undefined,
        }
      : c
  );
}

/**
 * Desativa uma condição
 */
export function deactivateCondition(conditions: Condition[], type: ConditionType): Condition[] {
  return conditions.map((c) =>
    c.type === type
      ? {
          ...c,
          active: false,
          notes: undefined,
          level: undefined,
        }
      : c
  );
}

/**
 * Atualiza nível de exaustão
 */
export function updateExhaustionLevel(conditions: Condition[], level: number): Condition[] {
  return conditions.map((c) =>
    c.type === 'exhaustion'
      ? {
          ...c,
          active: level > 0,
          level: level > 0 ? Math.min(6, level) : undefined,
        }
      : c
  );
}

/**
 * Obtém condições ativas
 */
export function getActiveConditions(conditions: Condition[]): Condition[] {
  return conditions.filter((c) => c.active);
}

/**
 * Verifica se tem alguma condição ativa
 */
export function hasActiveConditions(conditions: Condition[]): boolean {
  return conditions.some((c) => c.active);
}
