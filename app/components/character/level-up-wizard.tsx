'use client';

import { useState } from 'react';
import { TrendingUp, Dices, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  rollHitDice,
  calculateHPGain,
  prepareLevelUpData,
  validateAbilityIncrease,
  applyAbilityIncrease,
  AVERAGE_HP_GAIN,
  HIT_DICE,
  type AbilityScores,
} from '@/lib/data/level-up';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

interface LevelUpWizardProps {
  characterId: string;
  characterName: string;
  currentLevel: number;
  characterClass: string;
  currentHP: { current: number; max: number };
  currentAttributes: AbilityScores;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type WizardStep = 'hp' | 'asi' | 'confirm';

export function LevelUpWizard({
  characterId,
  characterName,
  currentLevel,
  characterClass,
  currentHP,
  currentAttributes,
  open,
  onClose,
  onComplete,
}: LevelUpWizardProps) {
  const [step, setStep] = useState<WizardStep>('hp');
  const [isSaving, setIsSaving] = useState(false);

  // HP Step
  const [hpMethod, setHpMethod] = useState<'roll' | 'average'>('average');
  const [hpRoll, setHpRoll] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);

  // ASI Step
  const [ability1, setAbility1] = useState<keyof AbilityScores>('str');
  const [ability1Increase, setAbility1Increase] = useState<number>(1);
  const [ability2, setAbility2] = useState<keyof AbilityScores | ''>('');
  const [ability2Increase, setAbility2Increase] = useState<number>(0);
  const [asiError, setAsiError] = useState<string>('');

  const newLevel = currentLevel + 1;
  const constitutionModifier = calculateModifier(currentAttributes.con);
  const hitDice = HIT_DICE[characterClass] || 8;
  const averageHP = AVERAGE_HP_GAIN[characterClass];

  const levelUpData = prepareLevelUpData(
    currentLevel,
    characterClass,
    hpMethod === 'roll' ? hpRoll : null,
    constitutionModifier
  );

  const grantsASI = levelUpData.grantsASI;

  // Calcular HP gain
  const hpGain = calculateHPGain(
    characterClass,
    hpMethod === 'roll' ? hpRoll : null,
    constitutionModifier
  );

  // Calcular novos atributos
  const getNewAttributes = (): AbilityScores => {
    if (!grantsASI) return currentAttributes;

    const result = validateAbilityIncrease(
      currentAttributes,
      ability1,
      ability1Increase,
      ability2 || undefined,
      ability2 ? ability2Increase : undefined
    );

    if (!result.valid) return currentAttributes;

    return applyAbilityIncrease(
      currentAttributes,
      ability1,
      ability1Increase,
      ability2 || undefined,
      ability2 ? ability2Increase : undefined
    );
  };

  const newAttributes = getNewAttributes();

  // Rolar HP
  const handleRollHP = () => {
    const roll = rollHitDice(characterClass);
    setHpRoll(roll);
    setHasRolled(true);
  };

  // Validar ASI
  const validateASI = (): boolean => {
    if (!grantsASI) return true;

    const result = validateAbilityIncrease(
      currentAttributes,
      ability1,
      ability1Increase,
      ability2 || undefined,
      ability2 ? ability2Increase : undefined
    );

    if (!result.valid) {
      setAsiError(result.error || 'Erro desconhecido');
      return false;
    }

    setAsiError('');
    return true;
  };

  // Avançar step
  const handleNext = () => {
    if (step === 'hp') {
      if (hpMethod === 'roll' && !hasRolled) {
        return;
      }
      if (grantsASI) {
        setStep('asi');
      } else {
        setStep('confirm');
      }
    } else if (step === 'asi') {
      if (validateASI()) {
        setStep('confirm');
      }
    }
  };

  // Voltar step
  const handleBack = () => {
    if (step === 'confirm') {
      if (grantsASI) {
        setStep('asi');
      } else {
        setStep('hp');
      }
    } else if (step === 'asi') {
      setStep('hp');
    }
  };

  // Finalizar level up
  const handleComplete = async () => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const updates: Record<string, unknown> = {
        level: newLevel,
        hit_points: {
          current: currentHP.current + hpGain,
          max: currentHP.max + hpGain,
          temporary: 0,
        },
        proficiency_bonus: levelUpData.proficiencyBonus,
      };

