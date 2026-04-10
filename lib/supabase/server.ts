import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';

/**
 * Cliente Supabase para uso em Server Components e Server Actions
 * Usa cookies do Next.js para autenticação server-side
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Pode falhar em Server Components (read-only)
            // Funciona em Server Actions e Route Handlers
          }
        },
      },
    }
  );
}

/**
 * Cliente Supabase admin com service role key
 * Usa em operações que precisam bypassar RLS (ex: criação de usuário)
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

/**
 * Verifica autenticação e retorna o usuário
 * Redireciona para /login se não autenticado
 *
 * @returns User object do Supabase
 * @throws Redirect para /login se não autenticado
 *
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   const user = await requireAuth();
 *   // usuário garantido aqui
 * }
 * ```
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Busca um personagem e verifica ownership
 * Retorna 404 se não encontrado ou se o usuário não for o dono
 *
 * @param characterId - ID do personagem
 * @returns Objeto com character e user
 * @throws Redirect para /login se não autenticado
 * @throws NotFound se personagem não existe ou usuário não é dono
 *
 * @example
 * ```tsx
 * export default async function CharacterPage({ params }: { params: { id: string } }) {
 *   const { character, user } = await requireCharacterOwnership(params.id);
 *   // personagem e user garantidos
 * }
 * ```
 */
export async function requireCharacterOwnership(characterId: string) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (error || !character || character.user_id !== user.id) {
    notFound();
  }

  return { character, user };
}
