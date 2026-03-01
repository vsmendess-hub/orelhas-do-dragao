'use client';

import { useState } from 'react';
import { Swords, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Item } from '@/lib/data/items';
import { roll, type DiceType } from '@/lib/data/dice';
import { useRollHistory } from './roll-history';

interface WeaponRollButtonProps {
  weapon: Item;
  attackBonus: number;
}

export function WeaponRollButton({ weapon, attackBonus }: WeaponRollButtonProps) {
  const [isRolling, setIsRolling] = useState(false);
  const { addRoll } = useRollHistory();

  const handleAttackRoll = () => {
    setIsRolling(true);

    setTimeout(() => {
      const result = roll(1, 'd20', attackBonus, 'normal', `Ataque: ${weapon.name}`);
      addRoll(result);
      setIsRolling(false);
    }, 300);
  };

  const handleDamageRoll = () => {
    if (!weapon.properties?.damage) return;

    setIsRolling(true);

    setTimeout(() => {
      // Parse damage (ex: "1d8" -> 1, "d8")
      const damageStr = weapon.properties?.damage || '1d6';
      const match = damageStr.match(/(\d+)?d(\d+)/);

      if (match) {
        const count = parseInt(match[1] || '1');
        const sides = parseInt(match[2]);
        const diceType = `d${sides}` as DiceType;

        const result = roll(count, diceType, 0, 'normal', `Dano: ${weapon.name}`);
        addRoll(result);
      }

      setIsRolling(false);
    }, 300);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAttackRoll}
        disabled={isRolling}
        title={`Rolar ataque com ${weapon.name}`}
      >
        <Swords className="mr-1 h-3 w-3" />
        Ataque
      </Button>
      {weapon.properties?.damage && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDamageRoll}
          disabled={isRolling}
          title={`Rolar dano de ${weapon.name}`}
        >
          <Zap className="mr-1 h-3 w-3" />
          Dano
        </Button>
      )}
    </div>
  );
}
