'use client';

import { useState } from 'react';
import { BookOpen, Sparkles, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AllSkillsDisplay } from './all-skills-display';

interface CharacterSkill {
  name: string;
  attribute: string;
  proficient: boolean;
  expertise: boolean;
}

export interface CharacterFeature {
  name: string;
  description: string;
  source: string;
  page: number;
  category: 'race' | 'class';
}

interface SkillOverride {
  [skillId: string]: number;
}

interface SkillsFeaturesTabsProps {
  characterId: string;
  skills: CharacterSkill[];
  features: CharacterFeature[];
  modifiers: Record<string, number>;
  proficiencyBonus: number;
  abilityAbbreviations: Record<string, string>;
  skillOverrides?: SkillOverride;
}

export function SkillsFeaturesTabs({
  characterId,
  skills,
  features,
  modifiers,
  proficiencyBonus,
  abilityAbbreviations,
  skillOverrides = {},
}: SkillsFeaturesTabsProps) {
  const [activeTab, setActiveTab] = useState<'skills' | 'features'>('skills');

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('skills')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
            activeTab === 'skills'
              ? 'tab-purple scale-105'
              : 'tab-purple-inactive bg-white/5 backdrop-blur-sm hover:bg-white/10'
          )}
        >
          <BookOpen className="h-4 w-4" />
          Perícias
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
            activeTab === 'features'
              ? 'tab-purple scale-105'
              : 'tab-purple-inactive bg-white/5 backdrop-blur-sm hover:bg-white/10'
          )}
        >
          <Sparkles className="h-4 w-4" />
          Características
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'skills' && (
          <AllSkillsDisplay
            characterId={characterId}
            skills={skills}
            modifiers={modifiers}
            proficiencyBonus={proficiencyBonus}
            abilityAbbreviations={abilityAbbreviations}
            skillOverrides={skillOverrides}
          />
        )}

        {activeTab === 'features' && (
          <div className="space-y-3">
            {features && features.length > 0 ? (
              <>
                {/* Características de Raça */}
                {features.some((f) => f.category === 'race') && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Características de Raça
                    </h4>
                    {features
                      .filter((f) => f.category === 'race')
                      .map((feature, index) => (
                        <div
                          key={`race-${index}`}
                          className="glass-card-light rounded-lg p-4 border-l-4 border-purple-500/50 hover:border-purple-500 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-white">{feature.name}</h5>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {feature.source} p.{feature.page}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Características de Classe */}
                {features.some((f) => f.category === 'class') && (
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                      <Swords className="h-4 w-4" />
                      Características de Classe
                    </h4>
                    {features
                      .filter((f) => f.category === 'class')
                      .map((feature, index) => (
                        <div
                          key={`class-${index}`}
                          className="glass-card-light rounded-lg p-4 border-l-4 border-blue-500/50 hover:border-blue-500 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-white">{feature.name}</h5>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {feature.source} p.{feature.page}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-400">Nenhuma característica especial</p>
                <p className="text-xs text-gray-500 mt-2">
                  As características serão preenchidas automaticamente
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
