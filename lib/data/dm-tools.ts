/**
 * Ferramentas para Mestres de D&D 5e
 */

// ========== Name Generator ==========

export interface NameGeneratorOptions {
  gender?: 'male' | 'female' | 'neutral';
  race?: string;
  type?: 'first' | 'last' | 'full';
}

const FIRST_NAMES = {
  male: [
    'Aldric', 'Borin', 'Cedric', 'Darian', 'Eldon', 'Fenrir', 'Gareth', 'Haldor',
    'Ivor', 'Jarek', 'Kael', 'Lorian', 'Merric', 'Nolan', 'Orin', 'Peren',
    'Quillan', 'Rowan', 'Soren', 'Theron', 'Ulric', 'Valen', 'Warden', 'Xander',
  ],
  female: [
    'Aelira', 'Brynn', 'Celeste', 'Dara', 'Elara', 'Fiona', 'Gwen', 'Helena',
    'Iris', 'Jade', 'Kira', 'Luna', 'Mira', 'Nyx', 'Ophelia', 'Petra',
    'Quinn', 'Raven', 'Sera', 'Talia', 'Uma', 'Vera', 'Willow', 'Xyra',
  ],
  neutral: [
    'Ash', 'Blake', 'Casey', 'Devon', 'Eden', 'Finley', 'Gray', 'Harper',
    'Indigo', 'Jordan', 'Kai', 'Logan', 'Morgan', 'Nova', 'Ocean', 'Phoenix',
  ],
};

const LAST_NAMES = [
  'Stormwind', 'Ironfist', 'Goldleaf', 'Shadowbane', 'Brightblade', 'Darkwood',
  'Moonwhisper', 'Sunforge', 'Frostbeard', 'Fireborn', 'Stoneheart', 'Swiftarrow',
  'Ravenwood', 'Nightshade', 'Dawnbringer', 'Starfall', 'Thornguard', 'Silverhand',
  'Oakenshield', 'Wintermane', 'Emberclaw', 'Windrunner', 'Stormblade', 'Ashvale',
];

export function generateName(options: NameGeneratorOptions = {}): string {
  const { gender = 'neutral', type = 'full' } = options;

  const firstNameList = FIRST_NAMES[gender] || FIRST_NAMES.neutral;
  const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  if (type === 'first') return firstName;
  if (type === 'last') return lastName;
  return `${firstName} ${lastName}`;
}

// ========== Encounter Builder ==========

export type CreatureType = 'aberration' | 'beast' | 'celestial' | 'construct' | 'dragon' |
  'elemental' | 'fey' | 'fiend' | 'giant' | 'humanoid' | 'monstrosity' | 'ooze' |
  'plant' | 'undead';

export interface Creature {
  name: string;
  cr: number; // Challenge Rating
  type: CreatureType;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  alignment?: string;
  xp: number;
}

export interface Encounter {
  creatures: Array<{ creature: Creature; count: number }>;
  totalXP: number;
  adjustedXP: number;
  difficulty: EncounterDifficulty;
  partyLevel: number;
  partySize: number;
}

export type EncounterDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';

// Tabela de XP por CR
const CR_TO_XP: Record<number, number> = {
  0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
  1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
  6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
  11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
  16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
  21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
  26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000,
};

// Tabela de thresholds de XP por nível de personagem
const XP_THRESHOLDS: Record<number, { easy: number; medium: number; hard: number; deadly: number }> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

