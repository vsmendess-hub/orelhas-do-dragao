'use client';

import { useState } from 'react';
import { BookOpen, FileText, Loader2, Save, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BACKSTORY_TIPS, type Background } from '@/lib/data/personality';

interface BackstoryEditorProps {
  characterId: string;
  initialBackground: Background;
}

export function BackstoryEditor({ characterId, initialBackground }: BackstoryEditorProps) {
  const [background, setBackground] = useState<Background>(initialBackground);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Atualizar campo
  const updateField = (field: keyof Background, value: string) => {
    setBackground((prev) => ({ ...prev, [field]: value }));
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
        .update({ background })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setHasChanges(false);
    } catch (err) {
      console.error('Erro ao salvar background:', err);
      setError('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Contar palavras
  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const backstoryWordCount = countWords(background.backstory);
  const notesWordCount = countWords(background.notes);

  return (
    <div className="space-y-6">
      {/* História de Fundo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            História de Fundo
          </CardTitle>
          <CardDescription>
            Conte a história do seu personagem: origem, motivações e eventos importantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dicas colapsáveis */}
          <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex w-full items-center justify-between text-left"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                <HelpCircle className="h-4 w-4" />
                Perguntas para Criar sua História
              </p>
              <span className="text-xs text-blue-700 dark:text-blue-300">
                {showTips ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>
            {showTips && (
              <ul className="mt-3 space-y-2 text-xs text-blue-800 dark:text-blue-200">
                {BACKSTORY_TIPS.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Editor de backstory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="backstory" className="text-sm font-medium">
                Sua História
              </label>
              <span className="text-xs text-muted-foreground">
                {backstoryWordCount} {backstoryWordCount === 1 ? 'palavra' : 'palavras'}
              </span>
            </div>
            <Textarea
              id="backstory"
              placeholder="Era uma vez, em uma terra distante..."
              value={background.backstory}
              onChange={(e) => updateField('backstory', e.target.value)}
              disabled={isSaving}
              className="min-h-[300px] resize-y font-serif text-base leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Dica: Uma boa história tem entre 100-300 palavras. Foque em eventos marcantes e
              motivações.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas e Observações
          </CardTitle>
          <CardDescription>
            Anotações gerais, lembretes, objetivos ou informações adicionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Editor de notas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="notes" className="text-sm font-medium">
                Suas Notas
              </label>
              <span className="text-xs text-muted-foreground">
                {notesWordCount} {notesWordCount === 1 ? 'palavra' : 'palavras'}
              </span>
            </div>
            <Textarea
              id="notes"
              placeholder="Anote objetivos, lembretes, informações de sessões anteriores..."
              value={background.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              disabled={isSaving}
              className="min-h-[200px] resize-y"
            />
          </div>

          {/* Exemplos de uso */}
          <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">💡 Ideias para suas notas:</p>
            <ul className="mt-2 space-y-1">
              <li>• Objetivos de curto e longo prazo</li>
              <li>• NPCs importantes e relacionamentos</li>
              <li>• Itens ou locais que você quer explorar</li>
              <li>• Anotações de sessões anteriores</li>
              <li>• Questões em aberto ou mistérios</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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
