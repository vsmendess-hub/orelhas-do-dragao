/**
 * Utilitários para combinar características de raça e classe
 */

import { getRaceFeatures } from './race-features';
import { getClassFeatures } from './class-features';

export interface CharacterFeature {
  name: string;
  description: string;
  source: string;
  page: number;
  category: 'race' | 'class';
}

/**
 * Obtém todas as características de um personagem
 * baseado em raça, sub-raça, classe e nível
 */
export function getAllCharacterFeatures(
  race: string,
  subrace: string | null,
  className: string,
  level: number,
  archetype?: string
): CharacterFeature[] {
  const features: CharacterFeature[] = [];

  // Features de raça
  const raceFeatures = getRaceFeatures(race, subrace);
  raceFeatures.forEach((feature) => {
    features.push({
      ...feature,
      category: 'race',
    });
  });

  // Features de classe
  const classFeatures = getClassFeatures(className, level, archetype);
  classFeatures.forEach((feature) => {
    features.push({
      ...feature,
      category: 'class',
    });
  });

  return features;
}

/**
 * Formata uma feature para exibição
 */
export function formatFeatureDisplay(feature: CharacterFeature): string {
  const categoryLabel = feature.category === 'race' ? '🧬' : '⚔️';
  return `${categoryLabel} **${feature.name}** (${feature.source} p.${feature.page})\n${feature.description}`;
}

/**
 * Formata múltiplas features para exibição
 */
export function formatFeaturesForDisplay(features: CharacterFeature[]): string[] {
  return features.map(formatFeatureDisplay);
}
