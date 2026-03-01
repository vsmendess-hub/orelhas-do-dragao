'use client';

import { QuickRollButton } from './quick-roll-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface SavingThrowButtonsProps {
  proficiencyBonus: number;
  modifiers: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  savingThrowProficiencies?: string[]; // Ex: ["str", "con"]
}

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

export function SavingThrowButtons({
  proficiencyBonus,
  modifiers,
  savingThrowProficiencies = [],
}: SavingThrowButtonsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5" />
          Testes de Resistência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2">
          {(Object.keys(modifiers) as Array<keyof typeof modifiers>).map((ability) => {
            const isProficient = savingThrowProficiencies.includes(ability);
            const bonus = modifiers[ability] + (isProficient ? proficiencyBonus : 0);

            return (
              <div
                key={ability}
                className="flex items-center justify-between rounded-lg border bg-card p-2"
              >
                <div className="flex items-center gap-2">
                  {isProficient && (
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-deep-purple/10 text-xs font-medium text-deep-purple">
                      ✓
                    </div>
                  )}
                  <span className="text-sm font-medium">{ABILITY_NAMES[ability]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {bonus >= 0 ? '+' : ''}
                    {bonus}
                  </span>
                  <QuickRollButton
                    diceCount={1}
                    diceType="d20"
                    modifier={bonus}
                    description={`TR de ${ABILITY_NAMES[ability]}`}
                    variant="ghost"
                    size="icon"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
