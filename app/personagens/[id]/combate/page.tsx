import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Swords } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { InitiativeTracker } from '@/app/components/combat/initiative-tracker';
import { QuickActions } from '@/app/components/combat/quick-actions';
import { calculateModifier } from '@/lib/data/point-buy';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CombatPage({ params }: PageProps) {
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

  // Calcular iniciativa (DEX modifier)
  const dexModifier = calculateModifier(character.attributes.dex);
  const initiative = dexModifier;

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
              <p className="text-xs text-gray-400">Sistema de Combate</p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header de Combate */}
          <div>
            <h2 className="flex items-center gap-2 text-3xl font-bold text-white">
              <Swords className="h-8 w-8 text-red-400" />
              Gerenciador de Combate
            </h2>
            <p className="mt-2 text-gray-300">
              Rastreie iniciativa, turnos e status dos combatentes
            </p>
          </div>

          {/* Initiative Tracker */}
          <InitiativeTracker characterName={character.name} characterInitiative={initiative} />

          {/* Quick Actions */}
          <QuickActions characterClass={character.class} />

          {/* Combat Info Card */}
          <div className="glass-card-light rounded-xl p-4 text-sm">
            <h3 className="mb-2 font-semibold text-white">⚔️ Dicas de Combate:</h3>
            <ul className="space-y-1 text-gray-300">
              <li>• Clique em &quot;Iniciar Combate&quot; para começar rastrear iniciativa</li>
              <li>• Adicione inimigos e aliados com o botão &quot;Adicionar&quot;</li>
              <li>• Use as setas para avançar/voltar turnos</li>
              <li>• O combatente destacado é o turno atual</li>
              <li>• Use +/- para ajustar HP de criaturas rapidamente</li>
              <li>• A ordem é automática por iniciativa (maior primeiro)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
