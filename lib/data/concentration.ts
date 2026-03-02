/**
 * Sistema de Concentration (Concentração em Magias) D&D 5e
 */

export interface ConcentrationSpell {
  spellName: string;
  duration: string;
  startedAt: string; // ISO timestamp
  saveBonus: number; // Constitution save bonus
}

/**
 * Calcula DC do teste de concentração quando toma dano
 * DC = 10 ou metade do dano (o que for maior)
 */
export function calculateConcentrationDC(damage: number): number {
  return Math.max(10, Math.floor(damage / 2));
}

/**
 * Verifica se o teste de concentração foi bem sucedido
 */
export function isConcentrationSaved(roll: number, saveBonus: number, dc: number): boolean {
  return roll + saveBonus >= dc;
}

/**
 * Formata tempo de duração desde que começou a concentração
 */
export function getConcentrationDuration(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Menos de 1 minuto';
  if (diffMinutes === 1) return '1 minuto';
  if (diffMinutes < 60) return `${diffMinutes} minutos`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hora';
  return `${diffHours} horas`;
}

/**
 * Mensagens de resultado do teste de concentração
 */
export function getConcentrationMessage(
  saved: boolean,
  roll: number,
  saveBonus: number,
  dc: number
): string {
  const total = roll + saveBonus;

  if (saved) {
    return `✅ Concentração mantida! (${roll} + ${saveBonus} = ${total} vs DC ${dc})`;
  } else {
    return `❌ Concentração perdida! (${roll} + ${saveBonus} = ${total} vs DC ${dc})`;
  }
}
