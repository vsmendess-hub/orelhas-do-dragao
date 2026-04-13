/**
 * Editor de Testes de Resistência
 * Permite ajustar manualmente os modificadores de salvaguardas
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Save, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';

interface SavingThrowsOverride {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}

interface SavingThrowsEditorProps {
  characterId: string;
  savingThrowsOverride: SavingThrowsOverride;
  modifiers: Record<string, number>;
  proficiencyBonus: number;
  savingThrowProficiencies: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

const ABILITY_ORDER: (keyof SavingThrowsOverride)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function SavingThrowsEditor({
  characterId,
  savingThrowsOverride: initialOverride,
  modifiers,
  proficiencyBonus,
  savingThrowProficiencies,
  open,
  onOpenChange,
}: SavingThrowsEditorProps) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<SavingThrowsOverride>(initialOverride);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetar quando abrir/fechar
  useEffect(() => {
    if (open) {
      setOverrides(initialOverride);
      setError(null);
      setJustSaved(false);
    }
  }, [open, initialOverride]);

  // Calcular valor base
  const getBaseValue = (attr: keyof SavingThrowsOverride): number => {
    const abilityName = ABILITY_NAMES[attr];
    const isProficient = savingThrowProficiencies.includes(abilityName);
    const modifier = modifiers[attr] || 0;
    return isProficient ? modifier + proficiencyBonus : modifier;
  };

  // Obter valor final (override ou base)
  const getFinalValue = (attr: keyof SavingThrowsOverride): number => {
    return overrides[attr] !== undefined ? overrides[attr]! : getBaseValue(attr);
  };

  // Atualizar override
  const updateOverride = (attr: keyof SavingThrowsOverride, value: number | undefined) => {
    if (value === undefined) {
      const newOverrides = { ...overrides };
      delete newOverrides[attr];
      setOverrides(newOverrides);
    } else {
      const validValue = Math.max(-10, Math.min(20, value));
      setOverrides({ ...overrides, [attr]: validValue });
    }
  };

  // Resetar para valor base
  const resetToBase = (attr: keyof SavingThrowsOverride) => {
    updateOverride(attr, undefined);
  };

  // Salvar no banco
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('characters')
        .update({ saving_throws_override: overrides })
        .eq('id', characterId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setJustSaved(true);

      // Aguardar um pouco para mostrar mensagem de sucesso
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Fechar dialog primeiro
      onOpenChange(false);

      // Pequeno delay para garantir que o dialog fechou
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Forçar refresh do router
      router.refresh();

      // Forçar re-render adicional após um pequeno delay
      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch (err) {
      console.error('Erro ao salvar resistências:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = JSON.stringify(overrides) !== JSON.stringify(initialOverride);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Editar Testes de Resistência
          </DialogTitle>
          <DialogDescription>
            Ajuste manualmente os modificadores dos testes de resistência. Deixe em branco para usar
            o cálculo automático.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Grid de Resistências */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABILITY_ORDER.map((attr) => {
              const abilityName = ABILITY_NAMES[attr];
              const isProficient = savingThrowProficiencies.includes(abilityName);
              const baseValue = getBaseValue(attr);
              const currentValue = getFinalValue(attr);
              const isOverridden = overrides[attr] !== undefined;
              const changed = isOverridden && overrides[attr] !== baseValue;

              return (
                <div
                  key={attr}
                  className={`rounded-xl p-4 transition-all ${
                    isProficient
                      ? changed
                        ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20 border-2 border-green-500/50'
                        : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50'
                      : changed
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50'
                        : 'glass-card-light border border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isProficient && (
                          <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                            ✓
                          </div>
                        )}
                        <div>
                          <p
                            className={`text-xs font-medium uppercase tracking-wide ${
                              isProficient ? 'text-blue-300' : 'text-gray-400'
                            }`}
                          >
                            {ABILITY_ABBREVIATIONS[attr]}
                          </p>
                          <p className="text-xs text-gray-500">{abilityName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isOverridden && <span className="text-xs text-amber-400">Manual</span>}
                        {!isOverridden && <span className="text-xs text-green-400">Auto</span>}
                      </div>
                    </div>

                    {/* Input e Valor Base */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          min="-10"
                          max="20"
                          value={isOverridden ? overrides[attr] : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateOverride(attr, val === '' ? undefined : parseInt(val) || 0);
                          }}
                          disabled={isSaving}
                          placeholder={formatModifier(baseValue)}
                          className="text-center text-xl font-bold h-12"
                        />
                        <p className="text-xs text-gray-400 text-center mt-1">
                          Base: {formatModifier(baseValue)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Final</p>
                        <p
                          className={`text-2xl font-bold ${
                            changed
                              ? 'text-amber-300'
                              : isProficient
                                ? 'text-blue-300'
                                : 'text-white'
                          }`}
                        >
                          {formatModifier(currentValue)}
                        </p>
                      </div>
                    </div>

                    {/* Botão de Reset */}
                    {isOverridden && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetToBase(attr)}
                        disabled={isSaving}
                        className="w-full text-xs"
                      >
                        Resetar para Auto
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Avisos */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 space-y-2">
                <p className="font-medium text-blue-300">ℹ️ Informação:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Valores com <span className="text-blue-300">✓</span> possuem proficiência
                  </li>
                  <li>
                    <span className="text-green-400">Auto</span> = calculado automaticamente
                    (atributo + prof)
                  </li>
                  <li>
                    <span className="text-amber-400">Manual</span> = valor ajustado manualmente
                  </li>
                  <li>Deixe em branco para usar cálculo automático</li>
                  <li>Use valores manuais para efeitos temporários, magias, etc.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="rounded-md glass-card-light border border-red-400/50 p-3 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Sucesso */}
          {justSaved && (
            <div className="rounded-md glass-card-light border border-green-400/50 p-3 text-sm text-green-300 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Testes de resistência salvos com sucesso! Atualizando página...
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || justSaved}
            className="tab-purple"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : justSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
