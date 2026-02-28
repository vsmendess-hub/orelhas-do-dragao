'use client';

import { useEffect } from 'react';
import { Check, Info } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { getRaceById, type Subrace } from '@/lib/data/races';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Step2Subrace() {
  const { characterData, updateCharacterData, nextStep } = useWizard();

  // Obter raça selecionada
  const selectedRace = characterData.race ? getRaceById(characterData.race) : null;
  const subraces = selectedRace?.subraces || [];

  // Se a raça não tem sub-raças, pular automaticamente este step
  useEffect(() => {
    if (selectedRace && subraces.length === 0) {
      // Avançar automaticamente para o próximo step
      nextStep();
    }
  }, [selectedRace, subraces.length, nextStep]);

  // Selecionar sub-raça
  const selectSubrace = (subraceId: string) => {
    updateCharacterData({ subrace: subraceId });
  };

  // Formatar bônus para display
  const formatBonuses = (subrace: Subrace) => {
    const bonuses: string[] = [];
    if (subrace.bonuses.str) bonuses.push(`FOR +${subrace.bonuses.str}`);
    if (subrace.bonuses.dex) bonuses.push(`DES +${subrace.bonuses.dex}`);
    if (subrace.bonuses.con) bonuses.push(`CON +${subrace.bonuses.con}`);
    if (subrace.bonuses.int) bonuses.push(`INT +${subrace.bonuses.int}`);
    if (subrace.bonuses.wis) bonuses.push(`SAB +${subrace.bonuses.wis}`);
    if (subrace.bonuses.cha) bonuses.push(`CAR +${subrace.bonuses.cha}`);
    return bonuses.join(', ');
  };

  // Se não tiver raça selecionada, mostrar aviso
  if (!selectedRace) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl">👥</p>
          <h2 className="mt-4 text-2xl font-bold">Escolha sua Sub-raça</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Algumas raças têm sub-raças com bônus adicionais.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/20">
          <Info className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />
          <p className="mt-4 text-sm text-amber-900 dark:text-amber-100">
            Por favor, volte e selecione uma raça primeiro.
          </p>
        </div>
      </div>
    );
  }

  // Se a raça não tem sub-raças, este step será pulado automaticamente pelo useEffect
  if (subraces.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl">👥</p>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">👥</p>
        <h2 className="mt-4 text-2xl font-bold">Escolha sua Sub-raça</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedRace.name} tem {subraces.length} sub-raças disponíveis. Escolha uma para ganhar
          bônus adicionais.
        </p>
      </div>

      {/* Info da Raça Principal */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          <div>
            <p className="text-sm text-muted-foreground">Raça selecionada</p>
            <p className="font-semibold">{selectedRace.name}</p>
          </div>
        </div>
      </div>

      {/* Grid de Sub-raças */}
      <div className="grid gap-4 md:grid-cols-2">
        {subraces.map((subrace) => {
          const isSelected = characterData.subrace === subrace.id;

          return (
            <Card
              key={subrace.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-2 border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                  : 'border hover:border-deep-purple/50'
              }`}
              onClick={() => selectSubrace(subrace.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{subrace.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Sub-raça de {selectedRace.name}
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-purple text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">{subrace.description}</p>

                {/* Bônus de Atributos Adicionais */}
                <div className="rounded-md bg-muted px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">Bônus Adicionais</p>
                  <p className="mt-1 text-sm font-semibold">{formatBonuses(subrace)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info sobre seleção atual */}
      {characterData.subrace && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Sub-raça selecionada: {subraces.find((sr) => sr.id === characterData.subrace)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
