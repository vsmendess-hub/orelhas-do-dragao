'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Check, Info } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { getRaceById, type Subrace } from '@/lib/data/races';

export function Step2Subrace() {
  const { characterData, updateCharacterData, nextStep } = useWizard();

  // Obter raça selecionada
  const selectedRace = characterData.race ? getRaceById(characterData.race) : null;
  const subraces = selectedRace?.subraces || [];

  // Se a raça não tem sub-raças, pular automaticamente este step
  useEffect(() => {
    if (selectedRace && subraces.length === 0) {
      // Avançar automaticamente para o próximo step
      nextStep();
    }
  }, [selectedRace, subraces.length, nextStep]);

  // Selecionar sub-raça
  const selectSubrace = (subraceId: string) => {
    updateCharacterData({ subrace: subraceId });
  };

  // Formatar bônus para display
  const formatBonuses = (subrace: Subrace) => {
    const bonuses: string[] = [];
    if (subrace.bonuses.str) bonuses.push(`FOR +${subrace.bonuses.str}`);
    if (subrace.bonuses.dex) bonuses.push(`DES +${subrace.bonuses.dex}`);
    if (subrace.bonuses.con) bonuses.push(`CON +${subrace.bonuses.con}`);
    if (subrace.bonuses.int) bonuses.push(`INT +${subrace.bonuses.int}`);
    if (subrace.bonuses.wis) bonuses.push(`SAB +${subrace.bonuses.wis}`);
    if (subrace.bonuses.cha) bonuses.push(`CAR +${subrace.bonuses.cha}`);
    return bonuses.join(', ');
  };

  // Se não tiver raça selecionada, mostrar aviso
  if (!selectedRace) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl">👥</p>
          <h2 className="mt-4 text-2xl font-bold text-white">Escolha sua Sub-raça</h2>
          <p className="mt-2 text-sm text-gray-400">
            Algumas raças têm sub-raças com bônus adicionais.
          </p>
        </div>

        <div className="glass-card-light rounded-xl border border-amber-400/50 p-6 text-center">
          <Info className="mx-auto h-8 w-8 text-amber-400" />
          <p className="mt-4 text-sm text-amber-100">
            Por favor, volte e selecione uma raça primeiro.
          </p>
        </div>
      </div>
    );
  }

  // Se a raça não tem sub-raças, este step será pulado automaticamente pelo useEffect
  if (subraces.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl">👥</p>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">👥</p>
        <h2 className="mt-4 text-2xl font-bold text-white">Escolha sua Sub-raça</h2>
        <p className="mt-2 text-sm text-gray-400">
          {selectedRace.name} tem {subraces.length} sub-raças disponíveis. Escolha uma para ganhar
          bônus adicionais.
        </p>
      </div>

      {/* Info da Raça Principal */}
      <div className="glass-card-light rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          <div>
            <p className="text-sm text-gray-400">Raça selecionada</p>
            <p className="font-semibold text-white">{selectedRace.name}</p>
          </div>
        </div>
      </div>

      {/* Grid de Sub-raças */}
      <div className="grid gap-4 md:grid-cols-2">
        {subraces.map((subrace) => {
          const isSelected = characterData.subrace === subrace.id;

          return (
            <div
              key={subrace.id}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-purple-500 bg-purple-500/10 scale-105'
                  : 'hover:scale-105 hover:border-purple-500/50'
              }`}
              onClick={() => selectSubrace(subrace.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Imagem circular da sub-raça */}
                {subrace.image && (
                  <div className="flex-shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-purple-400">
                      <Image
                        src={subrace.image}
                        alt={subrace.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{subrace.name}</h3>
                      <p className="text-xs text-gray-400">
                        Sub-raça de {selectedRace.name}
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
                <p className="text-sm text-gray-300">{subrace.description}</p>

                {/* Bônus de Atributos Adicionais */}
                <div className="glass-card-light rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-400">Bônus Adicionais</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatBonuses(subrace)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info sobre seleção atual */}
      {characterData.subrace && (
        <div className="glass-card-light rounded-xl border border-green-400/50 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" />
            <p className="text-sm font-medium text-green-100">
              Sub-raça selecionada: {subraces.find((sr) => sr.id === characterData.subrace)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
