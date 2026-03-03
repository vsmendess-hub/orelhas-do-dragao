/**
 * Magias comuns D&D 5e (exemplo para teste)
 */

import type { Spell } from './spells';

export const COMMON_SPELLS: Spell[] = [
  // Cantrips (Nível 0)
  {
    id: 'fire-bolt',
    name: 'Raio de Fogo',
    level: 0,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '120 pés',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description: 'Você arremessa um raio de fogo em uma criatura ou objeto dentro do alcance.',
    classes: ['Mago', 'Feiticeiro'],
  },
  {
    id: 'mage-hand',
    name: 'Mão Mágica',
    level: 0,
    school: 'Conjuração',
    castingTime: 'Ação',
    range: '30 pés',
    components: { verbal: true, somatic: true, material: false },
    duration: '1 minuto',
    ritual: false,
    concentration: false,
    description:
      'Uma mão espectral flutuante aparece em um ponto que você escolher dentro do alcance.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
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
      materialDescription: 'um vaga-lume ou musgo fosforescente',
    },
    duration: '1 hora',
    ritual: false,
    concentration: false,
    description: 'Você toca um objeto que não seja maior que 3 metros em qualquer dimensão.',
    classes: ['Mago', 'Clérigo', 'Feiticeiro', 'Bardo'],
  },

  // Nível 1
  {
    id: 'magic-missile',
    name: 'Mísseis Mágicos',
    level: 1,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '120 pés',
    components: { verbal: true, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description: 'Você cria três dardos brilhantes de energia mágica.',
    atHigherLevels:
      'Quando você conjurar essa magia usando um espaço de magia de 2º nível ou superior, a magia cria mais um dardo para cada nível do espaço acima do 1º.',
    classes: ['Mago', 'Feiticeiro'],
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
    description: 'Pela duração, você sente a presença de magia a até 30 pés de você.',
    classes: ['Mago', 'Clérigo', 'Druida', 'Paladino', 'Bardo', 'Ranger'],
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
      'Uma criatura que você tocar recupera pontos de vida igual a 1d8 + seu modificador de habilidade de conjuração.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 2º nível ou superior, a cura aumenta em 1d8 para cada nível do espaço acima do 1º.',
    classes: ['Clérigo', 'Druida', 'Paladino', 'Ranger', 'Bardo'],
  },

  // Nível 2
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
      materialDescription: 'um cílio envolto em goma arábica',
    },
    duration: 'Concentração, até 1 hora',
    ritual: false,
    concentration: true,
    description: 'Uma criatura que você tocar se torna invisível até a magia acabar.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 3º nível ou superior, você pode afetar uma criatura adicional para cada nível do espaço acima do 2º.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo', 'Bardo'],
  },
  {
    id: 'hold-person',
    name: 'Imobilizar Pessoa',
    level: 2,
    school: 'Encantamento',
    castingTime: 'Ação',
    range: '60 pés',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'um pequeno pedaço de ferro reto',
    },
    duration: 'Concentração, até 1 minuto',
    ritual: false,
    concentration: true,
    description:
      'Escolha um humanoide que você possa ver dentro do alcance. O alvo deve ser bem-sucedido num teste de resistência de Sabedoria ou ficará paralisado pela duração.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 3º nível ou superior, você pode afetar um humanoide adicional para cada nível do espaço acima do 2º.',
    classes: ['Mago', 'Clérigo', 'Druida', 'Feiticeiro', 'Bruxo', 'Bardo'],
  },

  // Nível 3
  {
    id: 'fireball',
    name: 'Bola de Fogo',
    level: 3,
    school: 'Evocação',
    castingTime: 'Ação',
    range: '150 pés',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'uma pequena esfera de guano de morcego e enxofre',
    },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description:
      'Um raio brilhante lampeja de seu dedo apontado até um ponto que você escolher dentro do alcance e então eclode com um estampido baixo em uma explosão de chamas.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 4º nível ou superior, o dano aumenta em 1d6 para cada nível do espaço acima do 3º.',
    classes: ['Mago', 'Feiticeiro'],
  },
  {
    id: 'counterspell',
    name: 'Contra-mágica',
    level: 3,
    school: 'Abjuração',
    castingTime: 'Reação',
    range: '60 pés',
    components: { verbal: false, somatic: true, material: false },
    duration: 'Instantâneo',
    ritual: false,
    concentration: false,
    description: 'Você tenta interromper uma criatura no processo de conjurar uma magia.',
    atHigherLevels:
      'Quando você conjura essa magia usando um espaço de magia de 4º nível ou superior, a magia interrompida não terá efeito se seu nível for menor ou igual ao nível do espaço de magia que você usou.',
    classes: ['Mago', 'Feiticeiro', 'Bruxo'],
  },
];
