'use client';

import { useState } from 'react';
import { Target, BookOpen, Sparkles, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface SkillsFeaturesTabsProps {
  skills: CharacterSkill[];
  features: CharacterFeature[];
  modifiers: Record<string, number>;
  proficiencyBonus: number;
  abilityAbbreviations: Record<string, string>;
}

// Format modifier helper
function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function SkillsFeaturesTabs({
  skills,
  features,
  modifiers,
  proficiencyBonus,
  abilityAbbreviations,
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
          <Target className="h-4 w-4" />
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
          <BookOpen className="h-4 w-4" />
          Características
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">{skills.length} perícias proficientes</p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {skills.map((skill: CharacterSkill, index: number) => {
                const attrMod = modifiers[skill.attribute as keyof typeof modifiers] || 0;
                const bonus = attrMod + proficiencyBonus;

                return (
                  <div
                    key={index}
                    className="glass-card-light rounded-lg p-3 flex items-center justify-between hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{skill.name}</p>
                        <p className="text-xs text-gray-400">
                          {
                            abilityAbbreviations[
                              skill.attribute as keyof typeof abilityAbbreviations
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-purple-300">{formatModifier(bonus)}</p>
                  </div>
                );
              })}
            </div>
          </div>
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
