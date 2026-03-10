'use client';

import { useState, useEffect, useRef } from 'react';
import { Coins, Loader2, Save, Check } from 'lucide-react';
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
  onCurrencyUpdate?: (currency: Currency) => void;
}

type CurrencyType = keyof Currency;

export function CurrencyManager({
  characterId,
  currency: initialCurrency,
  onCurrencyUpdate,
}: CurrencyManagerProps) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [pendingCurrency, setPendingCurrency] = useState<Currency>(initialCurrency);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular totais (usar pendingCurrency para mostrar valores em tempo real)
  const totalGold = calculateTotalGold(pendingCurrency);
  const totalWeight = calculateCurrencyWeight(pendingCurrency);

  // Limpar timeout anterior quando componente desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save com debounce (2 segundos após parar de digitar)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Criar novo timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveCurrency(pendingCurrency);
    }, 2000); // 2 segundos

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pendingCurrency, hasUnsavedChanges]);

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
      setHasUnsavedChanges(false);
      setJustSaved(true);

      // Limpar indicador de "salvo" após 2 segundos
      setTimeout(() => setJustSaved(false), 2000);

      // Notificar o componente pai sobre a atualização
      if (onCurrencyUpdate) {
        onCurrencyUpdate(newCurrency);
      }
    } catch (err) {
      console.error('Erro ao salvar moedas:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Atualizar quantidade de uma moeda (local, não salva ainda)
  const updateCurrency = (type: CurrencyType, value: number) => {
    const newValue = Math.max(0, value); // Não permitir valores negativos
    const newCurrency = { ...pendingCurrency, [type]: newValue };
    setPendingCurrency(newCurrency);
    setHasUnsavedChanges(true);
    setJustSaved(false);
  };

  // Ajuste rápido (+/-) - salva imediatamente
  const adjustCurrency = (type: CurrencyType, delta: number) => {
    const newValue = Math.max(0, pendingCurrency[type] + delta);
    const newCurrency = { ...pendingCurrency, [type]: newValue };
    setPendingCurrency(newCurrency);
    saveCurrency(newCurrency);
  };

  // Salvar manualmente
  const handleManualSave = () => {
    if (hasUnsavedChanges) {
      saveCurrency(pendingCurrency);
    }
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
            <p className="text-sm text-gray-400 mt-1">
              Gerencie suas moedas (po, pp, pe, pc, pl)
              {hasUnsavedChanges && (
                <span className="ml-2 text-orange-400">• Alterações não salvas</span>
              )}
              {justSaved && <span className="ml-2 text-green-400">• ✓ Salvo</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
            {justSaved && !isSaving && <Check className="h-4 w-4 text-green-400" />}
            {hasUnsavedChanges && !isSaving && (
              <Button onClick={handleManualSave} size="sm" className="tab-purple">
                <Save className="mr-2 h-4 w-4" />
                Salvar Agora
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Grid de Moedas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(CURRENCY_NAMES) as CurrencyType[]).map((type) => {
            const info = CURRENCY_NAMES[type];
            const value = pendingCurrency[type];

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
                    placeholder="0"
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
          <div className="space-y-3">
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Valor total em ouro:</span>
                <span className="font-bold text-yellow-400">{totalGold.toFixed(2)} po</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Peso das moedas:</span>
                <span className="font-medium text-white">{totalWeight.toFixed(2)} lb</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1">
              <p className="text-xs text-gray-400">
                💡 Dica: 50 moedas pesam 1 libra. O peso das moedas é somado ao peso do equipamento
                para calcular a capacidade de carga total.
              </p>
              <p className="text-xs text-blue-400">
                💾 As alterações são salvas automaticamente após 2 segundos. Use os botões +/- para
                salvar instantaneamente.
              </p>
            </div>
          </div>
        </div>

        {/* Conversão rápida */}
        <details className="rounded-lg border border-white/10 glass-card-light p-3">
          <summary className="cursor-pointer text-sm font-medium text-white">
            📊 Tabela de Conversão
          </summary>
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
