'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateModifier } from '@/lib/data/point-buy';
import { revalidatePath } from 'next/cache';
import { getWeaponById, calculateAttackBonus, formatWeaponDamage } from '@/lib/data/weapons';
import { getArmorById } from '@/lib/data/armors';
import {
  getEquippedArmor,
  getEquippedShield,
  calculateArmorClass,
  type Item,
} from '@/lib/data/items';
import {
  calculateFeatureAttackBonus,
  calculateFeatureDamageBonus,
  calculateFeatureACBonus,
} from '@/lib/data/optional-features-effects';

interface RecalculateEquipmentParams {
  characterId: string;
  activeFeatureIds: string[];
}

/**
 * Recalcula equipamento aplicando bônus de Optional Features
 */
export async function recalculateEquipmentWithFeatures({
  characterId,
  activeFeatureIds,
}: RecalculateEquipmentParams) {
  try {
    const supabase = await createClient();

    // Buscar dados do personagem
    const { data: character, error: fetchError } = await supabase
      .from('characters')
      .select('equipment, attributes, proficiency_bonus')
      .eq('id', characterId)
      .single();

    if (fetchError || !character) {
      throw new Error('Personagem não encontrado');
    }

    const { equipment, attributes, proficiency_bonus: proficiencyBonus } = character;

    // Calcular modificadores
    const strMod = calculateModifier(attributes.str);
    const dexMod = calculateModifier(attributes.dex);

    // Recalcular todos os itens equipados
    const updatedEquipment = equipment.map((item: Item) => {
      // Recalcular armas
      if (item.category === 'weapon' && item.properties?.itemSourceId) {
        const weaponData = getWeaponById(item.properties.itemSourceId);
        if (weaponData) {
          // Calcular bônus base de ataque
          const isProficient = true; // Assumindo proficiência por simplicidade
          const { bonus: baseAttackBonus } = calculateAttackBonus(
            weaponData,
            strMod,
            dexMod,
            proficiencyBonus,
            isProficient
          );

          // Adicionar bônus de features
          const featureAttackBonus = calculateFeatureAttackBonus(weaponData, activeFeatureIds);
          const featureDamageBonus = calculateFeatureDamageBonus(weaponData, activeFeatureIds);

          const totalAttackBonus = baseAttackBonus + featureAttackBonus;

          // Calcular dano base
          const baseDamage = formatWeaponDamage(weaponData, strMod, dexMod);

          // Adicionar bônus de dano da feature ao string de dano
          let finalDamage = baseDamage;
          if (featureDamageBonus > 0) {
            // Parse do dano base e adiciona o bônus
            const damageMatch = baseDamage.match(/^(.+?)([+-]\d+)?$/);
            if (damageMatch) {
              const dice = damageMatch[1];
              const currentBonus = parseInt(damageMatch[2] || '0');
              const newBonus = currentBonus + featureDamageBonus;
              finalDamage = `${dice}${newBonus >= 0 ? '+' : ''}${newBonus}`;
            }
          }

          return {
            ...item,
            properties: {
              ...item.properties,
              calculatedAttackBonus: totalAttackBonus,
              calculatedDamage: finalDamage,
              featureBonuses: {
                attack: featureAttackBonus,
                damage: featureDamageBonus,
              },
            },
          };
        }
      }

      // Recalcular armaduras
      if (item.category === 'armor' && item.properties?.itemSourceId) {
        const armorData = getArmorById(item.properties.itemSourceId);
        if (armorData) {
          let armorAC = typeof armorData.baseAC === 'number' ? armorData.baseAC : 10;

          // Aplicar modificador de DEX conforme tipo de armadura
          if (armorData.maxDexBonus === undefined || armorData.maxDexBonus === null) {
            armorAC += dexMod;
          } else if (armorData.maxDexBonus > 0) {
            armorAC += Math.min(dexMod, armorData.maxDexBonus);
          }

          // Adicionar bônus de features (ex: Defense +1)
          const featureACBonus = calculateFeatureACBonus(armorData, activeFeatureIds);
          armorAC += featureACBonus;

          return {
            ...item,
            properties: {
              ...item.properties,
              calculatedAC: armorAC,
              featureBonuses: {
                ac: featureACBonus,
              },
            },
          };
        }
      }

      return item;
    });

    // Recalcular CA total do personagem
    const equippedArmor = getEquippedArmor(updatedEquipment);
    const equippedShield = getEquippedShield(updatedEquipment);
    let newArmorClass = calculateArmorClass(equippedArmor, equippedShield, dexMod);

    // Adicionar bônus de features à CA total
    if (equippedArmor?.properties?.itemSourceId) {
      const armorData = getArmorById(equippedArmor.properties.itemSourceId);
      if (armorData) {
        const featureACBonus = calculateFeatureACBonus(armorData, activeFeatureIds);
        newArmorClass += featureACBonus;
      }
    }

    // Atualizar no banco
    const { error: updateError } = await supabase
      .from('characters')
      .update({
        equipment: updatedEquipment,
        armor_class: newArmorClass,
      })
      .eq('id', characterId);

    if (updateError) {
      throw updateError;
    }

    // Revalidar cache
    revalidatePath(`/personagens/${characterId}`);

    return {
      success: true,
      message: 'Equipamento recalculado com bônus de features',
    };
  } catch (error) {
    console.error('Erro ao recalcular equipamento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
