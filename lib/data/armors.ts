/**
 * Armaduras do D&D 5e
 * Baseado no Player's Handbook (PHB)
 */

export type ArmorCategory = 'Leve' | 'Média' | 'Pesada' | 'Escudo';

export interface Armor {
  id: string;
  name: string;
  category: ArmorCategory;
  baseAC: number | string; // Número para armaduras fixas, string para fórmulas como "10 + DEX"
  maxDexBonus?: number; // null = sem limite (armadura leve), 2 = armadura média
  strengthRequired?: number; // Força mínima necessária
  stealthDisadvantage: boolean;
  cost: { gold: number };
  weight: number; // em libras
  description?: string;
  source: string;
  page: number;
}

// ==================== ARMADURAS LEVES ====================
export const LIGHT_ARMORS: Armor[] = [
  {
    id: 'padded',
    name: 'Acolchoada',
    category: 'Leve',
    baseAC: '11 + DEX',
    stealthDisadvantage: true,
    cost: { gold: 5 },
    weight: 8,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'leather',
    name: 'Couro',
    category: 'Leve',
    baseAC: '11 + DEX',
    stealthDisadvantage: false,
    cost: { gold: 10 },
    weight: 10,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'studded-leather',
    name: 'Couro Batido',
    category: 'Leve',
    baseAC: '12 + DEX',
    stealthDisadvantage: false,
    cost: { gold: 45 },
    weight: 13,
    source: 'PHB',
    page: 145,
  },
];

// ==================== ARMADURAS MÉDIAS ====================
export const MEDIUM_ARMORS: Armor[] = [
  {
    id: 'hide',
    name: 'Peles',
    category: 'Média',
    baseAC: '12 + DEX',
    maxDexBonus: 2,
    stealthDisadvantage: false,
    cost: { gold: 10 },
    weight: 12,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'chain-shirt',
    name: 'Camisão de Cota de Malha',
    category: 'Média',
    baseAC: '13 + DEX',
    maxDexBonus: 2,
    stealthDisadvantage: false,
    cost: { gold: 50 },
    weight: 20,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'scale-mail',
    name: 'Cota de Escamas',
    category: 'Média',
    baseAC: '14 + DEX',
    maxDexBonus: 2,
    stealthDisadvantage: true,
    cost: { gold: 50 },
    weight: 45,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'breastplate',
    name: 'Peitoral',
    category: 'Média',
    baseAC: '14 + DEX',
    maxDexBonus: 2,
    stealthDisadvantage: false,
    cost: { gold: 400 },
    weight: 20,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'half-plate',
    name: 'Meia-Armadura',
    category: 'Média',
    baseAC: '15 + DEX',
    maxDexBonus: 2,
    stealthDisadvantage: true,
    cost: { gold: 750 },
    weight: 40,
    source: 'PHB',
    page: 145,
  },
];

// ==================== ARMADURAS PESADAS ====================
export const HEAVY_ARMORS: Armor[] = [
  {
    id: 'ring-mail',
    name: 'Cota de Anéis',
    category: 'Pesada',
    baseAC: 14,
    stealthDisadvantage: true,
    cost: { gold: 30 },
    weight: 40,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'chain-mail',
    name: 'Cota de Malha',
    category: 'Pesada',
    baseAC: 16,
    strengthRequired: 13,
    stealthDisadvantage: true,
    cost: { gold: 75 },
    weight: 55,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'splint',
    name: 'Brunea',
    category: 'Pesada',
    baseAC: 17,
    strengthRequired: 15,
    stealthDisadvantage: true,
    cost: { gold: 200 },
    weight: 60,
    source: 'PHB',
    page: 145,
  },
  {
    id: 'plate',
    name: 'Placas',
    category: 'Pesada',
    baseAC: 18,
    strengthRequired: 15,
    stealthDisadvantage: true,
    cost: { gold: 1500 },
    weight: 65,
    source: 'PHB',
    page: 145,
  },
];

