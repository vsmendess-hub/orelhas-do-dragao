'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Save, Loader2, Plus, X, Lightbulb, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  type Personality,
  PERSONALITY_SUGGESTIONS,
  IDEAL_SUGGESTIONS,
  BOND_SUGGESTIONS,
  FLAW_SUGGESTIONS,
} from '@/lib/data/personality';

interface PersonalityEditorProps {
  characterId: string;
  characterName: string;
  characterRace: string;
  characterClass: string;
  initialPersonality: Personality;
  backgroundStory?: string;
}

type PersonalityField = 'traits' | 'ideals' | 'bonds' | 'flaws';

export function PersonalityEditor({
  characterId,
  characterName,
  characterRace,
  characterClass,
  initialPersonality,
  backgroundStory,
}: PersonalityEditorProps) {
  const router = useRouter();
  const [personality, setPersonality] = useState<Personality>(initialPersonality);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [newInputs, setNewInputs] = useState<Record<PersonalityField, string>>({
    traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
  });

  const addItem = (field: PersonalityField) => {
    const value = newInputs[field].trim();
    if (!value) return;

    setPersonality((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));

    setNewInputs((prev) => ({ ...prev, [field]: '' }));
  };

  const removeItem = (field: PersonalityField, index: number) => {
    setPersonality((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const addSuggestion = (field: PersonalityField, suggestion: string) => {
    if (personality[field]?.includes(suggestion)) return;

    setPersonality((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), suggestion],
    }));
  };

  const generatePersonality = async () => {
    if (!backgroundStory) {
      setSaveMessage({
        type: 'error',
        text: 'Você precisa ter uma história definida antes de gerar a personalidade.',
      });
      return;
    }

    try {
      setIsGenerating(true);
      setSaveMessage(null);

      const response = await fetch('/api/generate-personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName,
          background: backgroundStory,
          race: characterRace,
          characterClass,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar personalidade');
      }

      const data = await response.json();
      setPersonality(data.personality);
      setSaveMessage({
        type: 'success',
        text: 'Personalidade gerada com IA! Revise e edite conforme necessário.',
      });
    } catch (err) {
      console.error('Erro ao gerar personalidade:', err);
      setSaveMessage({ type: 'error', text: 'Erro ao gerar personalidade. Tente novamente.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ personality })
        .eq('id', characterId);

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Personalidade salva com sucesso!' });

      // Recarregar dados do servidor
      router.refresh();

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar personalidade:', err);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    field: PersonalityField,
    title: string,
    description: string,
    suggestions: string[],
    limit?: number
  ) => {
    const items = personality[field] || [];
    const canAdd = !limit || items.length < limit;

    return (
      <div className="space-y-3">
        <div>
          <Label className="text-base font-semibold">{title}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
          {limit && (
            <p className="mt-1 text-xs text-muted-foreground">
              {items.length}/{limit} preenchidos
            </p>
          )}
        </div>

        {/* Items atuais */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm"
              >
                <span className="flex-1">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(field, index)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input para adicionar novo */}
        {canAdd && (
          <div className="flex gap-2">
            <Input
              value={newInputs[field]}
              onChange={(e) => setNewInputs((prev) => ({ ...prev, [field]: e.target.value }))}
              placeholder={`Adicionar ${title.toLowerCase()}...`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(field);
                }
              }}
            />
            <Button onClick={() => addItem(field)} size="icon" disabled={!newInputs[field].trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Sugestões */}
        {suggestions.length > 0 && canAdd && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lightbulb className="h-3 w-3" />
              <span>Sugestões:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => addSuggestion(field, suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Personalidade
            </CardTitle>
            <CardDescription>
              Defina os traços, ideais, vínculos e defeitos do seu personagem
            </CardDescription>
          </div>
          {backgroundStory && (
            <Button
              onClick={generatePersonality}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar com IA
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* D&D 5e recomenda 2 traits, 1 ideal, 1 bond, 1 flaw */}

        {renderField(
          'traits',
          'Traços de Personalidade',
          'Como seu personagem age e se comporta?',
          [...PERSONALITY_SUGGESTIONS.good, ...PERSONALITY_SUGGESTIONS.lawful],
          2
        )}

        {renderField(
          'ideals',
          'Ideais',
          'No que seu personagem acredita?',
          IDEAL_SUGGESTIONS,
          1
        )}

        {renderField(
          'bonds',
          'Vínculos',
          'O que é mais importante para seu personagem?',
          BOND_SUGGESTIONS,
          1
        )}

        {renderField(
          'flaws',
          'Defeitos',
          'Qual a maior fraqueza do seu personagem?',
          FLAW_SUGGESTIONS,
          1
        )}

        {/* Info sobre D&D 5e */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">📖 Regras D&D 5e:</p>
          <ul className="mt-2 space-y-1">
            <li>• Traços: 2 características marcantes do personagem</li>
            <li>• Ideais: 1 princípio que guia as ações</li>
            <li>• Vínculos: 1 conexão importante (pessoa, lugar, objeto)</li>
            <li>• Defeitos: 1 fraqueza ou vício</li>
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
              Salvar Personalidade
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
