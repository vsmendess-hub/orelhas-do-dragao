# 🚀 Deploy na Vercel via Dashboard - Guia Passo a Passo

## ✅ Pré-requisitos

- [x] Código no GitHub (branch main atualizada)
- [x] Build local passou sem erros
- [ ] Conta na Vercel (criar se não tiver)
- [ ] Supabase configurado

---

## 📋 Passo 1: Acesse a Vercel

1. Abra: **https://vercel.com/login**
2. Click em **"Continue with GitHub"**
3. Autorize a Vercel a acessar seu GitHub (se primeira vez)
4. Faça login

---

## 📋 Passo 2: Criar Novo Projeto

1. No dashboard da Vercel, click em **"Add New..."**
2. Selecione **"Project"**
3. Na lista de repositórios, procure: **`orelhas-do-dragao`**
   - Se não aparecer, click em **"Adjust GitHub App Permissions"**
   - Conceda acesso ao repositório `vsmendess-hub/orelhas-do-dragao`
4. Click em **"Import"** ao lado do repositório

---

## 📋 Passo 3: Configurar Projeto

### Framework Preset

- ✅ Deve detectar automaticamente: **Next.js**
- ✅ Se não detectar, selecione manualmente

### Build Settings (deixe como está)

```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Root Directory

- ✅ Deixe em branco ou `./`

---

## 📋 Passo 4: Environment Variables (CRÍTICO!)

Click em **"Environment Variables"** e adicione as seguintes variáveis:

### Supabase (OBRIGATÓRIAS)

```bash
# 1. NEXT_PUBLIC_SUPABASE_URL
# Cole a URL do seu projeto Supabase
# Exemplo: https://xjywmhdvdltrbufuuhsx.supabase.co
NEXT_PUBLIC_SUPABASE_URL=

# 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
# Cole a Anon Key (pública) do Supabase
# Encontre em: Settings → API → Project API keys → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 3. SUPABASE_SERVICE_ROLE_KEY
# Cole a Service Role Key (privada) do Supabase
# Encontre em: Settings → API → Project API keys → service_role (secret)
SUPABASE_SERVICE_ROLE_KEY=
```

### App (OBRIGATÓRIA)

```bash
# 4. NEXT_PUBLIC_APP_URL
# URL que a Vercel vai gerar (você vai atualizar depois)
# Por enquanto, deixe como: https://orelhas-do-dragao.vercel.app
NEXT_PUBLIC_APP_URL=https://orelhas-do-dragao.vercel.app
```

### OpenAI (OPCIONAL - para IA features)

```bash
# 5. OPENAI_API_KEY (opcional)
# Só se quiser features de IA (background, imagens, etc)
OPENAI_API_KEY=
```

### 📝 Como Adicionar Cada Variável:

1. Click em **"Add"** ou campo de input
2. **Name:** Cole o nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value:** Cole o valor correspondente
4. **Environments:** Selecione **Production**, **Preview**, e **Development** (todas)
5. Click em **"Add"** para confirmar
6. Repita para cada variável

### 🔑 Onde Encontrar as Keys do Supabase:

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** (ícone de engrenagem)
4. Click em **API**
5. Copie as keys:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 Passo 5: Deploy!

1. Revise as configurações
2. Click no botão **"Deploy"**
3. Aguarde o build (~3-5 minutos)

### Durante o Build:

Você verá logs em tempo real:

```
> Installing dependencies...
> Building...
> Deploying...
```

### Se Tudo Correr Bem:

Verá uma animação de fogos de artifício 🎉 e:

- **Status:** Ready
- **URL:** https://orelhas-do-dragao-xxx.vercel.app

---

## 📋 Passo 6: Atualizar NEXT_PUBLIC_APP_URL

1. Copie a URL gerada (ex: `https://orelhas-do-dragao-xxx.vercel.app`)
2. Vá em **Project Settings** → **Environment Variables**
3. Encontre `NEXT_PUBLIC_APP_URL`
4. Click nos três pontos (...) → **Edit**
5. Cole a URL real que foi gerada
6. **Save**
7. **Importante:** Click em **"Redeploy"** no menu Deployments para aplicar a mudança

---

## 📋 Passo 7: Verificação

### Teste Básico:

