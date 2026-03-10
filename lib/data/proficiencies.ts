/**
 * Sistema de Proficiências Automáticas
 * Baseado no Player's Handbook (PHB) D&D 5e
 */

export interface Proficiencies {
  weapons: string[];
  armor: string[];
  tools: string[];
  languages: string[];
  savingThrows?: string[]; // Específico de classes
  skills?: string[]; // Algumas raças e backgrounds dão proficiências em perícias
}

// ==================== PROFICIÊNCIAS POR RAÇA ====================

export const RACE_PROFICIENCIES: Record<string, Proficiencies> = {
  Humano: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', '1 idioma à escolha'],
  },
  Elfo: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Élfico'],
    skills: ['Percepção'],
  },
  'Alto Elfo': {
    weapons: ['Espada Longa', 'Espada Curta', 'Arco Longo', 'Arco Curto'],
    armor: [],
    tools: [],
    languages: ['1 idioma à escolha'],
  },
  'Elfo da Floresta': {
    weapons: ['Espada Longa', 'Espada Curta', 'Arco Longo', 'Arco Curto'],
    armor: [],
    tools: [],
    languages: [],
  },
  'Elfo Negro (Drow)': {
    weapons: ['Rapier', 'Espada Curta', 'Besta de Mão'],
    armor: [],
    tools: [],
    languages: [],
  },
  Anão: {
    weapons: ['Machado de Batalha', 'Machadinha', 'Martelo Leve', 'Martelo de Guerra'],
    armor: [],
    tools: [
      '1 ferramenta de artesão à escolha: Ferramentas de Ferreiro, Suprimentos de Cervejeiro ou Ferramentas de Pedreiro',
    ],
    languages: ['Comum', 'Anão'],
  },
  'Anão da Montanha': {
    weapons: [],
    armor: ['Armaduras Leves', 'Armaduras Médias'],
    tools: [],
    languages: [],
  },
  'Anão da Colina': {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
  },
  Halfling: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Halfling'],
  },
  'Pés-Leves': {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
  },
  Robusto: {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
  },
  Draconato: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Dracônico'],
  },
  Gnomo: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Gnômico'],
  },
  'Gnomo da Floresta': {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
  },
  'Gnomo das Rochas': {
    weapons: [],
    armor: [],
    tools: ['Ferramentas de Artesão (Ferramentas de Engenhoqueiro)'],
    languages: [],
  },
  'Meio-Elfo': {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Élfico', '1 idioma à escolha'],
    skills: ['2 perícias à escolha'],
  },
  'Meio-Orc': {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Orc'],
    skills: ['Intimidação'],
  },
  Tiefling: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['Comum', 'Infernal'],
  },
};

// ==================== PROFICIÊNCIAS POR CLASSE ====================

