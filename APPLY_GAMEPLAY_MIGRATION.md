# 🎮 Aplicar Migration de Gameplay Features

**Data:** 9 de Março de 2026
**Versão:** 2.1.0
**Migration:** `20260309000001_add_character_gameplay_fields.sql`

---

## 🎯 O que esta migration adiciona

Esta migration adiciona 5 campos para tornar a ficha mais interativa e persistente:

1. **`feats`** (JSONB) - Talentos do personagem
2. **`companions`** (JSONB) - Companheiros, familiares, montarias
3. **`journal`** (JSONB) - Diário de aventuras
4. **`goals`** (JSONB) - Objetivos e quests
5. **`conditions`** (JSONB) - Condições de combate ativas

---

## ⚠️ IMPORTANTE: Aplicar em AMBOS os ambientes

Esta migration precisa ser aplicada em:

- ✅ **DEV** (desenvolvimento)
- ✅ **PRODUÇÃO** (production)

---

## 📋 Passo a Passo

### 1️⃣ Aplicar no DEV (já feito anteriormente)

Se ainda não aplicou, execute o `COMPLETE_DEV_SETUP.sql` atualizado.

### 2️⃣ Aplicar em PRODUÇÃO

**⚠️ ATENÇÃO:** Esta é uma migration **SEGURA** e **NÃO DESTRUTIVA**:

- ✅ Apenas **adiciona** campos novos
- ✅ Não altera dados existentes
- ✅ Usa `IF NOT EXISTS` para evitar erros
- ✅ Default values não impactam personagens existentes

**Passos:**

1. **Acesse o Supabase Dashboard de PRODUÇÃO**

   ```
   https://supabase.com/dashboard/project/[seu-projeto-prod]
   ```

2. **Vá em SQL Editor**

3. **Cole APENAS o SQL abaixo** (ou use o arquivo da migration):

```sql
-- ========================================
-- MIGRATION: Character Gameplay Fields
-- Adiciona campos para gameplay persistente
-- Data: 2026-03-09 | Versão: 2.1.0
-- ========================================

-- 1. Talentos (Feats)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS feats JSONB DEFAULT '[]'::jsonb;

-- 2. Companheiros (Companions)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS companions JSONB DEFAULT '[]'::jsonb;

-- 3. Diário de Aventura (Journal)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS journal JSONB DEFAULT '[]'::jsonb;

-- 4. Objetivos (Goals)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb;

-- 5. Condições (Conditions)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_characters_feats ON characters USING GIN (feats);
CREATE INDEX IF NOT EXISTS idx_characters_companions ON characters USING GIN (companions);
CREATE INDEX IF NOT EXISTS idx_characters_journal ON characters USING GIN (journal);
CREATE INDEX IF NOT EXISTS idx_characters_goals ON characters USING GIN (goals);
CREATE INDEX IF NOT EXISTS idx_characters_conditions ON characters USING GIN (conditions);

-- Verificação
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('feats', 'companions', 'journal', 'goals', 'conditions')
ORDER BY column_name;
```

4. **Clique em Run** (ou Ctrl/Cmd + Enter)

5. **Verificar Resultado**
   - Deve retornar **5 linhas** na verificação
   - Todas com `data_type = jsonb` e `column_default = '[]'::jsonb`

---

## ✅ Verificação Pós-Migration

### Em DEV

```bash
# Teste cada feature:
1. Criar personagem
2. Adicionar feat → Recarregar → Deve persistir ✅
3. Adicionar companheiro → Recarregar → Deve persistir ✅
4. Escrever no diário → Recarregar → Deve persistir ✅
5. Criar objetivo → Recarregar → Deve persistir ✅
6. Marcar condição → Recarregar → Deve persistir ✅
```

### Em PRODUÇÃO

```bash
# Após aplicar migration:
1. Acessar personagem existente
2. Testar cada feature
3. Verificar que não houve perda de dados
4. Confirmar que novos dados salvam corretamente
```

---

## 🐛 Troubleshooting

### Erro: "column already exists"

**Causa:** Migration já foi aplicada
**Solução:** Ignorar - já está configurado ✅

### Erro: "permission denied"

**Causa:** Sem permissão de ALTER TABLE
**Solução:** Usar service_role key ou owner da tabela

### Feature não salva após migration

**Causa:** Cache do navegador ou sessão antiga
**Solução:**

1. Fazer logout
2. Limpar cache (Ctrl+Shift+Del)
3. Fazer login novamente
4. Testar feature

---

## 📊 Impacto

### Performance

- ✅ Índices GIN adicionados para buscas rápidas
- ✅ JSONB permite queries eficientes
- ✅ Sem impacto em queries existentes

### Dados Existentes

- ✅ Personagens existentes ganham campos vazios `[]`
- ✅ Nenhum dado é perdido
- ✅ Compatível com versão anterior

### Código

- ✅ Componentes já implementados
- ✅ Lógica de save já existe
- ✅ Apenas faltavam os campos no banco

---

## 🎉 Benefícios Após Aplicar

### Para Usuários

- 🎭 **Talentos** agora salvam permanentemente
- 🐺 **Companheiros** não desaparecem mais
- 📖 **Diário** registra aventuras entre sessões
- 🎯 **Objetivos** ficam salvos
- ⚔️ **Condições** persistem em combate

### Para Desenvolvedores

- ✅ Código já estava pronto
- ✅ Apenas precisava dos campos
- ✅ Fácil adicionar mais features

---

## 📅 Cronograma Recomendado

1. **Agora:** Aplicar em DEV (já feito ✅)
2. **Testar:** 15-30 minutos de testes
3. **Produção:** Aplicar quando estiver confortável
4. **Validar:** Testar com usuários reais

---

## 🔄 Rollback (Se Necessário)

**⚠️ NÃO RECOMENDADO**, mas se precisar:

```sql
-- APENAS se absolutamente necessário
ALTER TABLE characters DROP COLUMN IF EXISTS feats;
ALTER TABLE characters DROP COLUMN IF EXISTS companions;
ALTER TABLE characters DROP COLUMN IF EXISTS journal;
ALTER TABLE characters DROP COLUMN IF EXISTS goals;
ALTER TABLE characters DROP COLUMN IF EXISTS conditions;

-- Remover índices
DROP INDEX IF EXISTS idx_characters_feats;
DROP INDEX IF EXISTS idx_characters_companions;
DROP INDEX IF EXISTS idx_characters_journal;
DROP INDEX IF EXISTS idx_characters_goals;
DROP INDEX IF EXISTS idx_characters_conditions;
```

**Nota:** Isso **APAGARÁ** todos os dados dessas features!

---

## ✅ Checklist Final

- [ ] Migration aplicada em DEV
- [ ] Testado em DEV (todas 5 features)
- [ ] Migration aplicada em PRODUÇÃO
- [ ] Testado em PRODUÇÃO
- [ ] Usuários notificados (opcional)
- [ ] Documentação atualizada

---

**Preparado por:** Claude Opus 4.6
**Aprovado para:** Ambientes DEV e PROD
**Risco:** Baixíssimo (apenas adiciona campos)
