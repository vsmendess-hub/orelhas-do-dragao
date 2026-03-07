'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditFormData {
  name: string;
  level: number;
  experience_points: number;
  speed: number;
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
    speed: 9,
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
          .select('name, level, experience_points, speed, user_id')
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

        // Converter pés para metros (1 pé = 0.3048 metros, arredondando)
        const speedInMeters = Math.round((character.speed * 0.3048) * 10) / 10;

        const data = {
          name: character.name,
          level: character.level,
          experience_points: character.experience_points,
          speed: speedInMeters,
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

      if (formData.speed < 0) {
        setError('Deslocamento não pode ser negativo');
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

      // Converter metros de volta para pés para salvar no banco (1 metro = 3.28084 pés)
      const speedInFeet = Math.round(formData.speed * 3.28084);

      // Atualizar personagem
      const { error: updateError } = await supabase
        .from('characters')
        .update({
          name: formData.name.trim(),
          level: formData.level,
          experience_points: formData.experience_points,
          speed: speedInFeet,
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
    <div className="min-h-screen relative">
      {/* Fantasy Background */}
      <div className="fantasy-bg" />
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/originals/a1/5d/0e/a15d0e8c4f4f8b8c4f4f8b8c4f4f8b8c.jpg)',
          filter: 'blur(3px)',
        }}
      />

      {/* Header */}
      <header className="glass-card border-0 rounded-none backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link href={`/personagens/${characterId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Editar Personagem</h1>
          <p className="mt-2 text-gray-300">Altere informações básicas do seu personagem</p>
        </div>

        <div className="space-y-6">
          {/* Nome */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Nome do Personagem</h3>
            <p className="text-sm text-gray-400 mb-4">O nome pelo qual seu personagem é conhecido</p>
            <div>
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
            </div>
          </div>

          {/* Nível */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Nível</h3>
            <p className="text-sm text-gray-400 mb-4">
              Nível do personagem (1-20). Bônus de proficiência será recalculado automaticamente
            </p>
            <div>
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
            </div>
          </div>

          {/* Experiência */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Pontos de Experiência</h3>
            <p className="text-sm text-gray-400 mb-4">Total de XP acumulado pelo personagem</p>
            <div>
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
            </div>
          </div>

          {/* Deslocamento */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Deslocamento</h3>
            <p className="text-sm text-gray-400 mb-4">Velocidade de movimento do personagem em metros</p>
            <div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.speed}
                  onChange={(e) =>
                    setFormData({ ...formData, speed: parseFloat(e.target.value) || 0 })
                  }
                  disabled={isSaving}
                  className="w-32"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">metros por turno</p>
                </div>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="glass-card-light rounded-xl border border-red-400/50 p-4">
              <p className="text-sm text-red-300">⚠️ {error}</p>
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
