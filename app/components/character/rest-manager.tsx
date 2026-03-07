'use client';

import { useState } from 'react';
import { Moon, Sun, Dices, Heart, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  processShortRest,
  processLongRest,
  calculateAvailableHitDice,
  canTakeShortRest,
  canTakeLongRest,
  type RestResult,
} from '@/lib/data/rest';
import type { SpellSlotState } from '@/lib/data/spells';
import type { ClassResource } from '@/lib/data/class-resources';
import type { DeathSaves } from '@/lib/data/death-saves';
import { EMPTY_DEATH_SAVES } from '@/lib/data/death-saves';

interface RestManagerProps {
  characterId: string;
  characterClass: string;
  characterLevel: number;
  constitutionModifier: number;
  currentHP: number;
  maxHP: number;
  hitDiceUsed: number;
  spellSlots: SpellSlotState[];
  classResources: ClassResource[];
  deathSaves: DeathSaves;
}

export function RestManager({
  characterId,
  characterClass,
  characterLevel,
  constitutionModifier,
  currentHP,
  maxHP,
  hitDiceUsed,
  spellSlots,
  classResources,
  deathSaves,
}: RestManagerProps) {
  const [isShortRestOpen, setIsShortRestOpen] = useState(false);
  const [isLongRestOpen, setIsLongRestOpen] = useState(false);
  const [hitDiceToSpend, setHitDiceToSpend] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [restResult, setRestResult] = useState<RestResult | null>(null);

  const availableHitDice = calculateAvailableHitDice(characterLevel, hitDiceUsed);
  const shortRestCheck = canTakeShortRest(currentHP);
  const longRestCheck = canTakeLongRest(currentHP);

  // Short Rest
  const handleShortRest = async () => {
    if (!shortRestCheck.can) return;

    const diceToSpend = Math.max(0, parseInt(hitDiceToSpend) || 0);
    if (diceToSpend === 0) {
      alert('Você precisa gastar pelo menos 1 dado de vida');
      return;
    }

    setIsProcessing(true);

    const result = processShortRest(
      currentHP,
      maxHP,
      characterLevel,
      constitutionModifier,
      hitDiceUsed,
      diceToSpend,
      characterClass,
      spellSlots,
      classResources
    );

    try {
      const supabase = createClient();

      const updates: Record<string, unknown> = {
        hit_points: {
          current: result.newHP,
          max: maxHP,
          temporary: 0,
        },
        hit_dice_used: hitDiceUsed + (result.hitDiceUsed || 0),
        spell_slots: result.spellSlotsRestored,
        class_resources: result.classResourcesRestored,
      };

      const { error } = await supabase.from('characters').update(updates).eq('id', characterId);

      if (error) throw error;

      setRestResult(result);
      setTimeout(() => {
        setIsShortRestOpen(false);
        setRestResult(null);
        setHitDiceToSpend('1');
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Erro ao processar short rest:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Long Rest
  const handleLongRest = async () => {
    if (!longRestCheck.can) return;

    setIsProcessing(true);

    const result = processLongRest(
      maxHP,
      characterLevel,
      hitDiceUsed,
      spellSlots,
      classResources,
      deathSaves
    );

    try {
      const supabase = createClient();

      const newHitDiceUsed = Math.max(0, hitDiceUsed - (result.hitDiceRestored || 0));

      const updates: Record<string, unknown> = {
        hit_points: {
          current: result.newHP,
          max: maxHP,
          temporary: 0,
        },
        hit_dice_used: newHitDiceUsed,
        spell_slots: result.spellSlotsRestored,
        class_resources: result.classResourcesRestored,
      };

      // Reset death saves se necessário
      if (result.deathSavesReset) {
        updates.death_saves = EMPTY_DEATH_SAVES;
      }

      const { error } = await supabase.from('characters').update(updates).eq('id', characterId);

      if (error) throw error;

      setRestResult(result);
      setTimeout(() => {
        setIsLongRestOpen(false);
        setRestResult(null);
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Erro ao processar long rest:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Descanso
        </CardTitle>
        <CardDescription>Recupere HP, spell slots e recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Dados de Vida</p>
            <p className="text-lg font-bold">
              {availableHitDice}/{characterLevel}
            </p>
            <p className="text-xs text-muted-foreground">disponíveis</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">HP Atual</p>
            <p className="text-lg font-bold">
              {currentHP}/{maxHP}
            </p>
          </div>
        </div>

        {/* Rest Buttons */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Short Rest */}
          <Dialog open={isShortRestOpen} onOpenChange={setIsShortRestOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                disabled={!shortRestCheck.can}
              >
                <Sun className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-semibold">Descanso Curto</p>
                  <p className="text-xs text-muted-foreground">1 hora</p>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-orange-600" />
                  Descanso Curto
                </DialogTitle>
                <DialogDescription>
                  Gaste dados de vida para recuperar HP e recursos
                </DialogDescription>
              </DialogHeader>

              {restResult ? (
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Descanso Completado!</AlertTitle>
                  <AlertDescription>{restResult.message}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Hit Dice Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="hit-dice">Dados de Vida para Gastar</Label>
                    <Input
                      id="hit-dice"
                      type="number"
                      min="0"
                      max={availableHitDice}
                      value={hitDiceToSpend}
                      onChange={(e) => setHitDiceToSpend(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Você tem {availableHitDice} dados de vida disponíveis
                    </p>
                  </div>

                  {/* Preview */}
                  {parseInt(hitDiceToSpend) > 0 && (
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <p className="text-sm font-medium">Recuperação Estimada:</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        <span className="text-sm">
                          ~{parseInt(hitDiceToSpend) * (5 + constitutionModifier)} HP
                        </span>
                      </div>
                      {characterClass === 'Bruxo' && (
                        <div className="mt-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">Todos os spell slots (Pact Magic)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Benefícios do Descanso Curto:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Gaste dados de vida para recuperar HP</li>
                      <li>• Recursos de classe (algumas habilidades)</li>
                      {characterClass === 'Bruxo' && (
                        <li>• Spell slots (apenas Bruxo - Pact Magic)</li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={handleShortRest}
                    disabled={isProcessing || parseInt(hitDiceToSpend) === 0}
                    className="w-full"
                  >
                    {isProcessing ? 'Descansando...' : 'Fazer Descanso Curto'}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Long Rest */}
          <Dialog open={isLongRestOpen} onOpenChange={setIsLongRestOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                disabled={!longRestCheck.can}
              >
                <Moon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold">Descanso Longo</p>
                  <p className="text-xs text-muted-foreground">8 horas</p>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-600" />
                  Descanso Longo
                </DialogTitle>
                <DialogDescription>Recupere completamente seus recursos</DialogDescription>
              </DialogHeader>

              {restResult ? (
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Descanso Completado!</AlertTitle>
                  <AlertDescription>{restResult.message}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Benefits */}
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Benefícios do Descanso Longo:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      <li className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        HP totalmente restaurado
                      </li>
                      <li className="flex items-center gap-2">
                        <Dices className="h-4 w-4" />
                        {Math.max(1, Math.floor(characterLevel / 2))} dados de vida recuperados
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Todos os spell slots restaurados
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Todos os recursos de classe restaurados
                      </li>
                      {(deathSaves.successes > 0 || deathSaves.failures > 0) && (
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Death saves resetados
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button onClick={handleLongRest} disabled={isProcessing} className="w-full">
                    {isProcessing ? 'Descansando...' : 'Fazer Descanso Longo'}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Warnings */}
        {!shortRestCheck.can && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{shortRestCheck.reason}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
