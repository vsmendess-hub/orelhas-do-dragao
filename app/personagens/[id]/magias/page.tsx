import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpellsManager } from '@/app/components/character/spells-manager';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import {
  EMPTY_SPELL_SLOTS,
  EMPTY_SPELLCASTER_INFO,
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
  getSpellcastingAbility,
  type SpellSlots,
  type SpellcasterInfo,
  type Spell,
} from '@/lib/data/spells';

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

  // Preparar dados de magias
  const spells: Spell[] = character.spells || [];
  const spellSlots: SpellSlots = character.spell_slots || EMPTY_SPELL_SLOTS;

  // Calcular informações de conjurador
  const spellcastingAbility = getSpellcastingAbility(character.class);
  const abilityModifier = calculateModifier(character.attributes[spellcastingAbility]);
  const spellSaveDC = calculateSpellSaveDC(character.proficiency_bonus, abilityModifier);
  const spellAttackBonus = calculateSpellAttackBonus(character.proficiency_bonus, abilityModifier);

  const spellcasterInfo: SpellcasterInfo = {
    spellcastingAbility,
    spellSaveDC,
    spellAttackBonus,
  };

  // Nome do atributo de conjuração
  const abilityNames: Record<string, string> = {
    int: 'Inteligência',
    wis: 'Sabedoria',
    cha: 'Carisma',
  };

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
              <p className="text-xs text-muted-foreground">Sistema de Magias</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header de Magias */}
          <div>
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              <Wand2 className="h-8 w-8" />
              Grimório de Magias
            </h2>
            <p className="mt-2 text-muted-foreground">
              Gerencie suas magias, espaços de magia e prepare suas conjurações
            </p>
          </div>

          {/* Informações de Conjurador */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Atributo de Conjuração</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {abilityNames[spellcastingAbility]} {formatModifier(abilityModifier)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">CD de Resistência</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{spellSaveDC}</p>
                <p className="text-xs text-muted-foreground">
                  8 + Prof ({character.proficiency_bonus}) + Mod ({formatModifier(abilityModifier)})
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Bônus de Ataque com Magia</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatModifier(spellAttackBonus)}</p>
                <p className="text-xs text-muted-foreground">
                  Prof ({character.proficiency_bonus}) + Mod ({formatModifier(abilityModifier)})
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gerenciador de Magias */}
          <SpellsManager
            characterId={id}
            characterClass={character.class}
            characterLevel={character.level}
            spellcastingModifier={abilityModifier}
            proficiencyBonus={character.proficiency_bonus}
            initialSpells={spells}
            initialSpellSlots={spellSlots}
            spellcasterInfo={spellcasterInfo}
          />
        </div>
      </main>
    </div>
  );
}
