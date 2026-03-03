/**
 * Sistema de Regras Variantes D&D 5e
 * Regras opcionais que podem ser ativadas/desativadas
 */

export type VariantRuleId =
  | 'flanking'
  | 'feats-asi'
  | 'critical-hit-variant'
  | 'encumbrance-variant'
  | 'initiative-variant'
  | 'cleaving'
  | 'diagonal-movement'
  | 'healing-surge'
  | 'lingering-injuries'
  | 'massive-damage';

export interface VariantRule {
  id: VariantRuleId;
  name: string;
  category: 'combat' | 'character' | 'exploration' | 'healing';
  description: string;
  details: string[];
  source: string;
  enabled: boolean;
}

export interface VariantRulesState {
  rules: Record<VariantRuleId, boolean>;
}

// Todas as regras variantes disponíveis
export const VARIANT_RULES: Record<VariantRuleId, Omit<VariantRule, 'enabled'>> = {
  flanking: {
    id: 'flanking',
    name: 'Flanking',
    category: 'combat',
    description: 'Atacantes ganham vantagem quando flanqueiam um inimigo',
    details: [
      'Quando você e um aliado estão em lados opostos de um inimigo',
      'Ambos ameaçam o inimigo (within 5 feet)',
      'Você ganha vantagem em ataques corpo a corpo contra esse inimigo',
    ],
    source: 'DMG p.251',
  },
  'feats-asi': {
    id: 'feats-asi',
    name: 'Feats (em vez de ASI)',
    category: 'character',
    description: 'Personagens escolhem feat em vez de aumentar atributos',
    details: [
      'Nos níveis de ASI, escolha entre feat ou +2 atributos',
      'Feats oferecem habilidades especiais únicas',
      'Cria builds mais especializados',
      'Requer aprovação do DM',
    ],
    source: 'PHB p.165',
  },
  'critical-hit-variant': {
    id: 'critical-hit-variant',
    name: 'Críticos Maximizados',
    category: 'combat',
    description: 'Críticos causam dano máximo + rolagem adicional',
    details: [
      'Em um acerto crítico (natural 20)',
      'Todos os dados de dano são maximizados',
      'Role os dados de dano novamente e adicione ao total',
      'Exemplo: d8 crítico = 8 + 1d8',
    ],
    source: 'Homebrew Popular',
  },
  'encumbrance-variant': {
    id: 'encumbrance-variant',
    name: 'Encumbrance (Carga Variante)',
    category: 'exploration',
    description: 'Regras detalhadas de capacidade de carga',
    details: [
      'Carga = Força × 5 lbs (leve)',
      'Carga = Força × 10 lbs (média, -10 pés movimento)',
      'Carga = Força × 15 lbs (pesada, -20 pés, desvantagem)',
      'Mais realista mas mais complexo',
    ],
    source: 'PHB p.176',
  },
  'initiative-variant': {
    id: 'initiative-variant',
    name: 'Iniciativa de Grupo',
    category: 'combat',
    description: 'Party e inimigos rolam iniciativa como grupo',
    details: [
      'Party rola um d20 + bônus médio de destreza',
      'Inimigos rolam um d20 + bônus médio',
      'Acelera o combate',
      'Todos do grupo agem juntos',
    ],
    source: 'DMG p.270',
  },
  cleaving: {
    id: 'cleaving',
    name: 'Cleaving Through Creatures',
    category: 'combat',
    description: 'Após matar inimigo, ataque criatura adjacente',
    details: [
      'Quando reduz criatura a 0 HP com ataque corpo a corpo',
      'Pode fazer outro ataque corpo a corpo contra criatura within 5 feet',
      'Usa o mesmo ataque (sem nova rolagem)',
      'Excesso de dano é aplicado na segunda criatura',
    ],
    source: 'DMG p.272',
  },
  'diagonal-movement': {
    id: 'diagonal-movement',
    name: 'Movimento Diagonal (Variante)',
    category: 'combat',
    description: 'Movimentos diagonais custam alternadamente 5 e 10 pés',
    details: [
      'Primeiro diagonal = 5 pés',
      'Segundo diagonal = 10 pés',
      'Terceiro diagonal = 5 pés (repete)',
      'Mais realista para medição de distância',
    ],
    source: 'DMG p.252',
  },
  'healing-surge': {
    id: 'healing-surge',
    name: 'Healing Surge',
    category: 'healing',
    description: 'Ação para recuperar HP sem gastar hit dice',
    details: [
      'Como ação, pode usar Healing Surge',
      'Recupera HP = 1/4 do HP máximo',
      'Pode usar 1× por descanso longo',
      'Funciona mesmo em 0 HP (se consciente)',
    ],
    source: 'DMG p.266',
  },
  'lingering-injuries': {
    id: 'lingering-injuries',
    name: 'Lingering Injuries',
    category: 'combat',
    description: 'Dano severo pode causar lesões permanentes',
    details: [
      'Quando cair a 0 HP ou sofrer crítico',
      'Role d20: 1-10 = lesão na tabela',
      'Lesões podem exigir tratamento mágico',
      'Adiciona consequências dramáticas',
    ],
    source: 'DMG p.272',
  },
  'massive-damage': {
    id: 'massive-damage',
    name: 'Massive Damage',
    category: 'combat',
    description: 'Dano massivo causa efeitos severos',
    details: [
      'Quando sofrer dano ≥ metade do HP máximo em um hit',
      'Fazer TR de Constituição DC 15',
      'Falha = cai a 0 HP imediatamente',
      'Sucesso = sem efeito adicional',
    ],
    source: 'DMG p.273',
  },
};

