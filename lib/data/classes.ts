/**
 * Dados de Classes e Arquétipos D&D 5e
 * Baseado no dnd-5e-data-reference.md
 */

export interface Archetype {
  id: string;
  name: string;
  description: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: string[];
  savingThrows: string[];
  skillChoices: number;
  availableSkills: string[];
  archetypes: Archetype[];
}

export const CLASSES: Class[] = [
  {
    id: 'barbaro',
    name: 'Bárbaro',
    description: 'Guerreiro feroz movido pela fúria interior.',
    hitDie: 12,
    primaryAbility: ['Força'],
    savingThrows: ['Força', 'Constituição'],
    skillChoices: 2,
    availableSkills: [
      'Adestrar Animais',
      'Atletismo',
      'Intimidação',
      'Natureza',
      'Percepção',
      'Sobrevivência',
    ],
    archetypes: [
      {
        id: 'caminho-berserker',
        name: 'Caminho do Berserker',
        description: 'Guerreiro que canaliza fúria pura em combate.',
      },
      {
        id: 'caminho-guerreiro-totemico',
        name: 'Caminho do Guerreiro Totêmico',
        description: 'Conexão espiritual com espíritos animais.',
      },
    ],
  },
  {
    id: 'bardo',
    name: 'Bardo',
    description: 'Artista inspirador que tece magia através da música.',
    hitDie: 8,
    primaryAbility: ['Carisma'],
    savingThrows: ['Destreza', 'Carisma'],
    skillChoices: 3,
    availableSkills: [
      'Acrobacia',
      'Arcanismo',
      'Atletismo',
      'Atuação',
      'Enganação',
      'História',
      'Intimidação',
      'Intuição',
      'Investigação',
      'Lidar com Animais',
      'Medicina',
      'Natureza',
      'Percepção',
      'Persuasão',
      'Prestidigitação',
      'Religião',
      'Sobrevivência',
      'Furtividade',
    ],
    archetypes: [
      {
        id: 'colegio-conhecimento',
        name: 'Colégio do Conhecimento',
        description: 'Eruditos que coletam conhecimento e segredos.',
      },
      {
        id: 'colegio-bravura',
        name: 'Colégio da Bravura',
        description: 'Bardos que inspiram heróis em batalha.',
      },
    ],
  },
  {
    id: 'bruxo',
    name: 'Bruxo',
    description: 'Conjurador que fez um pacto com uma entidade poderosa.',
    hitDie: 8,
    primaryAbility: ['Carisma'],
    savingThrows: ['Sabedoria', 'Carisma'],
    skillChoices: 2,
    availableSkills: [
      'Arcanismo',
      'Enganação',
      'História',
      'Intimidação',
      'Investigação',
      'Natureza',
      'Religião',
    ],
    archetypes: [
      {
        id: 'patrono-arquifada',
        name: 'Patrono Arquifada',
        description: 'Pacto com uma entidade feérica poderosa.',
      },
      {
        id: 'patrono-demonio',
        name: 'Patrono Demônio',
        description: 'Pacto com uma entidade infernal.',
      },
      {
        id: 'patrono-grande-antigo',
        name: 'Patrono Grande Antigo',
        description: 'Pacto com entidade de outro plano de existência.',
      },
    ],
  },
  {
    id: 'clerigo',
    name: 'Clérigo',
    description: 'Servo divino que canaliza o poder de sua divindade.',
    hitDie: 8,
    primaryAbility: ['Sabedoria'],
    savingThrows: ['Sabedoria', 'Carisma'],
    skillChoices: 2,
    availableSkills: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
    archetypes: [
      {
        id: 'dominio-conhecimento',
        name: 'Domínio do Conhecimento',
        description: 'Devoto do saber e da verdade.',
      },
      {
        id: 'dominio-vida',
        name: 'Domínio da Vida',
        description: 'Curador dedicado à preservação da vida.',
      },
      {
        id: 'dominio-luz',
        name: 'Domínio da Luz',
        description: 'Combatente das trevas com poder radiante.',
      },
      {
        id: 'dominio-natureza',
        name: 'Domínio da Natureza',
        description: 'Guardião do mundo natural.',
      },
      {
        id: 'dominio-tempestade',
        name: 'Domínio da Tempestade',
        description: 'Mestre dos trovões e relâmpagos.',
      },
      {
        id: 'dominio-guerra',
        name: 'Domínio da Guerra',
        description: 'Guerreiro sagrado em nome de sua divindade.',
      },
      {
        id: 'dominio-trapaça',
        name: 'Domínio da Trapaça',
        description: 'Devoto de divindades da astúcia e engano.',
      },
    ],
  },
  {
    id: 'druida',
    name: 'Druida',
    description: 'Guardião da natureza com poder de transformação.',
    hitDie: 8,
    primaryAbility: ['Sabedoria'],
    savingThrows: ['Inteligência', 'Sabedoria'],
    skillChoices: 2,
    availableSkills: [
      'Arcanismo',
      'Adestrar Animais',
      'Intuição',
      'Medicina',
      'Natureza',
      'Percepção',
      'Religião',
      'Sobrevivência',
    ],
    archetypes: [
      {
        id: 'circulo-terra',
        name: 'Círculo da Terra',
        description: 'Druida místico conectado à terra.',
      },
      {
        id: 'circulo-lua',
        name: 'Círculo da Lua',
        description: 'Metamorfo feroz com transformações poderosas.',
      },
    ],
  },
  {
    id: 'feiticeiro',
    name: 'Feiticeiro',
    description: 'Conjurador com magia inata correndo em suas veias.',
    hitDie: 6,
    primaryAbility: ['Carisma'],
    savingThrows: ['Constituição', 'Carisma'],
    skillChoices: 2,
    availableSkills: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião'],
    archetypes: [
      {
        id: 'origem-draconica',
        name: 'Origem Dracônica',
        description: 'Magia herdada de ancestrais dracônicos.',
      },
      {
        id: 'magia-selvagem',
        name: 'Magia Selvagem',
        description: 'Poder caótico e imprevisível.',
      },
    ],
  },
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    description: 'Mestre de armas e táticas de combate.',
    hitDie: 10,
    primaryAbility: ['Força', 'Destreza'],
    savingThrows: ['Força', 'Constituição'],
    skillChoices: 2,
    availableSkills: [
      'Acrobacia',
      'Adestrar Animais',
      'Atletismo',
      'História',
      'Intuição',
      'Intimidação',
      'Percepção',
      'Sobrevivência',
    ],
    archetypes: [
      {
        id: 'campeao',
        name: 'Campeão',
        description: 'Combatente puro focado em excelência física.',
      },
      {
        id: 'cavaleiro-arcano',
        name: 'Cavaleiro Arcano',
        description: 'Guerreiro que combina armas e magia.',
      },
      {
        id: 'mestre-batalha',
        name: 'Mestre de Batalha',
        description: 'Tático que usa manobras especiais.',
      },
    ],
  },
  {
    id: 'ladino',
    name: 'Ladino',
    description: 'Especialista em furtividade e ataques precisos.',
    hitDie: 8,
    primaryAbility: ['Destreza'],
    savingThrows: ['Destreza', 'Inteligência'],
    skillChoices: 4,
    availableSkills: [
      'Acrobacia',
      'Atletismo',
      'Atuação',
      'Enganação',
      'Furtividade',
      'Intimidação',
      'Intuição',
      'Investigação',
      'Percepção',
      'Persuasão',
      'Prestidigitação',
    ],
    archetypes: [
      {
        id: 'assassino',
        name: 'Assassino',
        description: 'Mestre em eliminar alvos silenciosamente.',
      },
      {
        id: 'trapaceiro-arcano',
        name: 'Trapaceiro Arcano',
        description: 'Ladino com truques mágicos.',
      },
      {
        id: 'ladrao',
        name: 'Ladrão',
        description: 'Especialista em roubo e infiltração.',
      },
    ],
  },
  {
    id: 'mago',
    name: 'Mago',
    description: 'Estudioso da magia arcana e seus mistérios.',
    hitDie: 6,
    primaryAbility: ['Inteligência'],
    savingThrows: ['Inteligência', 'Sabedoria'],
    skillChoices: 2,
    availableSkills: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'],
    archetypes: [
      {
        id: 'escola-abjuracao',
        name: 'Escola de Abjuração',
        description: 'Especialista em magias protetivas.',
      },
      {
        id: 'escola-conjuracao',
        name: 'Escola de Conjuração',
        description: 'Mestre em invocar criaturas e objetos.',
      },
      {
        id: 'escola-adivinhacao',
        name: 'Escola de Adivinhação',
        description: 'Vidente que prevê o futuro.',
      },
      {
        id: 'escola-encantamento',
        name: 'Escola de Encantamento',
        description: 'Manipulador de mentes e vontades.',
      },
      {
        id: 'escola-evocacao',
        name: 'Escola de Evocação',
        description: 'Especialista em magias destrutivas.',
      },
      {
        id: 'escola-ilusao',
        name: 'Escola de Ilusão',
        description: 'Mestre das ilusões e enganos.',
      },
      {
        id: 'escola-necromancia',
        name: 'Escola de Necromancia',
        description: 'Manipulador de forças vitais e mortos-vivos.',
      },
      {
        id: 'escola-transmutacao',
        name: 'Escola de Transmutação',
        description: 'Transformador de matéria e energia.',
      },
    ],
  },
  {
    id: 'monge',
    name: 'Monge',
    description: 'Artista marcial que canaliza energia ki.',
    hitDie: 8,
    primaryAbility: ['Destreza', 'Sabedoria'],
    savingThrows: ['Força', 'Destreza'],
    skillChoices: 2,
    availableSkills: ['Acrobacia', 'Atletismo', 'Furtividade', 'História', 'Intuição', 'Religião'],
    archetypes: [
      {
        id: 'caminho-mao-aberta',
        name: 'Caminho da Mão Aberta',
        description: 'Mestre supremo das artes marciais.',
      },
      {
        id: 'caminho-sombra',
        name: 'Caminho da Sombra',
        description: 'Ninja que usa ki para manipular sombras.',
      },
      {
        id: 'caminho-quatro-elementos',
        name: 'Caminho dos Quatro Elementos',
        description: 'Canaliza ki através dos elementos.',
      },
    ],
  },
  {
    id: 'paladino',
    name: 'Paladino',
    description: 'Guerreiro sagrado devotado a um juramento.',
    hitDie: 10,
    primaryAbility: ['Força', 'Carisma'],
    savingThrows: ['Sabedoria', 'Carisma'],
    skillChoices: 2,
    availableSkills: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião'],
    archetypes: [
      {
        id: 'juramento-devocao',
        name: 'Juramento de Devoção',
        description: 'Paladino que segue ideais de justiça e honra.',
      },
      {
        id: 'juramento-antigos',
        name: 'Juramento dos Antigos',
        description: 'Guardião da luz e vida contra as trevas.',
      },
      {
        id: 'juramento-vinganca',
        name: 'Juramento de Vingança',
        description: 'Caçador implacável do mal.',
      },
    ],
  },
  {
    id: 'patrulheiro',
    name: 'Patrulheiro',
    description: 'Guerreiro das terras selvagens e caçador nato.',
    hitDie: 10,
    primaryAbility: ['Destreza', 'Sabedoria'],
    savingThrows: ['Força', 'Destreza'],
    skillChoices: 3,
    availableSkills: [
      'Adestrar Animais',
      'Atletismo',
      'Furtividade',
      'Intuição',
      'Investigação',
      'Natureza',
      'Percepção',
      'Sobrevivência',
    ],
    archetypes: [
      {
        id: 'mestre-bestas',
        name: 'Mestre de Bestas',
        description: 'Patrulheiro com companheiro animal.',
      },
      {
        id: 'caçador',
        name: 'Caçador',
        description: 'Especialista em eliminar criaturas específicas.',
      },
    ],
  },
];

/**
 * Obter classe por ID
 */
export function getClassById(id: string): Class | undefined {
  return CLASSES.find((cls) => cls.id === id);
}

/**
 * Obter arquétipo por IDs de classe e arquétipo
 */
export function getArchetypeById(classId: string, archetypeId: string): Archetype | undefined {
  const cls = getClassById(classId);
  return cls?.archetypes.find((arch) => arch.id === archetypeId);
}
