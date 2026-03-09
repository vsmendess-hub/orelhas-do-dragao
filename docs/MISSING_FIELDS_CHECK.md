# 🔍 Verificação de Campos - DEV vs PROD

**Data:** 9 de Março de 2026
**Status:** Auditoria completa

---

## ✅ Campos que Faltavam no DEV

### 1. **Personality & Appearance** (v2.0+)

```sql
ALTER TABLE characters ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT NULL;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT NULL;
```

- **Usado em:** `personality-editor.tsx`, `appearance-editor.tsx`
- **Adicionado em:** Migration `20260307000000_add_personality_appearance.sql`
- **Status:** ✅ Incluído no setup completo

### 2. **Background Data** (v2.0+)

```sql
ALTER TABLE characters ADD COLUMN IF NOT EXISTS background_data JSONB DEFAULT NULL;
```

- **Usado em:** `backstory-editor.tsx`
- **Adicionado em:** Migration `20260307000001_add_background_data.sql`
- **Status:** ✅ Incluído no setup completo

### 3. **Rest System Fields**

```sql
ALTER TABLE characters ADD COLUMN IF NOT EXISTS hit_dice_used INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS spell_slots JSONB DEFAULT '[]'::jsonb;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS class_resources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS death_saves JSONB DEFAULT '{"successes": 0, "failures": 0}'::jsonb;
```

- **Usado em:**
  - `rest-manager.tsx` (todos os 4 campos)
  - `hp-manager.tsx` (hit_dice_used)
  - `spell-slot-tracker.tsx` (spell_slots)
  - `death-saves-manager.tsx` (death_saves)
- **Adicionado em:** Migration `20260309000000_add_rest_system_fields.sql`
- **Status:** ✅ Incluído no setup completo

---

## ✅ Campos do Schema Inicial (Já Existem)

Estes campos fazem parte do schema inicial e devem estar presentes:

```sql
-- Básicos
id, user_id, name, race, subrace, class, archetype, level, alignment

-- Background e Personalidade (texto simples - deprecated)
background, personality_traits, ideals, bonds, flaws

-- Mecânicas
attributes, skills, proficiencies, equipment, spells, features

-- Combate
hit_points, armor_class, speed, initiative, proficiency_bonus, inspiration, experience_points

-- Extras
notes, avatar_url, is_public

-- Timestamps
created_at, updated_at
```

---

## 📋 Checklist de Aplicação

Para garantir que o banco de DEV está completo:

### Passo 1: Aplicar SQL Completo

Execute `COMPLETE_DEV_SETUP.sql` no Supabase Dashboard → SQL Editor

### Passo 2: Verificar Campos

A query de verificação no final do arquivo deve retornar **7 campos**:

1. ✅ appearance
2. ✅ background_data
3. ✅ class_resources
4. ✅ death_saves
5. ✅ hit_dice_used
6. ✅ personality
7. ✅ spell_slots

### Passo 3: Testar Features

Teste estas funcionalidades no DEV:

- [ ] Descanso Curto (Short Rest)
- [ ] Descanso Longo (Long Rest)
- [ ] Spell Slot Tracker
- [ ] Death Saves
- [ ] Editor de Personalidade
- [ ] Editor de Aparência
- [ ] Geração de Background por IA

---

## 🔍 Campos NÃO Encontrados no Código

Estes campos estão no schema mas **não são usados ativamente** no código atual:

- `personality_traits` (TEXT) - Deprecated, use `personality` JSONB
- `ideals` (TEXT) - Deprecated, use `personality` JSONB
- `bonds` (TEXT) - Deprecated, use `personality` JSONB
- `flaws` (TEXT) - Deprecated, use `personality` JSONB
- `notes` (TEXT) - Pode ser usado futuramente

Esses campos foram mantidos por compatibilidade com dados antigos.

---

## 🚨 Erros Conhecidos se Campos Faltarem

### Erro: "Supabase error details: {}"

- **Causa:** Campo não existe no banco
- **Componente:** `hp-manager.tsx`, `rest-manager.tsx`
- **Campo faltando:** Geralmente `hit_dice_used`, `spell_slots`, ou `class_resources`
- **Solução:** Aplicar `COMPLETE_DEV_SETUP.sql`

### Erro: "column does not exist"

- **Causa:** Migration não aplicada
- **Solução:** Verificar qual campo está faltando e aplicar migration correspondente

---

## 📊 Comparação de Versões

| Campo           | Produção | DEV (antes) | DEV (depois) |
| --------------- | -------- | ----------- | ------------ |
| personality     | ✅       | ❌          | ✅           |
| appearance      | ✅       | ❌          | ✅           |
| background_data | ✅       | ✅          | ✅           |
| hit_dice_used   | ✅       | ❌          | ✅           |
| spell_slots     | ✅       | ❌          | ✅           |
| class_resources | ✅       | ❌          | ✅           |
| death_saves     | ✅       | ❌          | ✅           |

---

## ✅ Conclusão

Após aplicar `COMPLETE_DEV_SETUP.sql`, o banco de DEV estará **100% sincronizado** com produção, incluindo todos os campos necessários para:

- ✨ Sistema de descanso (rest system)
- 🎭 Personalidade e aparência
- 📖 Background estruturado por IA
- ⚔️ Death saves
- 🔮 Spell slots
- 💫 Class resources (Ki, Sorcery Points, etc.)

---

**Auditado por:** Claude Opus 4.6
**Próxima verificação:** Após cada nova feature que adicione campos
