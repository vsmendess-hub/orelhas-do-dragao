/**
 * Sistema de Death Saves (Testes de Morte) D&D 5e
 */

export interface DeathSaves {
  successes: number; // 0-3
  failures: number; // 0-3
}

export const EMPTY_DEATH_SAVES: DeathSaves = {
  successes: 0,
  failures: 0,
};

/**
 * Verifica se o personagem está estabilizado (3 sucessos)
 */
export function isStabilized(deathSaves: DeathSaves): boolean {
  return deathSaves.successes >= 3;
}

/**
 * Verifica se o personagem morreu (3 falhas)
 */
export function isDead(deathSaves: DeathSaves): boolean {
  return deathSaves.failures >= 3;
}

/**
 * Verifica se precisa fazer teste de morte (0 HP mas não morto)
 */
export function needsDeathSave(currentHP: number, deathSaves: DeathSaves): boolean {
  return currentHP === 0 && !isDead(deathSaves) && !isStabilized(deathSaves);
}

/**
 * Adiciona um sucesso
 */
export function addSuccess(deathSaves: DeathSaves): DeathSaves {
  return {
    ...deathSaves,
    successes: Math.min(deathSaves.successes + 1, 3),
  };
}

/**
 * Adiciona uma falha
 */
export function addFailure(deathSaves: DeathSaves): DeathSaves {
  return {
    ...deathSaves,
    failures: Math.min(deathSaves.failures + 1, 3),
  };
}

/**
 * Reseta os death saves (quando revive ou estabiliza)
 */
export function resetDeathSaves(): DeathSaves {
  return EMPTY_DEATH_SAVES;
}

/**
 * Processa resultado de um teste de morte
 * 1 = 2 falhas, 2-9 = 1 falha, 10-19 = 1 sucesso, 20 = recupera 1 HP
 */
export function processDeathSaveRoll(
  roll: number,
  currentDeathSaves: DeathSaves
): {
  deathSaves: DeathSaves;
  message: string;
  recoveredHP: number;
} {
  let deathSaves = { ...currentDeathSaves };
  let message = '';
  let recoveredHP = 0;

  if (roll === 1) {
    // Falha crítica = 2 falhas
    deathSaves.failures = Math.min(deathSaves.failures + 2, 3);
    message = '💀 Falha Crítica! 2 falhas adicionadas.';
  } else if (roll >= 2 && roll <= 9) {
    // Falha
    deathSaves.failures = Math.min(deathSaves.failures + 1, 3);
    message = '❌ Falha no teste de morte.';
  } else if (roll >= 10 && roll <= 19) {
    // Sucesso
    deathSaves.successes = Math.min(deathSaves.successes + 1, 3);
    message = '✅ Sucesso no teste de morte!';
  } else if (roll === 20) {
    // Crítico = recupera 1 HP
    recoveredHP = 1;
    deathSaves = EMPTY_DEATH_SAVES;
    message = '⭐ Crítico! Você recupera 1 HP e se estabiliza!';
  }

  // Verificar se morreu ou estabilizou
  if (deathSaves.failures >= 3) {
    message += ' 💀 Você morreu.';
  } else if (deathSaves.successes >= 3) {
    message += ' 🛡️ Você se estabilizou!';
  }

  return { deathSaves, message, recoveredHP };
}
