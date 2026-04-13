/**
 * Editor de Iniciativa
 * Permite editar o valor da Iniciativa manualmente
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Save, X, Loader2, Check, AlertCircle } from 'lucide-react';
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
import { formatModifier } from '@/lib/data/point-buy';

interface InitiativeEditorProps {
  characterId: string;
  initiative: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InitiativeEditor({
  characterId,
  initiative: initialInitiative,
  open,
  onOpenChange,
}: InitiativeEditorProps) {
  const router = useRouter();
  const [initiative, setInitiative] = useState(initialInitiative);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resetar quando abrir/fechar
  useEffect(() => {
    if (open) {
      setInitiative(initialInitiative);
      setError(null);
      setJustSaved(false);
    }
  }, [open, initialInitiative]);

  // Atualizar valor
  const updateInitiative = (value: number) => {
    // Permitir valores negativos e positivos (mínimo -10, máximo +20)
    const validValue = Math.max(-10, Math.min(20, value));
    setInitiative(validValue);
  };

  // Salvar no banco
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('characters')
        .update({ initiative })
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
      console.error('Erro ao salvar Iniciativa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = initiative !== initialInitiative;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Editar Iniciativa
          </DialogTitle>
          <DialogDescription>Ajuste manualmente o modificador de Iniciativa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Campo de Iniciativa */}
          <div className="rounded-xl glass-card-light p-6 border-2 border-purple-500/30">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Iniciativa</p>
                <Input
                  type="number"
                  min="-10"
                  max="20"
                  value={initiative}
                  onChange={(e) => updateInitiative(parseInt(e.target.value) || 0)}
                  disabled={isSaving}
                  className="text-center text-4xl font-bold h-20"
                />
                <p className="text-sm text-purple-300 mt-2 font-semibold">
                  {formatModifier(initiative)}
                </p>
              </div>

              {/* Botões de ajuste rápido */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateInitiative(initiative - 1)}
                  disabled={initiative <= -10 || isSaving}
                >
                  -1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateInitiative(initiative + 1)}
                  disabled={initiative >= 20 || isSaving}
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
                  <li>Iniciativa = modificador de Destreza</li>
                  <li>Talento Alerta adiciona +5 automaticamente</li>
                  <li>Ajuste manualmente para efeitos temporários ou magias</li>
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
              Iniciativa salva com sucesso! Atualizando página...
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
