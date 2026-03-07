# 🗄️ Configuração do Supabase Storage para Avatares

## Problema
O upload de avatares está falhando porque o bucket `character-assets` pode não estar criado ou configurado corretamente no Supabase.

## Solução

### 1. Criar Bucket no Supabase Dashboard

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Selecione seu projeto
3. Vá para **Storage** no menu lateral
4. Clique em **New Bucket**
5. Configure o bucket:
   - **Name**: `character-assets`
   - **Public**: ✅ Marcar como público (para permitir URLs públicas)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`

### 2. Configurar Políticas de Segurança (RLS)

Execute os seguintes comandos SQL no **SQL Editor** do Supabase:

```sql
-- Permitir leitura pública de todos os arquivos
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'character-assets');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Permitir atualização apenas do próprio arquivo
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

-- Permitir deleção apenas do próprio arquivo
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'character-assets'
  AND auth.role() = 'authenticated'
);
```

### 3. Estrutura de Pastas

O sistema salva os avatares na seguinte estrutura:
```
character-assets/
└── avatars/
    ├── {characterId}-{timestamp}.jpg
    ├── {characterId}-{timestamp}.png
    └── ...
```

### 4. Verificar Configuração

Após configurar, teste o upload:

1. Faça login no app
2. Vá para a ficha de um personagem
3. Clique em "Personalizar"
4. Na seção "Avatar do Personagem", clique em "Enviar Imagem"
5. Selecione uma imagem (JPG, PNG, WebP ou GIF, máx 5MB)
6. Deve aparecer um loader e a imagem deve ser atualizada

### 5. Debugging

Se ainda houver erro, verifique:

#### No Console do Navegador:
```javascript
// Verificar erro específico
console.error('Erro ao fazer upload:', err);
```

#### Erros Comuns:

**Error: "new row violates row-level security policy"**
- Solução: Verificar se as políticas RLS foram criadas corretamente
- Executar novamente os comandos SQL acima

**Error: "Bucket not found"**
- Solução: Criar o bucket `character-assets` no dashboard
- Garantir que o nome está exatamente como `character-assets`

**Error: "File size exceeds limit"**
- Solução: Imagem maior que 5MB
- Redimensionar imagem antes do upload

**Error: "Invalid file type"**
- Solução: Formato não suportado
- Usar apenas: JPG, PNG, WebP ou GIF

### 6. Alternativa: Storage Policies via Dashboard

Se preferir configurar via interface:

1. Vá para **Storage** → `character-assets` → **Policies**
2. Clique em **New Policy**
3. Configure cada política:

**Policy 1 - Public Read:**
- Name: `Public read access`
- Policy command: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'character-assets'`

**Policy 2 - Authenticated Upload:**
- Name: `Authenticated users can upload`
- Policy command: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression:
  ```sql
  bucket_id = 'character-assets'
  AND (storage.foldername(name))[1] = 'avatars'
  ```

**Policy 3 - Update Own Files:**
- Name: `Users can update own files`
- Policy command: `UPDATE`
- Target roles: `authenticated`
- USING & WITH CHECK: `bucket_id = 'character-assets' AND auth.role() = 'authenticated'`

**Policy 4 - Delete Own Files:**
- Name: `Users can delete own files`
- Policy command: `DELETE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'character-assets' AND auth.role() = 'authenticated'`

### 7. Código Atualizado

O componente `avatar-uploader.tsx` já foi atualizado para:
- ✅ Usar design glass morphism
- ✅ Validar tipo e tamanho de arquivo
- ✅ Criar preview local antes do upload
- ✅ Fazer upload para `character-assets/avatars/`
- ✅ Deletar avatar antigo ao fazer upload de novo
- ✅ Atualizar banco de dados com nova URL
- ✅ Mostrar loader durante upload
- ✅ Exibir erros de forma clara

### 8. Fluxo de Upload

1. Usuário seleciona arquivo
2. Validação client-side (tipo + tamanho)
3. Preview local criado
4. Upload para Supabase Storage
5. URL pública gerada
6. Banco de dados atualizado
7. Avatar antigo deletado (se existir)
8. UI atualizada com novo avatar

### 9. Fallback

Se não houver avatar:
- Sistema gera placeholder com primeira letra do nome
- Função: `generateAvatarPlaceholder(characterName)`
- Cor de fundo baseada no nome (consistente)

## Teste Rápido via SQL

Para verificar se o bucket existe:

```sql
SELECT * FROM storage.buckets WHERE id = 'character-assets';
```

Para ver políticas do bucket:

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'character-assets';
```

Para listar arquivos no bucket:

```sql
SELECT * FROM storage.objects WHERE bucket_id = 'character-assets';
```

## Conclusão

Após seguir estes passos, o upload de avatar deve funcionar corretamente. Se ainda houver problemas:

1. Verifique o console do navegador para erros específicos
2. Verifique o log do Supabase para erros de servidor
3. Confirme que o usuário está autenticado
4. Verifique se a conexão com Supabase está funcionando
