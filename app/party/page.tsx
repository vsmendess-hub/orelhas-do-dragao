import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PartyDashboard } from '@/app/components/party/party-dashboard';

export default async function PartyPage() {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar todos os personagens do usuário
  const { data: characters, error } = await supabase
    .from('characters')
    .select('*')
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
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Voltar</Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Party Dashboard</h1>
              <p className="text-xs text-muted-foreground">Visão geral de todos seus personagens</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/personagens/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Personagem
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-3xl font-bold">
            <Users className="h-8 w-8" />
            Seus Personagens
          </h2>
          <p className="mt-2 text-muted-foreground">
            {characters?.length
              ? `${characters.length} personagem${characters.length > 1 ? 's' : ''} em sua party`
              : 'Nenhum personagem criado ainda'}
          </p>
        </div>

        {characters && characters.length > 0 ? (
          <PartyDashboard characters={characters} />
        ) : (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold">Nenhum personagem ainda</h3>
            <p className="mb-6 text-muted-foreground">
              Crie seu primeiro personagem para começar sua aventura
            </p>
            <Button asChild size="lg">
              <Link href="/personagens/novo">
                <Plus className="mr-2 h-5 w-5" />
                Criar Personagem
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
