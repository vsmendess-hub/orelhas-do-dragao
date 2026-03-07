import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Users, Library, Wand2 } from 'lucide-react';
import { CharacterList } from './components/character-list';
import { ThemeToggle } from './components/theme-toggle';

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
            <Image
              src="/logo.jpg"
              alt="Orelhas do Dragão"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold text-white">Orelhas do Dragão</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Biblioteca"
            >
              <Link href="/library">
                <Library className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Party"
            >
              <Link href="/party">
                <Users className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="DM Tools"
            >
              <Link href="/dm-tools">
                <Wand2 className="h-5 w-5" />
              </Link>
            </Button>
            <div className="h-8 w-px bg-white/20" />
            <ThemeToggle />
            <span className="text-sm text-gray-300">{user.email}</span>
            <form action="/auth/logout" method="POST">
              <Button type="submit" variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Bem-vindo ao Orelhas do Dragão! 🎲
          </h1>
          <p className="text-gray-300 mt-2">
            Crie e gerencie seus personagens de D&D 5e em português
          </p>
        </div>

        {/* Character List */}
        <CharacterList characters={characters || []} />
      </main>
    </div>
  );
}
