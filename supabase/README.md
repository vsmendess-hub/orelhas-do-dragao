# Supabase Setup

Este diretório contém as migrations e configurações do Supabase para o projeto Orelhas do Dragão.

## 🚀 Setup Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (pode usar o Google OAuth)
2. Clique em "New Project"
3. Preencha:
   - **Project Name**: `orelhas-do-dragao`
   - **Database Password**: Gere uma senha forte (salve em local seguro)
   - **Region**: `South America (São Paulo)` (mais próximo do Brasil)
   - **Pricing Plan**: `Free` (500 MB database, 50 MB file storage, 2 GB bandwidth)
4. Aguarde ~2 minutos enquanto o projeto é provisionado

### 2. Aplicar Migration

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo de `migrations/20260228000000_initial_schema.sql`
4. Cole no editor e clique em **RUN**
5. Verifique se a mensagem "Success. No rows returned" aparece

### 3. Configurar Autenticação

1. No dashboard, vá em **Authentication** > **Providers**
2. Habilite **Google** (OAuth):
   - Clique em "Google"
   - Toggle "Enable Sign in with Google"
   - Adicione suas credenciais do Google Cloud Console:
     - **Client ID** (OAuth 2.0)
     - **Client Secret**
   - **Authorized redirect URLs**: `https://your-project.supabase.co/auth/v1/callback`
3. Salve as configurações

### 4. Obter Credenciais

1. No dashboard, vá em **Project Settings** > **API**
2. Copie as seguintes credenciais:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public**: Token público (pode expor no frontend)
   - **service_role**: Token admin (NUNCA exponha no frontend)

### 5. Configurar .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key-aqui

# Google Gemini AI
GEMINI_API_KEY=seu-gemini-api-key-aqui

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env.local` no git!

## 📊 Schema

### Tabelas

#### `characters`

Armazena todos os dados dos personagens D&D 5e:

- Informações básicas (nome, raça, classe, nível)
- Atributos e skills (JSON)
- Equipamentos e magias (JSON)
- Estatísticas de combate (HP, AC, iniciativa)
- Background e personalidade

#### `user_preferences`

Preferências do usuário:

- Tema (dark/light)
- Notificações
- Skin de dados padrão

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:

- Usuários podem ver/editar apenas seus próprios dados
- Personagens marcados como `is_public = true` são visíveis para todos
- Service role bypassa RLS (use com cuidado)

## 🧪 Testar Conexão

Após configurar, rode o servidor de desenvolvimento:

```bash
npm run dev
```

O middleware do Supabase já está configurado em `middleware.ts` e vai gerenciar automaticamente a autenticação.

## 📝 Migrations Futuras

Para adicionar novas migrations:

1. Crie um arquivo em `migrations/` com timestamp: `YYYYMMDDHHMMSS_description.sql`
2. Aplique manualmente via SQL Editor no Supabase Dashboard
3. Ou use a Supabase CLI (opcional):
   ```bash
   npm install -g supabase
   supabase link --project-ref your-project-ref
   supabase db push
   ```

## 🔒 Segurança

- ✅ RLS habilitado em todas as tabelas
- ✅ Service role key apenas server-side
- ✅ Anon key exposta no frontend (seguro, limitada por RLS)
- ✅ Triggers para atualizar `updated_at` automaticamente
- ✅ Foreign keys com ON DELETE CASCADE

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
