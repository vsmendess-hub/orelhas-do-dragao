'use client';

import { useState } from 'react';
import {
  Swords,
  Plus,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trash2,
  Heart,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  type Combat,
  type CombatantType,
  COMBATANT_TYPE_LABELS,
  COMBATANT_TYPE_COLORS,
  createCombatant,
  sortByInitiative,
  nextTurn,
  previousTurn,
  addCombatant,
  removeCombatant,
  updateCombatantHP,
  startCombat,
  resetCombat,
} from '@/lib/data/initiative';

interface InitiativeTrackerProps {
  characterName?: string;
  characterInitiative?: number;
  onSave?: (combat: Combat | null) => void;
}

export function InitiativeTracker({
  characterName,
  characterInitiative,
  onSave,
}: InitiativeTrackerProps) {
  const [combat, setCombat] = useState<Combat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formInitiative, setFormInitiative] = useState('');
  const [formType, setFormType] = useState<CombatantType>('enemy');
  const [formHP, setFormHP] = useState('');
  const [formAC, setFormAC] = useState('');

  // Atualizar e salvar
  const updateCombat = (newCombat: Combat | null) => {
    setCombat(newCombat);
    onSave?.(newCombat);
  };

  // Iniciar combate
  const handleStartCombat = () => {
    if (!characterName || characterInitiative === undefined) return;

    const playerCombatant = createCombatant(characterName, characterInitiative, 'player');
    const newCombat = startCombat([playerCombatant]);
    updateCombat(newCombat);
  };

  // Adicionar combatente
  const handleAddCombatant = () => {
    if (!combat || !formName || !formInitiative) return;

    const initiative = parseInt(formInitiative);
    const hp = formHP ? parseInt(formHP) : undefined;
    const ac = formAC ? parseInt(formAC) : undefined;

    const newCombatant = createCombatant(formName, initiative, formType, {
      hp: hp ? { current: hp, max: hp } : undefined,
      ac,
    });

    const newCombat = addCombatant(combat, newCombatant);
    updateCombat(newCombat);

    // Reset form
    setFormName('');
    setFormInitiative('');
    setFormHP('');
    setFormAC('');
    setIsDialogOpen(false);
  };

  // Remover combatente
  const handleRemoveCombatant = (combatantId: string) => {
    if (!combat) return;
    const newCombat = removeCombatant(combat, combatantId);
    updateCombat(newCombat);
  };

  // Próximo turno
  const handleNextTurn = () => {
    if (!combat) return;
    const newCombat = nextTurn(combat);
    updateCombat(newCombat);
  };

  // Turno anterior
  const handlePreviousTurn = () => {
    if (!combat) return;
    const newCombat = previousTurn(combat);
    updateCombat(newCombat);
  };

  // Atualizar HP
  const handleUpdateHP = (combatantId: string, change: number) => {
    if (!combat) return;
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant?.hp) return;

    const newCurrent = combatant.hp.current + change;
    const newCombat = updateCombatantHP(combat, combatantId, newCurrent);
    updateCombat(newCombat);
  };

  // Encerrar combate
  const handleEndCombat = () => {
    updateCombat(resetCombat());
  };

  // Se não tem combate ativo
  if (!combat) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Swords className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">Nenhum combate ativo</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Inicie um combate para rastrear iniciativa e turnos
          </p>
          <Button onClick={handleStartCombat} disabled={!characterName}>
            <Swords className="mr-2 h-4 w-4" />
            Iniciar Combate
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sortedCombatants = sortByInitiative(combat.combatants);
  const currentCombatant = sortedCombatants[combat.currentTurn];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-red-600" />
            Ordem de Iniciativa
            <Badge variant="secondary">Rodada {combat.round}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Combatente</DialogTitle>
                  <DialogDescription>
                    Adicione um novo combatente ao tracker de iniciativa
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="combatant-name">Nome *</Label>
                      <Input
                        id="combatant-name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Goblin 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="combatant-initiative">Iniciativa *</Label>
                      <Input
                        id="combatant-initiative"
                        type="number"
                        value={formInitiative}
                        onChange={(e) => setFormInitiative(e.target.value)}
                        placeholder="Ex: 15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="combatant-type">Tipo</Label>
                    <select
                      id="combatant-type"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as CombatantType)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {Object.entries(COMBATANT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="combatant-hp">HP</Label>
                      <Input
                        id="combatant-hp"
                        type="number"
                        value={formHP}
                        onChange={(e) => setFormHP(e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="combatant-ac">CA</Label>
                      <Input
                        id="combatant-ac"
                        type="number"
                        value={formAC}
                        onChange={(e) => setFormAC(e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddCombatant}
                    disabled={!formName || !formInitiative}
                    className="w-full"
                  >
                    Adicionar Combatente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleEndCombat}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Encerrar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Turn Controls */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <Button variant="outline" size="sm" onClick={handlePreviousTurn}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Turno Atual</p>
            <p className="text-lg font-bold">{currentCombatant?.name || '-'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleNextTurn}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Combatants List */}
        <div className="space-y-2">
          {sortedCombatants.map((combatant, index) => {
            const isCurrentTurn = index === combat.currentTurn;
            const isDead = combatant.hp && combatant.hp.current === 0;

            return (
              <div
                key={combatant.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                  isCurrentTurn
                    ? 'border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                    : ''
                } ${isDead ? 'opacity-50' : ''}`}
              >
                {/* Initiative Badge */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted font-bold">
                  {combatant.initiative}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{combatant.name}</p>
                    <Badge className={COMBATANT_TYPE_COLORS[combatant.type]}>
                      {COMBATANT_TYPE_LABELS[combatant.type]}
                    </Badge>
                    {isDead && <Badge variant="destructive">Morto</Badge>}
                  </div>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    {combatant.hp && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {combatant.hp.current}/{combatant.hp.max}
                      </div>
                    )}
                    {combatant.ac && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        CA {combatant.ac}
                      </div>
                    )}
                  </div>
                </div>

                {/* HP Controls */}
                {combatant.hp && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateHP(combatant.id, -1)}
                      disabled={combatant.hp.current === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateHP(combatant.id, 1)}
                      disabled={combatant.hp.current >= combatant.hp.max}
                    >
                      +
                    </Button>
                  </div>
                )}

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveCombatant(combatant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
