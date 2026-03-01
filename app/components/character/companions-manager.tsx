'use client';

import { useState } from 'react';
import { Users, Plus, Trash2, Heart, Shield, Zap, Edit2, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  type Companion,
  type CompanionType,
  EMPTY_COMPANION,
  COMPANION_TYPE_LABELS,
  COMPANION_TYPE_ICONS,
  COMPANION_TEMPLATES,
  calculateCompanionModifier,
  updateCompanionHP,
  toggleCompanionActive,
  createCompanionFromTemplate,
} from '@/lib/data/companions';

interface CompanionsManagerProps {
  characterId: string;
  initialCompanions: Companion[];
}

export function CompanionsManager({ characterId, initialCompanions }: CompanionsManagerProps) {
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Companion>>({ ...EMPTY_COMPANION });

  // Salvar no Supabase
  const saveCompanions = async (newCompanions: Companion[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ companions: newCompanions })
        .eq('id', characterId);

      if (error) throw error;
      setCompanions(newCompanions);
    } catch (err) {
      console.error('Erro ao salvar companheiros:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar companheiro
  const handleAddCompanion = () => {
    const newCompanion: Companion = {
      ...(formData as Omit<Companion, 'id' | 'createdAt'>),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const newCompanions = [...companions, newCompanion];
    saveCompanions(newCompanions);
    setIsDialogOpen(false);
    setFormData({ ...EMPTY_COMPANION });
  };

  // Editar companheiro
  const handleEditCompanion = (id: string) => {
    const companion = companions.find((c) => c.id === id);
    if (companion) {
      setFormData(companion);
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  // Atualizar companheiro
  const handleUpdateCompanion = () => {
    const newCompanions = companions.map((c) => (c.id === editingId ? { ...c, ...formData } : c));
    saveCompanions(newCompanions);
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ ...EMPTY_COMPANION });
  };

  // Remover companheiro
  const handleRemoveCompanion = (id: string) => {
    const newCompanions = companions.filter((c) => c.id !== id);
    saveCompanions(newCompanions);
  };

  // Atualizar HP
  const handleUpdateHP = (id: string, newCurrent: number) => {
    const newCompanions = companions.map((c) =>
      c.id === id ? updateCompanionHP(c, newCurrent) : c
    );
    saveCompanions(newCompanions);
  };

  // Toggle ativo
  const handleToggleActive = (id: string) => {
    const newCompanions = companions.map((c) => (c.id === id ? toggleCompanionActive(c) : c));
    saveCompanions(newCompanions);
  };

  // Carregar template
  const handleLoadTemplate = (templateKey: string) => {
    const templateData = createCompanionFromTemplate(templateKey);
    setFormData(templateData);
  };

  // Renderizar cartão de companheiro
  const renderCompanionCard = (companion: Companion) => {
    const hpPercentage = (companion.hp.current / companion.hp.max) * 100;
    const isLowHP = hpPercentage < 30;
    const isDead = companion.hp.current === 0;

    return (
      <div
        key={companion.id}
        className={`rounded-lg border p-4 transition-all ${
          !companion.active ? 'opacity-60' : ''
        } ${isDead ? 'border-red-500 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20' : ''}`}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{COMPANION_TYPE_ICONS[companion.type]}</span>
            <div>
              <h4 className="font-semibold">{companion.name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {COMPANION_TYPE_LABELS[companion.type]}
                </Badge>
                {companion.race && (
                  <span className="text-xs text-muted-foreground">{companion.race}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditCompanion(companion.id)}
              disabled={isSaving}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveCompanion(companion.id)}
              disabled={isSaving}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-muted p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              HP
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleUpdateHP(companion.id, companion.hp.current - 1)}
                disabled={isSaving || companion.hp.current === 0}
              >
                -
              </Button>
              <span
                className={`font-bold ${isLowHP ? 'text-red-600' : ''} ${isDead ? 'text-red-700' : ''}`}
              >
                {companion.hp.current}/{companion.hp.max}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleUpdateHP(companion.id, companion.hp.current + 1)}
                disabled={isSaving || companion.hp.current >= companion.hp.max}
              >
                +
              </Button>
            </div>
          </div>

          <div className="rounded bg-muted p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              AC
            </div>
            <p className="mt-1 font-bold">{companion.ac}</p>
          </div>

          <div className="rounded bg-muted p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              Vel
            </div>
            <p className="mt-1 font-bold">{companion.speed}</p>
          </div>
        </div>

        {/* Attributes */}
        <div className="mb-3 grid grid-cols-6 gap-1 text-center text-xs">
          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((attr) => (
            <div key={attr} className="rounded bg-muted/50 p-1">
              <p className="font-medium uppercase text-muted-foreground">{attr}</p>
              <p className="font-bold">{companion.abilities[attr]}</p>
              <p className="text-[10px] text-muted-foreground">
                {calculateCompanionModifier(companion.abilities[attr]) >= 0 ? '+' : ''}
                {calculateCompanionModifier(companion.abilities[attr])}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        {companion.features && companion.features.length > 0 && (
          <div className="mb-3 text-xs">
            <p className="mb-1 font-medium text-muted-foreground">Características:</p>
            <div className="flex flex-wrap gap-1">
              {companion.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {companion.notes && (
          <div className="mb-3 rounded bg-muted/50 p-2 text-xs italic text-muted-foreground">
            {companion.notes}
          </div>
        )}

        {/* Actions */}
        <Button
          onClick={() => handleToggleActive(companion.id)}
          disabled={isSaving}
          variant={companion.active ? 'default' : 'outline'}
          size="sm"
          className="w-full"
        >
          {companion.active ? '✓ Ativo' : 'Inativo'}
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Companheiros
            {companions.length > 0 && <Badge variant="secondary">{companions.length}</Badge>}
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ ...EMPTY_COMPANION });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Companheiro' : 'Adicionar Companheiro'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Edite as informações do companheiro'
                    : 'Adicione um familiar, besta ou NPC que acompanha o personagem'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Templates */}
                {!editingId && (
                  <div className="space-y-2">
                    <Label>Templates Rápidos</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(COMPANION_TEMPLATES).map((key) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadTemplate(key)}
                        >
                          {COMPANION_TEMPLATES[key].name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companion-name">Nome *</Label>
                      <Input
                        id="companion-name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Fang"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companion-type">Tipo *</Label>
                      <select
                        id="companion-type"
                        value={formData.type || 'beast'}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as CompanionType })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.entries(COMPANION_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companion-race">Raça/Espécie</Label>
                    <Input
                      id="companion-race"
                      value={formData.race || ''}
                      onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                      placeholder="Ex: Lobo, Corvo"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companion-hp-max">HP Máximo *</Label>
                      <Input
                        id="companion-hp-max"
                        type="number"
                        value={formData.hp?.max || 10}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hp: {
                              current: formData.hp?.current || parseInt(e.target.value),
                              max: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companion-ac">CA *</Label>
                      <Input
                        id="companion-ac"
                        type="number"
                        value={formData.ac || 10}
                        onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companion-speed">Velocidade *</Label>
                      <Input
                        id="companion-speed"
                        type="number"
                        value={formData.speed || 30}
                        onChange={(e) =>
                          setFormData({ ...formData, speed: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((attr) => (
                      <div key={attr} className="space-y-2">
                        <Label htmlFor={`companion-${attr}`} className="text-xs uppercase">
                          {attr}
                        </Label>
                        <Input
                          id={`companion-${attr}`}
                          type="number"
                          value={formData.abilities?.[attr] || 10}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              abilities: {
                                ...(formData.abilities || EMPTY_COMPANION.abilities),
                                [attr]: parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companion-notes">Notas</Label>
                    <Textarea
                      id="companion-notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Características, habilidades especiais, história..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={editingId ? handleUpdateCompanion : handleAddCompanion}
                  disabled={isSaving || !formData.name}
                  className="w-full"
                >
                  {editingId ? 'Atualizar' : 'Adicionar'} Companheiro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {companions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Nenhum companheiro</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{companions.map(renderCompanionCard)}</div>
        )}
      </CardContent>
    </Card>
  );
}
