/**
 * Equipamentos Diversos do D&D 5e
 * Baseado no Player's Handbook (PHB)
 */

export type EquipmentCategory =
  | 'Equipamento de Aventura'
  | 'Kit de Ferramentas'
  | 'Instrumento Musical'
  | 'Kit de Jogo'
  | 'Montaria'
  | 'Veículo'
  | 'Poção'
  | 'Pergaminho'
  | 'Item Mágico'
  | 'Munição'
  | 'Outro';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  cost: { gold: number; silver?: number; copper?: number };
  weight: number; // em libras
  description?: string;
  source: string;
  page: number;
}

// ==================== EQUIPAMENTO DE AVENTURA ====================
export const ADVENTURING_GEAR: Equipment[] = [
  {
    id: 'backpack',
    name: 'Mochila',
    category: 'Equipamento de Aventura',
    cost: { gold: 2 },
    weight: 5,
    description: 'Capacidade de 1 pé cúbico / 30 libras de equipamento.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'bedroll',
    name: 'Saco de Dormir',
    category: 'Equipamento de Aventura',
    cost: { gold: 1 },
    weight: 7,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'rope-hempen-50',
    name: 'Corda de Cânhamo (50 pés)',
    category: 'Equipamento de Aventura',
    cost: { gold: 1 },
    weight: 10,
    description: 'Tem 2 pontos de vida e pode ser arrebentada com CD 17 de Força.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'rope-silk-50',
    name: 'Corda de Seda (50 pés)',
    category: 'Equipamento de Aventura',
    cost: { gold: 10 },
    weight: 5,
    description: 'Tem 2 pontos de vida e pode ser arrebentada com CD 17 de Força.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'torch',
    name: 'Tocha',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, copper: 1 },
    weight: 1,
    description: 'Ilumina 20 pés de raio de luz plena e mais 20 pés de penumbra por 1 hora.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'tinderbox',
    name: 'Caixa de Fogo',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, silver: 5 },
    weight: 1,
    description: 'Acende uma tocha (ou outra coisa com combustível exposto) com uma ação.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'rations',
    name: 'Rações (1 dia)',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, silver: 5 },
    weight: 2,
    description: 'Comida seca adequada para viagem prolongada.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'waterskin',
    name: 'Cantil',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, silver: 2 },
    weight: 5, // quando cheio
    description: 'Armazena 4 canecas de líquido.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'climbers-kit',
    name: 'Kit de Escalada',
    category: 'Equipamento de Aventura',
    cost: { gold: 25 },
    weight: 12,
    description:
      'Inclui pitons, botas com cravos, luvas e arreios. Concede vantagem em testes para escalar.',
    source: 'PHB',
    page: 151,
  },
  {
    id: 'crowbar',
    name: 'Pé de Cabra',
    category: 'Equipamento de Aventura',
    cost: { gold: 2 },
    weight: 5,
    description: 'Concede vantagem em testes de Força onde alavancagem ajudaria.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'grappling-hook',
    name: 'Gancho de Escalada',
    category: 'Equipamento de Aventura',
    cost: { gold: 2 },
    weight: 4,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'hammer',
    name: 'Martelo',
    category: 'Equipamento de Aventura',
    cost: { gold: 1 },
    weight: 3,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'piton',
    name: 'Piton',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, copper: 5 },
    weight: 0.25,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'lantern-hooded',
    name: 'Lanterna Coberta',
    category: 'Equipamento de Aventura',
    cost: { gold: 5 },
    weight: 2,
    description:
      'Ilumina 30 pés de raio de luz plena e mais 30 pés de penumbra. Queima por 6 horas com 1 frasco (1 pint) de óleo.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'lantern-bullseye',
    name: 'Lanterna Direcional',
    category: 'Equipamento de Aventura',
    cost: { gold: 10 },
    weight: 3,
    description:
      'Ilumina um cone de 60 pés de luz plena e mais 60 pés de penumbra. Queima por 6 horas com 1 frasco de óleo.',
    source: 'PHB',
    page: 150,
  },
  {
    id: 'oil-flask',
    name: 'Óleo (frasco)',
    category: 'Equipamento de Aventura',
    cost: { gold: 0, silver: 1 },
    weight: 1,
    description:
      'Pode ser usado como arma improvisada. Ação para arremessar até 20 pés, estilhaça no impacto. Faz teste de ataque à distância contra criatura ou objeto, tratando o óleo como arma improvisada.',
    source: 'PHB',
    page: 152,
  },
  {
    id: 'tent',
    name: 'Tenda (para 2 pessoas)',
    category: 'Equipamento de Aventura',
    cost: { gold: 2 },
    weight: 20,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'healers-kit',
    name: 'Kit de Curandeiro',
    category: 'Equipamento de Aventura',
    cost: { gold: 5 },
    weight: 3,
    description:
      'Tem 10 usos. Como ação, pode estabilizar criatura com 0 PV sem precisar fazer teste de Medicina.',
    source: 'PHB',
    page: 151,
  },
];

