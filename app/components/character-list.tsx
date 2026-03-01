'use client';

import Link from 'next/link';
import { Loader2, Plus, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hit_points: {
    current: number;
    max: number;
  };
  armor_class: number;
}

interface CharacterListProps {
  characters: Character[];
  isLoading?: boolean;
}

export function CharacterList({ characters, isLoading = false }: CharacterListProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-deep-purple" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (characters.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Sword className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle>Nenhum Personagem Criado</CardTitle>
            <CardDescription>
              Você ainda não criou nenhum personagem. Comece sua aventura agora!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/personagens/novo">
                <Plus className="mr-2 h-5 w-5" />
                Criar Primeiro Personagem
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Characters Grid
  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meus Personagens</h2>
          <p className="text-sm text-muted-foreground">
            {characters.length} {characters.length === 1 ? 'personagem' : 'personagens'}
          </p>
        </div>
        <Button asChild>
          <Link href="/personagens/novo">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo
          </Link>
        </Button>
      </div>

      {/* Characters Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.map((character) => (
          <Link key={character.id} href={`/personagens/${character.id}`}>
            <Card className="transition-all hover:shadow-lg hover:border-deep-purple/50 cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{character.name}</CardTitle>
                    <CardDescription>
                      {character.race} • {character.class}
                    </CardDescription>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-purple/10 text-lg font-bold text-deep-purple">
                    {character.level}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Pontos de Vida</p>
                    <p className="font-semibold">
                      {character.hit_points.current} / {character.hit_points.max}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">CA</p>
                    <p className="font-semibold">{character.armor_class}</p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all"
                      style={{
                        width: `${(character.hit_points.current / character.hit_points.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
