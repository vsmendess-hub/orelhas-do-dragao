import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Dices } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { DiceManager } from '@/app/components/dice/dice-manager';
import { calculateModifier } from '@/lib/data/point-buy';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DicePage({ params }: PageProps) {
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

  // Calcular modificadores
  const modifiers = {
    str: calculateModifier(character.attributes.str),
    dex: calculateModifier(character.attributes.dex),
    con: calculateModifier(character.attributes.con),
    int: calculateModifier(character.attributes.int),
    wis: calculateModifier(character.attributes.wis),
    cha: calculateModifier(character.attributes.cha),
  };

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
              <Link href={`/personagens/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">{character.name}</h1>
              <p className="text-xs text-gray-400">Sistema de Rolagem de Dados</p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header de Dados */}
          <div>
            <h2 className="flex items-center gap-2 text-3xl font-bold text-white">
              <Dices className="h-8 w-8 text-purple-400" />
              Rolador de Dados
            </h2>
            <p className="mt-2 text-gray-300">
              Role dados para ataques, perícias, testes de resistência e muito mais
            </p>
          </div>

          {/* Gerenciador de Dados */}
          <DiceManager
            character={{
              id,
              name: character.name,
              proficiencyBonus: character.proficiency_bonus,
              skills: character.skills,
              equipment: character.equipment || [],
              modifiers,
            }}
          />
        </div>
      </main>
    </div>
  );
}
