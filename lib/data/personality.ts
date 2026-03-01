/**
 * Sistema de Personalização D&D 5e
 * Tipos e interfaces para aparência, personalidade e história
 */

// Aparência física do personagem
export interface Appearance {
  height?: string; // Ex: "1,75m" ou "5'9\""
  weight?: string; // Ex: "70kg" ou "154 lbs"
  age?: number; // Idade em anos
  eyes?: string; // Cor dos olhos
  skin?: string; // Cor da pele
  hair?: string; // Cor e estilo do cabelo
}

// Traços de personalidade (D&D 5e)
export interface Personality {
  traits: string[]; // Traços de personalidade (ex: "Sou otimista", "Confio em meus amigos")
  ideals: string[]; // Ideais (ex: "Liberdade", "Honra")
  bonds: string[]; // Vínculos (ex: "Protejo minha família", "Busco vingança")
  flaws: string[]; // Defeitos (ex: "Sou arrogante", "Não confio em estranhos")
}

// Informações de background e notas
export interface Background {
  backstory: string; // História de fundo completa
  notes: string; // Notas gerais do jogador
}

// Dados completos de personalização
export interface CharacterPersonalization {
  appearance: Appearance;
  personality: Personality;
  background: Background;
  avatar_url?: string; // URL da imagem do personagem
}

// Valores iniciais vazios
export const EMPTY_APPEARANCE: Appearance = {
  height: '',
  weight: '',
  age: undefined,
  eyes: '',
  skin: '',
  hair: '',
};

export const EMPTY_PERSONALITY: Personality = {
  traits: [],
  ideals: [],
  bonds: [],
  flaws: [],
};

export const EMPTY_BACKGROUND: Background = {
  backstory: '',
  notes: '',
};

export const EMPTY_PERSONALIZATION: CharacterPersonalization = {
  appearance: EMPTY_APPEARANCE,
  personality: EMPTY_PERSONALITY,
  background: EMPTY_BACKGROUND,
  avatar_url: undefined,
};

// Exemplos de traços de personalidade (D&D 5e - PHB)
export const PERSONALITY_EXAMPLES = {
  traits: [
    'Eu idealizo um herói específico e me inspiro nele constantemente.',
    'Posso encontrar um ponto em comum entre os inimigos mais ferozes.',
    'Eu nunca passo por uma aposta amigável.',
    'Eu uso palavras polissilábicas que transmitem a impressão de grande erudição.',
    'Sou incrivelmente lento para confiar. Aqueles que parecem mais justos frequentemente têm mais a esconder.',
  ],
  ideals: [
    'Respeito. As pessoas merecem ser tratadas com dignidade e respeito. (Bom)',
    'Justiça. Não deixe que ninguém vivo fique impune por suas ações. (Leal)',
    'Liberdade. Correntes foram feitas para serem quebradas, assim como aqueles que as forjam. (Caótico)',
    'Poder. Se eu ficar forte, posso tomar o que quiser - o que mereço. (Mau)',
    'Aspirações. Eu me esforço para provar que sou digno do favor do meu deus. (Qualquer)',
  ],
  bonds: [
    'Eu faria qualquer coisa para proteger o templo onde servi.',
    'Eu devo minha vida ao sacerdote que me acolheu quando meus pais morreram.',
    'Tudo que faço é para as pessoas comuns.',
    'Vou provar que sou digno de um grande amor que rejeitei.',
    'Alguém roubou meu tesouro mais precioso, e vou recuperá-lo.',
  ],
  flaws: [
    'Secretamente acredito que tudo seria melhor se eu fosse um tirano governando a terra.',
    'Eu tenho uma "historia" para cada situação baseada na minha vida passada.',
    'O tirano que governa minha terra não vai parar até que eu esteja morto.',
    'Eu sou facilmente distraído pela promessa de informação.',
    'Uma vez que escolho um objetivo, fico obcecado com ele em detrimento de todo o resto em minha vida.',
  ],
};

// Dicas para escrever backstory
export const BACKSTORY_TIPS = [
  'Onde você nasceu e cresceu?',
  'Quem são seus pais? Eles ainda estão vivos?',
  'Como você aprendeu suas habilidades de classe?',
  'Qual foi o evento que mudou sua vida?',
  'Por que você se tornou um aventureiro?',
  'O que você busca em suas aventuras?',
];

/**
 * Valida se uma URL é uma imagem válida
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  // Aceitar URLs do Supabase Storage ou URLs externas comuns
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUrl = url.toLowerCase();

  return (
    validExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes('supabase.co/storage')
  );
}

/**
 * Formata altura para exibição
 */
export function formatHeight(height?: string): string {
  if (!height) return 'Não informada';
  return height;
}

/**
 * Formata peso para exibição
 */
export function formatWeight(weight?: string): string {
  if (!weight) return 'Não informado';
  return weight;
}

/**
 * Formata idade para exibição
 */
export function formatAge(age?: number): string {
  if (!age) return 'Não informada';
  return `${age} anos`;
}

/**
 * Verifica se aparência está vazia
 */
export function isAppearanceEmpty(appearance: Appearance): boolean {
  return (
    !appearance.height &&
    !appearance.weight &&
    !appearance.age &&
    !appearance.eyes &&
    !appearance.skin &&
    !appearance.hair
  );
}

/**
 * Verifica se personalidade está vazia
 */
export function isPersonalityEmpty(personality: Personality): boolean {
  return (
    personality.traits.length === 0 &&
    personality.ideals.length === 0 &&
    personality.bonds.length === 0 &&
    personality.flaws.length === 0
  );
}

/**
 * Conta total de traços de personalidade
 */
export function countPersonalityTraits(personality: Personality): number {
  return (
    personality.traits.length +
    personality.ideals.length +
    personality.bonds.length +
    personality.flaws.length
  );
}

/**
 * Gera placeholder de avatar baseado no nome
 */
export function generateAvatarPlaceholder(name: string): string {
  // Pegar primeira letra do nome
  const initial = name.charAt(0).toUpperCase();

  // Cores baseadas na primeira letra (simples hash)
  const colors = [
    '#7048E8', // deep-purple
    '#5F3DC4',
    '#4C6EF5',
    '#228BE6',
    '#15AABF',
    '#12B886',
    '#40C057',
    '#82C91E',
    '#FAB005',
    '#FD7E14',
    '#FA5252',
    '#E64980',
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  // Retornar SVG data URL
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text x="50%" y="50%" font-size="100" font-weight="bold"
            fill="white" text-anchor="middle" dominant-baseline="central">
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
