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

/**
 * Componente interno que usa o contexto do Wizard
 */
function WizardContent() {
  const { currentStep } = useWizard();

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

  return <WizardLayout>{renderStep()}</WizardLayout>;
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
