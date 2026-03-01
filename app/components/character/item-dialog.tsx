'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Item, type ItemCategory, CATEGORY_NAMES, generateItemId } from '@/lib/data/items';

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Item) => void;
  editingItem?: Item | null;
}

export function ItemDialog({ open, onOpenChange, onSave, editingItem }: ItemDialogProps) {
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    description: '',
    quantity: 1,
    weight: 0,
    value: 0,
    category: 'misc',
    equipped: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do item ao editar
  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        name: '',
        description: '',
        quantity: 1,
        weight: 0,
        value: 0,
        category: 'misc',
        equipped: false,
      });
    }
    setError(null);
  }, [editingItem, open]);

  // Validar e salvar
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validações
      if (!formData.name?.trim()) {
        setError('Nome é obrigatório');
        return;
      }

      if ((formData.quantity ?? 0) < 1) {
        setError('Quantidade deve ser maior que 0');
        return;
      }

      if ((formData.weight ?? 0) < 0) {
        setError('Peso não pode ser negativo');
        return;
      }

      if ((formData.value ?? 0) < 0) {
        setError('Valor não pode ser negativo');
        return;
      }

      // Criar item completo
      const item: Item = {
        id: editingItem?.id || generateItemId(),
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        quantity: formData.quantity ?? 1,
        weight: formData.weight ?? 0,
        value: formData.value ?? 0,
        category: (formData.category as ItemCategory) || 'misc',
        equipped: formData.equipped ?? false,
        properties: formData.properties,
      };

      onSave(item);
      onOpenChange(false);
    } catch (err) {
      console.error('Erro ao salvar item:', err);
      setError('Erro ao salvar item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Editar Item' : 'Adicionar Item'}</DialogTitle>
          <DialogDescription>
            {editingItem
              ? 'Atualize as informações do item'
              : 'Adicione um novo item ao seu inventário'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Item <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="Ex: Espada Longa"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSaving}
              maxLength={100}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              placeholder="Descrição do item (opcional)"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSaving}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0} / 500 caracteres
            </p>
          </div>

          {/* Grid: Categoria, Quantidade, Peso, Valor */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Categoria */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.category || 'misc'}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as ItemCategory })
                }
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_NAMES) as ItemCategory[]).map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_NAMES[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantidade
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                }
                disabled={isSaving}
              />
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Peso (lb)
              </label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })
                }
                disabled={isSaving}
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium">
                Valor (po)
              </label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                }
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Equipar (só para armas/armaduras) */}
          {(formData.category === 'weapon' || formData.category === 'armor') && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="equipped"
                checked={formData.equipped ?? false}
                onChange={(e) => setFormData({ ...formData, equipped: e.target.checked })}
                disabled={isSaving}
                className="h-4 w-4 rounded border-gray-300 text-deep-purple focus:ring-deep-purple"
              />
              <label htmlFor="equipped" className="text-sm font-medium">
                Equipar automaticamente
              </label>
            </div>
          )}

          {/* Info sobre peso e valor total */}
          {formData.quantity && formData.quantity > 1 && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium">Totais:</p>
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>
                  Peso total: {((formData.weight ?? 0) * (formData.quantity ?? 1)).toFixed(1)} lb
                </span>
                <span>
                  Valor total: {((formData.value ?? 0) * (formData.quantity ?? 1)).toFixed(2)} po
                </span>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
              ⚠️ {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : editingItem ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
