/**
 * Armas do D&D 5e
 * Baseado no Player's Handbook (PHB)
 */

export type WeaponCategory =
  | 'Simples Corpo a Corpo'
  | 'Simples à Distância'
  | 'Marcial Corpo a Corpo'
  | 'Marcial à Distância';
export type DamageType = 'Cortante' | 'Perfurante' | 'Contundente';
export type WeaponProperty =
  | 'Leve'
  | 'Arremesso'
  | 'Versátil'
  | 'Duas Mãos'
  | 'Alcance'
  | 'Pesada'
  | 'Munição'
  | 'Recarga'
  | 'Sutil'
  | 'Especial';

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  damage: string; // Ex: "1d8", "1d6"
  damageType: DamageType;
  properties: WeaponProperty[];
  versatileDamage?: string; // Para armas versáteis (2 mãos)
  range?: string; // Para armas à distância. Ex: "30/120"
  cost: { gold: number };
  weight: number; // em libras
  description?: string;
  source: string;
  page: number;
}

// ==================== ARMAS SIMPLES CORPO A CORPO ====================
export const SIMPLE_MELEE_WEAPONS: Weapon[] = [
  {
    id: 'club',
    name: 'Clava',
    category: 'Simples Corpo a Corpo',
    damage: '1d4',
    damageType: 'Contundente',
    properties: ['Leve'],
    cost: { gold: 0.1 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'dagger',
    name: 'Adaga',
    category: 'Simples Corpo a Corpo',
    damage: '1d4',
    damageType: 'Perfurante',
    properties: ['Sutil', 'Leve', 'Arremesso'],
    range: '20/60',
    cost: { gold: 2 },
    weight: 1,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'greatclub',
    name: 'Porrete',
    category: 'Simples Corpo a Corpo',
    damage: '1d8',
    damageType: 'Contundente',
    properties: ['Duas Mãos'],
    cost: { gold: 0.2 },
    weight: 10,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'handaxe',
    name: 'Machadinha',
    category: 'Simples Corpo a Corpo',
    damage: '1d6',
    damageType: 'Cortante',
    properties: ['Leve', 'Arremesso'],
    range: '20/60',
    cost: { gold: 5 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'javelin',
    name: 'Azagaia',
    category: 'Simples Corpo a Corpo',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Arremesso'],
    range: '30/120',
    cost: { gold: 0.5 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'light-hammer',
    name: 'Martelo Leve',
    category: 'Simples Corpo a Corpo',
    damage: '1d4',
    damageType: 'Contundente',
    properties: ['Leve', 'Arremesso'],
    range: '20/60',
    cost: { gold: 2 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'mace',
    name: 'Maça',
    category: 'Simples Corpo a Corpo',
    damage: '1d6',
    damageType: 'Contundente',
    properties: [],
    cost: { gold: 5 },
    weight: 4,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'quarterstaff',
    name: 'Bordão',
    category: 'Simples Corpo a Corpo',
    damage: '1d6',
    damageType: 'Contundente',
    properties: ['Versátil'],
    versatileDamage: '1d8',
    cost: { gold: 0.2 },
    weight: 4,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'sickle',
    name: 'Foice',
    category: 'Simples Corpo a Corpo',
    damage: '1d4',
    damageType: 'Cortante',
    properties: ['Leve'],
    cost: { gold: 1 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'spear',
    name: 'Lança',
    category: 'Simples Corpo a Corpo',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Arremesso', 'Versátil'],
    versatileDamage: '1d8',
    range: '20/60',
    cost: { gold: 1 },
    weight: 3,
    source: 'PHB',
    page: 149,
  },
];

// ==================== ARMAS SIMPLES À DISTÂNCIA ====================
export const SIMPLE_RANGED_WEAPONS: Weapon[] = [
  {
    id: 'light-crossbow',
    name: 'Besta Leve',
    category: 'Simples à Distância',
    damage: '1d8',
    damageType: 'Perfurante',
    properties: ['Munição', 'Recarga', 'Duas Mãos'],
    range: '80/320',
    cost: { gold: 25 },
    weight: 5,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'dart',
    name: 'Dardo',
    category: 'Simples à Distância',
    damage: '1d4',
    damageType: 'Perfurante',
    properties: ['Sutil', 'Arremesso'],
    range: '20/60',
    cost: { gold: 0.05 },
    weight: 0.25,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'shortbow',
    name: 'Arco Curto',
    category: 'Simples à Distância',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Munição', 'Duas Mãos'],
    range: '80/320',
    cost: { gold: 25 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'sling',
    name: 'Funda',
    category: 'Simples à Distância',
    damage: '1d4',
    damageType: 'Contundente',
    properties: ['Munição'],
    range: '30/120',
    cost: { gold: 0.1 },
    weight: 0,
    source: 'PHB',
    page: 149,
  },
];

// ==================== ARMAS MARCIAIS CORPO A CORPO ====================
export const MARTIAL_MELEE_WEAPONS: Weapon[] = [
  {
    id: 'battleaxe',
    name: 'Machado de Batalha',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Cortante',
    properties: ['Versátil'],
    versatileDamage: '1d10',
    cost: { gold: 10 },
    weight: 4,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'flail',
    name: 'Mangual',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Contundente',
    properties: [],
    cost: { gold: 10 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'glaive',
    name: 'Glaive',
    category: 'Marcial Corpo a Corpo',
    damage: '1d10',
    damageType: 'Cortante',
    properties: ['Pesada', 'Alcance', 'Duas Mãos'],
    cost: { gold: 20 },
    weight: 6,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'greataxe',
    name: 'Machado Grande',
    category: 'Marcial Corpo a Corpo',
    damage: '1d12',
    damageType: 'Cortante',
    properties: ['Pesada', 'Duas Mãos'],
    cost: { gold: 30 },
    weight: 7,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'greatsword',
    name: 'Espada Grande',
    category: 'Marcial Corpo a Corpo',
    damage: '2d6',
    damageType: 'Cortante',
    properties: ['Pesada', 'Duas Mãos'],
    cost: { gold: 50 },
    weight: 6,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'halberd',
    name: 'Alabarda',
    category: 'Marcial Corpo a Corpo',
    damage: '1d10',
    damageType: 'Cortante',
    properties: ['Pesada', 'Alcance', 'Duas Mãos'],
    cost: { gold: 20 },
    weight: 6,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'lance',
    name: 'Lança de Montaria',
    category: 'Marcial Corpo a Corpo',
    damage: '1d12',
    damageType: 'Perfurante',
    properties: ['Alcance', 'Especial'],
    cost: { gold: 10 },
    weight: 6,
    description: 'Desvantagem quando usado contra alvos a 5 pés ou menos.',
    source: 'PHB',
    page: 149,
  },
  {
    id: 'longsword',
    name: 'Espada Longa',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Cortante',
    properties: ['Versátil'],
    versatileDamage: '1d10',
    cost: { gold: 15 },
    weight: 3,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'maul',
    name: 'Malho',
    category: 'Marcial Corpo a Corpo',
    damage: '2d6',
    damageType: 'Contundente',
    properties: ['Pesada', 'Duas Mãos'],
    cost: { gold: 10 },
    weight: 10,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'morningstar',
    name: 'Estrela da Manhã',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Perfurante',
    properties: [],
    cost: { gold: 15 },
    weight: 4,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'pike',
    name: 'Pique',
    category: 'Marcial Corpo a Corpo',
    damage: '1d10',
    damageType: 'Perfurante',
    properties: ['Pesada', 'Alcance', 'Duas Mãos'],
    cost: { gold: 5 },
    weight: 18,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'rapier',
    name: 'Rapier',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Perfurante',
    properties: ['Sutil'],
    cost: { gold: 25 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'scimitar',
    name: 'Cimitarra',
    category: 'Marcial Corpo a Corpo',
    damage: '1d6',
    damageType: 'Cortante',
    properties: ['Sutil', 'Leve'],
    cost: { gold: 25 },
    weight: 3,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'shortsword',
    name: 'Espada Curta',
    category: 'Marcial Corpo a Corpo',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Sutil', 'Leve'],
    cost: { gold: 10 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'trident',
    name: 'Tridente',
    category: 'Marcial Corpo a Corpo',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Arremesso', 'Versátil'],
    versatileDamage: '1d8',
    range: '20/60',
    cost: { gold: 5 },
    weight: 4,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'war-pick',
    name: 'Picareta de Guerra',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Perfurante',
    properties: [],
    cost: { gold: 5 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'warhammer',
    name: 'Martelo de Guerra',
    category: 'Marcial Corpo a Corpo',
    damage: '1d8',
    damageType: 'Contundente',
    properties: ['Versátil'],
    versatileDamage: '1d10',
    cost: { gold: 15 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'whip',
    name: 'Chicote',
    category: 'Marcial Corpo a Corpo',
    damage: '1d4',
    damageType: 'Cortante',
    properties: ['Sutil', 'Alcance'],
    cost: { gold: 2 },
    weight: 3,
    source: 'PHB',
    page: 149,
  },
];

// ==================== ARMAS MARCIAIS À DISTÂNCIA ====================
export const MARTIAL_RANGED_WEAPONS: Weapon[] = [
  {
    id: 'blowgun',
    name: 'Zarabatana',
    category: 'Marcial à Distância',
    damage: '1',
    damageType: 'Perfurante',
    properties: ['Munição', 'Recarga'],
    range: '25/100',
    cost: { gold: 10 },
    weight: 1,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'hand-crossbow',
    name: 'Besta de Mão',
    category: 'Marcial à Distância',
    damage: '1d6',
    damageType: 'Perfurante',
    properties: ['Leve', 'Munição', 'Recarga'],
    range: '30/120',
    cost: { gold: 75 },
    weight: 3,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'heavy-crossbow',
    name: 'Besta Pesada',
    category: 'Marcial à Distância',
    damage: '1d10',
    damageType: 'Perfurante',
    properties: ['Munição', 'Pesada', 'Recarga', 'Duas Mãos'],
    range: '100/400',
    cost: { gold: 50 },
    weight: 18,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'longbow',
    name: 'Arco Longo',
    category: 'Marcial à Distância',
    damage: '1d8',
    damageType: 'Perfurante',
    properties: ['Munição', 'Pesada', 'Duas Mãos'],
    range: '150/600',
    cost: { gold: 50 },
    weight: 2,
    source: 'PHB',
    page: 149,
  },
  {
    id: 'net',
    name: 'Rede',
    category: 'Marcial à Distância',
    damage: '-',
    damageType: 'Cortante',
    properties: ['Especial', 'Arremesso'],
    range: '5/15',
    cost: { gold: 1 },
    weight: 3,
    description:
      'Uma criatura Grande ou menor atingida fica impedida. Pode usar ação para se libertar com CD 10 Força.',
    source: 'PHB',
    page: 149,
  },
];

// ==================== FUNÇÕES AUXILIARES ====================

export const ALL_WEAPONS = [
  ...SIMPLE_MELEE_WEAPONS,
  ...SIMPLE_RANGED_WEAPONS,
  ...MARTIAL_MELEE_WEAPONS,
  ...MARTIAL_RANGED_WEAPONS,
];

export function getWeaponById(id: string): Weapon | undefined {
  return ALL_WEAPONS.find((w) => w.id === id);
}

export function getWeaponsByCategory(category: WeaponCategory): Weapon[] {
  return ALL_WEAPONS.filter((w) => w.category === category);
}

export function searchWeapons(query: string): Weapon[] {
  const lowerQuery = query.toLowerCase();
  return ALL_WEAPONS.filter(
    (w) =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.category.toLowerCase().includes(lowerQuery) ||
      w.damageType.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calcula bônus de ataque para uma arma
 * PHB p.194: Bônus de Ataque = Bônus de Proficiência + Modificador de Atributo
 */
export function calculateAttackBonus(
  weapon: Weapon,
  strengthMod: number,
  dexMod: number,
  proficiencyBonus: number,
  isProficient: boolean
): { bonus: number; attribute: 'STR' | 'DEX' } {
  // Armas à distância e armas com Sutil usam DEX
  // Armas corpo a corpo usam STR (ou DEX se tiver Sutil)
  const isRanged = weapon.category.includes('à Distância');
  const hasFinesse = weapon.properties.includes('Sutil');

  let attributeMod: number;
  let attribute: 'STR' | 'DEX';

  if (isRanged || hasFinesse) {
    // Usa o maior entre STR e DEX
    if (dexMod >= strengthMod) {
      attributeMod = dexMod;
      attribute = 'DEX';
    } else {
      attributeMod = strengthMod;
      attribute = 'STR';
    }
  } else {
    // Corpo a corpo sem Sutil = STR
    attributeMod = strengthMod;
    attribute = 'STR';
  }

  const profBonus = isProficient ? proficiencyBonus : 0;
  const bonus = attributeMod + profBonus;

  return { bonus, attribute };
}

/**
 * Formata o dano da arma com modificador
 */
export function formatWeaponDamage(weapon: Weapon, strengthMod: number, dexMod: number): string {
  const isRanged = weapon.category.includes('à Distância');
  const hasFinesse = weapon.properties.includes('Sutil');

  let attributeMod: number;

  if (isRanged || hasFinesse) {
    attributeMod = Math.max(dexMod, strengthMod);
  } else {
    attributeMod = strengthMod;
  }

  const modStr = attributeMod >= 0 ? `+${attributeMod}` : `${attributeMod}`;
  return `${weapon.damage} ${modStr}`;
}
