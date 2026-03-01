'use client';

import { useState } from 'react';
import { Heart, Plus, X, Loader2, Save, Lightbulb } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PERSONALITY_EXAMPLES, type Personality } from '@/lib/data/personality';

interface PersonalityEditorProps {
  characterId: string;
  initialPersonality: Personality;
}

export function PersonalityEditor({ characterId, initialPersonality }: PersonalityEditorProps) {
  const [personality, setPersonality] = useState<Personality>(initialPersonality);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // Inputs temporários para novos itens
  const [newTrait, setNewTrait] = useState('');
  const [newIdeal, setNewIdeal] = useState('');
  const [newBond, setNewBond] = useState('');
  const [newFlaw, setNewFlaw] = useState('');

  // Adicionar item a uma categoria
  const addItem = (category: keyof Personality, value: string) => {
    if (!value.trim()) return;

    setPersonality((prev) => ({
      ...prev,
      [category]: [...prev[category], value.trim()],
    }));
    setHasChanges(true);

    // Limpar input
    if (category === 'traits') setNewTrait('');
    if (category === 'ideals') setNewIdeal('');
    if (category === 'bonds') setNewBond('');
    if (category === 'flaws') setNewFlaw('');
  };

  // Remover item de uma categoria
  const removeItem = (category: keyof Personality, index: number) => {
    setPersonality((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
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
        .update({ personality })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setHasChanges(false);
    } catch (err) {
      console.error('Erro ao salvar personalidade:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Renderizar seção de categoria
  const renderCategory = (
    title: string,
    description: string,
    category: keyof Personality,
    items: string[],
    newValue: string,
    setNewValue: (value: string) => void,
    icon: React.ReactNode,
    examples: string[]
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lista de itens */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-2 rounded-lg border bg-muted/50 p-3"
              >
                <p className="flex-1 text-sm">{item}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(category, index)}
                  disabled={isSaving}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input para adicionar novo */}
        <div className="flex gap-2">
          <Input
            placeholder={`Adicionar ${title.toLowerCase()}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem(category, newValue);
              }
            }}
            disabled={isSaving}
          />
          <Button
            onClick={() => addItem(category, newValue)}
            disabled={!newValue.trim() || isSaving}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Exemplos */}
        {examples.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              💡 Ver exemplos do D&amp;D 5e
            </summary>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {examples.slice(0, 3).map((example, index) => (
                <li key={index} className="ml-4">
                  • {example}
                </li>
              ))}
            </ul>
          </details>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Personalidade
          </CardTitle>
          <CardDescription>
            Defina os traços, ideais, vínculos e defeitos do seu personagem (D&amp;D 5e)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Toggle para mostrar dicas gerais */}
          <div className="mb-4 rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex w-full items-center justify-between text-left"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                <Lightbulb className="h-4 w-4" />
                Dicas de Personalidade D&amp;D 5e
              </p>
              <span className="text-xs text-blue-700 dark:text-blue-300">
                {showExamples ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>
            {showExamples && (
              <div className="mt-3 space-y-2 text-xs text-blue-800 dark:text-blue-200">
                <p>
                  <strong>Traços:</strong> Como você age e se comporta? (Recomendado: 2 traços)
                </p>
                <p>
                  <strong>Ideais:</strong> Em que você acredita? O que te motiva? (Recomendado: 1
                  ideal)
                </p>
                <p>
                  <strong>Vínculos:</strong> Com quem ou o quê você se importa? (Recomendado: 1
                  vínculo)
                </p>
                <p>
                  <strong>Defeitos:</strong> Quais são suas fraquezas? (Recomendado: 1 defeito)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid de categorias */}
      <div className="grid gap-6 md:grid-cols-2">
        {renderCategory(
          'Traços de Personalidade',
          'Como você age e se comporta no dia a dia',
          'traits',
          personality.traits,
          newTrait,
          setNewTrait,
          <span className="text-lg">😊</span>,
          PERSONALITY_EXAMPLES.traits
        )}

        {renderCategory(
          'Ideais',
          'Seus valores e o que te motiva',
          'ideals',
          personality.ideals,
          newIdeal,
          setNewIdeal,
          <span className="text-lg">⭐</span>,
          PERSONALITY_EXAMPLES.ideals
        )}

        {renderCategory(
          'Vínculos',
          'Pessoas, lugares ou coisas importantes para você',
          'bonds',
          personality.bonds,
          newBond,
          setNewBond,
          <span className="text-lg">🔗</span>,
          PERSONALITY_EXAMPLES.bonds
        )}

        {renderCategory(
          'Defeitos',
          'Suas fraquezas e vulnerabilidades',
          'flaws',
          personality.flaws,
          newFlaw,
          setNewFlaw,
          <span className="text-lg">⚠️</span>,
          PERSONALITY_EXAMPLES.flaws
        )}
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
    </div>
  );
}
