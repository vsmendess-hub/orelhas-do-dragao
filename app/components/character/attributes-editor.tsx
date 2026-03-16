/**
 * Editor de Atributos
 * Permite editar valores de atributos e recalcula automaticamente os modificadores
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Save, X, Loader2, Check, AlertCircle } from 'lucide-react';
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
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import { recalculateCharacterStats } from '@/app/actions/recalculate-character-stats';

interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface AttributesEditorProps {
  characterId: string;
  attributes: Attributes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHP: {
    current: number;
    max: number;
    temp: number;
  };
  characterLevel: number;
  proficiencyBonus: number;
  weaponProficiencies: string[];
  armorProficiencies: string[];
  feats?: Array<{ featId: string; name: string }>;
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

const ABILITY_ORDER: (keyof Attributes)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function AttributesEditor({
  characterId,
  attributes: initialAttributes,
  open,
  onOpenChange,
  currentHP,
  characterLevel,
  proficiencyBonus,
  weaponProficiencies,
  armorProficiencies,
  feats = [],
}: AttributesEditorProps) {
  const router = useRouter();
  const [attributes, setAttributes] = useState<Attributes>(initialAttributes);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetar quando abrir/fechar
  useEffect(() => {
    if (open) {
      setAttributes(initialAttributes);
      setError(null);
      setJustSaved(false);
    }
  }, [open, initialAttributes]);

  // Atualizar um atributo
  const updateAttribute = (attr: keyof Attributes, value: number) => {
    // Validar valor (1-30 é o range normal do D&D 5e)
    const validValue = Math.max(1, Math.min(30, value));
    setAttributes({ ...attributes, [attr]: validValue });
  };

  // Salvar no banco
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Usar server action para recalcular TODOS os stats
      const result = await recalculateCharacterStats({
        characterId,
        newAttributes: attributes,
        currentHP,
        characterLevel,
        oldAttributes: initialAttributes,
        proficiencyBonus,
        weaponProficiencies,
        armorProficiencies,
        feats,
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar alterações');
      }

      setJustSaved(true);

      // Aguardar um pouco para mostrar mensagem de sucesso
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Fechar dialog primeiro
      onOpenChange(false);

      // Pequeno delay para garantir que o dialog fechou
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Forçar refresh do router - isso re-fetcha os dados do servidor
      router.refresh();

      // Forçar re-render adicional após um pequeno delay
      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch (err) {
      console.error('Erro ao salvar atributos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = JSON.stringify(attributes) !== JSON.stringify(initialAttributes);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Atributos</DialogTitle>
          <DialogDescription>
            Ajuste os valores dos atributos. Os modificadores e todos os cálculos dependentes serão
            atualizados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Grid de Atributos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABILITY_ORDER.map((attr) => {
              const value = attributes[attr];
              const modifier = calculateModifier(value);
              const initialValue = initialAttributes[attr];
              const changed = value !== initialValue;

              return (
                <div
                  key={attr}
                  className={`rounded-xl p-4 transition-all ${
                    changed
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50'
                      : 'glass-card-light border border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {ABILITY_ABBREVIATIONS[attr]}
                        </p>
                        <p className="text-sm text-gray-500">{ABILITY_NAMES[attr]}</p>
                      </div>
                      {changed && <span className="text-xs text-blue-400">Alterado</span>}
                    </div>

                    {/* Input e Modificador */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={value}
                          onChange={(e) => updateAttribute(attr, parseInt(e.target.value) || 1)}
                          disabled={isSaving}
                          className="text-center text-2xl font-bold h-14"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Mod</p>
                        <p
                          className={`text-2xl font-bold ${
                            changed ? 'text-blue-300' : 'text-white'
                          }`}
                        >
                          {formatModifier(modifier)}
                        </p>
                      </div>
                    </div>

                    {/* Botões de ajuste rápido */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAttribute(attr, value - 1)}
                        disabled={value <= 1 || isSaving}
                        className="flex-1"
                      >
                        -1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAttribute(attr, value + 1)}
                        disabled={value >= 30 || isSaving}
                        className="flex-1"
                      >
                        +1
                      </Button>
                    </div>
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
                <p className="font-medium text-blue-300">⚠️ Atenção:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Os modificadores são calculados automaticamente (PHB p.13)</li>
                  <li>
                    <strong className="text-green-400">Pontos de vida máximos</strong> serão
                    recalculados se Constituição mudar (PHB p.15)
                  </li>
                  <li>
                    <strong className="text-green-400">Classe de Armadura</strong> será recalculada
                    com o novo modificador de Destreza (inclui armadura + escudo)
                  </li>
                  <li>
                    <strong className="text-green-400">Iniciativa</strong> será recalculada com o
                    novo modificador de Destreza (inclui +5 se tiver Alerta)
                  </li>
                  <li>Testes de Resistência serão atualizados</li>
                  <li>Perícias que usam estes atributos serão recalculadas</li>
                  <li>Ataques de armas serão atualizados (força/destreza)</li>
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
              Atributos salvos com sucesso! Atualizando página...
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
