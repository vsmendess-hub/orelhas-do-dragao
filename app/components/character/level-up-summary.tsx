/**
 * Modal de Resumo de Level Up
 * Mostra bullets com todas as mudanças antes de entrar no wizard
 */

'use client';

import { Award, ArrowRight, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { calculateMultiLevelChanges, formatLevelChanges } from '@/lib/data/level-up-changes';

interface LevelUpSummaryProps {
  characterClass: string;
  currentLevel: number;
  levelsToGain: number;
  remainingLevels?: number; // Total de níveis ainda pendentes no fluxo multi-level
  constitutionModifier: number;
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function LevelUpSummary({
  characterClass,
  currentLevel,
  levelsToGain,
  remainingLevels,
  constitutionModifier,
  open,
  onClose,
  onContinue,
}: LevelUpSummaryProps) {
  // Calcular mudanças:
  // - Se remainingLevels > 1 e levelsToGain > 1: é primeira vez, mostra todos
  // - Caso contrário: mostra só 1 (continuação ou single level)
  const isInitialMultiLevel = remainingLevels && remainingLevels > 1 && levelsToGain > 1;
  const levelsToShow = isInitialMultiLevel ? levelsToGain : 1;

  const changes = calculateMultiLevelChanges(
    currentLevel,
    levelsToShow,
    characterClass,
    constitutionModifier
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-amber-400" />
            Subir para Nível {currentLevel + 1}!
            {remainingLevels && remainingLevels > 1 && (
              <span className="text-base text-amber-300 font-normal">
                ({remainingLevels - 1} níveis restantes após este)
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Aqui estão as mudanças que ocorrerão ao subir de nível:
            {remainingLevels && remainingLevels > 1 && (
              <span className="block mt-1 text-amber-300">
                ⚠️ Processando 1 nível por vez - após completar este, o próximo abrirá
                automaticamente.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {changes.map((change) => (
            <div
              key={change.level}
              className="rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5"
            >
              {/* Header do Nível */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  Nível {change.level}
                </h3>
                {change.changes.asi && (
                  <span className="rounded-lg bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-300 border border-amber-500/50">
                    ⭐ ASI Disponível
                  </span>
                )}
              </div>

              {/* Bullets de Mudanças */}
              <div className="space-y-2">
                {formatLevelChanges(change).map((bullet, bulletIndex) => {
                  // Parsear markdown simples **texto**
                  const parts = bullet.split(/\*\*(.*?)\*\*/g);

                  return (
                    <div key={bulletIndex} className="flex items-start gap-2 text-sm text-gray-200">
                      <span className="mt-0.5">•</span>
                      <span className="flex-1">
                        {parts.map((part, i) => {
                          // Índices ímpares são os textos dentro de **
                          if (i % 2 === 1) {
                            return (
                              <strong key={i} className="text-white font-semibold">
                                {part}
                              </strong>
                            );
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Features especiais */}
              {change.changes.subclassChoice && (
                <div className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                  <p className="text-xs font-semibold text-blue-300 mb-1">🎓 Escolha Importante:</p>
                  <p className="text-sm text-gray-300">
                    {change.changes.subclassChoice.description}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Resumo Total - só mostra se for fluxo inicial de múltiplos níveis */}
          {isInitialMultiLevel && (
            <div className="rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 p-5">
              <h4 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Resumo Total
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass-card-light rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">HP Médio Total</p>
                  <p className="text-2xl font-bold text-white">
                    +{changes.reduce((sum, c) => sum + c.changes.hp.averageGain, 0)}
                  </p>
                </div>
                <div className="glass-card-light rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">ASIs Disponíveis</p>
                  <p className="text-2xl font-bold text-white">
                    {changes.filter((c) => c.changes.asi).length}
                  </p>
                </div>
                <div className="glass-card-light rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Novas Features</p>
                  <p className="text-2xl font-bold text-white">
                    {changes.reduce((sum, c) => sum + c.changes.features.length, 0)}
                  </p>
                </div>
                <div className="glass-card-light rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Prof. Final</p>
                  <p className="text-2xl font-bold text-white">
                    +{changes[changes.length - 1].changes.proficiencyBonus.new}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aviso */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">ℹ️ Nota:</strong> Após clicar em
              &quot;Continuar&quot;, você entrará no processo de level up onde poderá escolher como
              ganhar HP (rolar ou usar média) e fazer escolhas de ASI/Talento.
              {remainingLevels && remainingLevels > 1 && (
                <>
                  {' '}
                  <strong className="text-amber-300">O sistema processa 1 nível por vez</strong> -
                  após completar este nível, a página recarregará e o próximo nível abrirá
                  automaticamente até completar todos os {remainingLevels} níveis.
                </>
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
          >
            Continuar para Level Up
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
