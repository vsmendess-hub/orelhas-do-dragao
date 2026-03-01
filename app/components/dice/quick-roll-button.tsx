'use client';

import { useState } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type DiceType, type RollType, roll } from '@/lib/data/dice';
import { useRollHistory } from './roll-history';

interface QuickRollButtonProps {
  label?: string;
  diceCount: number;
  diceType: DiceType;
  modifier: number;
  rollType?: RollType;
  description: string;
  onRoll?: (total: number) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function QuickRollButton({
  label,
  diceCount,
  diceType,
  modifier,
  rollType = 'normal',
  description,
  onRoll,
  variant = 'outline',
  size = 'sm',
}: QuickRollButtonProps) {
  const [isRolling, setIsRolling] = useState(false);
  const { addRoll } = useRollHistory();

  const handleRoll = () => {
    setIsRolling(true);

    setTimeout(() => {
      const result = roll(diceCount, diceType, modifier, rollType, description);
      addRoll(result);
      onRoll?.(result.total);
      setIsRolling(false);
    }, 300);
  };

  const diceNotation = `${diceCount > 1 ? diceCount : ''}${diceType}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRoll}
      disabled={isRolling}
      title={`Rolar ${diceNotation} - ${description}`}
    >
      <Dices className={`${size === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
      {label || diceNotation}
    </Button>
  );
}
