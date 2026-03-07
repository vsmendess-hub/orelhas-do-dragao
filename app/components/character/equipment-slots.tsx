'use client';

import { Shield, Sword, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type Item,
  getEquippedArmor,
  getEquippedShield,
  getEquippedWeapons,
  calculateArmorClass,
} from '@/lib/data/items';

interface EquipmentSlotsProps {
  items: Item[];
  dexModifier: number;
  onUnequip: (itemId: string) => void;
}

export function EquipmentSlots({ items, dexModifier, onUnequip }: EquipmentSlotsProps) {
  const equippedArmor = getEquippedArmor(items);
  const equippedShield = getEquippedShield(items);
  const equippedWeapons = getEquippedWeapons(items);

  // Calcular AC com equipamento atual
  const calculatedAC = calculateArmorClass(equippedArmor, equippedShield, dexModifier);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Shield className="h-5 w-5" />
          Equipamento
        </h3>
        <p className="text-sm text-gray-400 mt-1">Itens equipados • CA calculada: {calculatedAC}</p>
      </div>
      <div className="space-y-4">
        {/* Slot de Armadura */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Armadura</h4>
          {equippedArmor ? (
            <div className="flex items-center justify-between rounded-lg border border-purple-500/30 glass-card-light p-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-deep-purple" />
                <div>
                  <p className="font-medium">{equippedArmor.name}</p>
                  {equippedArmor.properties?.armorClass && (
                    <p className="text-xs text-gray-400">
                      CA {equippedArmor.properties.armorClass}
                      {equippedArmor.properties.armorType === 'light' && ' + DEX'}
                      {equippedArmor.properties.armorType === 'medium' && ' + DEX (máx +2)'}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onUnequip(equippedArmor.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-sm text-gray-400">
              Nenhuma armadura equipada
            </div>
          )}
        </div>

        {/* Slot de Escudo */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Escudo</h4>
          {equippedShield ? (
            <div className="flex items-center justify-between rounded-lg border border-purple-500/30 glass-card-light p-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-deep-purple" />
                <div>
                  <p className="font-medium">{equippedShield.name}</p>
                  <p className="text-xs text-gray-400">+2 CA</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onUnequip(equippedShield.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-sm text-gray-400">
              Nenhum escudo equipado
            </div>
          )}
        </div>

        {/* Slots de Armas */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">
            Armas ({equippedWeapons.length}/2)
          </h4>
          {equippedWeapons.length > 0 ? (
            <div className="space-y-2">
              {equippedWeapons.map((weapon) => (
                <div
                  key={weapon.id}
                  className="flex items-center justify-between rounded-lg border border-purple-500/30 glass-card-light p-3"
                >
                  <div className="flex items-center gap-3">
                    <Sword className="h-5 w-5 text-deep-purple" />
                    <div>
                      <p className="font-medium">{weapon.name}</p>
                      {weapon.properties?.damage && (
                        <p className="text-xs text-gray-400">
                          {weapon.properties.damage} {weapon.properties.damageType}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onUnequip(weapon.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-sm text-gray-400">
              Nenhuma arma equipada
            </div>
          )}
        </div>

        {/* Cálculo de AC */}
        <div className="rounded-lg glass-card-light p-3 text-sm">
          <p className="font-medium text-white">Cálculo da Classe de Armadura:</p>
          <div className="mt-2 space-y-1 text-xs text-gray-400">
            {equippedArmor ? (
              <>
                <p>• Base da armadura: {equippedArmor.properties?.armorClass || 10}</p>
                {equippedArmor.properties?.armorType === 'light' && (
                  <p>• Modificador de DES: +{dexModifier}</p>
                )}
                {equippedArmor.properties?.armorType === 'medium' && (
                  <p>• Modificador de DES: +{Math.min(dexModifier, 2)} (máx +2)</p>
                )}
                {equippedArmor.properties?.armorType === 'heavy' && (
                  <p>• Armadura pesada (não adiciona DES)</p>
                )}
              </>
            ) : (
              <>
                <p>• Base sem armadura: 10</p>
                <p>• Modificador de DES: +{dexModifier}</p>
              </>
            )}
            {equippedShield && <p>• Escudo: +2</p>}
            <p className="font-medium text-white">= CA Total: {calculatedAC}</p>
          </div>
        </div>

        {/* Aviso sobre limite de armas */}
        {equippedWeapons.length >= 2 && (
          <div className="rounded-md glass-card-light border border-amber-400/30 p-3 text-xs text-amber-300">
            ⚠️ Você já tem 2 armas equipadas. Desequipe uma para equipar outra.
          </div>
        )}
      </div>
    </div>
  );
}
