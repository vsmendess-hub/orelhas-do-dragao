/**
 * Ações de Combate D&D 5e
 */

export type ActionType =
  | 'attack'
  | 'cast_spell'
  | 'dash'
  | 'disengage'
  | 'dodge'
  | 'help'
  | 'hide'
  | 'ready'
  | 'use_object'
  | 'grapple'
  | 'shove';

export type BonusActionType =
  | 'offhand_attack'
  | 'cunning_action'
  | 'second_wind'
  | 'bonus_action_spell'
  | 'flurry_of_blows'
  | 'patient_defense'
  | 'step_of_the_wind';

export interface CombatAction {
  type: ActionType | BonusActionType;
  name: string;
  description: string;
  icon: string;
  category: 'action' | 'bonus_action' | 'reaction' | 'movement';
  cost?: string; // Ex: "1 Ki Point"
}

export const STANDARD_ACTIONS: CombatAction[] = [
  {
    type: 'attack',
    name: 'Atacar',
    description:
      'Faça um ataque corpo a corpo ou à distância. Você pode fazer múltiplos ataques se tiver a característica Extra Attack.',
    icon: '⚔️',
    category: 'action',
  },
  {
    type: 'cast_spell',
    name: 'Conjurar Magia',
    description:
      'Conjure uma magia que tenha tempo de conjuração de 1 ação. Consulte sua lista de magias.',
    icon: '✨',
    category: 'action',
  },
  {
    type: 'dash',
    name: 'Disparada',
    description:
      'Ganhe movimento extra igual à sua velocidade neste turno. Se sua velocidade é 30 pés, você pode mover 60 pés.',
    icon: '💨',
    category: 'action',
  },
  {
    type: 'disengage',
    name: 'Desengajar',
    description: 'Seu movimento não provoca ataques de oportunidade pelo resto do turno.',
    icon: '🏃',
    category: 'action',
  },
  {
    type: 'dodge',
    name: 'Esquivar',
    description:
      'Ataques contra você têm desvantagem e você tem vantagem em testes de resistência de Destreza até o início do seu próximo turno.',
    icon: '🛡️',
    category: 'action',
  },
  {
    type: 'help',
    name: 'Ajudar',
    description:
      'Ajude um aliado em uma tarefa ou ataque. O aliado tem vantagem no próximo teste de habilidade ou ataque contra uma criatura a 5 pés de você.',
    icon: '🤝',
    category: 'action',
  },
  {
    type: 'hide',
    name: 'Esconder',
    description:
      'Faça um teste de Destreza (Furtividade) para se esconder. Você deve estar fortemente obscurecido ou ter cobertura.',
    icon: '👤',
    category: 'action',
  },
  {
    type: 'ready',
    name: 'Preparar',
    description:
      'Escolha uma ação e uma condição. Quando a condição ocorrer, você pode usar sua reação para realizar a ação preparada.',
    icon: '⏱️',
    category: 'action',
  },
  {
    type: 'use_object',
    name: 'Usar Objeto',
    description: 'Interaja com um objeto do ambiente ou use um item de seu inventário.',
    icon: '🎒',
    category: 'action',
  },
  {
    type: 'grapple',
    name: 'Agarrar',
    description:
      'Faça um teste de Força (Atletismo) contestado pela Força (Atletismo) ou Destreza (Acrobacia) do alvo.',
    icon: '🤼',
    category: 'action',
  },
  {
    type: 'shove',
    name: 'Empurrar',
    description:
      'Empurre uma criatura ou derrube-a. Faça um teste de Força (Atletismo) contestado.',
    icon: '💥',
    category: 'action',
  },
];

export const BONUS_ACTIONS: CombatAction[] = [
  {
    type: 'offhand_attack',
    name: 'Ataque Extra (Mão Inábil)',
    description:
      'Se você atacou com uma arma leve em uma mão, pode atacar com outra arma leve na outra mão como ação bônus.',
    icon: '⚔️⚔️',
    category: 'bonus_action',
  },
  {
    type: 'second_wind',
    name: 'Recuperação',
    description: 'Recupere 1d10 + seu nível de guerreiro em pontos de vida.',
    icon: '❤️‍🩹',
    category: 'bonus_action',
    cost: '1 uso (Descanso Curto)',
  },
  {
    type: 'cunning_action',
    name: 'Ação Ardilosa',
    description:
      'Use Disparada, Desengajar ou Esconder como ação bônus (Característica de Ladino).',
    icon: '🎭',
    category: 'bonus_action',
  },
  {
    type: 'flurry_of_blows',
    name: 'Rajada de Golpes',
    description: 'Após usar a ação de Ataque, faça 2 ataques desarmados como ação bônus.',
    icon: '👊👊',
    category: 'bonus_action',
    cost: '1 Ponto de Ki',
  },
  {
    type: 'patient_defense',
    name: 'Defesa Paciente',
    description: 'Use a ação Esquivar como ação bônus.',
    icon: '🧘',
    category: 'bonus_action',
    cost: '1 Ponto de Ki',
  },
  {
    type: 'step_of_the_wind',
    name: 'Passo do Vento',
    description: 'Use Disparada ou Desengajar como ação bônus. Seu salto dobra neste turno.',
    icon: '🌪️',
    category: 'bonus_action',
    cost: '1 Ponto de Ki',
  },
];

/**
 * Filtra ações por categoria
 */
export function getActionsByCategory(category: 'action' | 'bonus_action'): CombatAction[] {
  if (category === 'action') {
    return STANDARD_ACTIONS;
  }
  return BONUS_ACTIONS;
}

/**
 * Busca ação por tipo
 */
export function getActionByType(type: ActionType | BonusActionType): CombatAction | undefined {
  return [...STANDARD_ACTIONS, ...BONUS_ACTIONS].find((action) => action.type === type);
}
