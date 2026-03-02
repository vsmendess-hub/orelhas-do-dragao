'use client';

import { useState } from 'react';
import { Zap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { STANDARD_ACTIONS, BONUS_ACTIONS, type CombatAction } from '@/lib/data/combat-actions';

interface QuickActionsProps {
  characterClass?: string;
  onActionUsed?: (action: CombatAction) => void;
}

export function QuickActions({ characterClass, onActionUsed }: QuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);

  // Filtrar ações bônus disponíveis baseado na classe
  const getAvailableBonusActions = () => {
    if (!characterClass) return [];

    const actions: CombatAction[] = [];

    // Ação bônus universal
    actions.push(BONUS_ACTIONS.find((a) => a.type === 'offhand_attack')!);

    // Ações específicas por classe
    if (characterClass === 'Fighter') {
      actions.push(BONUS_ACTIONS.find((a) => a.type === 'second_wind')!);
    }

    if (characterClass === 'Rogue') {
      actions.push(BONUS_ACTIONS.find((a) => a.type === 'cunning_action')!);
    }

    if (characterClass === 'Monk') {
      actions.push(
        BONUS_ACTIONS.find((a) => a.type === 'flurry_of_blows')!,
        BONUS_ACTIONS.find((a) => a.type === 'patient_defense')!,
        BONUS_ACTIONS.find((a) => a.type === 'step_of_the_wind')!
      );
    }

    return actions.filter(Boolean);
  };

  const availableBonusActions = getAvailableBonusActions();

  const handleActionClick = (action: CombatAction) => {
    onActionUsed?.(action);
    setSelectedAction(action);
    setTimeout(() => setSelectedAction(null), 2000);
  };

  const renderActionButton = (action: CombatAction) => {
    const isSelected = selectedAction?.type === action.type;

    return (
      <Dialog key={action.type}>
        <div className="relative">
          <DialogTrigger asChild>
            <Button
              variant={isSelected ? 'default' : 'outline'}
              className={`h-auto flex-col gap-2 p-4 transition-all ${
                isSelected ? 'ring-2 ring-deep-purple' : ''
              }`}
              onClick={(e) => {
                // Se clicar com Shift, usa direto sem abrir dialog
                if (e.shiftKey) {
                  e.preventDefault();
                  handleActionClick(action);
                }
              }}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold">{action.name}</span>
              {action.cost && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {action.cost}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{action.icon}</span>
                {action.name}
              </DialogTitle>
              <DialogDescription>
                {action.category === 'action' ? 'Ação' : 'Ação Bônus'}
                {action.cost && ` • ${action.cost}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm">{action.description}</p>
              <Button onClick={() => handleActionClick(action)} className="w-full">
                Usar {action.name}
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Standard Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ações de Combate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {STANDARD_ACTIONS.map(renderActionButton)}
          </div>

          {/* Info */}
          <div className="mt-4 flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              <strong>Dica:</strong> Clique em uma ação para ver detalhes e usar. Segure Shift +
              Clique para usar diretamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Actions */}
      {availableBonusActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              Ações Bônus
              <Badge variant="secondary">Classe: {characterClass}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {availableBonusActions.map(renderActionButton)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Economy Info */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <h4 className="mb-3 text-sm font-semibold">📖 Economia de Ação:</h4>
          <div className="grid gap-2 text-xs md:grid-cols-3">
            <div className="rounded-md border bg-muted/50 p-3">
              <p className="mb-1 font-semibold text-foreground">Ação</p>
              <p className="text-muted-foreground">
                1 por turno. Use para Atacar, Conjurar Magia, Disparada, etc.
              </p>
            </div>
            <div className="rounded-md border bg-muted/50 p-3">
              <p className="mb-1 font-semibold text-foreground">Ação Bônus</p>
              <p className="text-muted-foreground">
                1 por turno (se disponível). Depende de características da classe.
              </p>
            </div>
            <div className="rounded-md border bg-muted/50 p-3">
              <p className="mb-1 font-semibold text-foreground">Movimento</p>
              <p className="text-muted-foreground">
                Use sua velocidade para se mover. Pode dividir antes/depois de ações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
