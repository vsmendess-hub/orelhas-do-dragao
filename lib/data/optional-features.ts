/**
 * Sistema de Optional Class Features D&D 5e
 * Features opcionais principalmente de Tasha's Cauldron of Everything
 */

export type FeatureCategory = 
  | 'fighting-style'
  | 'invocation'
  | 'maneuver'
  | 'metamagic'
  | 'infusion'
  | 'wild-shape'
  | 'channel-divinity'
  | 'ki'
  | 'eldritch-invocation'
  | 'other';

export interface OptionalFeature {
  id: string;
  name: string;
  category: FeatureCategory;
  className: string; // Classe que pode usar
  description: string;
  level: number; // Nível mínimo requerido
  prerequisites?: string;
  source: string;
}

export interface CharacterOptionalFeature {
  featureId: string;
  featureName: string;
  category: FeatureCategory;
  level: number; // Nível em que foi obtido
}

// Fighting Styles (Fighter, Paladin, Ranger)
export const FIGHTING_STYLES: OptionalFeature[] = [
  {
    id: 'archery',
    name: 'Archery',
    category: 'fighting-style',
    className: 'Fighter,Ranger,Paladin',
    description: '+2 de bônus em rolagens de ataque com armas de longo alcance',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'defense',
    name: 'Defense',
    category: 'fighting-style',
    className: 'Fighter,Ranger,Paladin',
    description: '+1 de CA enquanto usar armadura',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'dueling',
    name: 'Dueling',
    category: 'fighting-style',
    className: 'Fighter,Ranger,Paladin',
    description: '+2 de dano quando empunhar arma corpo a corpo em uma mão',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'great-weapon-fighting',
    name: 'Great Weapon Fighting',
    category: 'fighting-style',
    className: 'Fighter,Paladin',
    description: 'Pode rerollar 1 ou 2 nos dados de dano de armas corpo a corpo de duas mãos',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'protection',
    name: 'Protection',
    category: 'fighting-style',
    className: 'Fighter,Paladin',
    description: 'Quando criatura atacar aliado adjacente, pode impor desvantagem (requer escudo)',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    category: 'fighting-style',
    className: 'Fighter,Ranger',
    description: 'Adiciona modificador de habilidade ao dano do ataque off-hand',
    level: 1,
    source: 'PHB',
  },
  {
    id: 'blind-fighting',
    name: 'Blind Fighting',
    category: 'fighting-style',
    className: 'Fighter,Ranger,Paladin',
    description: 'Visão cega de 10 pés. Pode detectar criaturas invisíveis',
    level: 1,
    source: "Tasha's",
  },
  {
    id: 'unarmed-fighting',
    name: 'Unarmed Fighting',
    category: 'fighting-style',
    className: 'Fighter',
    description: 'Ataques desarmados causam 1d6 dano (1d8 se duas mãos livres)',
    level: 1,
    source: "Tasha's",
  },
];

// Warlock Invocations (seleção de algumas populares)
export const ELDRITCH_INVOCATIONS: OptionalFeature[] = [
  {
    id: 'agonizing-blast',
    name: 'Agonizing Blast',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Adiciona modificador de Carisma ao dano de Eldritch Blast',
    level: 2,
    prerequisites: 'Eldritch Blast cantrip',
    source: 'PHB',
  },
  {
    id: 'armor-of-shadows',
    name: 'Armor of Shadows',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Pode conjurar Mage Armor em si mesmo à vontade, sem gastar spell slot',
    level: 2,
    source: 'PHB',
  },
  {
    id: 'devils-sight',
    name: "Devil's Sight",
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Pode ver normalmente na escuridão (mágica ou não) até 120 pés',
    level: 2,
    source: 'PHB',
  },
  {
    id: 'eldritch-mind',
    name: 'Eldritch Mind',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Vantagem em testes de Concentração para manter magias',
    level: 2,
    source: 'PHB',
  },
  {
    id: 'mask-of-many-faces',
    name: 'Mask of Many Faces',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Pode conjurar Disguise Self à vontade, sem gastar spell slot',
    level: 2,
    source: 'PHB',
  },
  {
    id: 'repelling-blast',
    name: 'Repelling Blast',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Quando acerta criatura com Eldritch Blast, empurra 10 pés para longe',
    level: 2,
    prerequisites: 'Eldritch Blast cantrip',
    source: 'PHB',
  },
  {
    id: 'thirsting-blade',
    name: 'Thirsting Blade',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Pode atacar duas vezes, em vez de uma, quando usar a ação de Ataque',
    level: 5,
    prerequisites: 'Pact of the Blade',
    source: 'PHB',
  },
  {
    id: 'lifedrinker',
    name: 'Lifedrinker',
    category: 'eldritch-invocation',
    className: 'Bruxo',
    description: 'Adiciona modificador de Carisma ao dano da arma de pacto',
    level: 12,
    prerequisites: 'Pact of the Blade, 12th level',
    source: 'PHB',
  },
];