export const CLASS_PROFICIENCIES: Record<string, Proficiencies> = {
  Bárbaro: {
    weapons: ['Armas Simples', 'Armas Marciais'],
    armor: ['Armaduras Leves', 'Armaduras Médias', 'Escudos'],
    tools: [],
    languages: [],
    savingThrows: ['Força', 'Constituição'],
    skills: [
      'Escolha 2: Adestrar Animais, Atletismo, Intimidação, Natureza, Percepção, Sobrevivência',
    ],
  },
  Bardo: {
    weapons: ['Armas Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapieres', 'Espadas Curtas'],
    armor: ['Armaduras Leves'],
    tools: ['3 instrumentos musicais à escolha'],
    languages: [],
    savingThrows: ['Destreza', 'Carisma'],
    skills: ['Escolha 3 quaisquer'],
  },
  Bruxo: {
    weapons: ['Armas Simples'],
    armor: ['Armaduras Leves'],
    tools: [],
    languages: [],
    savingThrows: ['Sabedoria', 'Carisma'],
    skills: [
      'Escolha 2: Arcanismo, Enganação, História, Intimidação, Investigação, Natureza, Religião',
    ],
  },
  Clérigo: {
    weapons: ['Armas Simples'],
    armor: ['Armaduras Leves', 'Armaduras Médias', 'Escudos'],
    tools: [],
    languages: [],
    savingThrows: ['Sabedoria', 'Carisma'],
    skills: ['Escolha 2: História, Intuição, Medicina, Persuasão, Religião'],
  },
  Druida: {
    weapons: [
      'Clavas',
      'Adagas',
      'Dardos',
      'Azagaias',
      'Maças',
      'Bordões',
      'Cimitarras',
      'Foices',
      'Fundas',
      'Lanças',
    ],
    armor: [
      'Armaduras Leves',
      'Armaduras Médias',
      'Escudos (druidas não usarão armadura ou escudos feitos de metal)',
    ],
    tools: ['Kit de Herbalismo'],
    languages: ['Druídico'],
    savingThrows: ['Inteligência', 'Sabedoria'],
    skills: [
      'Escolha 2: Arcanismo, Adestrar Animais, Intuição, Medicina, Natureza, Percepção, Religião, Sobrevivência',
    ],
  },
  Feiticeiro: {
    weapons: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
    armor: [],
    tools: [],
    languages: [],
    savingThrows: ['Constituição', 'Carisma'],
    skills: ['Escolha 2: Arcanismo, Enganação, Intuição, Intimidação, Persuasão, Religião'],
  },
  Guerreiro: {
    weapons: ['Armas Simples', 'Armas Marciais'],
    armor: ['Todas as Armaduras', 'Escudos'],
    tools: [],
    languages: [],
    savingThrows: ['Força', 'Constituição'],
    skills: [
      'Escolha 2: Acrobacia, Adestrar Animais, Atletismo, História, Intuição, Intimidação, Percepção, Sobrevivência',
    ],
  },
  Ladino: {
    weapons: ['Armas Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapieres', 'Espadas Curtas'],
    armor: ['Armaduras Leves'],
    tools: ['Ferramentas de Ladrão'],
    languages: [],
    savingThrows: ['Destreza', 'Inteligência'],
    skills: [
      'Escolha 4: Acrobacia, Atletismo, Atuação, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Persuasão, Prestidigitação',
    ],
  },
  Mago: {
    weapons: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
    armor: [],
    tools: [],
    languages: [],
    savingThrows: ['Inteligência', 'Sabedoria'],
    skills: ['Escolha 2: Arcanismo, História, Intuição, Investigação, Medicina, Religião'],
  },
  Monge: {
    weapons: ['Armas Simples', 'Espadas Curtas'],
    armor: [],
    tools: ['1 tipo de ferramenta de artesão ou 1 instrumento musical à escolha'],
    languages: [],
    savingThrows: ['Força', 'Destreza'],
    skills: ['Escolha 2: Acrobacia, Atletismo, Furtividade, História, Intuição, Religião'],
  },
  Paladino: {
    weapons: ['Armas Simples', 'Armas Marciais'],
    armor: ['Todas as Armaduras', 'Escudos'],
    tools: [],
    languages: [],
    savingThrows: ['Sabedoria', 'Carisma'],
    skills: ['Escolha 2: Atletismo, Intuição, Intimidação, Medicina, Persuasão, Religião'],
  },
  Patrulheiro: {
    weapons: ['Armas Simples', 'Armas Marciais'],
    armor: ['Armaduras Leves', 'Armaduras Médias', 'Escudos'],
    tools: [],
    languages: [],
    savingThrows: ['Força', 'Destreza'],
    skills: [
      'Escolha 3: Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção, Sobrevivência',
    ],
  },
};

// ==================== PROFICIÊNCIAS POR DOMÍNIO (CLÉRIGO) ====================

