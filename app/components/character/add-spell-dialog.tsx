'use client';

import { useState } from 'react';
import { Search, Plus, Filter, Wand2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getSpellsByClass } from '@/lib/data/all-spells';
import { formatSpellLevel, formatComponents, SPELL_SCHOOLS, type Spell } from '@/lib/data/spells';

interface AddSpellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterClass: string;
  onAddSpell: (spell: Spell) => void;
  existingSpellIds: string[];
}

export function AddSpellDialog({
  open,
  onOpenChange,
  characterClass,
  onAddSpell,
  existingSpellIds,
}: AddSpellDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [showDetails, setShowDetails] = useState(false); // Para mobile

  // Buscar magias da classe
  const classSpells = getSpellsByClass(characterClass);

  // Aplicar filtros
  let filteredSpells = classSpells.filter((spell) => {
    const matchesSearch = spell.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || spell.level === parseInt(filterLevel);
    const matchesSchool = filterSchool === 'all' || spell.school === filterSchool;
    const notOwned = !existingSpellIds.includes(spell.id);

    return matchesSearch && matchesLevel && matchesSchool && notOwned;
  });

  // Ordenar por nível e nome
  filteredSpells = filteredSpells.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  });

  const handleAddSpell = () => {
    if (selectedSpell) {
      onAddSpell(selectedSpell);
      setSelectedSpell(null);
      setSearchQuery('');
      setShowDetails(false);
      onOpenChange(false);
    }
  };

  const handleSelectSpell = (spell: Spell) => {
    setSelectedSpell(spell);
    setShowDetails(true); // No mobile, ir para aba de detalhes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden flex flex-col p-0 sm:p-6 gap-0 sm:gap-4">
        {/* Header Mobile com Botão Voltar */}
        <div className="lg:hidden p-4 border-b">
          {showDetails && selectedSpell ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(false)}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base truncate">Detalhes da Magia</DialogTitle>
                <DialogDescription className="text-xs truncate">
                  {selectedSpell.name}
                </DialogDescription>
              </div>
            </div>
          ) : (
            <>
              <DialogTitle className="text-base">Adicionar Magia</DialogTitle>
              <DialogDescription className="text-xs">
                Escolha uma magia para {characterClass}
              </DialogDescription>
            </>
          )}
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <DialogHeader>
            <DialogTitle className="text-xl">Adicionar Magia</DialogTitle>
            <DialogDescription>
              Escolha uma magia disponível para {characterClass}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Filtros - Só aparece na lista (mobile) ou sempre (desktop) */}
        <div className={`space-y-3 px-4 lg:px-0 ${showDetails ? 'hidden lg:block' : 'block'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar magia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Nível</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="0">Cantrips</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}º Círculo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Escola</Label>
              <Select value={filterSchool} onValueChange={setFilterSchool}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.keys(SPELL_SCHOOLS).map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Layout: Mobile usa view condicional, Desktop usa 2 colunas */}
        <div className="flex-1 min-h-0 lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Lista de Magias */}
          <div
            className={`flex flex-col min-h-0 px-4 lg:px-0 ${showDetails ? 'hidden lg:flex' : 'flex'}`}
          >
            <p className="text-xs text-muted-foreground mb-2">
              {filteredSpells.length} {filteredSpells.length === 1 ? 'magia' : 'magias'}
            </p>
            <div className="flex-1 overflow-y-auto space-y-2 lg:pr-2">
              {filteredSpells.length > 0 ? (
                filteredSpells.map((spell) => {
                  const isSelected = selectedSpell?.id === spell.id;
                  const schoolInfo = SPELL_SCHOOLS[spell.school];

                  return (
                    <div
                      key={spell.id}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border hover:border-purple-500/50 hover:bg-accent active:scale-[0.98]'
                      }`}
                      onClick={() => handleSelectSpell(spell)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{spell.name}</h4>
                        {spell.source && (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {spell.source}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">
                          {formatSpellLevel(spell.level)}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {schoolInfo.icon} {spell.school}
                        </Badge>
                        {spell.concentration && (
                          <Badge variant="secondary" className="text-[10px]">
                            Concentração
                          </Badge>
                        )}
                        {spell.ritual && (
                          <Badge variant="secondary" className="text-[10px]">
                            Ritual
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || filterLevel !== 'all' || filterSchool !== 'all'
                      ? 'Nenhuma magia encontrada'
                      : 'Todas as magias já foram adicionadas'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes da Magia Selecionada */}
          <div
            className={`flex flex-col min-h-0 px-4 lg:px-0 lg:border-l lg:pl-4 ${showDetails ? 'flex' : 'hidden lg:flex'}`}
          >
            {selectedSpell ? (
              <>
                <h4 className="hidden lg:block font-semibold text-base mb-3">Detalhes da Magia</h4>
                <div className="flex-1 overflow-y-auto space-y-4 lg:pr-2 pb-4">
                  {/* Informações Básicas */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold">{selectedSpell.name}</h3>
                      {selectedSpell.source && selectedSpell.page && (
                        <Badge variant="outline">
                          {selectedSpell.source} p.{selectedSpell.page}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold text-muted-foreground">Nível:</span>{' '}
                        {formatSpellLevel(selectedSpell.level)}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Escola:</span>{' '}
                        {selectedSpell.school}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Tempo:</span>{' '}
                        {selectedSpell.castingTime}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Alcance:</span>{' '}
                        {selectedSpell.range}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Duração:</span>{' '}
                        {selectedSpell.duration}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Componentes:</span>{' '}
                        {formatComponents(selectedSpell.components)}
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm">Descrição:</h5>
                    <p className="text-sm leading-relaxed">{selectedSpell.description}</p>
                  </div>

                  {/* Em Níveis Superiores */}
                  {selectedSpell.atHigherLevels && (
                    <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 space-y-1">
                      <h5 className="font-semibold text-sm text-purple-700 dark:text-purple-300">
                        Em Níveis Superiores:
                      </h5>
                      <p className="text-sm leading-relaxed">{selectedSpell.atHigherLevels}</p>
                    </div>
                  )}

                  {/* Componentes Materiais */}
                  {selectedSpell.components.material &&
                    selectedSpell.components.materialDescription && (
                      <div className="rounded-lg bg-accent p-3 space-y-1">
                        <h5 className="font-semibold text-sm">Componente Material:</h5>
                        <p className="text-sm text-muted-foreground">
                          {selectedSpell.components.materialDescription}
                        </p>
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="space-y-2">
                  <Wand2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Selecione uma magia da lista para ver os detalhes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="border-t p-4 lg:pt-4 lg:px-0 lg:pb-0">
          {/* Mobile: Botões diferentes dependendo da view */}
          <div className="flex lg:hidden flex-col gap-2">
            {showDetails && selectedSpell ? (
              <>
                <Button
                  onClick={handleAddSpell}
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Magia
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)} className="w-full">
                  Voltar para Lista
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Cancelar
              </Button>
            )}
          </div>

          {/* Desktop: Botões normais */}
          <div className="hidden lg:flex flex-row justify-between gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddSpell}
              disabled={!selectedSpell}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
