import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppearanceEditor } from '@/app/components/character/appearance-editor';
import { PersonalityEditor } from '@/app/components/character/personality-editor';
import { BackstoryEditor } from '@/app/components/character/backstory-editor';
import { AvatarUploader } from '@/app/components/character/avatar-uploader';
import {
  EMPTY_APPEARANCE,
  EMPTY_PERSONALITY,
  EMPTY_BACKGROUND,
  type Appearance,
  type Personality,
  type Background,
} from '@/lib/data/personality';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonalizationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar personagem
  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  // Se não encontrou ou erro, retornar 404
  if (error || !character) {
    notFound();
  }

  // Verificar ownership
  if (character.user_id !== user.id) {
    notFound();
  }

  // Garantir que os campos de personalização existam
  const appearance: Appearance = character.appearance || EMPTY_APPEARANCE;
  const personality: Personality = character.personality || EMPTY_PERSONALITY;
  const background: Background = character.background || EMPTY_BACKGROUND;
  const avatarUrl: string | undefined = character.avatar_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/personagens/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{character.name}</h1>
              <p className="text-xs text-muted-foreground">Personalização do personagem</p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href={`/personagens/${id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Ficha
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-5xl">
          {/* Introdução */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Personalize seu Personagem</h2>
            <p className="mt-2 text-muted-foreground">
              Adicione detalhes sobre aparência, personalidade, história e avatar para dar vida ao
              seu personagem.
            </p>
          </div>

          {/* Tabs de Personalização */}
          <Tabs defaultValue="avatar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="personality">Personalidade</TabsTrigger>
              <TabsTrigger value="backstory">História</TabsTrigger>
            </TabsList>

            {/* Tab: Avatar */}
            <TabsContent value="avatar" className="space-y-4">
              <AvatarUploader
                characterId={id}
                characterName={character.name}
                currentAvatarUrl={avatarUrl}
              />
            </TabsContent>

            {/* Tab: Aparência */}
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceEditor characterId={id} initialAppearance={appearance} />
            </TabsContent>

            {/* Tab: Personalidade */}
            <TabsContent value="personality" className="space-y-4">
              <PersonalityEditor characterId={id} initialPersonality={personality} />
            </TabsContent>

            {/* Tab: História */}
            <TabsContent value="backstory" className="space-y-4">
              <BackstoryEditor characterId={id} initialBackground={background} />
            </TabsContent>
          </Tabs>

          {/* Dica final */}
          <div className="mt-8 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">💡 Dica do Mestre:</p>
            <p className="mt-1">
              Personagens bem desenvolvidos tornam as sessões mais imersivas e memoráveis. Não
              precisa preencher tudo de uma vez - você pode voltar e adicionar detalhes conforme
              joga!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
