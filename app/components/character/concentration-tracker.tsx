'use client';

import { useState } from 'react';
import { Focus, Dices, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { rollDie } from '@/lib/data/dice';
import {
  type ConcentrationSpell,
  calculateConcentrationDC,
  isConcentrationSaved,
  getConcentrationDuration,
  getConcentrationMessage,
} from '@/lib/data/concentration';

interface ConcentrationTrackerProps {
  characterId: string;
  concentration: ConcentrationSpell | null;
  constitutionModifier: number;
  proficiencyBonus: number;
  hasConcentrationProficiency: boolean;
}

export function ConcentrationTracker({
  characterId,
  concentration: initialConcentration,
  constitutionModifier,
  proficiencyBonus,
  hasConcentrationProficiency,
}: ConcentrationTrackerProps) {
  const [concentration, setConcentration] = useState<ConcentrationSpell | null>(
    initialConcentration
  );
  const [isSaving, setIsSaving] = useState(false);
  const [damageAmount, setDamageAmount] = useState('');
  const [testMessage, setTestMessage] = useState<string | null>(null);

  // Calcular bônus de save
  const saveBonus = constitutionModifier + (hasConcentrationProficiency ? proficiencyBonus : 0);

  // Salvar no Supabase
  const saveConcentration = async (newConcentration: ConcentrationSpell | null) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ concentration: newConcentration })
        .eq('id', characterId);

      if (error) throw error;
      setConcentration(newConcentration);
    } catch (err) {
      console.error('Erro ao salvar concentração:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Iniciar concentração (chamado de fora, ex: ao conjurar magia)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startConcentration = (spellName: string, duration: string) => {
    const newConcentration: ConcentrationSpell = {
      spellName,
      duration,
      startedAt: new Date().toISOString(),
      saveBonus,
    };
    saveConcentration(newConcentration);
    setTestMessage(null);
  };

  // Parar concentração
  const stopConcentration = () => {
    saveConcentration(null);
    setTestMessage(null);
  };

  // Testar concentração ao receber dano
  const testConcentration = () => {
    const damage = parseInt(damageAmount);
    if (isNaN(damage) || damage <= 0 || !concentration) return;

    const dc = calculateConcentrationDC(damage);
    const roll = rollDie('d20');
    const saved = isConcentrationSaved(roll, saveBonus, dc);
    const message = getConcentrationMessage(saved, roll, saveBonus, dc);

    setTestMessage(message);
    setDamageAmount('');

    // Se falhou, parar concentração
    if (!saved) {
      setTimeout(() => {
        stopConcentration();
      }, 2000);
    }
  };

  if (!concentration) {
    return (
      <Card className="border-dashed opacity-60">
        <CardContent className="py-6 text-center">
          <Focus className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Nenhuma magia com concentração ativa</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Conjure uma magia de concentração para rastreá-la aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-purple-600" />
            Concentração Ativa
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={stopConcentration}
            disabled={isSaving}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spell Info */}
        <div>
          <h4 className="font-semibold text-purple-900 dark:text-purple-100">
            {concentration.spellName}
          </h4>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">Duração: {concentration.duration}</Badge>
            <Badge variant="secondary">
              Ativa há: {getConcentrationDuration(concentration.startedAt)}
            </Badge>
          </div>
        </div>

        {/* Test Message */}
        {testMessage && (
          <div
            className={`rounded-md border p-3 text-sm ${
              testMessage.includes('✅')
                ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/20 dark:text-green-100'
                : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100'
            }`}
          >
            {testMessage}
          </div>
        )}

        {/* Damage Test */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Teste de Concentração ao Receber Dano</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Dano recebido"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && testConcentration()}
              disabled={isSaving}
              min="1"
            />
            <Button
              onClick={testConcentration}
              disabled={!damageAmount || isSaving}
              variant="outline"
            >
              <Dices className="mr-2 h-4 w-4" />
              Testar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Save de Constituição: +{saveBonus} (DC = 10 ou metade do dano)
          </p>
        </div>

        {/* Rules */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">📖 Regras de Concentração:</p>
          <ul className="mt-2 space-y-1">
            <li>• Pode concentrar em apenas 1 magia por vez</li>
            <li>• Ao tomar dano, faça teste de CON (DC = 10 ou metade do dano)</li>
            <li>• Falha = perde concentração e a magia acaba</li>
            <li>• Incapacitado ou morto = perde concentração automaticamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
