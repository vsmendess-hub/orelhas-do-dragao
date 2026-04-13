/**
 * Lista completa das 18 perícias do D&D 5e
 * Com atributo base para cada uma
 */

export interface SkillDefinition {
  id: string;
  name: string;
  attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
}

export const ALL_SKILLS: SkillDefinition[] = [
  // Força
  { id: 'athletics', name: 'Atletismo', attribute: 'str' },

  // Destreza
  { id: 'acrobatics', name: 'Acrobacia', attribute: 'dex' },
  { id: 'sleight_of_hand', name: 'Prestidigitação', attribute: 'dex' },
  { id: 'stealth', name: 'Furtividade', attribute: 'dex' },

  // Inteligência
  { id: 'arcana', name: 'Arcanismo', attribute: 'int' },
  { id: 'history', name: 'História', attribute: 'int' },
  { id: 'investigation', name: 'Investigação', attribute: 'int' },
  { id: 'nature', name: 'Natureza', attribute: 'int' },
  { id: 'religion', name: 'Religião', attribute: 'int' },

  // Sabedoria
  { id: 'animal_handling', name: 'Lidar com Animais', attribute: 'wis' },
  { id: 'insight', name: 'Intuição', attribute: 'wis' },
  { id: 'medicine', name: 'Medicina', attribute: 'wis' },
  { id: 'perception', name: 'Percepção', attribute: 'wis' },
  { id: 'survival', name: 'Sobrevivência', attribute: 'wis' },

  // Carisma
  { id: 'deception', name: 'Enganação', attribute: 'cha' },
  { id: 'intimidation', name: 'Intimidação', attribute: 'cha' },
  { id: 'performance', name: 'Atuação', attribute: 'cha' },
  { id: 'persuasion', name: 'Persuasão', attribute: 'cha' },
];

/**
 * Mapa de nomes de perícias para IDs
 * Útil para converter skills do personagem (que usam nomes) para IDs
 */
export const SKILL_NAME_TO_ID: Record<string, string> = {
  Atletismo: 'athletics',
  Acrobacia: 'acrobatics',
  Prestidigitação: 'sleight_of_hand',
  Furtividade: 'stealth',
  Arcanismo: 'arcana',
  História: 'history',
  Investigação: 'investigation',
  Natureza: 'nature',
  Religião: 'religion',
  'Lidar com Animais': 'animal_handling',
  Intuição: 'insight',
  Medicina: 'medicine',
  Percepção: 'perception',
  Sobrevivência: 'survival',
  Enganação: 'deception',
  Intimidação: 'intimidation',
  Atuação: 'performance',
  Persuasão: 'persuasion',
};

/**
 * Obter definição de perícia por nome
 */
export function getSkillByName(name: string): SkillDefinition | undefined {
  return ALL_SKILLS.find((skill) => skill.name === name);
}

/**
 * Obter definição de perícia por ID
 */
export function getSkillById(id: string): SkillDefinition | undefined {
  return ALL_SKILLS.find((skill) => skill.id === id);
}
