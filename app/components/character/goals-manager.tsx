'use client';

import { useState } from 'react';
import { Target, Plus, Edit2, Trash2, Check, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type Goal,
  type GoalStatus,
  type GoalPriority,
  type GoalType,
  GOAL_TYPE_LABELS,
  GOAL_TYPE_ICONS,
  GOAL_STATUS_LABELS,
  GOAL_STATUS_COLORS,
  GOAL_PRIORITY_LABELS,
  GOAL_PRIORITY_COLORS,
  createGoal,
  updateGoal,
  completeGoal,
  filterGoalsByStatus,
  getActiveGoals,
  sortGoalsByPriority,
  formatGoalDate,
  isGoalOverdue,
  isDeadlineClose,
} from '@/lib/data/goals';

interface GoalsManagerProps {
  characterId: string;
  initialGoals: Goal[];
}

export function GoalsManager({ characterId, initialGoals }: GoalsManagerProps) {
  const [goals, setGoals] = useState<Goal[]>(sortGoalsByPriority(initialGoals));
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<GoalStatus | 'all'>('active');

  // Form state
  const [formData, setFormData] = useState<{
    type: GoalType;
    title: string;
    description: string;
    priority: GoalPriority;
    deadline?: string;
    rewards?: string;
    notes?: string;
  }>({
    type: 'personal',
    title: '',
    description: '',
    priority: 'medium',
  });

  const activeGoals = getActiveGoals(goals);
  const completedGoals = filterGoalsByStatus(goals, 'completed');
  const failedGoals = filterGoalsByStatus(goals, 'failed');

  // Salvar no Supabase
  const saveGoals = async (newGoals: Goal[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ goals: newGoals })
        .eq('id', characterId);

      if (error) throw error;
      setGoals(sortGoalsByPriority(newGoals));
    } catch (err) {
      console.error('Erro ao salvar objetivos:', err);
      alert('Erro ao salvar objetivos. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      type: 'personal',
      title: '',
      description: '',
      priority: 'medium',
    });
    setEditingGoal(null);
  };

  // Abrir dialog para adicionar
  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Abrir dialog para editar
  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      title: goal.title,
      description: goal.description,
      priority: goal.priority,
      deadline: goal.deadline,
      rewards: goal.rewards,
      notes: goal.notes,
    });
    setIsDialogOpen(true);
  };

  // Salvar objetivo (criar ou editar)
  const handleSave = () => {
    if (!formData.title.trim()) return;

    let newGoals: Goal[];

    if (editingGoal) {
      // Editar
      const updated = updateGoal(editingGoal, formData);
      newGoals = goals.map((g) => (g.id === editingGoal.id ? updated : g));
    } else {
      // Criar novo
      const newGoal: Goal = {
        ...createGoal(formData.type, formData.title, formData.description, formData.priority, {
          deadline: formData.deadline,
          rewards: formData.rewards,
          notes: formData.notes,
        }),
        id: crypto.randomUUID(),
      };
      newGoals = [...goals, newGoal];
    }

    saveGoals(newGoals);
    setIsDialogOpen(false);
    resetForm();
  };

  // Marcar como completo
  const handleComplete = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const completed = completeGoal(goal);
    const newGoals = goals.map((g) => (g.id === goalId ? completed : g));
    saveGoals(newGoals);
  };

  // Mudar status
  const handleChangeStatus = (goalId: string, status: GoalStatus) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updated = updateGoal(goal, {
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    });
    const newGoals = goals.map((g) => (g.id === goalId ? updated : g));
    saveGoals(newGoals);
  };

  // Remover objetivo
  const handleDelete = (goalId: string) => {
    if (!confirm('Tem certeza que deseja remover este objetivo?')) return;
    const newGoals = goals.filter((g) => g.id !== goalId);
    saveGoals(newGoals);
  };

  // Renderizar lista de objetivos
  const renderGoalsList = (goalsToRender: Goal[]) => {
    if (goalsToRender.length === 0) {
      return (
        <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 p-8 text-center">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-white">Nenhum objetivo aqui</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {goalsToRender.map((goal) => {
          const isOverdue = isGoalOverdue(goal);
          const isClose = isDeadlineClose(goal);

          return (
            <div key={goal.id} className="glass-card rounded-xl p-4 border-2 border-white/10">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{GOAL_TYPE_ICONS[goal.type]}</span>
                    <h4 className="text-base font-semibold text-white">{goal.title}</h4>
                    <Badge variant="outline" className={GOAL_STATUS_COLORS[goal.status]}>
                      {GOAL_STATUS_LABELS[goal.status]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${GOAL_PRIORITY_COLORS[goal.priority]}`}
                    >
                      {GOAL_PRIORITY_LABELS[goal.priority]}
                    </Badge>
                    {goal.deadline && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isOverdue
                            ? 'bg-red-500/10 text-red-700 border-red-500/20'
                            : isClose
                              ? 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                              : ''
                        }`}
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatGoalDate(goal.deadline)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {GOAL_TYPE_LABELS[goal.type]}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    {goal.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComplete(goal.id)}
                        disabled={isSaving}
                        className="text-green-600 hover:text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(goal)}
                      disabled={isSaving}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                      disabled={isSaving}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white">{goal.description}</p>
                {goal.rewards && (
                  <div className="flex items-start gap-2 rounded-md bg-amber-50 p-2 text-xs dark:bg-amber-950/20">
                    <span>🏆</span>
                    <div>
                      <p className="font-medium">Recompensas:</p>
                      <p className="text-gray-400">{goal.rewards}</p>
                    </div>
                  </div>
                )}
                {goal.notes && (
                  <div className="rounded-md bg-muted/50 p-2 text-xs">
                    <p className="font-medium">Notas:</p>
                    <p className="text-gray-400">{goal.notes}</p>
                  </div>
                )}
                {goal.status !== 'active' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeStatus(goal.id, 'active')}
                      className="text-xs"
                    >
                      Reativar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Objetivos
          </h3>
          <p className="text-sm text-gray-400">Metas pessoais, missões e objetivos de longo prazo</p>
        </div>
        <Button onClick={handleOpenAdd} disabled={isSaving} className="tab-purple">
          <Plus className="mr-2 h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GoalStatus | 'all')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">
              Em Andamento ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completos ({completedGoals.length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Falhados ({failedGoals.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              Todos ({goals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {renderGoalsList(activeGoals)}
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            {renderGoalsList(completedGoals)}
          </TabsContent>
          <TabsContent value="failed" className="mt-4">
            {renderGoalsList(failedGoals)}
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            {renderGoalsList(goals)}
          </TabsContent>
        </Tabs>

      {/* Dialog de Adicionar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Editar Objetivo' : 'Novo Objetivo'}</DialogTitle>
            <DialogDescription>
              Defina metas pessoais, missões ou objetivos de longo prazo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as GoalType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {GOAL_TYPE_ICONS[key as GoalType]} {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Derrotar o Dragão Vermelho"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o objetivo em detalhes..."
                rows={4}
              />
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v as GoalPriority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_PRIORITY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo (Opcional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline || ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            {/* Recompensas */}
            <div className="space-y-2">
              <Label htmlFor="rewards">Recompensas Esperadas (Opcional)</Label>
              <Textarea
                id="rewards"
                value={formData.rewards || ''}
                onChange={(e) => setFormData({ ...formData, rewards: e.target.value })}
                placeholder="Ex: Item mágico, XP, aliança com facção..."
                rows={2}
              />
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionais, pistas, estratégias..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!formData.title.trim() || !formData.description.trim() || isSaving}
              className="w-full tab-purple"
            >
              {isSaving ? 'Salvando...' : editingGoal ? 'Salvar Alterações' : 'Criar Objetivo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
