'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Background, COMMON_BACKGROUNDS } from '@/lib/data/personality';

interface BackstoryEditorProps {
  characterId: string;
  initialBackground: Background;
}

export function BackstoryEditor({ characterId, initialBackground }: BackstoryEditorProps) {
  const router = useRouter();
  const [background, setBackground] = useState<Background>(initialBackground);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleChange = (field: keyof Background, value: string) => {
    setBackground((prev) => ({
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
        .update({ background_data: background })
        .eq('id', characterId);

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'História salva com sucesso!' });

      // Recarregar dados do servidor
      router.refresh();

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar história:', err);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          História e Background
        </CardTitle>
        <CardDescription>
          Conte a história do seu personagem e suas conexões com o mundo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Background D&D 5e */}
        <div className="space-y-2">
          <Label htmlFor="background-name">Background D&D 5e</Label>
          <Select value={background.name || ''} onValueChange={(value) => handleChange('name', value)}>
            <SelectTrigger id="background-name">
              <SelectValue placeholder="Selecione um background..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum / Personalizado</SelectItem>
              {COMMON_BACKGROUNDS.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Descrição do Background */}
        {background.name && (
          <div className="space-y-2">
            <Label htmlFor="background-description">Descrição do Background</Label>
            <Textarea
              id="background-description"
              value={background.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="O que esse background significa para seu personagem?"
              rows={3}
            />
          </div>
        )}

        {/* Backstory Principal */}
        <div className="space-y-2">
          <Label htmlFor="backstory">História de Fundo</Label>
          <Textarea
            id="backstory"
            value={background.backstory || ''}
            onChange={(e) => handleChange('backstory', e.target.value)}
            placeholder="Conte a história do seu personagem: de onde veio, o que fez, como chegou até aqui..."
            rows={10}
          />
        </div>

        {/* Aliados */}
        <div className="space-y-2">
          <Label htmlFor="allies">Aliados e Contatos</Label>
          <Textarea
            id="allies"
            value={background.allies || ''}
            onChange={(e) => handleChange('allies', e.target.value)}
            placeholder="Quem ajuda seu personagem? Amigos, mentores, organizações..."
            rows={3}
          />
        </div>

        {/* Inimigos */}
        <div className="space-y-2">
          <Label htmlFor="enemies">Inimigos e Rivais</Label>
          <Textarea
            id="enemies"
            value={background.enemies || ''}
            onChange={(e) => handleChange('enemies', e.target.value)}
            placeholder="Quem se opõe ao seu personagem? Rivais, inimigos, antagonistas..."
            rows={3}
          />
        </div>

        {/* Organizações */}
        <div className="space-y-2">
          <Label htmlFor="organizations">Organizações</Label>
          <Textarea
            id="organizations"
            value={background.organizations || ''}
            onChange={(e) => handleChange('organizations', e.target.value)}
            placeholder="Guildas, facções, ordens que seu personagem pertence ou conhece..."
            rows={3}
          />
        </div>

        {/* Dicas */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">💡 Dicas para História:</p>
          <ul className="mt-2 space-y-1">
            <li>• De onde seu personagem veio?</li>
            <li>• Por que se tornou um aventureiro?</li>
            <li>• Qual o maior evento que moldou sua vida?</li>
            <li>• O que motiva suas ações atualmente?</li>
            <li>• Quais são seus objetivos a longo prazo?</li>
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
              Salvar História
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
