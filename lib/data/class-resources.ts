/**
 * Sistema de Recursos de Classe D&D 5e
 * Ki, Rage, Sorcery Points, Spell Slots, etc.
 */

export type ResourceRecovery = 'short_rest' | 'long_rest' | 'dawn' | 'manual';

export interface ClassResource {
  id: string;
  name: string;
  current: number;
  max: number;
  recovery: ResourceRecovery;
  description?: string;
}

export const EMPTY_CLASS_RESOURCES: ClassResource[] = [];

/**
 * Recursos padrão por classe e nível
 */
export const CLASS_RESOURCE_TEMPLATES: Record<string, (level: number) => ClassResource[]> = {
  Monk: (level: number) => [
    {
      id: 'ki',
      name: 'Pontos de Ki',
      current: level,
      max: level,
      recovery: 'short_rest',
      description: 'Usados para habilidades de monge',
    },
  ],
  Barbarian: (level: number) => [
    {
      id: 'rage',
      name: 'Fúria',
      current:
        level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : 999,
      max: level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : 999,
      recovery: 'long_rest',
      description: 'Ativa fúria bárbara',
    },
  ],
  Sorcerer: (level: number) => [
    {
      id: 'sorcery_points',
      name: 'Pontos de Feitiçaria',
      current: level,
      max: level,
      recovery: 'long_rest',
      description: 'Metamagia e conversão de spell slots',
    },
  ],
  Warlock: (level: number) => {
    const slots = level < 2 ? 1 : level < 11 ? 2 : level < 17 ? 3 : 4;
    const slotLevel = level < 3 ? 1 : level < 5 ? 2 : level < 7 ? 3 : level < 9 ? 4 : 5;

    return [
      {
        id: 'pact_slots',
        name: `Espaços de Pacto (${slotLevel}º nível)`,
        current: slots,
        max: slots,
        recovery: 'short_rest',
        description: 'Espaços de magia do Warlock',
      },
    ];
  },
  Cleric: (level: number) => [
    {
      id: 'channel_divinity',
      name: 'Canalizar Divindade',
      current: level < 6 ? 1 : level < 18 ? 2 : 3,
      max: level < 6 ? 1 : level < 18 ? 2 : 3,
      recovery: 'short_rest',
      description: 'Habilidades de canal divino',
    },
  ],
  Druid: (level: number) => [
    {
      id: 'wild_shape',
      name: 'Forma Selvagem',
      current: 2,
      max: 2,
      recovery: 'short_rest',
      description: 'Transformação em animais',
    },
  ],
  Fighter: (level: number) => {
    const resources: ClassResource[] = [];

    if (level >= 2) {
      resources.push({
        id: 'action_surge',
        name: 'Surto de Ação',
        current: level < 17 ? 1 : 2,
        max: level < 17 ? 1 : 2,
        recovery: 'short_rest',
        description: 'Ação adicional no turno',
      });
    }

    if (level >= 9) {
      resources.push({
        id: 'indomitable',
        name: 'Indomável',
        current: level < 13 ? 1 : level < 17 ? 2 : 3,
        max: level < 13 ? 1 : level < 17 ? 2 : 3,
        recovery: 'long_rest',
        description: 'Re-rolar teste de resistência',
      });
    }

    return resources;
  },
  Bard: (level: number) => [
    {
      id: 'bardic_inspiration',
      name: 'Inspiração Bárdica',
      current: level < 5 ? 3 : level < 15 ? 4 : 5,
      max: level < 5 ? 3 : level < 15 ? 4 : 5,
      recovery: 'short_rest',
      description: 'Concede bônus a aliados',
    },
  ],
  Paladin: (level: number) => [
    {
      id: 'lay_on_hands',
      name: 'Cura pelas Mãos',
      current: level * 5,
      max: level * 5,
      recovery: 'long_rest',
      description: 'Pool de cura (HP total)',
    },
  ],
  Ranger: () => {
    // Ranger não tem recursos padrão nas regras base
    // Mas algumas subclasses podem ter
    return [];
  },
  Rogue: () => [],
  Wizard: (level: number) => {
    if (level >= 18) {
      return [
        {
          id: 'spell_mastery',
          name: 'Maestria em Magia',
          current: 1,
          max: 1,
          recovery: 'long_rest',
          description: 'Conjurar magia de 3º nível gratuitamente',
        },
      ];
    }
    return [];
  },
};

/**
 * Gera recursos baseado na classe e nível
 */
export function generateClassResources(className: string, level: number): ClassResource[] {
  const template = CLASS_RESOURCE_TEMPLATES[className];
  if (!template) return [];
  return template(level);
}

/**
 * Usa um recurso (decrementa)
 */
export function spendResource(resource: ClassResource, amount = 1): ClassResource {
  return {
    ...resource,
    current: Math.max(0, resource.current - amount),
  };
}

/**
 * Recupera um recurso (incrementa)
 */
export function recoverResource(resource: ClassResource, amount?: number): ClassResource {
  return {
    ...resource,
    current: Math.min(resource.max, resource.current + (amount ?? resource.max)),
  };
}

/**
 * Recupera recursos após descanso
 */
export function recoverResourcesAfterRest(
  resources: ClassResource[],
  restType: 'short' | 'long'
): ClassResource[] {
  return resources.map((resource) => {
    const shouldRecover =
      restType === 'long' ||
      (restType === 'short' &&
        (resource.recovery === 'short_rest' || resource.recovery === 'long_rest'));

    return shouldRecover ? recoverResource(resource) : resource;
  });
}

/**
 * Ajusta máximo de um recurso
 */
export function updateResourceMax(resource: ClassResource, newMax: number): ClassResource {
  return {
    ...resource,
    max: newMax,
    current: Math.min(resource.current, newMax),
  };
}
