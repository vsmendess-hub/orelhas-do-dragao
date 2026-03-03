'use client';

import { useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  applyLibraryFilters,
  countActiveLibraryFilters,
  resetLibraryFilters,
  DEFAULT_LIBRARY_FILTERS,
  SORT_LABELS,
  DND_CLASSES,
  DND_RACES,
  type CommunityCharacter,
  type LibraryFilters,
  type LibrarySortBy,
} from '@/lib/data/community-library';
import { CharacterLibraryCard } from './character-library-card';

interface LibraryFiltersPanelProps {
  characters: CommunityCharacter[];
}

export function LibraryFiltersPanel({ characters }: LibraryFiltersPanelProps) {
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_LIBRARY_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCharacters = applyLibraryFilters(characters, filters);
  const activeCount = countActiveLibraryFilters(filters);

  const handleReset = () => {
    setFilters(resetLibraryFilters());
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Buscar personagens..."
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => setFilters({ ...filters, sortBy: v as LibrarySortBy })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Refine sua busca na biblioteca</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Select
                  value={filters.class}
                  onValueChange={(v) => setFilters({ ...filters, class: v })}
                >
                  <SelectTrigger id="class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {DND_CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Race */}
              <div className="space-y-2">
                <Label htmlFor="race">Raça</Label>
                <Select
                  value={filters.race}
                  onValueChange={(v) => setFilters({ ...filters, race: v })}
                >
                  <SelectTrigger id="race">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {DND_RACES.map((race) => (
                      <SelectItem key={race} value={race}>
                        {race}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Min */}
              <div className="space-y-2">
                <Label htmlFor="levelMin">Nível Mínimo</Label>
                <Select
                  value={filters.levelMin.toString()}
                  onValueChange={(v) =>
                    setFilters({ ...filters, levelMin: v === 'all' ? 'all' : parseInt(v) })
                  }
                >
                  <SelectTrigger id="levelMin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer</SelectItem>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                      <SelectItem key={lvl} value={lvl.toString()}>
                        Nível {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Max */}
              <div className="space-y-2">
                <Label htmlFor="levelMax">Nível Máximo</Label>
                <Select
                  value={filters.levelMax.toString()}
                  onValueChange={(v) =>
                    setFilters({ ...filters, levelMax: v === 'all' ? 'all' : parseInt(v) })
                  }
                >
                  <SelectTrigger id="levelMax">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer</SelectItem>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                      <SelectItem key={lvl} value={lvl.toString()}>
                        Nível {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset */}
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredCharacters.length} de {characters.length} personagens
        </p>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Character Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <CharacterLibraryCard key={character.id} character={character} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Nenhum personagem encontrado</p>
          <p className="text-xs text-muted-foreground">Tente ajustar os filtros</p>
        </div>
      )}
    </div>
  );
}
