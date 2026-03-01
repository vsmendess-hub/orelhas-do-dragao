/**
 * Sistema de Magias D&D 5e
 * Tipos e interfaces para magias, slots e conjuração
 */

// Escolas de magia do D&D 5e
export type SpellSchool =
  | 'Abjuração'
  | 'Adivinhação'
  | 'Conjuração'
  | 'Encantamento'
  | 'Evocação'
  | 'Ilusão'
  | 'Necromancia'
  | 'Transmutação';

// Níveis de magia (0 = truque)
export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Componentes de magia
export interface SpellComponents {
  verbal: boolean; // V
  somatic: boolean; // S
  material: boolean; // M
  materialDescription?: string; // Descrição do componente material
}

// Tempo de conjuração
export type CastingTime =
  | '1 ação'
  | '1 ação bônus'
  | '1 reação'
  | '1 minuto'
  | '10 minutos'
  | '1 hora'
  | '8 horas'
  | '12 horas'
  | '24 horas';

// Duração da magia
export type SpellDuration =
  | 'Instantânea'
  | '1 rodada'
  | '1 minuto'
  | '10 minutos'
  | '1 hora'
  | '8 horas'
  | '24 horas'
  | '7 dias'
  | '10 dias'
  | '30 dias'
  | 'Até ser dissipada'
  | 'Especial';

// Concentração
export type Concentration = 'Sim' | 'Não';

// Ritual
export type Ritual = 'Sim' | 'Não';

// Magia completa
export interface Spell {
  id: string;
  name: string;
  level: SpellLevel;
  school: SpellSchool;
  castingTime: CastingTime;
  range: string; // Ex: "9 metros", "Toque", "Pessoal"
  components: SpellComponents;
  duration: SpellDuration;
  concentration: Concentration;
  ritual: Ritual;
  description: string;
  higherLevels?: string; // Descrição ao conjurar em níveis superiores
  prepared?: boolean; // Para classes que preparam magias
  source?: string; // Ex: "PHB", "Xanathar", etc.
}

// Slots de magia por nível
export interface SpellSlots {
  level1: { total: number; used: number };
  level2: { total: number; used: number };
  level3: { total: number; used: number };
  level4: { total: number; used: number };
  level5: { total: number; used: number };
  level6: { total: number; used: number };
  level7: { total: number; used: number };
  level8: { total: number; used: number };
  level9: { total: number; used: number };
}

// Informações de conjurador
export interface SpellcasterInfo {
  spellcastingAbility: 'int' | 'wis' | 'cha'; // Atributo usado
  spellSaveDC: number; // CD de resistência
  spellAttackBonus: number; // Bônus de ataque com magia
}

// Classes que preparam magias vs conhecem magias
export type PreparedCasterClass = 'Clérigo' | 'Druida' | 'Paladino' | 'Mago';
export type KnownCasterClass = 'Bardo' | 'Feiticeiro' | 'Bruxo' | 'Patrulheiro';

// Dados completos de magias do personagem
export interface CharacterSpells {
  spells: Spell[];
  spellSlots: SpellSlots;
  spellcasterInfo: SpellcasterInfo;
  cantripsKnown: number; // Quantidade de truques conhecidos
  spellsKnown?: number; // Para conjuradores espontâneos
  spellsPrepared?: number; // Para conjuradores que preparam
}

// Slots vazios por padrão
export const EMPTY_SPELL_SLOTS: SpellSlots = {
  level1: { total: 0, used: 0 },
  level2: { total: 0, used: 0 },
  level3: { total: 0, used: 0 },
  level4: { total: 0, used: 0 },
  level5: { total: 0, used: 0 },
  level6: { total: 0, used: 0 },
  level7: { total: 0, used: 0 },
  level8: { total: 0, used: 0 },
  level9: { total: 0, used: 0 },
};

// Info de conjurador vazia
export const EMPTY_SPELLCASTER_INFO: SpellcasterInfo = {
  spellcastingAbility: 'int',
  spellSaveDC: 8,
  spellAttackBonus: 0,
};

