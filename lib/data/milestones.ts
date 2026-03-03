/**
 * Sistema de Milestone Tracking
 * Alternativa à progressão por XP
 */

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completedAt: string;
  level?: number; // Nível associado quando completado
}

export interface MilestoneCategory {
  id: string;
  name: string;
  icon: string;
  examples: string[];
}

// Categorias sugeridas de milestones
export const MILESTONE_CATEGORIES: MilestoneCategory[] = [
  {
    id: 'story',
    name: 'História Principal',
    icon: '📖',
    examples: [
      'Completou Capítulo 1',
      'Derrotou o vilão principal',
      'Descobriu a conspiração',
      'Salvou a cidade',
    ],
  },
  {
    id: 'combat',
    name: 'Combate',
    icon: '⚔️',
    examples: [
      'Derrotou chefe de masmorra',
      'Sobreviveu a encontro mortal',
      'Venceu torneio de arena',
      'Liderou batalha épica',
    ],
  },
  {
    id: 'exploration',
    name: 'Exploração',
    icon: '🗺️',
    examples: [
      'Explorou toda a masmorra',
      'Descobriu local secreto',
      'Mapeou região desconhecida',
      'Encontrou artefato lendário',
    ],
  },
  {
    id: 'social',
    name: 'Social & Roleplay',
    icon: '💬',
    examples: [
      'Negociou aliança importante',
      'Resolveu conflito diplomaticamente',
      'Ganhou confiança de facção',
      'Completou quest pessoal',
    ],
  },
  {
    id: 'achievement',
    name: 'Conquistas',
    icon: '🏆',
    examples: [
      'Primeira morte heroica',
      'Momento de roleplay épico',
      'Salvou membro do party',
      'Decisão que mudou a campanha',
    ],
  },
];

// Milestones sugeridos por nível (D&D 5e padrão)
export const MILESTONE_LEVEL_SUGGESTIONS: Record<number, string[]> = {
  1: ['Começou a aventura', 'Formou o grupo'],
  2: ['Completou primeira missão', 'Explorou primeira masmorra'],
  3: ['Enfrentou primeiro chefe', 'Estabeleceu base de operações'],
  4: ['Ganhou reputação na região', 'Fez aliados importantes'],
  5: ['Completou arco narrativo', 'Derrotou ameaça regional'],
  6: ['Obteve equipamento mágico', 'Explorou plano diferente'],
  7: ['Enfrentou inimigo poderoso', 'Descobriu conspiração'],
  8: ['Liderou missão importante', 'Ganhou título ou posição'],
  9: ['Completou segunda campanha', 'Mudou destino de reino'],
  10: ['Alcançou fama continental', 'Enfrentou dragão ou similar'],
  11: ['Viajou para plano extraplanar', 'Obteve artefato lendário'],
  12: ['Derrotou lorde demônio/diabo', 'Salvou civilização'],
  13: ['Enfrentou deus menor', 'Mudou balanço cósmico'],
  14: ['Liderou exército épico', 'Completou quest planar'],
  15: ['Estabeleceu legado', 'Fundou organização poderosa'],
  16: ['Derrotou ameaça mundial', 'Obteve poder divino'],
  17: ['Enfrentou arquidiabo', 'Viajou no tempo ou espaço'],
  18: ['Mudou história do mundo', 'Salvou multiverso'],
  19: ['Desafiou forças primordiais', 'Obteve imortalidade'],
  20: ['Tornou-se lenda viva', 'Completou destino épico'],
};

/**
 * Cria novo milestone
 */
export function createMilestone(title: string, description: string, level?: number): Milestone {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    completedAt: new Date().toISOString(),
    level,
  };
}

/**
 * Formata data de milestone
 */
export function formatMilestoneDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Agrupa milestones por nível
 */
export function groupMilestonesByLevel(milestones: Milestone[]): Record<number, Milestone[]> {
  const grouped: Record<number, Milestone[]> = {};

  milestones.forEach((milestone) => {
    if (milestone.level) {
      if (!grouped[milestone.level]) {
        grouped[milestone.level] = [];
      }
      grouped[milestone.level].push(milestone);
    }
  });

  return grouped;
}

/**
 * Conta milestones por nível
 */
export function countMilestonesByLevel(milestones: Milestone[]): Record<number, number> {
  const counts: Record<number, number> = {};

  milestones.forEach((milestone) => {
    if (milestone.level) {
      counts[milestone.level] = (counts[milestone.level] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Obtém milestones recentes
 */
export function getRecentMilestones(milestones: Milestone[], count: number = 5): Milestone[] {
  return [...milestones]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, count);
}
