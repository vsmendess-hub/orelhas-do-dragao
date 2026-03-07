'use client';

import Link from 'next/link';
import { Loader2, Plus, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CharacterPortrait } from './character/character-portrait';

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
  avatar_url?: string;
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
        <div className="glass-card max-w-md rounded-2xl p-8 border-2 border-dashed border-purple-500/30">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
              <Sword className="h-10 w-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum Personagem Criado</h2>
            <p className="text-gray-400 mb-6">
              Você ainda não criou nenhum personagem. Comece sua aventura agora!
            </p>
            <Button asChild size="lg" className="w-full tab-purple">
              <Link href="/personagens/novo">
                <Plus className="mr-2 h-5 w-5" />
                Criar Primeiro Personagem
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Characters Grid
  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Meus Personagens</h2>
          <p className="text-sm text-gray-400">
            {characters.length} {characters.length === 1 ? 'personagem' : 'personagens'}
          </p>
        </div>
        <Button asChild className="tab-purple">
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
            <div className="glass-card rounded-2xl p-6 transition-all hover:scale-105 hover:border-purple-500/50 cursor-pointer h-full group">
              <div className="flex items-start gap-4">
                {/* Character Avatar */}
                <CharacterPortrait
                  name={character.name}
                  avatarUrl={character.avatar_url}
                  size="md"
                  className="flex-shrink-0"
                />

                {/* Character Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl truncate font-bold text-white group-hover:text-purple-300 transition-colors">
                        {character.name}
                      </h3>
                      <p className="truncate text-sm text-gray-400">
                        {character.race} • {character.class}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-lg font-bold text-purple-300">
                      {character.level}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex gap-4 text-sm">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Pontos de Vida</p>
                    <p className="font-semibold text-white">
                      {character.hit_points.current} / {character.hit_points.max}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">CA</p>
                    <p className="font-semibold text-white">{character.armor_class}</p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all"
                      style={{
                        width: `${(character.hit_points.current / character.hit_points.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
