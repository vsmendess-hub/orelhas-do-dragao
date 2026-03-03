'use client';

import { useState } from 'react';
import { Share2, Copy, Eye, Clock, Users, Link2, Check, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  type CharacterShare,
  type ShareVisibility,
  generateShareUrl,
  isShareActive,
  formatTimeRemaining,
  calculateExpirationDate,
  VISIBILITY_LABELS,
  VISIBILITY_DESCRIPTIONS,
  EXPIRATION_OPTIONS,
  createDefaultShare,
  calculateShareStats,
} from '@/lib/data/character-sharing';

interface CharacterShareManagerProps {
  characterId: string;
  characterName: string;
  ownerId: string;
  ownerName: string;
  initialShare?: CharacterShare | null;
}

export function CharacterShareManager({
  characterId,
  characterName,
  ownerId,
  ownerName,
  initialShare,
}: CharacterShareManagerProps) {
  const [share, setShare] = useState<CharacterShare | null>(initialShare || null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Configurações temporárias (antes de salvar)
  const [visibility, setVisibility] = useState<ShareVisibility>(share?.visibility || 'private');
  const [allowComments, setAllowComments] = useState(share?.allowComments || false);
  const [allowClone, setAllowClone] = useState(share?.allowClone || false);
  const [expirationMs, setExpirationMs] = useState<number | null>(null);

  const isActive = share ? isShareActive(share) : false;
  const shareUrl = share ? generateShareUrl(share.shareToken) : '';
  const stats = share ? calculateShareStats(share) : null;

  // Criar ou atualizar compartilhamento
  const handleSaveShare = async () => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const expiresAt = calculateExpirationDate(expirationMs);

      let updatedShare: CharacterShare;

      if (share) {
        // Atualizar existente
        updatedShare = {
          ...share,
          visibility,
          allowComments,
          allowClone,
          expiresAt: expiresAt !== null ? expiresAt : share.expiresAt,
        };
      } else {
        // Criar novo
        const defaultShare = createDefaultShare(characterId, characterName, ownerId, ownerName);
        updatedShare = {
          id: crypto.randomUUID(),
          ...defaultShare,
          visibility,
          allowComments,
          allowClone,
          expiresAt: expiresAt !== null ? expiresAt : undefined,
        };
      }

      // Salvar no personagem (armazenamos share no campo character_share)
      const { error } = await supabase
        .from('characters')
        .update({ character_share: updatedShare })
        .eq('id', characterId);

      if (error) throw error;

      setShare(updatedShare);
      alert('Configurações de compartilhamento salvas!');
    } catch (err) {
      console.error('Erro ao salvar compartilhamento:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Desativar compartilhamento
  const handleDisableSharing = async () => {
    if (!share) return;

    try {
      setIsSaving(true);
      const supabase = createClient();

      const updatedShare: CharacterShare = {
        ...share,
        visibility: 'private',
      };

      const { error } = await supabase
        .from('characters')
        .update({ character_share: updatedShare })
        .eq('id', characterId);

      if (error) throw error;

      setShare(updatedShare);
      setVisibility('private');
      alert('Compartilhamento desativado!');
    } catch (err) {
      console.error('Erro ao desativar compartilhamento:', err);
      alert('Erro ao desativar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Copiar link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('Erro ao copiar link');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Compartilhamento
            </CardTitle>
            <CardDescription>Compartilhe seu personagem com outros jogadores</CardDescription>
          </div>
          {isActive && (
            <Badge variant="default" className="bg-green-600">
              <Eye className="mr-1 h-3 w-3" />
              Ativo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status e Link */}
        {share && isActive ? (
          <div className="space-y-4">
            {/* Link de Compartilhamento */}
            <div className="space-y-2">
              <Label>Link de Compartilhamento</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm" />
                <Button
                  variant={copied ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-2">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Eye className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-2xl font-bold">{stats.totalViews}</p>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Clock className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-2xl font-bold">{stats.daysActive}</p>
                      <p className="text-xs text-muted-foreground">Dias Ativo</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <Users className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-2xl font-bold">
                        {share.visibility === 'public' ? 'Público' : 'Privado'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeRemaining(share.expiresAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Configurações Atuais */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibilidade:</span>
                  <Badge variant="outline">{VISIBILITY_LABELS[share.visibility]}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comentários:</span>
                  <Badge variant={share.allowComments ? 'default' : 'secondary'}>
                    {share.allowComments ? 'Permitido' : 'Desativado'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Clonar:</span>
                  <Badge variant={share.allowClone ? 'default' : 'secondary'}>
                    {share.allowClone ? 'Permitido' : 'Desativado'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                </DialogTrigger>
                <ShareSettingsDialog
                  visibility={visibility}
                  setVisibility={setVisibility}
                  allowComments={allowComments}
                  setAllowComments={setAllowComments}
                  allowClone={allowClone}
                  setAllowClone={setAllowClone}
                  expirationMs={expirationMs}
                  setExpirationMs={setExpirationMs}
                  onSave={handleSaveShare}
                  onClose={() => setIsOpen(false)}
                  isSaving={isSaving}
                />
              </Dialog>
              <Button variant="destructive" onClick={handleDisableSharing} disabled={isSaving}>
                Desativar
              </Button>
            </div>
          </div>
        ) : (
          // Compartilhamento não ativo
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Link2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Compartilhamento Desativado</p>
              <p className="text-xs text-muted-foreground">
                Configure e ative o compartilhamento para gerar um link
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Ativar Compartilhamento
                </Button>
              </DialogTrigger>
              <ShareSettingsDialog
                visibility={visibility}
                setVisibility={setVisibility}
                allowComments={allowComments}
                setAllowComments={setAllowComments}
                allowClone={allowClone}
                setAllowClone={setAllowClone}
                expirationMs={expirationMs}
                setExpirationMs={setExpirationMs}
                onSave={handleSaveShare}
                onClose={() => setIsOpen(false)}
                isSaving={isSaving}
              />
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Dialog de Configurações
interface ShareSettingsDialogProps {
  visibility: ShareVisibility;
  setVisibility: (v: ShareVisibility) => void;
  allowComments: boolean;
  setAllowComments: (v: boolean) => void;
  allowClone: boolean;
  setAllowClone: (v: boolean) => void;
  expirationMs: number | null;
  setExpirationMs: (v: number | null) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

function ShareSettingsDialog({
  visibility,
  setVisibility,
  allowComments,
  setAllowComments,
  allowClone,
  setAllowClone,
  expirationMs,
  setExpirationMs,
  onSave,
  onClose,
  isSaving,
}: ShareSettingsDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Configurações de Compartilhamento</DialogTitle>
        <DialogDescription>Configure como seu personagem será compartilhado</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Visibilidade */}
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibilidade</Label>
          <Select value={visibility} onValueChange={(v) => setVisibility(v as ShareVisibility)}>
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(VISIBILITY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {VISIBILITY_DESCRIPTIONS[key as ShareVisibility]}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expiração */}
        <div className="space-y-2">
          <Label htmlFor="expiration">Expiração</Label>
          <Select
            value={expirationMs?.toString() || 'null'}
            onValueChange={(v) => setExpirationMs(v === 'null' ? null : parseInt(v))}
          >
            <SelectTrigger id="expiration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPIRATION_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value?.toString() || 'null'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opções */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="comments" className="flex-1">
              <span className="font-medium">Permitir Comentários</span>
              <p className="text-xs text-muted-foreground">
                Outros usuários podem deixar comentários
              </p>
            </Label>
            <Switch
              id="comments"
              checked={allowComments}
              onCheckedChange={setAllowComments}
              disabled={visibility === 'private'}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="clone" className="flex-1">
              <span className="font-medium">Permitir Clonar</span>
              <p className="text-xs text-muted-foreground">
                Outros usuários podem copiar este personagem
              </p>
            </Label>
            <Switch
              id="clone"
              checked={allowClone}
              onCheckedChange={setAllowClone}
              disabled={visibility === 'private'}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar e Ativar'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
