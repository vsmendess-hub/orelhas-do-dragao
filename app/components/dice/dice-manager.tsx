'use client';

import { DiceRoller } from './dice-roller';
import { RollHistory } from './roll-history';
import { SavingThrowButtons } from './saving-throw-buttons';
import { WeaponRollButton } from './weapon-roll-button';
import { QuickRollButton } from './quick-roll-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Zap, Heart } from 'lucide-react';
import { type Item } from '@/lib/data/items';

interface CharacterData {
  id: string;
  name: string;
  proficiencyBonus: number;
  skills: Array<{
    name: string;
    attribute: string;
    proficient: boolean;
    expertise: boolean;
  }>;
  equipment: Item[];
  modifiers: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
}

interface DiceManagerProps {
  character: CharacterData;
}

export function DiceManager({ character }: DiceManagerProps) {
  // Filtrar armas equipadas
  const equippedWeapons = character.equipment.filter(
    (item) => item.category === 'weapon' && item.equipped
  );

  // Calcular bônus de ataque baseado em DEX ou STR
  const getAttackBonus = (weapon: Item) => {
    const isFinesse = weapon.properties?.weaponProperties?.includes('Finesse');
    const modifier = isFinesse
      ? Math.max(character.modifiers.str, character.modifiers.dex)
      : character.modifiers.str;
    return modifier + character.proficiencyBonus;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Coluna Esquerda - Rolador Principal */}
      <div className="space-y-6 lg:col-span-2">
        {/* Rolador de Dados */}
        <DiceRoller />

        {/* Rolagens Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Rolagens Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Iniciativa */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Combate</h4>
              <div className="flex flex-wrap gap-2">
                <QuickRollButton
                  label="Iniciativa"
                  diceCount={1}
                  diceType="d20"
                  modifier={character.modifiers.dex}
                  description="Iniciativa"
                  variant="outline"
                  size="default"
                />
                <QuickRollButton
                  label="Teste de Morte"
                  diceCount={1}
                  diceType="d20"
                  modifier={0}
                  description="Teste de Morte"
                  variant="outline"
                  size="default"
                />
              </div>
            </div>

            {/* Armas Equipadas */}
            {equippedWeapons.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Armas Equipadas</h4>
                <div className="space-y-2">
                  {equippedWeapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Swords className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{weapon.name}</span>
                      </div>
                      <WeaponRollButton weapon={weapon} attackBonus={getAttackBonus(weapon)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cura */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Cura e Suporte</h4>
              <div className="flex flex-wrap gap-2">
                <QuickRollButton
                  label="Dado de Vida (d8)"
                  diceCount={1}
                  diceType="d8"
                  modifier={character.modifiers.con}
                  description="Dado de Vida"
                  variant="outline"
                  size="default"
                />
                <QuickRollButton
                  label="Poção de Cura"
                  diceCount={2}
                  diceType="d4"
                  modifier={2}
                  description="Poção de Cura"
                  variant="outline"
                  size="default"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testes de Resistência */}
        <SavingThrowButtons
          proficiencyBonus={character.proficiencyBonus}
          modifiers={character.modifiers}
        />
      </div>

      {/* Coluna Direita - Histórico */}
      <div>
        <RollHistory maxEntries={50} />
      </div>
    </div>
  );
}
