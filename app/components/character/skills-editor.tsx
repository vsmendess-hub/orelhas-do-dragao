/**
 * Editor de Perícias
 * Permite ajustar manualmente os modificadores das perícias
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Save, X, Loader2, Check, AlertCircle, RotateCcw } from 'lucide-react';
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

interface SkillWithBonus {
  id: string;
  name: string;
  attribute: string;
  isProficient: boolean;
  hasExpertise: boolean;
  baseBonus: number;
  finalBonus: number;
  isOverridden: boolean;
}

interface SkillOverride {
  [skillId: string]: number;
}

interface SkillsEditorProps {
  characterId: string;
  allSkills: SkillWithBonus[];
  proficiencyBonus: number;
  skillOverrides: SkillOverride;
  modifiers: Record<string, number>;
  proficientSkills: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ABILITY_ABBREVIATIONS: Record<string, string> = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
};

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function SkillsEditor({
  characterId,
  allSkills,
  proficiencyBonus,
  skillOverrides: initialOverrides,
  modifiers,
  proficientSkills,
  open,
  onOpenChange,
}: SkillsEditorProps) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<SkillOverride>(initialOverrides);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetar quando abrir/fechar
  useEffect(() => {
    if (open) {
      setOverrides(initialOverrides);
      setError(null);
      setJustSaved(false);
    }
  }, [open, initialOverrides]);

  // Atualizar override
  const updateOverride = (skillId: string, value: number | undefined) => {
    if (value === undefined) {
      const newOverrides = { ...overrides };
      delete newOverrides[skillId];
      setOverrides(newOverrides);
    } else {
      const validValue = Math.max(-10, Math.min(20, value));
      setOverrides({ ...overrides, [skillId]: validValue });
    }
  };

  // Resetar para valor base
  const resetToBase = (skillId: string) => {
    updateOverride(skillId, undefined);
  };

  // Resetar todas
  const resetAll = () => {
    setOverrides({});
  };

  // Salvar no banco
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('characters')
        .update({ skill_overrides: overrides })
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
      console.error('Erro ao salvar perícias:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = JSON.stringify(overrides) !== JSON.stringify(initialOverrides);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Editar Perícias
          </DialogTitle>
          <DialogDescription>
            Ajuste manualmente os modificadores das perícias. Deixe em branco para usar o cálculo
            automático.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Botão Resetar Tudo */}
          {Object.keys(overrides).length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAll}
                disabled={isSaving}
                className="text-amber-400 hover:text-amber-300"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Resetar Todas
              </Button>
            </div>
          )}

          {/* Grid de Perícias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allSkills.map((skill) => {
              const currentValue =
                overrides[skill.id] !== undefined ? overrides[skill.id] : skill.baseBonus;
              const isOverridden = overrides[skill.id] !== undefined;
              const changed = isOverridden && overrides[skill.id] !== skill.baseBonus;

              return (
                <div
                  key={skill.id}
                  className={`rounded-xl p-3 transition-all ${
                    skill.isProficient
                      ? changed
                        ? 'bg-gradient-to-br from-green-500/20 to-purple-500/20 border-2 border-green-500/50'
                        : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50'
                      : changed
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50'
                        : 'glass-card-light border border-white/10'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Badge proficiente/expertise */}
                        {skill.isProficient && (
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                              skill.hasExpertise
                                ? 'bg-yellow-500/30 text-yellow-300'
                                : 'bg-purple-500/30 text-purple-300'
                            }`}
                          >
                            {skill.hasExpertise ? '★' : '✓'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              skill.isProficient ? 'text-purple-100' : 'text-gray-300'
                            }`}
                          >
                            {skill.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ABILITY_ABBREVIATIONS[skill.attribute]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isOverridden && <span className="text-xs text-amber-400">Manual</span>}
                        {!isOverridden && <span className="text-xs text-green-400">Auto</span>}
                      </div>
                    </div>

                    {/* Input e Valor */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          min="-10"
                          max="20"
                          value={isOverridden ? overrides[skill.id] : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateOverride(skill.id, val === '' ? undefined : parseInt(val) || 0);
                          }}
                          disabled={isSaving}
                          placeholder={formatModifier(skill.baseBonus)}
                          className="text-center text-base font-bold h-10"
                        />
                        <p className="text-xs text-gray-400 text-center mt-1">
                          Base: {formatModifier(skill.baseBonus)}
                        </p>
                      </div>
                      <div className="text-center min-w-[50px]">
                        <p className="text-xs text-gray-400 mb-1">Final</p>
                        <p
                          className={`text-xl font-bold ${
                            changed
                              ? 'text-amber-300'
                              : skill.isProficient
                                ? 'text-purple-300'
                                : 'text-gray-400'
                          }`}
                        >
                          {formatModifier(currentValue)}
                        </p>
                      </div>
                    </div>

                    {/* Botão Reset */}
                    {isOverridden && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetToBase(skill.id)}
                        disabled={isSaving}
                        className="w-full text-xs h-7"
                      >
                        Resetar
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
                    <span className="text-purple-300">✓</span> = Proficiente (mod. atributo +{' '}
                    {proficiencyBonus})
                  </li>
                  <li>
                    <span className="text-yellow-300">★</span> = Especialista (mod. atributo +{' '}
                    {proficiencyBonus * 2})
                  </li>
                  <li>
                    <span className="text-green-400">Auto</span> = calculado automaticamente
                  </li>
                  <li>
                    <span className="text-amber-400">Manual</span> = valor ajustado manualmente
                  </li>
                  <li>Deixe em branco para usar cálculo automático</li>
                  <li>Use valores manuais para efeitos temporários, magias, itens, etc.</li>
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
              Perícias salvas com sucesso! Atualizando página...
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
