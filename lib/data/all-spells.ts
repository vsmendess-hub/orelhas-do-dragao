/**
 * Database de Magias D&D 5e
 * Lista completa de magias disponíveis
 */

import type { Spell } from './spells';

export const ALL_SPELLS: Spell[] = [
  // ========== CANTRIPS (Nível 0) ==========
  {
    id: 'fire-bolt',
    name: 'Raio de Fogo',
    level: 0,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você arremessa um raio de fogo em uma criatura ou objeto dentro do alcance. Faça um ataque à distância com magia contra o alvo. Se acertar, o alvo sofre 1d10 de dano de fogo.',
    atHigherLevels:
      'O dano da magia aumenta em 1d10 quando você atinge o 5º nível (2d10), o 11º nível (3d10) e o 17º nível (4d10).',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 242,
  },
  {
    id: 'mage-hand',
    name: 'Mãos Mágicas',
    level: 0,
    school: 'Conjuração',
    castingTime: 'Ação',
    range: '9 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: '1 minuto',
    ritual: false,
    concentration: false,
    description:
      'Uma mão espectral flutuante aparece em um ponto à sua escolha dentro do alcance. A mão persiste pela duração ou até você a descartar como uma ação. A mão desaparece se estiver a mais de 9 metros de você ou se você conjurar essa magia novamente. Você pode usar sua ação para controlar a mão.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
    source: 'PHB',
    page: 234,
  },
  {
    id: 'prestidigitation',
    name: 'Prestidigitação',
    level: 0,
    school: 'Transmutação',
    castingTime: 'Ação',
    range: '3 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Até 1 hora',
    ritual: false,
    concentration: false,
    description:
      'Esse truque é um feitiço menor que conjuradores novatos usam para praticar. Você cria um dos seguintes efeitos mágicos dentro do alcance: faísca inofensiva, acender/apagar velas, aquecer/resfriar materiais, criar marca ou símbolo, criar efeito sensorial menor.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
    source: 'PHB',
    page: 234,
  },
  {
    id: 'light',
    name: 'Luz',
    level: 0,
    school: 'Evocação',
    castingTime: 'Ação',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: false,
      material: true,
      materialDescription: 'vaga-lume ou musgo fosforescente',
    },
    duration: '1 hora',
    ritual: false,
    concentration: false,
    description:
      'Você toca um objeto que não seja maior que 3 metros em qualquer dimensão. Até a magia acabar, o objeto emite luz plena em um raio de 6 metros e penumbra por mais 6 metros. A luz pode ser de qualquer cor escolhida por você.',
    classes: ['Mago', 'Clérigo', 'Bardo', 'Feiticeiro'],
    source: 'PHB',
    page: 230,
  },
  {
    id: 'sacred-flame',
    name: 'Chama Sagrada',
    level: 0,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '18 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Luz radiante semelhante a uma chama desce sobre uma criatura que você possa ver dentro do alcance. O alvo deve ser bem-sucedido em um teste de resistência de Destreza ou sofrerá 1d8 de dano radiante. O alvo não ganha benefício de cobertura para esse teste de resistência.',
    atHigherLevels:
      'O dano da magia aumenta em 1d8 quando você atinge o 5º nível (2d8), o 11º nível (3d8) e o 17º nível (4d8).',
    classes: ['Clérigo'],
    source: 'PHB',
    page: 228,
  },
  {
    id: 'eldritch-blast',
    name: 'Explosão Mística',
    level: 0,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Um raio de energia crepitante é lançado em direção a uma criatura dentro do alcance. Faça um ataque à distância com magia contra o alvo. Se acertar, o alvo sofre 1d10 de dano de energia.',
    atHigherLevels:
      'A magia cria mais de um raio quando você atinge níveis superiores: dois raios no 5º nível, três raios no 11º nível e quatro raios no 17º nível. Você pode direcionar os raios para o mesmo alvo ou para alvos diferentes.',
    classes: ['Bruxo'],
    source: 'PHB',
    page: 237,
  },
  {
    id: 'guidance',
    name: 'Orientação',
    level: 0,
    school: 'Adivinhação',
    castingTime: 'Ação',
    range: 'Toque',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Concentração, até 1 minuto',
    ritual: false,
    concentration: true,
    description:
      'Você toca uma criatura voluntária. Uma vez, antes da magia acabar, o alvo pode rolar um d4 e adicionar o número rolado a um teste de atributo à sua escolha. Ele pode rolar o dado antes ou depois de fazer o teste.',
    classes: ['Clérigo', 'Druida'],
    source: 'PHB',
    page: 240,
  },

  // ========== NÍVEL 1 ==========
  {
    id: 'magic-missile',
    name: 'Mísseis Mágicos',
    level: 1,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você cria três dardos brilhantes de energia mágica. Cada dardo atinge uma criatura à sua escolha que você possa ver dentro do alcance. Um dardo causa 1d4 + 1 de dano de energia ao alvo. Os dardos atingem simultaneamente e você pode direcioná-los para acertar uma criatura ou várias.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 2º nível ou superior, a magia cria um dardo a mais para cada nível acima do 1º.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 235,
  },
  {
    id: 'shield',
    name: 'Escudo',
    level: 1,
    school: 'Abjuração',
    castingTime: 'Reação',
    range: 'Pessoal',
    components: { verbal: true, somatic: true, material: false },
    duration: '1 rodada',
    ritual: false,
    concentration: false,
    description:
      'Uma barreira invisível de energia mágica aparece e o protege. Até o início de seu próximo turno, você tem +5 de bônus na CA, incluindo contra o ataque que desencadeou a magia, e você não sofre dano de mísseis mágicos.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 235,
  },
  {
    id: 'cure-wounds',
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: 'Ação',
    range: 'Toque',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Uma criatura que você toca recupera um número de pontos de vida igual a 1d8 + seu modificador de atributo de conjuração. Esta magia não tem efeito sobre mortos-vivos ou constructos.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 2º nível ou superior, a cura aumenta em 1d8 para cada nível acima do 1º.',
    classes: ['Clérigo', 'Bardo', 'Druida', 'Paladino', 'Patrulheiro'],
    source: 'PHB',
    page: 229,
  },
  {
    id: 'healing-word',
    name: 'Palavra de Cura',
    level: 1,
    school: 'Evocação',
    castingTime: 'Ação Bônus',
    range: '18 metros',
    components: { verbal: true, somatic: false, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Uma criatura à sua escolha que você possa ver dentro do alcance recupera pontos de vida iguais a 1d4 + seu modificador de atributo de conjuração. Esta magia não tem efeito sobre mortos-vivos ou constructos.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 2º nível ou superior, a cura aumenta em 1d4 para cada nível acima do 1º.',
    classes: ['Clérigo', 'Bardo', 'Druida'],
    source: 'PHB',
    page: 241,
  },
  {
    id: 'bless',
    name: 'Bênção',
    level: 1,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '9 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'borrifada de água benta',
    },
    duration: 'Concentração, até 1 minuto',
    ritual: false,
    concentration: true,
    description:
      'Você abençoa até três criaturas à sua escolha dentro do alcance. Sempre que um alvo fizer um ataque ou teste de resistência antes da magia acabar, o alvo pode rolar um d4 e adicionar o número rolado ao ataque ou teste de resistência.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 2º nível ou superior, você pode afetar uma criatura adicional para cada nível acima do 1º.',
    classes: ['Clérigo', 'Paladino'],
    source: 'PHB',
    page: 227,
  },
  {
    id: 'detect-magic',
    name: 'Detectar Magia',
    level: 1,
    school: 'Adivinhação',
    castingTime: 'Ação',
    range: 'Pessoal',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Concentração, até 10 minutos',
    ritual: true,
    concentration: true,
    description:
      'Pela duração, você sente a presença de magia a até 9 metros de você. Se você sentir magia dessa forma, você pode usar sua ação para ver uma aura fraca ao redor de qualquer criatura ou objeto visível na área que tenha magia, e você aprende a escola de magia, se houver.',
    classes: [
      'Mago',
      'Clérigo',
      'Bardo',
      'Druida',
      'Paladino',
      'Patrulheiro',
      'Feiticeiro',
      'Bruxo',
    ],
    source: 'PHB',
    page: 231,
  },
  {
    id: 'mage-armor',
    name: 'Armadura Arcana',
    level: 1,
    school: 'Abjuração',
    castingTime: 'Ação',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'um pedaço de couro curtido',
    },
    duration: '8 horas',
    ritual: false,
    concentration: false,
    description:
      'Você toca uma criatura voluntária que não esteja vestindo armadura, e uma energia mágica protetora a envolve até a magia acabar. A CA base do alvo se torna 13 + seu modificador de Destreza. A magia acaba se o alvo colocar uma armadura ou se você a descartar como uma ação.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo'],
    source: 'PHB',
    page: 226,
  },

  // ========== NÍVEL 2 ==========
  {
    id: 'scorching-ray',
    name: 'Raio Chamuscante',
    level: 2,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você cria três raios de fogo e os arremessa em alvos dentro do alcance. Você pode arremessá-los em um alvo ou em vários. Faça um ataque à distância com magia para cada raio. Se acertar, o alvo sofre 2d6 de dano de fogo.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 3º nível ou superior, você cria um raio adicional para cada nível acima do 2º.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 235,
  },
  {
    id: 'hold-person',
    name: 'Imobilizar Pessoa',
    level: 2,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '18 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'um pedaço de ferro',
    },
    duration: 'Concentração, até 1 minuto',
    ritual: false,
    concentration: true,
    description:
      'Escolha um humanoide que você possa ver dentro do alcance. O alvo deve ser bem-sucedido em um teste de resistência de Sabedoria ou ficará paralisado pela duração. No final de cada um de seus turnos, o alvo pode fazer outro teste de resistência de Sabedoria. Em um sucesso, a magia acaba no alvo.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 3º nível ou superior, você pode afetar um humanoide adicional para cada nível acima do 2º.',
    classes: ['Mago', 'Clérigo', 'Bardo', 'Druida', 'Feiticeiro', 'Bruxo'],
  },
  {
    id: 'invisibility',
    name: 'Invisibilidade',
    level: 2,
    school: 'Ilusão',
    castingTime: 'Ação',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'cílio de goma arábica',
    },
    duration: 'Concentração, até 1 hora',
    ritual: false,
    concentration: true,
    description:
      'Uma criatura que você toca se torna invisível até a magia acabar. Qualquer coisa que o alvo esteja vestindo ou carregando é invisível enquanto estiver na posse do alvo. A magia acaba para o alvo que ataca ou conjura uma magia.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 3º nível ou superior, você pode afetar uma criatura adicional para cada nível acima do 2º.',
    classes: ['Mago', 'Bardo', 'Feiticeiro', 'Bruxo'],
    source: 'PHB',
    page: 233,
  },
  {
    id: 'lesser-restoration',
    name: 'Restauração Menor',
    level: 2,
    school: 'Abjuração',
    castingTime: 'Ação',
    range: 'Toque',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você toca uma criatura e pode acabar com uma doença ou uma condição que a esteja afetando. A condição pode ser cegueira, surdez, paralisia ou envenenamento.',
    classes: ['Clérigo', 'Bardo', 'Druida', 'Paladino', 'Patrulheiro'],
    source: 'PHB',
    page: 229,
  },

  // ========== NÍVEL 3 ==========
  {
    id: 'fireball',
    name: 'Bola de Fogo',
    level: 3,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '45 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'uma bolinha de guano de morcego e enxofre',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Um clarão brilhante surge de seu dedo indicador até um ponto escolhido dentro do alcance e então explode em uma erupção de chamas. Cada criatura em uma esfera de 6 metros de raio centrada naquele ponto deve fazer um teste de resistência de Destreza. Um alvo sofre 8d6 de dano de fogo em uma falha, ou metade desse dano em um sucesso.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 4º nível ou superior, o dano aumenta em 1d6 para cada nível acima do 3º.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 235,
  },
  {
    id: 'counterspell',
    name: 'Contrafeitiço',
    level: 3,
    school: 'Abjuração',
    castingTime: 'Reação',
    range: '18 metros',
    components: { verbal: false, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você tenta interromper uma criatura no processo de conjurar uma magia. Se a criatura estiver conjurando uma magia de 3º nível ou inferior, a magia falha e não tem efeito. Se estiver conjurando uma magia de 4º nível ou superior, faça um teste de atributo usando seu atributo de conjuração. A CD é igual a 10 + o nível da magia.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 4º nível ou superior, a magia interrompida não tem efeito se o nível dela for igual ou inferior ao nível do espaço de magia que você usar.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo'],
    source: 'PHB',
    page: 226,
  },
  {
    id: 'dispel-magic',
    name: 'Dissipar Magia',
    level: 3,
    school: 'Abjuração',
    castingTime: 'Ação',
    range: '36 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Escolha uma criatura, objeto ou efeito mágico dentro do alcance. Qualquer magia de 3º nível ou inferior no alvo termina. Para cada magia de 4º nível ou superior no alvo, faça um teste de atributo usando seu atributo de conjuração. A CD é igual a 10 + o nível da magia.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 4º nível ou superior, você automaticamente termina os efeitos de uma magia no alvo se o nível da magia for igual ou inferior ao nível do espaço de magia que você usar.',
    classes: [
      'Mago',
      'Clérigo',
      'Bardo',
      'Druida',
      'Feiticeiro',
      'Bruxo',
      'Paladino',
      'Patrulheiro',
    ],
    source: 'PHB',
    page: 232,
  },
  {
    id: 'revivify',
    name: 'Revivificar',
    level: 3,
    school: 'Necromancia',
    castingTime: '1 Ação',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'diamantes no valor de 300 PO, consumidos',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você toca uma criatura que morreu há não mais de 1 minuto. Essa criatura retorna à vida com 1 ponto de vida. Esta magia não pode retornar à vida uma criatura que morreu de velhice, nem pode restaurar nenhuma parte do corpo que esteja faltando.',
    classes: ['Clérigo', 'Paladino'],
    source: 'PHB',
    page: 227,
  },

  // ========== NÍVEL 4 ==========
  {
    id: 'polymorph',
    name: 'Metamorfose',
    level: 4,
    school: 'Transmutação',
    castingTime: 'Ação',
    range: '18 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'casulo de lagarta',
    },
    duration: 'Concentração, até 1 hora',
    ritual: false,
    concentration: true,
    description:
      'Esta magia transforma uma criatura que você possa ver dentro do alcance em uma nova forma. Uma criatura involuntária deve fazer um teste de resistência de Sabedoria para evitar o efeito.',
    classes: ['Mago', 'Bardo', 'Feiticeiro', 'Druida'],
    source: 'PHB',
    page: 267,
  },
  {
    id: 'banishment',
    name: 'Banimento',
    level: 4,
    school: 'Abjuração',
    castingTime: 'Ação',
    range: '18 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'item desagradável ao alvo',
    },
    duration: 'Concentração, até 1 minuto',
    ritual: false,
    concentration: true,
    description:
      'Você tenta enviar uma criatura que você possa ver dentro do alcance para outro plano de existência. O alvo deve ser bem-sucedido em um teste de resistência de Carisma ou será banido.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 5º nível ou superior, você pode afetar uma criatura adicional para cada nível acima do 4º.',
    classes: ['Mago', 'Clérigo', 'Feiticeiro', 'Bruxo', 'Paladino'],
    source: 'PHB',
    page: 217,
  },

  // ========== NÍVEL 5 ==========
  {
    id: 'cone-of-cold',
    name: 'Cone de Frio',
    level: 5,
    school: 'Evocação',
    castingTime: 'Ação',
    range: 'Pessoal (cone de 18m)',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'cone de cristal ou vidro',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Uma explosão de ar frio surge de suas mãos. Cada criatura em um cone de 18m deve fazer um teste de resistência de Constituição. Uma criatura sofre 8d8 de dano de frio em uma falha, ou metade desse dano em um sucesso.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 6º nível ou superior, o dano aumenta em 1d8 para cada nível acima do 5º.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 224,
  },
  {
    id: 'raise-dead',
    name: 'Reviver os Mortos',
    level: 5,
    school: 'Necromancia',
    castingTime: '1 Hora',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'diamante no valor de 500 PO, consumido',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você retorna uma criatura morta que toca à vida, desde que ela não esteja morta há mais de 10 dias. Se a alma da criatura estiver livre e disposta, a criatura retorna à vida com 1 ponto de vida.',
    classes: ['Clérigo', 'Bardo', 'Paladino'],
    source: 'PHB',
    page: 272,
  },

  // ========== NÍVEL 6 ==========
  {
    id: 'disintegrate',
    name: 'Desintegrar',
    level: 6,
    school: 'Transmutação',
    castingTime: 'Ação',
    range: '18 metros',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'magnetita e pitada de pó',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Um fino raio verde surge da ponta do seu dedo em direção a um alvo que você possa ver dentro do alcance. Uma criatura alvo deve fazer um teste de resistência de Destreza. Se falhar, o alvo sofre 10d6 + 40 de dano de energia. Se esse dano reduzir o alvo a 0 pontos de vida, ele é desintegrado.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 7º nível ou superior, o dano aumenta em 3d6 para cada nível acima do 6º.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 233,
  },
  {
    id: 'heal',
    name: 'Curar',
    level: 6,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '18 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Escolha uma criatura que você possa ver dentro do alcance. Uma onda de energia de cura positiva lava a criatura, fazendo com que ela recupere 70 pontos de vida. Esta magia também acaba com cegueira, surdez e quaisquer doenças que afetam o alvo.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 7º nível ou superior, a cura aumenta em 10 para cada nível acima do 6º.',
    classes: ['Clérigo', 'Druida'],
    source: 'PHB',
    page: 230,
  },

  // ========== NÍVEL 7 ==========
  {
    id: 'teleport',
    name: 'Teletransporte',
    level: 7,
    school: 'Conjuração',
    castingTime: 'Ação',
    range: '3 metros',
    components: { verbal: true, somatic: false, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Esta magia instantaneamente transporta você e até oito criaturas voluntárias de sua escolha que você possa ver dentro do alcance, ou um único objeto que você possa ver dentro do alcance, para um destino que você selecionar.',
    classes: ['Mago', 'Feiticeiro', 'Bardo'],
    source: 'PHB',
    page: 281,
  },
  {
    id: 'resurrection',
    name: 'Ressurreição',
    level: 7,
    school: 'Necromancia',
    castingTime: '1 Hora',
    range: 'Toque',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'diamante no valor de 1.000 PO, consumido',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você toca uma criatura que está morta há não mais de um século, que não morreu de velhice e que não é um morto-vivo. Se sua alma estiver livre e disposta, o alvo retorna à vida com todos os seus pontos de vida.',
    classes: ['Clérigo', 'Bardo'],
    source: 'PHB',
    page: 272,
  },

  // ========== NÍVEL 8 ==========
  {
    id: 'dominate-monster',
    name: 'Dominar Monstro',
    level: 8,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '18 metros',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Concentração, até 1 hora',
    ritual: false,
    concentration: true,
    description:
      'Você tenta enfeitiçar uma criatura que você possa ver dentro do alcance. Ela deve ser bem-sucedida em um teste de resistência de Sabedoria ou ficará enfeitiçada por você pela duração.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 9º nível, a duração é de concentração, até 8 horas.',
    classes: ['Mago', 'Feiticeiro', 'Bardo', 'Bruxo'],
    source: 'PHB',
    page: 235,
  },
  {
    id: 'power-word-stun',
    name: 'Palavra de Poder: Atordoar',
    level: 8,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '18 metros',
    components: { verbal: true, somatic: false, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você fala uma palavra de poder que pode sobrecarregar a mente de uma criatura que você possa ver dentro do alcance, deixando-a aturdida. Se o alvo tiver 150 pontos de vida ou menos, ele fica atordido.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
    source: 'PHB',
    page: 268,
  },

  // ========== NÍVEL 9 ==========
  {
    id: 'wish',
    name: 'Desejo',
    level: 9,
    school: 'Conjuração',
    castingTime: 'Ação',
    range: 'Pessoal',
    components: { verbal: true, somatic: false, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Desejo é a mais poderosa magia que um mortal pode conjurar. Ao conjurar Desejo, você pode alterar os fundamentos da realidade de acordo com seus desejos. O uso básico desta magia é duplicar qualquer outra magia de 8º nível ou inferior.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 289,
  },
  {
    id: 'meteor-swarm',
    name: 'Enxame de Meteoros',
    level: 9,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '1,6 km',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Orbes flamejantes de fogo caem em quatro pontos diferentes que você possa ver dentro do alcance. Cada criatura em uma esfera de 12m de raio centrada em cada ponto deve fazer um teste de resistência de Destreza. Uma criatura sofre 20d6 de dano de fogo e 20d6 de dano concussivo em uma falha, ou metade desse dano em um sucesso.',
    classes: ['Mago', 'Feiticeiro'],
    source: 'PHB',
    page: 237,
  },
  {
    id: 'power-word-kill',
    name: 'Palavra de Poder: Matar',
    level: 9,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '18 metros',
    components: { verbal: true, somatic: false, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Você profere uma palavra de poder que pode compelir uma criatura que você possa ver dentro do alcance a morrer instantaneamente. Se a criatura que você escolher tiver 100 pontos de vida ou menos, ela morre. Caso contrário, a magia não tem efeito.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
    source: 'PHB',
    page: 268,
  },
];

/**
 * Busca magias por classe
 */
export function getSpellsByClass(className: string): Spell[] {
  return ALL_SPELLS.filter((spell) => spell.classes.includes(className));
}

/**
 * Busca magias por nível
 */
export function getSpellsByLevel(level: number, className?: string): Spell[] {
  let spells = ALL_SPELLS.filter((spell) => spell.level === level);

  if (className) {
    spells = spells.filter((spell) => spell.classes.includes(className));
  }

  return spells;
}

/**
 * Busca magia por ID
 */
export function getSpellById(spellId: string): Spell | undefined {
  return ALL_SPELLS.find((spell) => spell.id === spellId);
}

/**
 * Busca magias por escola
 */
export function getSpellsBySchool(school: string, className?: string): Spell[] {
  let spells = ALL_SPELLS.filter((spell) => spell.school === school);

  if (className) {
    spells = spells.filter((spell) => spell.classes.includes(className));
  }

  return spells;
}
