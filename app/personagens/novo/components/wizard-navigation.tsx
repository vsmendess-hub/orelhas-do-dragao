'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    // Se estiver no primeiro passo, voltar para a home
    if (currentStep === 1) {
      router.push('/');
      return;
    }

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
    <div className="flex items-center justify-between px-4 py-4">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        onClick={handlePrevious}
        className="gap-2 text-white hover:bg-white/10"
      >
        <ChevronLeft className="h-4 w-4" />
        {currentStep === 1 ? 'Cancelar' : 'Voltar'}
      </Button>

      {/* Indicador de Progresso (Mobile) */}
      <div className="text-sm text-gray-400 md:hidden">{currentStep} / 7</div>

      {/* Botão Próximo - Ocultar no step 7 pois há botão customizado */}
      {currentStep < 7 && (
        <Button onClick={handleNext} disabled={isNextDisabled} className="gap-2 tab-purple">
          {getNextLabel()}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      {currentStep === 7 && <div />} {/* Spacer para manter layout */}
    </div>
  );
}
