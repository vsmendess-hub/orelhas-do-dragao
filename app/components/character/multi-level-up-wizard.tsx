/**
 * Wrapper para processar múltiplos níveis
 * Processa nível por nível usando o LevelUpWizard
 */

'use client';

import { useState } from 'react';
import { LevelUpWizard } from './level-up-wizard';
import type { AbilityScores } from '@/lib/data/level-up';

interface MultiLevelUpWizardProps {
  characterId: string;
  characterName: string;
  currentLevel: number;
  levelsToGain: number;
  characterClass: string;
  currentHP: { current: number; max: number };
  currentAttributes: AbilityScores;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function MultiLevelUpWizard({
  characterId,
  characterName,
  currentLevel: initialLevel,
  levelsToGain,
  characterClass,
  currentHP: initialHP,
  currentAttributes: initialAttributes,
  open,
  onClose,
  onComplete,
}: MultiLevelUpWizardProps) {
  const [currentProcessingLevel, setCurrentProcessingLevel] = useState(0);
  const [accumulatedHP, setAccumulatedHP] = useState(initialHP);
  const [accumulatedAttributes, setAccumulatedAttributes] = useState(initialAttributes);

  // Nível atual sendo processado
  const processingLevel = initialLevel + currentProcessingLevel;

  // Quando completar um nível
  const handleLevelComplete = () => {
    // Se ainda há níveis para processar
    if (currentProcessingLevel < levelsToGain - 1) {
      setCurrentProcessingLevel(currentProcessingLevel + 1);
      // O HP e atributos serão atualizados pelo wizard
      // Aqui só avançamos para o próximo
    } else {
      // Todos os níveis processados
      setCurrentProcessingLevel(0);
      setAccumulatedHP(initialHP);
      setAccumulatedAttributes(initialAttributes);
      onComplete();
    }
  };

  // Quando fechar sem completar
  const handleClose = () => {
    setCurrentProcessingLevel(0);
    setAccumulatedHP(initialHP);
    setAccumulatedAttributes(initialAttributes);
    onClose();
  };

  return (
    <LevelUpWizard
      characterId={characterId}
      characterName={characterName}
      currentLevel={processingLevel}
      characterClass={characterClass}
      currentHP={accumulatedHP}
      currentAttributes={accumulatedAttributes}
      open={open}
      onClose={handleClose}
      onComplete={handleLevelComplete}
    />
  );
}
