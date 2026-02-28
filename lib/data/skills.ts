/**
 * Perícias (Skills) D&D 5e
 */

export interface Skill {
  id: string;
  name: string;
  ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  description: string;
}

export const SKILLS: Skill[] = [
  {
    id: 'acrobacia',
    name: 'Acrobacia',
    ability: 'dex',
    description: 'Equilíbrio, piruetas e proezas acrobáticas.',
  },
  {
    id: 'adestrar-animais',
    name: 'Adestrar Animais',
    ability: 'wis',
    description: 'Acalmar, treinar e montar animais.',
  },
  {
    id: 'arcanismo',
    name: 'Arcanismo',
    ability: 'int',
    description: 'Conhecimento sobre magia, magias e itens mágicos.',
  },
  {
    id: 'atletismo',
    name: 'Atletismo',
    ability: 'str',
    description: 'Escalar, nadar, pular e feitos de força física.',
  },
  {
    id: 'atuacao',
    name: 'Atuação',
    ability: 'cha',
    description: 'Entreter através de música, dança ou teatro.',
  },
  {
    id: 'enganacao',
    name: 'Enganação',
    ability: 'cha',
    description: 'Mentir, disfarçar-se e ocultar intenções.',
  },
  {
    id: 'furtividade',
    name: 'Furtividade',
    ability: 'dex',
    description: 'Mover-se silenciosamente e esconder-se.',
  },
  {
    id: 'historia',
    name: 'História',
    ability: 'int',
    description: 'Conhecimento sobre eventos históricos e lendas.',
  },
  {
    id: 'intimidacao',
    name: 'Intimidação',
    ability: 'cha',
    description: 'Influenciar através de ameaças e hostilidade.',
  },
  {
    id: 'intuicao',
    name: 'Intuição',
    ability: 'wis',
    description: 'Ler linguagem corporal e detectar mentiras.',
  },
  {
    id: 'investigacao',
    name: 'Investigação',
    ability: 'int',
    description: 'Encontrar pistas e deduzir conclusões.',
  },
  {
    id: 'medicina',
    name: 'Medicina',
    ability: 'wis',
    description: 'Diagnosticar doenças e estabilizar aliados.',
  },
  {
    id: 'natureza',
    name: 'Natureza',
    ability: 'int',
    description: 'Conhecimento sobre terreno, plantas e animais.',
  },
  {
    id: 'percepcao',
    name: 'Percepção',
    ability: 'wis',
    description: 'Detectar, ouvir e notar detalhes.',
  },
  {
    id: 'persuasao',
    name: 'Persuasão',
    ability: 'cha',
    description: 'Influenciar através de tato e respeito.',
  },
  {
    id: 'prestidigitacao',
    name: 'Prestidigitação',
    ability: 'dex',
    description: 'Truques manuais, roubar e desarmar armadilhas.',
  },
  {
    id: 'religiao',
    name: 'Religião',
    ability: 'int',
    description: 'Conhecimento sobre divindades, ritos e símbolos sagrados.',
  },
  {
    id: 'sobrevivencia',
    name: 'Sobrevivência',
    ability: 'wis',
    description: 'Rastrear, caçar e navegar em terrenos selvagens.',
  },
];

/**
 * Obter skill por ID
 */
export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find((skill) => skill.id === id);
}

/**
 * Obter skills por atributo base
 */
export function getSkillsByAbility(ability: Skill['ability']): Skill[] {
  return SKILLS.filter((skill) => skill.ability === ability);
}
