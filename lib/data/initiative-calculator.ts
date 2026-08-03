/**
 * Funções auxiliares para cálculo de Iniciativa
 * Considera modificador de DEX + bônus de talentos (feats)
 */

interface CharacterFeat {
  featId: string;
  featName: string;
  level: number;
  notes?: string;
}

interface OptionalFeature {
  id?: string;
  featureId?: string;
  name?: string;
  featureName?: string;
  effects?: {
    initiative?: number;
    [key: string]: number | undefined;
  };
}

/**
 * Calcula bônus de iniciativa de feats
 * Feat "Alert" (Alerta) dá +5 na iniciativa
 */
export function getInitiativeBonusFromFeats(feats: CharacterFeat[]): number {
  if (!feats || feats.length === 0) return 0;

  let bonus = 0;

  // Verificar feat "Alert" (+5 iniciativa)
  const hasAlert = feats.some(
    (feat) =>
      feat.featId === 'alert' ||
      feat.featName.toLowerCase().includes('alerta') ||
      feat.featName.toLowerCase().includes('alert')
  );

  if (hasAlert) {
    bonus += 5;
  }

  return bonus;
}

/**
 * Calcula bônus de iniciativa de optional features
 * Algumas classes/subclasses podem dar bônus (ex: Champion Fighter, Gloom Stalker Ranger)
 */
export function getInitiativeBonusFromFeatures(features: OptionalFeature[]): number {
  if (!features || features.length === 0) return 0;

  let bonus = 0;

  for (const feature of features) {
    if (feature.effects?.initiative) {
      bonus += feature.effects.initiative;
    }
  }

  return bonus;
}

/**
 * Calcula iniciativa total do personagem
 * Base: DEX modifier
 * + Feats (Alert = +5)
 * + Optional Features (class features)
 */
export function calculateInitiative(
  dexModifier: number,
  feats: CharacterFeat[] = [],
  optionalFeatures: OptionalFeature[] = []
): number {
  const baseInitiative = dexModifier;
  const featBonus = getInitiativeBonusFromFeats(feats);
  const featureBonus = getInitiativeBonusFromFeatures(optionalFeatures);

  return baseInitiative + featBonus + featureBonus;
}

/**
 * Recalcula iniciativa quando atributos mudam (level up)
 */
export function recalculateInitiativeOnLevelUp(
  newDexModifier: number,
  feats: CharacterFeat[] = [],
  optionalFeatures: OptionalFeature[] = []
): number {
  return calculateInitiative(newDexModifier, feats, optionalFeatures);
}
