'use client';

import { Check, Info } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { getClassById } from '@/lib/data/classes';
import { SKILLS, type Skill } from '@/lib/data/skills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ABILITY_NAMES = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

export function Step5Skills() {
  const { characterData, updateCharacterData } = useWizard();

  // Obter classe selecionada
  const selectedClass = characterData.class ? getClassById(characterData.class) : null;

  // Filtrar perícias disponíveis para a classe
  const availableSkills = selectedClass
    ? SKILLS.filter((skill) => selectedClass.availableSkills.includes(skill.name))
    : [];

  // Número de perícias que pode escolher
  const maxSkills = selectedClass?.skillChoices || 0;
  const selectedCount = characterData.skills.length;
  const canSelectMore = selectedCount < maxSkills;

  // Toggle perícia
  const toggleSkill = (skillId: string) => {
    const isSelected = characterData.skills.includes(skillId);

    if (isSelected) {
      // Remover perícia
      updateCharacterData({
        skills: characterData.skills.filter((id) => id !== skillId),
      });
    } else {
      // Adicionar perícia (se não atingiu o limite)
      if (canSelectMore) {
        updateCharacterData({
          skills: [...characterData.skills, skillId],
        });
      }
    }
  };

  // Se não tiver classe, mostrar aviso
  if (!selectedClass) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl">🎯</p>
          <h2 className="mt-4 text-2xl font-bold">Escolha suas Perícias</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Selecione as perícias nas quais seu personagem é proficiente.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/20">
          <Info className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />
          <p className="mt-4 text-sm text-amber-900 dark:text-amber-100">
            Por favor, volte e selecione uma classe primeiro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">🎯</p>
        <h2 className="mt-4 text-2xl font-bold">Escolha suas Perícias</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecione as perícias nas quais seu personagem é proficiente.
        </p>
      </div>

      {/* Info sobre Classe */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <div>
              <p className="text-sm text-muted-foreground">Classe selecionada</p>
              <p className="font-semibold">{selectedClass.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Perícias disponíveis</p>
            <p className="text-2xl font-bold">
              {selectedCount} / {maxSkills}
            </p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      {selectedCount > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progresso da Seleção</span>
            <span
              className={
                selectedCount === maxSkills
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }
            >
              {selectedCount} de {maxSkills}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-deep-purple transition-all"
              style={{ width: `${(selectedCount / maxSkills) * 100}%` }}
            />
          </div>
          {selectedCount === maxSkills && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ Todas as perícias selecionadas!
            </p>
          )}
        </div>
      )}

      {/* Grid de Perícias */}
      <div className="grid gap-3 md:grid-cols-2">
        {availableSkills.map((skill) => {
          const isSelected = characterData.skills.includes(skill.id);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <Card
              key={skill.id}
              className={`cursor-pointer transition-all ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'
              } ${
                isSelected
                  ? 'border-2 border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                  : 'border hover:border-deep-purple/50'
              }`}
              onClick={() => !isDisabled && toggleSkill(skill.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{skill.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Atributo base: {ABILITY_NAMES[skill.ability]}
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-purple text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info sobre perícias selecionadas */}
      {selectedCount > 0 && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Perícias selecionadas ({selectedCount}):
              </p>
              <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                {characterData.skills.map((id) => SKILLS.find((s) => s.id === id)?.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dica sobre perícias */}
      <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">💡 Sobre Proficiência</p>
            <p className="mt-1 text-blue-800 dark:text-blue-200">
              Quando você é proficiente em uma perícia, adiciona seu bônus de proficiência às
              jogadas dessa perícia. Escolha perícias que complementem o estilo de jogo do seu
              personagem!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
