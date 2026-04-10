'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyManager } from './currency-manager';
import { InventoryList } from './inventory-list';
import { ItemDialog } from './item-dialog';
import { EquipmentSlots } from './equipment-slots';
import type { Item, Currency } from '@/lib/data/items';
import { calculateArmorClass, getEquippedArmor, getEquippedShield } from '@/lib/data/items';
import { getWeaponById, calculateAttackBonus, formatWeaponDamage } from '@/lib/data/weapons';
import { getArmorById } from '@/lib/data/armors';
import { calculateModifier } from '@/lib/data/point-buy';
import { revalidateCharacterPage } from '@/app/actions/revalidate-character';
import {
  calculateFeatureAttackBonus,
  calculateFeatureDamageBonus,
  calculateFeatureACBonus,
} from '@/lib/data/optional-features-effects';

interface InventoryManagerProps {
  characterId: string;
  initialItems: Item[];
  initialCurrency: Currency;
  strengthScore: number;
  dexModifier: number;
  proficiencyBonus: number;
  weaponProficiencies: string[];
  armorProficiencies: string[];
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  optionalFeatures?: Array<{ featureId: string; featureName: string }>;
}

export function InventoryManager({
  characterId,
  initialItems,
  initialCurrency,
  strengthScore,
  dexModifier,
  proficiencyBonus,
  weaponProficiencies,
  armorProficiencies,
  attributes,
  optionalFeatures = [],
}: InventoryManagerProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Sincronizar itens quando props mudarem (ex: após editar atributos que recalculam armas)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Sincronizar moedas quando props mudarem
  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  // Calcular modificadores de atributos
  const strModifier = calculateModifier(attributes.str);
  const dexMod = calculateModifier(attributes.dex);

  // Função para atualizar moedas (será passada ao CurrencyManager)
  const handleCurrencyUpdate = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  // Salvar itens no Supabase
  const saveItems = async (newItems: Item[]) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('characters')
        .update({ equipment: newItems })
        .eq('id', characterId);

      if (error) throw error;
      setItems(newItems);
    } catch (err) {
      console.error('Erro ao salvar itens:', err);
    }
  };

  // Adicionar/editar item
  const handleSaveItem = (item: Item) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);

    let newItems: Item[];
    if (existingIndex >= 0) {
      // Editar existente
      newItems = [...items];
      newItems[existingIndex] = item;
    } else {
      // Adicionar novo
      newItems = [...items, item];
    }

    saveItems(newItems);
  };

  // Deletar item
  const handleDeleteItem = (itemId: string) => {
    const newItems = items.filter((item) => item.id !== itemId);
    saveItems(newItems);
  };

  // Calcular valores ao equipar item
  const calculateItemValues = (item: Item): Item => {
    const updatedItem = { ...item };

    // Se é arma e tem itemSourceId, calcular bônus
    if (item.category === 'weapon' && item.properties?.itemSourceId) {
      const weaponData = getWeaponById(item.properties.itemSourceId);
      if (weaponData) {
        // Verificar se é proficiente
        const isProficient = weaponProficiencies.some(
          (prof) =>
            weaponData.category.includes(prof) ||
            prof === 'Todas as Armas' ||
            (prof === 'Armas Simples' && weaponData.category.includes('Simples')) ||
            (prof === 'Armas Marciais' && weaponData.category.includes('Marcial'))
        );

        // Calcular bônus de ataque base
        const { bonus: baseAttackBonus, attribute } = calculateAttackBonus(
          weaponData,
          strModifier,
          dexMod,
          proficiencyBonus,
          isProficient
        );

        // Calcular dano com modificador base
        const baseDamageStr = formatWeaponDamage(weaponData, strModifier, dexMod);

        // Adicionar bônus de optional features
        const featureIds = optionalFeatures.map((f) => f.featureId);
        const featureAttackBonus = calculateFeatureAttackBonus(weaponData, featureIds);
        const featureDamageBonus = calculateFeatureDamageBonus(weaponData, featureIds);

        const totalAttackBonus = baseAttackBonus + featureAttackBonus;

        // Adicionar bônus de dano ao string
        let finalDamage = baseDamageStr;
        if (featureDamageBonus > 0) {
          const damageMatch = baseDamageStr.match(/^(.+?)([+-]\d+)?$/);
          if (damageMatch) {
            const dice = damageMatch[1];
            const currentBonus = parseInt(damageMatch[2] || '0');
            const newBonus = currentBonus + featureDamageBonus;
            finalDamage = `${dice}${newBonus >= 0 ? '+' : ''}${newBonus}`;
          }
        }

        // Atualizar properties
        updatedItem.properties = {
          ...updatedItem.properties,
          calculatedAttackBonus: totalAttackBonus,
          calculatedDamage: finalDamage,
          featureBonuses: {
            attack: featureAttackBonus,
            damage: featureDamageBonus,
          },
        };
      }
    }

    // Se é armadura e tem itemSourceId, calcular CA
    if (item.category === 'armor' && item.properties?.itemSourceId) {
      const armorData = getArmorById(item.properties.itemSourceId);
      if (armorData) {
        // Calcular CA (sem escudo por enquanto, será calculado no total)
        let calculatedAC = 10 + dexMod; // Base

        if (armorData.category !== 'Escudo') {
          if (typeof armorData.baseAC === 'number') {
            // Armadura pesada
            calculatedAC = armorData.baseAC;
          } else {
            // Armadura leve ou média
            const baseValue = parseInt(armorData.baseAC.split('+')[0].trim());
            if (armorData.maxDexBonus !== undefined) {
              // Armadura média
              calculatedAC = baseValue + Math.min(dexMod, armorData.maxDexBonus);
            } else {
              // Armadura leve
              calculatedAC = baseValue + dexMod;
            }
          }
        }

        // Adicionar bônus de optional features
        const featureIds = optionalFeatures.map((f) => f.featureId);
        const featureACBonus = calculateFeatureACBonus(armorData, featureIds);
        const finalAC = calculatedAC + featureACBonus;

        updatedItem.properties = {
          ...updatedItem.properties,
          calculatedAC: finalAC,
          featureBonuses: {
            ac: featureACBonus,
          },
        };
      }
    }

    return updatedItem;
  };

  // Atualizar CA do personagem no banco
  const updateCharacterAC = async (newItems: Item[]) => {
    const equippedArmor = getEquippedArmor(newItems);
    const equippedShield = getEquippedShield(newItems);
    const newAC = calculateArmorClass(equippedArmor, equippedShield, dexMod);

    try {
      const supabase = createClient();
      await supabase.from('characters').update({ armor_class: newAC }).eq('id', characterId);

      // Revalidar página para atualizar CA na UI
      await revalidateCharacterPage(characterId);
    } catch (err) {
      console.error('Erro ao atualizar CA:', err);
    }
  };

  // Equipar/desequipar item
  const handleToggleEquip = async (itemId: string) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        // Se está equipando
        if (!item.equipped) {
          // Verificar limites
          const equippedWeapons = items.filter((i) => i.equipped && i.category === 'weapon').length;
          const equippedArmors = items.filter(
            (i) =>
              i.equipped &&
              i.category === 'armor' &&
              i.properties?.armorType &&
              i.properties.armorType !== 'shield'
          ).length;

          // Limite de 2 armas
          if (item.category === 'weapon' && equippedWeapons >= 2) {
            alert('Você já tem 2 armas equipadas. Desequipe uma primeiro.');
            return item;
          }

          // Limite de 1 armadura
          if (
            item.category === 'armor' &&
            item.properties?.armorType !== 'shield' &&
            equippedArmors >= 1
          ) {
            alert('Você já tem uma armadura equipada. Desequipe-a primeiro.');
            return item;
          }

          // Calcular valores ao equipar
          const itemWithCalculations = calculateItemValues(item);
          return { ...itemWithCalculations, equipped: true };
        }

        // Desequipando
        return { ...item, equipped: false };
      }
      return item;
    });

    await saveItems(newItems);

    // Se mudou armadura/escudo, atualizar CA
    const hasArmorChange = newItems.some((item) => item.id === itemId && item.category === 'armor');
    if (hasArmorChange) {
      await updateCharacterAC(newItems);
    }
  };

  // Abrir dialog para editar
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };

  // Abrir dialog para adicionar
  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment">Equipamento</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
          <TabsTrigger value="currency">Moedas</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <EquipmentSlots items={items} dexModifier={dexModifier} onUnequip={handleToggleEquip} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryList
            items={items}
            currency={currency}
            strengthScore={strengthScore}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onToggleEquip={handleToggleEquip}
          />
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <CurrencyManager
            characterId={characterId}
            currency={currency}
            onCurrencyUpdate={handleCurrencyUpdate}
          />
        </TabsContent>
      </Tabs>

      <ItemDialog
        open={isItemDialogOpen}
        onOpenChange={setIsItemDialogOpen}
        onSave={handleSaveItem}
        editingItem={editingItem}
        characterId={characterId}
      />
    </>
  );
}
