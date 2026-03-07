'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Search } from 'lucide-react';
import { useWizard } from '../../wizard-context';
import { CLASSES, getClassById } from '@/lib/data/classes';
import { Input } from '@/components/ui/input';

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
    });
  };

  // Obter classe selecionada
  const selectedClass = characterData.class ? getClassById(characterData.class) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl">⚔️</p>
        <h2 className="mt-4 text-2xl font-bold text-white">Escolha sua Classe</h2>
        <p className="mt-2 text-sm text-gray-400">
          Sua classe define suas habilidades, proficiências e estilo de jogo.
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
            <div
              key={cls.id}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-purple-500 bg-purple-500/10 scale-105'
                  : 'hover:scale-105 hover:border-purple-500/50'
              }`}
              onClick={() => selectClass(cls.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Imagem circular da classe */}
                {cls.image && (
                  <div className="flex-shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-purple-400">
                      <Image
                        src={cls.image}
                        alt={cls.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{cls.name}</h3>
                      <p className="text-xs text-gray-400">d{cls.hitDie} de vida</p>
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
                <p className="text-sm text-gray-300">{cls.description}</p>

                {/* Atributos Primários */}
                <div className="glass-card-light rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-400">Atributos Primários</p>
                  <p className="mt-1 text-sm font-semibold text-white">{cls.primaryAbility.join(', ')}</p>
                </div>

                {/* Perícias */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="font-medium">🎯</span>
                  <span>
                    {cls.skillChoices} perícia{cls.skillChoices > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem se não encontrar classes */}
      {filteredClasses.length === 0 && (
        <div className="glass-card-light rounded-xl border-2 border-dashed border-purple-500/30 p-12 text-center">
          <p className="text-gray-300">
            Nenhuma classe encontrada com &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      {/* Info sobre seleção atual */}
      {characterData.class && (
        <div className="glass-card-light rounded-xl border border-green-400/50 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" />
            <p className="text-sm font-medium text-green-100">
              Classe selecionada: {selectedClass?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
