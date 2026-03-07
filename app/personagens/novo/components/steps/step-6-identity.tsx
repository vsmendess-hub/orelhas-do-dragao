'use client';

import { useState } from 'react';
import { Check, Info, Sparkles, Loader2 } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { ALIGNMENTS, getAlignmentGrid } from '@/lib/data/alignments';
import { getRaceById } from '@/lib/data/races';
import { getClassById } from '@/lib/data/classes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function Step6Identity() {
  const { characterData, updateCharacterData } = useWizard();
  const [backgroundContext, setBackgroundContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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

  // Obter dados do personagem para contexto
  const race = characterData.race ? getRaceById(characterData.race) : null;
  const selectedClass = characterData.class ? getClassById(characterData.class) : null;

  // Gerar background com IA
  const generateBackground = async () => {
    if (!characterData.name) {
      alert('Por favor, dê um nome ao seu personagem primeiro.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: characterData.name,
          race: race?.name || '',
          class: selectedClass?.name || '',
          alignment: selectedAlignment?.name || '',
          context: backgroundContext.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar background');
      }

      const data = await response.json();
      updateCharacterData({ background: data.background });
    } catch (error) {
      console.error('Erro ao gerar background:', error);
      alert('Erro ao gerar história. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Gerar imagem do personagem com IA
  const generateImage = async () => {
    if (!characterData.name) {
      alert('Por favor, dê um nome ao seu personagem primeiro.');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const subrace = race?.subraces?.find((sr) => sr.id === characterData.subrace);

      const response = await fetch('/api/generate-character-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: characterData.name,
          race: race?.name || '',
          subrace: subrace?.name || '',
          class: selectedClass?.name || '',
          alignment: selectedAlignment?.name || '',
          background: characterData.background || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar imagem');
      }

      const data = await response.json();
      updateCharacterData({ portraitUrl: data.imageUrl });
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">📝</p>
        <h2 className="mt-4 text-2xl font-bold text-white">Nome e Alinhamento</h2>
        <p className="mt-2 text-sm text-gray-400">
          Dê um nome ao seu personagem e defina seu alinhamento moral.
        </p>
      </div>

      {/* Nome do Personagem */}
      <div className="space-y-3">
        <div>
          <label htmlFor="character-name" className="mb-2 block text-sm font-medium text-white">
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
          <p className="mt-1 text-xs text-gray-400">
            {characterData.name ? characterData.name.length : 0} / 50 caracteres
          </p>
        </div>

        {characterData.name && (
          <div className="glass-card-light rounded-xl border border-green-400/50 p-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <p className="text-sm font-medium text-green-100">
                Nome definido: {characterData.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info sobre Alinhamento */}
      <div className="glass-card-light rounded-xl border border-blue-400/50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-400" />
          <div className="text-sm">
            <p className="font-medium text-blue-100">💡 Sobre Alinhamento</p>
            <p className="mt-1 text-blue-200">
              O alinhamento representa a bússola moral do seu personagem: como ele encara a lei/caos
              (eixo ético) e o bem/mal (eixo moral). Escolha o que melhor representa sua visão do
              personagem.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Alinhamentos 3x3 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Escolha o Alinhamento</h3>
        <div className="space-y-3">
          {alignmentGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-3">
              {row.map((alignment) => {
                const isSelected = characterData.alignment === alignment.id;

                return (
                  <div
                    key={alignment.id}
                    className={`glass-card rounded-xl p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-purple-500 bg-purple-500/10 scale-105'
                        : 'hover:scale-105 hover:border-purple-500/50'
                    }`}
                    onClick={() => selectAlignment(alignment.id)}
                  >
                    <div className="mb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white">{alignment.name}</h3>
                          <p className="text-xs text-gray-400">
                            {alignment.abbreviation}
                          </p>
                        </div>
                        {isSelected && <Check className="h-5 w-5 flex-shrink-0 text-purple-400" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300">{alignment.description}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda do Grid */}
      <div className="glass-card-light rounded-xl p-4">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="mb-2 font-medium text-white">Eixo Ético (horizontal):</p>
            <ul className="space-y-1 text-xs text-gray-400">
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
            <p className="mb-2 font-medium text-white">Eixo Moral (vertical):</p>
            <ul className="space-y-1 text-xs text-gray-400">
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
        <div className="glass-card-light rounded-xl border border-green-400/50 p-4">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-100">
                Alinhamento selecionado: {selectedAlignment.name} ({selectedAlignment.abbreviation})
              </p>
              <p className="mt-1 text-xs text-green-200">
                {selectedAlignment.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gerador de Background com IA */}
      <div className="space-y-4 glass-card-light rounded-xl border-2 border-dashed border-purple-500/30 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Gerar História com IA</h3>
            <p className="text-sm text-gray-400">
              Deixe a IA criar uma história épica para seu personagem
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="background-context" className="mb-2 block text-sm font-medium text-white">
              Contexto (opcional)
            </label>
            <Textarea
              id="background-context"
              placeholder="Ex: Cresceu em uma vila de pescadores, perdeu a família para dragões, busca vingança..."
              value={backgroundContext}
              onChange={(e) => setBackgroundContext(e.target.value)}
              rows={3}
              maxLength={500}
              disabled={isGenerating}
            />
            <p className="mt-1 text-xs text-gray-400">
              Forneça um contexto breve ou deixe em branco para uma história surpresa
            </p>
          </div>

          <Button
            onClick={generateBackground}
            disabled={isGenerating || !characterData.name}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando história...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar História com IA
              </>
            )}
          </Button>
        </div>

        {/* Background Gerado */}
        {characterData.background && (
          <div className="mt-4 glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">História Gerada:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateCharacterData({ background: '' })}
              >
                Limpar
              </Button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm text-gray-300">
                {characterData.background}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gerador de Imagem com IA */}
      <div className="space-y-4 glass-card-light rounded-xl border-2 border-dashed border-blue-400/30 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Gerar Retrato com IA</h3>
            <p className="text-sm text-gray-400">
              Crie uma imagem épica do seu personagem
            </p>
          </div>
        </div>

        <Button
          onClick={generateImage}
          disabled={isGeneratingImage || !characterData.name}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isGeneratingImage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando imagem...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Retrato com IA
            </>
          )}
        </Button>

        {/* Imagem Gerada */}
        {characterData.portraitUrl && (
          <div className="mt-4 glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Retrato Gerado:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateCharacterData({ portraitUrl: '' })}
              >
                Remover
              </Button>
            </div>
            <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg">
              <img
                src={characterData.portraitUrl}
                alt={characterData.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">
          💡 A imagem será gerada baseada em todas as informações do personagem
        </p>
      </div>
    </div>
  );
}
