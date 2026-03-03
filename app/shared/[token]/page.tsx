import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Users, Copy, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import {
  validateShareAccess,
  incrementViewCount,
  type CharacterShare,
} from '@/lib/data/character-sharing';

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

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedCharacterPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Obter usuário atual (pode ser null se não estiver logado)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Buscar personagem pelo token de compartilhamento
  const { data: characters, error } = await supabase
    .from('characters')
    .select('*')
    .not('character_share', 'is', null);

  if (error || !characters) {
    notFound();
  }

  // Encontrar personagem com o token correto
  const character = characters.find((c) => c.character_share?.shareToken === token);

  if (!character || !character.character_share) {
    notFound();
  }

  const share: CharacterShare = character.character_share;

  // Validar acesso
  const access = validateShareAccess(share, user?.id || null);

  if (!access.canView) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center gap-4 px-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Início
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Acesso Negado</h1>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4">
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Shield className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Acesso Negado</h2>
            <p className="mt-2 text-muted-foreground">{access.reason}</p>
          </div>
        </main>
      </div>
    );
  }

  // Incrementar view count (async, não bloqueia)
  if (user?.id !== share.ownerId) {
    const updatedShare = incrementViewCount(share);
    supabase
      .from('characters')
      .update({ character_share: updatedShare })
      .eq('id', character.id)
      .then(() => {});
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
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Início
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{character.name}</h1>
            <p className="text-sm text-muted-foreground">
              {character.race} - {character.class} Nível {character.level}
            </p>
          </div>
          <Badge variant="secondary">
            <Eye className="mr-1 h-3 w-3" />
            Visualização
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Owner Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  Compartilhado por <strong>{share.ownerName}</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Character Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Raça:</span>
                  <span className="font-semibold">{character.race}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classe:</span>
                  <span className="font-semibold">{character.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nível:</span>
                  <span className="font-semibold">{character.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Antecedente:</span>
                  <span className="font-semibold">{character.background}</span>
                </div>
                {character.alignment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tendência:</span>
                    <span className="font-semibold">{character.alignment}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HP:</span>
                  <span className="font-semibold">
                    {character.current_hp}/{character.max_hp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CA:</span>
                  <span className="font-semibold">{character.armor_class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Iniciativa:</span>
                  <span className="font-semibold">{formatModifier(modifiers.dex)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deslocamento:</span>
                  <span className="font-semibold">{character.speed} pés</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bônus de Proficiência:</span>
                  <span className="font-semibold">{formatModifier(character.proficiency_bonus)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ability Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Atributos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(ABILITY_ABBREVIATIONS).map(([key, abbr]) => {
                  const score = character.attributes[key as keyof typeof character.attributes];
                  const modifier = modifiers[key as keyof typeof modifiers];

                  return (
                    <div key={key} className="text-center">
                      <div className="rounded-lg border-2 bg-card p-4">
                        <p className="text-xs font-bold text-muted-foreground">{abbr}</p>
                        <p className="text-2xl font-bold">{score}</p>
                        <p className="text-sm text-muted-foreground">{formatModifier(modifier)}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ABILITY_NAMES[key as keyof typeof ABILITY_NAMES]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {access.canClone && (
            <Card className="border-2 border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-blue-600" />
                  Clonar Personagem
                </CardTitle>
                <CardDescription>
                  Você pode criar uma cópia deste personagem para sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  Clonar para Minha Conta
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Read-only Notice */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <p className="text-center text-sm text-muted-foreground">
                Esta é uma visualização somente leitura. Para editar, você precisa ser o dono do
                personagem.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
