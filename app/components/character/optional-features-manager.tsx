'use client';

import { useState } from 'react';
import { Sparkles, Plus, X, Info, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CharacterOptionalFeature,
  type OptionalFeature,
  type FeatureCategory,
  getOptionalFeaturesByClass,
  getOptionalFeaturesByCategory,
  meetsPrerequisites,
  getFeatureById,
  CATEGORY_LABELS,
} from '@/lib/data/optional-features';

interface OptionalFeaturesManagerProps {
  characterId: string;
  characterClass: string;
  characterLevel: number;
  initialFeatures: CharacterOptionalFeature[];
}

export function OptionalFeaturesManager({
  characterId,
  characterClass,
  characterLevel,
  initialFeatures,
}: OptionalFeaturesManagerProps) {
  const [features, setFeatures] = useState<CharacterOptionalFeature[]>(initialFeatures);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState('');
  const [filterCategory, setFilterCategory] = useState<FeatureCategory | 'all'>('all');
  const [viewingFeature, setViewingFeature] = useState<OptionalFeature | null>(null);

  const availableFeatures = getOptionalFeaturesByClass(characterClass);
  const takenFeatureIds = features.map((f) => f.featureId);
  const availableFeaturesFiltered =
    filterCategory === 'all'
      ? availableFeatures
      : availableFeatures.filter((f) => f.category === filterCategory);

  // Salvar no Supabase
  const saveFeatures = async (newFeatures: CharacterOptionalFeature[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ optional_features: newFeatures })
        .eq('id', characterId);

      if (error) throw error;

      setFeatures(newFeatures);
    } catch (err) {
      console.error('Erro ao salvar optional features:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar feature
  const handleAddFeature = () => {
    if (!selectedFeatureId) return;

    const feature = getFeatureById(selectedFeatureId);
    if (!feature) return;

    // Verificar pré-requisitos
    const check = meetsPrerequisites(feature, characterLevel);
    if (!check.meets) {
      alert(`Não atende pré-requisitos: ${check.reason}`);
      return;
    }

    const newFeature: CharacterOptionalFeature = {
      featureId: feature.id,
      featureName: feature.name,
      category: feature.category,
      level: characterLevel,
    };

    const updatedFeatures = [...features, newFeature];
    saveFeatures(updatedFeatures);
    setIsDialogOpen(false);
    setSelectedFeatureId('');
  };

  // Remover feature
  const handleRemoveFeature = (featureId: string) => {
    const updatedFeatures = features.filter((f) => f.featureId !== featureId);
    saveFeatures(updatedFeatures);
  };

  // Agrupar features por categoria
  const featuresByCategory = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<FeatureCategory, CharacterOptionalFeature[]>
  );

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Optional Features
          </h3>
          <p className="text-sm text-gray-400">
            Fighting Styles, Invocações, Manobras e outras features opcionais
          </p>
        </div>
        <Badge variant="secondary">{features.length} features</Badge>
      </div>

      {/* Features do Personagem */}
      {features.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
              <div key={category}>
                <Label className="text-sm font-semibold text-white">
                  {CATEGORY_LABELS[category as FeatureCategory]}
                </Label>
                <div className="mt-2 space-y-2">
                  {categoryFeatures.map((feature) => {
                    const featureDetails = getFeatureById(feature.featureId);
                    if (!featureDetails) return null;

                    return (
                      <div key={feature.featureId} className="glass-card rounded-xl p-4 border-2 border-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-white">{feature.featureName}</p>
                              <Badge variant="outline" className="text-xs">
                                Nível {feature.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {featureDetails.source}
                              </Badge>
                            </div>
                            {featureDetails.prerequisites && (
                              <p className="mt-1 text-xs text-gray-400">
                                Pré-requisito: {featureDetails.prerequisites}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-gray-400">
                              {featureDetails.description}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingFeature(featureDetails)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(feature.featureId)}
                              disabled={isSaving}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 p-8 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-white">Nenhuma optional feature ainda</p>
            <p className="text-xs text-gray-400">
              Adicione Fighting Styles, Invocações e outras features
            </p>
          </div>
        )}

        {/* Info */}
        {availableFeatures.length === 0 && (
          <div className="glass-card-light rounded-lg border border-white/10 p-3 text-sm text-gray-400">
            Sua classe ({characterClass}) não tem optional features disponíveis neste sistema.
          </div>
        )}

        {/* Botão Adicionar */}
        {availableFeatures.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full tab-purple" disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Optional Feature
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Optional Feature</DialogTitle>
                <DialogDescription>
                  Escolha uma feature opcional disponível para {characterClass}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Filtro */}
                <div className="space-y-2">
                  <Label htmlFor="filter">Filtrar por Categoria</Label>
                  <Select
                    value={filterCategory}
                    onValueChange={(v) => setFilterCategory(v as FeatureCategory | 'all')}
                  >
                    <SelectTrigger id="filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lista de Features */}
                <div className="space-y-2">
                  <Label>Features Disponíveis</Label>
                  <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-md border p-2">
                    {availableFeaturesFiltered.length > 0 ? (
                      availableFeaturesFiltered.map((feature) => {
                        const alreadyTaken = takenFeatureIds.includes(feature.id);
                        const check = meetsPrerequisites(feature, characterLevel);

                        return (
                          <div
                            key={feature.id}
                            className={`cursor-pointer rounded-md border-2 p-3 transition-all ${
                              alreadyTaken
                                ? 'opacity-50 cursor-not-allowed'
                                : selectedFeatureId === feature.id
                                  ? 'border-2 border-purple-500 bg-purple-500/10'
                                  : 'border-white/10 hover:border-purple-500/50 hover:scale-[1.01]'
                            }`}
                            onClick={() => !alreadyTaken && setSelectedFeatureId(feature.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-white">{feature.name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {CATEGORY_LABELS[feature.category]}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Nv. {feature.level}+
                                  </Badge>
                                  {alreadyTaken && (
                                    <Badge variant="outline" className="bg-green-500/10 text-xs">
                                      Já possui
                                    </Badge>
                                  )}
                                </div>
                                {feature.prerequisites && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    Pré-requisito: {feature.prerequisites}
                                  </p>
                                )}
                                <p className="mt-1 text-sm text-gray-400">
                                  {feature.description}
                                </p>
                                {!check.meets && (
                                  <p className="mt-1 text-xs text-red-400">{check.reason}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {feature.source}
                              </Badge>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-8 text-center text-sm text-gray-400">
                        Nenhuma feature encontrada nesta categoria
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAddFeature}
                  disabled={!selectedFeatureId || isSaving}
                  className="w-full tab-purple"
                >
                  {isSaving ? 'Salvando...' : 'Adicionar Feature'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {/* Dialog de Visualização */}
      {viewingFeature && (
        <Dialog open={!!viewingFeature} onOpenChange={() => setViewingFeature(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingFeature.name}</DialogTitle>
              <DialogDescription>
                {CATEGORY_LABELS[viewingFeature.category]} • {viewingFeature.source}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">{viewingFeature.description}</p>
              </div>
              {viewingFeature.prerequisites && (
                <div className="glass-card-light rounded-lg border border-white/10 p-3 text-sm">
                  <p className="font-medium text-white">Pré-requisito:</p>
                  <p className="text-gray-400">{viewingFeature.prerequisites}</p>
                </div>
              )}
              <div className="flex items-center justify-between glass-card-light rounded-lg border border-white/10 p-2 text-xs">
                <span className="text-gray-400">Nível mínimo:</span>
                <Badge variant="outline">{viewingFeature.level}+</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
