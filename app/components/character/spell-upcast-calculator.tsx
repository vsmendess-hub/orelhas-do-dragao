'use client';

import { useState } from 'react';
import { TrendingUp, Zap, Target, Clock, ArrowUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SpellSlotState } from '@/lib/data/spells';
import {
  getAvailableUpcastLevels,
  calculateUpcastCost,
  applyUpcastRules,
  getUpcastInfo,
  canBeUpcast,
  generateUpcastDescription,
  recommendUpcastLevel,
  type UpcastScaling,
} from '@/lib/data/spell-upcasting';

interface SpellUpcastCalculatorProps {
  spellId: string;
  spellName: string;
  spellLevel: number;
  spellSlots: SpellSlotState[];
  onCast?: (castAtLevel: number) => void;
}

const SCALING_ICONS: Record<UpcastScaling, React.ReactNode> = {
  'damage-per-level': <Zap className="h-4 w-4" />,
  'healing-per-level': <Zap className="h-4 w-4" />,
  'targets-per-level': <Target className="h-4 w-4" />,
  'duration-per-level': <Clock className="h-4 w-4" />,
  'range-per-level': <ArrowUp className="h-4 w-4" />,
  special: <TrendingUp className="h-4 w-4" />,
};

export function SpellUpcastCalculator({
  spellId,
  spellName,
  spellLevel,
  spellSlots,
  onCast,
}: SpellUpcastCalculatorProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(spellLevel);
  const [isOpen, setIsOpen] = useState(false);

  // Cantrips não podem ser upcast
  if (spellLevel === 0) {
    return null;
  }

  // Verificar se magia pode ser upcast
  if (!canBeUpcast(spellId, spellLevel)) {
    return null;
  }

  // Converter spell slots para formato disponível
  const availableSlots = spellSlots.reduce(
    (acc, slot) => {
      acc[slot.level] = { total: slot.total, used: slot.used };
      return acc;
    },
    {} as Record<number, { total: number; used: number }>
  );

  // Obter níveis disponíveis para upcast
  const availableLevels = getAvailableUpcastLevels(spellLevel, availableSlots);

  if (availableLevels.length === 0) {
    return null; // Sem slots disponíveis
  }

  // Obter informações de upcast
  const upcastInfo = getUpcastInfo(spellId);
  if (!upcastInfo) return null;

  // Calcular custo e efeitos do nível selecionado
  const cost = calculateUpcastCost(spellLevel, selectedLevel);
  const effects = cost.isUpcast ? applyUpcastRules(upcastInfo.rules, cost.levelsAbove) : [];

  // Recomendação
  const recommendation = recommendUpcastLevel(spellId, spellLevel, availableLevels);

  // Handler de conjuração
  const handleCast = () => {
    if (onCast) {
      onCast(selectedLevel);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Upcast
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Conjurar em Nível Superior</DialogTitle>
          <DialogDescription>
            {spellName} - Nível Base {spellLevel}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Level Selection */}
          <div className="space-y-2">
            <Label htmlFor="cast-level">Conjurar no Nível</Label>
            <Select
              value={selectedLevel.toString()}
              onValueChange={(v) => setSelectedLevel(parseInt(v))}
            >
              <SelectTrigger id="cast-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLevels.map((level) => {
                  const slot = availableSlots[level];
                  const remaining = slot.total - slot.used;
                  const isRecommended = level === recommendation.recommended;

                  return (
                    <SelectItem key={level} value={level.toString()}>
                      <div className="flex items-center justify-between gap-4">
                        <span>
                          Nível {level}
                          {level === spellLevel && ' (Base)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {remaining} slot{remaining !== 1 ? 's' : ''}
                          </Badge>
                          {isRecommended && (
                            <Badge variant="default" className="text-xs">
                              Recomendado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Recommendation */}
          {recommendation.recommended !== spellLevel && (
            <Card className="border-2 border-blue-500/50 bg-blue-500/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Sugestão</p>
                    <p className="text-sm text-muted-foreground">
                      Nível {recommendation.recommended}: {recommendation.reason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Effects Preview */}
          {cost.isUpcast && effects.length > 0 ? (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Efeitos do Upcast</Label>
              <div className="space-y-2">
                {effects.map((effect, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                          {SCALING_ICONS[effect.type]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{effect.effectDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Conjurando no nível base - sem bônus adicionais
              </p>
            </div>
          )}

          {/* Cost Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Custo de Conjuração</p>
                  <p className="text-xs text-muted-foreground">
                    Slot de magia de {selectedLevel}º nível
                  </p>
                </div>
                <Badge variant={cost.isUpcast ? 'default' : 'secondary'} className="text-lg">
                  {selectedLevel}º Nível
                </Badge>
              </div>
              {cost.isUpcast && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {cost.levelsAbove} nível{cost.levelsAbove !== 1 ? 'is' : ''} acima do base
                </p>
              )}
            </CardContent>
          </Card>

          {/* Full Description */}
          {cost.isUpcast && upcastInfo.rules.length > 0 && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-semibold mb-2">Regras de Upcast:</p>
              <ul className="space-y-1">
                {upcastInfo.rules.map((rule, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    • {rule.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            {onCast && (
              <Button onClick={handleCast}>
                <Zap className="mr-2 h-4 w-4" />
                Conjurar no {selectedLevel}º Nível
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Componente compacto para mostrar info de upcast inline
 */
interface UpcastBadgeProps {
  spellId: string;
  spellLevel: number;
}

export function UpcastBadge({ spellId, spellLevel }: UpcastBadgeProps) {
  if (spellLevel === 0 || !canBeUpcast(spellId, spellLevel)) {
    return null;
  }

  return (
    <Badge variant="outline" className="text-xs">
      <TrendingUp className="mr-1 h-3 w-3" />
      Upcast
    </Badge>
  );
}
