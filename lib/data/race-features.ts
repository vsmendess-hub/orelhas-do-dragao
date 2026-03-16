/**
 * Características de Raças e Sub-raças
 * Baseado no Player's Handbook (PHB) e outros livros oficiais D&D 5e
 */

export interface Feature {
  name: string;
  description: string;
  source: string; // Livro de origem
  page: number; // Página do livro
  level?: number; // Nível necessário (opcional, para features de classe)
}

export interface RaceFeatures {
  race: string;
  subrace?: string;
  features: Feature[];
}

// Características por Raça
export const RACE_FEATURES: RaceFeatures[] = [
  // ==================== HUMANO ====================
  {
    race: 'Humano',
    features: [
      {
        name: 'Versatilidade Humana',
        description: '+1 em todos os atributos.',
        source: 'PHB',
        page: 31,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e um idioma extra de sua escolha.',
        source: 'PHB',
        page: 31,
      },
    ],
  },

  // ==================== ELFO ====================
  {
    race: 'Elfo',
    features: [
      {
        name: 'Visão no Escuro',
        description:
          'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Sentidos Aguçados',
        description: 'Você tem proficiência na perícia Percepção.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Ancestral Feérico',
        description:
          'Você tem vantagem em testes de resistência contra encantamento e não pode ser colocado para dormir por magia.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Transe',
        description:
          'Elfos não precisam dormir. Ao invés disso, meditam profundamente por 4 horas por dia. Após esse descanso, você ganha os mesmos benefícios que um humano após 8 horas de sono.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Élfico.',
        source: 'PHB',
        page: 23,
      },
    ],
  },
  {
    race: 'Elfo',
    subrace: 'Alto Elfo',
    features: [
      {
        name: 'Treinamento Élfico com Armas',
        description:
          'Você tem proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Truque',
        description:
          'Você conhece um truque de sua escolha da lista de magias do mago. Inteligência é sua habilidade de conjuração para ele.',
        source: 'PHB',
        page: 23,
      },
      {
        name: 'Idioma Extra',
        description: 'Você pode falar, ler e escrever um idioma extra de sua escolha.',
        source: 'PHB',
        page: 23,
      },
    ],
  },
  {
    race: 'Elfo',
    subrace: 'Elfo da Floresta',
    features: [
      {
        name: 'Treinamento Élfico com Armas',
        description:
          'Você tem proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.',
        source: 'PHB',
        page: 24,
      },
      {
        name: 'Pés Ligeiros',
        description: 'Seu deslocamento base de caminhada aumenta para 31,5 metro.',
        source: 'PHB',
        page: 24,
      },
      {
        name: 'Máscara da Natureza',
        description:
          'Você pode tentar se esconder mesmo quando está levemente obscurecido por folhagem, chuva forte, neve, névoa e outros fenômenos naturais.',
        source: 'PHB',
        page: 24,
      },
    ],
  },
  {
    race: 'Elfo',
    subrace: 'Elfo Negro (Drow)',
    features: [
      {
        name: 'Visão no Escuro Superior',
        description: 'Sua visão no escuro tem alcance de 36 metros.',
        source: 'PHB',
        page: 24,
      },
      {
        name: 'Sensibilidade à Luz Solar',
        description:
          'Você tem desvantagem em testes de ataque e Percepção (Sabedoria) que dependam da visão quando você, o alvo do seu ataque, ou qualquer coisa que você esteja tentando perceber estiver sob luz solar direta.',
        source: 'PHB',
        page: 24,
      },
      {
        name: 'Magia Drow',
        description:
          'Você conhece o truque Globos de Luz. Ao atingir o 3º nível, pode conjurar Fogo das Fadas 1x por descanso longo. Ao atingir o 5º nível, pode conjurar Escuridão 1x por descanso longo. Carisma é sua habilidade de conjuração.',
        source: 'PHB',
        page: 24,
      },
      {
        name: 'Treinamento Drow com Armas',
        description: 'Você tem proficiência com rapieiras, espadas curtas e bestas de mão.',
        source: 'PHB',
        page: 24,
      },
    ],
  },

  // ==================== ANÃO ====================
  {
    race: 'Anão',
    features: [
      {
        name: 'Visão no Escuro',
        description:
          'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.',
        source: 'PHB',
        page: 20,
      },
      {
        name: 'Resiliência Anã',
        description:
          'Você tem vantagem em testes de resistência contra veneno, e você tem resistência a dano de veneno.',
        source: 'PHB',
        page: 20,
      },
      {
        name: 'Treinamento Anão em Combate',
        description:
          'Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra.',
        source: 'PHB',
        page: 20,
      },
      {
        name: 'Proficiência com Ferramentas',
        description:
          'Você ganha proficiência com uma ferramenta de artesão de sua escolha: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro.',
        source: 'PHB',
        page: 20,
      },
      {
        name: 'Especialização em Pedra',
        description:
          'Sempre que você fizer um teste de Inteligência (História) relacionado à origem de um trabalho em pedra, você é considerado proficiente na perícia História e adiciona o dobro de seu bônus de proficiência ao teste.',
        source: 'PHB',
        page: 20,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Anão.',
        source: 'PHB',
        page: 20,
      },
    ],
  },
  {
    race: 'Anão',
    subrace: 'Anão da Montanha',
    features: [
      {
        name: 'Treinamento com Armaduras Anãs',
        description: 'Você tem proficiência com armaduras leves e médias.',
        source: 'PHB',
        page: 20,
      },
    ],
  },
  {
    race: 'Anão',
    subrace: 'Anão da Colina',
    features: [
      {
        name: 'Tenacidade Anã',
        description:
          'Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 toda vez que você ganha um nível.',
        source: 'PHB',
        page: 20,
      },
    ],
  },

  // ==================== HALFLING ====================
  {
    race: 'Halfling',
    features: [
      {
        name: 'Sortudo',
        description:
          'Quando você rolar um 1 natural em um teste de ataque, teste de habilidade ou teste de resistência, você pode rolar novamente o dado e deve usar o novo resultado.',
        source: 'PHB',
        page: 28,
      },
      {
        name: 'Bravura',
        description: 'Você tem vantagem em testes de resistência contra ficar assustado.',
        source: 'PHB',
        page: 28,
      },
      {
        name: 'Agilidade Halfling',
        description:
          'Você pode mover-se através do espaço de qualquer criatura que seja de um tamanho maior que o seu.',
        source: 'PHB',
        page: 28,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Halfling.',
        source: 'PHB',
        page: 28,
      },
    ],
  },
  {
    race: 'Halfling',
    subrace: 'Pés-Leves',
    features: [
      {
        name: 'Furtividade Natural',
        description:
          'Você pode tentar se esconder mesmo quando estiver obscurecido apenas por uma criatura que seja pelo menos um tamanho maior que você.',
        source: 'PHB',
        page: 28,
      },
    ],
  },
  {
    race: 'Halfling',
    subrace: 'Robusto',
    features: [
      {
        name: 'Resiliência dos Robustos',
        description:
          'Você tem vantagem em testes de resistência contra veneno, e você tem resistência a dano de veneno.',
        source: 'PHB',
        page: 28,
      },
    ],
  },

  // ==================== DRACONATO ====================
  {
    race: 'Draconato',
    features: [
      {
        name: 'Ancestral Dracônico',
        description:
          'Você possui ancestralidade dracônica. Escolha um tipo de dragão da tabela de Ancestral Dracônico. Sua arma de sopro e resistência a dano são determinados pelo tipo de dragão.',
        source: 'PHB',
        page: 34,
      },
      {
        name: 'Arma de Sopro',
        description:
          'Você pode usar sua ação para exalar energia destrutiva. Seu ancestral dracônico determina o tamanho, forma e tipo de dano da exalação. CD de resistência = 8 + seu modificador de Constituição + seu bônus de proficiência. Utilizável 1x por descanso curto ou longo.',
        source: 'PHB',
        page: 34,
      },
      {
        name: 'Resistência a Dano',
        description: 'Você tem resistência ao tipo de dano associado ao seu ancestral dracônico.',
        source: 'PHB',
        page: 34,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Dracônico.',
        source: 'PHB',
        page: 34,
      },
    ],
  },

  // ==================== GNOMO ====================
  {
    race: 'Gnomo',
    features: [
      {
        name: 'Visão no Escuro',
        description: 'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena.',
        source: 'PHB',
        page: 37,
      },
      {
        name: 'Esperteza Gnômica',
        description:
          'Você tem vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia.',
        source: 'PHB',
        page: 37,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Gnômico.',
        source: 'PHB',
        page: 37,
      },
    ],
  },
  {
    race: 'Gnomo',
    subrace: 'Gnomo da Floresta',
    features: [
      {
        name: 'Ilusionista Nato',
        description:
          'Você conhece o truque Ilusão Menor. Inteligência é sua habilidade de conjuração para ele.',
        source: 'PHB',
        page: 37,
      },
      {
        name: 'Falar com Animais Pequenos',
        description:
          'Por meio de sons e gestos, você pode comunicar ideias simples para Bestas Pequenas ou menores.',
        source: 'PHB',
        page: 37,
      },
    ],
  },
  {
    race: 'Gnomo',
    subrace: 'Gnomo das Rochas',
    features: [
      {
        name: 'Conhecimento de Artífice',
        description:
          'Sempre que você fizer um teste de Inteligência (História) relacionado a itens mágicos, objetos alquímicos ou dispositivos tecnológicos, você pode adicionar o dobro do seu bônus de proficiência.',
        source: 'PHB',
        page: 37,
      },
      {
        name: 'Engenhoqueiro',
        description:
          'Você tem proficiência com ferramentas de artesão (ferramentas de engenhoqueiro). Usando essas ferramentas, você pode gastar 1 hora e 10 po de material para construir um dispositivo mecânico Miúdo (CA 5, 1 PV).',
        source: 'PHB',
        page: 37,
      },
    ],
  },

  // ==================== MEIO-ELFO ====================
  {
    race: 'Meio-Elfo',
    features: [
      {
        name: 'Visão no Escuro',
        description: 'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena.',
        source: 'PHB',
        page: 39,
      },
      {
        name: 'Ancestral Feérico',
        description:
          'Você tem vantagem em testes de resistência contra encantamento e não pode ser colocado para dormir por magia.',
        source: 'PHB',
        page: 39,
      },
      {
        name: 'Versatilidade de Perícia',
        description: 'Você ganha proficiência em duas perícias de sua escolha.',
        source: 'PHB',
        page: 39,
      },
      {
        name: 'Idiomas',
        description:
          'Você pode falar, ler e escrever Comum, Élfico e um idioma extra de sua escolha.',
        source: 'PHB',
        page: 39,
      },
    ],
  },

  // ==================== MEIO-ORC ====================
  {
    race: 'Meio-Orc',
    features: [
      {
        name: 'Visão no Escuro',
        description: 'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena.',
        source: 'PHB',
        page: 41,
      },
      {
        name: 'Ameaçador',
        description: 'Você ganha proficiência na perícia Intimidação.',
        source: 'PHB',
        page: 41,
      },
      {
        name: 'Resistência Implacável',
        description:
          'Quando você é reduzido a 0 pontos de vida mas não é morto imediatamente, você pode ficar com 1 ponto de vida. Você pode usar essa característica uma vez. Você recupera o uso após terminar um descanso longo.',
        source: 'PHB',
        page: 41,
      },
      {
        name: 'Ataques Selvagens',
        description:
          'Quando você acerta um ataque crítico com uma arma corpo a corpo, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra do acerto crítico.',
        source: 'PHB',
        page: 41,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Orc.',
        source: 'PHB',
        page: 41,
      },
    ],
  },

  // ==================== TIEFLING ====================
  {
    race: 'Tiefling',
    features: [
      {
        name: 'Visão no Escuro',
        description: 'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena.',
        source: 'PHB',
        page: 43,
      },
      {
        name: 'Resistência Infernal',
        description: 'Você tem resistência a dano de fogo.',
        source: 'PHB',
        page: 43,
      },
      {
        name: 'Legado Infernal',
        description:
          'Você conhece o truque Taumaturgia. Ao atingir o 3º nível, você pode conjurar Repreensão Infernal 1x por descanso longo. Ao atingir o 5º nível, você pode conjurar Escuridão 1x por descanso longo. Carisma é sua habilidade de conjuração.',
        source: 'PHB',
        page: 43,
      },
      {
        name: 'Idiomas',
        description: 'Você pode falar, ler e escrever Comum e Infernal.',
        source: 'PHB',
        page: 43,
      },
    ],
  },
];

/**
 * Busca features por raça e sub-raça
 */
export function getRaceFeatures(race: string, subrace?: string | null): Feature[] {
  const features: Feature[] = [];

  // Buscar features da raça base
  const raceData = RACE_FEATURES.find((r) => r.race === race && !r.subrace);
  if (raceData) {
    features.push(...raceData.features);
  }

  // Buscar features da sub-raça (se aplicável)
  if (subrace) {
    const subraceData = RACE_FEATURES.find((r) => r.race === race && r.subrace === subrace);
    if (subraceData) {
      features.push(...subraceData.features);
    }
  }

  return features;
}