export const CLERIC_DOMAIN_PROFICIENCIES: Record<string, Proficiencies> = {
  Conhecimento: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['2 idiomas à escolha'],
    skills: [
      'Escolha 2: Arcanismo, História, Natureza, Religião (adiciona dobro do bônus de proficiência)',
    ],
  },
  Enganação: {
    weapons: [],
    armor: [],
    tools: ['Kit de Disfarce', 'Kit de Envenenador'],
    languages: [],
    skills: [],
  },
  Guerra: {
    weapons: ['Armas Marciais'],
    armor: ['Armaduras Pesadas'],
    tools: [],
    languages: [],
    skills: [],
  },
  Luz: {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
    skills: [],
  },
  Natureza: {
    weapons: ['Armaduras Pesadas'],
    armor: [],
    tools: [],
    languages: [],
    skills: [
      'Escolha 1: Adestrar Animais, Natureza, Sobrevivência (adiciona dobro do bônus de proficiência)',
    ],
  },
  Tempestade: {
    weapons: ['Armas Marciais'],
    armor: ['Armaduras Pesadas'],
    tools: [],
    languages: [],
    skills: [],
  },
  Vida: {
    weapons: [],
    armor: ['Armaduras Pesadas'],
    tools: [],
    languages: [],
    skills: [],
  },
};

// ==================== PROFICIÊNCIAS POR BACKGROUND ====================

export const BACKGROUND_PROFICIENCIES: Record<string, Proficiencies> = {
  Acólito: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['2 idiomas à escolha'],
    skills: ['Intuição', 'Religião'],
  },
  'Artesão de Guilda': {
    weapons: [],
    armor: [],
    tools: ['1 tipo de ferramentas de artesão'],
    languages: ['1 idioma à escolha'],
    skills: ['Intuição', 'Persuasão'],
  },
  Artista: {
    weapons: [],
    armor: [],
    tools: ['Kit de Disfarce', '1 tipo de instrumento musical'],
    languages: [],
    skills: ['Acrobacia', 'Atuação'],
  },
  Charlatão: {
    weapons: [],
    armor: [],
    tools: ['Kit de Disfarce', 'Kit de Falsificação'],
    languages: [],
    skills: ['Enganação', 'Prestidigitação'],
  },
  Criminoso: {
    weapons: [],
    armor: [],
    tools: ['1 tipo de kit de jogo', 'Ferramentas de Ladrão'],
    languages: [],
    skills: ['Enganação', 'Furtividade'],
  },
  Eremita: {
    weapons: [],
    armor: [],
    tools: ['Kit de Herbalismo'],
    languages: ['1 idioma à escolha'],
    skills: ['Medicina', 'Religião'],
  },
  Forasteiro: {
    weapons: [],
    armor: [],
    tools: ['1 tipo de instrumento musical'],
    languages: ['1 idioma à escolha'],
    skills: ['Atletismo', 'Sobrevivência'],
  },
  'Herói do Povo': {
    weapons: [],
    armor: [],
    tools: ['1 tipo de ferramentas de artesão', 'Veículos (terrestres)'],
    languages: [],
    skills: ['Adestrar Animais', 'Sobrevivência'],
  },
  Marinheiro: {
    weapons: [],
    armor: [],
    tools: ['Ferramentas de Navegador', 'Veículos (aquáticos)'],
    languages: [],
    skills: ['Atletismo', 'Percepção'],
  },
  Nobre: {
    weapons: [],
    armor: [],
    tools: ['1 tipo de kit de jogo'],
    languages: ['1 idioma à escolha'],
    skills: ['História', 'Persuasão'],
  },
  Sábio: {
    weapons: [],
    armor: [],
    tools: [],
    languages: ['2 idiomas à escolha'],
    skills: ['Arcanismo', 'História'],
  },
  Soldado: {
    weapons: [],
    armor: [],
    tools: ['1 tipo de kit de jogo', 'Veículos (terrestres)'],
    languages: [],
    skills: ['Atletismo', 'Intimidação'],
  },
  Órfão: {
    weapons: [],
    armor: [],
    tools: ['Kit de Disfarce', 'Ferramentas de Ladrão'],
    languages: [],
    skills: ['Furtividade', 'Prestidigitação'],
  },
};

// ==================== FUNÇÕES UTILITÁRIAS ====================

/**
 * Combina proficiências de raça (base + sub-raça)
 */
