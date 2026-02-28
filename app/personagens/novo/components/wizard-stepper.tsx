'use client';

import { Check } from 'lucide-react';
import { useWizard } from '../wizard-context';

const STEPS = [
  { number: 1, title: 'Raça', icon: '🎭' },
  { number: 2, title: 'Sub-raça', icon: '👥' },
  { number: 3, title: 'Classe', icon: '⚔️' },
  { number: 4, title: 'Atributos', icon: '💪' },
  { number: 5, title: 'Perícias', icon: '🎯' },
  { number: 6, title: 'Identidade', icon: '📝' },
  { number: 7, title: 'Resumo', icon: '✨' },
];

export function WizardStepper() {
  const { currentStep } = useWizard();

  return (
    <div className="w-full py-6">
      {/* Desktop: Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold transition-all ${
                    step.number < currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : step.number === currentStep
                        ? 'border-deep-purple bg-deep-purple text-white'
                        : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {step.number < currentStep ? <Check className="h-6 w-6" /> : step.icon}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step.number === currentStep
                      ? 'text-foreground'
                      : step.number < currentStep
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Compact Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-deep-purple bg-deep-purple text-white">
              {STEPS[currentStep - 1].icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Passo {currentStep} de 7</p>
              <p className="text-sm font-medium">{STEPS[currentStep - 1].title}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  step.number < currentStep
                    ? 'bg-green-500'
                    : step.number === currentStep
                      ? 'bg-deep-purple'
                      : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