// Multiplicadores de XP por número de monstros
function getXPMultiplier(monsterCount: number): number {
  if (monsterCount === 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 2.5;
  if (monsterCount <= 14) return 3;
  return 4;
}

export function calculateEncounterDifficulty(
  creatures: Array<{ creature: Creature; count: number }>,
  partyLevel: number,
  partySize: number
): Encounter {
  // Calcular XP total
  const totalXP = creatures.reduce((sum, { creature, count }) => {
    return sum + (creature.xp * count);
  }, 0);

  // Calcular número total de monstros
  const totalMonsters = creatures.reduce((sum, { count }) => sum + count, 0);

  // Aplicar multiplicador
  const multiplier = getXPMultiplier(totalMonsters);
  const adjustedXP = totalXP * multiplier;

  // Calcular thresholds para o party
  const thresholds = XP_THRESHOLDS[partyLevel] || XP_THRESHOLDS[20];
  const partyEasy = thresholds.easy * partySize;
  const partyMedium = thresholds.medium * partySize;
  const partyHard = thresholds.hard * partySize;
  const partyDeadly = thresholds.deadly * partySize;

  // Determinar dificuldade
  let difficulty: EncounterDifficulty;
  if (adjustedXP < partyEasy) difficulty = 'trivial';
  else if (adjustedXP < partyMedium) difficulty = 'easy';
  else if (adjustedXP < partyHard) difficulty = 'medium';
  else if (adjustedXP < partyDeadly) difficulty = 'hard';
  else difficulty = 'deadly';

  return {
    creatures,
    totalXP,
    adjustedXP,
    difficulty,
    partyLevel,
    partySize,
  };
}

// ========== Treasure Generator ==========

export interface Treasure {
  coins: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
  items: string[];
  totalValue: number; // Em gold pieces
}

export function generateTreasure(cr: number, hoardSize: 'individual' | 'hoard' = 'individual'): Treasure {
  const treasure: Treasure = {
    coins: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
    items: [],
    totalValue: 0,
  };

  if (hoardSize === 'individual') {
    // Tesouro individual baseado no CR
    if (cr <= 4) {
      treasure.coins.copper = Math.floor(Math.random() * 100) + 50;
      treasure.coins.silver = Math.floor(Math.random() * 50) + 10;
      treasure.coins.gold = Math.floor(Math.random() * 10);
    } else if (cr <= 10) {
      treasure.coins.silver = Math.floor(Math.random() * 200) + 100;
      treasure.coins.gold = Math.floor(Math.random() * 50) + 20;
      treasure.coins.platinum = Math.floor(Math.random() * 5);
    } else if (cr <= 16) {
      treasure.coins.gold = Math.floor(Math.random() * 500) + 200;
      treasure.coins.platinum = Math.floor(Math.random() * 20) + 10;
    } else {
      treasure.coins.gold = Math.floor(Math.random() * 1000) + 500;
      treasure.coins.platinum = Math.floor(Math.random() * 100) + 50;
    }
  } else {
    // Tesouro de hoard (muito maior)
    if (cr <= 4) {
      treasure.coins.copper = Math.floor(Math.random() * 6000) + 6000;
      treasure.coins.silver = Math.floor(Math.random() * 3000) + 3000;
      treasure.coins.gold = Math.floor(Math.random() * 500) + 500;
    } else if (cr <= 10) {
      treasure.coins.silver = Math.floor(Math.random() * 10000) + 10000;
      treasure.coins.gold = Math.floor(Math.random() * 5000) + 5000;
      treasure.coins.platinum = Math.floor(Math.random() * 500) + 500;
      treasure.items.push('1-2 itens mágicos menores');
    } else if (cr <= 16) {
      treasure.coins.gold = Math.floor(Math.random() * 50000) + 50000;
      treasure.coins.platinum = Math.floor(Math.random() * 5000) + 5000;
      treasure.items.push('1-3 itens mágicos (incluindo 1 raro)');
    } else {
      treasure.coins.gold = Math.floor(Math.random() * 100000) + 100000;
      treasure.coins.platinum = Math.floor(Math.random() * 20000) + 20000;
      treasure.items.push('1-4 itens mágicos (incluindo 1 muito raro)');
    }
  }

  // Calcular valor total em gold
  treasure.totalValue =
    treasure.coins.copper * 0.01 +
    treasure.coins.silver * 0.1 +
    treasure.coins.electrum * 0.5 +
    treasure.coins.gold +
    treasure.coins.platinum * 10;

  return treasure;
}

// ========== Random Tables ==========

export const RANDOM_TAVERN_NAMES = [
  'O Dragão Bêbado',
  'A Espada e o Escudo',
  'O Barril Dourado',
  'A Sereia Cantante',
  'O Javali Selvagem',
  'A Lua Crescente',
  'O Corvo Negro',
  'A Âncora Quebrada',
  'O Unicórnio Azul',
  'A Fênix Ardente',
];

export const RANDOM_NPC_QUIRKS = [
  'Sempre repete a última palavra de cada frase',
  'Fala em terceira pessoa',
  'Tem um tique nervoso no olho',
  'Coleciona moedas de lugares exóticos',
  'Acredita que foi royalty em vida passada',
  'Sempre concorda com tudo que dizem',
  'Extremamente supersticioso',
  'Nunca olha nos olhos das pessoas',
  'Ri de forma estranha e inadequada',
  'Cita provérbios o tempo todo',
];

export const RANDOM_QUEST_HOOKS = [
  'Uma criança foi sequestrada por goblins',
  'Mercadorias valiosas foram roubadas de uma caravana',
  'Mortos-vivos começaram a surgir no cemitério',
  'Um dragão jovem está aterrorizando fazendas próximas',
  'Cultistas estão realizando rituais sinistros na floresta',
  'Uma relíquia sagrada foi roubada do templo',
  'Bandidos bloquearam a estrada principal',
  'Uma criatura misteriosa habita as ruínas antigas',
  'O nobre local oferece recompensa por caçadores de monstros',
  'Rumores de um tesouro perdido em cavernas perigosas',
];

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ========== Dice Roller ==========

export interface DiceRoll {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
}

export function rollDice(formula: string): DiceRoll {
  // Parse formato XdY+Z
  const match = formula.match(/(\d+)d(\d+)([+-]\d+)?/i);

  if (!match) {
    throw new Error('Formato inválido. Use XdY ou XdY+Z (ex: 2d6+3)');
  }

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

  return {
    formula,
    rolls,
    modifier,
    total,
  };
}
