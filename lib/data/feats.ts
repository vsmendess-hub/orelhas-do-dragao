/**
 * Sistema de Feats (Talentos) D&D 5e
 * Feats são habilidades especiais opcionais que podem ser escolhidas
 * no lugar de Ability Score Improvements (ASI)
 */

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: string;
  benefits: string[];
  source: string; // PHB, XGE, TCE, etc
}

export interface CharacterFeat {
  featId: string;
  featName: string;
  level: number; // Nível em que o feat foi obtido
  notes?: string;
}

// Feats comuns do Player's Handbook (PHB)
export const COMMON_FEATS: Feat[] = [
  {
    id: 'alert',
    name: 'Alerta',
    description: 'Sempre atento ao perigo, você ganha os seguintes benefícios.',
    benefits: [
      '+5 de bônus na iniciativa',
      'Não pode ser surpreendido enquanto consciente',
      'Criaturas invisíveis não têm vantagem em ataques contra você',
    ],
    source: 'PHB',
  },
  {
    id: 'athlete',
    name: 'Atleta',
    description: 'Você treinou extensivamente com armaduras, ganhando os seguintes benefícios.',
    prerequisites: 'Força ou Destreza 13+',
    benefits: [
      '+1 em Força ou Destreza (máx 20)',
      'Levantar-se de estar caído custa apenas 5 pés de movimento',
      'Escalar não custa movimento extra',
      'Saltos com corrida percorrem distância extra igual ao seu modificador de Força',
    ],
    source: 'PHB',
  },
  {
    id: 'dual-wielder',
    name: 'Combatente com Duas Armas',
    description: 'Você domina a arte de lutar com duas armas, ganhando os seguintes benefícios.',
    benefits: [
      '+1 de CA enquanto empunhando armas separadas em cada mão',
      'Pode usar duas armas mesmo se não forem leves',
      'Pode sacar ou embainhar duas armas de uma vez',
    ],
    source: 'PHB',
  },
  {
    id: 'great-weapon-master',
    name: 'Mestre em Armas Grandes',
    description: 'Você aprendeu a trocar precisão por golpes devastadores.',
    benefits: [
      'Ao fazer um crítico ou reduzir uma criatura a 0 HP com arma corpo a corpo, pode fazer um ataque extra com ação bônus',
      'Antes de fazer um ataque com arma pesada, pode escolher -5 para acertar para ganhar +10 de dano',
    ],
    source: 'PHB',
  },
  {
    id: 'lucky',
    name: 'Sortudo',
    description: 'Você tem sorte inexplicável que parece funcionar no momento certo.',
    benefits: [
      'Você tem 3 pontos de sorte',
      'Pode gastar 1 ponto para rolar d20 adicional em ataque, teste ou TR',
      'Pode gastar 1 ponto quando for atacado para forçar rerolagem',
      'Recupera pontos gastos após descanso longo',
    ],
    source: 'PHB',
  },
  {
    id: 'magic-initiate',
    name: 'Iniciado em Magia',
    description: 'Você aprendeu um pouco de magia.',
    prerequisites: 'Escolha uma classe: Bardo, Bruxo, Clérigo, Druida, Feiticeiro ou Mago',
    benefits: [
      'Aprende 2 truques dessa classe',
      'Aprende 1 magia de 1º nível dessa classe',
      'Pode lançar a magia de 1º nível uma vez por descanso longo',
    ],
    source: 'PHB',
  },
  {
    id: 'mobile',
    name: 'Móvel',
    description: 'Você é excepcionalmente veloz e ágil.',
    benefits: [
      'Seu deslocamento aumenta em 10 pés',
      'Quando usa a ação Disparada, terreno difícil não custa movimento extra',
      'Quando faz ataque corpo a corpo contra criatura, ela não pode fazer ataque de oportunidade até o fim do turno',
    ],
    source: 'PHB',
  },
  {
    id: 'observant',
    name: 'Observador',
    description: 'Você é rápido em notar detalhes.',
    prerequisites: 'Inteligência ou Sabedoria 13+',
    benefits: [
      '+1 em Inteligência ou Sabedoria (máx 20)',
      '+5 em Percepção e Investigação passivas',
      'Pode ler lábios se puder ver a boca da criatura',
    ],
    source: 'PHB',
  },
  {
    id: 'resilient',
    name: 'Resiliente',
    description: 'Você desenvolveu resiliência excepcional.',
    prerequisites: 'Escolha um atributo',
    benefits: [
      '+1 no atributo escolhido (máx 20)',
      'Ganha proficiência em testes de resistência desse atributo',
    ],
    source: 'PHB',
  },
  {
    id: 'sentinel',
    name: 'Sentinela',
    description: 'Você domina técnicas para punir inimigos que ignoram você.',
    benefits: [
      'Quando acerta ataque de oportunidade, o alvo tem deslocamento 0 até o fim do turno',
      'Pode fazer ataque de oportunidade mesmo se inimigo usar Disengage',
      'Quando criatura a 5 pés ataca alguém além de você, pode usar reação para fazer ataque corpo a corpo contra ela',
    ],
    source: 'PHB',
  },
  {
    id: 'sharpshooter',
    name: 'Atirador Especial',
    description: 'Você dominou armas de longo alcance.',
    benefits: [
      'Ataques à distância ignoram cobertura parcial e três quartos',
      'Atacar no alcance longo não impõe desvantagem',
      'Antes de fazer ataque à distância, pode escolher -5 para acertar para ganhar +10 de dano',
    ],
    source: 'PHB',
  },
  {
    id: 'tough',
    name: 'Robusto',
    description: 'Seu HP máximo aumenta.',
    benefits: ['Seu HP máximo aumenta em 2 × seu nível atual e aumenta em 2 cada vez que subir de nível'],
    source: 'PHB',
  },
  {
    id: 'war-caster',
    name: 'Conjurador de Guerra',
    description: 'Você aprendeu técnicas para conjurar magias no meio do combate.',
    prerequisites: 'Habilidade de conjurar pelo menos uma magia',
    benefits: [
      'Vantagem em testes de Constituição para manter concentração quando sofrer dano',
      'Pode realizar componentes somáticos mesmo com armas ou escudo nas mãos',
      'Quando provocar ataque de oportunidade, pode usar reação para lançar truque contra o atacante',
    ],
    source: 'PHB',
  },
];