      if (grantsASI) {
        updates.attributes = newAttributes;
      }

      const { error } = await supabase.from('characters').update(updates).eq('id', characterId);

      if (error) throw error;

      onComplete();
      onClose();
    } catch (err) {
      console.error('Erro ao fazer level up:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset ao fechar
  const handleClose = () => {
    setStep('hp');
    setHpMethod('average');
    setHpRoll(null);
    setHasRolled(false);
    setAbility1('str');
    setAbility1Increase(1);
    setAbility2('');
    setAbility2Increase(0);
    setAsiError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            Level Up! {currentLevel} → {newLevel}
          </DialogTitle>
          <DialogDescription>Parabéns, {characterName}! Você subiu de nível.</DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <Badge variant={step === 'hp' ? 'default' : 'secondary'}>
            <Dices className="mr-1 h-3 w-3" />
            HP
          </Badge>
          {grantsASI && (
            <Badge variant={step === 'asi' ? 'default' : 'secondary'}>
              <Sparkles className="mr-1 h-3 w-3" />
              ASI
            </Badge>
          )}
          <Badge variant={step === 'confirm' ? 'default' : 'secondary'}>
            <Check className="mr-1 h-3 w-3" />
            Confirmar
          </Badge>
        </div>

        {/* HP Step */}
        {step === 'hp' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dices className="h-5 w-5" />
                  Pontos de Vida
                </CardTitle>
                <CardDescription>Escolha como ganhar HP no nível {newLevel}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={hpMethod}
                  onValueChange={(v) => setHpMethod(v as 'roll' | 'average')}
                >
                  <div className="flex items-start space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average" className="flex-1 cursor-pointer">
                      <div className="font-medium">Valor Médio (Recomendado)</div>
                      <div className="text-sm text-muted-foreground">
                        Ganhe {averageHP} + {formatModifier(constitutionModifier)} ={' '}
                        <span className="font-bold text-foreground">
                          {calculateHPGain(characterClass, null, constitutionModifier)} HP
                        </span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="roll" id="roll" />
                    <Label htmlFor="roll" className="flex-1 cursor-pointer">
                      <div className="font-medium">Rolar Dado de Vida</div>
                      <div className="text-sm text-muted-foreground">
                        Role 1d{hitDice} + {formatModifier(constitutionModifier)}
                      </div>
                      {hpMethod === 'roll' && (
                        <div className="mt-3">
                          <Button
                            onClick={handleRollHP}
                            disabled={hasRolled}
                            size="sm"
                            className="w-full"
                          >
                            <Dices className="mr-2 h-4 w-4" />
                            {hasRolled ? 'Rolado!' : `Rolar 1d${hitDice}`}
                          </Button>
                          {hasRolled && hpRoll !== null && (
                            <div className="mt-2 rounded-md bg-amber-50 p-3 text-center dark:bg-amber-950/20">
                              <p className="text-sm text-muted-foreground">Você rolou:</p>
                              <p className="text-2xl font-bold text-amber-600">
                                {hpRoll} + {formatModifier(constitutionModifier)} ={' '}
                                {calculateHPGain(characterClass, hpRoll, constitutionModifier)} HP
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Label>
                  </div>
                </RadioGroup>

                {/* HP Summary */}
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                  <p className="text-sm font-medium text-muted-foreground">HP Novo:</p>
                  <p className="text-2xl font-bold">
                    {currentHP.max} + {hpGain} = {currentHP.max + hpGain} HP
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ASI Step */}
        {step === 'asi' && grantsASI && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Ability Score Improvement
                </CardTitle>
                <CardDescription>Distribua 2 pontos entre seus atributos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Attributes */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Atributos Atuais:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(currentAttributes) as Array<keyof AbilityScores>).map((attr) => (
                      <div key={attr} className="rounded-md border bg-muted/50 p-2 text-center">
                        <p className="text-xs text-muted-foreground">{ABILITY_NAMES[attr]}</p>
                        <p className="text-lg font-bold">{currentAttributes[attr]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ability 1 */}
                <div className="space-y-2">
                  <Label>Primeiro Atributo</Label>
                  <div className="flex gap-2">
                    <Select
                      value={ability1}
                      onValueChange={(v) => setAbility1(v as keyof AbilityScores)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ABILITY_NAMES) as Array<keyof typeof ABILITY_NAMES>).map(
                          (attr) => (
                            <SelectItem key={attr} value={attr}>
                              {ABILITY_NAMES[attr]} ({currentAttributes[attr]})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <Select
                      value={ability1Increase.toString()}
                      onValueChange={(v) => {
                        setAbility1Increase(parseInt(v));
                        // Ajustar ability2Increase se necessário
                        const newVal = parseInt(v);
                        if (ability2 && newVal + ability2Increase !== 2) {
                          setAbility2Increase(2 - newVal);
                        }
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">+1</SelectItem>
                        <SelectItem value="2">+2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ability 2 (Optional) */}
                {ability1Increase < 2 && (
                  <div className="space-y-2">
                    <Label>Segundo Atributo (Opcional)</Label>
                    <div className="flex gap-2">
                      <Select
                        value={ability2}
                        onValueChange={(v) => {
                          setAbility2(v as keyof AbilityScores);
                          if (v && ability2Increase === 0) {
                            setAbility2Increase(2 - ability1Increase);
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {(Object.keys(ABILITY_NAMES) as Array<keyof typeof ABILITY_NAMES>)
                            .filter((attr) => attr !== ability1)
                            .map((attr) => (
                              <SelectItem key={attr} value={attr}>
                                {ABILITY_NAMES[attr]} ({currentAttributes[attr]})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {ability2 && (
                        <Select
                          value={ability2Increase.toString()}
                          onValueChange={(v) => setAbility2Increase(parseInt(v))}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">+1</SelectItem>
                            {ability1Increase === 0 && <SelectItem value="2">+2</SelectItem>}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                )}

                {/* Error */}
                {asiError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/20">
                    {asiError}
                  </div>
                )}

                {/* Preview */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Novos Atributos:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(newAttributes) as Array<keyof AbilityScores>).map((attr) => {
                      const changed = newAttributes[attr] !== currentAttributes[attr];
                      return (
                        <div
                          key={attr}
                          className={`rounded-md border p-2 text-center ${
                            changed
                              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                              : 'bg-muted/50'
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">{ABILITY_NAMES[attr]}</p>
                          <p className="text-lg font-bold">
                            {newAttributes[attr]}
                            {changed && (
                              <span className="ml-1 text-sm text-green-600">
                                (+{newAttributes[attr] - currentAttributes[attr]})
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Confirmar Level Up
                </CardTitle>
                <CardDescription>Revise as mudanças antes de confirmar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level */}
                <div className="flex justify-between rounded-lg border p-3">
                  <span className="font-medium">Nível:</span>
                  <span className="text-lg font-bold">
                    {currentLevel} → {newLevel}
                  </span>
                </div>

                {/* HP */}
                <div className="flex justify-between rounded-lg border p-3">
                  <span className="font-medium">HP Máximo:</span>
                  <span className="text-lg font-bold">
                    {currentHP.max} → {currentHP.max + hpGain}
                    <span className="ml-2 text-sm text-green-600">(+{hpGain})</span>
                  </span>
                </div>

                {/* Proficiency Bonus */}
                <div className="flex justify-between rounded-lg border p-3">
                  <span className="font-medium">Bônus Proficiência:</span>
                  <span className="text-lg font-bold">+{levelUpData.proficiencyBonus}</span>
                </div>

                {/* ASI Changes */}
                {grantsASI && (
                  <div className="rounded-lg border p-3">
                    <p className="mb-2 font-medium">Atributos Modificados:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(newAttributes) as Array<keyof AbilityScores>)
                        .filter((attr) => newAttributes[attr] !== currentAttributes[attr])
                        .map((attr) => (
                          <div key={attr} className="flex justify-between text-sm">
                            <span>{ABILITY_NAMES[attr]}:</span>
                            <span className="font-bold">
                              {currentAttributes[attr]} → {newAttributes[attr]}
                              <span className="ml-1 text-green-600">
                                (+{newAttributes[attr] - currentAttributes[attr]})
                              </span>
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 'hp' || isSaving}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {step === 'confirm' ? (
            <Button onClick={handleComplete} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Confirmar Level Up'}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={hpMethod === 'roll' && !hasRolled && step === 'hp'}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
