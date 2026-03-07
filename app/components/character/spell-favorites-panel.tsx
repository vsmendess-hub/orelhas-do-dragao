'use client';

import { useState } from 'react';
import { Star, Zap, Trash2, Edit2, StickyNote } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  type SpellFavorite,
  type FavoriteSortBy,
  groupFavoritesByLevel,
  getQuickCastSpells,
  sortFavorites,
  toggleQuickCast,
  updateFavoriteNotes,
  removeFromFavorites,
} from '@/lib/data/spell-favorites';

interface SpellFavoritesPanelProps {
  characterId: string;
  favorites: SpellFavorite[];
  onUpdate: (favorites: SpellFavorite[]) => void;
}

export function SpellFavoritesPanel({
  characterId,
  favorites,
  onUpdate,
}: SpellFavoritesPanelProps) {
  const [sortBy, setSortBy] = useState<FavoriteSortBy>('name');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const sortedFavorites = sortFavorites(favorites, sortBy);
  const quickCastSpells = getQuickCastSpells(favorites);
  const groupedByLevel = groupFavoritesByLevel(sortedFavorites);

  // Salvar no Supabase
  const saveFavorites = async (newFavorites: SpellFavorite[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ spell_favorites: newFavorites })
        .eq('id', characterId);

      if (error) throw error;

      onUpdate(newFavorites);
    } catch (err) {
      console.error('Erro ao salvar favoritos:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle quick cast
  const handleToggleQuickCast = (spellId: string) => {
    const updated = toggleQuickCast(favorites, spellId);
    saveFavorites(updated);
  };

  // Remover favorito
  const handleRemove = (spellId: string) => {
    const updated = removeFromFavorites(favorites, spellId);
    saveFavorites(updated);
  };

  // Salvar notas
  const handleSaveNotes = (spellId: string) => {
    const updated = updateFavoriteNotes(favorites, spellId, notesValue);
    saveFavorites(updated);
    setEditingNotes(null);
    setNotesValue('');
  };

  // Abrir dialog de notas
  const openNotesDialog = (favorite: SpellFavorite) => {
    setEditingNotes(favorite.spellId);
    setNotesValue(favorite.notes || '');
  };

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Star className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Nenhuma magia favorita</p>
            <p className="text-xs text-muted-foreground">
              Marque magias como favoritas clicando na estrela
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Cast Section */}
      {quickCastSpells.length > 0 && (
        <Card className="border-2 border-amber-500/50 bg-amber-500/5">
          <CardContent className="pt-4">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold">Quick Cast</h3>
              <Badge variant="secondary">{quickCastSpells.length}</Badge>
            </div>
            <div className="space-y-2">
              {quickCastSpells.map((fav) => (
                <FavoriteSpellCard
                  key={fav.spellId}
                  favorite={fav}
                  onToggleQuickCast={handleToggleQuickCast}
                  onRemove={handleRemove}
                  onEditNotes={openNotesDialog}
                  isSaving={isSaving}
                  compact
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold">Magias Favoritas</h3>
          <Badge variant="secondary">{favorites.length}</Badge>
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as FavoriteSortBy)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="level">Nível</SelectItem>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="quickCast">Quick Cast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Favorites List */}
      {sortBy === 'level' ? (
        // Grouped by level
        <div className="space-y-4">
          {Object.entries(groupedByLevel)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, levelFavorites]) => (
              <div key={level}>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                  {level === '0' ? 'Cantrips' : `Nível ${level}`}
                </h4>
                <div className="space-y-2">
                  {levelFavorites.map((fav) => (
                    <FavoriteSpellCard
                      key={fav.spellId}
                      favorite={fav}
                      onToggleQuickCast={handleToggleQuickCast}
                      onRemove={handleRemove}
                      onEditNotes={openNotesDialog}
                      isSaving={isSaving}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        // Flat list
        <div className="space-y-2">
          {sortedFavorites.map((fav) => (
            <FavoriteSpellCard
              key={fav.spellId}
              favorite={fav}
              onToggleQuickCast={handleToggleQuickCast}
              onRemove={handleRemove}
              onEditNotes={openNotesDialog}
              isSaving={isSaving}
            />
          ))}
        </div>
      )}

      {/* Notes Dialog */}
      <Dialog open={!!editingNotes} onOpenChange={() => setEditingNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notas da Magia</DialogTitle>
            <DialogDescription>
              Adicione notas personalizadas para referência rápida
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Ex: Usar contra inimigos voadores, bom combo com..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingNotes(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => editingNotes && handleSaveNotes(editingNotes)}
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FavoriteSpellCardProps {
  favorite: SpellFavorite;
  onToggleQuickCast: (spellId: string) => void;
  onRemove: (spellId: string) => void;
  onEditNotes: (favorite: SpellFavorite) => void;
  isSaving: boolean;
  compact?: boolean;
}

function FavoriteSpellCard({
  favorite,
  onToggleQuickCast,
  onRemove,
  onEditNotes,
  isSaving,
  compact = false,
}: FavoriteSpellCardProps) {
  return (
    <Card className={compact ? '' : 'border-2'}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{favorite.spellName}</p>
              <Badge variant="outline" className="text-xs">
                {favorite.spellLevel === 0 ? 'Cantrip' : `Nível ${favorite.spellLevel}`}
              </Badge>
              {favorite.quickCast && (
                <Badge variant="default" className="bg-amber-600 text-xs">
                  <Zap className="mr-1 h-3 w-3" />
                  Quick Cast
                </Badge>
              )}
            </div>
            {favorite.notes && !compact && (
              <p className="mt-1 text-sm text-muted-foreground">{favorite.notes}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleQuickCast(favorite.spellId)}
              disabled={isSaving}
              title={favorite.quickCast ? 'Remover de Quick Cast' : 'Adicionar a Quick Cast'}
            >
              <Zap
                className={`h-4 w-4 ${favorite.quickCast ? 'fill-amber-600 text-amber-600' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditNotes(favorite)}
              disabled={isSaving}
              title="Editar notas"
            >
              {favorite.notes ? (
                <StickyNote className="h-4 w-4 fill-blue-600 text-blue-600" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(favorite.spellId)}
              disabled={isSaving}
              className="text-destructive hover:text-destructive"
              title="Remover dos favoritos"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