// Battle Master Maneuvers (Fighter)
export const BATTLE_MANEUVERS: OptionalFeature[] = [
  {
    id: 'disarming-attack',
    name: 'Disarming Attack',
    category: 'maneuver',
    className: 'Guerreiro',
    description: 'Adiciona dado de superioridade ao dano e força TR de Força ou criatura solta item',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'menacing-attack',
    name: 'Menacing Attack',
    category: 'maneuver',
    className: 'Guerreiro',
    description: 'Adiciona dado ao dano e criatura fica amedrontada até o fim do próximo turno',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'precision-attack',
    name: 'Precision Attack',
    category: 'maneuver',
    className: 'Guerreiro',
    description: 'Adiciona dado de superioridade à rolagem de ataque',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'riposte',
    name: 'Riposte',
    category: 'maneuver',
    className: 'Guerreiro',
    description: 'Quando criatura erra ataque, pode usar reação para fazer ataque corpo a corpo',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'trip-attack',
    name: 'Trip Attack',
    category: 'maneuver',
    className: 'Guerreiro',
    description: 'Adiciona dado ao dano e criatura Large ou menor deve fazer TR ou cair caída',
    level: 3,
    source: 'PHB',
  },
];

// Metamagic (Sorcerer)
export const METAMAGIC_OPTIONS: OptionalFeature[] = [
  {
    id: 'careful-spell',
    name: 'Careful Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta 1 ponto de feitiçaria: escolha criaturas até Cha mod para sucesso automático no TR',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'distant-spell',
    name: 'Distant Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta 1 ponto: dobra alcance da magia (touch vira 30 pés)',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'empowered-spell',
    name: 'Empowered Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta 1 ponto: reroll até Cha mod dados de dano',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'quickened-spell',
    name: 'Quickened Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta 2 pontos: muda tempo de conjuração de 1 ação para 1 ação bônus',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'subtle-spell',
    name: 'Subtle Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta 1 ponto: conjura magia sem componentes verbais ou somáticos',
    level: 3,
    source: 'PHB',
  },
  {
    id: 'twinned-spell',
    name: 'Twinned Spell',
    category: 'metamagic',
    className: 'Feiticeiro',
    description: 'Gasta pontos igual ao nível da magia: afeta segunda criatura no alcance',
    level: 3,
    source: 'PHB',
  },
];

/**
 * Retorna todas as features por classe
 */
export function getOptionalFeaturesByClass(className: string): OptionalFeature[] {
  const allFeatures = [
    ...FIGHTING_STYLES,
    ...ELDRITCH_INVOCATIONS,
    ...BATTLE_MANEUVERS,
    ...METAMAGIC_OPTIONS,
  ];

  return allFeatures.filter((feature) => feature.className.includes(className));
}

/**
 * Retorna features por categoria
 */
export function getOptionalFeaturesByCategory(category: FeatureCategory): OptionalFeature[] {
  const allFeatures = [
    ...FIGHTING_STYLES,
    ...ELDRITCH_INVOCATIONS,
    ...BATTLE_MANEUVERS,
    ...METAMAGIC_OPTIONS,
  ];

  return allFeatures.filter((feature) => feature.category === category);
}

/**
 * Verifica se personagem atende pré-requisitos
 */
export function meetsPrerequisites(
  feature: OptionalFeature,
  characterLevel: number
): { meets: boolean; reason?: string } {
  if (characterLevel < feature.level) {
    return { meets: false, reason: `Requer nível ${feature.level}` };
  }

  if (feature.prerequisites) {
    return { meets: true, reason: `Verifique: ${feature.prerequisites}` };
  }

  return { meets: true };
}

/**
 * Labels para categorias
 */
export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  'fighting-style': 'Fighting Style',
  'invocation': 'Invocação',
  'maneuver': 'Manobra',
  'metamagic': 'Metamagia',
  'infusion': 'Infusão',
  'wild-shape': 'Forma Selvagem',
  'channel-divinity': 'Canalizar Divindade',
  'ki': 'Técnica de Ki',
  'eldritch-invocation': 'Invocação Mística',
  'other': 'Outra',
};

/**
 * Busca feature por ID
 */
export function getFeatureById(featureId: string): OptionalFeature | undefined {
  const allFeatures = [
    ...FIGHTING_STYLES,
    ...ELDRITCH_INVOCATIONS,
    ...BATTLE_MANEUVERS,
    ...METAMAGIC_OPTIONS,
  ];

  return allFeatures.find((f) => f.id === featureId);
}
