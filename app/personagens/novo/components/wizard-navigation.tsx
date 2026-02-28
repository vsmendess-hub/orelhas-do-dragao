'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizard } from '../wizard-context';

interface WizardNavigationProps {
  onNext?: () => boolean | Promise<boolean>; // Retorna true se pode avançar
  onPrevious?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export function WizardNavigation({
  onNext,
  onPrevious,
  isNextDisabled = false,
  nextLabel,
}: WizardNavigationProps) {
  const { currentStep, nextStep, previousStep } = useWizard();

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext();
      if (canProceed) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    previousStep();
  };

  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (currentStep === 7) return 'Salvar Personagem';
    return 'Próximo';
  };

  return (
    <div className="flex items-center justify-between border-t bg-background px-4 py-4">
      {/* Botão Voltar */}
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Indicador de Progresso (Mobile) */}
      <div className="text-sm text-muted-foreground md:hidden">{currentStep} / 7</div>

      {/* Botão Próximo */}
      <Button onClick={handleNext} disabled={isNextDisabled} className="gap-2">
        {getNextLabel()}
        {currentStep < 7 && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
