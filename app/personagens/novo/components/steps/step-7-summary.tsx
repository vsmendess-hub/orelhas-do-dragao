'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Heart, Shield, Zap, Dices } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { getRaceById, calculateRacialBonuses } from '@/lib/data/races';
import { getClassById } from '@/lib/data/classes';
import { getAlignmentById } from '@/lib/data/alignments';
import { SKILLS } from '@/lib/data/skills';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

export function Step7Summary() {
  const router = useRouter();
  const { characterData, resetWizard } = useWizard();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obter dados selecionados
  const race = characterData.race ? getRaceById(characterData.race) : null;
  const subrace = race?.subraces?.find((sr) => sr.id === characterData.subrace);
  const selectedClass = characterData.class ? getClassById(characterData.class) : null;
  const archetype = selectedClass?.archetypes.find((a) => a.id === characterData.archetype);
  const alignment = characterData.alignment ? getAlignmentById(characterData.alignment) : null;

  // Calcular bônus raciais e valores finais
  const racialBonuses = calculateRacialBonuses(characterData.race || '', characterData.subrace);

  const finalAbilities = {
    str: characterData.abilities.str + (racialBonuses.str || 0),
    dex: characterData.abilities.dex + (racialBonuses.dex || 0),
    con: characterData.abilities.con + (racialBonuses.con || 0),
    int: characterData.abilities.int + (racialBonuses.int || 0),
    wis: characterData.abilities.wis + (racialBonuses.wis || 0),
    cha: characterData.abilities.cha + (racialBonuses.cha || 0),
  };

  // Calcular estatísticas de combate
  const proficiencyBonus = Math.floor((characterData.level - 1) / 4) + 2;
  const conModifier = calculateModifier(finalAbilities.con);
  const dexModifier = calculateModifier(finalAbilities.dex);

  const maxHP = (selectedClass?.hitDie || 8) + conModifier;
  const armorClass = 10 + dexModifier;
  const initiative = dexModifier;

  // Função para salvar personagem
  const saveCharacter = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();

      // Verificar se está autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Você precisa estar autenticado para salvar o personagem');
      }

      // Preparar dados para salvar
      const characterToSave = {
        user_id: user.id,
        name: characterData.name!,
        race: race?.name || '',
        subrace: subrace?.name || null,
        class: selectedClass?.name || '',
        archetype: archetype?.name || null,
        level: characterData.level,
        alignment: alignment?.name || '',
        background: characterData.background || null,
        avatar_url: characterData.portraitUrl || null,
        attributes: finalAbilities,
        skills: characterData.skills.map((skillId) => {
          const skill = SKILLS.find((s) => s.id === skillId);
          return {
            name: skill?.name || '',
            attribute: skill?.ability || 'str',
            proficient: true,
            expertise: false,
          };
        }),
        proficiencies: {
          weapons: [],
          armor: [],
          tools: [],
          languages: [],
        },
        equipment: [],
        spells: null,
        features: [],
        hit_points: {
          current: maxHP,
          max: maxHP,
          temporary: 0,
        },
        armor_class: armorClass,
        speed: race?.speed || 30,
        initiative: initiative,
        proficiency_bonus: proficiencyBonus,
        inspiration: false,
        experience_points: 0,
      };

      const { error: insertError } = await supabase.from('characters').insert(characterToSave);

      if (insertError) {
        throw insertError;
      }

      // Resetar wizard e redirecionar
      resetWizard();
      router.push('/');
    } catch (err) {
      console.error('Erro ao salvar personagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar personagem');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">✨</p>
        <h2 className="mt-4 text-2xl font-bold text-white">Revise seu Personagem</h2>
        <p className="mt-2 text-sm text-gray-400">
          Confira todos os detalhes antes de salvar seu personagem.
        </p>
      </div>

      {/* Nome e Identidade */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start gap-4">
          {/* Imagem do Personagem */}
          {characterData.portraitUrl && (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-purple-400">
              <img
                src={characterData.portraitUrl}
                alt={characterData.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Informações */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{characterData.name}</h2>
            <p className="text-sm text-gray-400">
              {race?.name} {subrace && `(${subrace.name})`} • {selectedClass?.name}{' '}
              {archetype && `- ${archetype.name}`} • Nível {characterData.level}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Alinhamento: {alignment?.name} ({alignment?.abbreviation})
            </p>
          </div>
        </div>
        {characterData.background && (
          <div className="mt-4">
            <div className="glass-card-light rounded-lg p-3">
              <p className="text-xs font-medium text-gray-400 mb-1">História:</p>
              <p className="text-sm text-gray-300 line-clamp-3">
                {characterData.background}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas de Combate */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card rounded-xl p-4">
          <div className="mb-3">
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Heart className="h-4 w-4" />
              Pontos de Vida
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{maxHP}</p>
            <p className="text-xs text-gray-400">
              d{selectedClass?.hitDie} + {conModifier}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="mb-3">
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Shield className="h-4 w-4" />
              Classe de Armadura
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{armorClass}</p>
            <p className="text-xs text-gray-400">10 + DES ({dexModifier})</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="mb-3">
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Zap className="h-4 w-4" />
              Iniciativa
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{formatModifier(initiative)}</p>
            <p className="text-xs text-gray-400">Mod. DES</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="mb-3">
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Dices className="h-4 w-4" />
              Bônus Proficiência
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">+{proficiencyBonus}</p>
            <p className="text-xs text-gray-400">Nível {characterData.level}</p>
          </div>
        </div>
      </div>

      {/* Atributos */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Atributos</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {(Object.keys(finalAbilities) as Array<keyof typeof finalAbilities>).map(
            (abilityKey) => {
              const baseValue = characterData.abilities[abilityKey];
              const racialBonus = racialBonuses[abilityKey] || 0;
              const finalValue = finalAbilities[abilityKey];
              const modifier = calculateModifier(finalValue);

              return (
                <div key={abilityKey} className="glass-card-light rounded-lg p-3 text-center">
                  <p className="text-xs font-medium text-gray-400">
                    {ABILITY_NAMES[abilityKey]}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">{finalValue}</p>
                  <p className="text-sm text-gray-300">{formatModifier(modifier)}</p>
                  {racialBonus > 0 && (
                    <p className="mt-1 text-xs text-green-400">
                      {baseValue} + {racialBonus}
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Perícias */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Perícias Proficientes ({characterData.skills.length})</h3>
        <div className="flex flex-wrap gap-2">
          {characterData.skills.map((skillId) => {
            const skill = SKILLS.find((s) => s.id === skillId);
            return (
              <div
                key={skillId}
                className="glass-card-light rounded-md px-3 py-1 text-sm font-medium text-white"
              >
                {skill?.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão Salvar */}
      {error && (
        <div className="glass-card-light rounded-xl border border-red-400/50 p-4">
          <p className="text-sm text-red-100">⚠️ {error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={saveCharacter}
          disabled={isSaving}
          className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            '💾 Salvar Personagem'
          )}
        </Button>
      </div>
    </div>
  );
}
