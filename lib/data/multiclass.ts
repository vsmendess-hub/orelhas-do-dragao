/**
 * Sistema de Multiclasse D&D 5e
 * Permite que personagens tenham níveis em múltiplas classes
 */

export interface ClassLevel {
  className: string;
  level: number;
  hitDie: string; // d6, d8, d10, d12
  subclass?: string;
}

export interface MulticlassCharacter {
  classes: ClassLevel[];
  totalLevel: number;
}

// Pré-requisitos de atributos para multiclasse
export const MULTICLASS_PREREQUISITES: Record<string, { attribute: string; minimum: number }[]> = {
  Bárbaro: [{ attribute: 'str', minimum: 13 }],
  Bardo: [{ attribute: 'cha', minimum: 13 }],
  Bruxo: [{ attribute: 'cha', minimum: 13 }],
  Clérigo: [{ attribute: 'wis', minimum: 13 }],
  Druida: [{ attribute: 'wis', minimum: 13 }],
  Feiticeiro: [{ attribute: 'cha', minimum: 13 }],
  Guerreiro: [
    { attribute: 'str', minimum: 13 },
    { attribute: 'dex', minimum: 13 }, // OR
  ],
  Ladino: [{ attribute: 'dex', minimum: 13 }],
  Mago: [{ attribute: 'int', minimum: 13 }],
  Monge: [
    { attribute: 'dex', minimum: 13 },
    { attribute: 'wis', minimum: 13 }, // AND
  ],
  Paladino: [
    { attribute: 'str', minimum: 13 },
    { attribute: 'cha', minimum: 13 }, // AND
  ],
  Ranger: [
    { attribute: 'dex', minimum: 13 },
    { attribute: 'wis', minimum: 13 }, // AND
  ],
};

// Hit dice por classe
export const CLASS_HIT_DICE: Record<string, string> = {
  Bárbaro: 'd12',
  Bardo: 'd8',
  Bruxo: 'd8',
  Clérigo: 'd8',
  Druida: 'd8',
  Feiticeiro: 'd6',
  Guerreiro: 'd10',
  Ladino: 'd8',
  Mago: 'd6',
  Monge: 'd8',
  Paladino: 'd10',
  Ranger: 'd10',
};

// Classes que conjuram magias e seu nível de caster
export type CasterType = 'full' | 'half' | 'third' | 'pact' | 'none';

export const CLASS_CASTER_TYPE: Record<string, CasterType> = {
  Bárbaro: 'none',
  Bardo: 'full',
  Bruxo: 'pact', // Pact Magic é diferente
  Clérigo: 'full',
  Druida: 'full',
  Feiticeiro: 'full',
  Guerreiro: 'third', // Eldritch Knight
  Ladino: 'third', // Arcane Trickster
  Mago: 'full',
  Monge: 'none',
  Paladino: 'half',
  Ranger: 'half',
};

/**
 * Calcula o nível total do personagem
 */
export function calculateTotalLevel(classes: ClassLevel[]): number {
  return classes.reduce((total, cls) => total + cls.level, 0);
}

/**
 * Calcula o proficiency bonus baseado no nível total
 */
export function calculateMulticlassProficiencyBonus(totalLevel: number): number {
  return Math.floor((totalLevel - 1) / 4) + 2;
}

/**
 * Verifica se o personagem pode adicionar uma classe
 * baseado nos pré-requisitos de atributos
 */
export function canMulticlassInto(
  className: string,
  attributes: Record<string, number>
): { can: boolean; reason?: string } {
  const prerequisites = MULTICLASS_PREREQUISITES[className];
  if (!prerequisites) {
    return { can: false, reason: 'Classe não encontrada' };
  }

  // Para Guerreiro, é STR OR DEX (pelo menos um deve ser 13+)
  if (className === 'Guerreiro') {
    const hasStr = attributes.str >= 13;
    const hasDex = attributes.dex >= 13;
    if (!hasStr && !hasDex) {
      return { can: false, reason: 'Requer Força OU Destreza 13+' };
    }
    return { can: true };
  }

  // Para outras classes, todos os pré-requisitos são AND
  for (const prereq of prerequisites) {
    if (attributes[prereq.attribute] < prereq.minimum) {
      const attrName = prereq.attribute.toUpperCase();
      return { can: false, reason: `Requer ${attrName} ${prereq.minimum}+` };
    }
  }

  return { can: true };
}

