'use client';

import { useState } from 'react';
import { Package, Plus, Search, Trash2, Edit, Shield, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type Item,
  type ItemCategory,
  CATEGORY_NAMES,
  calculateInventoryWeight,
  calculateCarryingCapacity,
  getEncumbranceStatus,
  type Currency,
} from '@/lib/data/items';

interface InventoryListProps {
  items: Item[];
  currency: Currency;
  strengthScore: number;
  onAddItem: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleEquip: (itemId: string) => void;
}

export function InventoryList({
  items,
  currency,
  strengthScore,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleEquip,
}: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'weight' | 'value'>('name');

  // Calcular peso e capacidade
  const totalWeight = calculateInventoryWeight(items, currency);
  const capacity = calculateCarryingCapacity(strengthScore);
  const encumbrance = getEncumbranceStatus(totalWeight, capacity);
  const weightPercentage = (totalWeight / capacity) * 100;

  // Filtrar e ordenar itens
  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'weight':
          return b.weight * b.quantity - a.weight * a.quantity;
        case 'value':
          return b.value * b.quantity - a.value * a.quantity;
        default:
          return 0;
      }
    });

  // Cor da barra de peso
  const getWeightColor = () => {
    if (encumbrance === 'heavily_encumbered') return 'bg-red-500';
    if (encumbrance === 'encumbered') return 'bg-orange-500';
    if (weightPercentage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Ícone por categoria
  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case 'weapon':
        return <Sword className="h-4 w-4" />;
      case 'armor':
        return <Shield className="h-4 w-4" />;
      case 'consumable':
        return '🧪';
      case 'tool':
        return '🔧';
      case 'treasure':
        return '💎';
      default:
        return '📦';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventário
            </CardTitle>
            <CardDescription>
              {items.length} itens • {totalWeight.toFixed(1)} lb
            </CardDescription>
          </div>
          <Button onClick={onAddItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capacidade de Carga */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Capacidade de Carga</span>
            <span
              className={
                encumbrance === 'normal'
                  ? 'text-green-600 dark:text-green-400'
                  : encumbrance === 'encumbered'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-red-600 dark:text-red-400'
              }
            >
              {totalWeight.toFixed(1)} / {capacity} lb
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${getWeightColor()}`}
              style={{ width: `${Math.min(100, weightPercentage)}%` }}
            />
          </div>
          {encumbrance === 'encumbered' && (
            <p className="text-xs text-orange-600 dark:text-orange-400">
              ⚠️ Sobrecarregado: Velocidade reduzida em 10 pés
            </p>
          )}
          {encumbrance === 'heavily_encumbered' && (
            <p className="text-xs text-red-600 dark:text-red-400">
              ⚠️ Muito sobrecarregado: Velocidade reduzida em 20 pés + desvantagem em testes de
              atributo, ataques e salvaguardas usando FOR, DES e CON
            </p>
          )}
        </div>

        {/* Filtros e Busca */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory('all')}
            >
              Todos ({items.length})
            </Button>
            {(Object.keys(CATEGORY_NAMES) as ItemCategory[]).map((category) => {
              const count = items.filter((item) => item.category === category).length;
              if (count === 0) return null;
              return (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                >
                  {CATEGORY_NAMES[category]} ({count})
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Ordenar por:</span>
            <Button
              variant={sortBy === 'name' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Nome
            </Button>
            <Button
              variant={sortBy === 'weight' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('weight')}
            >
              Peso
            </Button>
            <Button
              variant={sortBy === 'value' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('value')}
            >
              Valor
            </Button>
          </div>
        </div>

        {/* Lista de Itens */}
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
              {searchTerm || filterCategory !== 'all'
                ? 'Nenhum item encontrado'
                : 'Inventário vazio'}
            </p>
            <p className="text-xs text-muted-foreground">
              {searchTerm || filterCategory !== 'all'
                ? 'Tente ajustar os filtros'
                : 'Adicione itens ao seu inventário'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border p-3 transition-all ${
                  item.equipped
                    ? 'border-deep-purple bg-deep-purple/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <div>
                        <h4 className="font-medium">
                          {item.name}
                          {item.equipped && (
                            <span className="ml-2 rounded bg-deep-purple px-2 py-0.5 text-xs text-white">
                              Equipado
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {CATEGORY_NAMES[item.category]}
                        </p>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Qtd: {item.quantity}</span>
                      <span>Peso: {(item.weight * item.quantity).toFixed(1)} lb</span>
                      <span>Valor: {(item.value * item.quantity).toFixed(2)} po</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {(item.category === 'weapon' || item.category === 'armor') && (
                      <Button variant="outline" size="sm" onClick={() => onToggleEquip(item.id)}>
                        {item.equipped ? 'Desequipar' : 'Equipar'}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onEditItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
