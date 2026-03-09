# 🐛 Debug: Condições Não Persistem em Produção

**Problema:** As condições não estão persistindo em produção, mas funcionam em desenvolvimento.

---

## 🔍 Verificações para Fazer

### 1️⃣ Verificar se o Campo Existe no Banco de PROD

Execute no **Supabase Dashboard de PRODUÇÃO → SQL Editor**:

```sql
-- Verificar se a coluna existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'conditions';

-- Se retornar 1 linha, o campo existe ✅
-- Se retornar 0 linhas, o campo NÃO existe ❌
```

**Se não existir:**

```sql
-- Criar o campo
ALTER TABLE characters
ADD COLUMN conditions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX idx_characters_conditions ON characters USING GIN (conditions);
```

---

### 2️⃣ Verificar Permissões RLS

Execute no **Supabase Dashboard de PRODUÇÃO**:

```sql
-- Verificar se usuário pode atualizar o campo conditions
SELECT * FROM pg_policies
WHERE tablename = 'characters'
AND policyname LIKE '%update%';
```

**Se houver políticas restritivas, ajustar:**

```sql
-- Garantir que usuário pode atualizar suas próprias condições
DROP POLICY IF EXISTS "Users can update own characters" ON characters;

CREATE POLICY "Users can update own characters"
ON characters FOR UPDATE
USING (auth.uid() = user_id);
```

---

### 3️⃣ Testar Diretamente no SQL

Execute no **Supabase Dashboard de PRODUÇÃO**:

```sql
-- Pegar ID de um personagem seu
SELECT id, name, conditions
FROM characters
WHERE user_id = auth.uid()
LIMIT 1;

-- Tentar atualizar manualmente
UPDATE characters
SET conditions = '[{"type": "poisoned", "active": true}]'::jsonb
WHERE id = 'SEU-CHARACTER-ID-AQUI';

-- Verificar se salvou
SELECT id, name, conditions
FROM characters
WHERE id = 'SEU-CHARACTER-ID-AQUI';
```

**Se funcionar:** Problema está no código do frontend
**Se não funcionar:** Problema está no banco/permissões

---

### 4️⃣ Verificar Console do Navegador em PROD

1. Abra o app em produção
2. Abra DevTools (F12)
3. Vá na aba **Console**
4. Tente adicionar uma condição
5. Procure por erros:

```javascript
// Possíveis erros:
❌ "column does not exist" → Campo não foi criado
❌ "permission denied" → RLS bloqueando
❌ "null value" → Problema de validação
❌ Erro de CORS → Problema de configuração
```

---

### 5️⃣ Verificar Versão do Código em Produção

**Verificar se o deploy está atualizado:**

1. Acesse **Vercel Dashboard**
2. Vá em **Deployments**
3. Veja qual commit está deployado
4. Certifique-se que é o commit após a migration

**Se não estiver atualizado:**

```bash
# Em produção, fazer redeploy
git checkout production
git merge main  # ou development, dependendo do workflow
git push origin production

# Vercel vai fazer auto-deploy
```

---

### 6️⃣ Verificar Estrutura de Dados

O componente espera este formato:

```typescript
// Estrutura correta
conditions: [
  {
    type: 'poisoned',
    active: true,
    notes: 'Envenenado por aranha',
    appliedAt: '2026-03-09T...',
  },
  {
    type: 'exhaustion',
    active: true,
    level: 2,
  },
];
```

**Teste no Console do navegador (em PROD):**

```javascript
// Abrir um personagem e no console:
const supabase = createClient();
await supabase
  .from('characters')
  .update({
    conditions: [{ type: 'poisoned', active: true }],
  })
  .eq('id', 'SEU-CHARACTER-ID')
  .then((r) => console.log(r));
```

---

### 7️⃣ Comparar Comportamento DEV vs PROD

| Aspecto                  | DEV    | PROD |
| ------------------------ | ------ | ---- |
| Campo existe?            | ✅     | ?    |
| Índice criado?           | ✅     | ?    |
| RLS permite update?      | ✅     | ?    |
| Console.log mostra save? | ✅     | ?    |
| Erro no console?         | ❌     | ?    |
| Versão do código         | Latest | ?    |

---

## 🔧 Soluções Mais Comuns

### Solução 1: Campo Não Foi Criado

```sql
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_characters_conditions
ON characters USING GIN (conditions);
```

### Solução 2: Cache do Navegador

```bash
1. Fazer logout da aplicação
2. Ctrl+Shift+Delete → Limpar cache
3. Fazer login novamente
4. Testar feature
```

### Solução 3: Código Antigo Deployado

```bash
# Verificar branch deployada no Vercel
# Fazer redeploy da versão correta
git push origin production --force-with-lease
```

### Solução 4: RLS Bloqueando

```sql
-- Verificar e corrigir políticas
SELECT * FROM pg_policies WHERE tablename = 'characters';

-- Recriar política se necessário
DROP POLICY "Users can update own characters" ON characters;
CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 📊 Debugging Checklist

Execute este checklist **em PRODUÇÃO**:

- [ ] Campo `conditions` existe no banco
- [ ] Índice GIN criado
- [ ] RLS permite UPDATE para owner
- [ ] Console não mostra erros
- [ ] Network tab mostra request 200 OK
- [ ] Response do Supabase não tem error
- [ ] Fazer refresh mostra dados salvos
- [ ] Outros campos (feats, journal) funcionam
- [ ] Deploy está na versão correta
- [ ] Cache limpo e sessão nova

---

## 🎯 Teste Rápido

Execute este SQL no **Supabase PROD** para teste completo:

```sql
-- 1. Verificar campo
SELECT column_name FROM information_schema.columns
WHERE table_name = 'characters' AND column_name = 'conditions';

-- 2. Pegar um personagem
SELECT id, name, conditions FROM characters
WHERE user_id = auth.uid() LIMIT 1;

-- 3. Testar update (SUBSTITUA o ID)
UPDATE characters
SET conditions = '[{"type":"poisoned","active":true}]'::jsonb
WHERE id = 'seu-char-id-aqui' AND user_id = auth.uid();

-- 4. Verificar se salvou
SELECT conditions FROM characters WHERE id = 'seu-char-id-aqui';
```

**Resultado esperado:**

```json
[{ "type": "poisoned", "active": true }]
```

---

## 💡 Próximos Passos

1. Execute as verificações acima
2. Identifique qual passo falhou
3. Aplique a solução correspondente
4. Me avise o resultado para eu ajustar!

---

**Debug preparado por:** Claude Opus 4.6
**Última atualização:** 9 de Março de 2026
