'use client';

import { Check, Info } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { ALIGNMENTS, getAlignmentGrid } from '@/lib/data/alignments';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Step6Identity() {
  const { characterData, updateCharacterData } = useWizard();

  // Obter grid de alinhamentos (3x3)
  const alignmentGrid = getAlignmentGrid();

  // Atualizar nome
  const updateName = (name: string) => {
    updateCharacterData({ name });
  };

  // Selecionar alinhamento
  const selectAlignment = (alignmentId: string) => {
    updateCharacterData({ alignment: alignmentId });
  };

  // Obter alinhamento selecionado
  const selectedAlignment = characterData.alignment
    ? ALIGNMENTS.find((a) => a.id === characterData.alignment)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">📝</p>
        <h2 className="mt-4 text-2xl font-bold">Nome e Alinhamento</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dê um nome ao seu personagem e defina seu alinhamento moral.
        </p>
      </div>

      {/* Nome do Personagem */}
      <div className="space-y-3">
        <div>
          <label htmlFor="character-name" className="mb-2 block text-sm font-medium">
            Nome do Personagem
          </label>
          <Input
            id="character-name"
            type="text"
            placeholder="Ex: Thorin Escudo de Carvalho"
            value={characterData.name || ''}
            onChange={(e) => updateName(e.target.value)}
            className="text-lg"
            maxLength={50}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {characterData.name ? characterData.name.length : 0} / 50 caracteres
          </p>
        </div>

        {characterData.name && (
          <div className="rounded-lg border bg-green-50 p-3 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Nome definido: {characterData.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info sobre Alinhamento */}
      <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">💡 Sobre Alinhamento</p>
            <p className="mt-1 text-blue-800 dark:text-blue-200">
              O alinhamento representa a bússola moral do seu personagem: como ele encara a lei/caos
              (eixo ético) e o bem/mal (eixo moral). Escolha o que melhor representa sua visão do
              personagem.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Alinhamentos 3x3 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Escolha o Alinhamento</h3>
        <div className="space-y-3">
          {alignmentGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-3">
              {row.map((alignment) => {
                const isSelected = characterData.alignment === alignment.id;

                return (
                  <Card
                    key={alignment.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-2 border-deep-purple bg-deep-purple/5 ring-2 ring-deep-purple/20'
                        : 'border hover:border-deep-purple/50'
                    }`}
                    onClick={() => selectAlignment(alignment.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm">{alignment.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {alignment.abbreviation}
                          </CardDescription>
                        </div>
                        {isSelected && <Check className="h-5 w-5 flex-shrink-0 text-deep-purple" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-xs text-muted-foreground">{alignment.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda do Grid */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="mb-2 font-medium">Eixo Ético (horizontal):</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                • <span className="font-medium">Leal:</span> Segue leis e códigos
              </li>
              <li>
                • <span className="font-medium">Neutro:</span> Balanceado
              </li>
              <li>
                • <span className="font-medium">Caótico:</span> Valoriza liberdade
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium">Eixo Moral (vertical):</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                • <span className="font-medium">Bom:</span> Altruísta e compassivo
              </li>
              <li>
                • <span className="font-medium">Neutro:</span> Balanceado
              </li>
              <li>
                • <span className="font-medium">Mau:</span> Egoísta e cruel
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info sobre seleção atual */}
      {selectedAlignment && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Alinhamento selecionado: {selectedAlignment.name} ({selectedAlignment.abbreviation})
              </p>
              <p className="mt-1 text-xs text-green-800 dark:text-green-200">
                {selectedAlignment.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
