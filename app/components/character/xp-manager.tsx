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
}

export function XPManager({
  characterId,
  characterName,
  characterClass,
  currentXP: initialXP,
  currentLevel,
  currentHP,
  currentAttributes,
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
      if (result.leveledUp) {
        // Recarregar página para atualizar nível
        window.location.reload();
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
    <>
      <div className={`glass-card rounded-2xl p-6 ${canLevel ? 'border-2 border-amber-400/50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Experiência
        </h3>
        {canLevel && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 font-semibold shadow-lg">
            <Award className="h-3 w-3" />
            Pode subir de nível!
          </span>
        )}
      </div>
      <div className="space-y-4">
        {/* Current XP */}
        <div className="text-center">
          <p className="text-sm text-gray-400">XP Atual</p>
          <p className="text-3xl font-bold text-white">{formatXP(currentXP)}</p>
        </div>

        {/* Progress Bar */}
        {currentLevel < 20 && (
          <div>
            <div className="mb-2 flex justify-between text-xs text-gray-400">
              <span>Nível {currentLevel}</span>
              <span>Nível {currentLevel + 1}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all duration-300 ${
                  canLevel ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-purple-600 to-violet-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-center text-xs text-gray-300">
              {canLevel ? (
                <span className="font-semibold text-amber-400">Pronto para subir de nível!</span>
              ) : (
                <span>
                  Faltam {formatXP(xpNeeded)} XP para o nível {currentLevel + 1}
                </span>
              )}
            </div>
          </div>
        )}

        {currentLevel === 20 && (
          <div className="rounded-lg glass-card-light border border-amber-400/50 p-3 text-center text-sm text-amber-300 font-semibold">
            🏆 Nível Máximo Alcançado!
          </div>
        )}

        {/* XP Range */}
        <div className="rounded-lg glass-card-light p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Nível {currentLevel}:</span>
            <span className="font-medium text-white">{formatXP(currentLevelXP)} XP</span>
          </div>
          {currentLevel < 20 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Nível {currentLevel + 1}:</span>
              <span className="font-medium text-white">{formatXP(nextLevelXP)} XP</span>
            </div>
          )}
        </div>

        {/* Level Up Button */}
        {canLevel && (
          <Button
            onClick={() => setIsLevelUpWizardOpen(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
          >
            <Award className="mr-2 h-4 w-4" />
            Subir de Nível!
          </Button>
        )}

        {/* Add XP Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={`w-full ${canLevel ? 'bg-white/10 hover:bg-white/20 text-white' : 'tab-purple'}`}
              disabled={isSaving}
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
      </div>

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
          window.location.reload();
        }}
      />
      </div>
    </>
  );
}
