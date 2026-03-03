import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center gap-4 px-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/personagens/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{character.name} - Magias</h1>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4">
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Wand2 className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Classe Não-Conjuradora</h2>
            <p className="mt-2 text-muted-foreground">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/personagens/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{character.name} - Magias</h1>
            <p className="text-sm text-muted-foreground">
              {character.class} Nível {character.level}
            </p>
          </div>
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
        />
      </main>
    </div>
  );
}
