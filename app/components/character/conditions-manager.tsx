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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Condition,
  type ConditionType,
  CONDITION_DETAILS,
  activateCondition,
  deactivateCondition,
  updateExhaustionLevel,
  getActiveConditions,
} from '@/lib/data/conditions';

interface ConditionsManagerProps {
  characterId: string;
  initialConditions: Condition[];
}

export function ConditionsManager({ characterId, initialConditions }: ConditionsManagerProps) {
  const [conditions, setConditions] = useState<Condition[]>(initialConditions);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | null>(null);
  const [notes, setNotes] = useState('');
  const [exhaustionLevel, setExhaustionLevel] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeConditions = getActiveConditions(conditions);

  // Salvar no Supabase
  const saveConditions = async (newConditions: Condition[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ conditions: newConditions })
        .eq('id', characterId);

      if (error) throw error;
      setConditions(newConditions);
    } catch (err) {
      console.error('Erro ao salvar condições:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Ativar condição
  const handleActivateCondition = (type: ConditionType) => {
    if (type === 'exhaustion') {
      const newConditions = updateExhaustionLevel(conditions, exhaustionLevel);
      saveConditions(newConditions);
    } else {
      const newConditions = activateCondition(conditions, type, notes);
      saveConditions(newConditions);
    }
    setIsDialogOpen(false);
    setNotes('');
    setExhaustionLevel(1);
  };

  // Desativar condição
  const handleDeactivateCondition = (type: ConditionType) => {
    const newConditions = deactivateCondition(conditions, type);
    saveConditions(newConditions);
  };

  // Renderizar cartão de condição ativa
  const renderActiveCondition = (condition: Condition) => {
    const details = CONDITION_DETAILS[condition.type];

    return (
      <div
        key={condition.type}
        className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md"
      >
        {/* Barra colorida no topo */}
        <div className={`absolute left-0 top-0 h-1 w-full ${details.color}`} />

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{details.icon}</span>
              <div>
                <h4 className="font-semibold">{details.name}</h4>
                {condition.type === 'exhaustion' && condition.level && (
                  <Badge variant="destructive" className="mt-1">
                    Nível {condition.level}
                  </Badge>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">{details.description}</p>
            {condition.notes && (
              <p className="mt-2 rounded glass-card-light p-2 text-xs italic text-gray-400">{condition.notes}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeactivateCondition(condition.type)}
            disabled={isSaving}
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Renderizar opção de condição no dialog
  const renderConditionOption = (type: ConditionType) => {
    const details = CONDITION_DETAILS[type];
    const isActive = conditions.find((c) => c.type === type)?.active;

    if (isActive) return null;

    return (
      <button
        key={type}
        onClick={() => setSelectedCondition(type)}
        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:scale-[1.01] ${
          selectedCondition === type ? 'border-2 border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/50'
        }`}
      >
        <span className="text-2xl">{details.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-white">{details.name}</p>
          <p className="mt-1 text-xs text-gray-400">{details.description}</p>
        </div>
      </button>
    );
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
            <Button variant="outline" size="sm" disabled={isSaving}>
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

              <div className="space-y-4">
                {/* Lista de condições disponíveis */}
                <div className="grid gap-2">
                  {(Object.keys(CONDITION_DETAILS) as ConditionType[]).map(renderConditionOption)}
                </div>

                {/* Campos extras para condição selecionada */}
                {selectedCondition && (
                  <div className="space-y-4 glass-card-light rounded-lg border border-white/10 p-4">
                    <h4 className="font-medium text-white">
                      Configurar: {CONDITION_DETAILS[selectedCondition].name}
                    </h4>

                    {selectedCondition === 'exhaustion' && (
                      <div className="space-y-2">
                        <Label htmlFor="exhaustion-level">Nível de Exaustão (1-6)</Label>
                        <Input
                          id="exhaustion-level"
                          type="number"
                          min="1"
                          max="6"
                          value={exhaustionLevel}
                          onChange={(e) =>
                            setExhaustionLevel(
                              Math.max(1, Math.min(6, parseInt(e.target.value) || 1))
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="condition-notes">Notas (opcional)</Label>
                      <Input
                        id="condition-notes"
                        placeholder="Ex: Enfeitiçado por vampiro"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={() => handleActivateCondition(selectedCondition)}
                      disabled={isSaving}
                      className="w-full tab-purple"
                    >
                      Aplicar Condição
                    </Button>
                  </div>
                )}
              </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeConditions.length === 0 ? (
        <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 py-8 text-center text-sm">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-white">Nenhuma condição ativa</p>
        </div>
      ) : (
        <div className="grid gap-3">{activeConditions.map(renderActiveCondition)}</div>
      )}

      {/* Resumo rápido de efeitos */}
      {activeConditions.length > 0 && (
        <div className="glass-card-light rounded-lg border border-white/10 p-3 text-xs">
          <p className="mb-2 font-medium text-white">⚠️ Efeitos Ativos:</p>
          <ul className="space-y-1 text-gray-400">
            {activeConditions.map((condition) => (
              <li key={condition.type}>
                • <span className="font-medium text-white">{CONDITION_DETAILS[condition.type].name}</span>
                {condition.type === 'exhaustion' && condition.level && (
                  <span> (Nível {condition.level})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
