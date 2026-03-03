'use client';

import { useState } from 'react';
import { Coins, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { generateTreasure, type Treasure } from '@/lib/data/dm-tools';

export function TreasureGenerator() {
  const [cr, setCr] = useState<number>(1);
  const [hoardSize, setHoardSize] = useState<'individual' | 'hoard'>('individual');
  const [treasure, setTreasure] = useState<Treasure | null>(null);

  const handleGenerate = () => {
    const generated = generateTreasure(cr, hoardSize);
    setTreasure(generated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-600" />
          Gerador de Tesouro
        </CardTitle>
        <CardDescription>Gere tesouro baseado no CR do encontro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cr">Challenge Rating (CR)</Label>
            <Select value={cr.toString()} onValueChange={(v) => setCr(parseInt(v))}>
              <SelectTrigger id="cr">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(21)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    CR {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Tipo de Tesouro</Label>
            <Select value={hoardSize} onValueChange={(v) => setHoardSize(v as any)}>
              <SelectTrigger id="size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="hoard">Hoard (Tesouro Grande)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result */}
        {treasure && (
          <div className="rounded-lg border-2 bg-card p-4 space-y-3">
            {/* Coins */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Moedas</Label>
              <div className="grid grid-cols-5 gap-2 text-center">
                {treasure.coins.copper > 0 && (
                  <div>
                    <Badge variant="outline" className="w-full bg-amber-900/20">
                      {treasure.coins.copper}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">CP</p>
                  </div>
                )}
                {treasure.coins.silver > 0 && (
                  <div>
                    <Badge variant="outline" className="w-full bg-gray-400/20">
                      {treasure.coins.silver}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">SP</p>
                  </div>
                )}
                {treasure.coins.electrum > 0 && (
                  <div>
                    <Badge variant="outline" className="w-full bg-green-600/20">
                      {treasure.coins.electrum}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">EP</p>
                  </div>
                )}
                {treasure.coins.gold > 0 && (
                  <div>
                    <Badge variant="outline" className="w-full bg-yellow-500/20">
                      {treasure.coins.gold}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">GP</p>
                  </div>
                )}
                {treasure.coins.platinum > 0 && (
                  <div>
                    <Badge variant="outline" className="w-full bg-blue-400/20">
                      {treasure.coins.platinum}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">PP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            {treasure.items.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Itens</Label>
                <ul className="space-y-1">
                  {treasure.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Total Value */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Valor Total:</span>
                <Badge variant="default" className="bg-yellow-600">
                  {treasure.totalValue.toFixed(2)} GP
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Action */}
        <Button onClick={handleGenerate} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar Tesouro
        </Button>
      </CardContent>
    </Card>
  );
}
