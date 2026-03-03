'use client';

import { useState } from 'react';
import { Filter, X, RotateCcw, Search } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
  type SpellFilters,
  type SpellSortBy,
  DEFAULT_FILTERS,
  countActiveFilters,
  SCHOOL_LABELS,
  CASTING_TIME_LABELS,
  RANGE_LABELS,
  FILTER_PRESETS,
} from '@/lib/data/spell-filters';
import type { SpellSchool, CastingTime } from '@/lib/data/spells';

interface SpellFiltersPanelProps {
  filters: SpellFilters;
  sortBy: SpellSortBy;
  onFiltersChange: (filters: SpellFilters) => void;
  onSortChange: (sortBy: SpellSortBy) => void;
}

export function SpellFiltersPanel({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
}: SpellFiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  const handleReset = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const handlePreset = (preset: SpellFilters) => {
    onFiltersChange(preset);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Buscar magias..."
          className="pl-9"
        />
      </div>

      {/* Sort */}
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SpellSortBy)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Nome</SelectItem>
          <SelectItem value="level">Nível</SelectItem>
          <SelectItem value="school">Escola</SelectItem>
          <SelectItem value="castingTime">Tempo</SelectItem>
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
            <SheetTitle>Filtros de Magias</SheetTitle>
            <SheetDescription>
              Refine sua busca com filtros avançados
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Filtros Rápidos</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.combatSpells)}
                >
                  ⚔️ Combate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.healingSpells)}
                >
                  ❤️ Cura
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.defenseSpells)}
                >
                  🛡️ Defesa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.utilitySpells)}
                >
                  🔧 Utilitárias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.quickSpells)}
                >
                  ⚡ Rápidas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(FILTER_PRESETS.noConcentration)}
                >
                  🧠 Sem Concentração
                </Button>
              </div>
            </div>

            {/* School */}
            <div className="space-y-2">
              <Label htmlFor="school">Escola de Magia</Label>
              <Select
                value={filters.school}
                onValueChange={(v) =>
                  onFiltersChange({ ...filters, school: v as SpellSchool | 'all' })
                }
              >
                <SelectTrigger id="school">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.entries(SCHOOL_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Nível da Magia</Label>
              <Select
                value={filters.level.toString()}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    level: v === 'all' ? 'all' : parseInt(v),
                  })
                }
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="0">Truques</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                    <SelectItem key={lvl} value={lvl.toString()}>
                      Nível {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Casting Time */}
            <div className="space-y-2">
              <Label htmlFor="castingTime">Tempo de Conjuração</Label>
              <Select
                value={filters.castingTime}
                onValueChange={(v) =>
                  onFiltersChange({ ...filters, castingTime: v as CastingTime | 'all' })
                }
              >
                <SelectTrigger id="castingTime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer</SelectItem>
                  {Object.entries(CASTING_TIME_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Range */}
            <div className="space-y-2">
              <Label htmlFor="range">Alcance</Label>
              <Select
                value={filters.range}
                onValueChange={(v) =>
                  onFiltersChange({ ...filters, range: v as typeof filters.range })
                }
              >
                <SelectTrigger id="range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RANGE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="concentration">Requer Concentração</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.concentration === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, concentration: true })}
                  >
                    Sim
                  </Button>
                  <Button
                    variant={filters.concentration === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, concentration: false })}
                  >
                    Não
                  </Button>
                  <Button
                    variant={filters.concentration === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, concentration: 'all' })}
                  >
                    Ambos
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ritual">Ritual</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.ritual === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, ritual: true })}
                  >
                    Sim
                  </Button>
                  <Button
                    variant={filters.ritual === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, ritual: false })}
                  >
                    Não
                  </Button>
                  <Button
                    variant={filters.ritual === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, ritual: 'all' })}
                  >
                    Ambos
                  </Button>
                </div>
              </div>
            </div>

            {/* Components */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Componentes</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="verbal" className="text-sm">
                    Verbal (V)
                  </Label>
                  <Switch
                    id="verbal"
                    checked={filters.components.verbal === true}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        components: { ...filters.components, verbal: checked ? true : 'all' },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="somatic" className="text-sm">
                    Somático (S)
                  </Label>
                  <Switch
                    id="somatic"
                    checked={filters.components.somatic === true}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        components: { ...filters.components, somatic: checked ? true : 'all' },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="material" className="text-sm">
                    Material (M)
                  </Label>
                  <Switch
                    id="material"
                    checked={filters.components.material === true}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        components: { ...filters.components, material: checked ? true : 'all' },
                      })
                    }
                  />
                </div>
              </div>
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
  );
}
