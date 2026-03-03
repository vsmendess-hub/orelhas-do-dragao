'use client';

import Link from 'next/link';
import { Eye, User, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CommunityCharacter } from '@/lib/data/community-library';
import { generateShareUrl } from '@/lib/data/character-sharing';

interface CharacterLibraryCardProps {
  character: CommunityCharacter;
}

export function CharacterLibraryCard({ character }: CharacterLibraryCardProps) {
  const shareUrl = `/shared/${character.shareInfo.shareToken}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Preview Image */}
      {character.previewImage ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={character.previewImage}
            alt={character.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <Shield className="h-16 w-16 text-muted-foreground" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{character.name}</CardTitle>
            <CardDescription className="truncate">
              {character.race} - {character.class}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex-shrink-0">
            Nv. {character.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info */}
        <div className="space-y-2 text-sm">
          {character.background && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Antecedente:</span>
              <span className="font-medium truncate ml-2">{character.background}</span>
            </div>
          )}
          {character.alignment && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tendência:</span>
              <span className="font-medium">{character.alignment}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Compartilhado por:</span>
            <span className="font-medium truncate ml-2 flex items-center gap-1">
              <User className="h-3 w-3" />
              {character.shareInfo.ownerName}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{character.shareInfo.viewCount} visualizações</span>
          </div>
        </div>

        {/* Action */}
        <Button asChild className="w-full">
          <Link href={shareUrl}>Ver Personagem</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
