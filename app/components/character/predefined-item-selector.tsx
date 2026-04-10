/**
 * Seletor de Itens Pré-definidos do PHB
 */

'use client';

import { useState } from 'react';
import { Search, Swords, Shield, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { type Weapon, ALL_WEAPONS, searchWeapons } from '@/lib/data/weapons';
import { type Armor, ALL_ARMORS, searchArmors } from '@/lib/data/armors';
import { type Equipment, ALL_EQUIPMENT, searchEquipment } from '@/lib/data/equipment';

interface PredefinedItemSelectorProps {
  onSelectWeapon: (weapon: Weapon) => void;
  onSelectArmor: (armor: Armor) => void;
  onSelectEquipment: (equipment: Equipment) => void;
}

export function PredefinedItemSelector({
  onSelectWeapon,
  onSelectArmor,
  onSelectEquipment,
}: PredefinedItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('weapons');

  // Filtrar itens baseado na busca
  const filteredWeapons = searchQuery ? searchWeapons(searchQuery) : ALL_WEAPONS;
  const filteredArmors = searchQuery ? searchArmors(searchQuery) : ALL_ARMORS;
  const filteredEquipment = searchQuery ? searchEquipment(searchQuery) : ALL_EQUIPMENT;

  return (
    <div className="space-y-4">
      {/* Busca Global */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar Item</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite o nome do item..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs de Categorias */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weapons">
            <Swords className="mr-2 h-4 w-4" />
            Armas
          </TabsTrigger>
          <TabsTrigger value="armors">
            <Shield className="mr-2 h-4 w-4" />
            Armaduras
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Package className="mr-2 h-4 w-4" />
            Equipamentos
          </TabsTrigger>
        </TabsList>

        {/* ARMAS */}
        <TabsContent value="weapons" className="space-y-4">
          <div className="h-[400px] overflow-y-auto">
            <div className="space-y-2 pr-4">
              {filteredWeapons.length > 0 ? (
                filteredWeapons.map((weapon) => (
                  <div
                    key={weapon.id}
                    onClick={() => onSelectWeapon(weapon)}
                    className="cursor-pointer rounded-lg border border-white/10 p-4 transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{weapon.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {weapon.damage} {weapon.damageType}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{weapon.category}</p>
                        {weapon.properties.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {weapon.properties.map((prop) => (
                              <Badge key={prop} variant="secondary" className="text-xs">
                                {prop}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {weapon.range && (
                          <p className="mt-1 text-xs text-cyan-400">
                            Alcance: {weapon.range} metros
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-amber-400">
                          {weapon.cost.gold} po
                        </p>
                        <p className="text-xs text-gray-500">{weapon.weight} lb</p>
                        <p className="text-xs text-gray-500">
                          {weapon.source} p.{weapon.page}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">Nenhuma arma encontrada</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ARMADURAS */}
        <TabsContent value="armors" className="space-y-4">
          <div className="h-[400px] overflow-y-auto">
            <div className="space-y-2 pr-4">
              {filteredArmors.length > 0 ? (
                filteredArmors.map((armor) => (
                  <div
                    key={armor.id}
                    onClick={() => onSelectArmor(armor)}
                    className="cursor-pointer rounded-lg border border-white/10 p-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{armor.name}</p>
                          <Badge variant="outline" className="text-xs">
                            CA {armor.baseAC}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{armor.category}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {armor.stealthDisadvantage && (
                            <Badge variant="destructive" className="text-xs">
                              Desvantagem em Furtividade
                            </Badge>
                          )}
                          {armor.strengthRequired && (
                            <Badge variant="secondary" className="text-xs">
                              FOR {armor.strengthRequired}+
                            </Badge>
                          )}
                          {armor.maxDexBonus !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              Max DES +{armor.maxDexBonus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-amber-400">{armor.cost.gold} po</p>
                        <p className="text-xs text-gray-500">{armor.weight} lb</p>
                        <p className="text-xs text-gray-500">
                          {armor.source} p.{armor.page}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  Nenhuma armadura encontrada
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* EQUIPAMENTOS */}
        <TabsContent value="equipment" className="space-y-4">
          <div className="h-[400px] overflow-y-auto">
            <div className="space-y-2 pr-4">
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((equipment) => (
                  <div
                    key={equipment.id}
                    onClick={() => onSelectEquipment(equipment)}
                    className="cursor-pointer rounded-lg border border-white/10 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{equipment.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {equipment.category}
                          </Badge>
                        </div>
                        {equipment.description && (
                          <p className="mt-2 text-xs text-gray-400">{equipment.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-amber-400">
                          {equipment.cost.gold || 0} po
                          {equipment.cost.silver ? ` ${equipment.cost.silver} pp` : ''}
                          {equipment.cost.copper ? ` ${equipment.cost.copper} pc` : ''}
                        </p>
                        <p className="text-xs text-gray-500">{equipment.weight} lb</p>
                        <p className="text-xs text-gray-500">
                          {equipment.source} p.{equipment.page}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  Nenhum equipamento encontrado
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
