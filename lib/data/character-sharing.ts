/**
 * Sistema de Compartilhamento de Personagens D&D 5e
 */

import type { Character } from '@/lib/supabase/types';

export type SharePermission = 'view' | 'none';

export type ShareVisibility = 'private' | 'unlisted' | 'public';

export interface CharacterShare {
  id: string;
  characterId: string;
  characterName: string;
  ownerId: string;
  ownerName: string;
  visibility: ShareVisibility;
  shareToken: string; // Token único para link de compartilhamento
  createdAt: string;
  expiresAt?: string | null; // null ou undefined = nunca expira
  viewCount: number;
  allowComments: boolean;
  allowClone: boolean; // Permite outros usuários clonarem o personagem
}

export interface SharedCharacterView {
  character: Character; // Character completo (read-only)
  share: CharacterShare;
  canClone: boolean;
  canComment: boolean;
}

/**
 * Gera token único para compartilhamento
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Gera URL de compartilhamento
 */
export function generateShareUrl(shareToken: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/shared/${shareToken}`;
}

/**
 * Verifica se o compartilhamento está expirado
 */
export function isShareExpired(share: CharacterShare): boolean {
  if (!share.expiresAt) return false;
  return new Date(share.expiresAt) < new Date();
}

/**
 * Verifica se o compartilhamento está ativo
 */
export function isShareActive(share: CharacterShare): boolean {
  return share.visibility !== 'private' && !isShareExpired(share);
}

/**
 * Incrementa contador de visualizações
 */
export function incrementViewCount(share: CharacterShare): CharacterShare {
  return {
    ...share,
    viewCount: share.viewCount + 1,
  };
}

/**
 * Labels para visibilidade
 */
export const VISIBILITY_LABELS: Record<ShareVisibility, string> = {
  private: 'Privado',
  unlisted: 'Não listado',
  public: 'Público',
};

/**
 * Descrições de visibilidade
 */
export const VISIBILITY_DESCRIPTIONS: Record<ShareVisibility, string> = {
  private: 'Apenas você pode ver. Compartilhamento desativado.',
  unlisted: 'Apenas pessoas com o link podem visualizar.',
  public: 'Visível na biblioteca da comunidade.',
};

/**
 * Opções de expiração
 */
export const EXPIRATION_OPTIONS = [
  { label: 'Nunca expira', value: null },
  { label: '1 hora', value: 1 * 60 * 60 * 1000 },
  { label: '24 horas', value: 24 * 60 * 60 * 1000 },
  { label: '7 dias', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 dias', value: 30 * 24 * 60 * 60 * 1000 },
] as const;

/**
 * Calcula data de expiração
 */
export function calculateExpirationDate(milliseconds: number | null): string | null {
  if (milliseconds === null) return null;
  const date = new Date(Date.now() + milliseconds);
  return date.toISOString();
}

/**
 * Formata tempo restante até expiração
 */
export function formatTimeRemaining(expiresAt: string | null | undefined): string {
  if (!expiresAt) return 'Nunca expira';

  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return 'Expirado';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
  return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
}

/**
 * Cria configuração padrão de compartilhamento
 */
export function createDefaultShare(
  characterId: string,
  characterName: string,
  ownerId: string,
  ownerName: string
): Omit<CharacterShare, 'id'> {
  return {
    characterId,
    characterName,
    ownerId,
    ownerName,
    visibility: 'private',
    shareToken: generateShareToken(),
    createdAt: new Date().toISOString(),
    expiresAt: null,
    viewCount: 0,
    allowComments: false,
    allowClone: false,
  };
}

/**
 * Sanitiza personagem para visualização pública (remove informações sensíveis)
 */
export function sanitizeCharacterForSharing(character: Character): Partial<Character> {
  const { user_id, created_at, updated_at, ...sanitized } = character;

  return sanitized;
}

/**
 * Valida permissões de acesso
 */
export function validateShareAccess(
  share: CharacterShare,
  userId: string | null
): {
  canView: boolean;
  canClone: boolean;
  canComment: boolean;
  reason?: string;
} {
  // Expirado
  if (isShareExpired(share)) {
    return {
      canView: false,
      canClone: false,
      canComment: false,
      reason: 'Compartilhamento expirado',
    };
  }

  // Privado
  if (share.visibility === 'private') {
    const isOwner = userId === share.ownerId;
    return {
      canView: isOwner,
      canClone: false,
      canComment: false,
      reason: isOwner ? undefined : 'Personagem privado',
    };
  }

  // Público ou unlisted
  return {
    canView: true,
    canClone: share.allowClone,
    canComment: share.allowComments && userId !== null,
  };
}

/**
 * Cria objeto de estatísticas de compartilhamento
 */
export interface ShareStats {
  totalViews: number;
  totalShares: number;
  totalClones: number;
  isExpired: boolean;
  daysActive: number;
}

export function calculateShareStats(share: CharacterShare): ShareStats {
  const createdDate = new Date(share.createdAt);
  const now = new Date();
  const daysActive = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    totalViews: share.viewCount,
    totalShares: 1, // Apenas o share atual (pode expandir para múltiplos shares no futuro)
    totalClones: 0, // Seria necessário rastrear clones separadamente
    isExpired: isShareExpired(share),
    daysActive,
  };
}
