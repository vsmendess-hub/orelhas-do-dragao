'use client';

import { QuickRollButton } from './quick-roll-button';

interface SkillRollButtonProps {
  skillName: string;
  bonus: number;
}

export function SkillRollButton({ skillName, bonus }: SkillRollButtonProps) {
  return (
    <QuickRollButton
      diceCount={1}
      diceType="d20"
      modifier={bonus}
      description={`Teste de ${skillName}`}
      variant="ghost"
      size="icon"
    />
  );
}
