'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Estado do personagem sendo criado no Wizard
 */
export interface CharacterWizardData {
  // Step 1: Raça
  race?: string;

  // Step 2: Sub-raça
  subrace?: string;

  // Step 3: Classe e Nível
  class?: string;
  level: number;
  archetype?: string;

  // Step 4: Atributos (Point Buy)
  abilities: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  // Step 5: Perícias
  skills: string[]; // IDs das skills proficientes

  // Step 6: Nome e Alinhamento
  name?: string;
  alignment?: string;
}

/**
 * Contexto do Wizard
 */
interface WizardContextType {
  currentStep: number;
  characterData: CharacterWizardData;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateCharacterData: (data: Partial<CharacterWizardData>) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

/**
 * Valores iniciais do personagem
 */
const initialCharacterData: CharacterWizardData = {
  level: 1,
  abilities: {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8,
  },
  skills: [],
};

/**
 * Provider do Wizard
 */
export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [characterData, setCharacterData] = useState<CharacterWizardData>(initialCharacterData);

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCharacterData = (data: Partial<CharacterWizardData>) => {
    setCharacterData((prev) => ({ ...prev, ...data }));
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setCharacterData(initialCharacterData);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        characterData,
        setCurrentStep,
        nextStep,
        previousStep,
        updateCharacterData,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

/**
 * Hook para usar o contexto do Wizard
 */
export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
