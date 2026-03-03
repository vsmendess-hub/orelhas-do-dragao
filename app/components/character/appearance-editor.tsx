'use client';

import { useState } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Appearance } from '@/lib/data/personality';

interface AppearanceEditorProps {
  characterId: string;
  initialAppearance: Appearance;
}

export function AppearanceEditor({ characterId, initialAppearance }: AppearanceEditorProps) {
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleChange = (field: keyof Appearance, value: string) => {
    setAppearance((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ appearance })
        .eq('id', characterId);

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Aparência salva com sucesso!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar aparência:', err);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
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
        {/* Características Básicas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              value={appearance.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="Ex: 25 anos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura</Label>
            <Input
              id="height"
              value={appearance.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="Ex: 1,80m"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso</Label>
            <Input
              id="weight"
              value={appearance.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="Ex: 75kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eyes">Olhos</Label>
            <Input
              id="eyes"
              value={appearance.eyes || ''}
              onChange={(e) => handleChange('eyes', e.target.value)}
              placeholder="Ex: Castanhos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skin">Pele</Label>
            <Input
              id="skin"
              value={appearance.skin || ''}
              onChange={(e) => handleChange('skin', e.target.value)}
              placeholder="Ex: Morena clara"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hair">Cabelo</Label>
            <Input
              id="hair"
              value={appearance.hair || ''}
              onChange={(e) => handleChange('hair', e.target.value)}
              placeholder="Ex: Preto e curto"
            />
          </div>
        </div>

        {/* Marcas Distinguíveis */}
        <div className="space-y-2">
          <Label htmlFor="distinguishing-marks">Marcas Distinguíveis</Label>
          <Textarea
            id="distinguishing-marks"
            value={appearance.distinguishingMarks || ''}
            onChange={(e) => handleChange('distinguishingMarks', e.target.value)}
            placeholder="Ex: Cicatriz no rosto, tatuagem de dragão no braço..."
            rows={3}
          />
        </div>

        {/* Descrição Geral */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição Geral</Label>
          <Textarea
            id="description"
            value={appearance.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descreva a aparência geral do seu personagem..."
            rows={5}
          />
        </div>

        {/* Dicas */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">💡 Dicas para Descrição:</p>
          <ul className="mt-2 space-y-1">
            <li>• Como seu personagem se veste normalmente?</li>
            <li>• Possui alguma cicatriz ou tatuagem com história?</li>
            <li>• Qual a sua postura e linguagem corporal?</li>
            <li>• Algum acessório ou item característico?</li>
          </ul>
        </div>

        {/* Mensagem de Salvamento */}
        {saveMessage && (
          <Alert variant={saveMessage.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{saveMessage.text}</AlertDescription>
          </Alert>
        )}

        {/* Botão Salvar */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Aparência
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
