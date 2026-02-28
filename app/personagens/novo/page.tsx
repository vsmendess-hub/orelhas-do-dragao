'use client';

import { WizardProvider, useWizard } from './wizard-context';
import { WizardLayout } from './components/wizard-layout';
import {
  Step1Race,
  Step2Subrace,
  Step3Class,
  Step4Abilities,
  Step5Skills,
  Step6Identity,
  Step7Summary,
} from './components/steps';
import { getRaceById } from '@/lib/data/races';
import { getRemainingPoints } from '@/lib/data/point-buy';

/**
 * Componente interno que usa o contexto do Wizard
 */
function WizardContent() {
  const { currentStep, characterData } = useWizard();

  // Verificar se pode avançar para o próximo step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!characterData.race;
      case 2: {
        // Se a raça não tem sub-raças, o step será pulado automaticamente
        const race = characterData.race ? getRaceById(characterData.race) : null;
        const hasSubraces = race?.subraces && race.subraces.length > 0;
        // Se tem sub-raças, precisa selecionar uma. Se não tem, pode avançar
        return hasSubraces ? !!characterData.subrace : true;
      }
      case 3: {
        // Precisa ter classe selecionada
        if (!characterData.class) return false;
        // Se for nível 3+, precisa ter arquétipo selecionado
        if (characterData.level >= 3 && !characterData.archetype) return false;
        return true;
      }
      case 4: {
        // Validar Point Buy: não pode ter pontos negativos
        const remaining = getRemainingPoints(characterData.abilities);
        return remaining >= 0;
      }
      case 5:
        return characterData.skills.length > 0;
      case 6:
        return !!characterData.name && !!characterData.alignment;
      case 7:
        return true;
      default:
        return true;
    }
  };

  // Renderizar o step atual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Race />;
      case 2:
        return <Step2Subrace />;
      case 3:
        return <Step3Class />;
      case 4:
        return <Step4Abilities />;
      case 5:
        return <Step5Skills />;
      case 6:
        return <Step6Identity />;
      case 7:
        return <Step7Summary />;
      default:
        return <Step1Race />;
    }
  };

  return <WizardLayout isNextDisabled={!canProceed()}>{renderStep()}</WizardLayout>;
}

/**
 * Página de criação de personagem com Wizard
 */
export default function NovoPersonagemPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