/**
 * Calcula o caster level para spell slots de multiclasse
 * Não inclui Warlock (Pact Magic)
 */
export function calculateMulticlassCasterLevel(classes: ClassLevel[]): number {
  let casterLevel = 0;

  for (const cls of classes) {
    const casterType = CLASS_CASTER_TYPE[cls.className];

    if (casterType === 'full') {
      casterLevel += cls.level;
    } else if (casterType === 'half') {
      casterLevel += Math.floor(cls.level / 2);
    } else if (casterType === 'third') {
      casterLevel += Math.floor(cls.level / 3);
    }
    // 'pact' e 'none' não contribuem para caster level
  }

  return casterLevel;
}

/**
 * Retorna todos os hit dice do personagem multiclasse
 */
export function getMulticlassHitDice(classes: ClassLevel[]): Record<string, number> {
  const hitDice: Record<string, number> = {};

  for (const cls of classes) {
    const die = CLASS_HIT_DICE[cls.className] || 'd8';
    hitDice[die] = (hitDice[die] || 0) + cls.level;
  }

  return hitDice;
}

/**
 * Formata a descrição do personagem multiclasse
 * Ex: "Guerreiro 5 / Mago 3"
 */
export function formatMulticlassDescription(classes: ClassLevel[]): string {
  return classes.map((cls) => `${cls.className} ${cls.level}`).join(' / ');
}

/**
 * Verifica se o personagem é multiclasse
 */
export function isMulticlass(classes: ClassLevel[]): boolean {
  return classes.length > 1;
}

/**
 * Retorna a classe primária (maior nível)
 */
export function getPrimaryClass(classes: ClassLevel[]): ClassLevel | null {
  if (classes.length === 0) return null;
  return classes.reduce((prev, current) => (current.level > prev.level ? current : prev));
}

/**
 * Adiciona um nível em uma classe
 */
export function addClassLevel(
  classes: ClassLevel[],
  className: string,
  subclass?: string
): ClassLevel[] {
  const existingClass = classes.find((c) => c.className === className);

  if (existingClass) {
    // Aumentar nível da classe existente
    return classes.map((c) =>
      c.className === className
        ? { ...c, level: c.level + 1, subclass: subclass || c.subclass }
        : c
    );
  } else {
    // Adicionar nova classe
    const hitDie = CLASS_HIT_DICE[className] || 'd8';
    return [
      ...classes,
      {
        className,
        level: 1,
        hitDie,
        subclass,
      },
    ];
  }
}

/**
 * Remove um nível de uma classe
 */
export function removeClassLevel(classes: ClassLevel[], className: string): ClassLevel[] {
  const existingClass = classes.find((c) => c.className === className);
  if (!existingClass) return classes;

  if (existingClass.level === 1) {
    // Remover a classe completamente
    return classes.filter((c) => c.className !== className);
  } else {
    // Diminuir o nível
    return classes.map((c) => (c.className === className ? { ...c, level: c.level - 1 } : c));
  }
}

/**
 * Valida se a configuração de multiclasse é válida
 */
export function validateMulticlass(
  classes: ClassLevel[],
  attributes: Record<string, number>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verificar se tem pelo menos uma classe
  if (classes.length === 0) {
    errors.push('Personagem deve ter pelo menos uma classe');
  }

  // Verificar pré-requisitos para cada classe
  for (const cls of classes) {
    const check = canMulticlassInto(cls.className, attributes);
    if (!check.can && check.reason) {
      errors.push(`${cls.className}: ${check.reason}`);
    }
  }

  // Verificar se níveis são positivos
  for (const cls of classes) {
    if (cls.level < 1) {
      errors.push(`${cls.className}: Nível deve ser pelo menos 1`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
