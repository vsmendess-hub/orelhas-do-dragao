'use client';

import { Check, Users, UsersRound, Swords, Zap, Target, User, Sparkles } from 'lucide-react';
import { useWizard } from '../wizard-context';

const STEPS = [
  { number: 1, title: 'Raça', Icon: Users },
  { number: 2, title: 'Sub-raça', Icon: UsersRound },
  { number: 3, title: 'Classe', Icon: Swords },
  { number: 4, title: 'Atributos', Icon: Zap },
  { number: 5, title: 'Perícias', Icon: Target },
  { number: 6, title: 'Identidade', Icon: User },
  { number: 7, title: 'Resumo', Icon: Sparkles },
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
                  {step.number < currentStep ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.Icon className="h-6 w-6" />
                  )}
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
              {(() => {
                const StepIcon = STEPS[currentStep - 1].Icon;
                return <StepIcon className="h-5 w-5" />;
              })()}
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
