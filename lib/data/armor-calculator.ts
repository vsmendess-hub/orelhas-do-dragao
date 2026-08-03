/**
 * Funções auxiliares para cálculo de Classe de Armadura
 * Considera armadura equipada e seus limitadores de DEX
 */

import { getArmorById, calculateArmorClass } from './armors';

interface EquipmentItem {
  id?: string;
  name: string;
  type?: string;
  equipped?: boolean;
  armorId?: string;
  category?: string;
  [key: string]: string | boolean | number | undefined;
}

/**
 * Calcula CA baseado no equipamento do personagem
 * Considera armadura equipada e escudo
 */
export function calculateCharacterAC(equipment: EquipmentItem[], dexModifier: number): number {
  if (!equipment || equipment.length === 0) {
    // Sem equipamento = CA base (10 + DEX)
    return 10 + dexModifier;
  }

  // Buscar armadura equipada (não-escudo)
  const equippedArmor = equipment.find(
    (item) =>
      item.equipped &&
      (item.type === 'armor' || item.category === 'armor' || item.armorId) &&
      !item.name.toLowerCase().includes('escudo') &&
      !item.name.toLowerCase().includes('shield')
  );

  // Buscar escudo equipado
  const hasShield = equipment.some(
    (item) =>
      item.equipped &&
      (item.name.toLowerCase().includes('escudo') || item.name.toLowerCase().includes('shield'))
  );

  // Se encontrou armadura, buscar dados dela
  let armor = null;
  if (equippedArmor) {
    const armorId = equippedArmor.armorId || equippedArmor.id;
    if (armorId) {
      armor = getArmorById(armorId);
    }
  }

  // Calcular CA usando a função do sistema
  return calculateArmorClass(armor, hasShield, dexModifier);
}

/**
 * Recalcula CA quando atributos mudam (level up)
 * Mantém armadura equipada, apenas atualiza o modificador de DEX
 */
export function recalculateACOnLevelUp(
  equipment: EquipmentItem[],
  oldDexModifier: number,
  newDexModifier: number,
  currentAC: number
): number {
  // Se não mudou DEX, mantém CA atual
  if (oldDexModifier === newDexModifier) {
    return currentAC;
  }

  // Recalcula com novo modificador
  return calculateCharacterAC(equipment, newDexModifier);
}
