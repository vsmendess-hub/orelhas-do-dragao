/**
 * Editor de Bônus de Proficiência
 * Permite editar o valor do bônus de proficiência manualmente
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dices, Save, X, Loader2, Check, AlertCircle } from 'lucide-react';
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

interface ProficiencyEditorProps {
  characterId: string;
  proficiencyBonus: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProficiencyEditor({
  characterId,
  proficiencyBonus: initialProficiency,
  open,
  onOpenChange,
}: ProficiencyEditorProps) {
  const router = useRouter();
  const [proficiencyBonus, setProficiencyBonus] = useState(initialProficiency);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetar quando abrir/fechar
  useEffect(() => {
    if (open) {
      setProficiencyBonus(initialProficiency);
      setError(null);
      setJustSaved(false);
    }
  }, [open, initialProficiency]);

  // Atualizar valor
  const updateProficiency = (value: number) => {
    // Validar valor (mínimo +2, máximo +9 para níveis 1-20 + possíveis bônus)
    const validValue = Math.max(2, Math.min(12, value));
    setProficiencyBonus(validValue);
  };

  // Salvar no banco
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('characters')
        .update({ proficiency_bonus: proficiencyBonus })
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
      console.error('Erro ao salvar Proficiência:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = proficiencyBonus !== initialProficiency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-purple-400" />
            Editar Bônus de Proficiência
          </DialogTitle>
          <DialogDescription>
            Ajuste manualmente o bônus de proficiência do personagem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Campo de Proficiência */}
          <div className="rounded-xl glass-card-light p-6 border-2 border-purple-500/30">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                  Bônus de Proficiência
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-white">+</span>
                  <Input
                    type="number"
                    min="2"
                    max="12"
                    value={proficiencyBonus}
                    onChange={(e) => updateProficiency(parseInt(e.target.value) || 2)}
                    disabled={isSaving}
                    className="text-center text-4xl font-bold h-20 w-32"
                  />
                </div>
              </div>

              {/* Botões de ajuste rápido */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateProficiency(proficiencyBonus - 1)}
                  disabled={proficiencyBonus <= 2 || isSaving}
                >
                  -1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateProficiency(proficiencyBonus + 1)}
                  disabled={proficiencyBonus >= 12 || isSaving}
                >
                  +1
                </Button>
              </div>
            </div>
          </div>

          {/* Avisos */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 space-y-1">
                <p className="font-medium text-blue-300">ℹ️ Informação:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Bônus de proficiência por nível (PHB p.15)</li>
                  <li>Níveis 1-4: +2 | Níveis 5-8: +3</li>
                  <li>Níveis 9-12: +4 | Níveis 13-16: +5</li>
                  <li>Níveis 17-20: +6</li>
                  <li>Ajuste manualmente se necessário (itens mágicos, efeitos, etc.)</li>
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
              Bônus de proficiência salvo com sucesso! Atualizando página...
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
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
