'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditFormData {
  name: string;
  level: number;
  experience_points: number;
  inspiration: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCharacterPage({ params }: PageProps) {
  const router = useRouter();
  const [characterId, setCharacterId] = useState<string>('');
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    level: 1,
    experience_points: 0,
    inspiration: false,
  });
  const [originalData, setOriginalData] = useState<EditFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do personagem
  useEffect(() => {
    async function loadCharacter() {
      try {
        const { id } = await params;
        setCharacterId(id);

        const supabase = createClient();

        // Verificar autenticação
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Buscar personagem
        const { data: character, error: fetchError } = await supabase
          .from('characters')
          .select('name, level, experience_points, inspiration, user_id')
          .eq('id', id)
          .single();

        if (fetchError || !character) {
          setError('Personagem não encontrado');
          return;
        }

        // Verificar ownership
        if (character.user_id !== user.id) {
          setError('Você não tem permissão para editar este personagem');
          return;
        }

        const data = {
          name: character.name,
          level: character.level,
          experience_points: character.experience_points,
          inspiration: character.inspiration,
        };

        setFormData(data);
        setOriginalData(data);
      } catch (err) {
        console.error('Erro ao carregar personagem:', err);
        setError('Erro ao carregar personagem');
      } finally {
        setIsLoading(false);
      }
    }

    loadCharacter();
  }, [params, router]);

  // Calcular bônus de proficiência baseado no nível
  const calculateProficiencyBonus = (level: number): number => {
    return Math.floor((level - 1) / 4) + 2;
  };

  // Salvar alterações
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validações
      if (!formData.name.trim()) {
        setError('Nome é obrigatório');
        return;
      }

      if (formData.level < 1 || formData.level > 20) {
        setError('Nível deve estar entre 1 e 20');
        return;
      }

      if (formData.experience_points < 0) {
        setError('Experiência não pode ser negativa');
        return;
      }

      const supabase = createClient();

      // Verificar autenticação
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Você precisa estar autenticado');
        return;
      }

      // Calcular novo bônus de proficiência
      const newProficiencyBonus = calculateProficiencyBonus(formData.level);

      // Atualizar personagem
      const { error: updateError } = await supabase
        .from('characters')
        .update({
          name: formData.name.trim(),
          level: formData.level,
          experience_points: formData.experience_points,
          inspiration: formData.inspiration,
          proficiency_bonus: newProficiencyBonus,
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Redirecionar de volta para a ficha
      router.push(`/personagens/${characterId}`);
      router.refresh();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se houve mudanças
  const hasChanges = originalData
    ? JSON.stringify(formData) !== JSON.stringify(originalData)
    : false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-deep-purple" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando personagem...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link href="/">Voltar para Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/personagens/${characterId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar Personagem</h1>
          <p className="mt-2 text-muted-foreground">Altere informações básicas do seu personagem</p>
        </div>

        <div className="space-y-6">
          {/* Nome */}
          <Card>
            <CardHeader>
              <CardTitle>Nome do Personagem</CardTitle>
              <CardDescription>O nome pelo qual seu personagem é conhecido</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Ex: Thorin Escudo de Carvalho"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={50}
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {formData.name.length} / 50 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Nível */}
          <Card>
            <CardHeader>
              <CardTitle>Nível</CardTitle>
              <CardDescription>
                Nível do personagem (1-20). Bônus de proficiência será recalculado automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: parseInt(e.target.value) || 1 })
                  }
                  disabled={isSaving}
                  className="w-32"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Bônus de Proficiência:{' '}
                    <span className="font-bold">+{calculateProficiencyBonus(formData.level)}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiência */}
          <Card>
            <CardHeader>
              <CardTitle>Pontos de Experiência</CardTitle>
              <CardDescription>Total de XP acumulado pelo personagem</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="0"
                value={formData.experience_points}
                onChange={(e) =>
                  setFormData({ ...formData, experience_points: parseInt(e.target.value) || 0 })
                }
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {formData.experience_points.toLocaleString()} XP
              </p>
            </CardContent>
          </Card>

          {/* Inspiração */}
          <Card>
            <CardHeader>
              <CardTitle>Inspiração</CardTitle>
              <CardDescription>
                Recompensa por interpretar bem seu personagem ou alcançar feitos épicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inspiration"
                  checked={formData.inspiration}
                  onChange={(e) => setFormData({ ...formData, inspiration: e.target.checked })}
                  disabled={isSaving}
                  className="h-5 w-5 rounded border-gray-300 text-deep-purple focus:ring-deep-purple"
                />
                <label htmlFor="inspiration" className="text-sm font-medium">
                  Personagem tem inspiração
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Erro */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm text-red-900 dark:text-red-100">⚠️ {error}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1" disabled={isSaving}>
              <Link href={`/personagens/${characterId}`}>Cancelar</Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1"
              size="lg"
            >
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

          {!hasChanges && !error && (
            <p className="text-center text-sm text-muted-foreground">
              Faça alterações para habilitar o botão de salvar
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
