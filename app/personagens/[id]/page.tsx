import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Shield, Zap, Dices } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import { HPManager } from '@/app/components/character/hp-manager';
import { DeleteCharacterDialog } from '@/app/components/character/delete-character-dialog';

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

interface CharacterSkill {
  name: string;
  attribute: string;
  proficient: boolean;
  expertise: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: PageProps) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <DeleteCharacterDialog characterId={id} characterName={character.name} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Character Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold">{character.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {character.race}
                {character.subrace && ` (${character.subrace})`} • {character.class}
                {character.archetype && ` - ${character.archetype}`}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="rounded-md bg-deep-purple/10 px-2 py-1 font-medium text-deep-purple">
                  Nível {character.level}
                </span>
                <span className="text-muted-foreground">{character.alignment}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Combat Stats */}
          <div className="space-y-6 lg:col-span-2">
            {/* Combat Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* HP Manager - Ocupa 2 colunas */}
              <div className="md:col-span-2">
                <HPManager characterId={id} hitPoints={character.hit_points} />
              </div>

              {/* Outros stats - 1 coluna cada */}
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Shield className="h-4 w-4" />
                    Classe de Armadura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{character.armor_class}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Zap className="h-4 w-4" />
                    Iniciativa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatModifier(character.initiative)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha com proficiency bonus centralizado */}
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Dices className="h-4 w-4" />
                    Bônus Proficiência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">+{character.proficiency_bonus}</p>
                </CardContent>
              </Card>
            </div>

            {/* Attributes */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {(Object.keys(character.attributes) as Array<keyof typeof modifiers>).map(
                    (attr) => (
                      <div key={attr} className="rounded-lg border bg-muted/50 p-4 text-center">
                        <p className="text-xs font-medium text-muted-foreground">
                          {ABILITY_NAMES[attr]}
                        </p>
                        <p className="mt-2 text-3xl font-bold">{character.attributes[attr]}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatModifier(modifiers[attr])}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Perícias</CardTitle>
                <CardDescription>
                  Proficiências e bônus aplicados ({character.skills.length} perícias)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {character.skills.map((skill: CharacterSkill, index: number) => {
                    const attrMod = modifiers[skill.attribute as keyof typeof modifiers] || 0;
                    const bonus = attrMod + character.proficiency_bonus;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border bg-card p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-deep-purple/10 text-xs font-medium text-deep-purple">
                            ✓
                          </div>
                          <div>
                            <p className="text-sm font-medium">{skill.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {
                                ABILITY_ABBREVIATIONS[
                                  skill.attribute as keyof typeof ABILITY_ABBREVIATIONS
                                ]
                              }
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold">{formatModifier(bonus)}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Speed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deslocamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{character.speed} pés</p>
                <p className="text-xs text-muted-foreground">por turno</p>
              </CardContent>
            </Card>

            {/* XP */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experiência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{character.experience_points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">pontos de experiência</p>
              </CardContent>
            </Card>

            {/* Inspiration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inspiração</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {character.inspiration ? '⭐ Ativo' : '○ Inativo'}
                </p>
              </CardContent>
            </Card>

            {/* Proficiencies */}
            {character.proficiencies && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proficiências</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {character.proficiencies.weapons?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Armas</p>
                      <p className="text-sm">{character.proficiencies.weapons.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.armor?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Armaduras</p>
                      <p className="text-sm">{character.proficiencies.armor.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.tools?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Ferramentas</p>
                      <p className="text-sm">{character.proficiencies.tools.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.languages?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Idiomas</p>
                      <p className="text-sm">{character.proficiencies.languages.join(', ')}</p>
                    </div>
                  )}
                  {(!character.proficiencies.weapons ||
                    character.proficiencies.weapons.length === 0) &&
                    (!character.proficiencies.armor ||
                      character.proficiencies.armor.length === 0) &&
                    (!character.proficiencies.tools ||
                      character.proficiencies.tools.length === 0) &&
                    (!character.proficiencies.languages ||
                      character.proficiencies.languages.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma proficiência adicional
                      </p>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {character.features && character.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Características</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {character.features.map((feature: string, index: number) => (
                      <div key={index} className="rounded-md bg-muted/50 p-2 text-sm">
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
