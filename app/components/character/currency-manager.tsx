'use client';

import { useState } from 'react';
import { Coins, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type Currency,
  CURRENCY_NAMES,
  calculateTotalGold,
  calculateCurrencyWeight,
} from '@/lib/data/items';

interface CurrencyManagerProps {
  characterId: string;
  currency: Currency;
}

type CurrencyType = keyof Currency;

export function CurrencyManager({ characterId, currency: initialCurrency }: CurrencyManagerProps) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular totais
  const totalGold = calculateTotalGold(currency);
  const totalWeight = calculateCurrencyWeight(currency);

  // Salvar moedas no Supabase
  const saveCurrency = async (newCurrency: Currency) => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ currency: newCurrency })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setCurrency(newCurrency);
    } catch (err) {
      console.error('Erro ao salvar moedas:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Atualizar quantidade de uma moeda
  const updateCurrency = (type: CurrencyType, value: number) => {
    const newValue = Math.max(0, value); // Não permitir valores negativos
    const newCurrency = { ...currency, [type]: newValue };
    saveCurrency(newCurrency);
  };

  // Ajuste rápido (+/-)
  const adjustCurrency = (type: CurrencyType, delta: number) => {
    const newValue = Math.max(0, currency[type] + delta);
    const newCurrency = { ...currency, [type]: newValue };
    saveCurrency(newCurrency);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Coins className="h-5 w-5 text-yellow-500" />
              Moedas
            </h3>
            <p className="text-sm text-gray-400 mt-1">Gerencie suas moedas (po, pp, pe, pc, pl)</p>
          </div>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
        </div>
      </div>
      <div className="space-y-6">
        {/* Grid de Moedas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(CURRENCY_NAMES) as CurrencyType[]).map((type) => {
            const info = CURRENCY_NAMES[type];
            const value = currency[type];

            // Cores por tipo de moeda
            const colors = {
              copper: 'text-orange-400',
              silver: 'text-gray-400',
              electrum: 'text-green-400',
              gold: 'text-yellow-500',
              platinum: 'text-blue-400',
            };

            return (
              <div key={type} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <span className={`text-lg ${colors[type]}`}>●</span>
                  {info.full}
                  <span className="text-xs text-gray-400">({info.abbr})</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCurrency(type, -1)}
                    disabled={value === 0 || isSaving}
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => updateCurrency(type, parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    className="text-center"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCurrency(type, 1)}
                    disabled={isSaving}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totais */}
        <div className="rounded-lg glass-card-light p-4">
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Valor total em ouro:</span>
              <span className="font-bold text-yellow-400">
                {totalGold.toFixed(2)} po
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Peso das moedas:</span>
              <span className="font-medium text-white">{totalWeight.toFixed(2)} lb</span>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">💡 Dica: 50 moedas pesam 1 libra</p>
        </div>

        {/* Conversão rápida */}
        <details className="rounded-lg border border-white/10 glass-card-light p-3">
          <summary className="cursor-pointer text-sm font-medium text-white">📊 Tabela de Conversão</summary>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p>• 1 pl = 10 po</p>
            <p>• 1 po = 1 po (base)</p>
            <p>• 2 pe = 1 po</p>
            <p>• 10 pp = 1 po</p>
            <p>• 100 pc = 1 po</p>
          </div>
        </details>

        {/* Erro */}
        {error && (
          <div className="rounded-md glass-card-light border border-red-400/50 p-3 text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
