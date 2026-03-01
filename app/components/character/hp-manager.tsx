'use client';

import { useState } from 'react';
import { Heart, Plus, Minus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}

interface HPManagerProps {
  characterId: string;
  hitPoints: HitPoints;
}

export function HPManager({ characterId, hitPoints: initialHitPoints }: HPManagerProps) {
  const [hitPoints, setHitPoints] = useState<HitPoints>(initialHitPoints);
  const [damageAmount, setDamageAmount] = useState<string>('');
  const [healAmount, setHealAmount] = useState<string>('');
  const [tempHPAmount, setTempHPAmount] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular porcentagem de HP
  const hpPercentage = (hitPoints.current / hitPoints.max) * 100;

  // Cor da barra de HP baseada na porcentagem
  const getHPColor = () => {
    if (hpPercentage >= 75) return 'bg-green-500';
    if (hpPercentage >= 50) return 'bg-yellow-500';
    if (hpPercentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Salvar HP no Supabase
  const saveHP = async (newHitPoints: HitPoints) => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ hit_points: newHitPoints })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setHitPoints(newHitPoints);
    } catch (err) {
      console.error('Erro ao salvar HP:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Aplicar dano
  const applyDamage = () => {
    const damage = parseInt(damageAmount);
    if (isNaN(damage) || damage <= 0) return;

    let newCurrent = hitPoints.current;
    let newTemp = hitPoints.temporary;

    // Primeiro, aplicar dano no HP temporário
    if (newTemp > 0) {
      if (damage >= newTemp) {
        // Dano maior que HP temporário
        const remainingDamage = damage - newTemp;
        newTemp = 0;
        newCurrent = Math.max(0, newCurrent - remainingDamage);
      } else {
        // Dano menor que HP temporário
        newTemp -= damage;
      }
    } else {
      // Sem HP temporário, aplicar direto no HP atual
      newCurrent = Math.max(0, newCurrent - damage);
    }

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: newTemp,
    });

    setDamageAmount('');
  };

  // Aplicar cura
  const applyHealing = () => {
    const healing = parseInt(healAmount);
    if (isNaN(healing) || healing <= 0) return;

    const newCurrent = Math.min(hitPoints.max, hitPoints.current + healing);

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: hitPoints.temporary,
    });

    setHealAmount('');
  };

  // Definir HP temporário
  const setTempHP = () => {
    const tempHP = parseInt(tempHPAmount);
    if (isNaN(tempHP) || tempHP < 0) return;

    // HP temporário não se acumula, pega o maior valor
    const newTemp = Math.max(hitPoints.temporary, tempHP);

    saveHP({
      current: hitPoints.current,
      max: hitPoints.max,
      temporary: newTemp,
    });

    setTempHPAmount('');
  };

  // Ajuste rápido (+1/-1)
  const quickAdjust = (amount: number) => {
    let newCurrent = hitPoints.current + amount;
    newCurrent = Math.max(0, Math.min(hitPoints.max, newCurrent));

    saveHP({
      current: newCurrent,
      max: hitPoints.max,
      temporary: hitPoints.temporary,
    });
  };

  // Descanso curto (não recupera HP, mas pode ser usado para outras mecânicas)
  const shortRest = () => {
    // Para um descanso curto, normalmente se usa dados de vida
    // Por enquanto, vamos apenas resetar HP temporário
    if (hitPoints.temporary > 0) {
      saveHP({
        current: hitPoints.current,
        max: hitPoints.max,
        temporary: 0,
      });
    }
  };

  // Descanso longo (recupera todo HP)
  const longRest = () => {
    saveHP({
      current: hitPoints.max,
      max: hitPoints.max,
      temporary: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Pontos de Vida
            </CardTitle>
            <CardDescription>Gerencie HP atual, máximo e temporário</CardDescription>
          </div>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display de HP */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold">{hitPoints.current}</span>
            <span className="text-2xl text-muted-foreground">/ {hitPoints.max}</span>
          </div>

          {hitPoints.temporary > 0 && (
            <div className="mt-2 text-lg text-blue-600 dark:text-blue-400">
              +{hitPoints.temporary} HP temporário
            </div>
          )}

          {/* Barra de HP */}
          <div className="mt-4">
            <div className="h-4 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-300 ${getHPColor()}`}
                style={{ width: `${Math.min(100, hpPercentage)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{Math.round(hpPercentage)}%</p>
          </div>
        </div>

        {/* Ajustes Rápidos */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickAdjust(-1)}
            disabled={hitPoints.current <= 0 || isSaving}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickAdjust(+1)}
            disabled={hitPoints.current >= hitPoints.max || isSaving}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Aplicar Dano */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Receber Dano</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyDamage()}
              disabled={isSaving}
              min="0"
            />
            <Button
              onClick={applyDamage}
              disabled={!damageAmount || isSaving}
              variant="destructive"
            >
              Dano
            </Button>
          </div>
        </div>

        {/* Aplicar Cura */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Receber Cura</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={healAmount}
              onChange={(e) => setHealAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyHealing()}
              disabled={isSaving}
              min="0"
            />
            <Button
              onClick={applyHealing}
              disabled={!healAmount || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              Curar
            </Button>
          </div>
        </div>

        {/* HP Temporário */}
        <div className="space-y-2">
          <label className="text-sm font-medium">HP Temporário</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantidade"
              value={tempHPAmount}
              onChange={(e) => setTempHPAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setTempHP()}
              disabled={isSaving}
              min="0"
            />
            <Button onClick={setTempHP} disabled={!tempHPAmount || isSaving} variant="secondary">
              Aplicar
            </Button>
          </div>
        </div>

        {/* Descansos */}
        <div className="grid grid-cols-2 gap-2 border-t pt-4">
          <Button variant="outline" size="sm" onClick={shortRest} disabled={isSaving}>
            Descanso Curto
          </Button>
          <Button variant="outline" size="sm" onClick={longRest} disabled={isSaving}>
            Descanso Longo
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            ⚠️ {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
