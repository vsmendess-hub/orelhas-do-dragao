/**
 * Dados de Raças e Sub-raças D&D 5e
 * Baseado no dnd-5e-data-reference.md
 */

export interface RacialBonus {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}

export interface Subrace {
  id: string;
  name: string;
  bonuses: RacialBonus;
  description: string;
}

export interface Race {
  id: string;
  name: string;
  bonuses: RacialBonus;
  description: string;
  speed: number;
  size: 'Pequeno' | 'Médio';
  subraces?: Subrace[];
}

export const RACES: Race[] = [
  {
    id: 'humano',
    name: 'Humano',
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    description: 'Versáteis e ambiciosos, os humanos são a raça mais adaptável e diversa.',
    speed: 30,
    size: 'Médio',
  },
  {
    id: 'anao',
    name: 'Anão',
    bonuses: { con: 2 },
    description: 'Guerreiros robustos e artesãos habilidosos que vivem em reinos montanhosos.',
    speed: 25,
    size: 'Médio',
    subraces: [
      {
        id: 'anao-colina',
        name: 'Anão da Colina',
        bonuses: { wis: 1 },
        description: 'Anões resistentes com senso aguçado e sabedoria natural.',
      },
      {
        id: 'anao-montanha',
        name: 'Anão da Montanha',
        bonuses: { str: 2 },
        description: 'Anões fortes e resistentes, guerreiros natos.',
      },
    ],
  },
  {
    id: 'elfo',
    name: 'Elfo',
    bonuses: { dex: 2 },
    description: 'Graciosos e ágeis, os elfos são mestres da magia e do arco.',
    speed: 30,
    size: 'Médio',
    subraces: [
      {
        id: 'elfo-alto',
        name: 'Elfo Alto',
        bonuses: { int: 1 },
        description: 'Elfos eruditos com afinidade natural pela magia arcana.',
      },
      {
        id: 'elfo-floresta',
        name: 'Elfo da Floresta',
        bonuses: { wis: 1 },
        description: 'Elfos ágeis e intuitivos, guardiões das florestas.',
      },
      {
        id: 'elfo-negro',
        name: 'Elfo Negro (Drow)',
        bonuses: { cha: 1 },
        description: 'Elfos das profundezas com magia inata e visão superior.',
      },
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    bonuses: { dex: 2 },
    description: 'Pequenos e ágeis, os halflings são sortudos e bons em passar despercebidos.',
    speed: 25,
    size: 'Pequeno',
    subraces: [
      {
        id: 'halfling-pes-leves',
        name: 'Halfling Pés-Leves',
        bonuses: { cha: 1 },
        description: 'Halflings encantadores e furtivos.',
      },
      {
        id: 'halfling-robusto',
        name: 'Halfling Robusto',
        bonuses: { con: 1 },
        description: 'Halflings resistentes com estômagos fortes.',
      },
    ],
  },
  {
    id: 'draconato',
    name: 'Draconato',
    bonuses: { str: 2, cha: 1 },
    description: 'Descendentes de dragões, os draconatos são orgulhosos e honrados.',
    speed: 30,
    size: 'Médio',
  },
  {
    id: 'gnomo',
    name: 'Gnomo',
    bonuses: { int: 2 },
    description: 'Pequenos inventores e ilusionistas com curiosidade insaciável.',
    speed: 25,
    size: 'Pequeno',
    subraces: [
      {
        id: 'gnomo-floresta',
        name: 'Gnomo da Floresta',
        bonuses: { dex: 1 },
        description: 'Gnomos com afinidade natural pela natureza.',
      },
      {
        id: 'gnomo-rochoso',
        name: 'Gnomo das Rochas',
        bonuses: { con: 1 },
        description: 'Gnomos inventores e engenhosos.',
      },
    ],
  },
  {
    id: 'meio-elfo',
    name: 'Meio-Elfo',
    bonuses: { cha: 2 },
    description: 'Combinando graça élfica e ambição humana, meio-elfos caminham entre dois mundos.',
    speed: 30,
    size: 'Médio',
  },
  {
    id: 'meio-orc',
    name: 'Meio-Orc',
    bonuses: { str: 2, con: 1 },
    description: 'Fortes e resistentes, meio-orcs superam preconceitos com determinação.',
    speed: 30,
    size: 'Médio',
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    bonuses: { int: 1, cha: 2 },
    description: 'Descendentes de linhagem infernal, tieflings carregam uma herança sombria.',
    speed: 30,
    size: 'Médio',
  },
];

/**
 * Obter raça por ID
 */
export function getRaceById(id: string): Race | undefined {
  return RACES.find((race) => race.id === id);
}

/**
 * Obter sub-raça por IDs de raça e sub-raça
 */
export function getSubraceById(raceId: string, subraceId: string): Subrace | undefined {
  const race = getRaceById(raceId);
  return race?.subraces?.find((subrace) => subrace.id === subraceId);
}

/**
 * Calcular bônus raciais totais (raça + sub-raça)
 */
export function calculateRacialBonuses(raceId: string, subraceId?: string): RacialBonus {
  const race = getRaceById(raceId);
  if (!race) return {};

  const bonuses = { ...race.bonuses };

  if (subraceId && race.subraces) {
    const subrace = getSubraceById(raceId, subraceId);
    if (subrace) {
      // Somar bônus da sub-raça
      Object.entries(subrace.bonuses).forEach(([key, value]) => {
        const attr = key as keyof RacialBonus;
        bonuses[attr] = (bonuses[attr] || 0) + (value || 0);
      });
    }
  }

  return bonuses;
}
