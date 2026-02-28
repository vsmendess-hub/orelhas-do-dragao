import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route Handler para callback do OAuth
 * Após login com Google, o Supabase redireciona para esta rota
 * com o code na query string
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Trocar o code por uma sessão
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Erro ao trocar code por sessão:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  // Redirecionar para a home após login bem-sucedido
  return NextResponse.redirect(`${origin}/`);
}
