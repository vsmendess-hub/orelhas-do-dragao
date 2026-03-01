'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyManager } from './currency-manager';
import { InventoryList } from './inventory-list';
import { ItemDialog } from './item-dialog';
import { EquipmentSlots } from './equipment-slots';
import type { Item, Currency } from '@/lib/data/items';

interface InventoryManagerProps {
  characterId: string;
  initialItems: Item[];
  initialCurrency: Currency;
  strengthScore: number;
  dexModifier: number;
}

export function InventoryManager({
  characterId,
  initialItems,
  initialCurrency,
  strengthScore,
  dexModifier,
}: InventoryManagerProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

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

  // Equipar/desequipar item
  const handleToggleEquip = (itemId: string) => {
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
        }

        return { ...item, equipped: !item.equipped };
      }
      return item;
    });

    saveItems(newItems);
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
          <CurrencyManager characterId={characterId} currency={currency} />
        </TabsContent>
      </Tabs>

      <ItemDialog
        open={isItemDialogOpen}
        onOpenChange={setIsItemDialogOpen}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </>
  );
}
