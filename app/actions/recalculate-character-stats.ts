'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateModifier } from '@/lib/data/point-buy';
import { revalidatePath } from 'next/cache';
import { getWeaponById } from '@/lib/data/weapons';
import { calculateAttackBonus, formatWeaponDamage } from '@/lib/data/weapons';
import { getArmorById } from '@/lib/data/armors';
import { getEquippedArmor, getEquippedShield, calculateArmorClass } from '@/lib/data/items';

interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface RecalculateStatsParams {
  characterId: string;
  newAttributes: Attributes;
  currentHP: {
    current: number;
    max: number;
    temp: number;
  };
  characterLevel: number;
  oldAttributes: Attributes;
  proficiencyBonus: number;
  weaponProficiencies: string[];
  armorProficiencies: string[];
  feats?: Array<{ featId: string; name: string }>;
}

/**
 * Recalcula TODOS os stats do personagem baseados nos novos atributos
 * Inclui: HP, CA, Iniciativa, e atualiza o banco de dados
 */
export async function recalculateCharacterStats({
  characterId,
  newAttributes,
  currentHP,
  characterLevel,
  oldAttributes,
  proficiencyBonus,
  weaponProficiencies,
  armorProficiencies,
  feats = [],
}: RecalculateStatsParams) {
  try {
    const supabase = await createClient();

    // 1. Calcular novos modificadores
    const oldConModifier = calculateModifier(oldAttributes.con);
    const newConModifier = calculateModifier(newAttributes.con);
    const newDexModifier = calculateModifier(newAttributes.dex);
    const newStrModifier = calculateModifier(newAttributes.str);
    const conModifierDiff = newConModifier - oldConModifier;

    // 2. Recalcular HP máximo (PHB p.15 - cada nível adiciona modificador de CON ao HP)
    const newMaxHP = currentHP.max + conModifierDiff * characterLevel;
    const validMaxHP = Math.max(1, newMaxHP);
    const newCurrentHP = Math.min(currentHP.current, validMaxHP);

    // 3. Recalcular Iniciativa (DEX + bônus de Alerta se tiver o talento)
    const hasAlertFeat = feats.some((feat) => feat.featId === 'alert');
    const alertBonus = hasAlertFeat ? 5 : 0;
    const newInitiative = newDexModifier + alertBonus;

    // 4. Buscar equipamento atual para recalcular CA
    const { data: character } = await supabase
      .from('characters')
      .select('equipment')
      .eq('id', characterId)
      .single();

    // 5. Recalcular Classe de Armadura e equipamento
    let updatedEquipment = character?.equipment || [];

    // Usar as funções do sistema para calcular CA corretamente (incluindo escudo)
    const equippedArmor = getEquippedArmor(character?.equipment || []);
    const equippedShield = getEquippedShield(character?.equipment || []);
    const newArmorClass = calculateArmorClass(equippedArmor, equippedShield, newDexModifier);

    if (character?.equipment && Array.isArray(character.equipment)) {
      // Recalcular valores de armas equipadas
      updatedEquipment = character.equipment.map((item: Item) => {
        if (item.category === 'weapon' && item.properties?.itemSourceId) {
          const weaponData = getWeaponById(item.properties.itemSourceId);
          if (weaponData) {
            const isProficient = weaponProficiencies.some(
              (prof) =>
                prof.toLowerCase() === weaponData.category.toLowerCase() ||
                prof.toLowerCase() === weaponData.name.toLowerCase() ||
                (weaponData.category.toLowerCase().includes('simple') &&
                  prof.toLowerCase() === 'armas simples') ||
                (weaponData.category.toLowerCase().includes('marcial') &&
                  prof.toLowerCase() === 'armas marciais')
            );

            const { bonus, attribute } = calculateAttackBonus(
              weaponData,
              newStrModifier,
              newDexModifier,
              proficiencyBonus,
              isProficient
            );

            const damageStr = formatWeaponDamage(weaponData, newStrModifier, newDexModifier);

            return {
              ...item,
              properties: {
                ...item.properties,
                calculatedAttackBonus: bonus,
                calculatedDamage: damageStr,
                usedAttribute: attribute,
              },
            };
          }
        } else if (item.category === 'armor' && item.properties?.itemSourceId) {
          const armorData = getArmorById(item.properties.itemSourceId);
          if (armorData) {
            let armorAC = typeof armorData.baseAC === 'number' ? armorData.baseAC : 10;

            // Aplicar modificador de DEX conforme tipo de armadura
            if (armorData.maxDexBonus === undefined || armorData.maxDexBonus === null) {
              // Armadura leve - sem limite de DEX
              armorAC += newDexModifier;
            } else if (armorData.maxDexBonus > 0) {
              // Armadura média - limite de DEX (+2)
              armorAC += Math.min(newDexModifier, armorData.maxDexBonus);
            }
            // Armadura pesada (maxDexBonus = 0) não adiciona DEX

            return {
              ...item,
              properties: {
                ...item.properties,
                calculatedAC: armorAC,
              },
            };
          }
        }
        return item;
      });
    }

    // 6. Preparar objeto de atualização
    const updateData: {
      attributes: Attributes;
      hit_points: {
        current: number;
        max: number;
        temp: number;
      };
      armor_class: number;
      initiative: number;
      equipment: Item[];
    } = {
      attributes: newAttributes,
      hit_points: {
        current: newCurrentHP,
        max: validMaxHP,
        temp: currentHP.temp,
      },
      armor_class: newArmorClass,
      initiative: newInitiative,
      equipment: updatedEquipment,
    };

    // 7. Atualizar no banco
    const { error: updateError } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', characterId);

    if (updateError) {
      console.error('Erro ao atualizar personagem:', updateError);
      throw updateError;
    }

    // 8. Revalidar cache do Next.js
    revalidatePath(`/personagens/${characterId}`);
    revalidatePath(`/personagens/${characterId}/combate`);
    revalidatePath(`/personagens/${characterId}/dados`);
    revalidatePath(`/personagens/${characterId}/magias`);
    revalidatePath(`/personagens/${characterId}/editar`);
    revalidatePath(`/personagens/${characterId}/personalizar`);

    return {
      success: true,
      newStats: {
        hp: updateData.hit_points,
        armorClass: newArmorClass,
        initiative: newInitiative,
      },
    };
  } catch (error) {
    console.error('Erro ao recalcular stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
