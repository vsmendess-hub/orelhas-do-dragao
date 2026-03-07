'use client';

import { useState } from 'react';
import { Award, Plus, X, Lightbulb, BookOpen, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  type CharacterFeat,
  type Feat,
  COMMON_FEATS,
  getFeatLevels,
  getFeatById,
  searchFeats,
} from '@/lib/data/feats';

interface FeatsManagerProps {
  characterId: string;
  characterClass: string;
  currentLevel: number;
  initialFeats: CharacterFeat[];
}

export function FeatsManager({
  characterId,
  characterClass,
  currentLevel,
  initialFeats,
}: FeatsManagerProps) {
  const [feats, setFeats] = useState<CharacterFeat[]>(initialFeats);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFeatId, setSelectedFeatId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(currentLevel.toString());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFeat, setViewingFeat] = useState<Feat | null>(null);

  const availableLevels = getFeatLevels(characterClass, currentLevel);
  const takenFeatIds = feats.map((f) => f.featId);
  const availableFeats = COMMON_FEATS.filter((f) => !takenFeatIds.includes(f.id));
  const filteredFeats = searchQuery ? searchFeats(searchQuery) : availableFeats;

  // Salvar feats no Supabase
  const saveFeats = async (newFeats: CharacterFeat[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ feats: newFeats })
        .eq('id', characterId);

      if (error) throw error;

      setFeats(newFeats);
    } catch (err) {
      console.error('Erro ao salvar feats:', err);
      alert('Erro ao salvar feats. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar feat
  const handleAddFeat = () => {
    if (!selectedFeatId) return;

    const feat = getFeatById(selectedFeatId);
    if (!feat) return;

    const newFeat: CharacterFeat = {
      featId: feat.id,
      featName: feat.name,
      level: parseInt(selectedLevel),
    };

    const updatedFeats = [...feats, newFeat];
    saveFeats(updatedFeats);
    setIsDialogOpen(false);
    setSelectedFeatId('');
  };

  // Remover feat
  const handleRemoveFeat = (featId: string) => {
    const updatedFeats = feats.filter((f) => f.featId !== featId);
    saveFeats(updatedFeats);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Feats (Talentos)
            </h3>
            <p className="text-sm text-gray-400">
              Habilidades especiais obtidas no lugar de Ability Score Improvements
            </p>
          </div>
          <Badge variant="secondary">{feats.length} feats</Badge>
        </div>

        {/* Feats do Personagem */}
        {feats.length > 0 ? (
            <div className="space-y-3">
              {feats.map((feat) => {
                const featDetails = getFeatById(feat.featId);
                if (!featDetails) return null;

                return (
                  <div key={`${feat.featId}-${feat.level}`} className="glass-card rounded-xl p-4 border-2 border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-white">{feat.featName}</h4>
                          <Badge variant="outline" className="text-xs">
                            Nível {feat.level}
                          </Badge>
                        </div>
                        {featDetails.prerequisites && (
                          <p className="mt-1 text-xs text-gray-400">
                            Pré-requisito: {featDetails.prerequisites}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingFeat(featDetails)}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeat(feat.featId)}
                          disabled={isSaving}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{featDetails.description}</p>
                    <div className="mt-2 space-y-1">
                      {featDetails.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-white">
                          <span className="text-green-400">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 p-8 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-white">Nenhum feat ainda</p>
              <p className="text-xs text-gray-400">
                Adicione feats obtidos em níveis ASI
              </p>
            </div>
          )}

          {/* Info sobre níveis ASI */}
          {availableLevels.length > 0 && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Níveis com ASI/Feat disponíveis:</strong> {availableLevels.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Botão Adicionar */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full tab-purple" disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Feat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Feat</DialogTitle>
                <DialogDescription>
                  Escolha um feat da lista. Feats são obtidos em níveis específicos no lugar de ASI.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Busca */}
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar Feat</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Digite o nome do feat..."
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Nível */}
                <div className="space-y-2">
                  <Label htmlFor="level">Nível Obtido</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLevels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl.toString()}>
                          Nível {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lista de Feats */}
                <div className="space-y-2">
                  <Label>Feats Disponíveis</Label>
                  <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-md border p-2">
                    {filteredFeats.length > 0 ? (
                      filteredFeats.map((feat) => (
                        <div
                          key={feat.id}
                          className={`cursor-pointer rounded-md border-2 p-3 transition-colors hover:border-purple-500/50 hover:scale-[1.01] ${
                            selectedFeatId === feat.id ? 'border-2 border-purple-500 bg-purple-500/10' : 'border-white/10'
                          }`}
                          onClick={() => setSelectedFeatId(feat.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-white">{feat.name}</p>
                              {feat.prerequisites && (
                                <p className="text-xs text-gray-400">
                                  Pré-requisito: {feat.prerequisites}
                                </p>
                              )}
                              <p className="mt-1 text-sm text-gray-400">
                                {feat.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {feat.source}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-sm text-gray-400">
                        Nenhum feat encontrado
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAddFeat}
                  disabled={!selectedFeatId || isSaving}
                  className="w-full tab-purple"
                >
                  {isSaving ? 'Salvando...' : 'Adicionar Feat'}
                </Button>
              </div>
            </DialogContent>
        </Dialog>
      </div>

      {/* Dialog de Visualização de Feat */}
      {viewingFeat && (
        <Dialog open={!!viewingFeat} onOpenChange={() => setViewingFeat(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingFeat.name}</DialogTitle>
              <DialogDescription>
                {viewingFeat.prerequisites && `Pré-requisito: ${viewingFeat.prerequisites}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">{viewingFeat.description}</p>
              </div>
              <div>
                <Label className="text-base text-white">Benefícios:</Label>
                <ul className="mt-2 space-y-2">
                  {viewingFeat.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white">
                      <span className="text-green-400">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between glass-card-light rounded-lg border border-white/10 p-2 text-xs">
                <span className="text-gray-400">Fonte:</span>
                <Badge variant="outline">{viewingFeat.source}</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
