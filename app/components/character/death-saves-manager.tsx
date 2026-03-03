'use client';

import { useState } from 'react';
import { Skull, Heart, RefreshCw, Dices } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type DeathSaves,
  addSuccess,
  addFailure,
  resetDeathSaves,
  processDeathSaveRoll,
  isStabilized,
  isDead,
} from '@/lib/data/death-saves';
import { rollDie } from '@/lib/data/dice';

interface DeathSavesManagerProps {
  characterId: string;
  currentHP: number;
  initialDeathSaves: DeathSaves;
}

export function DeathSavesManager({
  characterId,
  currentHP,
  initialDeathSaves,
}: DeathSavesManagerProps) {
  const [deathSaves, setDeathSaves] = useState<DeathSaves>(initialDeathSaves);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Salvar no Supabase
  const saveDeathSaves = async (newDeathSaves: DeathSaves, newHP?: number) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const updateData: {
        death_saves: DeathSaves;
        hit_points?: { current: number };
      } = { death_saves: newDeathSaves };
      if (newHP !== undefined) {
        updateData.hit_points = { current: newHP };
      }

      const { error } = await supabase.from('characters').update(updateData).eq('id', characterId);

      if (error) throw error;
      setDeathSaves(newDeathSaves);
    } catch (err) {
      console.error('Erro ao salvar death saves:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar sucesso manualmente
  const handleAddSuccess = () => {
    const newDeathSaves = addSuccess(deathSaves);
    saveDeathSaves(newDeathSaves);
  };

  // Adicionar falha manualmente
  const handleAddFailure = () => {
    const newDeathSaves = addFailure(deathSaves);
    saveDeathSaves(newDeathSaves);
  };

  // Rolar teste de morte
  const handleRollDeathSave = () => {
    const roll = rollDie('d20');
    const result = processDeathSaveRoll(roll, deathSaves);

    setMessage(`🎲 Rolou ${roll}: ${result.message}`);
    setTimeout(() => setMessage(null), 5000);

    if (result.recoveredHP > 0) {
      saveDeathSaves(result.deathSaves, result.recoveredHP);
      // Recarregar página se recuperou HP
      setTimeout(() => window.location.reload(), 2000);
    } else {
      saveDeathSaves(result.deathSaves);
    }
  };

  // Reset (reviver)
  const handleReset = () => {
    const newDeathSaves = resetDeathSaves();
    saveDeathSaves(newDeathSaves);
    setMessage(null);
  };

  const stabilized = isStabilized(deathSaves);
  const dead = isDead(deathSaves);
  const showControls = currentHP === 0 && !dead;

  return (
    <Card
      className={`${dead ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : stabilized ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skull className="h-5 w-5" />
          Testes de Morte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Círculos de Sucessos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sucessos</span>
            {showControls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddSuccess}
                disabled={isSaving || deathSaves.successes >= 3}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`success-${i}`}
                className={`h-12 w-12 rounded-full border-2 transition-colors ${
                  deathSaves.successes >= i
                    ? 'border-green-500 bg-green-500'
                    : 'border-green-500/30 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Círculos de Falhas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Falhas</span>
            {showControls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddFailure}
                disabled={isSaving || deathSaves.failures >= 3}
              >
                <Skull className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`failure-${i}`}
                className={`h-12 w-12 rounded-full border-2 transition-colors ${
                  deathSaves.failures >= i
                    ? 'border-red-500 bg-red-500'
                    : 'border-red-500/30 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mensagem de status */}
        {message && <div className="rounded-md border bg-muted p-3 text-sm">{message}</div>}

        {/* Botões */}
        {showControls ? (
          <div className="flex gap-2">
            <Button
              onClick={handleRollDeathSave}
              disabled={isSaving || stabilized}
              className="flex-1"
            >
              <Dices className="mr-2 h-4 w-4" />
              Rolar Teste de Morte
            </Button>
            {(stabilized || dead) && (
              <Button onClick={handleReset} disabled={isSaving} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        ) : currentHP > 0 ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm text-green-900 dark:border-green-900 dark:bg-green-950/20 dark:text-green-100">
            ✅ Você está consciente (HP acima de 0)
          </div>
        ) : null}

        {/* Status especiais */}
        {dead && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            💀 MORTO - 3 Falhas
          </div>
        )}
        {stabilized && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm font-bold text-green-900 dark:border-green-900 dark:bg-green-950/20 dark:text-green-100">
            🛡️ ESTABILIZADO - 3 Sucessos
          </div>
        )}

        {/* Regras */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">📖 Regras:</p>
          <ul className="mt-2 space-y-1">
            <li>• Role 1d20: 1-9 = falha, 10+ = sucesso</li>
            <li>• 1 natural = 2 falhas | 20 natural = recupera 1 HP</li>
            <li>• 3 sucessos = estabilizado | 3 falhas = morte</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