// ==================== KITS DE FERRAMENTAS ====================
export const TOOL_KITS: Equipment[] = [
  {
    id: 'alchemists-supplies',
    name: 'Suprimentos de Alquimista',
    category: 'Kit de Ferramentas',
    cost: { gold: 50 },
    weight: 8,
    description: 'Usado para criar substâncias alquímicas.',
    source: 'PHB',
    page: 154,
  },
  {
    id: 'brewers-supplies',
    name: 'Suprimentos de Cervejeiro',
    category: 'Kit de Ferramentas',
    cost: { gold: 20 },
    weight: 9,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'calligraphers-supplies',
    name: 'Suprimentos de Calígrafo',
    category: 'Kit de Ferramentas',
    cost: { gold: 10 },
    weight: 5,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'carpenters-tools',
    name: 'Ferramentas de Carpinteiro',
    category: 'Kit de Ferramentas',
    cost: { gold: 8 },
    weight: 6,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'smiths-tools',
    name: 'Ferramentas de Ferreiro',
    category: 'Kit de Ferramentas',
    cost: { gold: 20 },
    weight: 8,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'thieves-tools',
    name: 'Ferramentas de Ladrão',
    category: 'Kit de Ferramentas',
    cost: { gold: 25 },
    weight: 1,
    description: 'Necessárias para desarmar armadilhas e abrir fechaduras.',
    source: 'PHB',
    page: 154,
  },
  {
    id: 'disguise-kit',
    name: 'Kit de Disfarce',
    category: 'Kit de Ferramentas',
    cost: { gold: 25 },
    weight: 3,
    description: 'Permite criar disfarces que mudam sua aparência física.',
    source: 'PHB',
    page: 154,
  },
  {
    id: 'forgery-kit',
    name: 'Kit de Falsificação',
    category: 'Kit de Ferramentas',
    cost: { gold: 15 },
    weight: 5,
    description: 'Usado para copiar documentos e criar falsificações físicas.',
    source: 'PHB',
    page: 154,
  },
  {
    id: 'herbalism-kit',
    name: 'Kit de Herbalismo',
    category: 'Kit de Ferramentas',
    cost: { gold: 5 },
    weight: 3,
    description: 'Usado para identificar plantas e criar remédios herbais.',
    source: 'PHB',
    page: 154,
  },
  {
    id: 'poisoners-kit',
    name: 'Kit de Envenenador',
    category: 'Kit de Ferramentas',
    cost: { gold: 50 },
    weight: 2,
    description: 'Usado para criar e aplicar venenos.',
    source: 'PHB',
    page: 154,
  },
];

// ==================== INSTRUMENTOS MUSICAIS ====================
export const MUSICAL_INSTRUMENTS: Equipment[] = [
  {
    id: 'bagpipes',
    name: 'Gaita de Foles',
    category: 'Instrumento Musical',
    cost: { gold: 30 },
    weight: 6,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'drum',
    name: 'Tambor',
    category: 'Instrumento Musical',
    cost: { gold: 6 },
    weight: 3,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'flute',
    name: 'Flauta',
    category: 'Instrumento Musical',
    cost: { gold: 2 },
    weight: 1,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'lute',
    name: 'Alaúde',
    category: 'Instrumento Musical',
    cost: { gold: 35 },
    weight: 2,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'lyre',
    name: 'Lira',
    category: 'Instrumento Musical',
    cost: { gold: 30 },
    weight: 2,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'horn',
    name: 'Trompa',
    category: 'Instrumento Musical',
    cost: { gold: 3 },
    weight: 2,
    source: 'PHB',
    page: 154,
  },
  {
    id: 'viol',
    name: 'Viola',
    category: 'Instrumento Musical',
    cost: { gold: 30 },
    weight: 1,
    source: 'PHB',
    page: 154,
  },
];

// ==================== MUNIÇÃO ====================
export const AMMUNITION: Equipment[] = [
  {
    id: 'arrows-20',
    name: 'Flechas (20)',
    category: 'Munição',
    cost: { gold: 1 },
    weight: 1,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'crossbow-bolts-20',
    name: 'Virotes de Besta (20)',
    category: 'Munição',
    cost: { gold: 1 },
    weight: 1.5,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'sling-bullets-20',
    name: 'Balas de Funda (20)',
    category: 'Munição',
    cost: { gold: 0, copper: 4 },
    weight: 1.5,
    source: 'PHB',
    page: 150,
  },
  {
    id: 'blowgun-needles-50',
    name: 'Agulhas de Zarabatana (50)',
    category: 'Munição',
    cost: { gold: 1 },
    weight: 1,
    source: 'PHB',
    page: 150,
  },
];

// ==================== POÇÕES ====================
export const POTIONS: Equipment[] = [
  {
    id: 'potion-of-healing',
    name: 'Poção de Cura',
    category: 'Poção',
    cost: { gold: 50 },
    weight: 0.5,
    description: 'Recupera 2d4+2 pontos de vida quando bebida.',
    source: 'PHB',
    page: 153,
  },
  {
    id: 'antitoxin',
    name: 'Antitoxina',
    category: 'Poção',
    cost: { gold: 50 },
    weight: 0,
    description:
      'Concede vantagem em testes de resistência contra veneno por 1 hora. Não confere benefício para mortos-vivos ou constructos.',
    source: 'PHB',
    page: 151,
  },
];

// ==================== FUNÇÕES AUXILIARES ====================

export const ALL_EQUIPMENT = [
  ...ADVENTURING_GEAR,
  ...TOOL_KITS,
  ...MUSICAL_INSTRUMENTS,
  ...AMMUNITION,
  ...POTIONS,
];

export function getEquipmentById(id: string): Equipment | undefined {
  return ALL_EQUIPMENT.find((e) => e.id === id);
}

export function getEquipmentByCategory(category: EquipmentCategory): Equipment[] {
  return ALL_EQUIPMENT.filter((e) => e.category === category);
}

export function searchEquipment(query: string): Equipment[] {
  const lowerQuery = query.toLowerCase();
  return ALL_EQUIPMENT.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.category.toLowerCase().includes(lowerQuery) ||
      (e.description && e.description.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Calcula o custo total em moedas de ouro
 */
export function calculateTotalGoldCost(item: Equipment): number {
  let total = item.cost.gold || 0;

  if (item.cost.silver) {
    total += item.cost.silver / 10;
  }

  if (item.cost.copper) {
    total += item.cost.copper / 100;
  }

  return total;
}
