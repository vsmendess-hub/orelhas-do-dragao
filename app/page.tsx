import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    redirect('/login');
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
          <h2 className="text-3xl font-bold tracking-tight">Bem-vindo, {user.email}!</h2>
          <p className="text-muted-foreground">
            Crie e gerencie seus personagens de D&D 5e em português
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Criar Personagem */}
          <Card>
            <CardHeader>
              <CardTitle>🎭 Criar Personagem</CardTitle>
              <CardDescription>Wizard guiado passo a passo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Crie seu personagem com o sistema Point Buy, escolha raça, classe e muito mais.
              </p>
              <Button asChild className="w-full">
                <Link href="/personagens/novo">Começar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card: Meus Personagens */}
          <Card>
            <CardHeader>
              <CardTitle>📜 Meus Personagens</CardTitle>
              <CardDescription>Lista de todos seus personagens</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Veja, edite e gerencie todos os seus personagens salvos.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/personagens">Ver Lista</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card: Modo Rápido */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Modo Rápido</CardTitle>
              <CardDescription>Criação simplificada</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Crie um personagem rapidamente com valores pré-definidos.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/personagens/rapido">Criar Rápido</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✨ Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Criação guiada com wizard de 7 passos</li>
                <li>✅ Sistema Point Buy com bônus raciais</li>
                <li>✅ Todas as raças e classes da 5ª Edição</li>
                <li>✅ Geração de background via IA (Gemini)</li>
                <li>✅ Sincronização automática na nuvem</li>
                <li>✅ Funciona offline (PWA)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎲 Sobre o Projeto</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Orelhas do Dragão</strong> é um Character Builder completo para D&D 5ª
                Edição em português brasileiro.
              </p>
              <p className="mb-2">Desenvolvido com Next.js, Supabase e Google Gemini AI.</p>
              <p className="font-medium text-foreground">
                <em>Mais Risadas & Menos Regras</em> 🎲❤️
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
