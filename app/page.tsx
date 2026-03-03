import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Users, Library, Wand2 } from 'lucide-react';
import { CharacterList } from './components/character-list';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    redirect('/login');
  }

  // Buscar personagens do usuário
  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name, race, class, level, hit_points, armor_class, avatar_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar personagens:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="Orelhas do Dragão" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold">Orelhas do Dragão</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/library">
                <Library className="mr-2 h-4 w-4" />
                Biblioteca
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/party">
                <Users className="mr-2 h-4 w-4" />
                Party
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dm-tools">
                <Wand2 className="mr-2 h-4 w-4" />
                DM Tools
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action="/auth/logout" method="POST">
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Orelhas do Dragão! 🎲</h1>
          <p className="text-muted-foreground">
            Crie e gerencie seus personagens de D&D 5e em português
          </p>
        </div>

        {/* Character List */}
        <CharacterList characters={characters || []} />
      </main>
    </div>
  );
}
