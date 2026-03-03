import Link from 'next/link';
import { Search, Users, Eye, TrendingUp, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  toCommunityCharacter,
  calculateLibraryStats,
  type CommunityCharacter,
} from '@/lib/data/community-library';
import { LibraryFiltersPanel } from '@/app/components/library/library-filters-panel';
import { CharacterLibraryCard } from '@/app/components/library/character-library-card';

export default async function CommunityLibraryPage() {
  const supabase = await createClient();

  // Buscar todos os personagens com compartilhamento público
  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .not('character_share', 'is', null);

  // Filtrar apenas públicos e converter
  const communityCharacters: CommunityCharacter[] = (characters || [])
    .map(toCommunityCharacter)
    .filter((char): char is CommunityCharacter => char !== null);

  // Calcular estatísticas
  const stats = calculateLibraryStats(communityCharacters);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Voltar</Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Biblioteca da Comunidade</h1>
            <p className="text-sm text-muted-foreground">
              Personagens compartilhados pela comunidade
            </p>
          </div>
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            {stats.totalCharacters} personagens
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-3xl font-bold">{stats.totalCharacters}</p>
                  <p className="text-sm text-muted-foreground">Personagens</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Eye className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-3xl font-bold">{stats.totalViews}</p>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-3xl font-bold">{stats.mostPopularClass}</p>
                  <p className="text-sm text-muted-foreground">Classe Popular</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-3xl font-bold">Nível {stats.averageLevel}</p>
                  <p className="text-sm text-muted-foreground">Nível Médio</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Grid */}
          <LibraryFiltersPanel characters={communityCharacters} />

          {/* Empty State */}
          {communityCharacters.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <Users className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h2 className="mt-4 text-2xl font-bold">Nenhum personagem público ainda</h2>
                  <p className="mt-2 text-muted-foreground">
                    Seja o primeiro a compartilhar seu personagem com a comunidade!
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/">Meus Personagens</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
