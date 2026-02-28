'use client';

import { Minus, Plus, Info } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { getRaceById, calculateRacialBonuses } from '@/lib/data/races';
import {
  POINT_BUY_BUDGET,
  MIN_ABILITY_SCORE,
  MAX_ABILITY_SCORE,
  calculatePointBuyCost,
  getRemainingPoints,
  canIncreaseAbility,
  canDecreaseAbility,
  calculateModifier,
  formatModifier,
  POINT_BUY_COSTS,
} from '@/lib/data/point-buy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ABILITY_NAMES = {
  str: { name: 'Força', abbreviation: 'FOR', description: 'Poder físico e atletismo' },
  dex: { name: 'Destreza', abbreviation: 'DES', description: 'Agilidade e reflexos' },
  con: { name: 'Constituição', abbreviation: 'CON', description: 'Resistência e vitalidade' },
  int: { name: 'Inteligência', abbreviation: 'INT', description: 'Raciocínio e memória' },
  wis: { name: 'Sabedoria', abbreviation: 'SAB', description: 'Percepção e intuição' },
  cha: { name: 'Carisma', abbreviation: 'CAR', description: 'Força de personalidade' },
} as const;

export function Step4Abilities() {
  const { characterData, updateCharacterData } = useWizard();

  // Calcular bônus raciais
  const racialBonuses = calculateRacialBonuses(characterData.race || '', characterData.subrace);

  // Calcular pontos gastos e restantes
  const totalCost = calculatePointBuyCost(characterData.abilities);
  const remainingPoints = getRemainingPoints(characterData.abilities);

  // Função para incrementar atributo
  const incrementAbility = (ability: keyof typeof characterData.abilities) => {
    const currentValue = characterData.abilities[ability];
    if (canIncreaseAbility(currentValue, totalCost, POINT_BUY_BUDGET)) {
      updateCharacterData({
        abilities: {
          ...characterData.abilities,
          [ability]: currentValue + 1,
        },
      });
    }
  };

  // Função para decrementar atributo
  const decrementAbility = (ability: keyof typeof characterData.abilities) => {
    const currentValue = characterData.abilities[ability];
    if (canDecreaseAbility(currentValue)) {
      updateCharacterData({
        abilities: {
          ...characterData.abilities,
          [ability]: currentValue - 1,
        },
      });
    }
  };

  // Obter raça selecionada para exibir info
  const selectedRace = characterData.race ? getRaceById(characterData.race) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">💪</p>
        <h2 className="mt-4 text-2xl font-bold">Distribua seus Atributos</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use 27 pontos para determinar seus atributos base (Point Buy)
        </p>
      </div>

      {/* Info sobre Point Buy */}
      <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">Sistema Point Buy</p>
            <p className="mt-1 text-blue-800 dark:text-blue-200">
              Você tem 27 pontos para distribuir. Cada valor de atributo custa uma quantidade
              diferente de pontos. Os bônus raciais serão aplicados automaticamente aos valores
              finais.
            </p>
          </div>
        </div>
      </div>

      {/* Contador de Pontos */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pontos Restantes</p>
            <p
              className={`text-3xl font-bold ${
                remainingPoints < 0
                  ? 'text-red-600 dark:text-red-400'
                  : remainingPoints === 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-foreground'
              }`}
            >
              {remainingPoints}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Usado</p>
            <p className="text-3xl font-bold">
              {totalCost} / {POINT_BUY_BUDGET}
            </p>
          </div>
        </div>

        {remainingPoints < 0 && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            ⚠️ Você está usando mais pontos do que o permitido!
          </p>
        )}

        {remainingPoints === 0 && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            ✓ Todos os pontos distribuídos!
          </p>
        )}
      </div>

      {/* Info sobre Raça */}
      {selectedRace && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium">
            🎭 {selectedRace.name} {characterData.subrace && '→ Sub-raça selecionada'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Os bônus raciais serão aplicados automaticamente aos valores finais
          </p>
        </div>
      )}

      {/* Grid de Atributos */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(ABILITY_NAMES) as Array<keyof typeof ABILITY_NAMES>).map((abilityKey) => {
          const ability = ABILITY_NAMES[abilityKey];
          const baseValue = characterData.abilities[abilityKey];
          const racialBonus = racialBonuses[abilityKey] || 0;
          const finalValue = baseValue + racialBonus;
          const modifier = calculateModifier(finalValue);
          const cost = POINT_BUY_COSTS[baseValue];

          return (
            <Card key={abilityKey}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ability.name}</CardTitle>
                    <CardDescription className="text-xs">{ability.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Custo</div>
                    <div className="text-lg font-bold">{cost} pts</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Controles de +/- */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementAbility(abilityKey)}
                    disabled={!canDecreaseAbility(baseValue)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted px-4 py-2">
                    <span className="text-2xl font-bold">{baseValue}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementAbility(abilityKey)}
                    disabled={!canIncreaseAbility(baseValue, totalCost, POINT_BUY_BUDGET)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Breakdown: Base + Racial = Final */}
                <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Base</span>
                    <span className="font-medium">{baseValue}</span>
                  </div>
                  {racialBonus > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">+ Bônus Racial</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          +{racialBonus}
                        </span>
                      </div>
                      <div className="my-1 border-t" />
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">= Valor Final</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{finalValue}</span>
                      <span
                        className={`text-sm font-medium ${
                          modifier >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ({formatModifier(modifier)})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabela de Custos */}
      <details className="rounded-lg border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">
          📊 Tabela de Custos Point Buy
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          {Object.entries(POINT_BUY_COSTS).map(([value, cost]) => (
            <div
              key={value}
              className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
            >
              <span className="font-medium">Valor {value}</span>
              <span className="text-muted-foreground">{cost} pts</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
