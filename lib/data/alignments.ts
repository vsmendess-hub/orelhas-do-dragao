/**
 * Alinhamentos D&D 5e
 */

export interface Alignment {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  ethic: 'Lawful' | 'Neutral' | 'Chaotic';
  moral: 'Good' | 'Neutral' | 'Evil';
}

export const ALIGNMENTS: Alignment[] = [
  {
    id: 'lawful-good',
    name: 'Leal e Bom',
    abbreviation: 'LB',
    description: 'Acredita em ordem e justiça. Faz o que é certo dentro das leis e tradições.',
    ethic: 'Lawful',
    moral: 'Good',
  },
  {
    id: 'neutral-good',
    name: 'Neutro e Bom',
    abbreviation: 'NB',
    description: 'Faz o melhor possível sem viés por ordem ou caos.',
    ethic: 'Neutral',
    moral: 'Good',
  },
  {
    id: 'chaotic-good',
    name: 'Caótico e Bom',
    abbreviation: 'CB',
    description: 'Age conforme sua consciência, sem se importar com expectativas alheias.',
    ethic: 'Chaotic',
    moral: 'Good',
  },
  {
    id: 'lawful-neutral',
    name: 'Leal e Neutro',
    abbreviation: 'LN',
    description: 'Age de acordo com a lei, tradição ou código pessoal.',
    ethic: 'Lawful',
    moral: 'Neutral',
  },
  {
    id: 'true-neutral',
    name: 'Neutro',
    abbreviation: 'N',
    description: 'Não toma partido, preferindo o equilíbrio natural.',
    ethic: 'Neutral',
    moral: 'Neutral',
  },
  {
    id: 'chaotic-neutral',
    name: 'Caótico e Neutro',
    abbreviation: 'CN',
    description: 'Age de acordo com seus caprichos, valorizando liberdade pessoal.',
    ethic: 'Chaotic',
    moral: 'Neutral',
  },
  {
    id: 'lawful-evil',
    name: 'Leal e Mau',
    abbreviation: 'LM',
    description: 'Pega o que quer dentro dos limites de seu código de conduta.',
    ethic: 'Lawful',
    moral: 'Evil',
  },
  {
    id: 'neutral-evil',
    name: 'Neutro e Mau',
    abbreviation: 'NM',
    description: 'Faz o que quer sem compaixão ou remorso.',
    ethic: 'Neutral',
    moral: 'Evil',
  },
  {
    id: 'chaotic-evil',
    name: 'Caótico e Mau',
    abbreviation: 'CM',
    description: 'Age com violência arbitrária, movido por ganância e ódio.',
    ethic: 'Chaotic',
    moral: 'Evil',
  },
];

/**
 * Obter alinhamento por ID
 */
export function getAlignmentById(id: string): Alignment | undefined {
  return ALIGNMENTS.find((alignment) => alignment.id === id);
}

/**
 * Obter alinhamentos organizados em grid 3x3
 */
export function getAlignmentGrid(): Alignment[][] {
  const grid: Alignment[][] = [];
  const morals: Array<'Good' | 'Neutral' | 'Evil'> = ['Good', 'Neutral', 'Evil'];
  const ethics: Array<'Lawful' | 'Neutral' | 'Chaotic'> = ['Lawful', 'Neutral', 'Chaotic'];

  morals.forEach((moral) => {
    const row = ethics.map((ethic) => {
      return ALIGNMENTS.find((a) => a.ethic === ethic && a.moral === moral)!;
    });
    grid.push(row);
  });

  return grid;
}
