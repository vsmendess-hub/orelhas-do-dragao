'use client';

import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { RACES, type Race } from '@/lib/data/races';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Step1Race() {
  const { characterData, updateCharacterData } = useWizard();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar raças pela busca
  const filteredRaces = RACES.filter((race) =>
    race.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selecionar raça
  const selectRace = (raceId: string) => {
    updateCharacterData({
      race: raceId,
      subrace: undefined, // Resetar sub-raça ao mudar raça
    });
  };

  // Formatar bônus para display
  const formatBonuses = (race: Race) => {
    const bonuses: string[] = [];
    if (race.bonuses.str) bonuses.push(`FOR +${race.bonuses.str}`);
    if (race.bonuses.dex) bonuses.push(`DES +${race.bonuses.dex}`);
    if (race.bonuses.con) bonuses.push(`CON +${race.bonuses.con}`);
    if (race.bonuses.int) bonuses.push(`INT +${race.bonuses.int}`);
    if (race.bonuses.wis) bonuses.push(`SAB +${race.bonuses.wis}`);
    if (race.bonuses.cha) bonuses.push(`CAR +${race.bonuses.cha}`);
    return bonuses.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">🎭</p>
        <h2 className="mt-4 text-2xl font-bold">Escolha sua Raça</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua raça determina seus bônus de atributos e características especiais.
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar raça..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid de Raças */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRaces.map((race) => {
          const isSelected = characterData.race === race.id;

          return (
            <Card
              key={race.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-2 border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                  : 'border hover:border-deep-purple/50'
              }`}
              onClick={() => selectRace(race.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{race.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {race.size} • {race.speed} pés
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-purple text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">{race.description}</p>

                {/* Bônus de Atributos */}
                <div className="rounded-md bg-muted px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">Bônus de Atributos</p>
                  <p className="mt-1 text-sm font-semibold">{formatBonuses(race)}</p>
                </div>

                {/* Indicador de Sub-raças */}
                {race.subraces && race.subraces.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-medium">👥</span>
                    <span>{race.subraces.length} sub-raças disponíveis</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem se não encontrar raças */}
      {filteredRaces.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma raça encontrada com &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      {/* Info sobre seleção atual */}
      {characterData.race && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Raça selecionada: {RACES.find((r) => r.id === characterData.race)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
