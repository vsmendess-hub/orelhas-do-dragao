'use client';

import { useState } from 'react';
import {
  Trophy,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  createMilestone,
  formatMilestoneDate,
  getRecentMilestones,
  groupMilestonesByLevel,
  MILESTONE_CATEGORIES,
  MILESTONE_LEVEL_SUGGESTIONS,
  type Milestone,
} from '@/lib/data/milestones';
import { LevelUpWizard } from './level-up-wizard';
import type { AbilityScores } from '@/lib/data/level-up';

interface MilestoneManagerProps {
  characterId: string;
  characterName: string;
  characterClass: string;
  currentLevel: number;
  currentHP: { current: number; max: number };
  currentAttributes: AbilityScores;
  initialMilestones: Milestone[];
  onLevelUp?: () => void;
}

export function MilestoneManager({
  characterId,
  characterName,
  characterClass,
  currentLevel,
  currentHP,
  currentAttributes,
  initialMilestones,
  onLevelUp,
}: MilestoneManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLevelUpWizardOpen, setIsLevelUpWizardOpen] = useState(false);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const recentMilestones = getRecentMilestones(milestones, 5);
  const groupedMilestones = groupMilestonesByLevel(milestones);
  const totalMilestones = milestones.length;

  // Salvar milestones no Supabase
  const saveMilestones = async (newMilestones: Milestone[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ milestones: newMilestones })
        .eq('id', characterId);

      if (error) throw error;

      setMilestones(newMilestones);
    } catch (err) {
      console.error('Erro ao salvar milestones:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar milestone
  const handleAddMilestone = () => {
    if (!title.trim()) return;

    const newMilestone = createMilestone(title, description, currentLevel);
    const updatedMilestones = [...milestones, newMilestone];

    saveMilestones(updatedMilestones);
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setIsDialogOpen(false);
  };

  // Remover milestone
  const handleRemoveMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones.filter((m) => m.id !== milestoneId);
    saveMilestones(updatedMilestones);
  };

  // Aplicar sugestão
  const applySuggestion = (suggestion: string) => {
    setTitle(suggestion);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Milestone Tracking
              </CardTitle>
              <CardDescription>
                Sistema alternativo de progressão - marque conquistas importantes
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg">
              {totalMilestones} conquistas
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/50 p-3 text-center">
              <p className="text-sm text-muted-foreground">Nível Atual</p>
              <p className="text-2xl font-bold">{currentLevel}</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3 text-center">
              <p className="text-sm text-muted-foreground">Total de Milestones</p>
              <p className="text-2xl font-bold">{totalMilestones}</p>
            </div>
          </div>

          {/* Level Up Button */}
          <Button
            onClick={() => setIsLevelUpWizardOpen(true)}
            className="w-full bg-amber-600 hover:bg-amber-700"
            size="lg"
          >
            <Award className="mr-2 h-5 w-5" />
            Level Up Manual (Milestone)
          </Button>

          {/* Recent Milestones */}
          {recentMilestones.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Conquistas Recentes</Label>
                {milestones.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllMilestones(!showAllMilestones)}
                  >
                    {showAllMilestones ? (
                      <>
                        <ChevronUp className="mr-1 h-4 w-4" />
                        Mostrar menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Ver todas
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {(showAllMilestones ? milestones : recentMilestones).map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{milestone.title}</p>
                        {milestone.level && (
                          <Badge variant="secondary" className="text-xs">
                            Nv. {milestone.level}
                          </Badge>
                        )}
                      </div>
                      {milestone.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatMilestoneDate(milestone.completedAt)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {milestones.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Nenhuma milestone ainda</p>
              <p className="text-xs text-muted-foreground">
                Adicione conquistas importantes para rastrear sua jornada
              </p>
            </div>
          )}

          {/* Add Milestone Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Milestone</DialogTitle>
                <DialogDescription>
                  Registre uma conquista importante da sua jornada
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Categoria (Opcional)</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {MILESTONE_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Suggestions */}
                {selectedCategory && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Sugestões:</Label>
                    <div className="flex flex-wrap gap-2">
                      {MILESTONE_CATEGORIES.find((c) => c.id === selectedCategory)?.examples.map(
                        (example) => (
                          <Button
                            key={example}
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestion(example)}
                            className="text-xs"
                          >
                            {example}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Level Suggestions */}
                {MILESTONE_LEVEL_SUGGESTIONS[currentLevel] && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Sugestões para Nível {currentLevel}:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {MILESTONE_LEVEL_SUGGESTIONS[currentLevel].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="milestone-title">Título *</Label>
                  <Input
                    id="milestone-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Derrotou o Dragão Vermelho"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="milestone-description">Descrição (Opcional)</Label>
                  <Textarea
                    id="milestone-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva a conquista em detalhes..."
                    rows={3}
                  />
                </div>

                {/* Level Info */}
                <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                  <p className="text-muted-foreground">
                    Esta milestone será associada ao <strong>Nível {currentLevel}</strong>
                  </p>
                </div>

                <Button
                  onClick={handleAddMilestone}
                  disabled={!title.trim() || isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Salvando...' : 'Adicionar Milestone'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Milestones by Level (collapsed by default) */}
      {Object.keys(groupedMilestones).length > 0 && showAllMilestones && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Milestones por Nível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedMilestones)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([level, levelMilestones]) => (
                  <div key={level}>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>Nível {level}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {levelMilestones.length} milestone{levelMilestones.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {levelMilestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="rounded-md border bg-muted/50 p-2 text-sm"
                        >
                          <p className="font-medium">{milestone.title}</p>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground">{milestone.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level Up Wizard */}
      <LevelUpWizard
        characterId={characterId}
        characterName={characterName}
        currentLevel={currentLevel}
        characterClass={characterClass}
        currentHP={currentHP}
        currentAttributes={currentAttributes}
        open={isLevelUpWizardOpen}
        onClose={() => setIsLevelUpWizardOpen(false)}
        onComplete={() => {
          setIsLevelUpWizardOpen(false);
          if (onLevelUp) onLevelUp();
        }}
      />
    </div>
  );
}
