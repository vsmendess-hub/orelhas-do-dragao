'use client';

import { useState } from 'react';
import { type DiceType, getDiceName, getDiceColor, getDiceBackgroundColor } from '@/lib/data/dice';

interface DiceButtonProps {
  diceType: DiceType;
  result?: number;
  isRolling?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DiceButton({
  diceType,
  result,
  isRolling = false,
  onClick,
  disabled = false,
  size = 'md',
}: DiceButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || isRolling) return;

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    onClick?.();
  };

  // Tamanhos
  const sizes = {
    sm: {
      container: 'h-16 w-16',
      text: 'text-xs',
      result: 'text-2xl',
    },
    md: {
      container: 'h-20 w-20',
      text: 'text-sm',
      result: 'text-3xl',
    },
    lg: {
      container: 'h-24 w-24',
      text: 'text-base',
      result: 'text-4xl',
    },
  };

  const sizeClasses = sizes[size];

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isRolling}
      className={`${sizeClasses.container} flex flex-col items-center justify-center rounded-lg border-2 transition-all ${getDiceBackgroundColor(diceType)} ${getDiceColor(diceType)} ${
        isAnimating ? 'animate-dice-roll' : ''
      } ${disabled || isRolling ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 hover:shadow-lg active:scale-95'}`}
    >
      {/* Mostrar resultado se houver, senão mostra o tipo */}
      {result !== undefined && !isRolling ? (
        <span className={`${sizeClasses.result} font-bold`}>{result}</span>
      ) : (
        <>
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Dado genérico (cubo) */}
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="16" cy="8" r="1" fill="currentColor" />
            <circle cx="8" cy="16" r="1" fill="currentColor" />
            <circle cx="16" cy="16" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
          <span className={`${sizeClasses.text} mt-1 font-bold`}>{getDiceName(diceType)}</span>
        </>
      )}
    </button>
  );
}

// Adicionar keyframes de animação ao global CSS (você precisará adicionar isso ao seu tailwind.config.js)
// @keyframes dice-roll {
//   0% { transform: rotate(0deg) scale(1); }
//   25% { transform: rotate(90deg) scale(1.1); }
//   50% { transform: rotate(180deg) scale(1); }
//   75% { transform: rotate(270deg) scale(1.1); }
//   100% { transform: rotate(360deg) scale(1); }
// }
