/**
 * Sistema de Inventário D&D 5e
 * Tipos, interfaces e funções helper para gerenciar itens e moedas
 */

// Categorias de itens
export type ItemCategory = 'weapon' | 'armor' | 'consumable' | 'tool' | 'treasure' | 'misc';

// Interface de Item
export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  weight: number; // em libras
  value: number; // em peças de ouro
  category: ItemCategory;
  equipped: boolean;
  properties?: ItemProperties;
}

// Propriedades específicas de armas e armaduras
export interface ItemProperties {
  // Armas
  damage?: string; // Ex: "1d8"
  damageType?: string; // Ex: "slashing", "piercing", "bludgeoning"
  range?: string; // Ex: "5 pés", "20/60 pés"
  weaponProperties?: string[]; // Ex: ["versatile", "light", "finesse"]

  // Armaduras
  armorClass?: number; // AC base da armadura
  armorType?: 'light' | 'medium' | 'heavy' | 'shield'; // Tipo de armadura
  stealthDisadvantage?: boolean; // Desvantagem em Furtividade
  strengthRequirement?: number; // STR mínima necessária
}

// Sistema de moedas D&D 5e
export interface Currency {
  copper: number; // pc - Peças de Cobre
  silver: number; // pp - Peças de Prata
  electrum: number; // pe - Peças de Electrum
  gold: number; // po - Peças de Ouro
  platinum: number; // pl - Peças de Platina
}

// Conversão de moedas para ouro (1 po = base)
export const CURRENCY_TO_GOLD = {
  copper: 0.01, // 100 pc = 1 po
  silver: 0.1, // 10 pp = 1 po
  electrum: 0.5, // 2 pe = 1 po
  gold: 1, // 1 po = 1 po
  platinum: 10, // 1 pl = 10 po
} as const;

// Peso das moedas (50 moedas = 1 libra)
export const COINS_PER_POUND = 50;

// Nomes das moedas em português
export const CURRENCY_NAMES = {
  copper: { full: 'Cobre', abbr: 'pc' },
  silver: { full: 'Prata', abbr: 'pp' },
  electrum: { full: 'Electrum', abbr: 'pe' },
  gold: { full: 'Ouro', abbr: 'po' },
  platinum: { full: 'Platina', abbr: 'pl' },
} as const;

// Nomes das categorias em português
export const CATEGORY_NAMES: Record<ItemCategory, string> = {
  weapon: 'Arma',
  armor: 'Armadura',
  consumable: 'Consumível',
  tool: 'Ferramenta',
  treasure: 'Tesouro',
  misc: 'Diversos',
};

/**
 * Calcula o valor total de moedas convertido em peças de ouro
 */
export function calculateTotalGold(currency: Currency): number {
  return (
    currency.copper * CURRENCY_TO_GOLD.copper +
    currency.silver * CURRENCY_TO_GOLD.silver +
    currency.electrum * CURRENCY_TO_GOLD.electrum +
    currency.gold * CURRENCY_TO_GOLD.gold +
    currency.platinum * CURRENCY_TO_GOLD.platinum
  );
}

/**
 * Calcula o peso total das moedas em libras
 */
export function calculateCurrencyWeight(currency: Currency): number {
  const totalCoins =
    currency.copper + currency.silver + currency.electrum + currency.gold + currency.platinum;
  return totalCoins / COINS_PER_POUND;
}

/**
 * Calcula o peso total do inventário (itens + moedas)
 */
export function calculateInventoryWeight(items: Item[], currency: Currency): number {
  const itemsWeight = items.reduce((total, item) => total + item.weight * item.quantity, 0);
  const currencyWeight = calculateCurrencyWeight(currency);
  return itemsWeight + currencyWeight;
}

/**
 * Calcula a capacidade de carga do personagem
 * Regra D&D 5e: STR × 15 libras
 */
export function calculateCarryingCapacity(strengthScore: number): number {
  return strengthScore * 15;
}

/**
 * Verifica se o personagem está sobrecarregado
 * Sobrecarregado: peso > capacidade
 * Pesadamente sobrecarregado: peso > capacidade × 2 (não pode se mover)
 */
export function getEncumbranceStatus(
  currentWeight: number,
  capacity: number
): 'normal' | 'encumbered' | 'heavily_encumbered' {
  if (currentWeight > capacity * 2) {
    return 'heavily_encumbered';
  }
  if (currentWeight > capacity) {
    return 'encumbered';
  }
  return 'normal';
}

/**
 * Calcula o AC baseado na armadura equipada e modificador de destreza
 */
export function calculateArmorClass(
  equippedArmor: Item | null,
  equippedShield: Item | null,
  dexModifier: number
): number {
  let ac = 10 + dexModifier; // AC base sem armadura

  if (equippedArmor && equippedArmor.properties?.armorClass) {
    const armorType = equippedArmor.properties.armorType;
    const baseAC = equippedArmor.properties.armorClass;

    switch (armorType) {
      case 'light':
        // Armadura leve: AC base + DEX mod completo
        ac = baseAC + dexModifier;
        break;
      case 'medium':
        // Armadura média: AC base + DEX mod (máx +2)
        ac = baseAC + Math.min(dexModifier, 2);
        break;
      case 'heavy':
        // Armadura pesada: AC base (sem DEX)
        ac = baseAC;
        break;
      default:
        ac = baseAC;
    }
  }

  // Escudo adiciona +2 ao AC
  if (equippedShield && equippedShield.properties?.armorType === 'shield') {
    ac += 2;
  }

  return ac;
}

/**
 * Filtra itens por categoria
 */
export function filterItemsByCategory(items: Item[], category: ItemCategory): Item[] {
  return items.filter((item) => item.category === category);
}

/**
 * Filtra itens equipados
 */
export function getEquippedItems(items: Item[]): Item[] {
  return items.filter((item) => item.equipped);
}

/**
 * Encontra armadura equipada
 */
export function getEquippedArmor(items: Item[]): Item | null {
  return (
    items.find(
      (item) =>
        item.equipped &&
        item.category === 'armor' &&
        item.properties?.armorType &&
        item.properties.armorType !== 'shield'
    ) || null
  );
}

/**
 * Encontra escudo equipado
 */
export function getEquippedShield(items: Item[]): Item | null {
  return (
    items.find(
      (item) =>
        item.equipped && item.category === 'armor' && item.properties?.armorType === 'shield'
    ) || null
  );
}

/**
 * Encontra armas equipadas
 */
export function getEquippedWeapons(items: Item[]): Item[] {
  return items.filter((item) => item.equipped && item.category === 'weapon');
}

/**
 * Gera ID único para item
 */
export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
