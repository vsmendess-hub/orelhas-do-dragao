/**
 * Sistema de Personalização de Personagem D&D 5e
 */

export interface Appearance {
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  distinguishingMarks?: string;
  description?: string;
}

export interface Personality {
  traits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
}

export interface Background {
  name?: string;
  description?: string;
  backstory?: string;
  allies?: string;
  enemies?: string;
  organizations?: string;
}

export const EMPTY_APPEARANCE: Appearance = {
  age: '',
  height: '',
  weight: '',
  eyes: '',
  skin: '',
  hair: '',
  distinguishingMarks: '',
  description: '',
};

export const EMPTY_PERSONALITY: Personality = {
  traits: [],
  ideals: [],
  bonds: [],
  flaws: [],
};

export const EMPTY_BACKGROUND: Background = {
  name: '',
  description: '',
  backstory: '',
  allies: '',
  enemies: '',
  organizations: '',
};

// D&D 5e Backgrounds comuns
export const COMMON_BACKGROUNDS = [
  'Acólito',
  'Artesão de Guilda',
  'Artista',
  'Charlatão',
  'Criminoso',
  'Eremita',
  'Forasteiro',
  'Herói do Povo',
  'Marinheiro',
  'Nobre',
  'Sábio',
  'Soldado',
];

// Sugestões de Personality Traits por alinhamento
export const PERSONALITY_SUGGESTIONS = {
  good: [
    'Sempre ajudo quem precisa',
    'Acredito no melhor das pessoas',
    'Protejo os fracos e inocentes',
    'Sigo um código de honra rígido',
  ],
  evil: [
    'Faço o que for necessário para vencer',
    'Não confio em ninguém além de mim',
    'O poder é a única coisa que importa',
    'Os fins justificam os meios',
  ],
  lawful: [
    'Respeito a autoridade e as regras',
    'Minha palavra é minha honra',
    'A ordem é essencial para a sociedade',
    'Tradição e hierarquia devem ser respeitadas',
  ],
  chaotic: [
    'Liberdade acima de tudo',
    'Regras são feitas para serem quebradas',
    'Sigo meu próprio caminho',
    'A espontaneidade é a essência da vida',
  ],
};

// Sugestões de Ideals
export const IDEAL_SUGGESTIONS = [
  'Justiça - Farei o que for certo, não importa o custo',
  'Liberdade - Todos merecem viver livres',
  'Poder - Busco me tornar mais forte a cada dia',
  'Conhecimento - O saber é a maior riqueza',
  'Honra - Minha reputação é tudo',
  'Família - Farei qualquer coisa pelos meus',
  'Ambição - Nascemos para grandeza',
  'Tradição - Os costumes antigos devem ser preservados',
];

// Sugestões de Bonds
export const BOND_SUGGESTIONS = [
  'Devo proteger minha família a todo custo',
  'Busco vingança contra quem me prejudicou',
  'Tenho um mentor que me guia até hoje',
  'Protejo um objeto de grande valor pessoal',
  'Devo dinheiro a alguém poderoso',
  'Meu grupo é minha família agora',
  'Busco redimir um erro do passado',
  'Tenho um amor não correspondido',
];

// Sugestões de Flaws
export const FLAW_SUGGESTIONS = [
  'Não consigo resistir a um desafio',
  'Sou incapaz de mentir de forma convincente',
  'Tenho um vício que me controla',
  'Coloco meus interesses acima do grupo',
  'Sou facilmente distraído',
  'Guardo rancor por muito tempo',
  'Confio demais nas pessoas',
  'Tenho medo de [algo específico]',
];

/**
 * Gera um avatar placeholder baseado na primeira letra do nome
 * Usado quando o personagem não tem imagem de avatar
 */
export function generateAvatarPlaceholder(name: string): string {
  const firstLetter = (name || '?').charAt(0).toUpperCase();

  // Cores baseadas na primeira letra (hash simples)
  const colorMap: Record<string, string> = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-yellow-500': '#eab308',
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-indigo-500': '#6366f1',
    'bg-teal-500': '#14b8a6',
  };

  const colors = Object.keys(colorMap);
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const bgColorKey = colors[colorIndex];
  const bgColorHex = colorMap[bgColorKey];

  // Gerar SVG como data URL (sem base64 para compatibilidade cliente/servidor)
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="${bgColorHex}"/><text x="50%" y="50%" font-size="100" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" font-family="system-ui,-apple-system,sans-serif">${firstLetter}</text></svg>`;

  // URL encode para compatibilidade
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
