'use client';

import { ReactNode } from 'react';
import { WizardStepper } from './wizard-stepper';
import { WizardNavigation } from './wizard-navigation';

interface WizardLayoutProps {
  children: ReactNode;
  onNext?: () => boolean | Promise<boolean>;
  onPrevious?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  title?: string;
  description?: string;
}

export function WizardLayout({
  children,
  onNext,
  onPrevious,
  isNextDisabled,
  nextLabel,
  title,
  description,
}: WizardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header com Stepper */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <WizardStepper />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Título e Descrição do Step */}
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && <p className="mt-2 text-muted-foreground">{description}</p>}
            </div>
          )}

          {/* Conteúdo do Step */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">{children}</div>
        </div>
      </div>

      {/* Navegação Fixa no Bottom */}
      <div className="sticky bottom-0 border-t bg-card shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <WizardNavigation
            onNext={onNext}
            onPrevious={onPrevious}
            isNextDisabled={isNextDisabled}
            nextLabel={nextLabel}
          />
        </div>
      </div>
    </div>
  );
}