// ==================== ESCUDOS ====================
export const SHIELDS: Armor[] = [
  {
    id: 'shield',
    name: 'Escudo',
    category: 'Escudo',
    baseAC: '+2',
    stealthDisadvantage: false,
    cost: { gold: 10 },
    weight: 6,
    description: 'Adiciona +2 à CA. Requer uma mão para segurar.',
    source: 'PHB',
    page: 145,
  },
];

// ==================== FUNÇÕES AUXILIARES ====================

export const ALL_ARMORS = [...LIGHT_ARMORS, ...MEDIUM_ARMORS, ...HEAVY_ARMORS, ...SHIELDS];

export function getArmorById(id: string): Armor | undefined {
  return ALL_ARMORS.find((a) => a.id === id);
}

export function getArmorsByCategory(category: ArmorCategory): Armor[] {
  return ALL_ARMORS.filter((a) => a.category === category);
}

export function searchArmors(query: string): Armor[] {
  const lowerQuery = query.toLowerCase();
  return ALL_ARMORS.filter(
    (a) =>
      a.name.toLowerCase().includes(lowerQuery) || a.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calcula CA baseada na armadura equipada
 * PHB p.144-145
 */
export function calculateArmorClass(
  armor: Armor | null,
  hasShield: boolean,
  dexModifier: number
): number {
  let ac = 10; // CA base sem armadura

  if (armor && armor.category !== 'Escudo') {
    if (typeof armor.baseAC === 'number') {
      // Armadura pesada (CA fixa)
      ac = armor.baseAC;
    } else {
      // Armadura leve ou média (CA + DEX)
      const baseValue = parseInt(armor.baseAC.split('+')[0].trim());

      if (armor.maxDexBonus !== undefined) {
        // Armadura média (max +2 DEX)
        ac = baseValue + Math.min(dexModifier, armor.maxDexBonus);
      } else {
        // Armadura leve (DEX completo)
        ac = baseValue + dexModifier;
      }
    }
  } else {
    // Sem armadura = 10 + DEX
    ac = 10 + dexModifier;
  }

  // Adiciona escudo se equipado
  if (hasShield) {
    ac += 2;
  }

  return ac;
}

/**
 * Verifica se o personagem pode usar a armadura
 */
export function canUseArmor(
  armor: Armor,
  strengthScore: number,
  armorProficiencies: string[]
): { canUse: boolean; reason?: string } {
  // Verificar força mínima
  if (armor.strengthRequired && strengthScore < armor.strengthRequired) {
    return {
      canUse: false,
      reason: `Requer Força ${armor.strengthRequired} (você tem ${strengthScore})`,
    };
  }

  // Verificar proficiência
  const categoryMap: Record<ArmorCategory, string[]> = {
    Leve: ['Armaduras Leves', 'Todas as Armaduras'],
    Média: ['Armaduras Médias', 'Todas as Armaduras'],
    Pesada: ['Armaduras Pesadas', 'Todas as Armaduras'],
    Escudo: ['Escudos', 'Todas as Armaduras'],
  };

  const requiredProfs = categoryMap[armor.category];
  const hasProficiency = requiredProfs.some((prof) => armorProficiencies.includes(prof));

  if (!hasProficiency) {
    return {
      canUse: false,
      reason: `Não proficiente em ${armor.category}`,
    };
  }

  return { canUse: true };
}

/**
 * Retorna penalidades de usar armadura sem proficiência
 * PHB p.144
 */
export function getArmorPenalties(
  armor: Armor | null,
  armorProficiencies: string[]
): {
  hasDisadvantage: boolean;
  cannotCastSpells: boolean;
} {
  if (!armor || armor.category === 'Escudo') {
    return { hasDisadvantage: false, cannotCastSpells: false };
  }

  const profCheck = canUseArmor(armor, 20, armorProficiencies); // Ignora requisito de Força aqui

  return {
    hasDisadvantage: !profCheck.canUse,
    cannotCastSpells: !profCheck.canUse,
  };
}