// Níveis em que ASI/Feats são obtidos por classe
export const FEAT_LEVELS_BY_CLASS: Record<string, number[]> = {
  Bárbaro: [4, 8, 12, 16, 19],
  Bardo: [4, 8, 12, 16, 19],
  Bruxo: [4, 8, 12, 16, 19],
  Clérigo: [4, 8, 12, 16, 19],
  Druida: [4, 8, 12, 16, 19],
  Feiticeiro: [4, 8, 12, 16, 19],
  Guerreiro: [4, 6, 8, 12, 14, 16, 19], // Guerreiro tem mais ASI/Feats
  Ladino: [4, 8, 10, 12, 16, 19],
  Mago: [4, 8, 12, 16, 19],
  Monge: [4, 8, 12, 16, 19],
  Paladino: [4, 8, 12, 16, 19],
  Ranger: [4, 8, 12, 16, 19],
};

/**
 * Verifica se um personagem pode obter um feat no nível atual
 */
export function canGetFeat(characterClass: string, level: number): boolean {
  const featLevels = FEAT_LEVELS_BY_CLASS[characterClass] || [];
  return featLevels.includes(level);
}

/**
 * Retorna os níveis em que o personagem pode/pôde obter feats
 */
export function getFeatLevels(characterClass: string, currentLevel: number): number[] {
  const featLevels = FEAT_LEVELS_BY_CLASS[characterClass] || [];
  return featLevels.filter((lvl) => lvl <= currentLevel);
}

/**
 * Busca um feat por ID
 */
export function getFeatById(featId: string): Feat | undefined {
  return COMMON_FEATS.find((feat) => feat.id === featId);
}

/**
 * Busca feats por nome (busca parcial)
 */
export function searchFeats(query: string): Feat[] {
  const lowerQuery = query.toLowerCase();
  return COMMON_FEATS.filter(
    (feat) =>
      feat.name.toLowerCase().includes(lowerQuery) ||
      feat.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filtra feats que o personagem pode pegar (baseado em pré-requisitos)
 * Nota: Esta é uma validação simplificada. Idealmente deveria verificar
 * os valores reais dos atributos do personagem.
 */
export function getAvailableFeats(characterFeats: CharacterFeat[]): Feat[] {
  const takenFeatIds = characterFeats.map((cf) => cf.featId);
  return COMMON_FEATS.filter((feat) => !takenFeatIds.includes(feat.id));
}

// Empty state
export const EMPTY_FEAT: CharacterFeat = {
  featId: '',
  featName: '',
  level: 1,
  notes: '',
};
