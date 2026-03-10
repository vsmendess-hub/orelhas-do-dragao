# 🪙 Instruções: Adicionar Campo Currency

**Data:** 10 de Março de 2026
**Status:** ⚠️ MIGRATION PENDENTE
**Impacto:** Campo `currency` não existe na tabela `characters`

---

## 🎯 Problema

O sistema de moedas não está salvando porque o campo `currency` não existe no banco de dados.

**Erro atual:**

```
Erro ao salvar moedas: {}
```

---

## ✅ Solução (Escolha uma opção)

### **Opção 1: Aplicar via Supabase Dashboard (RECOMENDADO)**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto **Orelhas do Dragão**
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Cole o SQL abaixo:

```sql
-- Adicionar campo currency
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS currency JSONB NOT NULL DEFAULT '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb;

-- Comentário
COMMENT ON COLUMN characters.currency IS 'Moedas do personagem: {copper, silver, electrum, gold, platinum}. PHB p.143';

-- Atualizar personagens existentes
UPDATE characters
SET currency = '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb
WHERE currency IS NULL;

-- Verificar sucesso
SELECT
  'currency' as campo_adicionado,
  count(*) as total_personagens,
  count(currency) as personagens_com_currency
FROM characters;
```

6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Verifique que a query de verificação retorna os mesmos valores em ambas colunas

---

### **Opção 2: Aplicar via Arquivo SQL**

Execute o arquivo já preparado:

```bash
# Localize o arquivo
cat MIGRATION_ADD_CURRENCY.sql

# Copie o conteúdo e cole no Supabase SQL Editor
```

---

### **Opção 3: Aplicar via API (Se preferir)**

Acesse a rota de migration:

```bash
# Local (dev)
curl -X POST http://localhost:3000/api/admin/add-currency-field

# Produção
# (Necessário estar logado)
```

**Nota:** Esta opção pode não funcionar se o RPC não estiver habilitado.

---

## 🔍 Verificação Pós-Migration

Após aplicar a migration, verifique:

1. **No Supabase Dashboard:**
   - Vá em **Table Editor** → **characters**
   - Verifique que a coluna `currency` aparece
   - Clique em uma linha e veja o valor default

2. **No App:**
   - Acesse um personagem
   - Vá na aba **Moedas**
   - Tente alterar qualquer moeda
   - Verifique que não há erro no console
   - Recarregue a página e veja se o valor foi salvo

---

## 📋 Estrutura do Campo

```typescript
interface Currency {
  copper: number;    // Peças de Cobre (pc)
  silver: number;    // Peças de Prata (pp)
  electrum: number;  // Peças de Electrum (pe)
  gold: number;      // Peças de Ouro (po)
  platinum: number;  // Peças de Platina (pl)
}

// Valor default:
{
  "copper": 0,
  "silver": 0,
  "electrum": 0,
  "gold": 0,
  "platinum": 0
}
```

---

## 🚀 Após a Migration

O sistema funcionará normalmente:

✅ Moedas serão salvas no banco
✅ Peso das moedas será calculado (50 moedas = 1 lb)
✅ Capacidade de carga incluirá equipamento + moedas
✅ Sincronização em tempo real entre tabs

---

## 📚 Referência

**PHB p.143** - Equipamento e moedas
**PHB p.176** - Capacidade de carga

**Migration criada em:**

- `/supabase/migrations/20260310000000_add_currency_field.sql`
- `/MIGRATION_ADD_CURRENCY.sql` (manual)

---

## ⚠️ IMPORTANTE

**Aplique esta migration antes de usar o sistema de moedas!**

Sem ela, o sistema retornará erro ao tentar salvar moedas.
