'use client';

import { useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
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
import {
  getRandomElement,
  RANDOM_TAVERN_NAMES,
  RANDOM_NPC_QUIRKS,
  RANDOM_QUEST_HOOKS,
} from '@/lib/data/dm-tools';

type TableType = 'tavern' | 'quirk' | 'quest';

const TABLES = {
  tavern: { label: 'Nome de Taverna', data: RANDOM_TAVERN_NAMES },
  quirk: { label: 'Peculiaridade de NPC', data: RANDOM_NPC_QUIRKS },
  quest: { label: 'Gancho de Missão', data: RANDOM_QUEST_HOOKS },
};

export function RandomTables() {
  const [tableType, setTableType] = useState<TableType>('tavern');
  const [result, setResult] = useState<string>('');

  const handleGenerate = () => {
    const table = TABLES[tableType];
    const element = getRandomElement(table.data);
    setResult(element);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          Tabelas Aleatórias
        </CardTitle>
        <CardDescription>Gere elementos aleatórios para sua campanha</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Table Selection */}
        <div className="space-y-2">
          <Label htmlFor="table">Tipo de Tabela</Label>
          <Select value={tableType} onValueChange={(v) => setTableType(v as TableType)}>
            <SelectTrigger id="table">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tavern">Nome de Taverna</SelectItem>
              <SelectItem value="quirk">Peculiaridade de NPC</SelectItem>
              <SelectItem value="quest">Gancho de Missão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-lg border-2 bg-card p-4">
            <p className="text-center font-medium">{result}</p>
          </div>
        )}

        {/* Action */}
        <Button onClick={handleGenerate} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Gerar
        </Button>
      </CardContent>
    </Card>
  );
}
