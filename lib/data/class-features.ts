/**
 * Características de Classes
 * Baseado no Player's Handbook (PHB) D&D 5e
 */

import { Feature } from './race-features';

export interface ClassFeatures {
  className: string;
  archetype?: string;
  features: Feature[];
}

// Características por Classe e Nível
export const CLASS_FEATURES: ClassFeatures[] = [
  // ==================== GUERREIRO (FIGHTER) ====================
  {
    className: 'Guerreiro',
    features: [
      {
        name: 'Estilo de Luta',
        description:
          'Você adota um estilo de luta particular como sua especialidade. Escolha uma das seguintes opções: Arquearia, Defesa, Duelismo, Luta com Arma Grande, Proteção ou Luta com Duas Armas.',
        source: 'PHB',
        page: 72,
        level: 1,
      },
      {
        name: 'Fôlego Extra',
        description:
          'Você tem uma reserva limitada de vigor na qual pode recorrer para se proteger contra danos. Em seu turno, você pode usar uma ação bônus para recuperar pontos de vida iguais a 1d10 + seu nível de guerreiro. Utilizável 1x por descanso curto ou longo.',
        source: 'PHB',
        page: 72,
        level: 1,
      },
      {
        name: 'Surto de Ação',
        description:
          'Você pode forçar-se além dos seus limites normais por um momento. Em seu turno, você pode realizar uma ação adicional além de sua ação normal e possível ação bônus. Utilizável 1x por descanso curto ou longo (2x no 17º nível).',
        source: 'PHB',
        page: 72,
        level: 2,
      },
      {
        name: 'Arquétipo Marcial',
        description:
          'Escolha um arquétipo marcial: Campeão, Mestre de Batalha ou Cavaleiro Arcano. Sua escolha concede características no 3º, 7º, 10º, 15º e 18º níveis.',
        source: 'PHB',
        page: 72,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description:
          'Você pode aumentar um valor de habilidade em 2 ou dois valores em 1 cada. Você não pode aumentar um valor acima de 20.',
        source: 'PHB',
        page: 72,
        level: 4,
      },
      {
        name: 'Ataque Extra',
        description:
          'Você pode atacar duas vezes, ao invés de uma, quando usar a ação de Ataque em seu turno.',
        source: 'PHB',
        page: 72,
        level: 5,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 6,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 8,
      },
      {
        name: 'Indomável',
        description:
          'Você pode re-rolar um teste de resistência que falhou. Se fizer isso, você deve usar o novo resultado. Utilizável 1x por descanso longo (2x no 13º nível, 3x no 17º nível).',
        source: 'PHB',
        page: 72,
        level: 9,
      },
      {
        name: 'Ataque Extra (2)',
        description: 'Você pode atacar três vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 72,
        level: 11,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 12,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 14,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 72,
        level: 19,
      },
      {
        name: 'Ataque Extra (3)',
        description: 'Você pode atacar quatro vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 72,
        level: 20,
      },
    ],
  },

  // ==================== MAGO (WIZARD) ====================
  {
    className: 'Mago',
    features: [
      {
        name: 'Conjuração',
        description:
          'Você aprendeu a manipular o tecido da realidade de acordo com seus desejos e caprichos. Você conhece 3 truques e pode preparar um número de magias igual ao seu modificador de Inteligência + seu nível de mago (mínimo 1).',
        source: 'PHB',
        page: 114,
        level: 1,
      },
      {
        name: 'Recuperação Arcana',
        description:
          'Você recuperou a compreensão de como manipular as energias mágicas. Uma vez por dia, quando você terminar um descanso curto, pode recuperar espaços de magia gastos. Os espaços podem ter um nível combinado igual ou menor que metade do seu nível de mago (arredondado para cima), e nenhum pode ser de 6º nível ou superior.',
        source: 'PHB',
        page: 115,
        level: 1,
      },
      {
        name: 'Tradição Arcana',
        description:
          'Escolha uma tradição arcana: Escola de Abjuração, Conjuração, Adivinhação, Encantamento, Evocação, Ilusão, Necromancia ou Transmutação.',
        source: 'PHB',
        page: 115,
        level: 2,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 115,
        level: 4,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 115,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 115,
        level: 12,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 115,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 115,
        level: 19,
      },
      {
        name: 'Maestria em Magia',
        description:
          'Você alcançou tamanha maestria em certas magias que pode conjurá-las à vontade. Escolha uma magia de mago de 1º nível e uma magia de 2º nível que estejam em seu grimório. Você pode conjurar essas magias no nível mais baixo delas sem gastar espaço de magia. Você pode mudar essas magias após 8 horas de estudo.',
        source: 'PHB',
        page: 115,
        level: 18,
      },
      {
        name: 'Magias de Assinatura',
        description:
          'Escolha duas magias de mago de 3º nível em seu grimório como suas magias de assinatura. Você sempre tem essas magias preparadas, elas não contam contra o número de magias que você pode preparar, e pode conjurar cada uma delas uma vez no 3º nível sem gastar espaço de magia. Você recupera a habilidade após terminar um descanso curto ou longo.',
        source: 'PHB',
        page: 115,
        level: 20,
      },
    ],
  },

  // ==================== CLÉRIGO (CLERIC) ====================
  {
    className: 'Clérigo',
    features: [
      {
        name: 'Conjuração',
        description:
          'Como um conduíte de poder divino, você pode conjurar magias de clérigo. Você conhece 3 truques e prepara magias de clérigo igual ao seu modificador de Sabedoria + seu nível de clérigo.',
        source: 'PHB',
        page: 58,
        level: 1,
      },
      {
        name: 'Domínio Divino',
        description:
          'Escolha um domínio relacionado à sua divindade: Conhecimento, Enganação, Guerra, Luz, Natureza, Tempestade ou Vida. Sua escolha concede magias de domínio e outras características.',
        source: 'PHB',
        page: 58,
        level: 1,
      },
      {
        name: 'Canalizar Divindade',
        description:
          'Você ganha a habilidade de canalizar energia divina diretamente de sua divindade. Você começa com dois efeitos: Expulsar Mortos-Vivos e um efeito determinado por seu domínio. Utilizável 1x por descanso curto ou longo (2x no 6º nível, 3x no 18º nível).',
        source: 'PHB',
        page: 58,
        level: 2,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 58,
        level: 4,
      },
      {
        name: 'Destruir Mortos-Vivos (ND 1/2)',
        description:
          'Quando um morto-vivo falha no teste de resistência contra sua característica Expulsar Mortos-Vivos, a criatura é instantaneamente destruída se seu ND for menor ou igual a 1/2.',
        source: 'PHB',
        page: 59,
        level: 5,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 58,
        level: 8,
      },
      {
        name: 'Intervenção Divina',
        description:
          'Você pode clamar a sua divindade para intervir em seu favor quando precisa muito. Role um d100. Se o resultado for menor ou igual ao seu nível de clérigo, sua divindade intervém. Se falhar, não pode usar esta característica novamente por 7 dias. Se tiver sucesso, não pode usar novamente por 7 dias.',
        source: 'PHB',
        page: 59,
        level: 10,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 58,
        level: 12,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 58,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 58,
        level: 19,
      },
    ],
  },

  // ==================== LADINO (ROGUE) ====================
  {
    className: 'Ladino',
    features: [
      {
        name: 'Especialização',
        description:
          'Escolha duas de suas proficiências de perícia, ou uma de suas proficiências de perícia e sua proficiência com ferramentas de ladrão. Seu bônus de proficiência é dobrado para qualquer teste de habilidade que você fizer usando qualquer uma das proficiências escolhidas.',
        source: 'PHB',
        page: 96,
        level: 1,
      },
      {
        name: 'Ataque Furtivo',
        description:
          'Uma vez por turno, você pode causar 1d6 de dano extra a uma criatura que atingir com um ataque se tiver vantagem na jogada de ataque. O dano aumenta conforme você ganha níveis.',
        source: 'PHB',
        page: 96,
        level: 1,
      },
      {
        name: 'Gíria de Ladrão',
        description:
          'Você aprendeu gíria de ladrão, uma mistura secreta de dialeto, jargão e códigos que permite esconder mensagens em conversas aparentemente normais.',
        source: 'PHB',
        page: 96,
        level: 1,
      },
      {
        name: 'Ação Ardilosa',
        description:
          'Você pode usar uma ação bônus em cada um de seus turnos em combate para Disparada, Desengajar ou Esconder.',
        source: 'PHB',
        page: 96,
        level: 2,
      },
      {
        name: 'Arquétipo de Ladino',
        description:
          'Escolha um arquétipo: Ladrão, Assassino ou Trapaceiro Arcano. Sua escolha concede características no 3º, 9º, 13º e 17º níveis.',
        source: 'PHB',
        page: 96,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 4,
      },
      {
        name: 'Esquiva Sobrenatural',
        description:
          'Quando um atacante que você pode ver o atinge com um ataque, você pode usar sua reação para reduzir pela metade o dano do ataque contra você.',
        source: 'PHB',
        page: 96,
        level: 5,
      },
      {
        name: 'Evasão',
        description:
          'Você pode esquivar-se agilmente de certos efeitos de área. Quando você for alvo de um efeito que lhe permite fazer um teste de resistência de Destreza para sofrer apenas metade do dano, você não sofre dano algum se passar, e apenas metade se falhar.',
        source: 'PHB',
        page: 96,
        level: 7,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 10,
      },
      {
        name: 'Talento Confiável',
        description:
          'Sempre que você fizer um teste de habilidade no qual é proficiente, você trata um resultado de 9 ou menor no d20 como um 10.',
        source: 'PHB',
        page: 96,
        level: 11,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 12,
      },
      {
        name: 'Sentido Cego',
        description:
          'Você ganha a habilidade de sentir criaturas ocultas ou invisíveis a até 3 metros de você, desde que seja capaz de ouvir.',
        source: 'PHB',
        page: 96,
        level: 14,
      },
      {
        name: 'Mente Escorregadia',
        description:
          'Você adquiriu maior força mental. Você ganha proficiência em testes de resistência de Sabedoria.',
        source: 'PHB',
        page: 97,
        level: 15,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 96,
        level: 19,
      },
      {
        name: 'Golpe de Sorte',
        description:
          'Se o ataque errar um alvo ao seu alcance, você pode transformar a falha em um acerto. Alternativamente, se falhar em um teste de habilidade, pode tratar o resultado do d20 como um 20. Utilizável 1x por descanso curto ou longo.',
        source: 'PHB',
        page: 97,
        level: 20,
      },
    ],
  },

  // ==================== BÁRBARO (BARBARIAN) ====================
  {
    className: 'Bárbaro',
    features: [
      {
        name: 'Fúria',
        description:
          'Em batalha, você luta com uma ferocidade primitiva. Em seu turno, pode entrar em fúria com uma ação bônus. Enquanto enfurecido, você ganha: vantagem em testes de Força e testes de resistência de Força, bônus de dano corpo a corpo com Força, resistência a dano físico. Dura 1 minuto. Utilizável 2x por descanso longo (3x no 3º nível, 4x no 6º, 5x no 12º, 6x no 17º, ilimitado no 20º).',
        source: 'PHB',
        page: 48,
        level: 1,
      },
      {
        name: 'Defesa sem Armadura',
        description:
          'Enquanto não estiver vestindo armadura, sua CA é igual a 10 + modificador de Destreza + modificador de Constituição. Você pode usar um escudo e ainda ganhar este benefício.',
        source: 'PHB',
        page: 48,
        level: 1,
      },
      {
        name: 'Ataque Descuidado',
        description:
          'Você pode desistir de toda preocupação com defesa para atacar com desespero feroz. Quando você fizer o primeiro ataque em seu turno, pode decidir atacar descuidadamente. Fazer isso lhe dá vantagem nas jogadas de ataque corpo a corpo usando Força durante este turno, mas as jogadas de ataque contra você têm vantagem até o seu próximo turno.',
        source: 'PHB',
        page: 48,
        level: 2,
      },
      {
        name: 'Sentido de Perigo',
        description:
          'Você ganha um sentido sobrenatural de quando as coisas próximas não estão como deveriam, dando-lhe uma vantagem quando esquiva de perigos. Você tem vantagem em testes de resistência de Destreza contra efeitos que você possa ver, como armadilhas e magias. Para ganhar este benefício, você não pode estar cego, surdo ou incapacitado.',
        source: 'PHB',
        page: 48,
        level: 2,
      },
      {
        name: 'Caminho Primitivo',
        description:
          'Escolha um caminho que molda a natureza de sua fúria: Caminho do Furioso ou Caminho do Guerreiro Totêmico.',
        source: 'PHB',
        page: 48,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 48,
        level: 4,
      },
      {
        name: 'Ataque Extra',
        description: 'Você pode atacar duas vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 48,
        level: 5,
      },
      {
        name: 'Movimentação Rápida',
        description:
          'Seu deslocamento aumenta em 3 metros enquanto você não estiver vestindo armadura pesada.',
        source: 'PHB',
        page: 49,
        level: 5,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 48,
        level: 8,
      },
      {
        name: 'Crítico Brutal (1 dado)',
        description:
          'Você pode rolar um dado de dano de arma adicional ao determinar o dano extra de um acerto crítico com um ataque corpo a corpo.',
        source: 'PHB',
        page: 49,
        level: 9,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 48,
        level: 12,
      },
      {
        name: 'Crítico Brutal (2 dados)',
        description: 'Você pode rolar dois dados de dano de arma adicionais em acertos críticos.',
        source: 'PHB',
        page: 49,
        level: 13,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 48,
        level: 16,
      },
      {
        name: 'Crítico Brutal (3 dados)',
        description: 'Você pode rolar três dados de dano de arma adicionais em acertos críticos.',
        source: 'PHB',
        page: 49,
        level: 17,
      },
      {
        name: 'Força Indomável',
        description:
          'Se o seu total em um teste de Força for menor que seu valor de Força, você pode usar esse valor no lugar do total.',
        source: 'PHB',
        page: 49,
        level: 18,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 48,
        level: 19,
      },
      {
        name: 'Campeão Primitivo',
        description:
          'Você incorpora o poder da natureza selvagem. Seus valores de Força e Constituição aumentam em 4. Seu máximo para esses valores agora é 24.',
        source: 'PHB',
        page: 49,
        level: 20,
      },
    ],
  },

  // ==================== BARDO (BARD) ====================
  {
    className: 'Bardo',
    features: [
      {
        name: 'Conjuração',
        description:
          'Você aprendeu a desembaraçar e remodelar o tecido da realidade em harmonia com seus desejos e música. Você conhece 2 truques e pode preparar magias de bardo. Carisma é sua habilidade de conjuração.',
        source: 'PHB',
        page: 53,
        level: 1,
      },
      {
        name: 'Inspiração de Bardo (d6)',
        description:
          'Você pode inspirar outros através de palavras ou música. Use uma ação bônus para dar a uma criatura (exceto você) 1 dado de Inspiração de Bardo (d6). Nos próximos 10 minutos, a criatura pode rolar o dado e adicionar o resultado a um teste de habilidade, ataque ou resistência. Utilizável um número de vezes igual ao seu modificador de Carisma (mínimo 1). Recupera após descanso longo.',
        source: 'PHB',
        page: 53,
        level: 1,
      },
      {
        name: 'Versatilidade',
        description:
          'Você pode adicionar metade do seu bônus de proficiência (arredondado para baixo) a qualquer teste de habilidade que não use seu bônus de proficiência.',
        source: 'PHB',
        page: 54,
        level: 2,
      },
      {
        name: 'Canção de Descanso',
        description:
          'Você pode usar música ou oração relaxante para ajudar a revitalizar seus aliados feridos durante um descanso curto. Você e aliados amigáveis que puderem ouvir sua apresentação recuperam 1d6 de pontos de vida extras ao gastar Dados de Vida.',
        source: 'PHB',
        page: 54,
        level: 2,
      },
      {
        name: 'Colégio de Bardo',
        description:
          'Escolha um colégio de bardo: Colégio do Conhecimento ou Colégio da Bravura. Sua escolha concede características no 3º, 6º e 14º níveis.',
        source: 'PHB',
        page: 54,
        level: 3,
      },
      {
        name: 'Expertise',
        description:
          'Escolha duas de suas proficiências de perícia. Seu bônus de proficiência é dobrado para qualquer teste de habilidade que você fizer usando qualquer uma das proficiências escolhidas. No 10º nível, você pode escolher mais duas proficiências de perícia para ganhar este benefício.',
        source: 'PHB',
        page: 54,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 54,
        level: 4,
      },
      {
        name: 'Fonte de Inspiração',
        description:
          'Você recupera todas as suas Inspirações de Bardo gastas após um descanso curto ou longo.',
        source: 'PHB',
        page: 54,
        level: 5,
      },
      {
        name: 'Inspiração de Bardo (d8)',
        description: 'Seu dado de Inspiração de Bardo se torna um d8.',
        source: 'PHB',
        page: 54,
        level: 5,
      },
      {
        name: 'Contrafeitiço',
        description:
          'Você ganha a habilidade de usar notas musicais ou palavras de poder para interromper efeitos de influência mental. Quando uma criatura que você pode ver a até 18 metros fizer um teste de resistência contra encantamento ou medo, você pode usar sua reação para gastar uma Inspiração de Bardo e adicionar o resultado ao teste de resistência da criatura.',
        source: 'PHB',
        page: 54,
        level: 6,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 54,
        level: 8,
      },
      {
        name: 'Canção de Descanso (d8)',
        description: 'O dado de Canção de Descanso se torna um d8.',
        source: 'PHB',
        page: 54,
        level: 9,
      },
      {
        name: 'Inspiração de Bardo (d10)',
        description: 'Seu dado de Inspiração de Bardo se torna um d10.',
        source: 'PHB',
        page: 54,
        level: 10,
      },
      {
        name: 'Segredos Mágicos',
        description:
          'Você aprendeu feitiços mágicos de uma ampla gama de disciplinas. Escolha duas magias de qualquer classe, incluindo esta. As magias devem ser de um nível que você possa conjurar ou um truque. As magias escolhidas contam como magias de bardo para você. Você aprende duas magias adicionais no 14º e 18º níveis.',
        source: 'PHB',
        page: 54,
        level: 10,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 54,
        level: 12,
      },
      {
        name: 'Canção de Descanso (d10)',
        description: 'O dado de Canção de Descanso se torna um d10.',
        source: 'PHB',
        page: 54,
        level: 13,
      },
      {
        name: 'Inspiração de Bardo (d12)',
        description: 'Seu dado de Inspiração de Bardo se torna um d12.',
        source: 'PHB',
        page: 54,
        level: 15,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 54,
        level: 16,
      },
      {
        name: 'Canção de Descanso (d12)',
        description: 'O dado de Canção de Descanso se torna um d12.',
        source: 'PHB',
        page: 54,
        level: 17,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 54,
        level: 19,
      },
      {
        name: 'Inspiração Superior',
        description:
          'Quando você rolar iniciativa e não tiver nenhuma Inspiração de Bardo restante, você recupera uma Inspiração.',
        source: 'PHB',
        page: 54,
        level: 20,
      },
    ],
  },

  // ==================== DRUIDA (DRUID) ====================
  {
    className: 'Druida',
    features: [
      {
        name: 'Druídico',
        description:
          'Você conhece o Druídico, a linguagem secreta dos druidas. Você pode falar o idioma e usá-lo para deixar mensagens ocultas. Outros que conhecem essa língua automaticamente percebem tais mensagens.',
        source: 'PHB',
        page: 66,
        level: 1,
      },
      {
        name: 'Conjuração',
        description:
          'Atraindo a essência divina da própria natureza, você pode conjurar magias para moldar essa essência conforme sua vontade. Você conhece 2 truques e prepara magias de druida igual ao seu modificador de Sabedoria + seu nível de druida.',
        source: 'PHB',
        page: 66,
        level: 1,
      },
      {
        name: 'Forma Selvagem',
        description:
          'Você pode usar sua ação para assumir magicamente a forma de uma besta que tenha visto antes. Você pode usar esta característica duas vezes. Você recupera os usos gastos após terminar um descanso curto ou longo. Você pode permanecer na forma de besta por um número de horas igual à metade do seu nível de druida (arredondado para baixo).',
        source: 'PHB',
        page: 66,
        level: 2,
      },
      {
        name: 'Círculo Druídico',
        description:
          'Escolha um círculo druídico: Círculo da Terra ou Círculo da Lua. Sua escolha concede características no 2º, 6º, 10º e 14º níveis.',
        source: 'PHB',
        page: 67,
        level: 2,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 66,
        level: 4,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 66,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 66,
        level: 12,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 66,
        level: 16,
      },
      {
        name: 'Corpo Atemporal',
        description:
          'A magia primordial que você exerce faz você envelhecer mais lentamente. Para cada 10 anos que passam, seu corpo envelhece apenas 1 ano.',
        source: 'PHB',
        page: 67,
        level: 18,
      },
      {
        name: 'Magias Bestiais',
        description:
          'Você pode conjurar muitas de suas magias de druida em qualquer forma que você assumir usando Forma Selvagem. Você pode realizar os componentes somáticos e verbais de uma magia de druida enquanto estiver em forma de besta.',
        source: 'PHB',
        page: 67,
        level: 18,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 66,
        level: 19,
      },
      {
        name: 'Arquidruida',
        description:
          'Você pode usar sua Forma Selvagem um número ilimitado de vezes. Além disso, você pode ignorar os componentes verbais e somáticos de suas magias de druida, assim como quaisquer componentes materiais que não tenham custo e não sejam consumidos por uma magia.',
        source: 'PHB',
        page: 67,
        level: 20,
      },
    ],
  },

  // ==================== FEITICEIRO (SORCERER) ====================
  {
    className: 'Feiticeiro',
    features: [
      {
        name: 'Conjuração',
        description:
          'Um evento em seu passado, ou na vida de um parente ou ancestral, deixou uma marca indelével em você, infundindo você com magia arcana. Você conhece 4 truques e pode conjurar magias de feiticeiro. Carisma é sua habilidade de conjuração.',
        source: 'PHB',
        page: 101,
        level: 1,
      },
      {
        name: 'Origem de Feitiçaria',
        description:
          'Escolha uma origem de feitiçaria que explica a fonte de seu poder mágico inato: Linhagem Dracônica ou Magia Selvagem. Sua escolha concede características no 1º, 6º, 14º e 18º níveis.',
        source: 'PHB',
        page: 101,
        level: 1,
      },
      {
        name: 'Fonte de Magia',
        description:
          'Você tem 2 pontos de feitiçaria e ganha mais conforme alcança níveis superiores. Você nunca pode ter mais pontos de feitiçaria que o mostrado na tabela para seu nível. Você recupera todos os pontos gastos após terminar um descanso longo.',
        source: 'PHB',
        page: 101,
        level: 2,
      },
      {
        name: 'Metamágica',
        description:
          'Você ganha a habilidade de distorcer suas magias para adequá-las às suas necessidades. Você ganha duas das seguintes opções de Metamágica de sua escolha: Magia Acelerada, Magia Cuidadosa, Magia Distante, Magia Estendida, Magia Intensificada, Magia Sutil, Magia Geminada. Você ganha outra no 10º e 17º níveis.',
        source: 'PHB',
        page: 101,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 101,
        level: 4,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 101,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 101,
        level: 12,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 101,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 101,
        level: 19,
      },
      {
        name: 'Restauração de Feitiçaria',
        description:
          'Você recupera 4 pontos de feitiçaria gastos quando termina um descanso curto.',
        source: 'PHB',
        page: 102,
        level: 20,
      },
    ],
  },

  // ==================== BRUXO (WARLOCK) ====================
  {
    className: 'Bruxo',
    features: [
      {
        name: 'Patrono Transcendental',
        description:
          'Você firmou um pacto com um ser transcendental de sua escolha: o Arquifada, o Corruptor ou o Grande Antigo. Sua escolha concede características no 1º, 6º, 10º e 14º níveis.',
        source: 'PHB',
        page: 107,
        level: 1,
      },
      {
        name: 'Magia de Pacto',
        description:
          'Sua pesquisa arcana e a magia concedida a você por seu patrono lhe deram facilidade com magias. Você conhece 2 truques. Você tem 1 espaço de magia para conjurar suas magias de 1º nível. Quando você conjura uma magia de bruxo, você gasta um espaço de magia. Você recupera todos os espaços gastos após terminar um descanso curto ou longo.',
        source: 'PHB',
        page: 107,
        level: 1,
      },
      {
        name: 'Invocações Místicas',
        description:
          'Em seu estudo de conhecimento oculto, você desenterrou invocações místicas, fragmentos de conhecimento proibido que o imbuem com uma habilidade mágica permanente. Você ganha duas invocações místicas de sua escolha. Você aprende invocações adicionais no 5º, 7º, 9º, 12º, 15º e 18º níveis.',
        source: 'PHB',
        page: 107,
        level: 2,
      },
      {
        name: 'Dádiva do Pacto',
        description:
          'Seu patrono transcendental concede a você um presente por seu serviço leal. Você ganha uma das seguintes características de sua escolha: Pacto da Corrente, Pacto da Lâmina ou Pacto do Tomo.',
        source: 'PHB',
        page: 107,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 107,
        level: 4,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 107,
        level: 8,
      },
      {
        name: 'Arcanum Místico (6º nível)',
        description:
          'Seu patrono concede a você um segredo mágico chamado arcanum. Escolha uma magia de 6º nível da lista de magias de bruxo como esse arcanum. Você pode conjurar sua magia arcanum uma vez sem gastar espaço de magia. Você deve terminar um descanso longo antes de poder fazê-lo novamente.',
        source: 'PHB',
        page: 108,
        level: 11,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 107,
        level: 12,
      },
      {
        name: 'Arcanum Místico (7º nível)',
        description: 'Você ganha uma magia arcanum de 7º nível.',
        source: 'PHB',
        page: 108,
        level: 13,
      },
      {
        name: 'Arcanum Místico (8º nível)',
        description: 'Você ganha uma magia arcanum de 8º nível.',
        source: 'PHB',
        page: 108,
        level: 15,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 107,
        level: 16,
      },
      {
        name: 'Arcanum Místico (9º nível)',
        description: 'Você ganha uma magia arcanum de 9º nível.',
        source: 'PHB',
        page: 108,
        level: 17,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 107,
        level: 19,
      },
      {
        name: 'Mestre Místico',
        description:
          'Você pode extrair sua reserva interior de poder místico enquanto roga a seu patrono para recuperar espaços de magia gastos. Você pode gastar 1 minuto rogando a seu patrono por ajuda para recuperar todos os seus espaços de magia de Magia de Pacto gastos. Utilizável 1x por descanso longo.',
        source: 'PHB',
        page: 108,
        level: 20,
      },
    ],
  },

  // ==================== MONGE (MONK) ====================
  {
    className: 'Monge',
    features: [
      {
        name: 'Defesa sem Armadura',
        description:
          'Enquanto não estiver vestindo armadura ou empunhando um escudo, sua CA é igual a 10 + seu modificador de Destreza + seu modificador de Sabedoria.',
        source: 'PHB',
        page: 78,
        level: 1,
      },
      {
        name: 'Artes Marciais',
        description:
          'Você ganha os seguintes benefícios enquanto estiver desarmado ou empunhando apenas armas de monge e não estiver vestindo armadura ou empunhando um escudo: (1) Você pode usar Destreza ao invés de Força para jogadas de ataque e dano de seus golpes desarmados e armas de monge. (2) Você pode rolar um d4 no lugar do dano normal de seu golpe desarmado ou arma de monge. (3) Quando você usa a ação de Ataque com um golpe desarmado ou uma arma de monge em seu turno, você pode fazer um golpe desarmado como uma ação bônus.',
        source: 'PHB',
        page: 78,
        level: 1,
      },
      {
        name: 'Ki',
        description:
          'Seu treinamento permite que você explore a energia mística do ki. Você tem 2 pontos de ki e ganha mais conforme alcança níveis superiores. Você pode gastar esses pontos para alimentar várias características de ki. Você recupera todos os pontos gastos após terminar um descanso curto ou longo.',
        source: 'PHB',
        page: 78,
        level: 2,
      },
      {
        name: 'Movimento sem Armadura',
        description:
          'Seu deslocamento aumenta em 3 metros enquanto você não estiver vestindo armadura ou empunhando um escudo. Este bônus aumenta quando você alcança certos níveis de monge.',
        source: 'PHB',
        page: 78,
        level: 2,
      },
      {
        name: 'Tradição Monástica',
        description:
          'Você se compromete com uma tradição monástica: Caminho da Mão Aberta, Caminho da Sombra ou Caminho dos Quatro Elementos. Sua tradição concede características no 3º, 6º, 11º e 17º níveis.',
        source: 'PHB',
        page: 78,
        level: 3,
      },
      {
        name: 'Deflexão de Projéteis',
        description:
          'Você pode usar sua reação para deflexionar ou apanhar o projétil quando você é atingido por um ataque de arma à distância. Quando o fizer, o dano que você sofrer do ataque é reduzido em 1d10 + seu modificador de Destreza + seu nível de monge. Se você reduzir o dano a 0, você pode apanhar o projétil. Se você apanhar um projétil, você pode gastar 1 ponto de ki para fazer um ataque à distância com a arma ou munição que você acabou de apanhar.',
        source: 'PHB',
        page: 78,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 78,
        level: 4,
      },
      {
        name: 'Ataque Extra',
        description: 'Você pode atacar duas vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 79,
        level: 5,
      },
      {
        name: 'Golpe Atordoante',
        description:
          'Você pode interferir no fluxo de ki no corpo de um oponente. Quando você atingir outra criatura com um ataque de arma corpo a corpo, você pode gastar 1 ponto de ki para tentar um golpe atordoante. O alvo deve ser bem-sucedido em um teste de resistência de Constituição ou ficará atordoado até o final de seu próximo turno.',
        source: 'PHB',
        page: 79,
        level: 5,
      },
      {
        name: 'Golpes de Ki',
        description:
          'Seus golpes desarmados contam como mágicos para o propósito de superar resistência e imunidade a ataques e danos não mágicos.',
        source: 'PHB',
        page: 79,
        level: 6,
      },
      {
        name: 'Evasão',
        description:
          'Você pode esquivar-se agilmente de certos efeitos de área. Quando você for alvo de um efeito que permite um teste de resistência de Destreza para sofrer apenas metade do dano, você não sofre dano algum se passar, e apenas metade se falhar.',
        source: 'PHB',
        page: 79,
        level: 7,
      },
      {
        name: 'Quietude da Mente',
        description:
          'Você pode usar sua ação para encerrar um efeito em si mesmo que esteja fazendo você ficar encantado ou amedrontado.',
        source: 'PHB',
        page: 79,
        level: 7,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 78,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 78,
        level: 12,
      },
      {
        name: 'Língua do Sol e da Lua',
        description:
          'Você aprende a tocar o ki de outras mentes de modo que você compreenda todos os idiomas falados. Além disso, qualquer criatura que possa entender um idioma pode entender o que você fala.',
        source: 'PHB',
        page: 79,
        level: 13,
      },
      {
        name: 'Alma de Diamante',
        description: 'Você ganha proficiência em todos os testes de resistência.',
        source: 'PHB',
        page: 79,
        level: 14,
      },
      {
        name: 'Corpo Atemporal',
        description:
          'Seu ki sustenta você de modo que você não sofre nenhuma fragilidade da velhice, e você não pode ser envelhecido magicamente. Você ainda vai morrer de velhice, no entanto. Além disso, você não precisa mais de comida ou água.',
        source: 'PHB',
        page: 79,
        level: 15,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 78,
        level: 16,
      },
      {
        name: 'Corpo Vazio',
        description:
          'Você pode usar sua ação para gastar 4 pontos de ki e se tornar invisível por 1 minuto. Durante esse tempo, você também tem resistência a todo dano, exceto dano de energia.',
        source: 'PHB',
        page: 79,
        level: 18,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 78,
        level: 19,
      },
      {
        name: 'Auto Perfeito',
        description:
          'Quando você rolar iniciativa e não tiver nenhum ponto de ki restante, você recupera 4 pontos de ki.',
        source: 'PHB',
        page: 79,
        level: 20,
      },
    ],
  },

  // ==================== PALADINO (PALADIN) ====================
  {
    className: 'Paladino',
    features: [
      {
        name: 'Sentido Divino',
        description:
          'A presença de mal forte registra em seus sentidos como um odor nocivo, e o bem poderoso soa como música celestial em seus ouvidos. Como uma ação, você pode abrir sua consciência para detectar tais forças. Até o final de seu próximo turno, você conhece a localização de qualquer celestial, corruptor ou morto-vivo a até 18 metros de você que não esteja com cobertura total. Utilizável um número de vezes igual a 1 + seu modificador de Carisma. Você recupera todos os usos gastos após terminar um descanso longo.',
        source: 'PHB',
        page: 84,
        level: 1,
      },
      {
        name: 'Cura pelas Mãos',
        description:
          'Seu toque abençoado pode curar ferimentos. Você tem uma reserva de poder curativo que se repõe quando você tira um descanso longo. Com essa reserva, você pode restaurar um número total de pontos de vida igual ao seu nível de paladino × 5. Como uma ação, você pode tocar uma criatura e extrair poder da reserva para restaurar um número de pontos de vida para essa criatura, até o máximo restante em sua reserva.',
        source: 'PHB',
        page: 84,
        level: 1,
      },
      {
        name: 'Estilo de Luta',
        description:
          'Você adota um estilo de luta particular como sua especialidade. Escolha uma das seguintes opções: Defesa, Duelismo, Luta com Arma Grande ou Proteção.',
        source: 'PHB',
        page: 84,
        level: 2,
      },
      {
        name: 'Conjuração',
        description:
          'Você aprendeu a usar a magia divina através de meditação e oração para conjurar magias como um clérigo faz. Você prepara magias de paladino igual à metade de seu nível de paladino (arredondado para baixo) + seu modificador de Carisma (mínimo 1). Carisma é sua habilidade de conjuração.',
        source: 'PHB',
        page: 84,
        level: 2,
      },
      {
        name: 'Destruição Divina',
        description:
          'Quando você atingir uma criatura com um ataque de arma corpo a corpo, pode gastar um espaço de magia para causar dano radiante ao alvo, além do dano da arma. O dano extra é 2d8 para um espaço de magia de 1º nível, mais 1d8 para cada nível acima do 1º, até um máximo de 5d8.',
        source: 'PHB',
        page: 85,
        level: 2,
      },
      {
        name: 'Saúde Divina',
        description: 'A magia divina fluindo através de você o torna imune a doenças.',
        source: 'PHB',
        page: 85,
        level: 3,
      },
      {
        name: 'Juramento Sagrado',
        description:
          'Você faz um juramento que o prende como um paladino para sempre. Escolha um dos seguintes: Juramento de Devoção, Juramento dos Anciões ou Juramento de Vingança. Sua escolha concede características no 3º, 7º, 15º e 20º níveis.',
        source: 'PHB',
        page: 85,
        level: 3,
      },
      {
        name: 'Canalizar Divindade',
        description:
          'Você ganha a habilidade de canalizar energia divina diretamente de sua divindade. Você começa com dois efeitos: Expulsar os Profanos e um efeito determinado por seu Juramento Sagrado. Utilizável 1x por descanso curto ou longo.',
        source: 'PHB',
        page: 85,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 84,
        level: 4,
      },
      {
        name: 'Ataque Extra',
        description: 'Você pode atacar duas vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 85,
        level: 5,
      },
      {
        name: 'Aura de Proteção',
        description:
          'Sempre que você ou uma criatura amigável a até 3 metros de você fizer um teste de resistência, a criatura ganha um bônus no teste de resistência igual ao seu modificador de Carisma (mínimo de +1). Você deve estar consciente para conceder este bônus. No 18º nível, o alcance desta aura aumenta para 9 metros.',
        source: 'PHB',
        page: 85,
        level: 6,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 84,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 84,
        level: 12,
      },
      {
        name: 'Toque Purificador',
        description:
          'Você pode usar sua ação para encerrar uma magia em você mesmo ou em uma criatura voluntária que você tocar. Utilizável um número de vezes igual ao seu modificador de Carisma (mínimo 1x). Você recupera os usos gastos após terminar um descanso longo.',
        source: 'PHB',
        page: 85,
        level: 14,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 84,
        level: 16,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 84,
        level: 19,
      },
    ],
  },

  // ==================== PATRULHEIRO (RANGER) ====================
  {
    className: 'Patrulheiro',
    features: [
      {
        name: 'Inimigo Favorito',
        description:
          'Você tem experiência significativa estudando, rastreando, caçando, e até mesmo falando com um certo tipo de inimigo. Escolha um tipo de inimigo favorito: aberrações, bestas, celestiais, constructos, dragões, elementais, feéricos, corruptores, gigantes, monstruosidades, limos, plantas, mortos-vivos. Você tem vantagem em testes de Sabedoria (Sobrevivência) para rastrear seus inimigos favoritos, assim como em testes de Inteligência para lembrar informação sobre eles.',
        source: 'PHB',
        page: 91,
        level: 1,
      },
      {
        name: 'Explorador Natural',
        description:
          'Você é particularmente familiarizado com um tipo de ambiente natural e é adepto em viajar e sobreviver em tais regiões. Escolha um tipo de terreno favorecido: ártico, costa, deserto, floresta, campo, montanha, pântano ou subterrâneo. Você ganha vários benefícios quando estiver em seu terreno favorecido.',
        source: 'PHB',
        page: 91,
        level: 1,
      },
      {
        name: 'Estilo de Luta',
        description:
          'Você adota um estilo de luta particular como sua especialidade. Escolha uma das seguintes opções: Arquearia, Defesa, Duelismo ou Luta com Duas Armas.',
        source: 'PHB',
        page: 91,
        level: 2,
      },
      {
        name: 'Conjuração',
        description:
          'Quando você alcança o 2º nível, você aprendeu a usar a essência mágica da natureza para conjurar magias, de forma parecida a um druida. Você conhece um número de magias de patrulheiro de sua escolha. Sabedoria é sua habilidade de conjuração.',
        source: 'PHB',
        page: 91,
        level: 2,
      },
      {
        name: 'Arquétipo de Patrulheiro',
        description:
          'Você escolhe um arquétipo que se esforça para emular: Caçador ou Mestre das Bestas. Sua escolha concede características no 3º, 7º, 11º e 15º níveis.',
        source: 'PHB',
        page: 91,
        level: 3,
      },
      {
        name: 'Consciência Primitiva',
        description:
          'Você pode usar sua ação e gastar um espaço de magia de patrulheiro para focar sua consciência em uma região ao seu redor. Por 1 minuto por nível do espaço de magia que você gastou, você pode sentir se os seguintes tipos de criaturas estão presentes a até 1 milha de você (ou até 6 milhas se você estiver em seu terreno favorecido): aberrações, celestiais, dragões, elementais, feéricos, corruptores e mortos-vivos.',
        source: 'PHB',
        page: 92,
        level: 3,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 91,
        level: 4,
      },
      {
        name: 'Ataque Extra',
        description: 'Você pode atacar duas vezes quando usar a ação de Ataque.',
        source: 'PHB',
        page: 92,
        level: 5,
      },
      {
        name: 'Caminhada pelas Terras',
        description:
          'Mover-se através de terreno difícil não mágico não custa movimento extra. Você também pode passar através de plantas não mágicas sem ser desacelerado por elas e sem sofrer dano delas se elas tiverem espinhos, agulhas ou um perigo similar.',
        source: 'PHB',
        page: 92,
        level: 8,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 91,
        level: 8,
      },
      {
        name: 'Esconder-se à Vista',
        description:
          'Você pode gastar 1 minuto criando camuflagem para você. Você deve ter acesso a lama fresca, sujeira, plantas, fuligem e outros materiais naturais com os quais criar sua camuflagem. Uma vez que você esteja camuflado dessa maneira, você pode tentar se esconder ficando parado contra uma superfície sólida.',
        source: 'PHB',
        page: 92,
        level: 10,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 91,
        level: 12,
      },
      {
        name: 'Desaparecer',
        description:
          'Você pode usar a ação de Esconder-se com uma ação bônus em seu turno. Além disso, você não pode ser rastreado por meios não mágicos, a menos que você escolha deixar um rastro.',
        source: 'PHB',
        page: 92,
        level: 14,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 91,
        level: 16,
      },
      {
        name: 'Sentidos Selvagens',
        description:
          'Você ganha sentidos preternaturais que o ajudam a lutar contra criaturas que você não pode ver. Quando você ataca uma criatura que você não pode ver, sua incapacidade de vê-la não impõe desvantagem em suas jogadas de ataque contra ela. Você também está ciente da localização de qualquer criatura invisível a até 9 metros de você, desde que essa criatura não esteja escondida de você e você não esteja cego ou surdo.',
        source: 'PHB',
        page: 92,
        level: 18,
      },
      {
        name: 'Incremento no Valor de Habilidade',
        description: 'ASI disponível.',
        source: 'PHB',
        page: 91,
        level: 19,
      },
      {
        name: 'Matador de Inimigos',
        description:
          'Você se torna um caçador implacável de seus inimigos. Uma vez em cada um de seus turnos, você pode adicionar seu modificador de Sabedoria à jogada de ataque ou à jogada de dano de um ataque que você fizer contra um de seus inimigos favoritos. Você pode escolher usar esta característica antes ou depois da jogada, mas antes que qualquer efeito da jogada seja aplicado.',
        source: 'PHB',
        page: 92,
        level: 20,
      },
    ],
  },
];

/**
 * Busca features de classe por nível
 */
export function getClassFeatures(className: string, level: number, _archetype?: string): Feature[] {
  const classData = CLASS_FEATURES.find((c) => c.className === className && !c.archetype);
  if (!classData) return [];

  // Retornar features até o nível atual
  return classData.features.filter((f) => f.level && f.level <= level);
}
