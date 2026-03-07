'use client';

import { ReactNode } from 'react';
import { ThemeToggle } from '@/app/components/theme-toggle';
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
    <div className="flex min-h-screen flex-col relative">
      {/* Fantasy Background */}
      <div className="fantasy-bg" />
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/originals/a1/5d/0e/a15d0e8c4f4f8b8c4f4f8b8c4f4f8b8c.jpg)',
          filter: 'blur(3px)',
        }}
      />

      {/* Header com Stepper */}
      <div className="glass-card border-0 rounded-none backdrop-blur-xl">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <WizardStepper />
            </div>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Título e Descrição do Step */}
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
              {description && <p className="mt-2 text-gray-300">{description}</p>}
            </div>
          )}

          {/* Conteúdo do Step */}
          <div className="glass-card rounded-2xl p-6">{children}</div>
        </div>
      </div>

      {/* Navegação Fixa no Bottom */}
      <div className="sticky bottom-0 glass-card border-0 rounded-none backdrop-blur-xl shadow-lg">
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
