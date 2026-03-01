'use client';

import { useState, useEffect } from 'react';
import { History, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  type RollHistoryEntry,
  type RollResult,
  formatRollResult,
  formatTimestamp,
  calculateRollStats,
} from '@/lib/data/dice';

interface RollHistoryProps {
  maxEntries?: number;
}

export function RollHistory({ maxEntries = 50 }: RollHistoryProps) {
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);

  // Adicionar rolagem ao histórico
  const addRoll = (result: RollResult) => {
    const entry: RollHistoryEntry = {
      ...result,
      id: crypto.randomUUID(),
    };

    setHistory((prev) => {
      const newHistory = [entry, ...prev];
      // Limitar ao máximo
      if (newHistory.length > maxEntries) {
        return newHistory.slice(0, maxEntries);
      }
      return newHistory;
    });
  };

  // Limpar histórico
  const clearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
    }
  };

  // Remover entrada específica
  const removeEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Expor função addRoll globalmente para outros componentes
  useEffect(() => {
    // @ts-expect-error - Exposição global temporária
    window.addRollToHistory = addRoll;
    return () => {
      // @ts-expect-error - Limpeza
      window.addRollToHistory = undefined;
    };
  }, []);

  // Calcular estatísticas
  const stats = calculateRollStats(history);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Rolagens
            </CardTitle>
            <CardDescription>
              {history.length} {history.length === 1 ? 'rolagem' : 'rolagens'} nesta sessão
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/50 p-3 text-sm md:grid-cols-5">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold">{stats.count}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Média</p>
              <p className="font-bold">{stats.average}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Mín</p>
              <p className="font-bold">{stats.min}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Máx</p>
              <p className="font-bold">{stats.max}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Críticos</p>
              <p className="font-bold text-green-600">
                {stats.criticals}
                {stats.criticalFails > 0 && (
                  <span className="text-red-600"> / {stats.criticalFails}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Lista de histórico */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {history.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 font-medium">Nenhuma rolagem ainda</p>
              <p className="mt-2 text-sm text-muted-foreground">
                As rolagens aparecerão aqui conforme você joga
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className={`group relative rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                  entry.isCritical
                    ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/10'
                    : entry.isCriticalFail
                      ? 'border-red-500/30 bg-red-50/50 dark:bg-red-950/10'
                      : ''
                }`}
              >
                {/* Botão remover (aparece no hover) */}
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                </button>

                <div className="flex items-start justify-between gap-2">
                  {/* Resultado e detalhes */}
                  <div className="flex-1 space-y-1">
                    {/* Timestamp e descrição */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimestamp(entry.timestamp)}</span>
                      {entry.description && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-foreground">{entry.description}</span>
                        </>
                      )}
                    </div>

                    {/* Resultado formatado */}
                    <p className="font-mono text-sm">{formatRollResult(entry)}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {entry.isCritical && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          ⭐ Crítico
                        </Badge>
                      )}
                      {entry.isCriticalFail && (
                        <Badge variant="destructive" className="text-xs">
                          💀 Falha Crítica
                        </Badge>
                      )}
                      {entry.type === 'advantage' && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Vantagem
                        </Badge>
                      )}
                      {entry.type === 'disadvantage' && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Desvantagem
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Resultado total destacado */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-bold ${
                      entry.isCritical
                        ? 'bg-green-500 text-white'
                        : entry.isCriticalFail
                          ? 'bg-red-500 text-white'
                          : 'bg-deep-purple/10 text-deep-purple'
                    }`}
                  >
                    {entry.total}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dica de limite */}
        {history.length > 40 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
            ⚠️ Histórico próximo do limite ({history.length}/{maxEntries}). Considere limpar
            rolagens antigas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook customizado para adicionar rolagens ao histórico
export function useRollHistory() {
  const addRoll = (result: RollResult) => {
    // @ts-expect-error - Função exposta globalmente
    if (typeof window !== 'undefined' && window.addRollToHistory) {
      // @ts-expect-error - Função exposta globalmente
      window.addRollToHistory(result);
    }
  };

  return { addRoll };
}
