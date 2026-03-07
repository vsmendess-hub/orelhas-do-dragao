'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Search } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { RACES, type Race } from '@/lib/data/races';
import { Input } from '@/components/ui/input';

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
            <div
              key={race.id}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-purple-500 bg-purple-500/10 scale-105'
                  : 'hover:scale-105 hover:border-purple-500/50'
              }`}
              onClick={() => selectRace(race.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Imagem circular da raça */}
                {race.image && (
                  <div className="flex-shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-purple-400">
                      <Image
                        src={race.image}
                        alt={race.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{race.name}</h3>
                      <p className="text-xs text-gray-400">
                        {race.size} • {Math.round((race.speed * 0.3048) * 10) / 10} m
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">{race.description}</p>

                {/* Bônus de Atributos */}
                <div className="glass-card-light rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-400">Bônus de Atributos</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatBonuses(race)}</p>
                </div>

                {/* Indicador de Sub-raças */}
                {race.subraces && race.subraces.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="font-medium">👥</span>
                    <span>{race.subraces.length} sub-raças disponíveis</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem se não encontrar raças */}
      {filteredRaces.length === 0 && (
        <div className="glass-card-light rounded-xl border-2 border-dashed border-purple-500/30 p-12 text-center">
          <p className="text-gray-300">
            Nenhuma raça encontrada com &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      {/* Info sobre seleção atual */}
      {characterData.race && (
        <div className="glass-card-light rounded-xl border border-green-400/50 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" />
            <p className="text-sm font-medium text-green-100">
              Raça selecionada: {RACES.find((r) => r.id === characterData.race)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
