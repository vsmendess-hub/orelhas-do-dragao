'use client';

import { useState } from 'react';
import { TrendingUp, Plus, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
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
  calculateXPProgress,
  canLevelUp,
  getXPForCurrentLevel,
  getXPForNextLevel,
  formatXP,
  addExperience,
} from '@/lib/data/experience';
import { LevelUpWizard } from './level-up-wizard';
import type { AbilityScores } from '@/lib/data/level-up';

interface XPManagerProps {
  characterId: string;
  characterName: string;
  characterClass: string;
  currentXP: number;
  currentLevel: number;
  currentHP: { current: number; max: number };
  currentAttributes: AbilityScores;
  onLevelUp?: () => void;
}

export function XPManager({
  characterId,
  characterName,
  characterClass,
  currentXP: initialXP,
  currentLevel,
  currentHP,
  currentAttributes,
  onLevelUp,
}: XPManagerProps) {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [xpToAdd, setXpToAdd] = useState('');
  const [isLevelUpWizardOpen, setIsLevelUpWizardOpen] = useState(false);

  const progress = calculateXPProgress(currentXP, currentLevel);
  const canLevel = canLevelUp(currentXP, currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const xpNeeded = nextLevelXP - currentXP;

  // Salvar XP no Supabase
  const saveXP = async (newXP: number) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ experience_points: newXP })
        .eq('id', characterId);

      if (error) throw error;

      setCurrentXP(newXP);

      // Verificar se subiu de nível
      const result = addExperience(currentXP, newXP - currentXP, currentLevel);
      if (result.leveledUp && onLevelUp) {
        onLevelUp();
      }
    } catch (err) {
      console.error('Erro ao salvar XP:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar XP
  const handleAddXP = () => {
    const xp = parseInt(xpToAdd);
    if (isNaN(xp) || xp <= 0) return;

    const newXP = currentXP + xp;
    saveXP(newXP);
    setXpToAdd('');
    setIsDialogOpen(false);
  };

  return (
    <Card className={canLevel ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Experiência
          </CardTitle>
          {canLevel && (
            <Badge className="bg-amber-600">
              <Award className="mr-1 h-3 w-3" />
              Pode subir de nível!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current XP */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">XP Atual</p>
          <p className="text-3xl font-bold">{formatXP(currentXP)}</p>
        </div>

        {/* Progress Bar */}
        {currentLevel < 20 && (
          <div>
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Nível {currentLevel}</span>
              <span>Nível {currentLevel + 1}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-300 ${
                  canLevel ? 'bg-amber-500' : 'bg-deep-purple'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              {canLevel ? (
                <span className="font-semibold text-amber-600">Pronto para subir de nível!</span>
              ) : (
                <span>
                  Faltam {formatXP(xpNeeded)} XP para o nível {currentLevel + 1}
                </span>
              )}
            </div>
          </div>
        )}

        {currentLevel === 20 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
            🏆 Nível Máximo Alcançado!
          </div>
        )}

        {/* XP Range */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nível {currentLevel}:</span>
            <span className="font-medium">{formatXP(currentLevelXP)} XP</span>
          </div>
          {currentLevel < 20 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nível {currentLevel + 1}:</span>
              <span className="font-medium">{formatXP(nextLevelXP)} XP</span>
            </div>
          )}
        </div>

        {/* Level Up Button */}
        {canLevel && (
          <Button
            onClick={() => setIsLevelUpWizardOpen(true)}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            <Award className="mr-2 h-4 w-4" />
            Subir de Nível!
          </Button>
        )}

        {/* Add XP Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              disabled={isSaving}
              variant={canLevel ? 'outline' : 'default'}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar XP
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Experiência</DialogTitle>
              <DialogDescription>
                Adicione pontos de experiência ganhos em sua última sessão
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="xp-amount">Quantidade de XP</Label>
                <Input
                  id="xp-amount"
                  type="number"
                  value={xpToAdd}
                  onChange={(e) => setXpToAdd(e.target.value)}
                  placeholder="Ex: 500"
                  min="1"
                />
              </div>

              {/* Quick Amounts */}
              <div className="space-y-2">
                <Label>Valores Rápidos</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setXpToAdd(amount.toString())}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddXP} disabled={!xpToAdd || isSaving} className="w-full">
                Adicionar XP
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* Level Up Wizard */}
      <LevelUpWizard
        characterId={characterId}
        characterName={characterName}
        currentLevel={currentLevel}
        characterClass={characterClass}
        currentHP={currentHP}
        currentAttributes={currentAttributes}
        open={isLevelUpWizardOpen}
        onClose={() => setIsLevelUpWizardOpen(false)}
        onComplete={() => {
          setIsLevelUpWizardOpen(false);
          if (onLevelUp) onLevelUp();
        }}
      />
    </Card>
  );
}