1. Abra a URL do seu deploy
2. Deve carregar a home page
3. Tente fazer login
4. Verifique se não há erros no console (F12)

### Teste PWA:

1. Abra: `https://sua-url.vercel.app/manifest.json`
   - ✅ Deve mostrar o JSON do manifest
2. Abra: `https://sua-url.vercel.app/sw.js`
   - ✅ Deve mostrar o código do Service Worker

### Teste Service Worker:

1. Abra o site
2. F12 → **Application** tab
3. **Service Workers** → Deve mostrar `sw.js` registrado
4. **Manifest** → Deve mostrar dados do app

---

## 📋 Passo 8: Configurar Supabase Storage

Agora que o app está no ar, configure o Storage:

### Criar Bucket:

1. Acesse: https://app.supabase.com
2. Seu projeto → **Storage**
3. Click em **"New Bucket"**
4. Configure:
   - **Name:** `character-assets`
   - **Public:** ✅ Marcar como público
   - **File size limit:** 5 MB
5. **Create Bucket**

### Configurar Políticas RLS:

Vá em **Storage** → `character-assets` → **Policies** e execute no SQL Editor:

```sql
-- 1. Leitura pública
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'character-assets');

-- 2. Upload autenticado
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- 3. Update próprios arquivos
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'character-assets' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'character-assets' AND auth.role() = 'authenticated');

-- 4. Delete próprios arquivos
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'character-assets' AND auth.role() = 'authenticated');
```

---

## 📋 Passo 9: Executar Migrations

No SQL Editor do Supabase, execute em ordem:

### Migration 1: Personality & Appearance

```sql
-- Copie e execute o conteúdo de:
-- supabase/migrations/20260307000000_add_personality_appearance.sql
```

### Migration 2: Background Data

```sql
-- Copie e execute o conteúdo de:
-- supabase/migrations/20260307000001_add_background_data.sql
```

### Migration 3: Rest System

```sql
-- Copie e execute o conteúdo de:
-- MIGRATION_REST_SYSTEM.sql
```

---

## 📋 Passo 10: Teste Final

### Funcionalidades Essenciais:

- [ ] Login/Logout funciona
- [ ] Criar personagem funciona
- [ ] Ver ficha funciona
- [ ] Upload de avatar funciona
- [ ] Descanso curto/longo funciona
- [ ] Level up funciona
- [ ] Rolar dados funciona

### PWA:

- [ ] Install prompt aparece (aguarde 30s no mobile)
- [ ] Instalar como PWA funciona
- [ ] Offline mode funciona (Network → Offline no DevTools)

### Mobile:

- [ ] Bottom navigation aparece
- [ ] Touch gestures funcionam
- [ ] Layouts responsivos

---

## 🎊 Pronto!

Seu app está no ar em produção! 🚀

### URLs Importantes:

- **App:** https://sua-url.vercel.app
- **Dashboard Vercel:** https://vercel.com/dashboard
- **Logs:** https://vercel.com/seu-projeto/logs
- **Analytics:** https://vercel.com/seu-projeto/analytics

### Domínio Customizado (Opcional):

Se quiser usar um domínio próprio:

1. Project Settings → **Domains**
2. Click em **"Add Domain"**
3. Digite seu domínio (ex: `orelhas-do-dragao.com`)
4. Siga instruções de configuração DNS
5. Aguarde propagação (até 48h)

---

## 🆘 Problemas Comuns

### Build Failed

- Verifique logs no dashboard
- Confirme environment variables estão corretas
- Teste build local: `npm run build`

### Service Worker não registra

- Certifique HTTPS está ativo (Vercel faz automaticamente)
- Limpe cache do navegador
- Hard reload (Ctrl+Shift+R)

### Avatar upload não funciona

- Verifique bucket `character-assets` foi criado
- Confirme políticas RLS foram aplicadas
- Teste URL diretamente: `https://sua-supabase-url.supabase.co/storage/v1/object/public/character-assets/`

### Errors 500

- Check logs na Vercel
- Verifique environment variables
- Confirme Supabase connection

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Project Issues:** https://github.com/vsmendess-hub/orelhas-do-dragao/issues

---

**Boa sorte com o deploy! 🐉✨**
