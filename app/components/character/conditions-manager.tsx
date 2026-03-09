'use client';

import { useState } from 'react';
import { AlertCircle, X, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  type Condition,
  type ConditionType,
  CONDITION_DETAILS,
  EMPTY_CONDITIONS,
} from '@/lib/data/conditions';

interface ConditionsManagerProps {
  characterId: string;
  initialConditions: Condition[];
}

export function ConditionsManager({ characterId, initialConditions }: ConditionsManagerProps) {
  // Começar sempre com EMPTY_CONDITIONS e mesclar com as ativas
  const [conditions, setConditions] = useState<Condition[]>(() => {
    if (!initialConditions || initialConditions.length === 0) {
      return EMPTY_CONDITIONS;
    }

    // Mesclar: começar com todas inativas, aplicar as ativas
    return EMPTY_CONDITIONS.map((empty) => {
      const saved = initialConditions.find((c) => c.type === empty.type);
      return saved || empty;
    });
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | null>(null);

  const activeConditions = conditions.filter((c) => c.active);

  const handleAdd = async () => {
    if (!selectedCondition) return;

    // Adicionar condição na UI
    const newConditions = conditions.map((c) =>
      c.type === selectedCondition ? { ...c, active: true } : c
    );
    setConditions(newConditions);

    // Fechar dialog
    setIsDialogOpen(false);
    setSelectedCondition(null);

    // Salvar no banco (apenas condições ativas)
    try {
      const supabase = createClient();
      const activeOnly = newConditions.filter((c) => c.active);

      // NÃO usar .select() - isso evita re-fetch que causa loop
      const { error } = await supabase
        .from('characters')
        .update({ conditions: activeOnly })
        .eq('id', characterId);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar condição');
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleRemove = async (type: ConditionType) => {
    // Remover condição da UI
    const newConditions = conditions.map((c) => (c.type === type ? { ...c, active: false } : c));
    setConditions(newConditions);

    // Salvar no banco (apenas condições ativas)
    try {
      const supabase = createClient();
      const activeOnly = newConditions.filter((c) => c.active);

      // NÃO usar .select() - isso evita re-fetch que causa loop
      const { error } = await supabase
        .from('characters')
        .update({ conditions: activeOnly })
        .eq('id', characterId);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar condição');
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Condições
          {activeConditions.length > 0 && (
            <Badge variant="secondary">{activeConditions.length}</Badge>
          )}
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Condição</DialogTitle>
              <DialogDescription>
                Selecione uma condição para aplicar ao personagem
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2 max-h-[50vh] overflow-y-auto">
              {(Object.keys(CONDITION_DETAILS) as ConditionType[])
                .filter((type) => !conditions.find((c) => c.type === type && c.active))
                .map((type) => {
                  const details = CONDITION_DETAILS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedCondition(type)}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                        selectedCondition === type
                          ? 'border-2 border-purple-500 bg-purple-500/10'
                          : 'border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <span className="text-2xl">{details.icon}</span>
                      <div>
                        <p className="font-medium text-white">{details.name}</p>
                        <p className="text-xs text-gray-400">{details.description}</p>
                      </div>
                    </button>
                  );
                })}
            </div>

            {selectedCondition && (
              <Button onClick={handleAdd} className="w-full">
                Aplicar Condição
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {activeConditions.length === 0 ? (
        <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 py-8 text-center text-sm">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-white">Nenhuma condição ativa</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {activeConditions.map((condition) => {
            const details = CONDITION_DETAILS[condition.type];
            return (
              <div
                key={condition.type}
                className="group relative overflow-hidden rounded-lg border bg-card p-4"
              >
                <div className={`absolute left-0 top-0 h-1 w-full ${details.color}`} />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{details.icon}</span>
                      <h4 className="font-semibold">{details.name}</h4>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{details.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(condition.type)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