/**
 * Calcula CD de resistência de magia
 * Fórmula: 8 + bônus de proficiência + modificador do atributo
 */
export function calculateSpellSaveDC(proficiencyBonus: number, abilityModifier: number): number {
  return 8 + proficiencyBonus + abilityModifier;
}

/**
 * Calcula bônus de ataque com magia
 * Fórmula: bônus de proficiência + modificador do atributo
 */
export function calculateSpellAttackBonus(
  proficiencyBonus: number,
  abilityModifier: number
): number {
  return proficiencyBonus + abilityModifier;
}

/**
 * Calcula quantas magias um conjurador pode preparar
 * Fórmula: modificador do atributo + nível (mínimo 1)
 */
export function calculatePreparedSpells(abilityModifier: number, level: number): number {
  return Math.max(1, abilityModifier + level);
}

/**
 * Verifica se uma classe prepara magias
 */
export function isPreparingCaster(className: string): boolean {
  const preparingClasses: PreparedCasterClass[] = ['Clérigo', 'Druida', 'Paladino', 'Mago'];
  return preparingClasses.includes(className as PreparedCasterClass);
}

/**
 * Retorna o atributo de conjuração baseado na classe
 */
export function getSpellcastingAbility(className: string): 'int' | 'wis' | 'cha' {
  const intelligenceClasses = ['Mago', 'Arcanista'];
  const wisdomClasses = ['Clérigo', 'Druida', 'Patrulheiro', 'Monge'];
  const charismaClasses = ['Bardo', 'Feiticeiro', 'Bruxo', 'Paladino'];

  if (intelligenceClasses.some((c) => className.includes(c))) return 'int';
  if (wisdomClasses.some((c) => className.includes(c))) return 'wis';
  if (charismaClasses.some((c) => className.includes(c))) return 'cha';

  return 'int'; // Padrão
}

/**
 * Formata componentes de magia para exibição
 */
export function formatSpellComponents(components: SpellComponents): string {
  const parts: string[] = [];
  if (components.verbal) parts.push('V');
  if (components.somatic) parts.push('S');
  if (components.material) {
    if (components.materialDescription) {
      parts.push(`M (${components.materialDescription})`);
    } else {
      parts.push('M');
    }
  }
  return parts.join(', ') || 'Nenhum';
}

/**
 * Retorna nome do nível da magia
 */
export function getSpellLevelName(level: SpellLevel): string {
  if (level === 0) return 'Truque';
  if (level === 1) return '1º Nível';
  if (level === 2) return '2º Nível';
  if (level === 3) return '3º Nível';
  return `${level}º Nível`;
}

/**
 * Retorna cor baseada na escola de magia
 */
export function getSchoolColor(school: SpellSchool): string {
  const colors: Record<SpellSchool, string> = {
    Abjuração: 'text-blue-600 dark:text-blue-400',
    Adivinhação: 'text-purple-600 dark:text-purple-400',
    Conjuração: 'text-yellow-600 dark:text-yellow-400',
    Encantamento: 'text-pink-600 dark:text-pink-400',
    Evocação: 'text-red-600 dark:text-red-400',
    Ilusão: 'text-indigo-600 dark:text-indigo-400',
    Necromancia: 'text-gray-600 dark:text-gray-400',
    Transmutação: 'text-green-600 dark:text-green-400',
  };
  return colors[school];
}

/**
 * Verifica se tem slots disponíveis
 */
export function hasAvailableSlots(slots: SpellSlots, level: SpellLevel): boolean {
  if (level === 0) return true; // Truques são ilimitados

  const slotKey = `level${level}` as keyof SpellSlots;
  const slot = slots[slotKey];
  return slot.used < slot.total;
}

/**
 * Conta slots disponíveis por nível
 */
export function countAvailableSlots(slots: SpellSlots, level: SpellLevel): number {
  if (level === 0) return Infinity; // Truques são ilimitados

  const slotKey = `level${level}` as keyof SpellSlots;
  const slot = slots[slotKey];
  return slot.total - slot.used;
}

/**
 * Restaura todos os slots (descanso longo)
 */
