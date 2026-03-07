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
  image?: string;
}

export interface Race {
  id: string;
  name: string;
  bonuses: RacialBonus;
  description: string;
  speed: number;
  size: 'Pequeno' | 'Médio';
  image?: string;
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
    image: 'https://i.pinimg.com/736x/50/59/c0/5059c06faaf534049eaa4dce8fd26227.jpg',
  },
  {
    id: 'anao',
    name: 'Anão',
    bonuses: { con: 2 },
    description: 'Guerreiros robustos e artesãos habilidosos que vivem em reinos montanhosos.',
    speed: 25,
    size: 'Médio',
    image: 'https://i.pinimg.com/736x/b7/b8/c4/b7b8c40e551073c587637ec0065f7f54.jpg',
    subraces: [
      {
        id: 'anao-colina',
        name: 'Anão da Colina',
        bonuses: { wis: 1 },
        description: 'Anões resistentes com senso aguçado e sabedoria natural.',
        image: 'https://i.pinimg.com/1200x/21/29/6b/21296b43f75c88ad7b78921c35d0f13d.jpg',
      },
      {
        id: 'anao-montanha',
        name: 'Anão da Montanha',
        bonuses: { str: 2 },
        description: 'Anões fortes e resistentes, guerreiros natos.',
        image: 'https://i.pinimg.com/1200x/42/e4/a3/42e4a3a7ae54b7c60856896d729794c6.jpg',
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
    image: 'https://i.pinimg.com/736x/9f/16/30/9f163059942fd741114155095da8c49e.jpg',
    subraces: [
      {
        id: 'elfo-alto',
        name: 'Elfo Alto',
        bonuses: { int: 1 },
        description: 'Elfos eruditos com afinidade natural pela magia arcana.',
        image: 'https://i.pinimg.com/1200x/ee/bb/05/eebb053abaffddbd75bd6f66f8f53894.jpg',
      },
      {
        id: 'elfo-floresta',
        name: 'Elfo da Floresta',
        bonuses: { wis: 1 },
        description: 'Elfos ágeis e intuitivos, guardiões das florestas.',
        image: 'https://i.pinimg.com/736x/23/0e/ff/230eff81483824df54d8616f7d242cfb.jpg',
      },
      {
        id: 'elfo-negro',
        name: 'Elfo Negro (Drow)',
        bonuses: { cha: 1 },
        description: 'Elfos das profundezas com magia inata e visão superior.',
        image: 'https://i.pinimg.com/736x/70/4a/af/704aaf5047e50e43c27e4c5a5f501ca9.jpg',
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
    image: 'https://i.pinimg.com/736x/7b/9e/7c/7b9e7c7342c5c88de2d60df936380367.jpg',
    subraces: [
      {
        id: 'halfling-pes-leves',
        name: 'Halfling Pés-Leves',
        bonuses: { cha: 1 },
        description: 'Halflings encantadores e furtivos.',
        image: 'https://i.pinimg.com/1200x/63/45/b3/6345b3b858b45c830a32ddd1072efb2f.jpg',
      },
      {
        id: 'halfling-robusto',
        name: 'Halfling Robusto',
        bonuses: { con: 1 },
        description: 'Halflings resistentes com estômagos fortes.',
        image: 'https://i.pinimg.com/736x/52/0b/2a/520b2a2a6fcd36d1758ab78c9d8fe3ff.jpg',
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
    image: 'https://i.pinimg.com/736x/a1/65/b3/a165b3ae6e79cfd0e5229c9c1238c05c.jpg',
  },
  {
    id: 'gnomo',
    name: 'Gnomo',
    bonuses: { int: 2 },
    description: 'Pequenos inventores e ilusionistas com curiosidade insaciável.',
    speed: 25,
    size: 'Pequeno',
    image: 'https://i.pinimg.com/736x/02/2d/6b/022d6b3b20fb34860f24831e59f8e60c.jpg',
    subraces: [
      {
        id: 'gnomo-floresta',
        name: 'Gnomo da Floresta',
        bonuses: { dex: 1 },
        description: 'Gnomos com afinidade natural pela natureza.',
        image: 'https://i.pinimg.com/736x/de/f3/55/def355d596bc2a4f59346eda255fbfa7.jpg',
      },
      {
        id: 'gnomo-rochoso',
        name: 'Gnomo das Rochas',
        bonuses: { con: 1 },
        description: 'Gnomos inventores e engenhosos.',
        image: 'https://i.pinimg.com/736x/74/57/a8/7457a8367072cb92dac4b9e10c82650d.jpg',
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
    image: 'https://i.pinimg.com/736x/23/32/c2/2332c277822586c8826587bb9867e37b.jpg',
  },
  {
    id: 'meio-orc',
    name: 'Meio-Orc',
    bonuses: { str: 2, con: 1 },
    description: 'Fortes e resistentes, meio-orcs superam preconceitos com determinação.',
    speed: 30,
    size: 'Médio',
    image: 'https://i.pinimg.com/736x/7c/ed/51/7ced516cb67aada28ae8bb40c3d9bf2d.jpg',
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    bonuses: { int: 1, cha: 2 },
    description: 'Descendentes de linhagem infernal, tieflings carregam uma herança sombria.',
    speed: 30,
    size: 'Médio',
    image: 'https://i.pinimg.com/736x/62/1b/2a/621b2a72695e04042af2f33c37bb2f07.jpg',
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