export function getRaceProficiencies(race: string, subrace?: string | null): Proficiencies {
  const combined: Proficiencies = {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
    skills: [],
  };

  // Proficiências da raça base
  const raceProf = RACE_PROFICIENCIES[race];
  if (raceProf) {
    combined.weapons.push(...raceProf.weapons);
    combined.armor.push(...raceProf.armor);
    combined.tools.push(...raceProf.tools);
    combined.languages.push(...raceProf.languages);
    if (raceProf.skills && combined.skills) combined.skills.push(...raceProf.skills);
  }

  // Proficiências da sub-raça
  if (subrace && RACE_PROFICIENCIES[subrace]) {
    const subraceProf = RACE_PROFICIENCIES[subrace];
    combined.weapons.push(...subraceProf.weapons);
    combined.armor.push(...subraceProf.armor);
    combined.tools.push(...subraceProf.tools);
    combined.languages.push(...subraceProf.languages);
    if (subraceProf.skills && combined.skills) combined.skills.push(...subraceProf.skills);
  }

  return combined;
}

/**
 * Obtém proficiências de classe (incluindo domínio para clérigos)
 */
export function getClassProficiencies(className: string, domain?: string | null): Proficiencies {
  const combined: Proficiencies = {
    weapons: [],
    armor: [],
    tools: [],
    languages: [],
    savingThrows: [],
    skills: [],
  };

  // Proficiências da classe
  const classProf = CLASS_PROFICIENCIES[className];
  if (classProf) {
    combined.weapons.push(...classProf.weapons);
    combined.armor.push(...classProf.armor);
    combined.tools.push(...classProf.tools);
    combined.languages.push(...classProf.languages);
    if (classProf.savingThrows && combined.savingThrows)
      combined.savingThrows.push(...classProf.savingThrows);
    if (classProf.skills && combined.skills) combined.skills.push(...classProf.skills);
  }

  // Proficiências de domínio (apenas para clérigos)
  if (className === 'Clérigo' && domain && CLERIC_DOMAIN_PROFICIENCIES[domain]) {
    const domainProf = CLERIC_DOMAIN_PROFICIENCIES[domain];
    combined.weapons.push(...domainProf.weapons);
    combined.armor.push(...domainProf.armor);
    combined.tools.push(...domainProf.tools);
    combined.languages.push(...domainProf.languages);
    if (domainProf.skills && combined.skills) combined.skills.push(...domainProf.skills);
  }

  return combined;
}

/**
 * Obtém proficiências de background
 */
export function getBackgroundProficiencies(backgroundName: string): Proficiencies {
  return (
    BACKGROUND_PROFICIENCIES[backgroundName] || {
      weapons: [],
      armor: [],
      tools: [],
      languages: [],
      skills: [],
    }
  );
}

/**
 * Combina TODAS as proficiências do personagem
 */
export function getAllProficiencies(
  race: string,
  subrace: string | null,
  className: string,
  backgroundName: string,
  domain?: string | null
): Proficiencies {
  const raceProf = getRaceProficiencies(race, subrace);
  const classProf = getClassProficiencies(className, domain);
  const bgProf = getBackgroundProficiencies(backgroundName);

  // Combinar tudo
  const combined: Proficiencies = {
    weapons: [...raceProf.weapons, ...classProf.weapons],
    armor: [...raceProf.armor, ...classProf.armor],
    tools: [...raceProf.tools, ...classProf.tools, ...bgProf.tools],
    languages: [...raceProf.languages, ...classProf.languages, ...bgProf.languages],
    savingThrows: classProf.savingThrows || [],
    skills: [...(raceProf.skills || []), ...(classProf.skills || []), ...(bgProf.skills || [])],
  };

  // Remover duplicatas
  combined.weapons = [...new Set(combined.weapons)];
  combined.armor = [...new Set(combined.armor)];
  combined.tools = [...new Set(combined.tools)];
  combined.languages = [...new Set(combined.languages)];
  combined.savingThrows = [...new Set(combined.savingThrows)];
  combined.skills = [...new Set(combined.skills)];

  return combined;
}
