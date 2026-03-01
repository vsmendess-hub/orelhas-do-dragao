'use client';

import { useState } from 'react';
import { Plus, Minus, Dices, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DiceButton } from './dice-button';
import {
  type DiceType,
  type RollType,
  type RollResult,
  roll,
  formatRollResult,
} from '@/lib/data/dice';

interface DiceRollerProps {
  onRoll?: (result: RollResult) => void;
}

const DICE_TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [rollType, setRollType] = useState<RollType>('normal');
  const [lastResult, setLastResult] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Rolar dados
  const handleRoll = () => {
    setIsRolling(true);

    // Animação delay
    setTimeout(() => {
      const result = roll(diceCount, selectedDice, modifier, rollType);
      setLastResult(result);
      onRoll?.(result);
      setIsRolling(false);
    }, 600);
  };

  // Incrementar/decrementar contador
  const incrementCount = () => setDiceCount((prev) => Math.min(prev + 1, 10));
  const decrementCount = () => setDiceCount((prev) => Math.max(prev - 1, 1));

  // Incrementar/decrementar modificador
  const incrementModifier = () => setModifier((prev) => prev + 1);
  const decrementModifier = () => setModifier((prev) => prev - 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-5 w-5" />
          Rolador de Dados
        </CardTitle>
        <CardDescription>Escolha os dados e role para ver o resultado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seleção de dados */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Dado</label>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
            {DICE_TYPES.map((dice) => (
              <DiceButton
                key={dice}
                diceType={dice}
                onClick={() => setSelectedDice(dice)}
                size="sm"
                disabled={isRolling}
              />
            ))}
          </div>
        </div>

        {/* Quantidade de dados */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementCount}
              disabled={diceCount <= 1 || isRolling}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold">
                {diceCount}
                {selectedDice}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementCount}
              disabled={diceCount >= 10 || isRolling}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modificador */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Modificador</label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={decrementModifier} disabled={isRolling}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="text-center text-lg font-bold"
              disabled={isRolling}
            />
            <Button variant="outline" size="icon" onClick={incrementModifier} disabled={isRolling}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Vantagem/Desvantagem (só para d20) */}
        {selectedDice === 'd20' && diceCount === 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Rolagem</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={rollType === 'normal' ? 'default' : 'outline'}
                onClick={() => setRollType('normal')}
                disabled={isRolling}
              >
                Normal
              </Button>
              <Button
                variant={rollType === 'advantage' ? 'default' : 'outline'}
                onClick={() => setRollType('advantage')}
                disabled={isRolling}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Vantagem
              </Button>
              <Button
                variant={rollType === 'disadvantage' ? 'default' : 'outline'}
                onClick={() => setRollType('disadvantage')}
                disabled={isRolling}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Desvantagem
              </Button>
            </div>
          </div>
        )}

        {/* Botão de Rolar */}
        <Button onClick={handleRoll} disabled={isRolling} className="w-full" size="lg">
          <Dices className="mr-2 h-5 w-5" />
          {isRolling ? 'Rolando...' : 'Rolar Dados'}
        </Button>

        {/* Resultado */}
        {lastResult && !isRolling && (
          <div
            className={`rounded-lg border-2 p-4 ${
              lastResult.isCritical
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                : lastResult.isCriticalFail
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  : 'border-deep-purple bg-deep-purple/5'
            }`}
          >
            {/* Resultado Total */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Resultado</p>
              <p className="mt-1 text-5xl font-bold">{lastResult.total}</p>
            </div>

            {/* Detalhamento */}
            <div className="mt-4 rounded-md bg-background/50 p-3 text-center text-sm">
              <p className="font-mono">{formatRollResult(lastResult)}</p>
            </div>

            {/* Indicadores especiais */}
            {lastResult.isCritical && (
              <div className="mt-3 text-center">
                <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  ⭐ CRÍTICO! ⭐
                </span>
              </div>
            )}
            {lastResult.isCriticalFail && (
              <div className="mt-3 text-center">
                <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  💀 FALHA CRÍTICA! 💀
                </span>
              </div>
            )}

            {/* Tipo de rolagem */}
            {lastResult.type !== 'normal' && (
              <div className="mt-3 text-center text-xs text-muted-foreground">
                {lastResult.type === 'advantage' && '↗ Rolado com Vantagem'}
                {lastResult.type === 'disadvantage' && '↘ Rolado com Desvantagem'}
              </div>
            )}
          </div>
        )}

        {/* Dicas */}
        {!lastResult && (
          <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">💡 Dicas:</p>
            <ul className="mt-2 space-y-1">
              <li>• Use +/- para ajustar quantidade e modificadores rapidamente</li>
              <li>• Vantagem/Desvantagem estão disponíveis apenas para 1d20</li>
              <li>• 20 natural = Crítico | 1 natural = Falha Crítica</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
