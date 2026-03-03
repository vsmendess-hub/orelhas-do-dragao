/**
 * Sistema de Goals (Objetivos) do Personagem
 * Objetivos pessoais, quests em andamento, metas de longo prazo
 */

export type GoalStatus = 'active' | 'completed' | 'failed' | 'abandoned';
export type GoalPriority = 'low' | 'medium' | 'high' | 'urgent';
export type GoalType = 'personal' | 'quest' | 'party' | 'longterm';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  deadline?: string; // Data limite opcional
  rewards?: string; // Recompensas esperadas
  notes?: string;
}

// Labels para tipos de goal
export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  personal: 'Pessoal',
  quest: 'Missão',
  party: 'Party',
  longterm: 'Longo Prazo',
};

// Ícones para tipos
export const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  personal: '🎯',
  quest: '⚔️',
  party: '👥',
  longterm: '🌟',
};

// Labels para status
export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Em Andamento',
  completed: 'Completo',
  failed: 'Falhado',
  abandoned: 'Abandonado',
};

// Cores para status
export const GOAL_STATUS_COLORS: Record<GoalStatus, string> = {
  active: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  failed: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  abandoned: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
};

// Labels para prioridade
export const GOAL_PRIORITY_LABELS: Record<GoalPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

// Cores para prioridade
export const GOAL_PRIORITY_COLORS: Record<GoalPriority, string> = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

/**
 * Cria um novo objetivo
 */
export function createGoal(
  type: GoalType,
  title: string,
  description: string,
  priority: GoalPriority = 'medium',
  options?: {
    deadline?: string;
    rewards?: string;
    notes?: string;
  }
): Omit<Goal, 'id'> {
  const now = new Date().toISOString();
  return {
    type,
    title,
    description,
    status: 'active',
    priority,
    createdAt: now,
    updatedAt: now,
    deadline: options?.deadline,
    rewards: options?.rewards,
    notes: options?.notes,
  };
}

/**
 * Atualiza um objetivo
 */
export function updateGoal(
  goal: Goal,
  updates: Partial<Omit<Goal, 'id' | 'createdAt'>>
): Goal {
  return {
    ...goal,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Marca objetivo como completo
 */
export function completeGoal(goal: Goal): Goal {
  return {
    ...goal,
    status: 'completed',
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Filtra objetivos por status
 */
export function filterGoalsByStatus(goals: Goal[], status: GoalStatus): Goal[] {
  return goals.filter((g) => g.status === status);
}

/**
 * Filtra objetivos ativos
 */
export function getActiveGoals(goals: Goal[]): Goal[] {
  return filterGoalsByStatus(goals, 'active');
}

/**
 * Ordena objetivos por prioridade (urgente primeiro)
 */
export function sortGoalsByPriority(goals: Goal[]): Goal[] {
  const priorityOrder: Record<GoalPriority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...goals].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Ordena objetivos por data de criação (mais recentes primeiro)
 */
export function sortGoalsByDate(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Formata data do objetivo
 */
export function formatGoalDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Verifica se objetivo está próximo do deadline
 */
export function isGoalOverdue(goal: Goal): boolean {
  if (!goal.deadline || goal.status !== 'active') return false;
  return new Date(goal.deadline) < new Date();
}

/**
 * Verifica se deadline está próximo (7 dias)
 */
export function isDeadlineClose(goal: Goal): boolean {
  if (!goal.deadline || goal.status !== 'active') return false;
  const deadline = new Date(goal.deadline);
  const now = new Date();
  const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntil > 0 && daysUntil <= 7;
}

// Empty state
export const EMPTY_GOAL: Omit<Goal, 'id'> = {
  type: 'personal',
  title: '',
  description: '',
  status: 'active',
  priority: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
