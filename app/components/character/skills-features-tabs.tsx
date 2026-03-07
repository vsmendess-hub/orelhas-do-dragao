'use client';

import { useState } from 'react';
import { Target, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterSkill {
  name: string;
  attribute: string;
  proficient: boolean;
  expertise: boolean;
}

interface SkillsFeaturesTabsProps {
  skills: CharacterSkill[];
  features: string[];
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
                          {abilityAbbreviations[skill.attribute as keyof typeof abilityAbbreviations]}
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
              features.map((feature: string, index: number) => (
                <div key={index} className="glass-card-light rounded-lg p-3 text-sm text-gray-300">
                  {feature}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Nenhuma característica especial</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
