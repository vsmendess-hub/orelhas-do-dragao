# 🎯 Migration: Adicionar Campo Optional Features

**Data:** 10 de Março de 2026
**Status:** ⚠️ MIGRATION PENDENTE
**Impacto:** Campo `optional_features` não existe na tabela `characters`

---

## 🎯 Problema

O sistema de Optional Features (Fighting Styles, Eldritch Invocations, etc.) não está salvando porque o campo `optional_features` não existe no banco de dados.

**Erro atual:**

```
Erro ao salvar. Tente novamente.
```

---

## ✅ Solução: Aplicar via Supabase Dashboard (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto **Orelhas do Dragão**
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Cole o SQL abaixo:

```sql
-- Adicionar campo optional_features
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS optional_features JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Comentário
COMMENT ON COLUMN characters.optional_features IS 'Optional class features: Fighting Styles, Eldritch Invocations, Metamagic, etc. Array de {featureId, featureName, category, level}';

-- Atualizar personagens existentes
UPDATE characters
SET optional_features = '[]'::jsonb
WHERE optional_features IS NULL;

-- Verificar sucesso
SELECT
  'optional_features' as campo_adicionado,
  count(*) as total_personagens,
  count(optional_features) as personagens_com_optional_features
FROM characters;
```

6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Verifique que a query de verificação retorna os mesmos valores em ambas colunas

---

## 🔍 Verificação Pós-Migration

Após aplicar a migration, verifique:

1. **No Supabase Dashboard:**
   - Vá em **Table Editor** → **characters**
   - Verifique que a coluna `optional_features` aparece
   - Clique em uma linha e veja o valor default `[]`

2. **No App:**
   - Acesse um personagem (Guerreiro, Bruxo, Feiticeiro, etc.)
   - Vá na seção **Optional Features**
   - Tente adicionar uma feature (ex: Fighting Style para Guerreiro)
   - Verifique que não há erro
   - Recarregue a página e veja se a feature foi salva

---

## 📋 Estrutura do Campo

```typescript
interface CharacterOptionalFeature {
  featureId: string; // ID da feature (ex: 'archery')
  featureName: string; // Nome da feature (ex: 'Archery')
  category: FeatureCategory; // Categoria (ex: 'fighting-style')
  level: number; // Nível em que foi obtido
}

// Valor default:
[]; // Array vazio
```

---

## 🎯 O que são Optional Features?

São características opcionais que certas classes podem escolher:

### ⚔️ **Fighting Styles** (Guerreiro, Paladino, Patrulheiro) - Nível 1+

- Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting, Blind Fighting, Unarmed Fighting

### 🔮 **Eldritch Invocations** (Bruxo) - Nível 2+

- Agonizing Blast, Devil's Sight, Mask of Many Faces, Repelling Blast, etc.

### 🎯 **Battle Maneuvers** (Guerreiro - Battle Master) - Nível 3+

- Disarming Attack, Parry, Riposte, Trip Attack, Menacing Attack

### ✨ **Metamagic** (Feiticeiro) - Nível 3+

- Twinned Spell, Quickened Spell, Subtle Spell, Empowered Spell, etc.

---

## 🚀 Após a Migration

O sistema funcionará normalmente:

✅ Guerreiros poderão escolher Fighting Styles
✅ Bruxos poderão escolher Eldritch Invocations
✅ Feiticeiros poderão escolher Metamagic
✅ Features serão salvas no banco
✅ Features aparecerão na ficha do personagem

---

## ⚠️ IMPORTANTE

**Aplique esta migration antes de usar o sistema de Optional Features!**

Sem ela, o sistema retornará erro ao tentar salvar features opcionais.

---

## 📂 Arquivo de Migration

A migration também está disponível em:
`/supabase/migrations/20260310000001_add_optional_features.sql`
