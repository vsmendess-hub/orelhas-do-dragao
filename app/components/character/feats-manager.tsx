'use client';

import { useState } from 'react';
import { Award, Plus, X, Lightbulb, BookOpen, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Feats (Talentos)
              </CardTitle>
              <CardDescription>
                Habilidades especiais obtidas no lugar de Ability Score Improvements
              </CardDescription>
            </div>
            <Badge variant="secondary">{feats.length} feats</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feats do Personagem */}
          {feats.length > 0 ? (
            <div className="space-y-3">
              {feats.map((feat) => {
                const featDetails = getFeatById(feat.featId);
                if (!featDetails) return null;

                return (
                  <Card key={`${feat.featId}-${feat.level}`} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{feat.featName}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              Nível {feat.level}
                            </Badge>
                          </div>
                          {featDetails.prerequisites && (
                            <p className="mt-1 text-xs text-muted-foreground">
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
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{featDetails.description}</p>
                      <div className="mt-2 space-y-1">
                        {featDetails.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600">✓</span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Nenhum feat ainda</p>
              <p className="text-xs text-muted-foreground">
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
              <Button className="w-full" disabled={isSaving}>
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
                          className={`cursor-pointer rounded-md border-2 p-3 transition-colors hover:border-primary ${
                            selectedFeatId === feat.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedFeatId(feat.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">{feat.name}</p>
                              {feat.prerequisites && (
                                <p className="text-xs text-muted-foreground">
                                  Pré-requisito: {feat.prerequisites}
                                </p>
                              )}
                              <p className="mt-1 text-sm text-muted-foreground">
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
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum feat encontrado
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAddFeat}
                  disabled={!selectedFeatId || isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Salvando...' : 'Adicionar Feat'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

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
                <p className="text-sm text-muted-foreground">{viewingFeat.description}</p>
              </div>
              <div>
                <Label className="text-base">Benefícios:</Label>
                <ul className="mt-2 space-y-2">
                  {viewingFeat.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-2 text-xs">
                <span className="text-muted-foreground">Fonte:</span>
                <Badge variant="outline">{viewingFeat.source}</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
