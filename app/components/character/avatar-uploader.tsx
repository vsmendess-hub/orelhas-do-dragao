'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAvatarPlaceholder } from '@/lib/data/personality';

interface AvatarUploaderProps {
  characterId: string;
  characterName: string;
  currentAvatarUrl?: string;
}

export function AvatarUploader({
  characterId,
  characterName,
  currentAvatarUrl,
}: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar para exibir (preview > atual > placeholder)
  const displayAvatar = previewUrl || avatarUrl || generateAvatarPlaceholder(characterName);

  // Validar arquivo
  const validateFile = (file: File): string | null => {
    // Verificar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return 'Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.';
    }

    // Verificar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 5MB.';
    }

    return null;
  };

  // Manipular seleção de arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload para Supabase
    await uploadAvatar(file);
  };

  // Upload para Supabase Storage
  const uploadAvatar = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const supabase = createClient();

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${characterId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para storage
      const { error: uploadError } = await supabase.storage
        .from('character-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from('character-assets').getPublicUrl(filePath);

      // Atualizar personagem no banco
      const { error: updateError } = await supabase
        .from('characters')
        .update({ avatar_url: publicUrl })
        .eq('id', characterId);

      if (updateError) throw updateError;

      // Deletar avatar antigo se existir
      if (avatarUrl && avatarUrl.includes('character-assets')) {
        const oldPath = avatarUrl.split('/character-assets/')[1];
        if (oldPath && oldPath.startsWith('avatars/')) {
          await supabase.storage.from('character-assets').remove([oldPath]);
        }
      }

      setAvatarUrl(publicUrl);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Erro ao fazer upload da imagem');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Remover avatar
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;

    try {
      setIsUploading(true);
      setError(null);

      const supabase = createClient();

      // Deletar do storage se for nossa imagem
      if (avatarUrl.includes('character-assets')) {
        const filePath = avatarUrl.split('/character-assets/')[1];
        if (filePath && filePath.startsWith('avatars/')) {
          await supabase.storage.from('character-assets').remove([filePath]);
        }
      }

      // Remover do banco
      const { error: updateError } = await supabase
        .from('characters')
        .update({ avatar_url: null })
        .eq('id', characterId);

      if (updateError) throw updateError;

      setAvatarUrl(undefined);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Erro ao remover avatar:', err);
      setError('Erro ao remover avatar');
    } finally {
      setIsUploading(false);
    }
  };

  // Abrir seletor de arquivo
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Avatar do Personagem
        </CardTitle>
        <CardDescription>Imagem que representa seu personagem</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview do Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-muted">
            <Image
              src={displayAvatar}
              alt={characterName}
              fill
              className="object-cover"
              sizes="192px"
              priority
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button onClick={handleClickUpload} disabled={isUploading} size="sm">
              <Upload className="mr-2 h-4 w-4" />
              {avatarUrl ? 'Alterar Imagem' : 'Enviar Imagem'}
            </Button>
            {avatarUrl && (
              <Button
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                variant="outline"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                Remover
              </Button>
            )}
          </div>

          {/* Input escondido */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Informações */}
        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">📋 Requisitos da Imagem:</p>
          <ul className="mt-2 space-y-1">
            <li>• Formatos aceitos: JPG, PNG, WebP, GIF</li>
            <li>• Tamanho máximo: 5MB</li>
            <li>• Recomendado: imagem quadrada (1:1)</li>
            <li>• A imagem será exibida em formato circular</li>
          </ul>
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Dica sobre placeholder */}
        {!avatarUrl && !previewUrl && (
          <div className="rounded-lg border bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-950/20 dark:text-blue-200">
            💡 <strong>Sem imagem?</strong> Não se preocupe! Um avatar com a primeira letra do nome
            será usado automaticamente.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
