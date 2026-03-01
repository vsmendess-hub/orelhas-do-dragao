'use client';

import { useState } from 'react';
import { User, Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appearance } from '@/lib/data/personality';

interface AppearanceEditorProps {
  characterId: string;
  initialAppearance: Appearance;
}

export function AppearanceEditor({ characterId, initialAppearance }: AppearanceEditorProps) {
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Atualizar campo
  const updateField = (field: keyof Appearance, value: string | number | undefined) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Salvar no Supabase
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('characters')
        .update({ appearance })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setHasChanges(false);
    } catch (err) {
      console.error('Erro ao salvar aparência:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Aparência Física
        </CardTitle>
        <CardDescription>Descreva as características físicas do seu personagem</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid de campos */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Altura */}
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              Altura
            </label>
            <Input
              id="height"
              placeholder="Ex: 1,75m ou 5'9&quot;"
              value={appearance.height || ''}
              onChange={(e) => updateField('height', e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Peso
            </label>
            <Input
              id="weight"
              placeholder="Ex: 70kg ou 154 lbs"
              value={appearance.weight || ''}
              onChange={(e) => updateField('weight', e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Idade */}
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">
              Idade
            </label>
            <Input
              id="age"
              type="number"
              min="0"
              placeholder="Ex: 25"
              value={appearance.age || ''}
              onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
              disabled={isSaving}
            />
          </div>

          {/* Olhos */}
          <div className="space-y-2">
            <label htmlFor="eyes" className="text-sm font-medium">
              Olhos
            </label>
            <Input
              id="eyes"
              placeholder="Ex: Azuis, Castanhos"
              value={appearance.eyes || ''}
              onChange={(e) => updateField('eyes', e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Pele */}
          <div className="space-y-2">
            <label htmlFor="skin" className="text-sm font-medium">
              Pele
            </label>
            <Input
              id="skin"
              placeholder="Ex: Pálida, Morena, Bronzeada"
              value={appearance.skin || ''}
              onChange={(e) => updateField('skin', e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Cabelo */}
          <div className="space-y-2">
            <label htmlFor="hair" className="text-sm font-medium">
              Cabelo
            </label>
            <Input
              id="hair"
              placeholder="Ex: Preto e curto, Loiro e longo"
              value={appearance.hair || ''}
              onChange={(e) => updateField('hair', e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Dicas */}
        <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            💡 Dicas de Descrição
          </p>
          <ul className="mt-2 space-y-1 text-xs text-blue-800 dark:text-blue-200">
            <li>• Seja específico: &quot;1,75m&quot; em vez de &quot;alto&quot;</li>
            <li>• Inclua detalhes marcantes: cicatrizes, tatuagens, etc.</li>
            <li>• Considere a raça: Elfos são geralmente mais altos e magros</li>
          </ul>
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Botão Salvar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {hasChanges ? 'Você tem alterações não salvas' : 'Todas as alterações foram salvas'}
          </p>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
