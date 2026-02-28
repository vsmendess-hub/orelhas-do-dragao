'use client';

import { useWizard } from '../../wizard-context';

export function Step1Race() {
  const { characterData } = useWizard();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xl">🎭</p>
        <h2 className="mt-4 text-2xl font-bold">Escolha sua Raça</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua raça determina seus bônus de atributos e características especiais.
        </p>
      </div>

      {/* Placeholder - será implementado na próxima task */}
      <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">Seleção de raça será implementada aqui</p>
        {characterData.race && (
          <p className="mt-4 font-medium">Raça selecionada: {characterData.race}</p>
        )}
      </div>
    </div>
  );
}
