'use client';

import { useState } from 'react';
import { Heart, Plus, Minus, Loader2, Moon, Sun, Dices, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
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
import { EMPTY_DEATH_SAVES } from '@/lib/data/death-saves';
import type { SpellSlotState } from '@/lib/data/spells';
import type { ClassResource } from '@/lib/data/class-resources';
import type { DeathSaves } from '@/lib/data/death-saves';

interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}

interface HPManagerProps {
  characterId: string;
  hitPoints: HitPoints;
  characterClass?: string;
  characterLevel?: number;
  constitutionModifier?: number;
  hitDiceUsed?: number;
  spellSlots?: SpellSlotState[];
  classResources?: ClassResource[];
  deathSaves?: DeathSaves;
}

export function HPManager({
  characterId,
  hitPoints: initialHitPoints,
  characterClass = '',
  characterLevel = 1,
  constitutionModifier = 0,
  hitDiceUsed = 0,
  spellSlots = [],
  classResources = [],
  deathSaves = EMPTY_DEATH_SAVES,
}: HPManagerProps) {
  const [hitPoints, setHitPoints] = useState<HitPoints>(initialHitPoints);
  const [damageAmount, setDamageAmount] = useState<string>('');
  const [healAmount, setHealAmount] = useState<string>('');
  const [tempHPAmount, setTempHPAmount] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShortRestOpen, setIsShortRestOpen] = useState(false);
  const [isLongRestOpen, setIsLongRestOpen] = useState(false);
  const [hitDiceToSpend, setHitDiceToSpend] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [restResult, setRestResult] = useState<RestResult | null>(null);

  const availableHitDice = calculateAvailableHitDice(characterLevel, hitDiceUsed);
  const shortRestCheck = canTakeShortRest(hitPoints.current);
  const longRestCheck = canTakeLongRest(hitPoints.current);

  // Calcular porcentagem de HP
  const hpPercentage = (hitPoints.current / hitPoints.max) * 100;

  // Cor da barra de HP baseada na porcentagem
  const getHPColor = () => {
    if (hpPercentage >= 75) return 'bg-green-500';
    if (hpPercentage >= 50) return 'bg-yellow-500';
    if (hpPercentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Salvar HP no Supabase
  const saveHP = async (newHitPoints: HitPoints) => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ hit_points: newHitPoints })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setHitPoints(newHitPoints);
    } catch (err) {
      console.error('Erro ao salvar HP:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Aplicar dano
  const applyDamage = () => {
    const damage = parseInt(damageAmount);
    if (isNaN(damage) || damage <= 0) return;

    let newCurrent = hitPoints.current;
    let newTemp = hitPoints.temporary;

    // Primeiro, aplicar dano no HP temporário
    if (newTemp > 0) {
      if (damage >= newTemp) {
        // Dano maior que HP temporário
        const remainingDamage = damage - newTemp;
        newTemp = 0;
        newCurrent = Math.max(0, newCurrent - remainingDamage);
      } else {
        // Dano menor que HP temporário
        newTemp -= damage;
      }
    } else {
      // Sem HP temporário, aplicar direto no HP atual
      newCurrent = Math.max(0, newCurrent - damage);
    }

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: newTemp,
    });

    setDamageAmount('');
  };

  // Aplicar cura
  const applyHealing = () => {
    const healing = parseInt(healAmount);
    if (isNaN(healing) || healing <= 0) return;

    const newCurrent = Math.min(hitPoints.max, hitPoints.current + healing);

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: hitPoints.temporary,
    });

    setHealAmount('');
  };

  // Definir HP temporário
  const setTempHP = () => {
    const tempHP = parseInt(tempHPAmount);
    if (isNaN(tempHP) || tempHP < 0) return;

    // HP temporário não se acumula, pega o maior valor
    const newTemp = Math.max(hitPoints.temporary, tempHP);

    saveHP({
      current: hitPoints.current,
      max: hitPoints.max,
      temporary: newTemp,
    });

    setTempHPAmount('');
  };

  // Ajuste rápido (+1/-1)
  const quickAdjust = (amount: number) => {
    let newCurrent = hitPoints.current + amount;
    newCurrent = Math.max(0, Math.min(hitPoints.max, newCurrent));

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: hitPoints.temporary,
    });
  };

  // Short Rest
  const handleShortRest = async () => {
    if (!shortRestCheck.can) return;

    const diceToSpend = Math.max(0, parseInt(hitDiceToSpend) || 0);
    if (diceToSpend === 0) {
      setError('Você precisa gastar pelo menos 1 dado de vida');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = processShortRest(
        hitPoints.current,
        hitPoints.max,
        characterLevel,
        constitutionModifier,
        hitDiceUsed,
        diceToSpend,
        characterClass,
        spellSlots,
        classResources
      );

      console.log('Short rest result:', result);

      const supabase = createClient();

      const updates: Record<string, unknown> = {
        hit_points: {
          current: result.newHP,
          max: hitPoints.max,
          temporary: 0,
        },
        hit_dice_used: hitDiceUsed + (result.hitDiceUsed || 0),
      };

      // Apenas atualizar spell slots e class resources se existirem
      if (spellSlots.length > 0) {
        updates.spell_slots = result.spellSlotsRestored;
      }
      if (classResources.length > 0) {
        updates.class_resources = result.classResourcesRestored;
      }

      console.log('Updating character with:', updates);

      const { data, error: updateError } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', characterId)
        .select();

      console.log('Update result:', { data, error: updateError });

      if (updateError) {
        console.error('Supabase error details:', updateError);
        throw updateError;
      }

      setRestResult(result);
      setHitPoints({
        current: result.newHP,
        max: hitPoints.max,
        temporary: 0,
      });

      setTimeout(() => {
        setIsShortRestOpen(false);
        setRestResult(null);
        setHitDiceToSpend('1');
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Erro ao processar short rest:', err);
      setError(`Erro ao processar descanso curto: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Long Rest
  const handleLongRest = async () => {
    if (!longRestCheck.can) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = processLongRest(
        hitPoints.max,
        characterLevel,
        hitDiceUsed,
        spellSlots,
        classResources,
        deathSaves
      );

      console.log('Long rest result:', result);

      const supabase = createClient();

      const newHitDiceUsed = Math.max(0, hitDiceUsed - (result.hitDiceRestored || 0));

      const updates: Record<string, unknown> = {
        hit_points: {
          current: result.newHP,
          max: hitPoints.max,
          temporary: 0,
        },
        hit_dice_used: newHitDiceUsed,
      };

      // Apenas atualizar spell slots e class resources se existirem
      if (spellSlots.length > 0) {
        updates.spell_slots = result.spellSlotsRestored;
      }
      if (classResources.length > 0) {
        updates.class_resources = result.classResourcesRestored;
      }

      // Reset death saves se necessário
      if (result.deathSavesReset) {
        updates.death_saves = EMPTY_DEATH_SAVES;
      }

      console.log('Updating character with:', updates);

      const { data, error: updateError } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', characterId)
        .select();

      console.log('Update result:', { data, error: updateError });

      if (updateError) {
        console.error('Supabase error details:', updateError);
        throw updateError;
      }

      setRestResult(result);
      setHitPoints({
        current: result.newHP,
        max: hitPoints.max,
        temporary: 0,
      });

      setTimeout(() => {
        setIsLongRestOpen(false);
        setRestResult(null);
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Erro ao processar long rest:', err);
      setError(`Erro ao processar descanso longo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Heart className="h-5 w-5 text-red-400" />
            Pontos de Vida
          </h3>
          <p className="text-sm text-gray-400 mt-1">Gerencie HP atual, máximo e temporário</p>
        </div>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
      </div>
      <div className="space-y-6">
        {/* Display de HP */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-white">{hitPoints.current}</span>
            <span className="text-2xl text-gray-400">/ {hitPoints.max}</span>
          </div>

          {hitPoints.temporary > 0 && (
            <div className="mt-2 text-lg text-blue-400 font-semibold">
              +{hitPoints.temporary} HP temporário
            </div>
          )}

          {/* Barra de HP */}
          <div className="mt-4">
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all duration-300 ${getHPColor()}`}
                style={{ width: `${Math.min(100, hpPercentage)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{Math.round(hpPercentage)}%</p>
          </div>
        </div>

        {/* Ajustes Rápidos */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickAdjust(-1)}
            disabled={hitPoints.current <= 0 || isSaving}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickAdjust(+1)}
            disabled={hitPoints.current >= hitPoints.max || isSaving}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Aplicar Dano */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Receber Dano</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyDamage()}
              disabled={isSaving}
              min="0"
            />
            <Button
              onClick={applyDamage}
              disabled={!damageAmount || isSaving}
              variant="destructive"
            >
              Dano
            </Button>
          </div>
        </div>

        {/* Aplicar Cura */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Receber Cura</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={healAmount}
              onChange={(e) => setHealAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyHealing()}
              disabled={isSaving}
              min="0"
            />
            <Button
              onClick={applyHealing}
              disabled={!healAmount || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              Curar
            </Button>
          </div>
        </div>

        {/* HP Temporário */}
        <div className="space-y-2">
          <label className="text-sm font-medium">HP Temporário</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={tempHPAmount}
              onChange={(e) => setTempHPAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setTempHP()}
              disabled={isSaving}
              min="0"
            />
            <Button onClick={setTempHP} disabled={!tempHPAmount || isSaving} variant="secondary">
              Aplicar
            </Button>
          </div>
        </div>

        {/* Descansos */}
        <div className="border-t border-white/10 pt-4">
          <div className="mb-3 text-sm">
            <p className="font-medium text-white">Dados de Vida</p>
            <p className="text-gray-400">
              {availableHitDice}/{characterLevel} disponíveis
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Short Rest Dialog */}
            <Dialog open={isShortRestOpen} onOpenChange={setIsShortRestOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!shortRestCheck.can || isSaving}>
                  <Sun className="mr-2 h-4 w-4 text-orange-600" />
                  Descanso Curto
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
                      <p className="text-xs text-gray-400">
                        Você tem {availableHitDice} dados de vida disponíveis
                      </p>
                    </div>

                    {/* Preview */}
                    {parseInt(hitDiceToSpend) > 0 && (
                      <div className="rounded-lg glass-card-light p-3">
                        <p className="text-sm font-medium text-white">Recuperação Estimada:</p>
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
                      <p className="font-medium text-white">Benefícios do Descanso Curto:</p>
                      <ul className="space-y-1 text-gray-400">
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
                      className="w-full tab-purple"
                    >
                      {isProcessing ? 'Descansando...' : 'Fazer Descanso Curto'}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Long Rest Dialog */}
            <Dialog open={isLongRestOpen} onOpenChange={setIsLongRestOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!longRestCheck.can || isSaving}>
                  <Moon className="mr-2 h-4 w-4 text-blue-600" />
                  Descanso Longo
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
                    <div className="rounded-lg glass-card-light border border-blue-500/30 p-4">
                      <p className="font-medium text-white">
                        Benefícios do Descanso Longo:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-300">
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

                    <Button onClick={handleLongRest} disabled={isProcessing} className="w-full tab-purple">
                      {isProcessing ? 'Descansando...' : 'Fazer Descanso Longo'}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Warnings */}
          {!shortRestCheck.can && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{shortRestCheck.reason}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-md glass-card-light border border-red-400/50 p-3 text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
