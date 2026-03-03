'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { generateAvatarPlaceholder } from '@/lib/data/personality';
import { cn } from '@/lib/utils';

interface CharacterPortraitProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-48 w-48',
};

const sizePx = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 192,
};

export function CharacterPortrait({
  name,
  avatarUrl,
  size = 'lg',
  className,
}: CharacterPortraitProps) {
  const displayImage = avatarUrl || generateAvatarPlaceholder(name);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full border-4 border-border bg-muted',
        sizeClasses[size],
        className
      )}
    >
      {displayImage ? (
        <Image
          src={displayImage}
          alt={`Avatar de ${name}`}
          fill
          className="object-cover"
          sizes={`${sizePx[size]}px`}
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
