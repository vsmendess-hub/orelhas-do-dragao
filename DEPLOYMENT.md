# 🚀 Deployment Guide

Guia completo para deploy do **Orelhas do Dragão** na Vercel com CI/CD via GitHub Actions.

---

## 📋 Pré-requisitos

1. Conta no [GitHub](https://github.com)
2. Conta no [Vercel](https://vercel.com) (pode usar login social com GitHub)
3. Conta no [Supabase](https://supabase.com) (pode usar login social com GitHub)
4. Conta no [Google AI Studio](https://makersuite.google.com/app/apikey) para Gemini API Key

---

## 🔧 Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha:
   - **Project Name**: `orelhas-do-dragao`
   - **Database Password**: Gere e salve em local seguro
   - **Region**: `South America (São Paulo)`
   - **Pricing Plan**: `Free`
4. Aguarde ~2 minutos

### 1.2 Aplicar Migration

1. No dashboard, vá em **SQL Editor** > "New query"
2. Copie todo o conteúdo de `supabase/migrations/20260228000000_initial_schema.sql`
3. Cole e clique em **RUN**

### 1.3 Configurar Google OAuth

1. Vá em **Authentication** > **Providers**
2. Habilite **Google** e configure:
   - Obtenha Client ID e Secret do [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - **Authorized redirect URLs**: `https://your-project.supabase.co/auth/v1/callback`

### 1.4 Obter Credenciais

1. Vá em **Project Settings** > **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔑 Passo 2: Configurar Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Clique em "Create API Key"
3. Selecione um projeto ou crie novo
4. Copie a API Key → `GEMINI_API_KEY`

**⚠️ Tier Gratuito Gemini Flash 2.0:**

- 1500 requests/dia
- 1M tokens/minuto
- Suficiente para o MVP!

---

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Push para GitHub

```bash
# Inicializar repositório (se ainda não fez)
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/orelhas-do-dragao.git
git branch -M main
git push -u origin main
```

### 3.2 Conectar Vercel ao GitHub

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." > "Project"
3. Selecione o repositório `orelhas-do-dragao`
4. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (deixar padrão)
   - **Build Command**: `npm run build` (deixar padrão)
   - **Output Directory**: `.next` (deixar padrão)

### 3.3 Adicionar Environment Variables

Na página de configuração do projeto, adicione as variáveis de ambiente:

| Key                             | Value                        | Exemplo                                |
| ------------------------------- | ---------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do projeto Supabase      | `https://abc123.supabase.co`           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key do Supabase         | `eyJhbGc...`                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key do Supabase | `eyJhbGc...`                           |
| `GEMINI_API_KEY`                | API key do Google Gemini     | `AIzaSy...`                            |
| `NEXT_PUBLIC_APP_URL`           | URL do app na Vercel         | `https://orelhas-do-dragao.vercel.app` |

**⚠️ IMPORTANTE**: Marque apenas as variáveis que começam com `NEXT_PUBLIC_` como "Exposed".

### 3.4 Deploy

1. Clique em "Deploy"
2. Aguarde ~2-3 minutos
3. Acesse o app em `https://orelhas-do-dragao.vercel.app`

---

## 🔄 Passo 4: Configurar CI/CD com GitHub Actions

### 4.1 Adicionar Secrets no GitHub

1. No repositório GitHub, vá em **Settings** > **Secrets and variables** > **Actions**
2. Clique em "New repository secret" e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`

### 4.2 Verificar Workflow

O arquivo `.github/workflows/ci.yml` já está configurado e roda automaticamente em:

- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

O workflow executa:

1. ✅ ESLint
2. ✅ Prettier check
3. ✅ Build da aplicação
4. ✅ Upload dos artefatos

---

## 📊 Passo 5: Verificar Deploy

### 5.1 Testar Funcionalidades

1. Acesse a URL do deploy
2. Teste o login com Google OAuth
3. Crie um personagem de teste
4. Verifique se os dados são salvos no Supabase

### 5.2 Monitorar Logs

- **Vercel**: Dashboard > seu-projeto > "Logs"
- **Supabase**: Dashboard > "Logs" > "API"
- **GitHub Actions**: Repositório > "Actions"

---

## 🔐 Segurança

### Checklist de Segurança

- ✅ Service role key NUNCA exposta no frontend
- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Headers de segurança configurados no `vercel.json`
- ✅ `.env.local` no `.gitignore`
- ✅ Middleware protege rotas privadas

### Supabase RLS

Todas as queries passam por políticas de segurança:

```sql
-- Usuário só vê seus próprios personagens
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🎯 URLs Importantes

| Serviço            | URL                                                        |
| ------------------ | ---------------------------------------------------------- |
| App Produção       | `https://orelhas-do-dragao.vercel.app`                     |
| Vercel Dashboard   | `https://vercel.com/dashboard`                             |
| Supabase Dashboard | `https://supabase.com/dashboard`                           |
| GitHub Actions     | `https://github.com/seu-usuario/orelhas-do-dragao/actions` |
| Google AI Studio   | `https://makersuite.google.com/app/apikey`                 |

---

## 🆘 Troubleshooting

### Build Error no Vercel

- Verifique se todas as env vars estão configuradas
- Veja os logs em "Deployments" > "Functions"

### Erro de Autenticação Supabase

- Confirme que as URLs de redirect estão corretas
- Verifique se RLS está habilitado

### Erro no GitHub Actions

- Verifique se os secrets estão configurados corretamente
- Veja o log detalhado na aba "Actions"

### Google OAuth não funciona

- Confirme Client ID e Secret no Supabase
- Verifique Authorized redirect URLs no Google Cloud Console

---

## 📈 Free Tier Limits

| Serviço          | Limite Gratuito                     |
| ---------------- | ----------------------------------- |
| **Vercel**       | 100 GB bandwidth/mês                |
| **Supabase**     | 500 MB database, 2 GB bandwidth/mês |
| **Gemini Flash** | 1500 requests/dia                   |

**💡 Dica**: Monitore o uso nos dashboards para não estourar os limites!

---

## 🔄 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar domínio customizado na Vercel (opcional)
2. ✅ Habilitar Google Analytics (opcional)
3. ✅ Configurar Sentry para error tracking (opcional)
4. ✅ Implementar PWA offline-first (Sprint 5)
5. ✅ Adicionar testes E2E com Playwright (futuro)

---

**Desenvolvido com ❤️ e 🎲 pela comunidade D&D Brasil**
