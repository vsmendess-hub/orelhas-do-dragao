'use client';

import Link from 'next/link';
import { Heart, Shield, Zap, AlertCircle, Users as UsersIcon, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  hit_points: {
    current: number;
    max: number;
    temporary: number;
  };
  armor_class: number;
  initiative: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  conditions?: Array<{ type: string; active: boolean }>;
  companions?: Array<{ active: boolean }>;
}

interface PartyDashboardProps {
  characters: Character[];
}

export function PartyDashboard({ characters }: PartyDashboardProps) {
  const renderCharacterCard = (character: Character) => {
    const hpPercentage = (character.hit_points.current / character.hit_points.max) * 100;
    const isLowHP = hpPercentage < 30;
    const isDead = character.hit_points.current === 0;
    const activeConditions = character.conditions?.filter((c) => c.active).length || 0;
    const activeCompanions = character.companions?.filter((c) => c.active).length || 0;

    const getHPColor = () => {
      if (hpPercentage >= 75) return 'bg-green-500';
      if (hpPercentage >= 50) return 'bg-yellow-500';
      if (hpPercentage >= 25) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <Card
        key={character.id}
        className={`transition-all hover:shadow-lg ${
          isDead ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{character.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {character.race} • {character.class}
              </p>
            </div>
            <Badge variant="secondary">Nv. {character.level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* HP Bar */}
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 font-medium">
                <Heart className="h-4 w-4 text-red-500" />
                Pontos de Vida
              </span>
              <span className={isLowHP ? 'text-red-600 dark:text-red-400' : ''}>
                {character.hit_points.current}/{character.hit_points.max}
                {character.hit_points.temporary > 0 && (
                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                    (+{character.hit_points.temporary})
                  </span>
                )}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all ${getHPColor()}`}
                style={{ width: `${Math.min(100, hpPercentage)}%` }}
              />
            </div>
          </div>

          {/* Combat Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border bg-muted/50 p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                CA
              </div>
              <p className="mt-1 text-lg font-bold">{character.armor_class}</p>
            </div>
            <div className="rounded-md border bg-muted/50 p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                Iniciativa
              </div>
              <p className="mt-1 text-lg font-bold">{formatModifier(character.initiative)}</p>
            </div>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-6 gap-1 text-center">
            {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((attr) => {
              const modifier = calculateModifier(character.attributes[attr]);
              return (
                <div key={attr} className="rounded-md bg-muted/50 p-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">{attr}</p>
                  <p className="text-xs font-bold">{formatModifier(modifier)}</p>
                </div>
              );
            })}
          </div>

          {/* Status Indicators */}
          {(activeConditions > 0 || activeCompanions > 0 || isDead) && (
            <div className="flex flex-wrap gap-2">
              {isDead && (
                <Badge variant="destructive" className="text-xs">
                  💀 Morto
                </Badge>
              )}
              {activeConditions > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  {activeConditions} condição{activeConditions > 1 ? 'ões' : ''}
                </Badge>
              )}
              {activeCompanions > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <UsersIcon className="mr-1 h-3 w-3" />
                  {activeCompanions} companheiro{activeCompanions > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <Button asChild className="w-full" size="sm">
            <Link href={`/personagens/${character.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Ficha
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total de Personagens</p>
              <p className="mt-2 text-3xl font-bold">{characters.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">HP Médio</p>
              <p className="mt-2 text-3xl font-bold">
                {Math.round(
                  characters.reduce(
                    (acc, c) => acc + (c.hit_points.current / c.hit_points.max) * 100,
                    0
                  ) / characters.length
                )}
                %
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Nível Médio</p>
              <p className="mt-2 text-3xl font-bold">
                {Math.round(characters.reduce((acc, c) => acc + c.level, 0) / characters.length)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Condições Ativas</p>
              <p className="mt-2 text-3xl font-bold">
                {characters.reduce(
                  (acc, c) => acc + (c.conditions?.filter((cond) => cond.active).length || 0),
                  0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Character Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.map(renderCharacterCard)}
      </div>
    </div>
  );
}
