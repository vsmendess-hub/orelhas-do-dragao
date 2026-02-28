'use client';

import { useState } from 'react';
import { Check, Search, Dices } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { CLASSES, getClassById, type Class } from '@/lib/data/classes';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Step3Class() {
  const { characterData, updateCharacterData } = useWizard();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar classes pela busca
  const filteredClasses = CLASSES.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selecionar classe
  const selectClass = (classId: string) => {
    updateCharacterData({
      class: classId,
      archetype: undefined, // Resetar arquétipo ao mudar classe
    });
  };

  // Selecionar nível
  const selectLevel = (level: number) => {
    updateCharacterData({
      level,
      archetype: level < 3 ? undefined : characterData.archetype, // Resetar arquétipo se nível < 3
    });
  };

  // Selecionar arquétipo
  const selectArchetype = (archetypeId: string) => {
    updateCharacterData({ archetype: archetypeId });
  };

  // Obter classe selecionada
  const selectedClass = characterData.class ? getClassById(characterData.class) : null;

  // Calcular proficiency bonus baseado no nível
  const getProficiencyBonus = (level: number): number => {
    return Math.floor((level - 1) / 4) + 2;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">⚔️</p>
        <h2 className="mt-4 text-2xl font-bold">Escolha sua Classe e Nível</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua classe define suas habilidades, proficiências e estilo de jogo.
        </p>
      </div>

      {/* Seletor de Nível */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Nível do Personagem</label>
            <Select
              value={characterData.level.toString()}
              onValueChange={(value) => selectLevel(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Nível {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Bônus de Proficiência</label>
            <div className="flex h-10 items-center rounded-md border bg-background px-3 text-sm font-medium">
              <Dices className="mr-2 h-4 w-4 text-muted-foreground" />+
              {getProficiencyBonus(characterData.level)}
            </div>
          </div>
        </div>
        {characterData.level >= 3 && (
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Nível 3+: Você poderá escolher um arquétipo após selecionar sua classe
          </p>
        )}
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar classe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid de Classes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const isSelected = characterData.class === cls.id;

          return (
            <Card
              key={cls.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-2 border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                  : 'border hover:border-deep-purple/50'
              }`}
              onClick={() => selectClass(cls.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription className="text-xs">d{cls.hitDie} de vida</CardDescription>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-purple text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">{cls.description}</p>

                {/* Atributos Primários */}
                <div className="rounded-md bg-muted px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">Atributos Primários</p>
                  <p className="mt-1 text-sm font-semibold">{cls.primaryAbility.join(', ')}</p>
                </div>

                {/* Perícias */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-medium">🎯</span>
                  <span>
                    {cls.skillChoices} perícia{cls.skillChoices > 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem se não encontrar classes */}
      {filteredClasses.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma classe encontrada com &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      {/* Seleção de Arquétipo (nível 3+) */}
      {selectedClass && characterData.level >= 3 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Escolha seu Arquétipo</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            A partir do nível 3, você especializa sua classe através de um arquétipo.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {selectedClass.archetypes.map((archetype) => {
              const isSelected = characterData.archetype === archetype.id;

              return (
                <Card
                  key={archetype.id}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    isSelected
                      ? 'border-2 border-deep-purple bg-deep-purple/5'
                      : 'border hover:border-deep-purple/50'
                  }`}
                  onClick={() => selectArchetype(archetype.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{archetype.name}</CardTitle>
                      {isSelected && <Check className="h-5 w-5 flex-shrink-0 text-deep-purple" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-xs text-muted-foreground">{archetype.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Info sobre seleção atual */}
      {characterData.class && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {selectedClass?.name} Nível {characterData.level}
              {characterData.archetype &&
                characterData.level >= 3 &&
                ` - ${selectedClass?.archetypes.find((a) => a.id === characterData.archetype)?.name}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
