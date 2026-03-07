import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { LoginButton } from './login-button';

export const metadata = {
  title: 'Login - Orelhas do Dragão',
  description: 'Faça login com sua conta Google para acessar o Character Builder',
};

export default async function LoginPage() {
  const supabase = await createClient();

  // Verificar se já está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Theme Toggle - Fixed position */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center relative h-32">
          <Image src="/logo.jpg" alt="Orelhas do Dragão" width={128} height={128} className="object-contain" />
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orelhas do Dragão</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Character Builder D&D 5e em português
          </p>
        </div>

        {/* Card de Login */}
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Bem-vindo!</h2>
              <p className="text-sm text-muted-foreground">
                Faça login para criar e gerenciar seus personagens
              </p>
            </div>

            <LoginButton />

            <div className="text-center text-xs text-muted-foreground">
              Ao fazer login, você concorda com nossos Termos de Uso e Política de Privacidade
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            ✨ Criação guiada de personagens
          </p>
          <p className="text-sm font-medium text-muted-foreground">🤖 Background gerado por IA</p>
          <p className="text-sm font-medium text-muted-foreground">
            ☁️ Sincronização automática na nuvem
          </p>
          <p className="text-sm font-medium text-muted-foreground">📱 Funciona offline (PWA)</p>
        </div>
      </div>
    </div>
  );
}
