import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route Handler para logout
 * POST /auth/logout
 */
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(`${origin}/login`);
}
