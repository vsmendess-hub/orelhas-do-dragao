import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { SpellManager } from '@/app/components/character/spell-manager';
import { getSpellcastingAbility } from '@/lib/data/spells';
import { isSpellcaster } from '@/lib/data/spell-progression';
import { calculateModifier } from '@/lib/data/point-buy';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpellsPage({ params }: PageProps) {
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

  // Verificar se é conjurador
  if (!isSpellcaster(character.class)) {
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

        <header className="glass-card border-0 rounded-none backdrop-blur-xl">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href={`/personagens/${id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-white">{character.name} - Magias</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto py-8 px-4">
          <div className="glass-card rounded-2xl p-12 text-center border-2 border-dashed border-purple-500/30">
            <Wand2 className="mx-auto h-16 w-16 text-purple-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">Classe Não-Conjuradora</h2>
            <p className="mt-2 text-gray-300">
              {character.class} não é uma classe conjuradora de magias.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Obter atributo de conjuração
  const spellcastingAbility = getSpellcastingAbility(character.class);
  const spellcastingModifier = spellcastingAbility
    ? calculateModifier(character.attributes[spellcastingAbility])
    : 0;

  // Magias do personagem
  const characterSpells = character.spells || [];
  const spellSlots = character.spell_slots || [];
  const spellFavorites = character.spell_favorites || [];

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
              <h1 className="text-xl font-bold">{character.name} - Magias</h1>
              <p className="text-sm text-muted-foreground">
                {character.class} Nível {character.level}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <SpellManager
          characterId={id}
          characterClass={character.class}
          characterLevel={character.level}
          proficiencyBonus={character.proficiency_bonus}
          spellcastingAbility={spellcastingAbility}
          spellcastingModifier={spellcastingModifier}
          attributes={character.attributes}
          initialSpells={characterSpells}
          initialSpellSlots={spellSlots}
          initialFavorites={spellFavorites}
        />
      </main>
    </div>
  );
}
