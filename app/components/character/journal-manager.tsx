'use client';

import { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Star, Search } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  type JournalEntry,
  type EntryType,
  ENTRY_TYPE_LABELS,
  ENTRY_TYPE_ICONS,
  ENTRY_TYPE_COLORS,
  createJournalEntry,
  updateJournalEntry,
  sortEntriesByDate,
  searchEntries,
  filterEntriesByType,
  getAllTags,
  formatEntryDate,
} from '@/lib/data/journal';

interface JournalManagerProps {
  characterId: string;
  initialEntries: JournalEntry[];
}

export function JournalManager({ characterId, initialEntries }: JournalManagerProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(sortEntriesByDate(initialEntries));
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<EntryType | 'all'>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    type: 'session',
    title: '',
    content: '',
    important: false,
    tags: [],
  });

  // Salvar no Supabase
  const saveEntries = async (newEntries: JournalEntry[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ journal: newEntries })
        .eq('id', characterId);

      if (error) throw error;
      setEntries(sortEntriesByDate(newEntries));
    } catch (err) {
      console.error('Erro ao salvar diário:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar entrada
  const handleAddEntry = () => {
    const entryData = createJournalEntry(
      formData.type as EntryType,
      formData.title!,
      formData.content!,
      {
        sessionNumber: formData.sessionNumber,
        tags: formData.tags,
        important: formData.important,
      }
    );

    const newEntry: JournalEntry = {
      ...entryData,
      id: crypto.randomUUID(),
    };

    const newEntries = [...entries, newEntry];
    saveEntries(newEntries);
    setIsDialogOpen(false);
    resetForm();
  };

  // Editar entrada
  const handleEditEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setFormData(entry);
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  // Atualizar entrada
  const handleUpdateEntry = () => {
    const newEntries = entries.map((e) => {
      if (e.id === editingId) {
        return updateJournalEntry(e, formData);
      }
      return e;
    });
    saveEntries(newEntries);
    setIsDialogOpen(false);
    setEditingId(null);
    resetForm();
  };

  // Remover entrada
  const handleRemoveEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    saveEntries(newEntries);
  };

  // Toggle importante
  const handleToggleImportant = (id: string) => {
    const newEntries = entries.map((e) => (e.id === id ? { ...e, important: !e.important } : e));
    saveEntries(newEntries);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'session',
      title: '',
      content: '',
      important: false,
      tags: [],
    });
  };

  // Filtrar e buscar
  let filteredEntries = entries;
  if (filterType !== 'all') {
    filteredEntries = filterEntriesByType(filteredEntries, filterType);
  }
  if (searchQuery) {
    filteredEntries = searchEntries(filteredEntries, searchQuery);
  }

  const allTags = getAllTags(entries);

  // Renderizar cartão de entrada
  const renderEntryCard = (entry: JournalEntry) => {
    return (
      <div
        key={entry.id}
        className={`group rounded-lg border p-4 transition-all hover:shadow-md ${
          entry.important ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : ''
        }`}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className={ENTRY_TYPE_COLORS[entry.type]}>
                {ENTRY_TYPE_ICONS[entry.type]} {ENTRY_TYPE_LABELS[entry.type]}
              </Badge>
              {entry.sessionNumber && (
                <Badge variant="outline" className="text-xs">
                  Sessão #{entry.sessionNumber}
                </Badge>
              )}
              {entry.important && <Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
            </div>
            <h4 className="mt-2 font-semibold">{entry.title}</h4>
            <p className="text-xs text-gray-400">{formatEntryDate(entry.date)}</p>
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleImportant(entry.id)}
              disabled={isSaving}
              className="h-8 w-8"
            >
              <Star
                className={`h-4 w-4 ${entry.important ? 'fill-amber-500 text-amber-500' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditEntry(entry.id)}
              disabled={isSaving}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveEntry(entry.id)}
              disabled={isSaving}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <p className="mb-3 whitespace-pre-wrap text-sm text-gray-400">{entry.content}</p>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Diário de Aventura
            {entries.length > 0 && <Badge variant="secondary">{entries.length}</Badge>}
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Editar Entrada' : 'Nova Entrada de Diário'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId
                      ? 'Edite as informações da entrada'
                      : 'Registre uma sessão, missão, NPC ou qualquer nota importante'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry-type">Tipo *</Label>
                      <select
                        id="entry-type"
                        value={formData.type || 'session'}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as EntryType })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.entries(ENTRY_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {ENTRY_TYPE_ICONS[value as EntryType]} {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.type === 'session' && (
                      <div className="space-y-2">
                        <Label htmlFor="session-number">Número da Sessão</Label>
                        <Input
                          id="session-number"
                          type="number"
                          value={formData.sessionNumber || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sessionNumber: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="Ex: 1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-title">Título *</Label>
                    <Input
                      id="entry-title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: A Taverna do Dragão Vermelho"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-content">Conteúdo *</Label>
                    <Textarea
                      id="entry-content"
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Descreva o que aconteceu nesta sessão, informações sobre o NPC, local, missão..."
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="entry-tags"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter((t) => t),
                        })
                      }
                      placeholder="Ex: combate, roleplay, item mágico"
                    />
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400">Existentes:</span>
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              const currentTags = formData.tags || [];
                              if (!currentTags.includes(tag)) {
                                setFormData({
                                  ...formData,
                                  tags: [...currentTags, tag],
                                });
                              }
                            }}
                            className="text-xs text-deep-purple hover:underline"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="entry-important"
                      checked={formData.important || false}
                      onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="entry-important" className="cursor-pointer">
                      Marcar como importante
                    </Label>
                  </div>

                  <Button
                    onClick={editingId ? handleUpdateEntry : handleAddEntry}
                    disabled={isSaving || !formData.title || !formData.content}
                    className="w-full tab-purple"
                  >
                    {editingId ? 'Atualizar' : 'Adicionar'} Entrada
                  </Button>
                </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar no diário..."
                className="pl-9"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EntryType | 'all')}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              {Object.entries(ENTRY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
        <div className="glass-card-light rounded-lg border border-dashed border-purple-500/50 py-8 text-center text-sm">
          <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-white">
            {entries.length === 0 ? 'Nenhuma entrada no diário' : 'Nenhuma entrada encontrada'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">{filteredEntries.map(renderEntryCard)}</div>
      )}
    </div>
  );
}