export function restoreAllSlots(slots: SpellSlots): SpellSlots {
  return {
    level1: { ...slots.level1, used: 0 },
    level2: { ...slots.level2, used: 0 },
    level3: { ...slots.level3, used: 0 },
    level4: { ...slots.level4, used: 0 },
    level5: { ...slots.level5, used: 0 },
    level6: { ...slots.level6, used: 0 },
    level7: { ...slots.level7, used: 0 },
    level8: { ...slots.level8, used: 0 },
    level9: { ...slots.level9, used: 0 },
  };
}

// Lista de magias comuns do SRD (exemplos)
export const COMMON_SPELLS: Omit<Spell, 'id'>[] = [
  {
    name: 'Mísseis Mágicos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantânea',
    concentration: 'Não',
    ritual: 'Não',
    description:
      'Você cria três dardos brilhantes de energia mágica. Cada dardo atinge uma criatura à sua escolha que você possa ver dentro do alcance. Um dardo causa 1d4 + 1 de dano de força ao alvo. Os dardos atingem simultaneamente.',
    higherLevels:
      'Quando você conjura esta magia usando um espaço de magia de 2º nível ou superior, a magia cria mais um dardo para cada nível do espaço acima do 1º.',
    source: 'PHB',
  },
  {
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantânea',
    concentration: 'Não',
    ritual: 'Não',
    description:
      'Uma criatura que você tocar recupera um número de pontos de vida igual a 1d8 + seu modificador de habilidade de conjuração.',
    higherLevels:
      'Quando você conjura esta magia usando um espaço de magia de 2º nível ou superior, a cura aumenta em 1d8 para cada nível do espaço acima do 1º.',
    source: 'PHB',
  },
  {
    name: 'Bola de Fogo',
    level: 3,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '45 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'uma bolinha de guano de morcego e enxofre',
    },
    duration: 'Instantânea',
    concentration: 'Não',
    ritual: 'Não',
    description:
      'Um raio brilhante emerge de seu dedo apontado para um ponto escolhido dentro do alcance e então explode em uma erupção de chamas. Cada criatura em uma esfera de 6 metros centrada naquele ponto deve fazer um teste de resistência de Destreza. Um alvo sofre 8d6 de dano de fogo em um fracasso, ou metade em um sucesso.',
    higherLevels:
      'Quando você conjura esta magia usando um espaço de magia de 4º nível ou superior, o dano aumenta em 1d6 para cada nível do espaço acima do 3º.',
    source: 'PHB',
  },
  {
    name: 'Detectar Magia',
    level: 1,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    components: { verbal: true, somatic: true, material: false },
    duration: '10 minutos',
    concentration: 'Sim',
    ritual: 'Sim',
    description:
      'Pela duração, você sente a presença de magia dentro de 9 metros. Se você sentir magia desta forma, você pode usar sua ação para ver uma aura fraca ao redor de qualquer criatura ou objeto visível na área que tenha magia, e você aprende a escola de magia, se houver.',
    source: 'PHB',
  },
  {
    name: 'Luz',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: {
      verbal: true,
      material: true,
      materialDescription: 'um vaga-lume ou musgo fosforescente',
      somatic: false,
    },
    duration: '1 hora',
    concentration: 'Não',
    ritual: 'Não',
    description:
      'Você toca um objeto que não seja maior que 3 metros em qualquer dimensão. Até a magia terminar, o objeto emite luz brilhante em um raio de 6 metros e penumbra por mais 6 metros. A luz pode ser de qualquer cor que você escolher.',
    source: 'PHB',
  },
  {
    name: 'Raio Gélido',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '18 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantânea',
    concentration: 'Não',
    ritual: 'Não',
    description:
      'Um raio de luz azul-branca congelante atinge uma criatura dentro do alcance. Faça um ataque de magia à distância contra o alvo. Se acertar, ele sofre 1d8 de dano de frio, e seu deslocamento é reduzido em 3 metros até o início de seu próximo turno.',
    higherLevels:
      'O dano da magia aumenta em 1d8 quando você alcança o 5º nível (2d8), 11º nível (3d8) e 17º nível (4d8).',
    source: 'PHB',
  },
];