/**
 * Estado padrão (todas desabilitadas)
 */
export const DEFAULT_VARIANT_RULES: VariantRulesState = {
  rules: {
    flanking: false,
    'feats-asi': false,
    'critical-hit-variant': false,
    'encumbrance-variant': false,
    'initiative-variant': false,
    cleaving: false,
    'diagonal-movement': false,
    'healing-surge': false,
    'lingering-injuries': false,
    'massive-damage': false,
  },
};

/**
 * Cria estado de variant rules com regras habilitadas
 */
export function createVariantRulesState(
  enabledRules: VariantRuleId[] = []
): VariantRulesState {
  const rules = { ...DEFAULT_VARIANT_RULES.rules };
  enabledRules.forEach((ruleId) => {
    rules[ruleId] = true;
  });
  return { rules };
}

/**
 * Retorna todas as regras variantes com status enabled
 */
export function getAllVariantRules(state: VariantRulesState): VariantRule[] {
  return Object.keys(VARIANT_RULES).map((id) => {
    const ruleId = id as VariantRuleId;
    return {
      ...VARIANT_RULES[ruleId],
      enabled: state.rules[ruleId] || false,
    };
  });
}

/**
 * Retorna regras por categoria
 */
export function getVariantRulesByCategory(
  state: VariantRulesState,
  category: VariantRule['category']
): VariantRule[] {
  return getAllVariantRules(state).filter((rule) => rule.category === category);
}

/**
 * Retorna regras habilitadas
 */
export function getEnabledVariantRules(state: VariantRulesState): VariantRule[] {
  return getAllVariantRules(state).filter((rule) => rule.enabled);
}

/**
 * Toggle uma regra
 */
export function toggleVariantRule(
  state: VariantRulesState,
  ruleId: VariantRuleId
): VariantRulesState {
  return {
    rules: {
      ...state.rules,
      [ruleId]: !state.rules[ruleId],
    },
  };
}

/**
 * Habilita uma regra
 */
export function enableVariantRule(
  state: VariantRulesState,
  ruleId: VariantRuleId
): VariantRulesState {
  return {
    rules: {
      ...state.rules,
      [ruleId]: true,
    },
  };
}

/**
 * Desabilita uma regra
 */
export function disableVariantRule(
  state: VariantRulesState,
  ruleId: VariantRuleId
): VariantRulesState {
  return {
    rules: {
      ...state.rules,
      [ruleId]: false,
    },
  };
}

/**
 * Reseta todas as regras (desabilita tudo)
 */
export function resetVariantRules(): VariantRulesState {
  return DEFAULT_VARIANT_RULES;
}

/**
 * Labels para categorias
 */
export const CATEGORY_LABELS: Record<VariantRule['category'], string> = {
  combat: 'Combate',
  character: 'Personagem',
  exploration: 'Exploração',
  healing: 'Cura',
};

/**
 * Ícones para categorias
 */
export const CATEGORY_ICONS: Record<VariantRule['category'], string> = {
  combat: '⚔️',
  character: '👤',
  exploration: '🗺️',
  healing: '❤️',
};

/**
 * Conta regras habilitadas
 */
export function countEnabledRules(state: VariantRulesState): number {
  return Object.values(state.rules).filter((enabled) => enabled).length;
}
