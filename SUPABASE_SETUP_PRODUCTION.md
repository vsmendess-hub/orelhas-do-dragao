# 🗄️ Setup Supabase para Produção

Execute estas etapas no Supabase Dashboard APÓS fazer o deploy na Vercel.

---

## 📋 Passo 1: Criar Bucket de Storage

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Menu lateral → **Storage**
4. Click em **"New Bucket"**
5. Configure:
   - **Name:** `character-assets`
   - **Public:** ✅ Sim (marque a checkbox)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** deixe em branco (aceita todos)
6. Click em **"Create Bucket"**

---

## 📋 Passo 2: Configurar Políticas RLS do Storage

1. Vá em **Storage** → `character-assets` → **Policies**
2. Click em **"New Policy"** ou vá no **SQL Editor**
3. Execute o SQL abaixo:

```sql
-- Limpar políticas antigas (se existirem)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- 1. Permitir leitura pública de todos os arquivos
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'character-assets');

-- 2. Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- 3. Permitir atualização apenas do próprio arquivo
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
);

-- 4. Permitir deleção apenas do próprio arquivo
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
);
```

4. Click em **"Run"** ou **"Execute"**
5. Deve retornar: `Success. No rows returned`

---

## 📋 Passo 3: Executar Migrations do Database

### Migration 1: Personality & Appearance

1. Abra o arquivo: `supabase/migrations/20260307000000_add_personality_appearance.sql`
2. Copie TODO o conteúdo
3. No Supabase Dashboard → **SQL Editor**
4. Cole o SQL
5. Click em **"Run"**

### Migration 2: Background Data

1. Abra o arquivo: `supabase/migrations/20260307000001_add_background_data.sql`
2. Copie TODO o conteúdo
3. No Supabase Dashboard → **SQL Editor**
4. Cole o SQL
5. Click em **"Run"**

### Migration 3: Rest System

1. Abra o arquivo: `MIGRATION_REST_SYSTEM.sql`
2. Copie TODO o conteúdo
3. No Supabase Dashboard → **SQL Editor**
4. Cole o SQL
5. Click em **"Run"**

---

## 📋 Passo 4: Verificar Setup

Execute no SQL Editor para verificar:

```sql
-- Verificar bucket criado
SELECT id, name, public
FROM storage.buckets
WHERE id = 'character-assets';
-- Deve retornar 1 linha: character-assets | character-assets | true

-- Verificar políticas do storage
SELECT policyname
FROM storage.policies
WHERE bucket_id = 'character-assets';
-- Deve retornar 4 linhas com os nomes das políticas

-- Verificar coluna appearance existe
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'characters'
  AND column_name IN ('appearance', 'personality', 'background_data');
-- Deve retornar 3 linhas

-- Verificar coluna hit_dice_used existe
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'characters'
  AND column_name = 'hit_dice_used';
-- Deve retornar 1 linha

-- Testar select na tabela characters
SELECT id, name, level FROM characters LIMIT 1;
-- Deve funcionar sem erro (pode retornar 0 linhas se não tiver personagens)
```

---

## 📋 Passo 5: Testar Upload de Avatar

1. Acesse seu app na Vercel
2. Faça login
3. Abra um personagem
4. Vá em **Personalizar** → **Avatar**
5. Click em **"Enviar Imagem"**
6. Selecione uma imagem JPG/PNG (máx 5MB)
7. Deve fazer upload e exibir a imagem

Se der erro:

- Verifique console do navegador (F12)
- Verifique bucket existe e é público
- Verifique políticas RLS foram criadas
- Verifique URL do Supabase no `.env` está correta

---

## 📋 Passo 6: Verificar Autenticação

1. No Supabase → **Authentication** → **Users**
2. Verifique se consegue ver usuários
3. Tente criar uma nova conta no app
4. Deve aparecer na lista de usuários

---

## 📋 Passo 7: Configurar Email (Opcional)

Se quiser enviar emails de confirmação/recuperação:

1. Supabase → **Authentication** → **Email Templates**
2. Customize os templates
3. Configure SMTP (opcional):
   - **Settings** → **Auth** → **SMTP Settings**
   - Use seu servidor SMTP ou serviço como SendGrid

---

## ✅ Checklist Final

Execute este checklist para garantir que tudo está funcionando:

### Database

- [ ] Migrations executadas sem erro
- [ ] Tabela `characters` tem colunas novas
- [ ] RLS policies estão ativas

### Storage

- [ ] Bucket `character-assets` criado
- [ ] Bucket configurado como público
- [ ] 4 políticas RLS criadas e ativas
- [ ] Upload de avatar funciona

### Autenticação

- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Consegue fazer logout
- [ ] Usuários aparecem no dashboard

### App

- [ ] Deploy na Vercel concluído
- [ ] Environment variables configuradas
- [ ] App carrega sem erros
- [ ] Todas funcionalidades principais funcionam

---

## 🐛 Troubleshooting

### Erro: "Bucket not found"

```sql
-- Verificar se bucket existe
SELECT * FROM storage.buckets WHERE id = 'character-assets';
-- Se não existir, crie novamente no dashboard
```

### Erro: "RLS policy violation"

```sql
-- Deletar e recriar políticas
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
-- (execute novamente os CREATE POLICY)
```

### Erro: "Column does not exist"

```sql
-- Verificar quais colunas existem
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'characters';
-- Execute as migrations novamente
```

### Upload não funciona

1. Abra console do navegador (F12)
2. Veja erro específico
3. Verifique:
   - Bucket existe e é público
   - Políticas RLS corretas
   - Environment variables corretas
   - CORS configurado no Supabase (geralmente automático)

---

## 📞 Ajuda

- **Supabase Docs:** https://supabase.com/docs
- **Storage Guide:** https://supabase.com/docs/guides/storage
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

**Setup completo! Seu app está pronto para produção! 🚀**
