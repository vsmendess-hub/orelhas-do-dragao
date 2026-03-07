'use client';

import { useState } from 'react';
import { User, RefreshCw, Copy } from 'lucide-react';
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
import { generateName, type NameGeneratorOptions } from '@/lib/data/dm-tools';

export function NameGenerator() {
  const [options, setOptions] = useState<NameGeneratorOptions>({
    gender: 'neutral',
    type: 'full',
  });
  const [generatedName, setGeneratedName] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const name = generateName(options);
    setGeneratedName(name);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedName) return;
    await navigator.clipboard.writeText(generatedName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Gerador de Nomes
        </CardTitle>
        <CardDescription>Gere nomes para NPCs rapidamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              value={options.gender}
              onValueChange={(v) => setOptions({ ...options, gender: v as 'male' | 'female' | 'neutral' })}
            >
              <SelectTrigger id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="neutral">Neutro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={options.type}
              onValueChange={(v) => setOptions({ ...options, type: v as 'first' | 'last' | 'full' })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">Apenas Primeiro</SelectItem>
                <SelectItem value="last">Apenas Sobrenome</SelectItem>
                <SelectItem value="full">Nome Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result */}
        {generatedName && (
          <div className="rounded-lg border-2 bg-card p-4">
            <p className="text-center text-2xl font-bold">{generatedName}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Gerar Nome
          </Button>
          {generatedName && (
            <Button onClick={handleCopy} variant="outline">
              {copied ? <Copy className="h-4 w-4 fill-current" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
