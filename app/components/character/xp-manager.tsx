'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Award, ArrowUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
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
import { LevelUpSummary } from './level-up-summary';
import { calculateModifier } from '@/lib/data/point-buy';
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
  const [isAddLevelDialogOpen, setIsAddLevelDialogOpen] = useState(false);
  const [xpToAdd, setXpToAdd] = useState('');
  const [levelsToAdd, setLevelsToAdd] = useState('1');
  const [isLevelUpSummaryOpen, setIsLevelUpSummaryOpen] = useState(false);
  const [isLevelUpWizardOpen, setIsLevelUpWizardOpen] = useState(false);
  const [levelsToGain, setLevelsToGain] = useState(1);
  const [pendingLevels, setPendingLevels] = useState(0);

  // Chave do localStorage para rastrear níveis pendentes
  const pendingLevelsKey = `pending-levels-${characterId}`;

  // Verificar se há níveis pendentes ao montar o componente
  useEffect(() => {
    const stored = localStorage.getItem(pendingLevelsKey);
    if (stored) {
      const pending = parseInt(stored);
      if (pending > 0) {
        setPendingLevels(pending);
        // Auto-abrir o resumo/wizard para o próximo nível (sempre processa 1 por vez)
        setLevelsToGain(1);
        setIsLevelUpSummaryOpen(true);
      }
    }
  }, [characterId, pendingLevelsKey]);

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

  // Adicionar níveis manualmente
  const handleAddLevels = () => {
    const levels = parseInt(levelsToAdd);
    if (isNaN(levels) || levels <= 0 || currentLevel + levels > 20) return;

    setLevelsToGain(levels);
    // Armazenar no localStorage
    localStorage.setItem(pendingLevelsKey, levels.toString());
    setPendingLevels(levels);
    setIsAddLevelDialogOpen(false);
    setIsLevelUpSummaryOpen(true);
  };

  // Iniciar Level Up (do botão "Subir de Nível!")
  const handleStartLevelUp = () => {
    setLevelsToGain(1);
    // Se não há níveis pendentes, é só 1 nível
    if (pendingLevels === 0) {
      localStorage.setItem(pendingLevelsKey, '1');
      setPendingLevels(1);
    }
    setIsLevelUpSummaryOpen(true);
  };

  // Continuar do resumo para o wizard
  const handleContinueFromSummary = () => {
    setIsLevelUpSummaryOpen(false);
    // Sempre processa 1 nível por vez no wizard
    setLevelsToGain(1);
    setIsLevelUpWizardOpen(true);
  };

  // Quando completa um nível no wizard
  const handleLevelComplete = () => {
    const remaining = pendingLevels - 1;

    if (remaining > 0) {
      // Atualizar localStorage com níveis restantes
      localStorage.setItem(pendingLevelsKey, remaining.toString());
    } else {
      // Limpar localStorage quando terminar
      localStorage.removeItem(pendingLevelsKey);
    }

    // Recarregar página para atualizar dados
    // O useEffect vai detectar níveis pendentes e reabrir automaticamente
    window.location.reload();
  };

  // Cancelar níveis pendentes
  const handleCancelPendingLevels = () => {
    localStorage.removeItem(pendingLevelsKey);
    setPendingLevels(0);
    setIsLevelUpSummaryOpen(false);
    setIsLevelUpWizardOpen(false);
  };

  const constitutionModifier = calculateModifier(currentAttributes.con);

  return (
    <>
      <div
        className={`glass-card rounded-2xl p-6 ${canLevel ? 'border-2 border-amber-400/50' : ''}`}
      >
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
                    canLevel
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-purple-600 to-violet-600'
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
              onClick={handleStartLevelUp}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
            >
              <Award className="mr-2 h-4 w-4" />
              Subir de Nível!
            </Button>
          )}

          {/* Botões de Adicionar */}
          <div className="grid grid-cols-2 gap-2">
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

            {/* Add Level Button */}
            <Dialog open={isAddLevelDialogOpen} onOpenChange={setIsAddLevelDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`w-full ${canLevel ? 'bg-white/10 hover:bg-white/20 text-white' : 'tab-purple'}`}
                  disabled={isSaving || currentLevel >= 20}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Adicionar Níveis
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Níveis</DialogTitle>
                  <DialogDescription>
                    Suba de nível diretamente sem ganhar XP (para ajustes ou correções)
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="levels-amount">Quantidade de Níveis</Label>
                    <Input
                      id="levels-amount"
                      type="number"
                      value={levelsToAdd}
                      onChange={(e) => setLevelsToAdd(e.target.value)}
                      placeholder="Ex: 1"
                      min="1"
                      max={20 - currentLevel}
                    />
                    <p className="text-xs text-gray-400">
                      Nível atual: {currentLevel} | Máximo: {20 - currentLevel} níveis
                    </p>
                  </div>

                  {/* Quick Amounts */}
                  <div className="space-y-2">
                    <Label>Valores Rápidos</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 5].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setLevelsToAdd(amount.toString())}
                          disabled={currentLevel + amount > 20}
                        >
                          +{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-gray-300">
                    <strong className="text-amber-300">⚠️ Atenção:</strong> Você verá um resumo das
                    mudanças antes de confirmar o level up.
                  </div>

                  <Button
                    onClick={handleAddLevels}
                    disabled={!levelsToAdd || isSaving}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    Ver Resumo de Mudanças
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Level Up Summary */}
        <LevelUpSummary
          characterClass={characterClass}
          currentLevel={currentLevel}
          levelsToGain={levelsToGain}
          remainingLevels={pendingLevels}
          constitutionModifier={constitutionModifier}
          open={isLevelUpSummaryOpen}
          onClose={handleCancelPendingLevels}
          onContinue={handleContinueFromSummary}
        />

        {/* Level Up Wizard */}
        <LevelUpWizard
          characterId={characterId}
          characterName={characterName}
          currentLevel={currentLevel}
          characterClass={characterClass}
          currentHP={currentHP}
          currentAttributes={currentAttributes}
          open={isLevelUpWizardOpen}
          onClose={handleCancelPendingLevels}
          onComplete={handleLevelComplete}
        />
      </div>
    </>
  );
}
