'use client';

import { useState } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { rollDice, type DiceRoll } from '@/lib/data/dm-tools';

export function DiceRoller() {
  const [formula, setFormula] = useState('1d20');
  const [result, setResult] = useState<DiceRoll | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<DiceRoll[]>([]);

  const handleRoll = () => {
    try {
      setError('');
      const roll = rollDice(formula);
      setResult(roll);
      setHistory([roll, ...history.slice(0, 4)]); // Manter últimos 5
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  };

  const quickRoll = (quickFormula: string) => {
    setFormula(quickFormula);
    try {
      setError('');
      const roll = rollDice(quickFormula);
      setResult(roll);
      setHistory([roll, ...history.slice(0, 4)]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-5 w-5 text-red-600" />
          Rolador de Dados
        </CardTitle>
        <CardDescription>Role dados de D&D rapidamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formula Input */}
        <div className="space-y-2">
          <Label htmlFor="formula">Fórmula (ex: 2d6+3)</Label>
          <div className="flex gap-2">
            <Input
              id="formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="1d20"
              onKeyDown={(e) => e.key === 'Enter' && handleRoll()}
            />
            <Button onClick={handleRoll}>Rolar</Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Quick Roll Buttons */}
        <div className="space-y-2">
          <Label>Rolagens Rápidas</Label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d20')}>
              d20
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d12')}>
              d12
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d10')}>
              d10
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d8')}>
              d8
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d6')}>
              d6
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('1d4')}>
              d4
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('2d6')}>
              2d6
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickRoll('4d6')}>
              4d6
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-lg border-2 bg-card p-4 space-y-2">
            <div className="text-center">
              <p className="text-4xl font-bold">{result.total}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Rolagens: [{result.rolls.join(', ')}]
                {result.modifier !== 0 && ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}`}
              </p>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Histórico</Label>
            <div className="space-y-1">
              {history.map((roll, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-1 text-sm"
                >
                  <span className="text-muted-foreground">{roll.formula}</span>
                  <Badge variant="secondary">{roll.total}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
