'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteCharacterDialogProps {
  characterId: string;
  characterName: string;
}

export function DeleteCharacterDialog({ characterId, characterName }: DeleteCharacterDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const supabase = createClient();

      // Verificar autenticação
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Você precisa estar autenticado para deletar o personagem');
      }

      // Deletar personagem (RLS garante que só o dono pode deletar)
      const { error: deleteError } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Fechar dialog e redirecionar
      setOpen(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Erro ao deletar personagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar personagem');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Deletar Personagem
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Todos os dados do personagem serão permanentemente
            removidos.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            Você está prestes a deletar:
          </p>
          <p className="mt-1 text-lg font-bold text-red-900 dark:text-red-100">{characterName}</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100">
            ⚠️ {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Permanentemente
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
