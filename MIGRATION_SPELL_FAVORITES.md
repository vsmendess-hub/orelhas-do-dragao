# Migração: Adicionar spell_favorites

## ❌ Erro

```
Erro ao atualizar favoritos: {}
```

## ✅ Solução

Executar a migração que adiciona a coluna `spell_favorites` à tabela `characters`.

## Como Aplicar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo: `supabase/migrations/20260310000002_add_spell_favorites.sql`
4. Execute a query

### Opção 2: Via CLI do Supabase

```bash
supabase db push
```

## SQL da Migração

```sql
-- Adicionar coluna spell_favorites à tabela characters
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS spell_favorites JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.spell_favorites IS 'Magias favoritas do personagem. Array de {spellId, spellName, spellLevel}';

-- Atualizar registros existentes que tenham NULL
UPDATE characters
SET spell_favorites = '[]'::jsonb
WHERE spell_favorites IS NULL;
```

## Verificação

Após aplicar a migração, execute:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'spell_favorites';
```

Deve retornar:

```
column_name      | data_type | column_default
spell_favorites  | jsonb     | '[]'::jsonb
```

## Estrutura de Dados

O campo `spell_favorites` é um array JSONB com a seguinte estrutura:

```json
[
  {
    "spellId": "fireball",
    "spellName": "Bola de Fogo",
    "spellLevel": 3
  },
  {
    "spellId": "magic-missile",
    "spellName": "Mísseis Mágicos",
    "spellLevel": 1
  }
]
```

## Funcionalidade

Com essa coluna, os jogadores podem:

- ⭐ Marcar magias como favoritas
- 📋 Ter acesso rápido às magias mais usadas
- 🔍 Filtrar magias por favoritas na aba "Favoritas"
